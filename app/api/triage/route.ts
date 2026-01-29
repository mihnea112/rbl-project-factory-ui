import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

// Env required:
// NEXT_PUBLIC_SUPABASE_URL=
// NEXT_PUBLIC_SUPABASE_ANON_KEY=
// SUPABASE_SERVICE_ROLE_KEY=
// GROQ_API_KEY=

type TriageStatus = 'eligible' | 'needs-revision' | 'out-of-scope';

type TriagePayload = {
  status: TriageStatus;
  suggestedStream: 'A' | 'B';
  scores?: { feasibility: number; scalability: number; innovation: number; alignment: number };
  reasoning: string[];
  missingInfo: string[];
  summary?: string;
};

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

function asArrayStrings(v: any): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  return [String(v)].filter(Boolean);
}

function clampInt(n: any, min: number, max: number, fallback = min) {
  const x = Number(n);
  if (!Number.isFinite(x)) return fallback;
  return Math.max(min, Math.min(max, Math.round(x)));
}

function normalizeTriage(parsed: any): TriagePayload | null {
  const status = parsed?.status as TriageStatus | undefined;
  const suggestedStream = parsed?.suggestedStream as 'A' | 'B' | undefined;
  if (!status || !['eligible', 'needs-revision', 'out-of-scope'].includes(status)) return null;
  if (!suggestedStream || !['A', 'B'].includes(suggestedStream)) return null;

  const scoresRaw = parsed?.scores;
  const scores = scoresRaw
    ? {
        feasibility: clampInt(scoresRaw.feasibility, 0, 40, 0),
        scalability: clampInt(scoresRaw.scalability, 0, 30, 0),
        innovation: clampInt(scoresRaw.innovation, 0, 20, 0),
        alignment: clampInt(scoresRaw.alignment, 0, 10, 0),
      }
    : undefined;

  return {
    status,
    suggestedStream,
    scores,
    reasoning: asArrayStrings(parsed?.reasoning).slice(0, 30),
    missingInfo: asArrayStrings(parsed?.missingInfo).slice(0, 30),
    summary: parsed?.summary ? String(parsed.summary).slice(0, 1200) : undefined,
  };
}

export async function POST(req: Request) {
  // 1) Authenticated user (from cookies)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnon) {
    return NextResponse.json(
      { error: 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in env' },
      { status: 500 }
    );
  }

  const cookieStore = await cookies();
  const userClient = createServerClient(supabaseUrl, supabaseAnon, {
    cookies: {
      getAll() {
        return cookieStore.getAll().map((c: any) => ({ name: c.name, value: c.value }));
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options as any);
          });
        } catch {
          // ignore
        }
      },
    },
  });

  const { data: authData, error: authErr } = await userClient.auth.getUser();
  if (authErr || !authData?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = authData.user;

  // 2) Service role client (bypass RLS for DB reads/writes)
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json(
      { error: 'Missing SUPABASE_SERVICE_ROLE_KEY in env' },
      { status: 500 }
    );
  }
  const admin: any = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 3) Input
  const body = await req.json().catch(() => null);
  const applicationId = body?.applicationId as string | undefined;
  if (!applicationId) {
    return NextResponse.json({ error: 'Missing applicationId' }, { status: 400 });
  }
  if (!isUuid(applicationId)) {
    return NextResponse.json(
      { error: 'applicationId must be a UUID from the applications table. Save the application first and use its id.' },
      { status: 400 }
    );
  }

  // 4) Load application from current DB structure
  const appRes = await admin
    .from('applications')
    .select('id, applicant_id, stream, status, form_data, ai_result, reviewer_notes, created_at')
    .eq('id', applicationId)
    .maybeSingle();

  if (!appRes.data) {
    return NextResponse.json({ error: 'Application not found. Make sure you save the application first.' }, { status: 404 });
  }

  const application = appRes.data;

  // Ownership check: only the applicant can triage their own application
  if (application.applicant_id && String(application.applicant_id) !== String(user.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 5) If ai_result already exists, return it
  // We support two shapes:
  // - ai_result = { triage: {..}, meta: {...}, raw: {...} }
  // - ai_result = {..triageFields..}
  const existingAi = application.ai_result;
  const existingTriage = existingAi?.triage ? normalizeTriage(existingAi.triage) : normalizeTriage(existingAi);
  if (existingTriage) {
    return NextResponse.json({
      applicationId,
      status: existingTriage.status,
      suggestedStream: existingTriage.suggestedStream,
      scores: existingTriage.scores ?? undefined,
      reasoning: existingTriage.reasoning ?? [],
      missingInfo: existingTriage.missingInfo ?? [],
      summary: existingTriage.summary ?? undefined,
      createdAt: existingAi?.meta?.generated_at || application.created_at,
    });
  }

  // 6) Call free AI API (Groq)
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return NextResponse.json({ error: 'Missing GROQ_API_KEY in env' }, { status: 500 });
  }

  const system = `
You are RBL Project Factory AI Triage.
Your job: produce a structured triage assessment from the application data.

Return ONLY valid JSON with this schema:
{
  "status": "eligible" | "needs-revision" | "out-of-scope",
  "suggestedStream": "A" | "B",
  "scores": { "feasibility": 0-40, "scalability": 0-30, "innovation": 0-20, "alignment": 0-10 },
  "reasoning": string[] (5-10 bullets),
  "missingInfo": string[] (0-10 items),
  "summary": string (1-3 sentences)
}

Rules:
- Base the decision only on the provided data. No invented facts.
- If missing critical info, prefer "needs-revision" and list missingInfo.
- Keep reasoning concrete and actionable.
`.trim();

  const userPrompt = `
APPLICATION_ID: ${applicationId}
STREAM: ${application.stream ?? 'unknown'}

FORM_DATA (JSON):
${JSON.stringify(application.form_data ?? {}, null, 2)}
`.trim();

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!groqRes.ok) {
    const t = await groqRes.text().catch(() => '');
    return NextResponse.json({ error: `Groq error ${groqRes.status}: ${t}` }, { status: 502 });
  }

  const groqJson = await groqRes.json();
  const content = groqJson?.choices?.[0]?.message?.content ?? '';
  const parsed = safeJsonParse(content);
  const triage = normalizeTriage(parsed);

  if (!triage) {
    return NextResponse.json(
      { error: 'AI returned invalid JSON output', raw: content },
      { status: 502 }
    );
  }

  // 7) Save triage result INTO applications.ai_result (current DB structure)
  const generatedAt = new Date().toISOString();
  const ai_result = {
    triage,
    meta: {
      provider: 'groq',
      model: 'llama-3.3-70b-versatile',
      generated_at: generatedAt,
    },
    raw: groqJson,
  };

  const saveRes = await admin
    .from('applications')
    .update({ ai_result })
    .eq('id', applicationId)
    .select('id, ai_result, created_at')
    .single();

  if (saveRes.error || !saveRes.data) {
    return NextResponse.json({ error: `DB save failed: ${saveRes.error?.message}` }, { status: 500 });
  }

  return NextResponse.json({
    applicationId,
    status: triage.status,
    suggestedStream: triage.suggestedStream,
    scores: triage.scores ?? undefined,
    reasoning: triage.reasoning ?? [],
    missingInfo: triage.missingInfo ?? [],
    summary: triage.summary ?? undefined,
    createdAt: generatedAt,
  });
}