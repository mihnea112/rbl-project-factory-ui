'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, XCircle, ArrowRight, Loader2, RefreshCcw } from 'lucide-react';

interface TriageResultPageProps {
  applicationId: string;
  onClose?: () => void;
}

type TriageStatus = 'eligible' | 'needs-revision' | 'out-of-scope';

type TriageScores = {
  feasibility: number;
  scalability: number;
  innovation: number;
  alignment: number;
};

type TriageResult = {
  applicationId: string;
  status: TriageStatus;
  suggestedStream: 'A' | 'B';
  scores?: TriageScores;
  reasoning: string[];
  missingInfo: string[];
  summary?: string;
  createdAt?: string;
};

type DbApplicationRow = {
  id: string;
  ai_result: any | null;
};

function normalizeTriage(applicationId: string, raw: any): TriageResult {
  // Defensive normalization for whatever is stored in ai_result
  const status = (raw?.status || 'needs-revision') as TriageStatus;
  const suggestedStream = (raw?.suggestedStream || raw?.suggested_stream || 'B') as 'A' | 'B';

  const reasoning = Array.isArray(raw?.reasoning) ? raw.reasoning : [];
  const missingInfo = Array.isArray(raw?.missingInfo)
    ? raw.missingInfo
    : Array.isArray(raw?.missing_info)
      ? raw.missing_info
      : [];

  const scores = raw?.scores &&
    typeof raw.scores === 'object' &&
    ['feasibility', 'scalability', 'innovation', 'alignment'].every((k) => k in raw.scores)
      ? (raw.scores as TriageScores)
      : undefined;

  return {
    applicationId,
    status,
    suggestedStream,
    scores,
    reasoning,
    missingInfo,
    summary: raw?.summary,
    createdAt: raw?.createdAt || raw?.created_at,
  };
}

