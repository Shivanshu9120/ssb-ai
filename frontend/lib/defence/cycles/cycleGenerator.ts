import { CourseIntake, EntryRule, CandidateProfile } from '../types';
import { OFFICIAL_CYCLES } from './officialCycles';

// =============================================================================
// DYNAMIC FUTURE CYCLE GENERATOR
// Anchors on verified notification DOB ranges and generates all future eligible
// intake cycles by advancing dobMin, dobMax, and courseCommencementDate by
// 6 months (TWICE_YEARLY) or 12 months (ANNUAL).
// =============================================================================

export interface EntryAnchorSpec {
  entryId: string;
  baseCourseCommencementDate: string; // ISO 'YYYY-MM-DD'
  baseDobMin: string;                // ISO 'YYYY-MM-DD' (Oldest DOB eligible)
  baseDobMax: string;                // ISO 'YYYY-MM-DD' (Youngest DOB eligible)
  cyclePattern: 'TWICE_YEARLY' | 'ANNUAL';
  labelTemplate: string;             // e.g. "AFCAT {seqCode}/{year}", "CDS ({seq}) {year} — IMA"
  baseCourseNumber?: number;         // e.g. 67 for SSC Tech Men, 143 for TGC, 37 for JAG, 55 for TES
  baseExamYear?: number;             // e.g. 2026 for CDS (I) 2026
  baseSeqIndex?: number;             // 0 for (I), 1 for (II)
  cplAgeRelaxationYears?: number;    // e.g. +2 years for AFCAT Flying
}

