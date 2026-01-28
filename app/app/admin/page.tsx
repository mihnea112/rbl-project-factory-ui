'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { strategicObjectives, ecosystemLevers, chapters } from '@/lib/mock-data';
import { Plus, Edit2, Trash2, Settings, Users, Database, Download } from 'lucide-react';

export default function AdminPage() {
  const [newObjective, setNewObjective] = useState('');
  const [newLever, setNewLever] = useState('');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">System Administration</h1>
        <p className="text-muted-foreground">Manage system configuration, taxonomy, and settings.</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="objectives" className="w-full">
        <TabsList className="bg-card border-b border-border">
          <TabsTrigger value="objectives">Strategic Objectives</TabsTrigger>
          <TabsTrigger value="levers">Ecosystem Levers</TabsTrigger>
          <TabsTrigger value="chapters">Chapters</TabsTrigger>
          <TabsTrigger value="permissions">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Strategic Objectives Tab */}
        <TabsContent value="objectives" className="space-y-6 mt-6">
          <Card className="p-6 border-border bg-card">
            <h2 className="text-lg font-semibold text-foreground mb-4">Strategic Objectives</h2>
            <div className="space-y-4 mb-6">
              {strategicObjectives.map((obj) => (
                <div
                  key={obj.id}
                  className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{obj.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{obj.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Badge className={obj.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}>
                      {obj.active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button size="sm" variant="ghost" className="text-foreground hover:bg-secondary">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New */}
            <div className="border-t border-border pt-6">
              <h3 className="font-semibold text-foreground mb-4">Add New Strategic Objective</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-objective" className="text-foreground font-medium">
                    Name
                  </Label>
                  <Input
                    id="new-objective"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="E.g., Digital Transformation"
                    className="mt-2 bg-input border-border"
                  />
                </div>
                <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="w-4 h-4" />
                  Add Objective
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Ecosystem Levers Tab */}
        <TabsContent value="levers" className="space-y-6 mt-6">
          <Card className="p-6 border-border bg-card">
            <h2 className="text-lg font-semibold text-foreground mb-4">Ecosystem Levers</h2>
            <div className="space-y-4 mb-6">
              {ecosystemLevers.map((lever) => (
                <div
                  key={lever.id}
                  className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{lever.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{lever.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Badge className={lever.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}>
                      {lever.active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button size="sm" variant="ghost" className="text-foreground hover:bg-secondary">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New */}
            <div className="border-t border-border pt-6">
              <h3 className="font-semibold text-foreground mb-4">Add New Ecosystem Lever</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-lever" className="text-foreground font-medium">
                    Name
                  </Label>
                  <Input
                    id="new-lever"
                    value={newLever}
                    onChange={(e) => setNewLever(e.target.value)}
                    placeholder="E.g., Mentorship"
                    className="mt-2 bg-input border-border"
                  />
                </div>
                <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="w-4 h-4" />
                  Add Lever
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Chapters Tab */}
        <TabsContent value="chapters" className="space-y-6 mt-6">
          <Card className="overflow-x-auto border-border bg-card">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Chapter</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Region</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Capacity</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Available</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {chapters.map((ch) => (
                  <tr key={ch.id} className="border-b border-border hover:bg-secondary/50">
                    <td className="px-6 py-4 text-foreground font-medium">{ch.name}</td>
                    <td className="px-6 py-4 text-foreground">{ch.region}</td>
                    <td className="px-6 py-4 text-foreground">{ch.capacity}</td>
                    <td className="px-6 py-4">
                      <Badge className={ch.available ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'}>
                        {ch.available ? 'Yes' : 'No'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <Button size="sm" variant="ghost" className="text-foreground hover:bg-secondary">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Button className="gap-2 bg-primary hover:bg-primary/90 text-white">
            <Plus className="w-4 h-4" />
            Add Chapter
          </Button>
        </TabsContent>

        {/* Roles & Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6 mt-6">
          <Card className="p-6 border-border bg-card">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex gap-2 items-center">
              <Users className="w-5 h-5" />
              Roles & Permissions
            </h2>

            <div className="space-y-6">
              {[
                {
                  role: 'Admin',
                  description: 'Full system access and configuration',
                  permissions: ['View all applications', 'Manage system settings', 'Manage users', 'View portfolio'],
                },
                {
                  role: 'Reviewer',
                  description: 'Review applications and make funding decisions',
                  permissions: ['View applications', 'Score and assess', 'Make decisions', 'View portfolio'],
                },
                {
                  role: 'Project Lead',
                  description: 'Manage accepted project',
                  permissions: ['View project', 'Submit updates', 'Request supporter help', 'Manage team'],
                },
              ].map((role) => (
                <div key={role.role} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{role.role}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                    </div>
                    <Button variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                  <div className="bg-secondary/30 p-3 rounded">
                    <p className="text-xs text-muted-foreground mb-2">Permissions:</p>
                    <ul className="space-y-1">
                      {role.permissions.map((perm) => (
                        <li key={perm} className="text-sm text-foreground">
                          ✓ {perm}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card className="p-6 border-border bg-card">
            <h2 className="text-lg font-semibold text-foreground mb-6 flex gap-2 items-center">
              <Settings className="w-5 h-5" />
              System Settings
            </h2>

            <div className="space-y-6">
              {/* Application Settings */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Application Settings</h3>
                <div className="space-y-4 bg-secondary/30 p-4 rounded-lg">
                  <div>
                    <Label className="text-foreground font-medium">Application Deadline</Label>
                    <Input type="date" className="mt-2 bg-white border-border" />
                  </div>
                  <div>
                    <Label className="text-foreground font-medium">Max Reviewers per Application</Label>
                    <Input type="number" defaultValue="3" className="mt-2 bg-white border-border" />
                  </div>
                  <div>
                    <Label className="text-foreground font-medium">Automatic AI Triage Enabled</Label>
                    <div className="mt-2">
                      <input type="checkbox" defaultChecked className="rounded border-border" />
                      <span className="ml-2 text-sm text-foreground">Enable AI assessment for new applications</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Notification Settings</h3>
                <div className="space-y-4 bg-secondary/30 p-4 rounded-lg">
                  <div>
                    <input type="checkbox" defaultChecked className="rounded border-border" />
                    <span className="ml-2 text-sm text-foreground">Send email on application submission</span>
                  </div>
                  <div>
                    <input type="checkbox" defaultChecked className="rounded border-border" />
                    <span className="ml-2 text-sm text-foreground">Send email on reviewer decisions</span>
                  </div>
                  <div>
                    <input type="checkbox" className="rounded border-border" />
                    <span className="ml-2 text-sm text-foreground">Weekly portfolio digest</span>
                  </div>
                </div>
              </div>

              <Button className="gap-2 bg-primary hover:bg-primary/90 text-white">
                Save Settings
              </Button>
            </div>
          </Card>

          {/* Database Management */}
          <Card className="p-6 border-border bg-card">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex gap-2 items-center">
              <Database className="w-5 h-5" />
              Data Management
            </h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full border-border text-foreground hover:bg-secondary justify-start bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Export Database
              </Button>
              <Button variant="outline" className="w-full border-border text-foreground hover:bg-secondary justify-start bg-transparent">
                <Database className="w-4 h-4 mr-2" />
                View Database Status
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
