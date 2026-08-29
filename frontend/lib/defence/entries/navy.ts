import { EntryRule } from '../types';
import { SOURCES } from '../sources';

// =============================================================================
// INDIAN NAVY — OFFICER ENTRY RULES
// Gender rules verified against August 2026 official notifications.
// Submarine Technical branches are modelled as SEPARATE male-only entries.
// =============================================================================

export const NAVY_ENTRIES: EntryRule[] = [
  // ---------------------------------------------------------------------------
  // 1. NDA / NA — Naval Academy Wing
  // ---------------------------------------------------------------------------
  {
    entryId: 'NAVY_NDA',
    service: 'Navy',
    entryName: 'NDA/NA',
    entryFullName: 'National Defence Academy — Naval Academy Wing',
    entryCode: 'NDA-NA',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'BOTH',
    genderNote: 'Open to women since Supreme Court order September 2021.',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: true,
      marriageProhibitedDuringTraining: true,
    },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 16.5,
    maxAge: 19.5,

    educationRule: {
      minLevel: 'CLASS_12',
      class12Rule: {
        required: true,
        pcmRequired: true,
        percentageRule: { minPercentage: 0 }, // no minimum % specified — pass required
        finalYearAllowed: true,
      },
      notes: 'Class 12 with Physics and Mathematics. Class 12 appearing candidates can also apply.',
    },

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: [
      'UPSC Written Exam (Maths + GAT)',
      'SSB Interview (5 days)',
      'Medical Examination',
      'Training at Naval Academy, Ezhimala (4 years)',
    ],
    commissionType: 'PERMANENT',
    ssbCentres: ['NSB_COIMBATORE', 'NSB_VISAKHAPATNAM'],
    primarySource: SOURCES.UPSC_NDA_I_2026,
    additionalSources: [SOURCES.SC_NDA_WOMEN_2021],
  },

  // ---------------------------------------------------------------------------
  // 2. CDS — INA (Indian Naval Academy)
  // ---------------------------------------------------------------------------
  {
    entryId: 'NAVY_CDS_INA',
    service: 'Navy',
    entryName: 'CDS — INA',
    entryFullName: 'Combined Defence Services — Indian Naval Academy, Ezhimala',
    entryCode: 'CDS-INA',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'MALE_ONLY',
    genderNote: 'INA Executive branch via CDS is currently male-only as of August 2026.',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: true,
    },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 19,
    maxAge: 24,

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        disciplines: ['B.Sc. (with Physics and Mathematics at 10+2 level)', 'B.E./B.Tech'],
        finalYearAllowed: true,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        backlogsAllowed: false,
      },
    },

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: [
      'UPSC CDS Written Exam',
      'SSB Interview (5 days)',
      'Medical Examination',
      'Training at INA, Ezhimala',
    ],
    commissionType: 'PERMANENT',
    ssbCentres: ['NSB_COIMBATORE', 'NSB_VISAKHAPATNAM', 'NAVY_12SSB_BANGALORE', 'NAVY_33SSB_BHOPAL'],
    primarySource: SOURCES.UPSC_CDS_I_2026,
  },

  // ---------------------------------------------------------------------------
  // 3. 10+2 B.Tech Entry
  // ---------------------------------------------------------------------------
  {
    entryId: 'NAVY_10_2_BTECH',
    service: 'Navy',
    entryName: '10+2 B.Tech',
    entryFullName: 'Indian Navy 10+2 B.Tech Cadet Entry',
    entryCode: '10+2-BTECH',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'BOTH',
    genderNote:
      'Navy 10+2 B.Tech Entry 2026 notification explicitly states "unmarried men and women". Verified from official 2026 notification.',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: true,
      marriageProhibitedDuringTraining: true,
      notes: 'Must be unmarried at the time of commencement of the course at INA.',
    },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    ageNote:
      'Per 2026 notification: born between 02 Jul 2007 and 01 Jan 2010 (for Jan 2027 course). Exact DOB window tied to specific notification.',

    educationRule: {
      minLevel: 'CLASS_12',
      class12Rule: {
        required: true,
        pcmRequired: true,
        percentageRule: {
          minPercentage: 70,
          subjectPercentages: { pcm: 70, english: 50 },
        },
        finalYearAllowed: false,
      },
      notes: '70% aggregate in Physics, Chemistry and Mathematics. 50% in English. JEE Main score compulsory.',
    },

    jeeRule: {
      required: true,
      notes: 'JEE Main score is mandatory. Shortlisting based on JEE Main rank.',
    },

    cyclePattern: 'ANNUAL',
    selectionProcess: [
      'JEE Main shortlisting',
      'SSB Interview (5 days)',
      'Medical Examination',
      'Training at INA, Ezhimala (4 years B.Tech + Divisional Course)',
    ],
    commissionType: 'PERMANENT',
    ssbCentres: ['NSB_COIMBATORE', 'NSB_VISAKHAPATNAM', 'NAVY_12SSB_BANGALORE', 'NAVY_33SSB_BHOPAL'],
    primarySource: SOURCES.NAVY_10_2_BTECH_2026,
  },

  // ---------------------------------------------------------------------------
  // 4. SSC Executive
  // ---------------------------------------------------------------------------
  {
    entryId: 'NAVY_SSC_EXEC',
    service: 'Navy',
    entryName: 'SSC Executive',
    entryFullName: 'Short Service Commission — Executive Branch',
    entryCode: 'SSC-EXEC',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'BOTH',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: true,
    },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 19.5,
    maxAge: 25,

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        disciplines: ['Any discipline with Physics and Mathematics at 10+2 level'],
        finalYearAllowed: false,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        percentageRule: { minPercentage: 60 },
        backlogsAllowed: false,
      },
    },

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: [
      'Application on joinindiannavy.gov.in',
      'SSB Interview (5 days)',
      'Medical Examination',
      'Training at INA, Ezhimala',
    ],
    commissionType: 'SHORT_SERVICE',
    ssbCentres: ['NSB_COIMBATORE', 'NSB_VISAKHAPATNAM', 'NAVY_12SSB_BANGALORE', 'NAVY_33SSB_BHOPAL', 'NSB_KOLKATA'],
    primarySource: SOURCES.NAVY_SSC_2026,
  },

  // ---------------------------------------------------------------------------
  // 5. SSC IT
  // ---------------------------------------------------------------------------
  {
    entryId: 'NAVY_SSC_IT',
    service: 'Navy',
    entryName: 'SSC IT',
    entryFullName: 'Short Service Commission — Information Technology',
    entryCode: 'SSC-IT',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'BOTH',
    genderNote:
      'Navy SSC IT 2026 notification explicitly states "unmarried men and women are eligible". Source: NDTV / Official Navy notification May 2026.',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: true,
    },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    ageNote: 'Per 2026 notification: born between 02 Jan 2002 – 01 Jul 2007.',

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        engineeringOnly: false,
        disciplines: [
          'B.Tech / B.E. in Computer Science',
          'B.Tech / B.E. in Information Technology',
          'B.Tech / B.E. in Cyber Security',
          'B.Tech / B.E. in Data Analytics',
          'B.Tech / B.E. in Artificial Intelligence',
          'MCA',
          'M.Tech / M.E. in any of the above',
          'M.Sc. CS / IT / Cyber Security',
        ],
        finalYearAllowed: false,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        percentageRule: { minPercentage: 60 },
        backlogsAllowed: false,
      },
    },

    cyclePattern: 'ANNUAL',
    selectionProcess: [
      'Application on joinindiannavy.gov.in',
      'SSB Interview (5 days)',
      'Medical Examination',
    ],
    commissionType: 'SHORT_SERVICE',
    ssbCentres: ['NSB_COIMBATORE', 'NSB_VISAKHAPATNAM', 'NAVY_12SSB_BANGALORE', 'NAVY_33SSB_BHOPAL', 'NSB_KOLKATA'],
    primarySource: SOURCES.NAVY_SSC_IT_2026,
  },

  // ---------------------------------------------------------------------------
  // 6. SSC Technical Engineering
  // ---------------------------------------------------------------------------
  {
    entryId: 'NAVY_SSC_TECH_ENGG',
    service: 'Navy',
    entryName: 'SSC Technical (Engineering)',
    entryFullName: 'Short Service Commission — Technical Engineering Branch',
    entryCode: 'SSC-TECH-E',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'BOTH',
    genderNote:
      'Open to both genders for non-submarine specialisations. Submarine Engineering branch is male-only (see separate entry).',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: true,
    },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    ageNote: 'Per 2026 notification: born 02 Jul 2002 – 01 Jan 2008.',

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        engineeringOnly: true,
        engineeringBranchRule: {
          allowedBranches: [
            'MECHANICAL', 'MARINE', 'NAVAL_ARCHITECTURE', 'AERONAUTICAL',
            'METALLURGY', 'AUTOMOBILE', 'CHEMICAL', 'CIVIL', 'INSTRUMENTATION',
          ],
        },
        finalYearAllowed: false,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        percentageRule: { minPercentage: 60 },
        backlogsAllowed: false,
      },
    },

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: [
      'Application on joinindiannavy.gov.in',
      'SSB Interview (5 days)',
      'Medical Examination',
    ],
    commissionType: 'SHORT_SERVICE',
    ssbCentres: ['NSB_COIMBATORE', 'NSB_VISAKHAPATNAM', 'NAVY_12SSB_BANGALORE', 'NAVY_33SSB_BHOPAL', 'NSB_KOLKATA'],
    primarySource: SOURCES.NAVY_SSC_2026,
  },

  // ---------------------------------------------------------------------------
  // 7. SSC Technical Electrical
  // ---------------------------------------------------------------------------
  {
    entryId: 'NAVY_SSC_TECH_ELEC',
    service: 'Navy',
    entryName: 'SSC Technical (Electrical)',
    entryFullName: 'Short Service Commission — Technical Electrical Branch',
    entryCode: 'SSC-TECH-L',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'BOTH',
    genderNote:
      'Open to both genders for non-submarine specialisations. Submarine Electrical branch is male-only (see separate entry).',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: true,
    },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    ageNote: 'Per 2026 notification: born 02 Jul 2002 – 01 Jan 2008.',

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
        percentageRule: { minPercentage: 60 },
        backlogsAllowed: false,
      },
    },

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: [
      'Application on joinindiannavy.gov.in',
      'SSB Interview (5 days)',
      'Medical Examination',
    ],
    commissionType: 'SHORT_SERVICE',
    ssbCentres: ['NSB_COIMBATORE', 'NSB_VISAKHAPATNAM', 'NAVY_12SSB_BANGALORE', 'NAVY_33SSB_BHOPAL', 'NSB_KOLKATA'],
    primarySource: SOURCES.NAVY_SSC_2026,
  },

  // ---------------------------------------------------------------------------
  // 8. Submarine Technical — Engineering (MALE ONLY)
  // ---------------------------------------------------------------------------
  {
    entryId: 'NAVY_SUB_TECH_ENGG',
    service: 'Navy',
    entryName: 'Submarine Tech (Engineering)',
    entryFullName: 'Short Service Commission — Submarine Technical Engineering',
    entryCode: 'SUB-TECH-E',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'MALE_ONLY',
    genderNote: 'Submarine specialisation explicitly male-only per Indian Navy 2026 notification.',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: { unmarriedRequired: true },

    ageReferenceType: 'COURSE_COMMENCEMENT',

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        engineeringOnly: true,
        engineeringBranchRule: {
          allowedBranches: ['MECHANICAL', 'MARINE', 'METALLURGY'],
        },
        finalYearAllowed: false,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        percentageRule: { minPercentage: 60 },
        backlogsAllowed: false,
      },
    },

    cyclePattern: 'AS_NOTIFIED',
    selectionProcess: [
      'Application on joinindiannavy.gov.in',
      'SSB Interview (5 days)',
      'Medical Examination (Submarine fitness standards)',
    ],
    commissionType: 'SHORT_SERVICE',
    primarySource: SOURCES.NAVY_SSC_2026,
  },

  // ---------------------------------------------------------------------------
  // 9. Submarine Technical — Electrical (MALE ONLY)
  // ---------------------------------------------------------------------------
  {
    entryId: 'NAVY_SUB_TECH_ELEC',
    service: 'Navy',
    entryName: 'Submarine Tech (Electrical)',
    entryFullName: 'Short Service Commission — Submarine Technical Electrical',
    entryCode: 'SUB-TECH-L',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'MALE_ONLY',
    genderNote: 'Submarine specialisation explicitly male-only per Indian Navy 2026 notification.',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: { unmarriedRequired: true },

    ageReferenceType: 'COURSE_COMMENCEMENT',

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        engineeringOnly: true,
        engineeringBranchRule: {
          allowedBranches: ['ELECTRICAL', 'ELECTRICAL_ELECTRONICS'],
        },
        finalYearAllowed: false,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        percentageRule: { minPercentage: 60 },
        backlogsAllowed: false,
      },
    },

    cyclePattern: 'AS_NOTIFIED',
    selectionProcess: [
      'Application on joinindiannavy.gov.in',
      'SSB Interview (5 days)',
      'Medical Examination (Submarine fitness standards)',
    ],
    commissionType: 'SHORT_SERVICE',
    primarySource: SOURCES.NAVY_SSC_2026,
  },

  // ---------------------------------------------------------------------------
  // 10. SSC Logistics
  // ---------------------------------------------------------------------------
  {
    entryId: 'NAVY_SSC_LOGISTICS',
    service: 'Navy',
    entryName: 'SSC Logistics',
    entryFullName: 'Short Service Commission — Logistics Branch',
    entryCode: 'SSC-LOG',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'BOTH',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: { unmarriedRequired: true },

    ageReferenceType: 'COURSE_COMMENCEMENT',

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        disciplines: ['Any discipline', 'MBA / PG Diploma in Logistics / Supply Chain preferred but not mandatory'],
        finalYearAllowed: false,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        percentageRule: { minPercentage: 60 },
        backlogsAllowed: false,
      },
    },

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: [
      'Application on joinindiannavy.gov.in',
      'SSB Interview (5 days)',
      'Medical Examination',
    ],
    commissionType: 'SHORT_SERVICE',
    primarySource: SOURCES.NAVY_SSC_2026,
  },

  // ---------------------------------------------------------------------------
  // 11. SSC Law
  // ---------------------------------------------------------------------------
  {
    entryId: 'NAVY_SSC_LAW',
    service: 'Navy',
    entryName: 'SSC Law',
    entryFullName: 'Short Service Commission — Law',
    entryCode: 'SSC-LAW',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'BOTH',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: { unmarriedRequired: true },

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

    cyclePattern: 'ANNUAL',
    selectionProcess: ['Application on joinindiannavy.gov.in', 'SSB Interview', 'Medical Examination'],
    commissionType: 'SHORT_SERVICE',
    primarySource: SOURCES.NAVY_SSC_2026,
  },

  // ---------------------------------------------------------------------------
  // 12. SSC Education
  // ---------------------------------------------------------------------------
  {
    entryId: 'NAVY_SSC_EDUCATION',
    service: 'Navy',
    entryName: 'SSC Education',
    entryFullName: 'Short Service Commission — Education',
    entryCode: 'SSC-EDU',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'BOTH',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: { unmarriedRequired: true },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 21,
    maxAge: 29,

    educationRule: {
      minLevel: 'POST_GRADUATION',
      pgRequired: true,
      pgRule: {
        disciplines: ['Any postgraduate degree in relevant subjects'],
        minPercentage: 50,
        bedRequired: true,
      },
    },

    cyclePattern: 'ANNUAL',
    selectionProcess: ['Application on joinindiannavy.gov.in', 'SSB Interview', 'Medical Examination'],
    commissionType: 'SHORT_SERVICE',
    primarySource: SOURCES.NAVY_SSC_2026,
  },

  // ---------------------------------------------------------------------------
  // 13. SSC Pilot (Male only)
  // ---------------------------------------------------------------------------
  {
    entryId: 'NAVY_SSC_PILOT',
    service: 'Navy',
    entryName: 'SSC Pilot',
    entryFullName: 'Short Service Commission — Pilot',
    entryCode: 'SSC-PILOT',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'MALE_ONLY',
    genderNote: 'Navy SSC Pilot entry is currently male-only as of 2026 notification.',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: { unmarriedRequired: true },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 19,
    maxAge: 25,

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        disciplines: ['Any discipline with Physics and Mathematics at 10+2'],
        finalYearAllowed: false,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        percentageRule: { minPercentage: 60 },
        backlogsAllowed: false,
      },
    },

    cplRule: {
      required: false,
      grantsAgeRelaxation: false,
      notes: 'CPL not required but may be advantageous. CPSS conducted by IAF.',
    },

    cpssRule: {
      required: true,
      failureIsPermanentBar: true,
      notes: 'CPSS/PABT conducted by Indian Air Force. Prior failure is a permanent bar.',
    },

    cyclePattern: 'ANNUAL',
    selectionProcess: [
      'Application on joinindiannavy.gov.in',
      'CPSS at IAF Selection Centre',
      'SSB Interview (5 days)',
      'Medical Examination',
    ],
    commissionType: 'SHORT_SERVICE',
    primarySource: SOURCES.NAVY_SSC_2026,
  },

  // ---------------------------------------------------------------------------
  // 14. NCC Special Entry (Navy)
  // ---------------------------------------------------------------------------
  {
    entryId: 'NAVY_NCC',
    service: 'Navy',
    entryName: 'NCC Special Entry',
    entryFullName: 'National Cadet Corps Special Entry — Navy',
    entryCode: 'NCC-NAVY',
    status: 'SEASONAL',
    category: 'CIVILIAN',

    genderRule: 'BOTH',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: { unmarriedRequired: true },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 19,
    maxAge: 25,

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        disciplines: ['Any discipline'],
        finalYearAllowed: false,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        percentageRule: { minPercentage: 50 },
        backlogsAllowed: false,
      },
    },

    nccRule: {
      required: true,
      mandatoryWings: ['NAVY'],
      minCertificate: 'C',
      minGrade: 'B',
      notes: 'Naval NCC C Certificate with minimum B grade required.',
    },

    cyclePattern: 'AS_NOTIFIED',
    selectionProcess: [
      'Application on joinindiannavy.gov.in',
      'SSB Interview (no written exam)',
      'Medical Examination',
    ],
    commissionType: 'SHORT_SERVICE',
    primarySource: SOURCES.NAVY_NCC,
  },
];
