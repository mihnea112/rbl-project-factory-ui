'use client';

import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { UserRole } from '@/lib/types';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Users,
  Settings,
  ShoppingBag,
  BriefcaseIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AppSidebarProps {
  userRole: UserRole;
}

export default function AppSidebar({ userRole }: AppSidebarProps) {
  const pathname = usePathname();

  const getMenuItems = (role: UserRole) => {
    const baseItems = [
      { href: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['applicant', 'reviewer', 'project-lead', 'supporter', 'admin'] },
      { href: '/app/applicant', label: 'My Applications', icon: FileText, roles: ['applicant'] },
      { href: '/app/reviewer', label: 'Reviewer Console', icon: FileText, roles: ['reviewer'] },
      { href: '/app/projects', label: 'Projects', icon: BriefcaseIcon, roles: ['project-lead', 'supporter', 'reviewer'] },
      { href: '/app/marketplace', label: 'Marketplace', icon: ShoppingBag, roles: ['supporter', 'project-lead'] },
      { href: '/app/portfolio', label: 'Portfolio', icon: BarChart3, roles: ['reviewer', 'admin'] },
      { href: '/app/admin', label: 'Admin', icon: Settings, roles: ['admin'] },
    ];

    return baseItems.filter((item) => item.roles.includes(role));
  };

  const menuItems = getMenuItems(userRole);

  return (
    <Sidebar className="bg-white border-r border-border">
      <SidebarHeader className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">RBL</span>
          </div>
          <span className="font-semibold text-foreground">Project OS</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.href}
                    className={`text-sm ${
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-foreground hover:bg-secondary'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
