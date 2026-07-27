import React from 'react';
import Link from 'next/link';
import {
  Shield,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export default function Footer() {

  return (
    <footer className="relative bg-[#090d09] text-slate-300 pt-16 pb-8 border-t border-emerald-900/30 overflow-hidden font-sans">
      {/* Background Camo Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-950/15 rounded-full blur-3xl pointer-events-none" />

      {/* Tricolor Header Accent Strip */}
      <div className="absolute top-0 left-0 right-0 flex h-[3px]">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white opacity-90" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-900/20">

          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 border border-emerald-600/40 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(45,90,27,0.5)] group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-wider text-white block uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  SSB AI MENTOR
                </span>
                <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest block -mt-1">
                  Indian Armed Forces Prep AI
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              India&apos;s premiere AI-driven evaluation platform engineered specifically for NDA, CDS, AFCAT &amp; Direct Entry candidates preparing for SSB, AFSB, and NSB Selection Boards.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest border-b border-emerald-900/30 pb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              SSB Modules
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/dashboard" className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors group">
                  <ChevronRight className="w-3 h-3 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                  PPDT Test Generator
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors group">
                  <ChevronRight className="w-3 h-3 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                  TAT Story Evaluator
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors group">
                  <ChevronRight className="w-3 h-3 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                  WAT Practice &amp; OLQs
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors group">
                  <ChevronRight className="w-3 h-3 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                  SRT Solver &amp; Analysis
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors group">
                  <ChevronRight className="w-3 h-3 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                  GTO Tasks Guidance
                </Link>
              </li>
              <li>
                <Link href="/chat" className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors group">
                  <ChevronRight className="w-3 h-3 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                  Personal Interview Mock AI
                </Link>
              </li>
            </ul>
          </div>

          {/* About & Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest border-b border-emerald-900/30 pb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Company &amp; Platform
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors group">
                  <ChevronRight className="w-3 h-3 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                  About SSB AI
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors group">
                  <ChevronRight className="w-3 h-3 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors group">
                  <ChevronRight className="w-3 h-3 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors group">
                  <ChevronRight className="w-3 h-3 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                  15 OLQs Radar Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest border-b border-emerald-900/30 pb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Legal &amp; Policies
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors group">
                  <ChevronRight className="w-3 h-3 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors group">
                  <ChevronRight className="w-3 h-3 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors group">
                  <ChevronRight className="w-3 h-3 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                  Defense Aspirant Disclaimer
                </Link>
              </li>
              <li>
                <a
                  href="https://joinindianarmy.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors group"
                >
                  <ExternalLink className="w-3 h-3 text-amber-500" />
                  Join Indian Army (Official)
                </a>
              </li>
              <li>
                <a
                  href="https://joinindiannavy.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors group"
                >
                  <ExternalLink className="w-3 h-3 text-amber-500" />
                  Join Indian Navy (Official)
                </a>
              </li>
              <li>
                <a
                  href="https://afcat.edcil.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors group"
                >
                  <ExternalLink className="w-3 h-3 text-amber-500" />
                  Join IAF / AFCAT (Official)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Footer Info */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} SSB AI Mentor. All rights reserved.</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              Jai Hind 🇮🇳
            </span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy
            </Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">
              Contact
            </Link>
            <Link href="/disclaimer" className="hover:text-slate-300 transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
