'use client';

import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

interface LastChanceAlertProps {
  entryName: string;
  cycleLabel: string;
  courseCommencementDate: string;
  isProjected?: boolean;
}

export default function LastChanceAlert({
  entryName,
  cycleLabel,
  courseCommencementDate,
  isProjected = false,
}: LastChanceAlertProps) {
  const year = new Date(courseCommencementDate).getFullYear();

  return (
    <div className="defence-last-chance">
      <AlertTriangle size={16} className="defence-last-chance-icon" />
      <div className="defence-last-chance-content">
        <span className="defence-last-chance-title">Last Projected Opportunity</span>
        <span className="defence-last-chance-desc">
          {cycleLabel} ({year}) appears to be your final window for{' '}
          <strong>{entryName}</strong>.
          {isProjected && (
            <span className="defence-last-chance-proj">
              {' '}
              This cycle is <em>projected</em> — not yet officially announced.
            </span>
          )}
        </span>
      </div>
      <div className="defence-last-chance-badge">
        <Clock size={12} />
        {year}
      </div>
    </div>
  );
}
