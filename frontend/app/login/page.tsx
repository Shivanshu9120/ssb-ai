'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-[#131313] flex flex-col justify-center items-center px-4 relative select-none">
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-md p-8 rounded-2xl border border-zinc-800 bg-[#18181b]/90 backdrop-blur-md shadow-2xl relative">
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <img
            src="/SSBAI-logo.png"
            alt="SSB AI Logo"
            className="w-12 h-12 object-contain rounded-xl shadow-lg border border-amber-500/20 mb-1"
          />
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-100">Welcome Back</h2>
          <p className="text-xs text-zinc-400">Log in to resume your SSB AI coaching</p>
        </div>

        {error && (
          <div className="p-3 mb-6 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="candidate@exam.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-[#131313] text-zinc-100 placeholder-zinc-600 text-sm focus:border-amber-500/60 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-800 bg-[#131313] text-zinc-100 placeholder-zinc-600 text-sm focus:border-amber-500/60 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-1 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#f0a924] hover:bg-[#e09b1f] disabled:bg-amber-800/40 text-black font-extrabold text-sm transition-all shadow-md shadow-amber-500/10 hover:scale-[1.01] mt-6 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" /> Verifying Credentials...
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-zinc-400">
          New to the platform?{' '}
          <Link href="/signup" className="text-amber-400 font-semibold hover:text-amber-300 hover:underline">
            Create an account
          </Link>
        </p>
      </div>

      <Link href="/" className="mt-6 text-xs text-zinc-500 hover:text-zinc-300 font-medium transition-colors">
        ← Back to Homepage
      </Link>
    </div>
  );
}
