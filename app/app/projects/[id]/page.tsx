'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  MapPin,
  Users,
  Target,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  BarChart3,
  Network,
} from 'lucide-react';

import { createBrowserClient } from '@supabase/ssr';

interface ProjectPageProps {
  params: { id: string };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<any | null>(null);
  const [application, setApplication] = useState<any | null>(null);

  const stageColors: Record<string, string> = {
    incubation: 'bg-blue-100 text-blue-800',
    'chapter-pilot': 'bg-purple-100 text-purple-800',
    scale: 'bg-green-100 text-green-800',
    institutionalize: 'bg-teal-100 text-teal-800',
    exit: 'bg-slate-100 text-slate-800',
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

      // Make sure user is logged in (RLS-safe)
      const { data: u, error: uErr } = await supabase.auth.getUser();
      if (uErr || !u?.user) {
        setError('Not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      // 1) Load project
      // Use select('*') so it works with your current DB structure even if columns differ slightly.
      const { data: p, error: pErr } = await supabase
        .from('projects')
        .select('*')
        .eq('id', params.id)
        .single();

      if (pErr || !p) {
        setError(pErr?.message || 'Project not found');
        setLoading(false);
        return;
      }

      setProject(p);

      // 2) Load linked application (if present)
      const applicationId = (p as any).application_id ?? (p as any).applicationId;
      if (applicationId) {
        const { data: a, error: aErr } = await supabase
          .from('applications')
          .select('*')
          .eq('id', applicationId)
          .single();

        if (!aErr && a) setApplication(a);
      }

      setLoading(false);
    })();
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-6">
        <Card className="p-6 border-border bg-card">
          <p className="text-sm text-muted-foreground">Loading project…</p>
        </Card>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-6">
        <Card className="p-6 border-border bg-card">
          <h1 className="text-xl font-bold text-foreground mb-2">Could not load project</h1>
          <p className="text-sm text-muted-foreground">{error || 'Unknown error'}</p>
          <div className="mt-4">
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-secondary bg-transparent"
              onClick={() => window.history.back()}
            >
              Go back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ---- Field mapping (supports both snake_case and camelCase) ----
  const title = (project as any).title ?? (project as any).name ?? 'Untitled Project';
  const description = (project as any).description ?? (project as any).summary ?? '';
  const status = (project as any).status ?? '—';
  const stageRaw = (project as any).stage ?? (project as any).lifecycle_stage ?? 'incubation';
  const stage = String(stageRaw);

  const teamLead = (project as any).team_lead ?? (project as any).teamLead ?? (project as any).owner_name ?? '—';
  const budget = Number((project as any).budget ?? (project as any).budget_eur ?? 0);
  const targetOutcome = (project as any).target_outcome ?? (project as any).targetOutcome ?? '—';

  const startDateVal = (project as any).start_date ?? (project as any).startDate;
  const startDate = startDateVal ? new Date(startDateVal) : null;

  const nextReviewVal = (project as any).next_review_date ?? (project as any).nextReviewDate;
  const nextReviewDate = nextReviewVal ? new Date(nextReviewVal) : null;

  const impactData = (project as any).impact_data ?? (project as any).impactData ?? {
    beneficiaries: null,
    costPerOutcome: null,
    satisfaction: null,
    outcomes: [],
    ragStatus: null,
  };

  const milestones = (project as any).milestones ?? [];
  const chapters = (project as any).chapters ?? [];
  const supporterRequests = (project as any).supporter_requests ?? (project as any).supporterRequests ?? [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex gap-2 mb-3">
            <Badge className={stageColors[stage] ?? 'bg-slate-100 text-slate-800'}>
              {stage
                .split('-')
                .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ')}
            </Badge>
            <Badge variant="outline" className="border-border">
              {status}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground mb-1">Team Lead</p>
          <p className="text-foreground font-semibold">{teamLead}</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground mb-1">Budget</p>
          <p className="text-lg font-bold text-primary">
            {budget ? `€${(budget / 1000).toFixed(0)}K` : '—'}
          </p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground mb-1">Beneficiaries</p>
          <p className="text-lg font-bold text-foreground">
            {impactData?.beneficiaries ?? '—'}
          </p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground mb-1">Next Review</p>
          <p className="text-foreground font-semibold">
            {nextReviewDate ? nextReviewDate.toLocaleDateString() : '—'}
          </p>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-card border-b border-border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="chapters">Chapters</TabsTrigger>
          <TabsTrigger value="funding">Funding</TabsTrigger>
          <TabsTrigger value="supporters">Supporters</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card className="p-6 border-border bg-card">
            <h2 className="text-lg font-semibold text-foreground mb-4">Project Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Application</p>
                <p className="text-foreground">{application?.title ?? application?.name ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Target Outcome</p>
                <p className="text-foreground">{targetOutcome}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Start Date</p>
                <p className="text-foreground">{startDate ? startDate.toLocaleDateString() : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Current Stage</p>
                <p className="text-foreground capitalize">{stage}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border bg-card">
            <h2 className="text-lg font-semibold text-foreground mb-4">Project Strategy</h2>
            <p className="text-foreground mb-4">{description}</p>
            <div className="bg-secondary/30 p-4 rounded-lg">
              <p className="text-sm text-foreground">
                <strong>Key Success Metric:</strong> {targetOutcome}
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* Milestones Tab */}
        <TabsContent value="milestones" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">Milestones</h2>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Add Milestone</Button>
          </div>

          <div className="space-y-4">
            {Array.isArray(milestones) && milestones.length > 0 ? (
              milestones.map((milestone: any) => {
                const mStatus = String(milestone.status ?? 'in-progress');
                const dueVal = milestone.due_date ?? milestone.dueDate;
                const dueDate = dueVal ? new Date(dueVal) : null;

                return (
                  <Card key={milestone.id ?? milestone.title} className="p-6 border-border bg-card">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{milestone.title ?? 'Untitled milestone'}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{milestone.description ?? ''}</p>
                      </div>
                      <Badge
                        variant={
                          mStatus === 'completed'
                            ? 'default'
                            : mStatus === 'blocked'
                              ? 'destructive'
                              : 'secondary'
                        }
                      >
                        {mStatus
                          .split('-')
                          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(' ')}
                      </Badge>
                    </div>

                    <div className="flex gap-6 text-sm">
                      <div>
                        <p className="text-muted-foreground">Due Date</p>
                        <p className="text-foreground font-medium">
                          {dueDate ? dueDate.toLocaleDateString() : '—'}
                        </p>
                      </div>
                      {(milestone.owner ?? milestone.owner_name) && (
                        <div>
                          <p className="text-muted-foreground">Owner</p>
                          <p className="text-foreground font-medium">
                            {milestone.owner ?? milestone.owner_name}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })
            ) : (
              <Card className="p-8 text-center border-border bg-card">
                <p className="text-muted-foreground">No milestones yet</p>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Chapters Tab */}
        <TabsContent value="chapters" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">Pilot Chapters</h2>
            <Button variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent">
              Select Chapter
            </Button>
          </div>

          <div className="space-y-4">
            {Array.isArray(chapters) && chapters.length > 0 ? (
              chapters.map((ch: any) => {
                const available = Boolean(ch.available ?? ch.is_available ?? true);
                const pilotStartVal = ch.pilot_start ?? ch.pilotStart;
                const pilotStart = pilotStartVal ? new Date(pilotStartVal) : null;

                return (
                  <Card key={ch.id ?? ch.name} className="p-6 border-border bg-card">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground flex gap-2 items-center">
                          <MapPin className="w-4 h-4 text-primary" />
                          {ch.name ?? 'Unnamed chapter'}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{ch.region ?? ''}</p>
                      </div>
                      <Badge className={available ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}>
                        {available ? 'Available' : 'At Capacity'}
                      </Badge>
                    </div>

                    {pilotStart && (
                      <p className="text-sm text-foreground">
                        <strong>Pilot Start:</strong> {pilotStart.toLocaleDateString()}
                      </p>
                    )}
                  </Card>
                );
              })
            ) : (
              <Card className="p-8 text-center border-border bg-card">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" />
                <p className="text-muted-foreground mb-4">No chapters selected yet</p>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Choose a Pilot Chapter</Button>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Funding Tab */}
        <TabsContent value="funding" className="space-y-6 mt-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Funding Tranches</h2>
            <div className="space-y-4">
              {(
                (project as any).funding_tranches ??
                (project as any).fundingTranches ??
                [
                  { tranche: 'Incubation', amount: 25000, status: 'released' },
                  { tranche: 'Pilot', amount: 75000, status: 'approved' },
                  { tranche: 'Scale', amount: 50000, status: 'locked' },
                ]
              ).map((fund: any) => (
                <Card key={fund.tranche} className="p-6 border-border bg-card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{fund.tranche} Phase</h3>
                      <p className="text-lg font-bold text-primary mt-1">€{(Number(fund.amount ?? 0) / 1000).toFixed(0)}K</p>
                    </div>
                    <Badge
                      className={
                        fund.status === 'released'
                          ? 'bg-emerald-100 text-emerald-800'
                          : fund.status === 'approved'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {String(fund.status ?? '').charAt(0).toUpperCase() + String(fund.status ?? '').slice(1)}
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-2">Conditions Checklist</p>
                    <div className="space-y-2">
                      <div className="flex gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-foreground">Baseline metrics established</span>
                      </div>
                      <div className="flex gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-foreground">Team onboarded</span>
                      </div>
                      <div className="flex gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        <span className="text-foreground">Monthly reporting setup pending</span>
                      </div>
                    </div>
                  </div>

                  {fund.status === 'locked' && (
                    <Button variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent">
                      Request Release
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Supporters Tab */}
        <TabsContent value="supporters" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">Supporter Requests</h2>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">New Request</Button>
          </div>

          <div className="space-y-4">
            {Array.isArray(supporterRequests) && supporterRequests.length > 0 ? (
              supporterRequests.map((request: any) => (
                <Card key={request.id ?? request.description} className="p-6 border-border bg-card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex gap-2 mb-2">
                        <Badge className="bg-blue-100 text-blue-800 border-0 capitalize">
                          {request.type ?? 'request'}
                        </Badge>
                        <Badge
                          variant={
                            request.status === 'fulfilled'
                              ? 'default'
                              : request.status === 'pending'
                                ? 'secondary'
                                : 'outline'
                          }
                          className="border-border"
                        >
                          {request.status ?? '—'}
                        </Badge>
                      </div>
                      <p className="font-semibold text-foreground">{request.description ?? ''}</p>
                    </div>
                  </div>

                  {request.amount && (
                    <div className="mb-3 flex gap-6">
                      <div>
                        <p className="text-xs text-muted-foreground">Requested Amount</p>
                        <p className="text-foreground font-bold">€{(Number(request.amount) / 1000).toFixed(0)}K</p>
                      </div>
                    </div>
                  )}

                  {request.status === 'open' && (
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Browse Supporters</Button>
                  )}
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center border-border bg-card">
                <p className="text-muted-foreground">No supporter requests yet</p>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Impact Tab */}
        <TabsContent value="impact" className="space-y-6 mt-6">
          <h2 className="text-lg font-semibold text-foreground">Impact Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Total Beneficiaries</p>
              <p className="text-3xl font-bold text-primary">{impactData?.beneficiaries ?? 0}</p>
            </Card>
            <Card className="p-6 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Cost per Outcome</p>
              <p className="text-3xl font-bold text-foreground">
                {impactData?.costPerOutcome != null ? `€${Number(impactData.costPerOutcome).toFixed(0)}` : '—'}
              </p>
            </Card>
            <Card className="p-6 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Satisfaction</p>
              <p className="text-3xl font-bold text-emerald-600">
                {impactData?.satisfaction != null ? `${impactData.satisfaction}%` : '—'}
              </p>
            </Card>
          </div>

          {/* Outcomes */}
          <Card className="p-6 border-border bg-card">
            <h3 className="font-semibold text-foreground mb-4">Outcomes</h3>
            <div className="space-y-4">
              {Array.isArray(impactData?.outcomes) && impactData.outcomes.length > 0 ? (
                impactData.outcomes.map((outcome: any, idx: number) => {
                  const current = Number(outcome.current ?? 0);
                  const target = Number(outcome.target ?? 0);
                  const pct = target > 0 ? (current / target) * 100 : 0;

                  return (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <p className="text-foreground font-medium">{outcome.metric ?? 'Metric'}</p>
                        <p className="text-foreground font-bold">
                          {current}/{target} {outcome.unit ?? ''}
                        </p>
                      </div>
                      <Progress value={pct} className="h-2" />
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">No outcomes tracked yet.</p>
              )}
            </div>
          </Card>

          {/* RAG Status */}
          {impactData?.ragStatus && (
            <Card
              className={`p-6 border-2 ${
                impactData.ragStatus === 'green'
                  ? 'border-emerald-200 bg-emerald-50'
                  : impactData.ragStatus === 'amber'
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-red-200 bg-red-50'
              }`}
            >
              <p className="font-semibold mb-2">
                Overall Status:{' '}
                <span
                  className={
                    impactData.ragStatus === 'green'
                      ? 'text-emerald-600'
                      : impactData.ragStatus === 'amber'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  }
                >
                  {String(impactData.ragStatus).toUpperCase()}
                </span>
              </p>
              <p className="text-sm opacity-75">Project is tracking towards targets</p>
            </Card>
          )}
        </TabsContent>

        {/* Updates Tab */}
        <TabsContent value="updates" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">Project Updates</h2>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Submit Update</Button>
          </div>

          <Card className="p-8 text-center border-border border-dashed bg-card">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" />
            <p className="text-muted-foreground mb-4">No updates submitted yet</p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Submit Quarterly Update</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
