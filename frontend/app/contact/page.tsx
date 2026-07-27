'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, MessageSquare, Send, CheckCircle2, Clock, MapPin, Shield, HelpCircle, PhoneCall } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'SSB Guidance & Coaching',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d09] text-slate-200">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-4">
            <MessageSquare className="w-3.5 h-3.5" /> 24/7 Defense Aspirant Support
          </div>
          <h1
            className="text-3xl sm:text-5xl font-extrabold text-white tracking-wide mb-4"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            Contact SSB AI Support Team
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Have questions about psychological tests, Officer Like Qualities (OLQ) evaluations, or technical support? Our team is dedicated to serving defence aspirants across India.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Support Info Cards (Column 1) */}
          <div className="space-y-6">
            
            <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-900/40 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/50 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  Direct Email
                </h3>
                <p className="text-xs text-slate-400 mt-1">Our support team responds within 24 business hours.</p>
                <a href="mailto:support@ssbai.app" className="text-sm font-mono text-emerald-400 hover:underline block mt-2">
                  support@ssbai.app
                </a>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-900/40 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/50 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  Response SLA
                </h3>
                <p className="text-xs text-slate-400 mt-1">Dedicated helpdesk for active SSB candidates preparing for upcoming board calls.</p>
                <span className="text-xs text-emerald-300 font-semibold block mt-2">
                  Mon - Sat: 09:00 AM - 08:00 PM IST
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-900/40 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/50 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  HQ &amp; Serving Candidates
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Built for Indian Army, Navy, and Air Force aspirants preparing for CDS, NDA, AFCAT &amp; Direct Entries.
                </p>
                <span className="text-xs text-slate-400 block mt-2">
                  📍 New Delhi, India 🇮🇳
                </span>
              </div>
            </div>

          </div>

          {/* Contact Form (Columns 2 & 3) */}
          <div className="lg:col-span-2 p-8 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 backdrop-blur-md">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-900/50 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  Message Received!
                </h2>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Thank you for reaching out, candidate. Our support team will review your query and reply to <span className="text-emerald-300 font-mono">{formData.email}</span> shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', category: 'SSB Guidance & Coaching', subject: '', message: '' });
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 transition-colors uppercase tracking-wider"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-emerald-900/30 pb-4">
                  <h2 className="text-xl font-bold text-white uppercase tracking-wide" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    Send Us a Message
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Fill in the form below and our team will get back to you.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Cadet Rahul Sharma"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-900/90 border border-emerald-900/50 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="cadet@example.com"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-900/90 border border-emerald-900/50 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Query Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-900/90 border border-emerald-900/50 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="SSB Guidance & Coaching">SSB Guidance &amp; OLQ Evaluation</option>
                      <option value="Technical Support">Technical &amp; Account Support</option>
                      <option value="Feedback & Suggestions">Platform Feedback &amp; Suggestions</option>
                      <option value="Institutional Inquiry">Institutional / Academy Partnership</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Brief title of your query"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-900/90 border border-emerald-900/50 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Detailed Message
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your issue or query in detail..."
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900/90 border border-emerald-900/50 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl font-bold text-xs text-white uppercase tracking-widest bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:to-emerald-500 border border-emerald-500/40 shadow-[0_0_20px_rgba(45,90,27,0.4)] flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                >
                  {submitting ? (
                    <span>Submitting Message...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
