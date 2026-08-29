import {
  CandidateProfile,
  EntryRule,
  CourseIntake,
  OpportunityResult,
  CycleOpportunity,
  CalculatorResult,
} from '../types';
import { evaluateEntry } from './eligibilityEngine';
import { generateCyclesForEntry } from '../cycles/cycleGenerator';

// =============================================================================
// OPPORTUNITY ENGINE
// Dynamically projects future cycles, counts total attempts left, detects
// last-chance cycles, and builds the final CalculatorResult for the UI.
// =============================================================================

export function calculateOpportunities(
  candidate: CandidateProfile,
  entry: EntryRule,
  providedCycles?: CourseIntake[],
): OpportunityResult {
  // Dynamically generate all eligible current & future cycles based on candidate DOB
  let entryCycles = generateCyclesForEntry(entry, candidate.dob, candidate);

  // If providedCycles is passed and contains official cycles, merge/override official data
  if (providedCycles && providedCycles.length > 0) {
    const staticForEntry = providedCycles.filter((c) => c.entryId === entry.entryId);
    if (staticForEntry.length > 0) {
      // Map static cycles into entryCycles if missing or replace matching dates
      const staticIds = new Set(staticForEntry.map((s) => s.cycleId));
      entryCycles = [
        ...staticForEntry,
        ...entryCycles.filter((g) => !staticIds.has(g.cycleId)),
      ];
    }
  }

  if (entryCycles.length === 0) {
    return {
      entryId: entry.entryId,
      entry,
      confirmedEligible: 0,
      projectedEligible: 0,
      totalOpportunities: 0,
      notEligible: 0,
      cycles: [],
      isLastChance: false,
      isPermanentlyBarred: false,
      overallStatus: 'NOT_ELIGIBLE',
    };
  }

  // Sort cycles by course commencement date ascending
  const sorted = [...entryCycles].sort(
    (a, b) =>
      new Date(a.courseCommencementDate).getTime() - new Date(b.courseCommencementDate).getTime(),
  );

  const cycleOpportunities: CycleOpportunity[] = sorted.map((cycle) => {
    const result = evaluateEntry(candidate, entry, cycle);
    return {
      cycleId: cycle.cycleId,
      cycleLabel: cycle.cycleLabel,
      courseCommencementDate: cycle.courseCommencementDate,
      status: cycle.status,
      temporalStatus: cycle.temporalStatus || 'FUTURE',
      eligibilityResult: result,
      isLastChance: false, // computed below
    };
  });

  // Active & future cycles (excluding expired past cycles)
  const activeAndFutureCycles = cycleOpportunities.filter(
    (c) => c.temporalStatus !== 'EXPIRED',
  );

  // Mark last chance: the last cycle where eligible or projected eligible
  const eligibleCycles = activeAndFutureCycles.filter(
    (c) => c.eligibilityResult.eligible || c.eligibilityResult.status === 'PROJECTED_ELIGIBLE',
  );

  if (eligibleCycles.length > 0) {
    const lastEligible = eligibleCycles[eligibleCycles.length - 1];
    lastEligible.isLastChance = true;
    lastEligible.eligibilityResult.isLastChance = true;
  }

  const confirmedEligible = activeAndFutureCycles.filter(
    (c) => c.eligibilityResult.status === 'ELIGIBLE',
  ).length;

  const projectedEligible = activeAndFutureCycles.filter(
    (c) => c.eligibilityResult.status === 'PROJECTED_ELIGIBLE',
  ).length;

  const notEligible = activeAndFutureCycles.filter(
    (c) =>
      c.eligibilityResult.status === 'NOT_ELIGIBLE' ||
      c.eligibilityResult.status === 'NOT_APPLICABLE',
  ).length;

  const isPermanentlyBarred = cycleOpportunities.some(
    (c) => c.eligibilityResult.isPermanentlyBarred,
  );
  const permanentBarReasons = isPermanentlyBarred
    ? cycleOpportunities
        .flatMap((c) => c.eligibilityResult.permanentBarReasons || [])
        .filter(Boolean)
        .filter((v, i, arr) => arr.indexOf(v) === i)
    : [];

  // Determine age expiry year — last year any cycle is eligible
  const ageExpiryYear =
    eligibleCycles.length > 0
      ? new Date(eligibleCycles[eligibleCycles.length - 1].courseCommencementDate).getFullYear()
      : undefined;

  // Overall status
  let overallStatus: OpportunityResult['overallStatus'] = 'NOT_ELIGIBLE';
  if (isPermanentlyBarred) {
    overallStatus = 'PERMANENTLY_BARRED';
  } else if (confirmedEligible > 0) {
    overallStatus = 'ELIGIBLE';
  } else if (projectedEligible > 0) {
    overallStatus = 'PROJECTED';
  } else if (
    cycleOpportunities.length > 0 &&
    cycleOpportunities.every((c) => c.eligibilityResult.status === 'NOT_APPLICABLE')
  ) {
    overallStatus = 'NOT_APPLICABLE';
  }

  return {
    entryId: entry.entryId,
    entry,
    confirmedEligible,
    projectedEligible,
    totalOpportunities: confirmedEligible + projectedEligible,
    notEligible,
    cycles: cycleOpportunities,
    ageExpiryYear,
    isLastChance: eligibleCycles.length === 1,
    isPermanentlyBarred,
    permanentBarReasons,
    overallStatus,
  };
}

export function runCalculator(
  candidate: CandidateProfile,
  entries: EntryRule[],
  allCycles?: CourseIntake[],
): CalculatorResult {
  const results: OpportunityResult[] = entries.map((entry) =>
    calculateOpportunities(candidate, entry, allCycles),
  );

  const eligible = results.filter((r) => r.overallStatus === 'ELIGIBLE');
  const projected = results.filter((r) => r.overallStatus === 'PROJECTED');
  const notEligible = results.filter((r) => r.overallStatus === 'NOT_ELIGIBLE');
  const notApplicable = results.filter((r) => r.overallStatus === 'NOT_APPLICABLE');
  const permanentlyBarred = results.filter((r) => r.overallStatus === 'PERMANENTLY_BARRED');

  const totalOpportunities = results.reduce((acc, r) => acc + r.totalOpportunities, 0);

  return {
    candidate,
    calculatedAt: new Date().toISOString(),
    eligible,
    projected,
    notEligible,
    notApplicable,
    permanentlyBarred,
    totalEntries: entries.length,
    totalOpportunities,
  };
}