export function addMonthsToISO(isoDate: string, monthsToAdd: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1 + monthsToAdd, d));
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const ENTRY_ANCHOR_SPECS: Record<string, EntryAnchorSpec> = {
  // --- ARMY ---
  ARMY_NDA: {
    entryId: 'ARMY_NDA',
    baseCourseCommencementDate: '2027-06-01',
    baseDobMin: '2007-07-02',
    baseDobMax: '2010-07-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'NDA & NA ({seq}) {year}',
    baseExamYear: 2026,
    baseSeqIndex: 0,
  },
  ARMY_CDS_IMA: {
    entryId: 'ARMY_CDS_IMA',
    baseCourseCommencementDate: '2026-09-01',
    baseDobMin: '2002-10-02',
    baseDobMax: '2007-10-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'CDS ({seq}) {year} — IMA',
    baseExamYear: 2026,
    baseSeqIndex: 0,
  },
  ARMY_CDS_OTA: {
    entryId: 'ARMY_CDS_OTA',
    baseCourseCommencementDate: '2026-10-01',
    baseDobMin: '2001-10-02',
    baseDobMax: '2007-10-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'CDS ({seq}) {year} — OTA',
    baseExamYear: 2026,
    baseSeqIndex: 0,
  },
  ARMY_TES: {
    entryId: 'ARMY_TES',
    baseCourseCommencementDate: '2027-01-01',
    baseDobMin: '2007-01-02',
    baseDobMax: '2010-01-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'TES Course {courseNum} ({month} {courseYear})',
    baseCourseNumber: 55,
  },
  ARMY_TGC: {
    entryId: 'ARMY_TGC',
    baseCourseCommencementDate: '2027-01-01',
    baseDobMin: '2000-01-02',
    baseDobMax: '2007-01-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'TGC-{courseNum} ({month} {courseYear})',
    baseCourseNumber: 143,
  },
  ARMY_SSC_TECH_MEN: {
    entryId: 'ARMY_SSC_TECH_MEN',
    baseCourseCommencementDate: '2026-10-01',
    baseDobMin: '1999-10-02',
    baseDobMax: '2006-10-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'SSC Tech Men {courseNum} ({month} {courseYear})',
    baseCourseNumber: 67,
  },
  ARMY_SSCW_TECH: {
    entryId: 'ARMY_SSCW_TECH',
    baseCourseCommencementDate: '2026-10-01',
    baseDobMin: '1999-10-02',
    baseDobMax: '2006-10-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'SSCW Tech Women {courseNum} ({month} {courseYear})',
    baseCourseNumber: 38,
  },
  ARMY_JAG: {
    entryId: 'ARMY_JAG',
    baseCourseCommencementDate: '2026-10-01',
    baseDobMin: '1999-10-02',
    baseDobMax: '2005-10-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'JAG Entry {courseNum} ({month} {courseYear})',
    baseCourseNumber: 37,
  },
  ARMY_NCC: {
    entryId: 'ARMY_NCC',
    baseCourseCommencementDate: '2026-10-01',
    baseDobMin: '2001-10-02',
    baseDobMax: '2007-10-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'Army NCC Special Entry {courseNum} ({month} {courseYear})',
    baseCourseNumber: 60,
  },
  ARMY_ACC: {
    entryId: 'ARMY_ACC',
    baseCourseCommencementDate: '2027-01-01',
    baseDobMin: '2000-01-02',
    baseDobMax: '2007-01-01',
    cyclePattern: 'ANNUAL',
    labelTemplate: 'ACC Entry Course {courseNum} ({courseYear})',
    baseCourseNumber: 134,
  },

  // --- NAVY ---
  NAVY_NDA: {
    entryId: 'NAVY_NDA',
    baseCourseCommencementDate: '2027-06-01',
    baseDobMin: '2007-07-02',
    baseDobMax: '2010-07-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'NDA & NA ({seq}) {year} — Navy',
    baseExamYear: 2026,
    baseSeqIndex: 0,
  },
  NAVY_CDS_INA: {
    entryId: 'NAVY_CDS_INA',
    baseCourseCommencementDate: '2026-09-01',
    baseDobMin: '2002-10-02',
    baseDobMax: '2007-10-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'CDS ({seq}) {year} — INA',
    baseExamYear: 2026,
    baseSeqIndex: 0,
  },
  NAVY_10_2_BTECH: {
    entryId: 'NAVY_10_2_BTECH',
    baseCourseCommencementDate: '2027-01-01',
    baseDobMin: '2007-07-02',
    baseDobMax: '2010-01-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'Navy 10+2 B.Tech Entry ({month} {courseYear})',
  },
  NAVY_SSC_EXEC: {
    entryId: 'NAVY_SSC_EXEC',
    baseCourseCommencementDate: '2027-01-01',
    baseDobMin: '2002-01-02',
    baseDobMax: '2007-07-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'Navy SSC Executive ({month} {courseYear})',
  },
  NAVY_SSC_PILOT: {
    entryId: 'NAVY_SSC_PILOT',
    baseCourseCommencementDate: '2027-01-01',
    baseDobMin: '2003-01-02',
    baseDobMax: '2008-01-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'Navy SSC Pilot ({month} {courseYear})',
  },
  NAVY_SSC_NAO: {
    entryId: 'NAVY_SSC_NAO',
    baseCourseCommencementDate: '2027-01-01',
    baseDobMin: '2003-01-02',
    baseDobMax: '2008-01-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'Navy SSC Naval Air Operations ({month} {courseYear})',
  },
  NAVY_SSC_LOGISTICS: {
    entryId: 'NAVY_SSC_LOGISTICS',
    baseCourseCommencementDate: '2027-01-01',
    baseDobMin: '2002-01-02',
    baseDobMax: '2007-07-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'Navy SSC Logistics ({month} {courseYear})',
  },
  NAVY_SSC_EDUCATION: {
    entryId: 'NAVY_SSC_EDUCATION',
    baseCourseCommencementDate: '2027-01-01',
    baseDobMin: '2002-01-02',
    baseDobMax: '2006-01-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'Navy SSC Education ({month} {courseYear})',
  },
  NAVY_SSC_TECH_ENGG: {
    entryId: 'NAVY_SSC_TECH_ENGG',
    baseCourseCommencementDate: '2027-01-01',
    baseDobMin: '2002-01-02',
    baseDobMax: '2007-07-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'Navy SSC Tech (Engineering) ({month} {courseYear})',
  },
  NAVY_SSC_TECH_ELEC: {
    entryId: 'NAVY_SSC_TECH_ELEC',
    baseCourseCommencementDate: '2027-01-01',
    baseDobMin: '2002-01-02',
    baseDobMax: '2007-07-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'Navy SSC Tech (Electrical) ({month} {courseYear})',
  },
  NAVY_SSC_SUBMARINE_ENGG: {
    entryId: 'NAVY_SSC_SUBMARINE_ENGG',
    baseCourseCommencementDate: '2027-01-01',
    baseDobMin: '2002-01-02',
    baseDobMax: '2007-07-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'Navy Submarine Technical (Engineering) ({month} {courseYear})',
  },
  NAVY_SSC_SUBMARINE_ELEC: {
    entryId: 'NAVY_SSC_SUBMARINE_ELEC',
    baseCourseCommencementDate: '2027-01-01',
    baseDobMin: '2002-01-02',
    baseDobMax: '2007-07-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'Navy Submarine Technical (Electrical) ({month} {courseYear})',
  },
  NAVY_SSC_LAW: {
    entryId: 'NAVY_SSC_LAW',
    baseCourseCommencementDate: '2027-01-01',
    baseDobMin: '2000-01-02',
    baseDobMax: '2005-01-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'Navy SSC Law ({month} {courseYear})',
  },
  NAVY_NCC: {
    entryId: 'NAVY_NCC',
    baseCourseCommencementDate: '2027-01-01',
    baseDobMin: '2002-01-02',
    baseDobMax: '2007-07-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'Navy NCC Special Entry ({month} {courseYear})',
  },

  // --- AIR FORCE ---
  IAF_NDA: {
    entryId: 'IAF_NDA',
    baseCourseCommencementDate: '2027-06-01',
    baseDobMin: '2007-07-02',
    baseDobMax: '2010-07-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'NDA & NA ({seq}) {year} — Air Force',
    baseExamYear: 2026,
    baseSeqIndex: 0,
  },
  IAF_CDS_AFA: {
    entryId: 'IAF_CDS_AFA',
    baseCourseCommencementDate: '2026-09-01',
    baseDobMin: '2002-10-02',
    baseDobMax: '2007-10-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'CDS ({seq}) {year} — AFA',
    baseExamYear: 2026,
    baseSeqIndex: 0,
  },
  IAF_AFCAT_FLYING: {
    entryId: 'IAF_AFCAT_FLYING',
    baseCourseCommencementDate: '2027-01-01',
    baseDobMin: '2003-01-02',
    baseDobMax: '2007-01-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'AFCAT {seqCode}/{year} — Flying',
    baseExamYear: 2026,
    baseSeqIndex: 0,
    cplAgeRelaxationYears: 2,
  },
  IAF_AFCAT_GD_TECH: {
    entryId: 'IAF_AFCAT_GD_TECH',
    baseCourseCommencementDate: '2027-01-01',
    baseDobMin: '2001-01-02',
    baseDobMax: '2007-01-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'AFCAT {seqCode}/{year} — Ground Duty (Tech)',
    baseExamYear: 2026,
    baseSeqIndex: 0,
  },
  IAF_AFCAT_GD_ADMIN: {
    entryId: 'IAF_AFCAT_GD_ADMIN',
    baseCourseCommencementDate: '2027-01-01',
    baseDobMin: '2001-01-02',
    baseDobMax: '2007-01-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'AFCAT {seqCode}/{year} — Ground Duty (Non-Tech)',
    baseExamYear: 2026,
    baseSeqIndex: 0,
  },
  IAF_AFCAT_GD_LOGISTICS: {
    entryId: 'IAF_AFCAT_GD_LOGISTICS',
    baseCourseCommencementDate: '2027-01-01',
    baseDobMin: '2001-01-02',
    baseDobMax: '2007-01-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'AFCAT {seqCode}/{year} — Logistics',
    baseExamYear: 2026,
    baseSeqIndex: 0,
  },
  IAF_AFCAT_GD_ACCOUNTS: {
    entryId: 'IAF_AFCAT_GD_ACCOUNTS',
    baseCourseCommencementDate: '2027-01-01',
    baseDobMin: '2001-01-02',
    baseDobMax: '2007-01-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'AFCAT {seqCode}/{year} — Accounts',
    baseExamYear: 2026,
    baseSeqIndex: 0,
  },
  IAF_AFCAT_GD_EDUCATION: {
    entryId: 'IAF_AFCAT_GD_EDUCATION',
    baseCourseCommencementDate: '2027-01-01',
    baseDobMin: '2001-01-02',
    baseDobMax: '2007-01-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'AFCAT {seqCode}/{year} — Education',
    baseExamYear: 2026,
    baseSeqIndex: 0,
  },
  IAF_AFCAT_GD_MET: {
    entryId: 'IAF_AFCAT_GD_MET',
    baseCourseCommencementDate: '2027-01-01',
    baseDobMin: '2001-01-02',
    baseDobMax: '2007-01-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'AFCAT {seqCode}/{year} — Meteorology',
    baseExamYear: 2026,
    baseSeqIndex: 0,
  },
  IAF_NCC_FLYING: {
    entryId: 'IAF_NCC_FLYING',
    baseCourseCommencementDate: '2027-01-01',
    baseDobMin: '2003-01-02',
    baseDobMax: '2007-01-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'IAF NCC Special Entry ({month} {courseYear})',
    cplAgeRelaxationYears: 2,
  },

  // --- COAST GUARD ---
  CG_AC_GD: {
    entryId: 'CG_AC_GD',
    baseCourseCommencementDate: '2026-10-01',
    baseDobMin: '2001-10-02',
    baseDobMax: '2005-10-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'Coast Guard AC GD Batch ({month} {courseYear})',
  },
  CG_AC_TECH_MECH: {
    entryId: 'CG_AC_TECH_MECH',
    baseCourseCommencementDate: '2026-10-01',
    baseDobMin: '2001-10-02',
    baseDobMax: '2005-10-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'Coast Guard AC Tech (Mech) ({month} {courseYear})',
  },
  CG_AC_TECH_ELEC: {
    entryId: 'CG_AC_TECH_ELEC',
    baseCourseCommencementDate: '2026-10-01',
    baseDobMin: '2001-10-02',
    baseDobMax: '2005-10-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'Coast Guard AC Tech (Elec) ({month} {courseYear})',
  },
  CG_AC_CPL_SSA: {
    entryId: 'CG_AC_CPL_SSA',
    baseCourseCommencementDate: '2026-10-01',
    baseDobMin: '2001-10-02',
    baseDobMax: '2007-10-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'Coast Guard AC CPL SSA ({month} {courseYear})',
  },
  CG_AC_LAW: {
    entryId: 'CG_AC_LAW',
    baseCourseCommencementDate: '2026-10-01',
    baseDobMin: '1996-10-02',
    baseDobMax: '2005-10-01',
    cyclePattern: 'TWICE_YEARLY',
    labelTemplate: 'Coast Guard AC Law ({month} {courseYear})',
  },
};

