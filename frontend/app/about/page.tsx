import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Target, Award, Brain, CheckCircle2, ArrowRight, Flag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | SSB AI Mentor',
  description: 'Learn about SSB AI Mentor — India’s premier AI companion for Armed Forces SSB Interview & Officer Like Qualities (OLQ) coaching.',
};

export default function AboutPage() {
  const olqs = [
    { name: 'Effective Intelligence', factor: 'Factor I: Intellect' },
    { name: 'Reasoning Ability', factor: 'Factor I: Intellect' },
    { name: 'Organising Ability', factor: 'Factor I: Intellect' },
    { name: 'Power of Expression', factor: 'Factor I: Intellect' },
    { name: 'Social Adaptability', factor: 'Factor II: Social Adjustment' },
    { name: 'Cooperation', factor: 'Factor II: Social Adjustment' },
    { name: 'Sense of Responsibility', factor: 'Factor II: Social Adjustment' },
    { name: 'Initiative', factor: 'Factor III: Dynamic & Action' },
    { name: 'Self-Confidence', factor: 'Factor III: Dynamic & Action' },
    { name: 'Speed of Decision', factor: 'Factor III: Dynamic & Action' },
    { name: 'Ability to Influence Group', factor: 'Factor III: Dynamic & Action' },
    { name: 'Liveliness', factor: 'Factor III: Dynamic & Action' },
    { name: 'Determination', factor: 'Factor IV: Courage & Guts' },
    { name: 'Courage', factor: 'Factor IV: Courage & Guts' },
    { name: 'Stamina', factor: 'Factor IV: Courage & Guts' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#090d09] text-slate-200">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Hero Banner Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <Flag className="w-3.5 h-3.5" /> Serving Indian Armed Forces Aspirants 🇮🇳
          </div>
          <h1
            className="text-3xl sm:text-5xl font-extrabold text-white tracking-wide leading-tight"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            Empowering Future Officers with Real-Time AI Coaching
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            SSB AI Mentor was built with a singular vision: to democratize high-quality, instant, and personalized SSB Interview coaching for every aspirant across India.
          </p>
        </div>

        {/* Mission Statement Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-900/40 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/50 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Precision OLQ Diagnostics
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evaluating your psychological test responses against the 15 Officer Like Qualities to pinpoint your strengths and development areas.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-900/40 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/50 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Advanced AI Simulation
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generative AI model fine-tuned on military assessment principles, offering real-time feedback on TAT, WAT, SRT, PPDT, and Personal Interviews.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-900/40 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/50 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Equal Access for All
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enabling NDA, CDS, AFCAT, NCC, and Direct Entry candidates from every corner of India to prepare effectively without expensive offline academy barriers.
            </p>
          </div>
        </div>

        {/* 15 OLQs Framework Explanation */}
        <div className="p-8 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wide" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              The 15 Officer Like Qualities (OLQs) Framework
            </h2>
            <p className="text-xs text-slate-400">
              Our AI diagnostic algorithms evaluate candidate responses across all 4 core personality factors assessed by the Selection Boards:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {olqs.map((olq) => (
              <div key={olq.name} className="p-3 rounded-xl bg-slate-900/80 border border-emerald-900/50 text-center hover:border-emerald-500/40 transition-colors">
                <span className="text-xs font-bold text-emerald-300 block mb-1">✓ {olq.name}</span>
                <span className="text-[9px] text-slate-500 block uppercase tracking-wider">{olq.factor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selection Boards Section */}
        <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-900/40 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wide" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            Selection Boards Supported Across India
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mx-auto">
            Whether your reporting center is 11 SSB Allahabad, 33 SSB Bhopal, 24 SSB Bengaluru, 1 AFSB Dehradun, 4 AFSB Varanasi, or NSB Vizag, SSB AI Mentor provides contextual coaching for your branch.
          </p>
          <div className="pt-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-xs text-white uppercase tracking-widest bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 border border-emerald-500/40 shadow-[0_0_20px_rgba(45,90,27,0.5)] transition-all hover:scale-105"
            >
              Start Free AI Practice Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
