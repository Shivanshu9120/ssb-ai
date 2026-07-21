'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Award, Compass, CompassIcon, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/api';

export default function Onboarding() {
  const { user, profile, fetchProfile, loading: authLoading } = useAuth();
  const [exam, setExam] = useState('Army');
  const [branch, setBranch] = useState('');
  const [attempt, setAttempt] = useState(1);
  const [level, setLevel] = useState('Beginner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Redirect if already has profile setup
  React.useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (profile?.profile) {
        router.push('/dashboard');
      }
    }
  }, [user, profile, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam || !level) {
      setError('Please select at least target service exam and preparation level.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiService.updateProfile({
        exam,
        branch: branch || undefined,
        attempt: Number(attempt),
        level,
      });
      
      // Refresh Auth Profile context state and route to dashboard
      await fetchProfile();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Failed to submit onboarding details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative">
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl p-8 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-md shadow-2xl relative">
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white mb-2">
            <Compass className="w-5 h-5 text-slate-100" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">SSB Profile Setup</h2>
          <p className="text-xs text-slate-400">Customize your RAG-coaching model context to match your branch requirements</p>
        </div>

        {error && (
          <div className="p-3 mb-6 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Target Service Branch</label>
              <select
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-100 text-sm focus:border-indigo-600 focus:outline-none transition-colors"
              >
                <option value="Army">Indian Army</option>
                <option value="Navy">Indian Navy</option>
                <option value="Air Force">Indian Air Force</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Attempt Number</label>
              <select
                value={attempt}
                onChange={(e) => setAttempt(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-100 text-sm focus:border-indigo-600 focus:outline-none transition-colors"
              >
                <option value="1">1st Attempt (Fresher)</option>
                <option value="2">2nd Attempt (Repeater)</option>
                <option value="3">3rd Attempt (Repeater)</option>
                <option value="4">4+ Attempts</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Preferred Entry Scheme / Branch (Optional)</label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="e.g. Flying (NDA/CDS), Tech entry (TGC), Infantry"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-100 text-sm focus:border-indigo-600 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Current SSB Preparation Level</label>
            <div className="grid grid-cols-3 gap-3">
              {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`py-3 rounded-lg border font-semibold text-xs text-center transition-all ${
                    level === lvl
                      ? 'border-indigo-600 bg-indigo-600/10 text-indigo-400 shadow-md shadow-indigo-600/5'
                      : 'border-slate-800 bg-slate-950/80 text-slate-400 hover:text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 font-semibold text-sm transition-all shadow-md shadow-indigo-600/20 mt-8"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Onboarding Profile...
              </>
            ) : (
              <>
                Complete Setup <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
