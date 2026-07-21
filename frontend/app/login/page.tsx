'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative">
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-md p-8 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-md shadow-2xl relative">
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-600/30">
            S
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400">Log in to resume your SSB AI coaching</p>
        </div>

        {error && (
          <div className="p-3 mb-6 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="candidate@exam.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950/80 text-slate-100 text-sm focus:border-indigo-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950/80 text-slate-100 text-sm focus:border-indigo-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 font-semibold text-sm transition-all shadow-md shadow-indigo-600/20 mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Verifying Credentials...
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-400">
          New to the platform?{' '}
          <Link href="/signup" className="text-indigo-400 font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </div>

      <Link href="/" className="mt-6 text-xs text-slate-500 hover:text-slate-400 font-medium">
        ← Back to Homepage
      </Link>
    </div>
  );
}
