'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockProjects } from '@/lib/mock-data';
import { BarChart3, Download, TrendingUp, Users, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function PortfolioPage() {
  // Calculate portfolio stats
  const stats = {
    totalProjects: mockProjects.length,
    projectsByStage: mockProjects.reduce(
      (acc, p) => {
        acc[p.stage] = (acc[p.stage] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
    totalBeneficiaries: mockProjects.reduce((sum, p) => sum + (p.impactData.beneficiaries || 0), 0),
    totalBudget: mockProjects.reduce((sum, p) => sum + p.budget, 0),
    avgScore: Math.round((85 + 80 + 75 + 85 + 88) / 5), // Mock scores
  };

  const stageData = Object.entries(stats.projectsByStage).map(([stage, count]) => ({
    name: stage.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    value: count,
  }));

  const ragData = [
    { name: 'Green', value: 3, color: '#10b981' },
    { name: 'Amber', value: 1, color: '#f59e0b' },
    { name: 'Red', value: 0, color: '#ef4444' },
  ];

  const stageColors: Record<string, string> = {
    incubation: '#3b82f6',
    'chapter-pilot': '#a855f7',
    scale: '#10b981',
    institutionalize: '#06b6d4',
    exit: '#6b7280',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Portfolio Dashboard</h1>
          <p className="text-muted-foreground">High-level overview of all funded projects and impact metrics.</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-6 border-border bg-card">
          <p className="text-xs text-muted-foreground mb-2">Total Projects</p>
          <p className="text-3xl font-bold text-foreground">{stats.totalProjects}</p>
        </Card>
        <Card className="p-6 border-border bg-card">
          <p className="text-xs text-muted-foreground mb-2">Total Budget Deployed</p>
          <p className="text-2xl font-bold text-primary">${(stats.totalBudget / 1000).toFixed(0)}K</p>
        </Card>
        <Card className="p-6 border-border bg-card">
          <p className="text-xs text-muted-foreground mb-2">Total Beneficiaries</p>
          <p className="text-3xl font-bold text-emerald-600">{stats.totalBeneficiaries}</p>
        </Card>
        <Card className="p-6 border-border bg-card">
          <p className="text-xs text-muted-foreground mb-2">Avg Project Score</p>
          <p className="text-3xl font-bold text-primary">{stats.avgScore}/100</p>
        </Card>
        <Card className="p-6 border-border bg-card">
          <p className="text-xs text-muted-foreground mb-2">Success Rate</p>
          <p className="text-3xl font-bold text-teal-600">75%</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-card border-b border-border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stages">By Stage</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
          <TabsTrigger value="chapters">By Chapter</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stage Distribution */}
            <Card className="p-6 border-border bg-card">
              <h2 className="text-lg font-semibold text-foreground mb-4">Projects by Stage</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#22c55e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* RAG Status */}
            <Card className="p-6 border-border bg-card">
              <h2 className="text-lg font-semibold text-foreground mb-4">Overall Status Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ragData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {ragData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                {ragData.map((item) => (
                  <div key={item.name} className="text-center">
                    <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }} />
                    <p className="text-xs text-muted-foreground">{item.name}: {item.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Stages Tab */}
        <TabsContent value="stages" className="space-y-6 mt-6">
          <div className="space-y-4">
            {mockProjects.map((project) => (
              <Card key={project.id} className="p-4 border-border bg-white hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                      <Badge className="bg-primary/10 text-primary border-0">
                        {project.stage.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </Badge>
                      <Badge variant="outline" className="border-border">
                        {project.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-foreground">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm text-muted-foreground mb-1">Budget</p>
                    <p className="text-lg font-bold text-primary">${(project.budget / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Impact Tab */}
        <TabsContent value="impact" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockProjects.map((project) => (
              <Card key={project.id} className="p-6 border-border bg-white">
                <h3 className="font-semibold text-foreground mb-4">{project.title}</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Beneficiaries</p>
                    <p className="text-2xl font-bold text-foreground">{project.impactData.beneficiaries || 0}</p>
                  </div>
                  {project.impactData.costPerOutcome && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Cost per Outcome</p>
                      <p className="text-lg font-bold text-primary">${project.impactData.costPerOutcome}</p>
                    </div>
                  )}
                  {project.impactData.satisfaction && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Satisfaction</p>
                      <p className="text-lg font-bold text-emerald-600">{project.impactData.satisfaction}%</p>
                    </div>
                  )}
                  {project.impactData.ragStatus && (
                    <div className="flex items-center gap-2 pt-2 border-t border-border">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          project.impactData.ragStatus === 'green'
                            ? 'bg-emerald-500'
                            : project.impactData.ragStatus === 'amber'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                      />
                      <span className="text-sm font-medium text-foreground capitalize">
                        {project.impactData.ragStatus}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Chapters Tab */}
        <TabsContent value="chapters" className="space-y-6 mt-6">
          <Card className="overflow-x-auto border-border bg-white">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Chapter</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Region</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Projects</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Capacity</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Bucharest Metro', region: 'Bucharest', projects: 2, capacity: 8, available: true },
                  { name: 'Cluj-Napoca Hub', region: 'Cluj-Napoca', projects: 1, capacity: 6, available: true },
                  { name: 'Transylvania Regional', region: 'Transylvania', projects: 1, capacity: 5, available: false },
                  { name: 'Moldavia Network', region: 'Moldavia', projects: 0, capacity: 4, available: true },
                ].map((chapter) => (
                  <tr key={chapter.name} className="border-b border-border hover:bg-secondary/50">
                    <td className="px-6 py-4 text-foreground font-medium">{chapter.name}</td>
                    <td className="px-6 py-4 text-foreground">{chapter.region}</td>
                    <td className="px-6 py-4 text-foreground">{chapter.projects}</td>
                    <td className="px-6 py-4 text-foreground">{chapter.capacity}</td>
                    <td className="px-6 py-4">
                      <Badge className={chapter.available ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'}>
                        {chapter.available ? 'Available' : 'At Capacity'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
