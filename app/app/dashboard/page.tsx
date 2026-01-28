'use client';

import { useAuth } from '@/lib/auth-context';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    redirect('/login');
  }

  const roleMessages = {
    applicant: 'Track your applications and view feedback from our review team.',
    reviewer: 'Manage applications and provide detailed feedback.',
    'project-lead': 'Oversee your project milestone, budget, and team.',
    supporter: 'Browse projects and manage your commitments.',
    admin: 'Manage system settings, roles, and strategic objectives.',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Welcome, {user?.name}
        </h1>
        <p className="text-lg text-muted-foreground">
          {roleMessages[user?.role as keyof typeof roleMessages]}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-2">Your Role</h3>
          <p className="text-2xl font-bold text-primary capitalize">
            {user?.role.replace('-', ' ')}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-2">Member Since</h3>
          <p className="text-lg text-muted-foreground">
            {user?.createdAt?.toLocaleDateString()}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-2">Email</h3>
          <p className="text-sm text-muted-foreground break-all">{user?.email}</p>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-2">Getting Started</h2>
        <p className="text-muted-foreground mb-4">
          Navigate using the sidebar to access different sections of the platform.
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {user?.role === 'applicant' && (
            <>
              <li>• View your application status and scores</li>
              <li>• Track review feedback and next steps</li>
              <li>• Connect with your project team</li>
            </>
          )}
          {user?.role === 'reviewer' && (
            <>
              <li>• Review applications in the pipeline</li>
              <li>• Provide scores and feedback</li>
              <li>• Track review progress</li>
            </>
          )}
          {user?.role === 'project-lead' && (
            <>
              <li>• Manage project milestones</li>
              <li>• Track budget and spending</li>
              <li>• Update project status and metrics</li>
            </>
          )}
          {user?.role === 'supporter' && (
            <>
              <li>• Browse impact projects</li>
              <li>• Make commitments or pledges</li>
              <li>• Track your involvement</li>
            </>
          )}
          {user?.role === 'admin' && (
            <>
              <li>• Manage system settings and configuration</li>
              <li>• Define strategic objectives</li>
              <li>• Manage user roles and permissions</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
