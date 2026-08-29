'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Menu, X, ArrowRight, User, LayoutDashboard, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0a0f0a]/90 backdrop-blur-md border-b border-emerald-900/30">
      <div className="flex h-0.5 w-full">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white opacity-80" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/SSBAI-logo.png"
            alt="SSB AI Logo"
            className="w-10 h-10 object-contain rounded-xl shadow-md border border-emerald-500/30 group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col justify-center">
            <span
              className="font-extrabold text-xl tracking-tight leading-none"
              style={{
                background: 'linear-gradient(90deg, #8dc870, #ffffff, #6ab04c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'Rajdhani, sans-serif',
              }}
            >
              SSB Mentor AI
            </span>
            <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase mt-0.5 leading-none">
              Jai Hind 🇮🇳
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <Link href="/" className="hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <Link href="/community" className="hover:text-emerald-400 text-amber-400 transition-colors font-extrabold flex items-center gap-1">
            ✨ Community
          </Link>
          <Link href="/about" className="hover:text-emerald-400 transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-emerald-400 transition-colors">
            Contact
          </Link>
          <Link href="/terms" className="hover:text-emerald-400 transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
            Privacy
          </Link>
          <Link href="/disclaimer" className="hover:text-emerald-400 transition-colors">
            Disclaimer
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-800 to-emerald-600 border border-emerald-500/40 hover:scale-[1.02] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(45,90,27,0.4)]"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-300" />
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 border border-slate-700/50 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 border border-emerald-500/40 hover:scale-[1.02] transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(45,90,27,0.4)]"
              >
                Start Coaching <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-emerald-950/40 border border-emerald-900/30"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-emerald-400" /> : <Menu className="w-6 h-6 text-emerald-400" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d140d] border-b border-emerald-900/40 px-4 pt-3 pb-6 space-y-3 text-sm font-semibold uppercase tracking-wider text-slate-300">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-emerald-400 border-b border-slate-800/60"
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-emerald-400 border-b border-slate-800/60"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-emerald-400 border-b border-slate-800/60"
          >
            Contact
          </Link>
          <Link
            href="/terms"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-emerald-400 border-b border-slate-800/60"
          >
            Terms &amp; Conditions
          </Link>
          <Link
            href="/privacy"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-emerald-400 border-b border-slate-800/60"
          >
            Privacy Policy
          </Link>
          <Link
            href="/disclaimer"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-emerald-400 border-b border-slate-800/60"
          >
            Disclaimer
          </Link>
          <div className="pt-2 flex flex-col gap-2">
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-white bg-emerald-700 flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 rounded-lg text-center text-xs font-semibold text-slate-200 bg-slate-800"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-white bg-emerald-600 flex items-center justify-center gap-1.5"
                >
                  Start Coaching <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
