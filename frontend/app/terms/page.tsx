import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, FileText, Lock, Scale, AlertTriangle, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms and Conditions | SSB AI Mentor',
  description: 'Terms of service and usage conditions for SSB AI Mentor platform and services.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090d09] text-slate-200">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Title */}
        <div className="mb-10 text-center sm:text-left border-b border-emerald-900/30 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-4">
            <Scale className="w-3.5 h-3.5" /> Effective Date: July 2026
          </div>
          <h1
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide mb-3"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            Terms and Conditions
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
            Please read these terms carefully before using SSB AI Mentor. By accessing or using our platform, you agree to be bound by these terms.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-slate-300">
          
          {/* Section 1 */}
          <section className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              1. Acceptance of Terms
            </h2>
            <p>
              By creating an account or accessing SSB AI Mentor (&ldquo;the Service&rdquo;), you acknowledge that you have read, understood, and agreed to be legally bound by these Terms and Conditions and our Privacy Policy. If you do not agree, you must discontinue using the platform immediately.
            </p>
          </section>

          {/* Section 2 */}
          <section className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              <FileText className="w-5 h-5 text-emerald-400" />
              2. Scope of Service &amp; Purpose
            </h2>
            <p>
              SSB AI Mentor is an interactive educational web platform designed to assist candidates preparing for Indian Armed Forces Services Selection Board (SSB), Air Force Selection Board (AFSB), and Naval Selection Board (NSB) interviews.
            </p>
            <p>
              Our services include AI-assisted evaluations for psychological tests (PPDT, TAT, WAT, SRT), Officer Like Qualities (OLQ) analysis, and mock interview guidance.
            </p>
          </section>

          {/* Section 3 */}
          <section className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              3. AI Coaching &amp; Disclaimer of Recommendations
            </h2>
            <p className="text-slate-300">
              Evaluations, scores, and feedback provided by SSB AI Mentor are powered by artificial intelligence model heuristics designed to simulate standard Services Selection Board criteria.
            </p>
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200/90 text-xs leading-relaxed">
              <strong>Important Notice:</strong> SSB AI Mentor does not guarantee selection, recommendation, or qualification in any official Indian Armed Forces selection center (including SSB Allahabad, Bhopal, Bengaluru, Kapurthala, AFSB Dehradun, Varanasi, Mysore, Gandhinagar, or NSB Vizag). Official selection rests exclusively with the official Ministry of Defence assessors.
            </div>
          </section>

          {/* Section 4 */}
          <section className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              <Lock className="w-5 h-5 text-emerald-400" />
              4. User Account &amp; Security
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>You are responsible for maintaining the confidentiality of your account login credentials.</li>
              <li>You agree to provide accurate and truthful details during registration.</li>
              <li>You may not use the service for any illegal, unauthorized, or unethical purpose.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              <FileText className="w-5 h-5 text-emerald-400" />
              5. Intellectual Property
            </h2>
            <p>
              All proprietary content, branding, trademarks, test frameworks, algorithms, and design elements on SSB AI Mentor are protected under copyright and intellectual property laws of India.
            </p>
          </section>

          {/* Section 6 */}
          <section className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              6. Contact Information
            </h2>
            <p>
              For questions regarding these Terms &amp; Conditions, please reach out via our{' '}
              <Link href="/contact" className="text-emerald-400 hover:underline">
                Contact Page
              </Link>{' '}
              or email us at <span className="text-emerald-300 font-mono">support@ssbai.app</span>.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
