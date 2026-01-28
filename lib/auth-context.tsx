'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from './types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for different roles
const mockUsers: Record<UserRole, User> = {
  applicant: {
    id: 'user-001',
    email: 'applicant@example.com',
    name: 'Sofia Ionescu',
    role: 'applicant',
    createdAt: new Date('2024-01-01'),
  },
  reviewer: {
    id: 'user-002',
    email: 'reviewer@rbl.ro',
    name: 'Andrei Popescu',
    role: 'reviewer',
    createdAt: new Date('2024-01-01'),
  },
  'project-lead': {
    id: 'user-003',
    email: 'lead@example.com',
    name: 'Mihai Andrei',
    role: 'project-lead',
    createdAt: new Date('2024-01-01'),
  },
  supporter: {
    id: 'user-004',
    email: 'supporter@example.com',
    name: 'Elena Popescu',
    role: 'supporter',
    createdAt: new Date('2024-01-01'),
  },
  admin: {
    id: 'user-005',
    email: 'admin@rbl.ro',
    name: 'Ioana Georgescu',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    // Mock authentication - in a real app, this would call an API
    // For demo purposes, we'll accept any email/password combination
    // and try to determine the role from context

    // Default to applicant role for demo
    const role = 'applicant' as UserRole;
    setUser(mockUsers[role]);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    setUser(mockUsers[role]);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
