'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Users, ArrowRight, CheckCircle } from 'lucide-react';

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNeed, setSelectedNeed] = useState<string | null>(null);

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const needs = ['Capital', 'Expertise', 'Network', 'Leadership'];

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        // IMPORTANT: use server API (service role) to bypass RLS for supporter marketplace
        const res = await fetch('/api/marketplace/projects', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          throw new Error(txt || `Failed to load projects (${res.status})`);
        }

        const json = await res.json().catch(() => ({}));
        setProjects(Array.isArray(json?.projects) ? json.projects : []);
      } catch (e: any) {
        setError(e?.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredProjects = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();

    return (projects ?? []).filter((row) => {
      const fd = row?.form_data ?? {};
      const title = String(fd?.title ?? '').toLowerCase();

      const matchesSearch = !s || title.includes(s);

      const supporterNeeds: string[] = Array.isArray(fd?.supporterNeeds)
        ? fd.supporterNeeds
        : Array.isArray(fd?.supporter_needs)
          ? fd.supporter_needs
          : [];

      const normalizedNeeds = supporterNeeds.map((n) => String(n).toLowerCase());
      const matchesNeed = !selectedNeed || normalizedNeeds.includes(selectedNeed.toLowerCase());

      return matchesSearch && matchesNeed;
    });
  }, [projects, searchTerm, selectedNeed]);

  function stageLabelFromStatus(status: any) {
    const s = String(status ?? '').toLowerCase();
    if (s.includes('incub')) return 'Incubation';
    if (s.includes('pilot')) return 'Pilot';
    if (s.includes('scale')) return 'Scaling';
    if (s.includes('approved') || s.includes('accepted') || s.includes('active')) return 'Active';
    if (s.includes('submitted')) return 'Submitted';
    return '—';
  }

  function getImpact(row: any) {
    return row?.ai_result ?? row?.aiResult ?? row?.impact_data ?? {};
  }

  function getBeneficiaries(row: any) {
    const impact = getImpact(row);
    return impact?.beneficiaries ?? impact?.beneficiary_count ?? impact?.beneficiariesCount ?? '—';
  }

  function getBudget(row: any) {
    const fd = row?.form_data ?? {};
    const raw = fd?.budget ?? fd?.requestedBudget ?? fd?.requested_budget ?? fd?.seedBudget ?? fd?.seed_budget ?? null;
    const n = typeof raw === 'number' ? raw : raw ? Number(raw) : NaN;
    return Number.isFinite(n) ? `$${(n / 1000).toFixed(0)}K` : '—';
  }

  function getSupporterRequests(row: any) {
    const fd = row?.form_data ?? {};
    const arr: string[] = Array.isArray(fd?.supporterNeeds)
      ? fd.supporterNeeds
      : Array.isArray(fd?.supporter_needs)
        ? fd.supporter_needs
        : [];

    return arr.map((x) => ({
      id: `${row.id}-${String(x)}`,
      type: String(x).toLowerCase(),
    }));
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Supporter Marketplace</h1>
        <p className="text-muted-foreground">Browse impact projects and pledge your support.</p>
        <p className="text-xs text-muted-foreground mt-2">
          {loading
            ? 'Loading from DB…'
            : error
              ? `Error: ${error}`
              : `Loaded ${projects.length} applications • Showing ${filteredProjects.length} after filters`}
        </p>
      </div>

      {/* Onboarding Banner */}
      <Card className="p-6 bg-primary/10 border-primary/20 border-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Complete Your Supporter Profile</h3>
            <p className="text-sm text-foreground mb-3">Tell us about your contributions and interests to get better project matches.</p>
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              Update Profile
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Profile Completion</p>
            <p className="text-2xl font-bold text-primary">40%</p>
          </div>
        </div>
      </Card>

      {/* Search & Filters */}
      <Card className="p-4 border-border bg-card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input border-border"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {needs.map((need) => (
              <Button
                key={need}
                onClick={() => setSelectedNeed(selectedNeed === need ? null : need)}
                variant={selectedNeed === need ? 'default' : 'outline'}
                className={`border-border ${
                  selectedNeed === need
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                {need}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="bg-card border-b border-border">
          <TabsTrigger value="browse">Browse Opportunities</TabsTrigger>
          <TabsTrigger value="pledges">My Pledges</TabsTrigger>
          <TabsTrigger value="commitments">My Commitments</TabsTrigger>
        </TabsList>

        {/* Browse Tab */}
        <TabsContent value="browse" className="mt-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading projects…</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((row) => {
                  const fd = row?.form_data ?? {};
                  const title = fd?.title ?? 'Untitled project';
                  const description = fd?.description ?? '—';
                  const stage = stageLabelFromStatus(row?.status);

                  const supporterRequests = getSupporterRequests(row);
                  const impact = getImpact(row);
                  const ragStatus = impact?.rag_status ?? impact?.ragStatus ?? impact?.ragStatus?.toLowerCase?.();

                  return (
                    <Card key={row.id} className="border-border bg-card hover:shadow-lg transition-shadow overflow-hidden">
                      {/* Card Header */}
                      <div className="p-6 pb-4">
                        <div className="flex gap-2 mb-3 flex-wrap">
                          <Badge className="bg-primary/10 text-primary border-0">{stage}</Badge>
                          <Badge variant="outline" className="border-border">
                            {String(row?.stream ?? '—')}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-border" />

                      {/* Card Body */}
                      <div className="p-6 space-y-4">
                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Beneficiaries</p>
                            <p className="text-foreground font-bold">{getBeneficiaries(row)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Budget</p>
                            <p className="text-foreground font-bold">{getBudget(row)}</p>
                          </div>
                        </div>

                        {/* Needs */}
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Seeks Support For:</p>
                          <div className="flex flex-wrap gap-2">
                            {supporterRequests.length ? (
                              supporterRequests.slice(0, 4).map((req: any) => (
                                <Badge
                                  key={req.id}
                                  variant="outline"
                                  className={`border-border capitalize ${
                                    !selectedNeed || req.type === selectedNeed.toLowerCase()
                                      ? 'bg-primary/5 border-primary'
                                      : ''
                                  }`}
                                >
                                  {req.type}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </div>
                        </div>

                        {/* RAG Status */}
                        {ragStatus ? (
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                ragStatus === 'green'
                                  ? 'bg-emerald-500'
                                  : ragStatus === 'amber' || ragStatus === 'yellow'
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                              }`}
                            />
                            <span className="text-xs text-muted-foreground capitalize">Status: {String(ragStatus)}</span>
                          </div>
                        ) : null}
                      </div>

                      {/* Divider */}
                      <div className="border-t border-border" />

                      {/* Footer */}
                      <div className="p-6 pt-4 flex gap-2">
                        <Link className="flex-1" href={`/apply?applicationId=${encodeURIComponent(row.id)}`}>
                          <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                            View Project
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="border-border text-foreground hover:bg-secondary bg-transparent"
                        >
                          Pledge Support
                        </Button>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No projects found matching your filters.</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    If you expect projects but see 0, the most common cause is RLS on <span className="font-semibold">applications</span> allowing only the applicant to read their own rows.
                    In that case, the supporter marketplace needs a server API (service-role) or a dedicated “public projects” view.
                  </p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Pledges Tab */}
        <TabsContent value="pledges" className="mt-6">
          <Card className="p-12 text-center border-dashed border-border bg-card">
            <div className="mb-4">
              <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Active Pledges</h3>
            <p className="text-muted-foreground mb-6">Start supporting impact projects by pledging your capital, expertise, network, or leadership.</p>
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              Browse Projects
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>
        </TabsContent>

        {/* Commitments Tab */}
        <TabsContent value="commitments" className="mt-6">
          <Card className="p-12 text-center border-dashed border-border bg-card">
            <div className="mb-4">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Active Commitments</h3>
            <p className="text-muted-foreground">Your pledged commitments will appear here as projects accept your support.</p>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
