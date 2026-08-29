'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import { apiService } from '@/services/api';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: any | null;
  isAdmin: boolean;
  piqCompletedSteps: number;
  fetchProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  profile: null,
  isAdmin: false,
  piqCompletedSteps: 0,
  fetchProfile: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const PUBLIC_ROUTES = ['/', '/community', '/login', '/signup', '/about', '/contact', '/terms', '/privacy', '/disclaimer'];
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route || (route !== '/' && pathname.startsWith(route)));

  const fetchProfile = async () => {
    try {
      const data = await apiService.getProfile();
      setProfile(data);

      // Only redirect to onboarding on first-ever login (no PIQ profile at all).
      // Dashboard is ALWAYS accessible — PIQ is optional.
      if (!data.piq_profile && !isPublicRoute && pathname !== '/onboarding') {
        router.push('/onboarding');
      }
    } catch (err: any) {
      console.error('Failed to load user profile metadata:', err?.message ?? err);
    }
  };

  useEffect(() => {
    // Check active session on startup
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) {
        fetchProfile().finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Subscribe to auth state updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session) {
        setLoading(true);
        await fetchProfile();
        setLoading(false);
      } else {
        setProfile(null);
        setLoading(false);
        if (!isPublicRoute) {
          router.push('/login');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname]);

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
    setUser(null);
    setLoading(false);
    router.push('/login');
  };

  const isAdmin = !!user && ADMIN_EMAILS.includes((user.email ?? '').toLowerCase());
  const piqCompletedSteps: number = profile?.piq_profile?.completed_steps ?? 0;

  return (
    <AuthContext.Provider value={{ user, session, loading, profile, isAdmin, piqCompletedSteps, fetchProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
