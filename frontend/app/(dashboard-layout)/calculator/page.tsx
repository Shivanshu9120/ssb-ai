'use client';

import React, { useState } from 'react';
import { CandidateProfile, CalculatorResult } from '@/lib/defence/types';
import { ALL_ENTRIES, ALL_CYCLES, runCalculator } from '@/lib/defence/engine';
import ProfileForm from '@/components/defence-calculator/ProfileForm';
import ResultsPage from '@/components/defence-calculator/ResultsPage';

type PageState = 'form' | 'calculating' | 'results';

export default function CalculatorPage() {
  const [state, setState] = useState<PageState>('form');
  const [calculatorResult, setCalculatorResult] = useState<CalculatorResult | null>(null);

  const handleSubmit = (profile: CandidateProfile) => {
    setState('calculating');
    // Run synchronously but give UI a tick to show loading
    setTimeout(() => {
      const result = runCalculator(profile, ALL_ENTRIES, ALL_CYCLES);
      setCalculatorResult(result);
      setState('results');
    }, 600);
  };

  const handleReset = () => {
    setCalculatorResult(null);
    setState('form');
  };

  return (
    <div className="dc-page">
      {state === 'form' && <ProfileForm onSubmit={handleSubmit} />}

      {state === 'calculating' && (
        <div className="dc-loading-screen">
          <div className="dc-loading-spinner" />
          <p className="dc-loading-text">Evaluating eligibility across all entries…</p>
        </div>
      )}

      {state === 'results' && calculatorResult && (
        <ResultsPage result={calculatorResult} onReset={handleReset} />
      )}
    </div>
  );
}
