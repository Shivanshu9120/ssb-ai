import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AlertOctagon, ShieldAlert, CheckCircle2, ExternalLink, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Disclaimer | SSB AI Mentor',
  description: 'Official Armed Forces non-affiliation disclaimer and educational tool usage guidelines for SSB AI Mentor.',
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090d09] text-slate-200">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Title */}
        <div className="mb-10 text-center sm:text-left border-b border-emerald-900/30 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-400 text-xs font-mono mb-4">
            <ShieldAlert className="w-3.5 h-3.5" /> Official Disclaimer Notice
          </div>
          <h1
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide mb-3"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            Armed Forces &amp; Platform Disclaimer
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
            Please review the following disclosure regarding our relationship with the Ministry of Defence, Indian Armed Forces, and official Services Selection Boards.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-slate-300">

          {/* Box 1: Non-Affiliation */}
          <section className="p-6 rounded-2xl bg-amber-950/20 border border-amber-800/30 space-y-3">
            <h2 className="text-lg font-bold text-amber-300 flex items-center gap-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              <AlertOctagon className="w-5 h-5 text-amber-400" />
              1. Non-Affiliation with Ministry of Defence &amp; Armed Forces
            </h2>
            <p className="text-slate-300">
              SSB AI Mentor is an independent educational prep platform and is <strong>NOT</strong> affiliated, associated, authorized, endorsed by, or in any way officially connected with:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>Ministry of Defence, Government of India 🇮🇳</li>
              <li>Indian Army (Join Indian Army)</li>
              <li>Indian Navy (Join Indian Navy)</li>
              <li>Indian Air Force (Air Force Selection Board / AFCAT)</li>
              <li>Services Selection Boards (SSB / AFSB / NSB selection centers)</li>
            </ul>
          </section>

          {/* Box 2: Educational Nature */}
          <section className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              2. Educational &amp; Practice Purpose Only
            </h2>
            <p>
              All tests, psychological question banks (TAT images, WAT words, SRT situations), scorecards, and AI responses provided by SSB AI Mentor are created solely for candidate self-assessment and practice.
            </p>
            <p className="text-slate-400">
              No official SSB test material is reproduced or disclosed. Candidates are encouraged to refer to official government notifications for official exam dates, eligibility criteria, and selection guidelines.
            </p>
          </section>

          {/* Box 3: AI Scoring Disclaimer */}
          <section className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
              3. AI Scores &amp; Recommendation Results
            </h2>
            <p>
              AI-generated feedback and Officer Like Qualities (OLQ) ratings are algorithmic estimations based on standard training prompts. Achieving high scores on SSB AI Mentor does not guarantee recommendation at an official Services Selection Board, nor does a low score reflect official disqualification.
            </p>
          </section>

          {/* Box 4: Official Portals */}
          <section className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              <ExternalLink className="w-5 h-5 text-emerald-400" />
              4. Official Armed Forces Recruitment Portals
            </h2>
            <p className="text-slate-400">
              Always consult the official websites of the Indian Armed Forces for authentic information:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <a
                href="https://joinindianarmy.nic.in"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-900 border border-emerald-900/40 text-center hover:border-emerald-500/40 transition-colors text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5"
              >
                Join Indian Army <ExternalLink className="w-3 h-3 text-amber-400" />
              </a>
              <a
                href="https://joinindiannavy.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-900 border border-emerald-900/40 text-center hover:border-emerald-500/40 transition-colors text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5"
              >
                Join Indian Navy <ExternalLink className="w-3 h-3 text-amber-400" />
              </a>
              <a
                href="https://afcat.edcil.co.in"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-900 border border-emerald-900/40 text-center hover:border-emerald-500/40 transition-colors text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5"
              >
                Join IAF AFCAT <ExternalLink className="w-3 h-3 text-amber-400" />
              </a>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
