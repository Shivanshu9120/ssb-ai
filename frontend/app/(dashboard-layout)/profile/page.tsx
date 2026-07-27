'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Zap,
  FileText,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { MilitaryLoader } from '@/components/ui/MilitaryLoader';
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
    if (profile?.piq_profile) {
      setExam(profile.piq_profile.exam || 'Army');
      setBranch(profile.piq_profile.choice_of_service || '');
      setAttempt(profile.piq_profile.commission_attempts || 1);
      setLevel(profile.piq_profile.level || 'Intermediate');
    }
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');

      await apiService.updatePIQProfile({
        exam,
        choice_of_service: branch,
        commission_attempts: Number(attempt),
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
    if (profile?.piq_profile) {
      setExam(profile.piq_profile.exam || 'Army');
      setBranch(profile.piq_profile.choice_of_service || '');
      setAttempt(profile.piq_profile.commission_attempts || 1);
      setLevel(profile.piq_profile.level || 'Intermediate');
    }
    setIsEditing(false);
    setErrorMsg('');
  };

  if (authLoading) {
    return <MilitaryLoader variant="fullscreen" />;
  }

  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recent Member';

  const isFresher = (profile?.piq_profile?.commission_attempts || attempt) <= 1;

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
      <div className="p-6 md:p-8 rounded-2xl theme-bg-card border theme-border shadow-xl space-y-6 relative overflow-hidden">
        {/* Glow effect background */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[var(--theme-accent-bg-subtle)] rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b theme-border-subtle pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl theme-accent-bg border-2 theme-accent-border flex items-center justify-center font-black text-2xl shadow-lg flex-shrink-0">
              {profile?.name ? profile.name.slice(0, 2).toUpperCase() : user?.email ? user.email.slice(0, 2).toUpperCase() : 'CD'}
            </div>
            <div>
              <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2">
                {profile?.name || user?.email?.split('@')[0]}
                <span className="px-2 py-0.5 rounded-md bg-[var(--theme-accent-bg-subtle)] border theme-accent-border theme-accent-text text-[10px] font-extrabold uppercase tracking-wider">
                  {profile?.plan || 'Free Cadre'}
                </span>
              </h2>
              <p className="text-xs theme-text-muted flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 theme-text-muted" /> {user?.email || 'N/A'}
              </p>
              <p className="text-[11px] theme-text-muted flex items-center gap-1.5 mt-1">
                <Calendar className="w-3.5 h-3.5 theme-text-muted" /> Joined {memberSince}
              </p>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl theme-accent-bg theme-accent-bg-hover font-bold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-current" /> Edit Profile
            </button>
          )}
        </div>

        {/* Profile Content: View vs Edit Mode */}
        {!isEditing ? (
          /* View Mode */
          <>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl theme-bg-input border theme-border space-y-1">
              <span className="text-[10px] font-bold theme-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 theme-accent-text" /> Target Exam
              </span>
              <p className="text-sm font-extrabold theme-text-primary">
                {profile?.piq_profile?.exam || 'Army'}
              </p>
            </div>

            <div className="p-4 rounded-xl theme-bg-input border theme-border space-y-1">
              <span className="text-[10px] font-bold theme-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 theme-accent-text" /> Service Branch
              </span>
              <p className="text-sm font-extrabold theme-text-primary">
                {profile?.piq_profile?.choice_of_service || 'Not set'}
              </p>
            </div>

            <div className="p-4 rounded-xl theme-bg-input border theme-border space-y-1">
              <span className="text-[10px] font-bold theme-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 theme-accent-text" /> Attempt Status
              </span>
              <p className="text-sm font-extrabold theme-text-primary">
                {isFresher ? '1st Attempt (Fresher)' : `${profile?.piq_profile?.commission_attempts || attempt} Attempt(s) (Repeater)`}
              </p>
            </div>

            <div className="p-4 rounded-xl theme-bg-input border theme-border space-y-1">
              <span className="text-[10px] font-bold theme-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 theme-accent-text" /> Preparation Level
              </span>
              <p className="text-sm font-extrabold theme-text-primary">
                {profile?.piq_profile?.level || 'Intermediate'}
              </p>
            </div>
          </div>

          {/* Link to full PIQ form */}
          <div className="mt-2">
            <Link href="/piq" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border theme-accent-border bg-[var(--theme-accent-bg-subtle)] theme-accent-text text-xs font-semibold hover:opacity-80 transition-colors">
              <FileText className="w-3.5 h-3.5" /> View / Edit Full PIQ Form <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          </>
        ) : (
          /* Edit Mode Form */
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Target Exam */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold theme-text-secondary">
                  Target Exam / Entry
                </label>
                <select
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl theme-bg-input border theme-border text-xs font-semibold theme-text-primary focus:outline-none focus:theme-accent-border transition-colors"
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
                <label className="block text-xs font-bold theme-text-secondary">
                  Preferred Service Branch
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl theme-bg-input border theme-border text-xs font-semibold theme-text-primary focus:outline-none focus:theme-accent-border transition-colors"
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
                <label className="block text-xs font-bold theme-text-secondary">
                  SSB Attempt Count
                </label>
                <select
                  value={attempt}
                  onChange={(e) => setAttempt(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl theme-bg-input border theme-border text-xs font-semibold theme-text-primary focus:outline-none focus:theme-accent-border transition-colors"
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
                <label className="block text-xs font-bold theme-text-secondary">
                  Current Coaching Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl theme-bg-input border theme-border text-xs font-semibold theme-text-primary focus:outline-none focus:theme-accent-border transition-colors"
                >
                  <option value="Beginner">Beginner (First Time Prep)</option>
                  <option value="Intermediate">Intermediate (Familiar with OLQ & Tests)</option>
                  <option value="Advanced">Advanced (Screened In / Conference Out)</option>
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t theme-border-subtle">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={loading}
                className="px-4 py-2 rounded-xl text-xs font-semibold theme-text-muted hover:theme-text-primary theme-bg-card-hover transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl theme-accent-bg theme-accent-bg-hover font-extrabold text-xs flex items-center gap-2 transition-all shadow-md theme-accent-glow cursor-pointer"
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
      <div className="p-6 rounded-2xl theme-bg-card border theme-border space-y-4">
        <h3 className="text-sm font-extrabold theme-text-primary flex items-center gap-2">
          <Sparkles className="w-4 h-4 theme-accent-text" /> Tailored AI Evaluation Profile
        </h3>
        <p className="text-xs theme-text-muted leading-relaxed">
          Your active SSB Mentor AI uses your profile parameters (<strong className="theme-text-secondary">{profile?.piq_profile?.exam || exam}</strong> • <strong className="theme-text-secondary">{profile?.piq_profile?.choice_of_service || branch || 'Service not set'}</strong>) to tailor response evaluation depth, TAT story psychological factor analysis, and SRT situation difficulty.
        </p>

        <div className="p-4 rounded-xl theme-bg-input border theme-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 theme-accent-text flex-shrink-0" />
            <div>
              <span className="font-bold theme-text-secondary block">Vector RAG Context Optimization</span>
              <span className="text-[11px] theme-text-muted">Retrieving specialized modules for {profile?.piq_profile?.choice_of_service || branch || 'your target branch'} candidates.</span>
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
