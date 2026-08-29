// =============================================================================
// PUBLIC API — Defence Entry Calculator Engine
// Import from this file in UI components.
// =============================================================================

export type {
  CandidateProfile,
  EntryRule,
  CourseIntake,
  EligibilityResult,
  OpportunityResult,
  CalculatorResult,
  CycleOpportunity,
  ConditionDetail,
  ConditionResult,
  ServiceType,
  GenderRule,
  EntryStatus,
  EducationLevel,
  EngineeringBranch,
  NCCWing,
  NCCCertificate,
  CPSSResult,
  SSBResult,
} from '../types';

export { evaluateEntry } from './eligibilityEngine';
export { calculateOpportunities, runCalculator } from './opportunityEngine';
export { generateCyclesForEntry, ENTRY_ANCHOR_SPECS } from '../cycles/cycleGenerator';

// Entry data
import { ARMY_ENTRIES } from '../entries/army';
import { NAVY_ENTRIES } from '../entries/navy';
import { AIRFORCE_ENTRIES } from '../entries/airforce';
import { COASTGUARD_ENTRIES } from '../entries/coastguard';
import { OFFICIAL_CYCLES } from '../cycles/officialCycles';

export const ALL_ENTRIES = [
  ...ARMY_ENTRIES,
  ...NAVY_ENTRIES,
  ...AIRFORCE_ENTRIES,
  ...COASTGUARD_ENTRIES,
];

export const ALL_CYCLES = OFFICIAL_CYCLES;

export { ARMY_ENTRIES, NAVY_ENTRIES, AIRFORCE_ENTRIES, COASTGUARD_ENTRIES, OFFICIAL_CYCLES };
