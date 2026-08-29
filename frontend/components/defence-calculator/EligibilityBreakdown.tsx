'use client';

import React, { useState } from 'react';
import { OpportunityResult, ConditionDetail, EligibilityResult, CycleOpportunity } from '@/lib/defence/types';
import {
  CheckCircle2, XCircle, Clock, AlertTriangle, ExternalLink,
  ChevronDown, ChevronUp, Shield, Plane, Anchor, LifeBuoy, Sparkles, History, Zap,
} from 'lucide-react';

interface EligibilityBreakdownProps {
  result: OpportunityResult;
}

const CONDITION_LABELS: Record<string, string> = {
  age: 'Age / DOB Window',
  gender: 'Gender',
  maritalStatus: 'Marital Status',
  nationality: 'Nationality',
  educationLevel: 'Education Level',
  class12: 'Class 12',
  graduation: 'Graduation',
  postGraduation: 'Post-Graduation',
  law: 'LLB Degree',
  ncc: 'NCC Certificate',
  jee: 'JEE Main',
  gate: 'GATE Score',
  cpl: 'Pilot Licence (CPL)',
  cpss: 'CPSS / PABT',
  inService: 'Service Status',
};

function ConditionIcon({ result }: { result: string }) {
  if (result === 'PASS') return <CheckCircle2 size={15} className="dc-cond-pass" />;
  if (result === 'FAIL') return <XCircle size={15} className="dc-cond-fail" />;
  if (result === 'NOT_APPLICABLE') return null;
  return <Clock size={15} className="dc-cond-unknown" />;
}