export default function TriageResultPage({ applicationId = 'app-001', onClose }: TriageResultPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [triage, setTriage] = useState<TriageResult | null>(null);
  const [source, setSource] = useState<'db' | 'api' | null>(null);

  const statusConfig = useMemo(
    () => ({
      eligible: {
        icon: CheckCircle,
        color: 'text-emerald-400',
        bgColor: 'bg-card',
        borderColor: 'border-emerald-500/35',
        label: 'Eligible',
        description: 'Your application meets the baseline criteria and will proceed to reviewer evaluation.',
      },
      'needs-revision': {
        icon: AlertCircle,
        color: 'text-amber-400',
        bgColor: 'bg-card',
        borderColor: 'border-amber-500/35',
        label: 'Needs Revision',
        description: 'Please address the identified gaps and resubmit for reassessment.',
      },
      'out-of-scope': {
        icon: XCircle,
        color: 'text-red-400',
        bgColor: 'bg-card',
        borderColor: 'border-red-500/35',
        label: 'Out of Scope',
        description: 'This application does not align with our current focus areas.',
      },
    }),
    []
  );

  async function loadExistingFromDb(): Promise<TriageResult | null> {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) return null;

    const supabase = createBrowserClient(url, anon);

    // If RLS is enabled, this will only work when user is logged in.
    // If user isn't logged in, we just fall back to the API.
    const { data: u } = await supabase.auth.getUser();
    if (!u?.user) return null;

    const { data, error: qErr } = await supabase
      .from('applications')
      .select('id, ai_result')
      .eq('id', applicationId)
      .single();

    if (qErr || !data) return null;

    const row = data as DbApplicationRow;
    if (!row.ai_result) return null;

    return normalizeTriage(applicationId, row.ai_result);
  }

  async function runTriageViaApi(): Promise<TriageResult> {
    const res = await fetch('/api/triage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || `Triage request failed (${res.status})`);
    }

    const data = (await res.json()) as any;
    return normalizeTriage(applicationId, data);
  }

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      setTriage(null);
      setSource(null);

      try {
        // 1) Try to load existing saved analysis (ai_result)
        const existing = await loadExistingFromDb();
        if (existing && !cancelled) {
          setTriage(existing);
          setSource('db');
          return;
        }

        // 2) Otherwise, run the AI triage and save it via API
        const computed = await runTriageViaApi();
        if (!cancelled) {
          setTriage(computed);
          setSource('api');
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to run AI triage.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [applicationId]);

  const config = triage ? statusConfig[triage.status] : statusConfig['needs-revision'];
  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">AI Triage Assessment</h1>

          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-slate-light bg-transparent gap-2"
            onClick={async () => {
              // Explicit re-run via API
              setLoading(true);
              setError(null);
              try {
                const computed = await runTriageViaApi();
                setTriage(computed);
                setSource('api');
              } catch (e: any) {
                setError(e?.message || 'Failed to run AI triage.');
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            <RefreshCcw className="w-4 h-4" />
            Re-run analysis
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Loading / Error */}
        {loading && (
          <Card className="p-8 border-border bg-card mb-8">
            <div className="flex items-center gap-3 text-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <p className="font-medium">
                {source === 'db' ? 'Loading saved analysis…' : 'Analyzing your application…'}
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {source === 'db'
                ? 'We are loading the saved AI result from the database.'
                : 'We will first try to load a saved AI result. If none exists, the system will run triage and save it.'}
            </p>
          </Card>
        )}

        {!loading && error && (
          <Card className="p-8 border border-border bg-card mb-8">
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-destructive mt-0.5" />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">Triage failed</h2>
                <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{error}</p>
                <div className="flex gap-3 mt-4">
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => {
                      window.location.reload();
                    }}
                  >
                    Retry
                  </Button>
                  <Link href="/">
                    <Button variant="outline" className="border-border text-foreground hover:bg-slate-light bg-transparent">
                      Return to Home
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        )}

        {!loading && !error && triage && (
          <>
            {/* Status Card */}
            <Card className={`p-8 border-2 ${config.borderColor} ${config.bgColor} mb-8 shadow-sm`}>
              <div className="flex items-start gap-4">
                <StatusIcon className={`w-8 h-8 ${config.color} flex-shrink-0 mt-1`} />
                <div className="flex-grow">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <Badge
                      className={`mb-3 ${
                        triage.status === 'eligible'
                          ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/25'
                          : triage.status === 'needs-revision'
                            ? 'bg-amber-500/15 text-amber-200 border border-amber-500/25'
                            : 'bg-red-500/15 text-red-200 border border-red-500/25'
                      }`}
                      variant="outline"
                    >
                      {config.label}
                    </Badge>

                    {source ? (
                      <span className="text-xs text-muted-foreground mb-3">
                        Source: {source === 'db' ? 'Saved result' : 'Fresh run'}
                      </span>
                    ) : null}
                  </div>

                  <h2 className="text-2xl font-bold text-foreground mb-2">Assessment Complete</h2>
                  <p className="text-foreground">{config.description}</p>
                  {triage.summary ? <p className="text-sm text-foreground mt-3">{triage.summary}</p> : null}
                  {triage.createdAt ? (
                    <p className="text-xs text-muted-foreground mt-2">
                      Generated: {new Date(triage.createdAt).toLocaleString()}
                    </p>
                  ) : null}
                </div>
              </div>
            </Card>

            {/* Suggested Stream */}
            <Card className="p-6 border-border bg-card mb-8">
              <h3 className="font-semibold text-foreground mb-4 text-lg">Recommended Stream</h3>
              <div className="flex items-start gap-4">
                <div className="flex-grow">
                  <p className="text-sm text-muted-foreground mb-1">Based on your application, we recommend:</p>
                  <p className="text-2xl font-bold text-primary mb-3">
                    Stream {triage.suggestedStream === 'A' ? 'A - RBL Upgrade 2.0' : 'B - Open Innovation'}
                  </p>
                  <p className="text-foreground">
                    {triage.suggestedStream === 'A'
                      ? 'Your project shows mature traction and a scaling pathway. Stream A focuses on acceleration and expansion.'
                      : 'Your project shows innovation potential and learning opportunity. Stream B is designed for hypothesis-driven development.'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Scores (optional) */}
            {triage.scores && (
              <Card className="p-6 border-border bg-card mb-8">
                <h3 className="font-semibold text-foreground mb-6 text-lg">Assessment Breakdown (AI-derived)</h3>
                <div className="space-y-6">
                  {[
                    { label: 'Feasibility', score: triage.scores.feasibility, max: 40 },
                    { label: 'Scalability', score: triage.scores.scalability, max: 30 },
                    { label: 'Innovation', score: triage.scores.innovation, max: 20 },
                    { label: 'Strategic Alignment', score: triage.scores.alignment, max: 10 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-2">
                        <p className="text-foreground font-medium">{item.label}</p>
                        <p className="text-foreground font-bold">
                          {item.score}/{item.max}
                        </p>
                      </div>
                      <Progress value={(item.score / item.max) * 100} className="h-2" />
                    </div>
                  ))}
                  <div className="border-t border-border pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <p className="text-foreground font-semibold">Total</p>
                      <p className="text-2xl font-bold text-primary">
                        {triage.scores.feasibility + triage.scores.scalability + triage.scores.innovation + triage.scores.alignment}/100
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Assessment Reasoning */}
            <Card className="p-6 border-border bg-card mb-8">
              <h3 className="font-semibold text-foreground mb-4 text-lg">Assessment Reasoning</h3>
              <ul className="space-y-3">
                {(triage.reasoning ?? []).map((reason, idx) => (
                  <li key={idx} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{reason}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Missing Information */}
            {triage.missingInfo?.length > 0 && (
              <Card className="p-6 border-2 border-amber-500/35 bg-card mb-8">
                <h3 className="font-semibold text-foreground mb-4 text-lg">Information to Address</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {triage.status === 'needs-revision'
                    ? 'To improve your application, please address the following:'
                    : 'For future reference, these areas could strengthen your application:'}
                </p>
                <ul className="space-y-2">
                  {triage.missingInfo.map((item, idx) => (
                    <li key={idx} className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Next Steps */}
            <Card className="p-6 border-border bg-card mb-12">
              <h3 className="font-semibold text-foreground mb-4 text-lg">What Happens Next?</h3>
              <div className="space-y-4">
                {triage.status === 'eligible' ? (
                  <>
                    <p className="text-foreground">
                      Your application will be reviewed by our committee. You will receive feedback and next steps via email.
                    </p>
                    <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-2">
                      <p className="text-sm font-semibold text-foreground">Committee Review Timeline:</p>
                      <ul className="text-sm text-foreground space-y-1">
                        <li>✓ Initial screening: 3-5 business days</li>
                        <li>✓ Detailed review: 1-2 weeks</li>
                        <li>✓ Final decision: By end of month</li>
                      </ul>
                    </div>
                  </>
                ) : triage.status === 'needs-revision' ? (
                  <p className="text-foreground">Please address the identified gaps and resubmit your application. We’ll reassess quickly.</p>
                ) : (
                  <p className="text-foreground">
                    While your application doesn't currently align with our focus, consider reapplying with a clearer fit to our mandate.
                  </p>
                )}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center flex-wrap">
              {triage.status === 'needs-revision' && (
                <Link href={`/apply?applicationId=${encodeURIComponent(applicationId)}&mode=edit`}>
                  <Button className="bg-primary hover:bg-primary/90 gap-2">
                    Edit & Resubmit <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}

              {triage.status === 'eligible' && (
                <Link href="/app/applicant">
                  <Button className="bg-primary hover:bg-primary/90 gap-2">
                    View Application Status <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}

              <Link href="/">
                <Button variant="outline" className="border-border text-foreground hover:bg-slate-light bg-transparent">
                  Return to Home
                </Button>
              </Link>

              {onClose ? (
                <Button
                  variant="outline"
                  className="border-border text-foreground hover:bg-slate-light bg-transparent"
                  onClick={onClose}
                >
                  Close
                </Button>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
