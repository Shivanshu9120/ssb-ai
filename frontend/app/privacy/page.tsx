import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Lock, Eye, Database, Shield, Cpu, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | SSB AI Mentor',
  description: 'Privacy Policy detailing data safety, usage policies, and user privacy protections on SSB AI Mentor.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090d09] text-slate-200">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Title */}
        <div className="mb-10 text-center sm:text-left border-b border-emerald-900/30 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-4">
            <Lock className="w-3.5 h-3.5" /> Effective Date: July 2026
          </div>
          <h1
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide mb-3"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
            We value your privacy. This policy outlines how SSB AI Mentor collects, processes, and protects your personal data when using our preparation platform.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-slate-300">
          
          {/* Section 1 */}
          <section className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              <Eye className="w-5 h-5 text-emerald-400" />
              1. Information We Collect
            </h2>
            <p>
              When you use SSB AI Mentor, we may collect the following categories of information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li><strong>Account Information:</strong> Email address, user name, and authentication credentials provided during sign-up.</li>
              <li><strong>Practice Submissions:</strong> PPDT stories, TAT responses, WAT word associations, and SRT solutions submitted for AI evaluation.</li>
              <li><strong>Technical Data:</strong> IP address, device type, browser metadata, and session activity logs.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              <Cpu className="w-5 h-5 text-emerald-400" />
              2. How We Use Your Data &amp; AI Processing
            </h2>
            <p>
              Your data is exclusively used to deliver and personalize your SSB interview preparation experience:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>Generating Officer Like Qualities (OLQ) scores and diagnostic evaluations.</li>
              <li>Maintaining your historical practice record and progress dashboards.</li>
              <li>Improving AI response accuracy and platform responsiveness.</li>
            </ul>
            <p className="text-xs text-emerald-400 font-mono pt-2">
              🔒 Note: We do NOT sell or trade your personal information or test submissions to third-party advertisers.
            </p>
          </section>

          {/* Section 3 */}
          <section className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              <Database className="w-5 h-5 text-emerald-400" />
              3. Data Security &amp; Encryption
            </h2>
            <p>
              We implement industry-standard security measures, including HTTPS SSL encryption, secure database authentication (Supabase), and access restrictions to safeguard your data against unauthorized access.
            </p>
          </section>

          {/* Section 4 */}
          <section className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              <Shield className="w-5 h-5 text-emerald-400" />
              4. Your Privacy Rights
            </h2>
            <p>
              You have the right to request access to your stored practice records, update your profile details, or request account deletion at any time by contacting our support team.
            </p>
          </section>

          {/* Section 5 */}
          <section className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              <Mail className="w-5 h-5 text-emerald-400" />
              5. Contact Us Regarding Data Privacy
            </h2>
            <p>
              If you have any questions or data removal requests, please write to us at{' '}
              <span className="text-emerald-300 font-mono">privacy@ssbai.app</span> or visit our{' '}
              <Link href="/contact" className="text-emerald-400 hover:underline">
                Contact Page
              </Link>.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
