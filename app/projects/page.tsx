'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockProjects } from '@/lib/mock-data';
import { Users, TrendingUp, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Active Projects</h1>
          <p className="text-muted-foreground">Browse impact projects seeking support across Romania.</p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <Link key={project.id} href={`/app/projects/${project.id}`}>
              <Card className="p-6 border-border bg-card hover:shadow-lg hover:border-primary/20 transition-all cursor-pointer h-full flex flex-col">
                {/* Header */}
                <div className="mb-4">
                  <div className="flex gap-2 mb-3">
                    <Badge className="bg-primary/10 text-primary border-0">
                      {project.stage === 'incubation' && 'Incubation'}
                      {project.stage === 'chapter-pilot' && 'Pilot'}
                      {project.stage === 'scale' && 'Scaling'}
                    </Badge>
                    <Badge variant="outline" className="border-border">
                      {project.status}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{project.title}</h3>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 flex-grow">{project.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Beneficiaries</p>
                    <p className="text-lg font-bold text-foreground">
                      {project.impactData.beneficiaries || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Budget</p>
                    <p className="text-lg font-bold text-foreground">${(project.budget / 1000).toFixed(0)}K</p>
                  </div>
                </div>

                {/* RAG Status */}
                {project.impactData.ragStatus && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <div className="flex gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          project.impactData.ragStatus === 'green'
                            ? 'bg-emerald-500'
                            : project.impactData.ragStatus === 'amber'
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                        }`}
                      />
                      <span className="text-sm font-medium text-foreground capitalize">
                        {project.impactData.ragStatus}
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>

        {mockProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No active projects at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
