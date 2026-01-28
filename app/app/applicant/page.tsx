'use client';

import React from "react"
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockApplications } from '@/lib/mock-data';
import { ArrowRight, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ApplicantDashboard() {
  const userApplications = mockApplications.slice(0, 2); // Demo: show first 2 apps

  const statusConfig: Record<string, { icon: React.ComponentType<any>; label: string; color: string }> = {
    draft: { icon: FileText, label: 'Draft', color: 'bg-slate-100 text-slate-800' },
    submitted: { icon: Clock, label: 'Submitted', color: 'bg-blue-100 text-blue-800' },
    'ai-eligible': { icon: CheckCircle, label: 'AI Eligible', color: 'bg-emerald-100 text-emerald-800' },
    'ai-revision': { icon: AlertCircle, label: 'Needs Revision', color: 'bg-yellow-100 text-yellow-800' },
  };

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
          <p className="text-3xl font-bold text-foreground">2</p>
        </Card>
        <Card className="p-6 border-border bg-card">
          <p className="text-sm text-muted-foreground mb-2">In Review</p>
          <p className="text-3xl font-bold text-primary">1</p>
        </Card>
        <Card className="p-6 border-border bg-card">
          <p className="text-sm text-muted-foreground mb-2">Accepted</p>
          <p className="text-3xl font-bold text-accent">1</p>
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

        <div className="space-y-4">
          {userApplications.length > 0 ? (
            userApplications.map((app) => {
              const config = statusConfig[app.status] || statusConfig.draft;
              const StatusIcon = config.icon;

              return (
                <Card key={app.id} className="p-6 border-border bg-card hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{app.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Stream {app.stream}</p>
                    </div>
                    <Badge className={config.color}>
                      {config.label}
                    </Badge>
                  </div>

                  <p className="text-foreground mb-4">{app.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 py-4 border-t border-b border-border">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total Score</p>
                      <p className="text-xl font-bold text-primary">{app.totalScore}/100</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Feasibility</p>
                      <p className="text-lg font-bold text-foreground">{app.scores.feasibility}/40</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Scalability</p>
                      <p className="text-lg font-bold text-foreground">{app.scores.scalability}/30</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Innovation</p>
                      <p className="text-lg font-bold text-foreground">{app.scores.innovation}/20</p>
                    </div>
                  </div>

                  {app.submittedAt && (
                    <p className="text-xs text-muted-foreground mb-4">
                      Submitted on {app.submittedAt.toLocaleDateString()}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <Button variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent">
                      View Details
                    </Button>
                    {app.status === 'ai-revision' && (
                      <Link href="/apply">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          Edit & Resubmit
                        </Button>
                      </Link>
                    )}
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
      </div>

      {/* Timeline Section */}
      <Card className="p-6 border-border bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-4">Application Review Timeline</h3>
        <div className="space-y-3 text-sm">
          <div className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-900">AI Screening: 1-2 weeks</p>
              <p className="text-blue-800">Automated assessment of your application</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-900">Committee Review: 2-3 weeks</p>
              <p className="text-blue-800">In-depth evaluation by RBL team</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-900">Final Decision: 1 week</p>
              <p className="text-blue-800">Notification and next steps</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