function CycleRow({ cycle }: { cycle: CycleOpportunity }) {
  const [open, setOpen] = useState(false);
  const r = cycle.eligibilityResult;

  const isExpired = cycle.temporalStatus === 'EXPIRED';
  const isCurrent = cycle.temporalStatus === 'CURRENT';
  const isEligible = r.eligible || r.status === 'ELIGIBLE' || r.status === 'PROJECTED_ELIGIBLE';

  const statusClass =
    isExpired
      ? 'dc-cycle-expired'
      : isEligible
      ? 'dc-cycle-eligible'
      : r.status === 'NOT_APPLICABLE'
      ? 'dc-cycle-na'
      : 'dc-cycle-ineligible';

  const statusLabel =
    isExpired
      ? '⌛ Expired'
      : isEligible
      ? '✅ Eligible'
      : r.status === 'NOT_APPLICABLE'
      ? '⬜ N/A'
      : '❌ Not Eligible';

  return (
    <div className={`dc-cycle-row ${cycle.isLastChance && !isExpired ? 'dc-cycle-last-chance' : ''} ${isExpired ? 'dc-cycle-expired-row' : ''}`}>
      <div className="dc-cycle-header" onClick={() => setOpen((o) => !o)}>
        <div className="dc-cycle-meta">
          <span className="dc-cycle-label">{cycle.cycleLabel}</span>
          
          {isCurrent && (
            <span className="dc-current-badge">⚡ Currently Active</span>
          )}

          {isExpired && (
            <span className="dc-expired-badge">⌛ Past Expired</span>
          )}

          {cycle.isLastChance && !isExpired && (
            <span className="dc-last-chance-badge">
              <AlertTriangle size={11} /> Last Chance
            </span>
          )}
        </div>
        <div className="dc-cycle-right">
          <span className={`dc-cycle-status ${statusClass}`}>{statusLabel}</span>
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </div>

      {open && (
        <div className="dc-cycle-detail">
          {r.ageDetail && (
            <div className="dc-age-window">
              <span>DOB window:</span>
              <strong>{r.ageDetail.dobMin}</strong> to <strong>{r.ageDetail.dobMax}</strong>
              <span className="dc-age-ref">({r.ageDetail.referenceType.replace(/_/g, ' ')} {r.ageDetail.referenceDate})</span>
            </div>
          )}
          <div className="dc-conditions-list">
            {Object.entries(r.conditions).map(([key, cond]) => {
              if (cond.result === 'NOT_APPLICABLE') return null;
              return (
                <div key={key} className={`dc-condition ${cond.result === 'PASS' ? 'pass' : 'fail'}`}>
                  <ConditionIcon result={cond.result} />
                  <div className="dc-condition-content">
                    <span className="dc-condition-label">{cond.label || CONDITION_LABELS[key] || key}</span>
                    {cond.value && <span className="dc-condition-value">You: {cond.value}</span>}
                    {cond.required && cond.result === 'FAIL' && (
                      <span className="dc-condition-required">Required: {cond.required}</span>
                    )}
                    {cond.explanation && cond.result === 'FAIL' && (
                      <span className="dc-condition-explanation">{cond.explanation}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {r.source?.url && (
            <a href={r.source.url} target="_blank" rel="noopener noreferrer" className="dc-source-link">
              <ExternalLink size={12} />
              {r.source.title}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

const SERVICE_COLORS: Record<string, string> = {
  Army: '#4ade80',
  Navy: '#60a5fa',
  'Air Force': '#22d3ee',
  'Coast Guard': '#fb923c',
};

const SERVICE_ICONS: Record<string, React.ComponentType<any>> = {
  Army: Shield,
  Navy: Anchor,
  'Air Force': Plane,
  'Coast Guard': LifeBuoy,
};

type CycleTabFilter = 'REMAINING' | 'CURRENT' | 'FUTURE' | 'EXPIRED';

export default function EligibilityBreakdown({ result }: EligibilityBreakdownProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<CycleTabFilter>('REMAINING');

  const { entry, cycles, overallStatus, totalOpportunities, confirmedEligible, projectedEligible } = result;

  const ServiceIcon = SERVICE_ICONS[entry.service] || Shield;
  const accentColor = SERVICE_COLORS[entry.service] || '#4ade80';

  const currentCycles = cycles.filter((c) => c.temporalStatus === 'CURRENT');
  const futureCycles = cycles.filter((c) => c.temporalStatus === 'FUTURE');
  const expiredCycles = cycles.filter((c) => c.temporalStatus === 'EXPIRED');
  const remainingCycles = cycles.filter((c) => c.temporalStatus !== 'EXPIRED');

  const displayedCycles =
    activeTab === 'CURRENT'
      ? currentCycles
      : activeTab === 'FUTURE'
      ? futureCycles
      : activeTab === 'EXPIRED'
      ? expiredCycles
      : remainingCycles;

  const statusBadgeClass =
    overallStatus === 'ELIGIBLE'
      ? 'dc-badge-eligible'
      : overallStatus === 'PROJECTED'
      ? 'dc-badge-projected'
      : overallStatus === 'PERMANENTLY_BARRED'
      ? 'dc-badge-barred'
      : overallStatus === 'NOT_APPLICABLE'
      ? 'dc-badge-na'
      : 'dc-badge-ineligible';

  const statusText =
    overallStatus === 'ELIGIBLE'
      ? `✅ Eligible — ${totalOpportunities} Attempt${totalOpportunities !== 1 ? 's' : ''} (${confirmedEligible} Confirmed${projectedEligible > 0 ? `, ${projectedEligible} Projected` : ''})`
      : overallStatus === 'PROJECTED'
      ? `🟡 Projected — ${totalOpportunities} Attempt${totalOpportunities !== 1 ? 's' : ''} (${projectedEligible} Projected)`
      : overallStatus === 'PERMANENTLY_BARRED'
      ? '🚫 Permanently Barred'
      : overallStatus === 'NOT_APPLICABLE'
      ? '⬜ Not Applicable'
      : '❌ Not Eligible';

  return (
    <div className="dc-breakdown-card" style={{ borderColor: accentColor + '30' }}>
      {/* Card header */}
      <div
        className="dc-breakdown-header"
        style={{ borderLeftColor: accentColor }}
        onClick={() => setCollapsed((c) => !c)}
      >
        <div className="dc-breakdown-title-row">
          <ServiceIcon size={18} style={{ color: accentColor }} />
          <div>
            <div className="dc-breakdown-name">{entry.entryFullName}</div>
            <div className="dc-breakdown-service" style={{ color: accentColor }}>
              {entry.service} · {entry.commissionType || 'Commission'}
            </div>
          </div>
        </div>
        <div className="dc-breakdown-right">
          <span className={`dc-status-badge ${statusBadgeClass}`}>{statusText}</span>
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </div>
      </div>

      {!collapsed && (
        <div className="dc-breakdown-body">
          {result.isPermanentlyBarred && result.permanentBarReasons && (
            <div className="dc-permanent-bar-note">
              <AlertTriangle size={16} />
              {result.permanentBarReasons.join(' ')}
            </div>
          )}

          {/* Opportunity summary strip */}
          {totalOpportunities > 0 && (
            <div className="dc-opp-strip">
              <div className="dc-opp-item dc-opp-confirmed">
                <CheckCircle2 size={14} />
                {confirmedEligible} confirmed
              </div>
              <div className="dc-opp-item dc-opp-proj">
                <Clock size={14} />
                {projectedEligible} projected
              </div>
              {result.ageExpiryYear && (
                <div className="dc-opp-item dc-opp-expiry">
                  Age window closes {result.ageExpiryYear}
                </div>
              )}
            </div>
          )}

          {/* Temporal Sub-Tabs Switcher */}
          {cycles.length > 0 && (
            <div className="dc-cycle-tabs">
              <button
                type="button"
                className={`dc-tab-btn ${activeTab === 'REMAINING' ? 'active' : ''}`}
                onClick={() => setActiveTab('REMAINING')}
              >
                <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Remaining Attempts ({remainingCycles.length})
              </button>

              {currentCycles.length > 0 && (
                <button
                  type="button"
                  className={`dc-tab-btn ${activeTab === 'CURRENT' ? 'active' : ''}`}
                  onClick={() => setActiveTab('CURRENT')}
                >
                  <Zap size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Current Active ({currentCycles.length})
                </button>
              )}

              {futureCycles.length > 0 && (
                <button
                  type="button"
                  className={`dc-tab-btn ${activeTab === 'FUTURE' ? 'active' : ''}`}
                  onClick={() => setActiveTab('FUTURE')}
                >
                  🚀 Future ({futureCycles.length})
                </button>
              )}

              {expiredCycles.length > 0 && (
                <button
                  type="button"
                  className={`dc-tab-btn ${activeTab === 'EXPIRED' ? 'active' : ''}`}
                  onClick={() => setActiveTab('EXPIRED')}
                >
                  <History size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Past / Expired ({expiredCycles.length})
                </button>
              )}
            </div>
          )}

          {/* Cycles */}
          {displayedCycles.length > 0 ? (
            <div className="dc-cycles-list">
              {displayedCycles.map((c) => (
                <CycleRow key={c.cycleId} cycle={c} />
              ))}
            </div>
          ) : (
            <div className="dc-no-cycles">
              No cycles found under this view.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
