import { EntryRule } from '../types';
import { SOURCES } from '../sources';

// =============================================================================
// INDIAN COAST GUARD — OFFICER ENTRY RULES
// Source: ICGR official recruitment portal joinindiancoastguard.cdac.in
// =============================================================================

export const COASTGUARD_ENTRIES: EntryRule[] = [
  // ---------------------------------------------------------------------------
  // 1. Assistant Commandant — General Duty
  // ---------------------------------------------------------------------------
  {
    entryId: 'CG_AC_GD',
    service: 'Coast Guard',
    entryName: 'AC General Duty',
    entryFullName: 'Indian Coast Guard Assistant Commandant — General Duty',
    entryCode: 'AC-GD',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'BOTH',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: true,
      notes: 'Must be unmarried at the time of joining.',
    },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 21,
    maxAge: 25,
    ageNote: '21–25 years on the date of course commencement per ICGR notification.',

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        disciplines: ['Any Graduation from recognised university'],
        finalYearAllowed: false,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        percentageRule: { minPercentage: 55 },
        backlogsAllowed: false,
      },
      notes:
        'Any graduate with minimum 55% aggregate. Physical fitness standard applies. ' +
        'Physics and Mathematics at Class 12 level are mandatory for GD entry.',
    },

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: [
      'Online Application on joinindiancoastguard.cdac.in',
      'Cognitive aptitude test + PPDT',
      'Psychological tests, Group tasks, Interview (5 days)',
      'Medical Examination',
      'Basic Officer Training at NACI, Noida',
    ],
    commissionType: 'PERMANENT',
    primarySource: SOURCES.ICGR_AC_2026,
  },

  // ---------------------------------------------------------------------------
  // 2. Assistant Commandant — Technical (Mechanical)
  // ---------------------------------------------------------------------------
  {
    entryId: 'CG_AC_TECH_MECH',
    service: 'Coast Guard',
    entryName: 'AC Technical (Mechanical)',
    entryFullName: 'Indian Coast Guard Assistant Commandant — Technical (Mechanical)',
    entryCode: 'AC-TECH-M',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'MALE_ONLY',
    genderNote: 'Technical Mechanical entry is currently male-only per ICGR 2026 notification.',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: true,
    },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 21,
    maxAge: 25,

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        engineeringOnly: true,
        engineeringBranchRule: {
          allowedBranches: ['MECHANICAL', 'MARINE', 'NAVAL_ARCHITECTURE', 'AUTOMOBILE'],
        },
        finalYearAllowed: false,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        percentageRule: { minPercentage: 55 },
        backlogsAllowed: false,
      },
    },

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: [
      'Online Application on joinindiancoastguard.cdac.in',
      'Aptitude test + PPDT',
      'Psychological tests, Group tasks, Interview (5 days)',
      'Medical Examination',
    ],
    commissionType: 'PERMANENT',
    primarySource: SOURCES.ICGR_AC_2026,
  },

  // ---------------------------------------------------------------------------
  // 3. Assistant Commandant — Technical (Electrical)
  // ---------------------------------------------------------------------------
  {
    entryId: 'CG_AC_TECH_ELEC',
    service: 'Coast Guard',
    entryName: 'AC Technical (Electrical)',
    entryFullName: 'Indian Coast Guard Assistant Commandant — Technical (Electrical)',
    entryCode: 'AC-TECH-E',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'MALE_ONLY',
    genderNote: 'Technical Electrical entry is currently male-only per ICGR 2026 notification.',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: true,
    },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 21,
    maxAge: 25,

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        engineeringOnly: true,
        engineeringBranchRule: {
          allowedBranches: ['ELECTRICAL', 'ELECTRICAL_ELECTRONICS', 'ECE', 'ELECTRONICS'],
        },
        finalYearAllowed: false,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        percentageRule: { minPercentage: 55 },
        backlogsAllowed: false,
      },
    },

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: [
      'Online Application on joinindiancoastguard.cdac.in',
      'Aptitude test + PPDT',
      'Psychological tests, Group tasks, Interview (5 days)',
      'Medical Examination',
    ],
    commissionType: 'PERMANENT',
    primarySource: SOURCES.ICGR_AC_2026,
  },

  // ---------------------------------------------------------------------------
  // 4. Assistant Commandant — Law (Seasonal)
  // ---------------------------------------------------------------------------
  {
    entryId: 'CG_AC_LAW',
    service: 'Coast Guard',
    entryName: 'AC Law',
    entryFullName: 'Indian Coast Guard Assistant Commandant — Law',
    entryCode: 'AC-LAW',
    status: 'SEASONAL',
    category: 'CIVILIAN',

    genderRule: 'BOTH',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: true,
    },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 21,
    maxAge: 27,

    educationRule: {
      minLevel: 'GRADUATION',
      lawRule: {
        llbTypeAllowed: ['3_YEAR', '5_YEAR'],
        minPercentage: 55,
        finalYearAllowed: false,
        barCouncilRequired: false,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
      },
    },

    cyclePattern: 'AS_NOTIFIED',
    selectionProcess: [
      'Online Application on joinindiancoastguard.cdac.in',
      'Written Test',
      'Interview and Medical',
    ],
    commissionType: 'SHORT_SERVICE',
    primarySource: SOURCES.ICGR_AC_2026,
  },

  // ---------------------------------------------------------------------------
  // 5. Assistant Commandant — Commercial Pilot (Seasonal, Male only)
  // ---------------------------------------------------------------------------
  {
    entryId: 'CG_AC_PILOT',
    service: 'Coast Guard',
    entryName: 'AC Commercial Pilot',
    entryFullName: 'Indian Coast Guard Assistant Commandant — Commercial Pilot Entry',
    entryCode: 'AC-CPL',
    status: 'SEASONAL',
    category: 'CIVILIAN',

    genderRule: 'MALE_ONLY',
    genderNote: 'Commercial Pilot entry is currently male-only per ICGR 2026 notification.',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: true,
    },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 21,
    maxAge: 27,

    educationRule: {
      minLevel: 'CLASS_12',
      class12Rule: {
        required: true,
        pcmRequired: true,
        finalYearAllowed: false,
      },
      notes: '12th with PCM. Graduation preferred. CPL is the primary eligibility driver.',
    },

    cplRule: {
      required: true,
      grantsAgeRelaxation: false,
      notes: 'Valid DGCA Commercial Pilot Licence compulsory. Must have minimum flying hours as per notification.',
    },

    cyclePattern: 'AS_NOTIFIED',
    selectionProcess: [
      'Online Application on joinindiancoastguard.cdac.in',
      'Interview and Technical Assessment',
      'Medical Examination',
    ],
    commissionType: 'SHORT_SERVICE',
    primarySource: SOURCES.ICGR_AC_2026,
  },
];
