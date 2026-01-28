'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockProjects } from '@/lib/mock-data';
import { Search, MapPin, Users, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNeed, setSelectedNeed] = useState<string | null>(null);

  const needs = ['Capital', 'Expertise', 'Network', 'Leadership'];

  const filteredProjects = mockProjects.filter((proj) => {
    const matchesSearch = proj.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNeed = !selectedNeed || proj.supporterRequests.some((r) => r.type === selectedNeed.toLowerCase());
    return matchesSearch && matchesNeed;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Supporter Marketplace</h1>
        <p className="text-muted-foreground">Browse impact projects and pledge your support.</p>
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
          <div className="flex gap-2">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <Card key={project.id} className="border-border bg-card hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Card Header */}
                  <div className="p-6 pb-4">
                    <div className="flex gap-2 mb-3">
                      <Badge className="bg-primary/10 text-primary border-0">
                        {project.stage === 'incubation' && 'Incubation'}
                        {project.stage === 'chapter-pilot' && 'Pilot'}
                        {project.stage === 'scale' && 'Scaling'}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border" />

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Beneficiaries</p>
                        <p className="text-foreground font-bold">{project.impactData.beneficiaries || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="text-foreground font-bold">${(project.budget / 1000).toFixed(0)}K</p>
                      </div>
                    </div>

                    {/* Needs */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Seeks Support For:</p>
                      <div className="flex flex-wrap gap-2">
                        {project.supporterRequests.slice(0, 3).map((req) => (
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
                        ))}
                      </div>
                    </div>

                    {/* RAG Status */}
                    {project.impactData.ragStatus && (
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            project.impactData.ragStatus === 'green'
                              ? 'bg-emerald-500'
                              : project.impactData.ragStatus === 'amber'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                        />
                        <span className="text-xs text-muted-foreground capitalize">
                          Status: {project.impactData.ragStatus}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border" />

                  {/* Footer */}
                  <div className="p-6 pt-4 flex gap-2">
                    <Button className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                      View Project
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="border-border text-foreground hover:bg-secondary bg-transparent"
                    >
                      Pledge Support
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No projects found matching your filters</p>
              </div>
            )}
          </div>
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
  );
}