/** Format dynamic cycle label based on template and index */
function formatCycleLabel(
  spec: EntryAnchorSpec,
  courseDateISO: string,
  stepIndex: number,
): string {
  const date = new Date(courseDateISO + 'T00:00:00Z');
  const year = date.getUTCFullYear();
  const monthName = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });

  // Calculate sequence (I or II) and exam year
  const baseSeq = spec.baseSeqIndex || 0;
  const baseExamYr = spec.baseExamYear || 2026;
  const totalSeq = baseSeq + stepIndex;

  const seqNum = ((totalSeq % 2) + 2) % 2; // 0 or 1
  const seq = seqNum === 0 ? 'I' : 'II';
  const seqCode = seqNum === 0 ? '01' : '02';
  const examYear = baseExamYr + Math.floor(totalSeq / 2);

  const baseNum = spec.baseCourseNumber || 1;
  const courseNum = baseNum + stepIndex;

  return spec.labelTemplate
    .replace('{year}', String(examYear))
    .replace('{courseYear}', String(year))
    .replace('{seq}', seq)
    .replace('{seqCode}', seqCode)
    .replace('{month}', monthName)
    .replace('{courseNum}', String(courseNum));
}

/**
 * Dynamically generates all official and future projected intake cycles for an entry.
 * Evaluates candidate's DOB against shifted dobMin/dobMax windows.
 * Stops when candidate is overage for future cycles.
 */
