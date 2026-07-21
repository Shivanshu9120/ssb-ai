'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Cpu, 
  Check, 
  Sparkles, 
  Award, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  HelpCircle, 
  X, 
  ChevronRight, 
  Info,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/api';

interface PlanDetail {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  tokenQuota: string;
  badge?: string;
  isPopular?: boolean;
  features: string[];
}

export default function BillingPage() {
  const { user, profile, loading: authLoading } = useAuth();
  
  // Usage state
  const [usage, setUsage] = useState<any>(null);
  const [loadingUsage, setLoadingUsage] = useState(false);

  // Modal State
  const [selectedPlanModal, setSelectedPlanModal] = useState<PlanDetail | null>(null);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  // Fetch token usage details
  useEffect(() => {
    const fetchUsage = async () => {
      try {
        setLoadingUsage(true);
        const data = await apiService.getUsage();
        const todayStr = new Date().toISOString().split('T')[0];
        const todayData = data.find((u: any) => u.day === todayStr) || { total_tokens: 0, cost: 0.0 };
        setUsage(todayData);
      } catch (err) {
        console.error('Failed to load usage in Billing page:', err);
      } finally {
        setLoadingUsage(false);
      }
    };
    if (user && !authLoading) {
      fetchUsage();
    }
  }, [user, authLoading]);

  const plans: PlanDetail[] = [
    {
      id: 'free',
      name: 'Free Cadre',
      price: '$0',
      period: 'Forever Free',
      description: 'Essential AI coaching and vector knowledge search for SSB preparation.',
      tokenQuota: '100,000 Tokens / Day',
      features: [
        '100k daily Gemini AI token quota',
        'Standard Pinecone vector database RAG search',
        'Access to basic SSB Study Hub guides',
        'Standard response generation speeds',
        'Community support'
      ]
    },
    {
      id: 'pro',
      name: 'Officer Pro',
      price: '$19',
      period: 'per month',
      description: 'Recommended for serious candidates targeting NDA, CDS, & AFCAT SSBs.',
      tokenQuota: '500,000 Tokens / Day',
      badge: 'Most Popular',
      isPopular: true,
      features: [
        '500k daily Gemini AI token quota',
        'Advanced vector RAG reranking algorithm',
        'Psychology Test evaluator (TAT, WAT, SRT analysis)',
        'Custom PDF & document upload & Pinecone indexing',
        'Priority response latency',
        'Dedicated officer preparation timeline'
      ]
    },
    {
      id: 'elite',
      name: 'Commandant Elite',
      price: '$49',
      period: 'per month',
      description: 'Maximum AI intelligence quota for intensive SSB interview prep.',
      tokenQuota: 'Unlimited Tokens',
      badge: 'Ultimate Tier',
      features: [
        'Unlimited AI token quota',
        'Custom isolated Pinecone namespace storage',
        'Full GTO & Personal Interview AI mock simulations',
        'Unlimited custom document vector ingestion',
        'Sub-second query response speeds',
        '24/7 priority mentor support & analytics'
      ]
    }
  ];

  const totalTokens = usage?.total_tokens || 0;
  const tokenQuotaPercent = Math.min(100, (totalTokens / 100000) * 100);
  const currentPlanName = profile?.plan || 'Free Cadre';

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <CreditCard className="w-7 h-7 text-amber-500" /> Billing & Subscription
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Monitor your daily token usage, current tier status, and explore available officer plans.
          </p>
        </div>

        <button
          onClick={() => setShowComparisonModal(true)}
          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold flex items-center gap-2 transition-all w-fit shadow-sm"
        >
          <Info className="w-4 h-4 text-amber-500" /> Compare All Plan Details
        </button>
      </div>

      {/* Grid: Current Plan & Token Usage Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Current Plan Summary Card */}
        <div className="p-6 rounded-2xl bg-[#131313] border border-zinc-900 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
              Active Tier
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{currentPlanName}</h2>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Subscription Active
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-900 mt-4 space-y-1">
            <span className="text-xs text-zinc-400 font-medium block">Included Token Allowance</span>
            <span className="text-sm font-extrabold text-amber-400 font-mono">100,000 Tokens / Day</span>
          </div>
        </div>

        {/* Daily Token Usage Meter */}
        <div className="p-6 rounded-2xl bg-[#131313] border border-zinc-900 shadow-xl flex flex-col justify-between md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-500" /> Daily Token Usage
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Real-time tracking of Gemini model tokens used in vector search and chat queries today.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-zinc-300 bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-800">
              {(totalTokens / 1000).toFixed(1)}k / 100k
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden p-0.5 border border-zinc-800">
              <div 
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500 shadow-sm shadow-amber-500/30"
                style={{ width: `${tokenQuotaPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-500">
              <span>{tokenQuotaPercent.toFixed(1)}% of daily quota consumed</span>
              <span>Resets automatically at 00:00 UTC</span>
            </div>
          </div>

          {/* Metrics summary footer */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-900">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase block">Estimated Daily Cost</span>
                <span className="text-xs font-mono font-bold text-emerald-400">${(usage?.cost || 0.00039).toFixed(5)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-amber-500" />
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase block">Vector Model</span>
                <span className="text-xs font-semibold text-zinc-300">Gemini-text-embedding-004</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans Tiers Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" /> Available Subscription Plans
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Upgrade your intelligence quota to unlock full TAT story evaluations, high-frequency RAG searches, and officer interview simulations.
          </p>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = currentPlanName.toLowerCase().includes(plan.id);
            return (
              <div 
                key={plan.id}
                className={`p-6 rounded-2xl bg-[#131313] border flex flex-col justify-between relative transition-all duration-200 ${
                  plan.isPopular 
                    ? 'border-amber-500/60 shadow-2xl shadow-amber-500/5 bg-gradient-to-b from-[#181610] to-[#131313]' 
                    : 'border-zinc-900 hover:border-zinc-800'
                }`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <span className={`absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    plan.isPopular ? 'bg-amber-500 text-black shadow-md' : 'bg-zinc-800 text-zinc-300'
                  }`}>
                    {plan.badge}
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1 min-h-[32px]">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">{plan.price}</span>
                    <span className="text-xs text-zinc-500 font-medium">{plan.period}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 text-xs font-mono font-bold text-amber-400">
                    {plan.tokenQuota}
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2.5 pt-2 border-t border-zinc-900 text-xs text-zinc-300">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action Button */}
                <div className="pt-6 space-y-2">
                  <button
                    onClick={() => setSelectedPlanModal(plan)}
                    className={`w-full py-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      isCurrent
                        ? 'bg-zinc-800 text-zinc-400 cursor-default border border-zinc-700'
                        : plan.isPopular
                        ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/10 hover:scale-[1.01]'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                    }`}
                  >
                    {isCurrent ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Current Active Plan
                      </>
                    ) : (
                      <>
                        Upgrade to {plan.name} <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedPlanModal(plan)}
                    className="w-full text-center text-[11px] font-semibold text-zinc-500 hover:text-amber-400 transition-colors pt-1"
                  >
                    View detailed plan specs
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal 1: Individual Plan Details Modal */}
      {selectedPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedPlanModal(null)}
          />
          <div className="relative bg-[#18181b] border border-zinc-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl z-10 space-y-5 animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedPlanModal.name} Plan Details</h3>
                  <span className="text-xs font-mono text-amber-400">{selectedPlanModal.price} / {selectedPlanModal.period}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPlanModal(null)}
                className="text-zinc-500 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
              {selectedPlanModal.description}
            </p>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Plan Specifications & Limits</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 rounded-lg bg-[#121212] border border-zinc-800/60">
                  <span className="text-zinc-400">Daily Gemini Token Limit</span>
                  <span className="font-mono font-bold text-amber-400">{selectedPlanModal.tokenQuota}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-[#121212] border border-zinc-800/60">
                  <span className="text-zinc-400">Vector Search Method</span>
                  <span className="font-semibold text-zinc-200">Pinecone RAG Hybrid Index</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-[#121212] border border-zinc-800/60">
                  <span className="text-zinc-400">Psychology Test Evaluations</span>
                  <span className="font-semibold text-zinc-200">{selectedPlanModal.id === 'free' ? 'Standard' : 'Advanced Factor Analysis'}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-[#121212] border border-zinc-800/60">
                  <span className="text-zinc-400">Custom Document Indexing</span>
                  <span className="font-semibold text-zinc-200">{selectedPlanModal.id === 'free' ? 'Read-only' : 'Full Ingestion'}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3 border-t border-zinc-800">
              <button
                onClick={() => setSelectedPlanModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Plan selection for ${selectedPlanModal.name} initiated.`);
                  setSelectedPlanModal(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-extrabold text-black bg-amber-500 hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/10"
              >
                Select Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: All Plans Comparison Matrix Modal */}
      {showComparisonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowComparisonModal(false)}
          />
          <div className="relative bg-[#18181b] border border-zinc-800 rounded-2xl p-6 max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl z-10 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-white">Full Plan Comparison Matrix</h3>
              </div>
              <button 
                onClick={() => setShowComparisonModal(false)}
                className="text-zinc-500 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-4 pr-1">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Feature / Specification</th>
                    <th className="py-3 px-4">Free Cadre</th>
                    <th className="py-3 px-4 text-amber-400">Officer Pro</th>
                    <th className="py-3 px-4">Commandant Elite</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Monthly Price</td>
                    <td className="py-3 px-4">$0</td>
                    <td className="py-3 px-4 text-amber-400 font-bold">$19 / mo</td>
                    <td className="py-3 px-4">$49 / mo</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Daily Token Allowance</td>
                    <td className="py-3 px-4 font-mono">100,000</td>
                    <td className="py-3 px-4 font-mono text-amber-400 font-bold">500,000</td>
                    <td className="py-3 px-4 font-mono">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Vector Knowledge Base Search</td>
                    <td className="py-3 px-4">Standard</td>
                    <td className="py-3 px-4 text-amber-400">Hybrid Reranked</td>
                    <td className="py-3 px-4">Dedicated Namespace</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">TAT / WAT / SRT Psychological Evaluator</td>
                    <td className="py-3 px-4">Basic</td>
                    <td className="py-3 px-4 text-amber-400">Full 15 OLQ Factor Analysis</td>
                    <td className="py-3 px-4">Deep Psychological Feedback</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Custom PDF Upload & Ingestion</td>
                    <td className="py-3 px-4 text-zinc-600">Not Included</td>
                    <td className="py-3 px-4 text-amber-400">Up to 20 Docs</td>
                    <td className="py-3 px-4">Unlimited Storage</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Response Latency SLA</td>
                    <td className="py-3 px-4">Standard</td>
                    <td className="py-3 px-4 text-amber-400">High Speed</td>
                    <td className="py-3 px-4">Sub-second Priority</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-end flex-shrink-0">
              <button
                onClick={() => setShowComparisonModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors"
              >
                Close Matrix
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
