'use client';

import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Award, 
  Calendar, 
  Edit3, 
  Check, 
  X, 
  Loader2, 
  ShieldCheck, 
  Target, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/api';

export default function ProfilePage() {
  const { user, profile, fetchProfile, loading: authLoading } = useAuth();

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields State
  const [exam, setExam] = useState('');
  const [branch, setBranch] = useState('');
  const [attempt, setAttempt] = useState<number>(1);
  const [level, setLevel] = useState('Intermediate');

  // Load profile values into state
  useEffect(() => {
    if (profile?.profile) {
      setExam(profile.profile.exam || 'CDS');
      setBranch(profile.profile.branch || 'Army');
      setAttempt(profile.profile.attempt || 1);
      setLevel(profile.profile.level || 'Intermediate');
    }
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');

      await apiService.updateProfile({
        exam,
        branch,
        attempt: Number(attempt),
        level
      });

      await fetchProfile();
      setSuccessMsg('Your candidate profile has been updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (profile?.profile) {
      setExam(profile.profile.exam || 'CDS');
      setBranch(profile.profile.branch || 'Army');
      setAttempt(profile.profile.attempt || 1);
      setLevel(profile.profile.level || 'Intermediate');
    }
    setIsEditing(false);
    setErrorMsg('');
  };

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recent Member';

  const isFresher = (profile?.profile?.attempt || attempt) === 1;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8">
      {/* Page Title Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <UserIcon className="w-7 h-7 text-amber-500" /> Candidate Profile
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage your personal details, SSB target exam, attempt status, and evaluation preferences.
        </p>
      </div>

      {/* Notifications Banner */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-rose-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Profile Summary Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#131313] border border-zinc-900 shadow-xl space-y-6 relative overflow-hidden">
        {/* Glow effect background */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 border-2 border-amber-500/30 flex items-center justify-center font-black text-2xl text-black shadow-lg shadow-amber-500/10">
              {profile?.name ? profile.name.slice(0, 2).toUpperCase() : user?.email ? user.email.slice(0, 2).toUpperCase() : 'CD'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {profile?.name || user?.email?.split('@')[0]}
                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-extrabold uppercase tracking-wider">
                  {profile?.plan || 'Free Cadre'}
                </span>
              </h2>
              <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-zinc-500" /> {user?.email || 'N/A'}
              </p>
              <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 mt-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-600" /> Joined {memberSince}
              </p>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-500" /> Edit Profile
            </button>
          )}
        </div>

        {/* Profile Content: View vs Edit Mode */}
        {!isEditing ? (
          /* View Mode Grid */
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#1b1b1b] border border-zinc-900 space-y-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-500" /> Target Exam
              </span>
              <p className="text-sm font-extrabold text-zinc-100">
                {profile?.profile?.exam || 'CDS'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#1b1b1b] border border-zinc-900 space-y-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-amber-500" /> Service Branch
              </span>
              <p className="text-sm font-extrabold text-zinc-100">
                {profile?.profile?.branch || 'Army'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#1b1b1b] border border-zinc-900 space-y-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" /> Attempt Status
              </span>
              <p className="text-sm font-extrabold text-zinc-100">
                {isFresher ? '1st Attempt (Fresher)' : `${profile?.profile?.attempt || attempt} Attempts (Repeater)`}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#1b1b1b] border border-zinc-900 space-y-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Preparation Level
              </span>
              <p className="text-sm font-extrabold text-zinc-100">
                {profile?.profile?.level || 'Intermediate'}
              </p>
            </div>
          </div>
        ) : (
          /* Edit Mode Form */
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Target Exam */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  Target Exam / Entry
                </label>
                <select
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1b1b1b] border border-zinc-800 text-xs font-semibold text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="CDS">CDS (Combined Defence Services)</option>
                  <option value="NDA">NDA (National Defence Academy)</option>
                  <option value="AFCAT">AFCAT (Air Force Common Admission Test)</option>
                  <option value="INET">INET (Indian Navy Entrance Test)</option>
                  <option value="TA">Territorial Army (TA)</option>
                  <option value="Direct Entry">Direct Entry (SSC Tech / TGC / NCC)</option>
                </select>
              </div>

              {/* Service Branch */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  Preferred Service Branch
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1b1b1b] border border-zinc-800 text-xs font-semibold text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="Army">Army</option>
                  <option value="Navy">Navy</option>
                  <option value="Air Force">Air Force</option>
                  <option value="Flying Branch">Flying Branch</option>
                  <option value="Technical Branch">Technical Branch</option>
                  <option value="Ground Duty">Ground Duty</option>
                </select>
              </div>

              {/* Attempt Count */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  SSB Attempt Count
                </label>
                <select
                  value={attempt}
                  onChange={(e) => setAttempt(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1b1b1b] border border-zinc-800 text-xs font-semibold text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value={1}>1st Attempt (Fresher)</option>
                  <option value={2}>2nd Attempt (Repeater)</option>
                  <option value={3}>3rd Attempt (Repeater)</option>
                  <option value={4}>4th Attempt (Repeater)</option>
                  <option value={5}>5+ Attempts (Seasoned Repeater)</option>
                </select>
              </div>

              {/* Candidate Level */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  Current Coaching Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1b1b1b] border border-zinc-800 text-xs font-semibold text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="Beginner">Beginner (First Time Prep)</option>
                  <option value="Intermediate">Intermediate (Familiar with OLQ & Tests)</option>
                  <option value="Advanced">Advanced (Screened In / Conference Out)</option>
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-900">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={loading}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-500/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Recommended Preparation Strategy Card */}
      <div className="p-6 rounded-2xl bg-[#131313] border border-zinc-900 space-y-4">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" /> Tailored AI Evaluation Profile
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Your active SSB Mentor AI uses your profile parameters (<strong className="text-zinc-200">{profile?.profile?.exam || exam}</strong> • <strong className="text-zinc-200">{profile?.profile?.branch || branch}</strong>) to tailor response evaluation depth, TAT story psychological factor analysis, and SRT situation difficulty.
        </p>

        <div className="p-4 rounded-xl bg-[#1b1b1b] border border-zinc-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div>
              <span className="font-bold text-zinc-200 block">Vector RAG Context Optimization</span>
              <span className="text-[11px] text-zinc-500">Retrieving specialized modules for {profile?.profile?.branch || branch} candidates.</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}
