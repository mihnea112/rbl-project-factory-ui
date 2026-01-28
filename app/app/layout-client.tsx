'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase/browser';

export function AppLayoutClient({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [meLoading, setMeLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState<string>('');
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadMe() {
      setMeLoading(true);

      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      const data = await res.json().catch(() => ({}));

      if (cancelled) return;

      if (!res.ok || !data?.user) {
        setRoles([]);
        setDisplayName('');
        setSignedIn(false);
        setMeLoading(false);
        return;
      }

      const r: string[] = Array.isArray(data.roles) ? data.roles : [];
      setRoles(r);
      setDisplayName(data.user?.email || '');
      setSignedIn(true);
      setMeLoading(false);
    }

    loadMe();
    return () => {
      cancelled = true;
    };
  }, []);

  if (meLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!signedIn || roles.length === 0) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background px-6">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 text-center">
          <h1 className="text-xl font-semibold text-foreground mb-2">You’re not signed in</h1>
          <p className="text-sm text-muted-foreground mb-6">Please log in to access the application.</p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  async function handleLogout() {
    try {
      // Clear server-side auth cookies used by middleware
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}

    try {
      // Clear client-side Supabase session (localStorage)
      const supabase = supabaseBrowser();
      await supabase.auth.signOut();
    } catch {}

    router.push('/login?force=1');
    router.refresh();
  }

  const navItems = [
    { label: 'Dashboard', href: '/app/dashboard', roles: ['applicant', 'reviewer', 'project_lead', 'supporter', 'admin'] },
    { label: 'My Applications', href: '/app/applicant', roles: ['applicant'] },
    { label: 'Reviewer Console', href: '/app/reviewer', roles: ['reviewer'] },
    { label: 'Projects', href: '/app/projects', roles: ['project_lead', 'supporter', 'reviewer'] },
    { label: 'Marketplace', href: '/app/marketplace', roles: ['supporter', 'project_lead'] },
    { label: 'Portfolio', href: '/app/portfolio', roles: ['reviewer', 'admin'] },
    { label: 'Admin', href: '/app/admin', roles: ['admin'] },
  ].filter(item => item.roles.some(r => roles.includes(r)));

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <h2 className="text-lg font-bold text-sidebar-foreground">RBL</h2>
        </div>
        <nav className="flex-1 overflow-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">RBL Project Factory</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{displayName}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-primary hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
