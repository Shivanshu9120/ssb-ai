'use client';

import React, { useState, useMemo } from 'react';
import { CalculatorResult, OpportunityResult, ServiceType } from '@/lib/defence/types';
import EligibilityBreakdown from './EligibilityBreakdown';
import {
  RotateCcw, Search, Shield, Plane, Anchor, LifeBuoy, Layers,
  CheckCircle2, Clock, XCircle, AlertTriangle, TrendingUp,
} from 'lucide-react';

interface ResultsPageProps {
  result: CalculatorResult;
  onReset: () => void;
}

type Tab = 'All' | ServiceType;
const TABS: Tab[] = ['All', 'Army', 'Navy', 'Air Force', 'Coast Guard'];

const SERVICE_ICONS: Record<string, React.ComponentType<any>> = {
  All: Layers,
  Army: Shield,
  Navy: Anchor,
  'Air Force': Plane,
  'Coast Guard': LifeBuoy,
};

const SERVICE_COLORS: Record<string, string> = {
  Army: '#4ade80',
  Navy: '#60a5fa',
  'Air Force': '#22d3ee',
  'Coast Guard': '#fb923c',
};

function formatDOB(dob: string) {
  const d = new Date(dob + 'T00:00:00Z');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ResultsPage({ result, onReset }: ResultsPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState<'all' | 'eligible' | 'projected' | 'not_eligible'>('all');

  const allResults = useMemo(
    () => [
      ...result.eligible,
      ...result.projected,
      ...result.notEligible,
      ...result.permanentlyBarred,
      ...result.notApplicable,
    ],
    [result],
  );

  const filtered = useMemo(() => {
    let list = allResults;

    if (activeTab !== 'All') {
      list = list.filter((r) => r.entry.service === activeTab);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.entry.entryName.toLowerCase().includes(q) ||
          r.entry.entryFullName.toLowerCase().includes(q) ||
          r.entry.service.toLowerCase().includes(q),
      );
    }

    if (showFilter === 'eligible') list = list.filter((r) => r.overallStatus === 'ELIGIBLE');
    if (showFilter === 'projected')
      list = list.filter((r) => r.overallStatus === 'ELIGIBLE' || r.overallStatus === 'PROJECTED');
    if (showFilter === 'not_eligible')
      list = list.filter((r) => r.overallStatus === 'NOT_ELIGIBLE' || r.overallStatus === 'PERMANENTLY_BARRED');

    return list;
  }, [allResults, activeTab, search, showFilter]);

  const candidateDOB = formatDOB(result.candidate.dob);

  return (
    <div className="dc-results-wrapper">
      {/* Header */}
      <div className="dc-results-header">
        <div className="dc-results-header-top">
          <div>
            <h1 className="dc-results-title">Your Eligibility Report</h1>
            <p className="dc-results-sub">
              Based on DOB: <strong>{candidateDOB}</strong> · {result.candidate.gender} ·{' '}
              {result.candidate.maritalStatus}
              {result.candidate.isCurrentlyServing && ` · Serving (${result.candidate.servingService || ''})`}
            </p>
          </div>
          <button className="dc-reset-btn" onClick={onReset}>
            <RotateCcw size={15} />
            New Calculation
          </button>
        </div>

        {/* Summary cards */}
        <div className="dc-summary-cards">
          <div className="dc-summary-card dc-summary-eligible">
            <CheckCircle2 size={22} />
            <div className="dc-summary-num">{result.eligible.length}</div>
            <div className="dc-summary-label">Confirmed Eligible</div>
          </div>
          <div className="dc-summary-card dc-summary-projected">
            <Clock size={22} />
            <div className="dc-summary-num">{result.projected.length}</div>
            <div className="dc-summary-label">Projected Eligible</div>
          </div>
          <div className="dc-summary-card dc-summary-opportunities">
            <TrendingUp size={22} />
            <div className="dc-summary-num">{result.totalOpportunities}</div>
            <div className="dc-summary-label">Total Opportunities</div>
          </div>
          <div className="dc-summary-card dc-summary-not">
            <XCircle size={22} />
            <div className="dc-summary-num">
              {result.notEligible.length + result.permanentlyBarred.length}
            </div>
            <div className="dc-summary-label">Not Eligible</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="dc-results-controls">
        {/* Service tabs */}
        <div className="dc-service-tabs">
          {TABS.map((tab) => {
            const Icon = SERVICE_ICONS[tab];
            const count =
              tab === 'All'
                ? allResults.length
                : allResults.filter((r) => r.entry.service === tab).length;
            const color = tab !== 'All' ? SERVICE_COLORS[tab] : undefined;
            return (
              <button
                key={tab}
                className={`dc-service-tab ${activeTab === tab ? 'active' : ''}`}
                style={activeTab === tab && color ? { borderColor: color, color } : undefined}
                onClick={() => setActiveTab(tab)}
              >
                <Icon size={14} />
                {tab}
                <span className="dc-tab-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Search + filter */}
        <div className="dc-search-filter-row">
          <div className="dc-search-box">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search entries…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="dc-search-input"
            />
          </div>
          <div className="dc-filter-pills">
            {(
              [
                { v: 'all', label: 'All' },
                { v: 'eligible', label: '✅ Confirmed' },
                { v: 'projected', label: '🟡 + Projected' },
                { v: 'not_eligible', label: '❌ Not Eligible' },
              ] as { v: typeof showFilter; label: string }[]
            ).map(({ v, label }) => (
              <button
                key={v}
                className={`dc-filter-pill ${showFilter === v ? 'active' : ''}`}
                onClick={() => setShowFilter(v)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="dc-disclaimer">
        <AlertTriangle size={14} />
        Eligibility is calculated using rules from the latest available official notifications.
        Always verify against the official notification for your specific course. Rules change between notification cycles.
      </div>

      {/* Results list */}
      <div className="dc-results-list">
        {filtered.length === 0 ? (
          <div className="dc-no-results">
            No entries match your current filter. Try adjusting the service tab or search query.
          </div>
        ) : (
          filtered.map((r) => <EligibilityBreakdown key={r.entryId} result={r} />)
        )}
      </div>
    </div>
  );
}