export function generateCyclesForEntry(
  entry: EntryRule,
  candidateDOB: string,
  candidateProfile?: CandidateProfile,
): CourseIntake[] {
  const spec = ENTRY_ANCHOR_SPECS[entry.entryId];
  
  // If entry is discontinued or suspended, return empty array
  if (entry.status === 'SUSPENDED' || entry.status === 'DISCONTINUED') {
    return [];
  }

  // Fallback spec if missing from map
  const anchor: EntryAnchorSpec = spec || {
    entryId: entry.entryId,
    baseCourseCommencementDate: '2026-07-01',
    baseDobMin: `${2026 - (entry.maxAge || 24)}-07-02`,
    baseDobMax: `${2026 - (entry.minAge || 19)}-07-01`,
    cyclePattern: entry.cyclePattern === 'ANNUAL' ? 'ANNUAL' : 'TWICE_YEARLY',
    labelTemplate: `${entry.entryName} ({month} {courseYear})`,
  };

  let effectiveBaseDobMin = anchor.baseDobMin;
  // Apply CPL age relaxation if candidate holds a valid DGCA CPL
  if (
    anchor.cplAgeRelaxationYears &&
    candidateProfile?.cpl?.holds === true &&
    candidateProfile?.cpl?.dgcaValid === true
  ) {
    effectiveBaseDobMin = addMonthsToISO(anchor.baseDobMin, -(anchor.cplAgeRelaxationYears * 12));
  }

  const monthStep = anchor.cyclePattern === 'ANNUAL' ? 12 : 6;
  const generatedCycles: CourseIntake[] = [];

  // Look back up to 4 cycles (-4 to 0) to find current/recent official cycles,
  // and look forward up to +20 cycles until candidate is overage.
  const startStep = -4;
  const maxStep = 20;

  for (let step = startStep; step <= maxStep; step++) {
    const monthsShift = step * monthStep;
    const courseCommencementDate = addMonthsToISO(anchor.baseCourseCommencementDate, monthsShift);
    const dobMin = addMonthsToISO(effectiveBaseDobMin, monthsShift);
    const dobMax = addMonthsToISO(anchor.baseDobMax, monthsShift);

    // Stop forward generation if candidate's DOB is earlier than dobMin (candidate is overage)
    if (step > 0 && candidateDOB < dobMin) {
      break;
    }

    // Skip past cycles where candidate's DOB is after dobMax (candidate was too young)
    if (candidateDOB > dobMax && step < 0) {
      continue;
    }

    // Check if an official intake exists in OFFICIAL_CYCLES matching this entry and date
    const officialIntake = OFFICIAL_CYCLES.find(
      (c) =>
        c.entryId === entry.entryId &&
        Math.abs(new Date(c.courseCommencementDate).getTime() - new Date(courseCommencementDate).getTime()) < 60 * 86400 * 1000,
    );

    const cycleId = officialIntake
      ? officialIntake.cycleId
      : `${entry.entryId}_PROJ_${step >= 0 ? 'F' : 'P'}${Math.abs(step)}`;

    const cycleLabel = officialIntake
      ? officialIntake.cycleLabel.replace(' (Projected)', '')
      : formatCycleLabel(anchor, courseCommencementDate, step);

    const status = officialIntake ? officialIntake.status : 'PROJECTED';

    let temporalStatus: 'CURRENT' | 'FUTURE' | 'EXPIRED' = 'FUTURE';
    if (courseCommencementDate < '2026-08-01') {
      temporalStatus = 'EXPIRED';
    } else if (courseCommencementDate <= '2027-03-31') {
      temporalStatus = 'CURRENT';
    } else {
      temporalStatus = 'FUTURE';
    }

    generatedCycles.push({
      entryId: entry.entryId,
      cycleId,
      cycleLabel,
      status,
      temporalStatus,
      courseCommencementDate,
      ageReferenceType: anchor.cyclePattern === 'ANNUAL' ? 'ACADEMY_JOINING' : 'COURSE_COMMENCEMENT',
      dobMin,
      dobMax,
      source: officialIntake?.source || entry.primarySource.title || 'Projected based on notification cycle pattern',
      sourceUrl: officialIntake?.sourceUrl || entry.primarySource.url,
      lastVerified: '2026-08',
      notes: status === 'PROJECTED' ? 'Projected cycle based on 6-month notification DOB shift pattern.' : officialIntake?.notes,
    });
  }

  return generatedCycles;
}
