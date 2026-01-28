'use client';

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { DropdownMenuContent } from "@/components/ui/dropdown-menu"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { DropdownMenu } from "@/components/ui/dropdown-menu"

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { mockApplications, pipelineStatuses } from '@/lib/mock-data';
import {
  Search,
  Eye,
  CheckCircle,
  AlertCircle,
  Zap,
  TrendingUp,
  Filter,
} from 'lucide-react';

export default function ReviewerConsolePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const filteredApps = mockApplications.filter((app) => {
    const matchesSearch = app.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || app.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleRowSelection = (appId: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(appId)) {
      newSelection.delete(appId);
    } else {
      newSelection.add(appId);
    }
    setSelectedRows(newSelection);
  };

  const statusBadgeColor: Record<string, string> = {
    'draft': 'bg-slate-100 text-slate-800',
    'submitted': 'bg-blue-100 text-blue-800',
    'ai-eligible': 'bg-emerald-100 text-emerald-800',
    'ai-revision': 'bg-yellow-100 text-yellow-800',
    'shortlisted': 'bg-purple-100 text-purple-800',
    'accepted': 'bg-green-100 text-green-800',
    'in-pilot': 'bg-cyan-100 text-cyan-800',
    'scaling': 'bg-teal-100 text-teal-800',
    'stopped': 'bg-red-100 text-red-800',
    'rejected': 'bg-red-100 text-red-800',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Reviewer Console</h1>
        <p className="text-muted-foreground">Manage applications and make funding decisions.</p>
      </div>

      {/* Pipeline Overview */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Pipeline Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {pipelineStatuses.map((status) => (
            <Card
              key={status.label}
              onClick={() => setSelectedStatus(selectedStatus === status.label ? null : status.label)}
              className={`p-4 text-center cursor-pointer transition-all border-2 ${
                selectedStatus === status.label
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-border/50'
              }`}
            >
              <p className="text-2xl font-bold text-foreground mb-1">{status.count}</p>
              <p className="text-xs text-muted-foreground text-balance">{status.label}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Filters & Search */}
        <Card className="p-4 border-border bg-card">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search by project title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input border-border"
            />
          </div>
          <Button variant="outline" className="gap-2 border-border text-foreground hover:bg-secondary bg-transparent">
            <Filter className="w-4 h-4" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Tabs for different views */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="bg-card border-b border-border">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="compare" disabled={selectedRows.size < 2}>
            Compare ({selectedRows.size})
          </TabsTrigger>
        </TabsList>

        {/* List View */}
        <TabsContent value="list" className="mt-0">
          <Card className="border-border bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-secondary">
                  <TableRow className="border-border hover:bg-secondary">
                    <TableHead className="w-8">
                      <input
                        type="checkbox"
                        className="rounded border-border"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRows(new Set(filteredApps.map((app) => app.id)));
                          } else {
                            setSelectedRows(new Set());
                          }
                        }}
                        checked={selectedRows.size === filteredApps.length && filteredApps.length > 0}
                      />
                    </TableHead>
                    <TableHead className="text-foreground font-semibold">Project Title</TableHead>
                    <TableHead className="text-foreground font-semibold">Stream</TableHead>
                    <TableHead className="text-foreground font-semibold">Status</TableHead>
                    <TableHead className="text-foreground font-semibold text-right">Score</TableHead>
                    <TableHead className="text-foreground font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApps.length > 0 ? (
                    filteredApps.map((app) => (
                      <TableRow
                        key={app.id}
                        className={`border-border hover:bg-secondary/50 cursor-pointer ${
                          selectedRows.has(app.id) ? 'bg-primary/5' : ''
                        }`}
                      >
                        <TableCell>
                          <input
                            type="checkbox"
                            className="rounded border-border"
                            checked={selectedRows.has(app.id)}
                            onChange={() => toggleRowSelection(app.id)}
                          />
                        </TableCell>
                        <TableCell className="text-foreground font-medium">{app.title}</TableCell>
                        <TableCell>
                          <Badge className={app.stream === 'A' ? 'bg-blue-100 text-blue-800 border-0' : 'bg-purple-100 text-purple-800 border-0'}>
                            Stream {app.stream}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusBadgeColor[app.status]} border-0`}>
                            {app.status.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-bold text-primary">
                            {app.totalScore}/100
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No applications found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Compare View */}
        <TabsContent value="compare" className="mt-0">
          {selectedRows.size >= 2 ? (
            <Card className="p-6 border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4">Comparing {selectedRows.size} Applications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredApps
                  .filter((app) => selectedRows.has(app.id))
                  .map((app) => (
                    <Card key={app.id} className="p-4 border-border bg-secondary/30">
                      <h4 className="font-semibold text-foreground mb-3">{app.title}</h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Stream</p>
                          <p className="text-foreground font-medium">Stream {app.stream}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Total Score</p>
                          <p className="text-foreground font-bold text-lg">{app.totalScore}/100</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-2">Score Breakdown</p>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-foreground">Feasibility</span>
                              <span className="font-bold">{app.scores.feasibility}/40</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-foreground">Scalability</span>
                              <span className="font-bold">{app.scores.scalability}/30</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-foreground">Innovation</span>
                              <span className="font-bold">{app.scores.innovation}/20</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-foreground">Alignment</span>
                              <span className="font-bold">{app.scores.alignment}/10</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center border-border bg-white">
              <p className="text-muted-foreground">Select 2 or more applications to compare</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
