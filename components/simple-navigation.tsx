'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, BriefcaseIcon, ShoppingBag, BarChart3, Settings } from 'lucide-react';
import { UserRole } from '@/lib/types';
import Image from 'next/image';

interface SimpleNavigationProps {
  userRole: UserRole;
}

export default function SimpleNavigation({ userRole }: SimpleNavigationProps) {
  const pathname = usePathname();

  const getMenuItems = (role: UserRole) => {
    const baseItems = [
      { href: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['applicant', 'reviewer', 'project-lead', 'supporter', 'admin'] as UserRole[] },
      { href: '/app/applicant', label: 'My Applications', icon: FileText, roles: ['applicant'] as UserRole[] },
      { href: '/app/reviewer', label: 'Reviewer Console', icon: FileText, roles: ['reviewer'] as UserRole[] },
      { href: '/app/projects', label: 'Projects', icon: BriefcaseIcon, roles: ['project-lead', 'supporter', 'reviewer'] as UserRole[] },
      { href: '/app/marketplace', label: 'Marketplace', icon: ShoppingBag, roles: ['supporter', 'project-lead'] as UserRole[] },
      { href: '/app/portfolio', label: 'Portfolio', icon: BarChart3, roles: ['reviewer', 'admin'] as UserRole[] },
      { href: '/app/admin', label: 'Admin', icon: Settings, roles: ['admin'] as UserRole[] },
    ];

    return baseItems.filter((item) => item.roles.includes(role));
  };

  const menuItems = getMenuItems(userRole);

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border flex items-center gap-3">
        <Image
          src="/logo.svg"
          alt="RBL Project Factory"
          width={32}
          height={32}
          className="shrink-0"
        />
        <span className="text-lg font-bold text-sidebar-foreground">
          RBL
        </span>
      </div>
      <nav className="flex-1 overflow-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
