'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { mockProjects, mockApplications, chapters } from '@/lib/mock-data';
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

interface ProjectPageProps {
  params: { id: string };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = mockProjects.find((p) => p.id === params.id) || mockProjects[0];
  const application = mockApplications.find((a) => a.id === project.applicationId);

  const stageColors: Record<string, string> = {
    incubation: 'bg-blue-100 text-blue-800',
    'chapter-pilot': 'bg-purple-100 text-purple-800',
    scale: 'bg-green-100 text-green-800',
    institutionalize: 'bg-teal-100 text-teal-800',
    exit: 'bg-slate-100 text-slate-800',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex gap-2 mb-3">
            <Badge className={stageColors[project.stage]}>
              {project.stage.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </Badge>
            <Badge variant="outline" className="border-border">
              {project.status}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{project.title}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground mb-1">Team Lead</p>
          <p className="text-foreground font-semibold">{project.teamLead}</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground mb-1">Budget</p>
          <p className="text-lg font-bold text-primary">${(project.budget / 1000).toFixed(0)}K</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground mb-1">Beneficiaries</p>
          <p className="text-lg font-bold text-foreground">{project.impactData.beneficiaries || '—'}</p>
        </Card>
        <Card className="p-4 border-border bg-card">
          <p className="text-xs text-muted-foreground mb-1">Next Review</p>
          <p className="text-foreground font-semibold">
            {project.nextReviewDate?.toLocaleDateString() || '—'}
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
                <p className="text-foreground">{application?.title || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Target Outcome</p>
                <p className="text-foreground">{project.targetOutcome}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Start Date</p>
                <p className="text-foreground">{project.startDate.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Current Stage</p>
                <p className="text-foreground capitalize">{project.stage}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border bg-card">
            <h2 className="text-lg font-semibold text-foreground mb-4">Project Strategy</h2>
            <p className="text-foreground mb-4">{project.description}</p>
            <div className="bg-secondary/30 p-4 rounded-lg">
              <p className="text-sm text-foreground">
                <strong>Key Success Metric:</strong> {project.targetOutcome}
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
            {project.milestones.map((milestone) => (
              <Card key={milestone.id} className="p-6 border-border bg-white">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{milestone.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                  </div>
                  <Badge
                    variant={
                      milestone.status === 'completed' ? 'default' : milestone.status === 'blocked' ? 'destructive' : 'secondary'
                    }
                  >
                    {milestone.status.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </Badge>
                </div>

                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-muted-foreground">Due Date</p>
                    <p className="text-foreground font-medium">{milestone.dueDate.toLocaleDateString()}</p>
                  </div>
                  {milestone.owner && (
                    <div>
                      <p className="text-muted-foreground">Owner</p>
                      <p className="text-foreground font-medium">{milestone.owner}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
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
            {project.chapters && project.chapters.length > 0 ? (
              project.chapters.map((ch) => (
                <Card key={ch.id} className="p-6 border-border bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground flex gap-2 items-center">
                        <MapPin className="w-4 h-4 text-primary" />
                        {ch.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{ch.region}</p>
                    </div>
                    <Badge className={ch.available ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}>
                      {ch.available ? 'Available' : 'At Capacity'}
                    </Badge>
                  </div>

                  {ch.pilotStart && (
                    <p className="text-sm text-foreground">
                      <strong>Pilot Start:</strong> {ch.pilotStart.toLocaleDateString()}
                    </p>
                  )}
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center border-border bg-white">
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
              {[
                { tranche: 'Incubation', amount: 25000, status: 'released' },
                { tranche: 'Pilot', amount: 75000, status: 'approved' },
                { tranche: 'Scale', amount: 50000, status: 'locked' },
              ].map((fund) => (
                <Card key={fund.tranche} className="p-6 border-border bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{fund.tranche} Phase</h3>
                      <p className="text-lg font-bold text-primary mt-1">${(fund.amount / 1000).toFixed(0)}K</p>
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
                      {fund.status.charAt(0).toUpperCase() + fund.status.slice(1)}
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
            {project.supporterRequests.map((request) => (
              <Card key={request.id} className="p-6 border-border bg-white">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex gap-2 mb-2">
                      <Badge className="bg-blue-100 text-blue-800 border-0 capitalize">
                        {request.type}
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
                        {request.status}
                      </Badge>
                    </div>
                    <p className="font-semibold text-foreground">{request.description}</p>
                  </div>
                </div>

                {request.amount && (
                  <div className="mb-3 flex gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground">Requested Amount</p>
                      <p className="text-foreground font-bold">${(request.amount / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                )}

                {request.status === 'open' && (
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Browse Supporters</Button>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Impact Tab */}
        <TabsContent value="impact" className="space-y-6 mt-6">
          <h2 className="text-lg font-semibold text-foreground">Impact Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Total Beneficiaries</p>
              <p className="text-3xl font-bold text-primary">{project.impactData.beneficiaries || 0}</p>
            </Card>
            <Card className="p-6 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Cost per Outcome</p>
              <p className="text-3xl font-bold text-foreground">
                ${project.impactData.costPerOutcome?.toFixed(0) || '—'}
              </p>
            </Card>
            <Card className="p-6 border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Satisfaction</p>
              <p className="text-3xl font-bold text-emerald-600">{project.impactData.satisfaction || '—'}%</p>
            </Card>
          </div>

          {/* Outcomes */}
          <Card className="p-6 border-border bg-card">
            <h3 className="font-semibold text-foreground mb-4">Outcomes</h3>
            <div className="space-y-4">
              {project.impactData.outcomes.map((outcome, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <p className="text-foreground font-medium">{outcome.metric}</p>
                    <p className="text-foreground font-bold">
                      {outcome.current}/{outcome.target} {outcome.unit}
                    </p>
                  </div>
                  <Progress value={(outcome.current / outcome.target) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </Card>

          {/* RAG Status */}
          {project.impactData.ragStatus && (
            <Card
              className={`p-6 border-2 ${
                project.impactData.ragStatus === 'green'
                  ? 'border-emerald-200 bg-emerald-50'
                  : project.impactData.ragStatus === 'amber'
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-red-200 bg-red-50'
              }`}
            >
              <p className="font-semibold mb-2">
                Overall Status:{' '}
                <span
                  className={
                    project.impactData.ragStatus === 'green'
                      ? 'text-emerald-600'
                      : project.impactData.ragStatus === 'amber'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  }
                >
                  {project.impactData.ragStatus.toUpperCase()}
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

          <Card className="p-8 text-center border-border border-dashed bg-white">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" />
            <p className="text-muted-foreground mb-4">No updates submitted yet</p>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Submit Quarterly Update</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
