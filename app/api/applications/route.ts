import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !anonKey || !serviceKey) {
    return NextResponse.json(
      { error: 'Missing env: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY' },
      { status: 500 }
    );
  }

  // Read authenticated user from cookies
  const cookieStore = await cookies();
  const userClient = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll().map((c: any) => ({ name: c.name, value: c.value }));
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options as any);
          });
        } catch {}
      },
    },
  });

  const { data: authData, error: authErr } = await userClient.auth.getUser();
  if (authErr || !authData?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });

  const stream = body.stream as string | undefined;
  const form_data = body.form_data ?? body;

  if (!stream) {
    return NextResponse.json({ error: 'Missing stream' }, { status: 400 });
  }

  // Service role insert into public.applications (works with RLS on)
  const admin: any = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const insertRes = await admin
    .from('applications')
    .insert({
      applicant_id: authData.user.id,
      stream,
      form_data,
      // status: omit -> let DB default handle it
    })
    .select('id')
    .single();

  if (insertRes.error) {
    return NextResponse.json({ error: insertRes.error.message }, { status: 500 });
  }

  return NextResponse.json({ id: insertRes.data.id });
}