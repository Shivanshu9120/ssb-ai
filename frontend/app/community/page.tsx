'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { FeedList } from '@/components/feed/FeedList';
import { Sparkles, MessageSquare, ShieldCheck, Users } from 'lucide-react';

export default function PublicCommunityPage() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#0d120d] text-slate-100 font-sans">
      <Navbar />

      {/* Hero Header Section */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center space-y-4">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> SSB Aspirants Network 🇮🇳
        </div>

        <h1
          className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          Real SSB Experiences & Test Strategies
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Read authentic candidate experiences across SSB interviews, written exams, medical board tests, and defence academy life.
        </p>

        {/* Quick Highlights Stats */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-zinc-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Candidates
          </span>
          <span className="flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-amber-400" /> Free Public Reading
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-sky-400" /> Community Upvoting
          </span>
        </div>
      </section>

      {/* Main Feed Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16">
        <FeedList
          isLoggedIn={!!user}
          currentUserId={user?.id}
          isAdmin={isAdmin}
        />
      </main>

      <Footer />
    </div>
  );
}
