'use client';

import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { DropdownMenuContent } from "@/components/ui/dropdown-menu"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { DropdownMenu } from "@/components/ui/dropdown-menu"

import { User } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { LogOut, User as UserIcon, ChevronDown } from 'lucide-react';

interface TopBarProps {
  user: User;
}

export default function TopBar({ user }: TopBarProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const roleLabel: Record<string, string> = {
    applicant: 'Applicant',
    reviewer: 'Reviewer',
    'project-lead': 'Project Lead',
    supporter: 'Supporter',
    admin: 'Admin',
  };

  return (
    <div className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <SidebarTrigger className="text-foreground hover:bg-secondary" />

        <div className="flex items-center gap-4 ml-auto relative">
          {/* User Menu */}
          <Button
            variant="ghost"
            className="gap-2 text-foreground hover:bg-secondary"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="text-right">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-muted-foreground">{roleLabel[user.role]}</p>
            </div>
            <ChevronDown className="w-4 h-4" />
          </Button>
          
          {isOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50">
              <div className="p-3 border-b border-border text-sm text-muted-foreground flex gap-2">
                <UserIcon className="w-4 h-4 flex-shrink-0" />
                <span>{user.email}</span>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 flex gap-2 items-center text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
