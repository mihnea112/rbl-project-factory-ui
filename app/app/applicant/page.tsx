'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';

type DbApplication = {
  id: string;
  applicant_id: string;
  stream: string;
  status: string | null;
  created_at: string;
  form_data: any;
  ai_result?: any;
};

function getTitle(app: DbApplication) {
  // Prefer explicit fields; fall back to form_data.title
  return app?.form_data?.title || app?.form_data?.project_title || 'Untitled application';
}

function getDescription(app: DbApplication) {
  return app?.form_data?.description || app?.form_data?.project_description || '';
}

function formatDate(dateIso?: string) {
  if (!dateIso) return '';
  const d = new Date(dateIso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString();
}

export default function ApplicantDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apps, setApps] = useState<DbApplication[]>([]);

  const statusConfig: Record<
    string,
    { icon: any; label: string; badgeClass: string }
  > = {
    draft: {
      icon: FileText,
      label: 'Draft',
      badgeClass: 'bg-muted text-foreground border border-border',
    },
    submitted: {
      icon: Clock,
      label: 'Submitted',
      badgeClass: 'bg-secondary/20 text-foreground border border-border',
    },
    'in-review': {
      icon: Clock,
      label: 'In review',
      badgeClass: 'bg-secondary/20 text-foreground border border-border',
    },
    eligible: {
      icon: CheckCircle,
      label: 'AI eligible',
      badgeClass: 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/25',
    },
    'needs-revision': {
      icon: AlertCircle,
      label: 'Needs revision',
      badgeClass: 'bg-amber-500/15 text-amber-200 border border-amber-500/25',
    },
    'out-of-scope': {
      icon: AlertCircle,
      label: 'Out of scope',
      badgeClass: 'bg-red-500/15 text-red-200 border border-red-500/25',
    },
  };

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anon) {
      setError('Missing Supabase env variables.');
      setLoading(false);
      return;
    }

    const supabase = createBrowserClient(url, anon);

    (async () => {
      setLoading(true);
      setError(null);

      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userRes?.user) {
        // If not logged in, send to login and preserve destination.
        window.location.href = '/login?next=/app/applicant';
        return;
      }

      // Pull from `applications` for this user.
      // This assumes your table is `public.applications` with columns:
      // id, applicant_id, stream, status, created_at, form_data, ai_result (optional)
      const { data, error: qErr } = await supabase
        .from('applications')
        .select('id, applicant_id, stream, status, created_at, form_data, ai_result')
        .eq('applicant_id', userRes.user.id)
        .order('created_at', { ascending: false });

      if (qErr) {
        setError(qErr.message);
        setApps([]);
        setLoading(false);
        return;
      }

      setApps((data as any[]) as DbApplication[]);
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    const total = apps.length;

    // Treat these as “in review” unless your DB uses a different status naming.
    const inReviewStatuses = new Set(['submitted', 'in-review', 'review', 'pending']);

    const inReview = apps.filter((a) => inReviewStatuses.has((a.status || '').toLowerCase())).length;
    const accepted = apps.filter((a) => (a.status || '').toLowerCase() === 'eligible').length;

    return { total, inReview, accepted };
  }, [apps]);

  const userApplications = apps;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">My Applications</h1>
        <p className="text-muted-foreground">Track and manage your project applications.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-border bg-card">
          <p className="text-sm text-muted-foreground mb-2">Total Applications</p>
          <p className="text-3xl font-bold text-foreground">{loading ? '—' : stats.total}</p>
        </Card>
        <Card className="p-6 border-border bg-card">
          <p className="text-sm text-muted-foreground mb-2">In Review</p>
          <p className="text-3xl font-bold text-primary">{loading ? '—' : stats.inReview}</p>
        </Card>
        <Card className="p-6 border-border bg-card">
          <p className="text-sm text-muted-foreground mb-2">Accepted</p>
          <p className="text-3xl font-bold text-accent">{loading ? '—' : stats.accepted}</p>
        </Card>
      </div>

      {/* Applications List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Your Applications</h2>
          <Link href="/apply">
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              New Application
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <Card className="p-8 border-border bg-card">
            <p className="text-muted-foreground">Loading applications…</p>
          </Card>
        ) : error ? (
          <Card className="p-8 border-border bg-card">
            <p className="text-destructive font-medium mb-2">Could not load applications</p>
            <p className="text-muted-foreground text-sm">{error}</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {userApplications.length > 0 ? (
              userApplications.map((app) => {
                const rawStatus = (app.status || 'draft').toLowerCase();
                const config = statusConfig[rawStatus] || statusConfig.draft;
                const StatusIcon = config.icon;

                const title = getTitle(app);
                const description = getDescription(app);

                return (
                  <Card key={app.id} className="p-6 border-border bg-card hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4 gap-4">
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-foreground truncate">{title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">Stream {app.stream}</p>
                      </div>

                      <Badge variant="outline" className={`shrink-0 ${config.badgeClass}`}>
                        <span className="flex items-center gap-2">
                          <StatusIcon className="w-4 h-4" />
                          {config.label}
                        </span>
                      </Badge>
                    </div>

                    {description ? (
                      <p className="text-foreground mb-4 line-clamp-3">{description}</p>
                    ) : (
                      <p className="text-muted-foreground mb-4 italic">No description provided.</p>
                    )}

                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs text-muted-foreground">
                        Submitted on {formatDate(app.created_at)}
                      </p>

                      <div className="flex gap-3">
                        <Link href={`/apply?applicationId=${app.id}`}>
                          <Button
                            variant="outline"
                            className="border-border text-foreground hover:bg-secondary bg-transparent"
                          >
                            View Details
                          </Button>
                        </Link>

                        {rawStatus === 'needs-revision' && (
                          <Link href={`/apply?applicationId=${app.id}&mode=edit`}>
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                              Edit & Resubmit
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <Card className="p-12 text-center border-border bg-card">
                <p className="text-muted-foreground mb-4">You haven't submitted any applications yet.</p>
                <Link href="/apply">
                  <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                    Start Your First Application
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Timeline Section */}
      <Card className="p-6 border-border bg-card">
        <h3 className="font-semibold text-foreground mb-4">Application Review Timeline</h3>
        <div className="space-y-3 text-sm">
          <div className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">AI Screening: 1–2 weeks</p>
              <p className="text-muted-foreground">Automated triage of your application</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Committee Review: 2–3 weeks</p>
              <p className="text-muted-foreground">In-depth evaluation by RBL team</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Final Decision: ~1 week</p>
              <p className="text-muted-foreground">Notification and next steps</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
