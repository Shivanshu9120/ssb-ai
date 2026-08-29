import { EntryRule } from '../types';
import { SOURCES } from '../sources';

// =============================================================================
// INDIAN AIR FORCE — OFFICER ENTRY RULES
// Gender rules verified against AFCAT 01/2026 notification (June 2026).
// AFCAT Flying Branch open to women since 2021.
// =============================================================================

export const AIRFORCE_ENTRIES: EntryRule[] = [
  // ---------------------------------------------------------------------------
  // 1. NDA — Air Force Wing
  // ---------------------------------------------------------------------------
  {
    entryId: 'IAF_NDA',
    service: 'Air Force',
    entryName: 'NDA — Air Force',
    entryFullName: 'National Defence Academy — Air Force Wing',
    entryCode: 'NDA-AF',
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
        finalYearAllowed: true,
      },
      notes: 'Class 12 with Physics and Mathematics compulsory for Air Force wing.',
    },

    cpssRule: {
      required: true,
      failureIsPermanentBar: true,
      notes: 'CPSS/PABT conducted after SSB recommendation. Prior failure is a permanent bar to all Flying entries.',
    },

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: [
      'UPSC Written Exam (Maths + GAT)',
      'SSB Interview (5 days)',
      'CPSS/PABT at Airforce Station',
      'Medical Examination',
      'Training at NDA (3 years) + AFA, Dundigal (18 months)',
    ],
    commissionType: 'PERMANENT',
    ssbCentres: ['AFSB_DEHRADUN', 'AFSB_MYSORE', 'AFSB_GANDHINAGAR', 'AFSB_VARANASI'],
    primarySource: SOURCES.UPSC_NDA_I_2026,
    additionalSources: [SOURCES.SC_NDA_WOMEN_2021],
  },

  // ---------------------------------------------------------------------------
  // 2. CDS — AFA (Air Force Academy)
  // ---------------------------------------------------------------------------
  {
    entryId: 'IAF_CDS_AFA',
    service: 'Air Force',
    entryName: 'CDS — AFA',
    entryFullName: 'Combined Defence Services — Air Force Academy, Dundigal',
    entryCode: 'CDS-AFA',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'MALE_ONLY',
    genderNote: 'AFA via CDS is currently male-only for Flying branch as of August 2026.',

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
        disciplines: [
          'B.Sc. (Physics and Mathematics compulsory at 10+2)',
          'B.E. / B.Tech',
        ],
        finalYearAllowed: true,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        percentageRule: { minPercentage: 60 },
        backlogsAllowed: false,
      },
    },

    cpssRule: {
      required: true,
      failureIsPermanentBar: true,
      notes: 'CPSS conducted after SSB recommendation. Prior failure is a permanent bar to all Flying entries.',
    },

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: [
      'UPSC CDS Written Exam',
      'SSB Interview (5 days)',
      'CPSS/PABT',
      'Medical Examination',
      'Training at AFA, Dundigal',
    ],
    commissionType: 'PERMANENT',
    ssbCentres: ['AFSB_DEHRADUN', 'AFSB_MYSORE', 'AFSB_GANDHINAGAR', 'AFSB_VARANASI'],
    primarySource: SOURCES.UPSC_CDS_I_2026,
  },

  // ---------------------------------------------------------------------------
  // 3. AFCAT Flying Branch
  // ---------------------------------------------------------------------------
  {
    entryId: 'IAF_AFCAT_FLYING',
    service: 'Air Force',
    entryName: 'AFCAT Flying',
    entryFullName: 'Air Force Common Admission Test — Flying Branch',
    entryCode: 'AFCAT-FLY',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'BOTH',
    genderNote:
      'AFCAT Flying Branch open to both male and female candidates since 2021. ' +
      'Different height requirements apply (Male: 162.5 cm, Female: 152 cm). ' +
      'Source: AFCAT 01/2026 official notification and ncaacademy.com verification.',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: true,
      marriageProhibitedDuringTraining: true,
    },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 20,
    maxAge: 24,
    ageNote:
      'Age: 20–24 years for standard Flying. CPL holders may apply up to 26 years. ' +
      'Exact DOB window: Per AFCAT 01/2026 — born 02 Jan 2003 to 01 Jan 2007.',

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        disciplines: [
          'B.Sc. with Physics and Mathematics at 10+2 level',
          'B.E. / B.Tech any branch',
        ],
        finalYearAllowed: false,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        percentageRule: { minPercentage: 60 },
        backlogsAllowed: false,
      },
      notes: 'Physics and Mathematics compulsory at Class 12 level.',
    },

    cplRule: {
      required: false,
      grantsAgeRelaxation: true,
      ageRelaxedTo: 26,
      notes: 'CPL (DGCA-issued) holders get upper age relaxation up to 26 years.',
    },

    cpssRule: {
      required: true,
      failureIsPermanentBar: true,
      notes:
        'CPSS (Computerised Pilot Selection System) conducted at IAF Selection Centres. ' +
        'Failure is a PERMANENT bar to all Flying entries across Army, Navy and Air Force.',
    },

    permanentRestrictions: [
      {
        id: 'CPSS_FAILED',
        description: 'Candidate has previously failed CPSS/PABT',
        condition: 'CPSS_FAILED',
        notes: 'Failure in CPSS is a lifetime permanent bar to all flying entries.',
      },
    ],

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: [
      'AFCAT Online Exam (2 hrs)',
      'EKT for Engineering graduates (Engineering Knowledge Test)',
      'AFSB Interview (5 days)',
      'CPSS/PABT at Airforce Selection Centre',
      'Medical Examination',
      'Training at AFA, Dundigal (74 weeks)',
    ],
    commissionType: 'SHORT_SERVICE',
    ssbCentres: ['AFSB_DEHRADUN', 'AFSB_MYSORE', 'AFSB_GANDHINAGAR', 'AFSB_VARANASI'],
    primarySource: SOURCES.IAF_AFCAT_01_2026,
  },

  // ---------------------------------------------------------------------------
  // 4. AFCAT Ground Duty Technical
  // ---------------------------------------------------------------------------
  {
    entryId: 'IAF_AFCAT_GD_TECH',
    service: 'Air Force',
    entryName: 'AFCAT GD Technical',
    entryFullName: 'Air Force Common Admission Test — Ground Duty Technical',
    entryCode: 'AFCAT-GDT',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'BOTH',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: false,
    },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 20,
    maxAge: 26,
    ageNote: 'Age: 20–26 years on course commencement date. Per AFCAT 01/2026: born 02 Jan 2001 to 01 Jan 2007.',

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        engineeringOnly: true,
        engineeringBranchRule: {
          allowedBranches: [
            'MECHANICAL', 'AEROSPACE', 'AERONAUTICAL', 'AUTOMOBILE',
            'ELECTRICAL', 'ELECTRICAL_ELECTRONICS', 'ECE', 'ELECTRONICS',
            'COMPUTER_SCIENCE', 'COMPUTER_ENGINEERING', 'INFORMATION_TECHNOLOGY',
            'CIVIL', 'INSTRUMENTATION', 'METALLURGY', 'PRODUCTION',
          ],
        },
        finalYearAllowed: false,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        percentageRule: { minPercentage: 60 },
        backlogsAllowed: false,
      },
      notes: 'EKT (Engineering Knowledge Test) paper varies by branch. Min 60% in BE/B.Tech.',
    },

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: [
      'AFCAT Online Exam + EKT',
      'AFSB Interview (5 days)',
      'Medical Examination',
    ],
    commissionType: 'SHORT_SERVICE',
    ssbCentres: ['AFSB_DEHRADUN', 'AFSB_MYSORE', 'AFSB_GANDHINAGAR', 'AFSB_VARANASI'],
    primarySource: SOURCES.IAF_AFCAT_01_2026,
  },

  // ---------------------------------------------------------------------------
  // 5. AFCAT GD Non-Technical — Administration
  // ---------------------------------------------------------------------------
  {
    entryId: 'IAF_AFCAT_GD_ADMIN',
    service: 'Air Force',
    entryName: 'AFCAT — Administration',
    entryFullName: 'Air Force Common Admission Test — Ground Duty Non-Technical (Administration)',
    entryCode: 'AFCAT-ADMIN',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'BOTH',

    nationalityRule: 'INDIAN_ONLY',
    maritalRule: { unmarriedRequired: false },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 20,
    maxAge: 26,

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        disciplines: ['Any Graduation (3-year degree from a recognised university)'],
        finalYearAllowed: false,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        percentageRule: { minPercentage: 60 },
        backlogsAllowed: false,
      },
    },

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: ['AFCAT Online Exam', 'AFSB Interview (5 days)', 'Medical Examination'],
    commissionType: 'SHORT_SERVICE',
    ssbCentres: ['AFSB_DEHRADUN', 'AFSB_MYSORE', 'AFSB_GANDHINAGAR', 'AFSB_VARANASI'],
    primarySource: SOURCES.IAF_AFCAT_01_2026,
  },

  // ---------------------------------------------------------------------------
  // 6. AFCAT GD Non-Technical — Logistics
  // ---------------------------------------------------------------------------
  {
    entryId: 'IAF_AFCAT_GD_LOGISTICS',
    service: 'Air Force',
    entryName: 'AFCAT — Logistics',
    entryFullName: 'Air Force Common Admission Test — Ground Duty Non-Technical (Logistics)',
    entryCode: 'AFCAT-LOG',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'BOTH',
    nationalityRule: 'INDIAN_ONLY',
    maritalRule: { unmarriedRequired: false },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 20,
    maxAge: 26,

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        disciplines: ['Any Graduation (3-year degree from a recognised university)'],
        finalYearAllowed: false,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        percentageRule: { minPercentage: 60 },
        backlogsAllowed: false,
      },
    },

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: ['AFCAT Online Exam', 'AFSB Interview (5 days)', 'Medical Examination'],
    commissionType: 'SHORT_SERVICE',
    ssbCentres: ['AFSB_DEHRADUN', 'AFSB_MYSORE', 'AFSB_GANDHINAGAR', 'AFSB_VARANASI'],
    primarySource: SOURCES.IAF_AFCAT_01_2026,
  },

  // ---------------------------------------------------------------------------
  // 7. AFCAT GD Non-Technical — Accounts
  // ---------------------------------------------------------------------------
  {
    entryId: 'IAF_AFCAT_GD_ACCOUNTS',
    service: 'Air Force',
    entryName: 'AFCAT — Accounts',
    entryFullName: 'Air Force Common Admission Test — Ground Duty Non-Technical (Accounts)',
    entryCode: 'AFCAT-ACC',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'BOTH',
    nationalityRule: 'INDIAN_ONLY',
    maritalRule: { unmarriedRequired: false },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 20,
    maxAge: 26,

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        disciplines: ['B.Com', 'Any graduation with Commerce at 10+2 or graduation level'],
        finalYearAllowed: false,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        percentageRule: { minPercentage: 60 },
        backlogsAllowed: false,
      },
    },

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: ['AFCAT Online Exam', 'AFSB Interview (5 days)', 'Medical Examination'],
    commissionType: 'SHORT_SERVICE',
    ssbCentres: ['AFSB_DEHRADUN', 'AFSB_MYSORE', 'AFSB_GANDHINAGAR', 'AFSB_VARANASI'],
    primarySource: SOURCES.IAF_AFCAT_01_2026,
  },

  // ---------------------------------------------------------------------------
  // 8. AFCAT GD Non-Technical — Education
  // ---------------------------------------------------------------------------
  {
    entryId: 'IAF_AFCAT_GD_EDUCATION',
    service: 'Air Force',
    entryName: 'AFCAT — Education',
    entryFullName: 'Air Force Common Admission Test — Ground Duty Non-Technical (Education)',
    entryCode: 'AFCAT-EDU',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'BOTH',
    nationalityRule: 'INDIAN_ONLY',
    maritalRule: { unmarriedRequired: false },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 20,
    maxAge: 26,

    educationRule: {
      minLevel: 'POST_GRADUATION',
      pgRequired: true,
      pgRule: {
        disciplines: [
          'M.Sc. / MA / M.Com in relevant subjects',
          'B.Ed. required in addition to PG degree',
        ],
        minPercentage: 50,
        bedRequired: true,
      },
    },

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: ['AFCAT Online Exam', 'AFSB Interview (5 days)', 'Medical Examination'],
    commissionType: 'SHORT_SERVICE',
    ssbCentres: ['AFSB_DEHRADUN', 'AFSB_MYSORE', 'AFSB_GANDHINAGAR', 'AFSB_VARANASI'],
    primarySource: SOURCES.IAF_AFCAT_01_2026,
  },

  // ---------------------------------------------------------------------------
  // 9. AFCAT GD Non-Technical — Meteorology
  // ---------------------------------------------------------------------------
  {
    entryId: 'IAF_AFCAT_GD_MET',
    service: 'Air Force',
    entryName: 'AFCAT — Meteorology',
    entryFullName: 'Air Force Common Admission Test — Ground Duty Non-Technical (Meteorology)',
    entryCode: 'AFCAT-MET',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'BOTH',
    nationalityRule: 'INDIAN_ONLY',
    maritalRule: { unmarriedRequired: false },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 20,
    maxAge: 26,

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        disciplines: [
          'B.Sc. with Physics (and Maths) — minimum 55%',
          'B.E. / B.Tech in relevant branch',
        ],
        finalYearAllowed: false,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        percentageRule: { minPercentage: 55 },
        backlogsAllowed: false,
      },
      notes: 'Physics compulsory at graduation. Maths at 12th level preferred.',
    },

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: ['AFCAT Online Exam', 'AFSB Interview (5 days)', 'Medical Examination'],
    commissionType: 'SHORT_SERVICE',
    ssbCentres: ['AFSB_DEHRADUN', 'AFSB_MYSORE', 'AFSB_GANDHINAGAR', 'AFSB_VARANASI'],
    primarySource: SOURCES.IAF_AFCAT_01_2026,
  },

  // ---------------------------------------------------------------------------
  // 10. NCC Special Entry Flying (Male only)
  // ---------------------------------------------------------------------------
  {
    entryId: 'IAF_NCC_FLYING',
    service: 'Air Force',
    entryName: 'NCC Special Entry (Flying)',
    entryFullName: 'NCC Special Entry — IAF Flying Branch',
    entryCode: 'NCC-FLY',
    status: 'SEASONAL',
    category: 'CIVILIAN',

    genderRule: 'MALE_ONLY',
    genderNote: 'NCC Special Entry Flying is currently male-only per IAF notification as of August 2026.',

    nationalityRule: 'INDIAN_ONLY',
    maritalRule: { unmarriedRequired: true },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 20,
    maxAge: 24,

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        disciplines: ['Graduation with Physics and Mathematics at 10+2'],
        finalYearAllowed: false,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        percentageRule: { minPercentage: 60 },
        backlogsAllowed: false,
      },
    },

    nccRule: {
      required: true,
      mandatoryWings: ['AIR'],
      minCertificate: 'C',
      minGrade: 'B',
      notes: 'Air Wing NCC C Certificate with minimum B grade.',
    },

    cpssRule: {
      required: true,
      failureIsPermanentBar: true,
    },

    cyclePattern: 'IRREGULAR',
    selectionProcess: [
      'Application via IAF',
      'AFSB Interview (no written exam)',
      'CPSS/PABT',
      'Medical Examination',
    ],
    commissionType: 'SHORT_SERVICE',
    ssbCentres: ['AFSB_DEHRADUN', 'AFSB_MYSORE', 'AFSB_GANDHINAGAR', 'AFSB_VARANASI'],
    primarySource: SOURCES.IAF_NCC_FLYING,
  },

  // ---------------------------------------------------------------------------
  // 11. GATE Technical Entry (IAF)
  // ---------------------------------------------------------------------------
  {
    entryId: 'IAF_GATE',
    service: 'Air Force',
    entryName: 'GATE Technical Entry',
    entryFullName: 'Indian Air Force GATE-based Technical Entry',
    entryCode: 'IAF-GATE',
    status: 'SEASONAL',
    category: 'CIVILIAN',

    genderRule: 'BOTH',

    nationalityRule: 'INDIAN_ONLY',
    maritalRule: { unmarriedRequired: false },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    ageNote: 'Age as per specific notification. Typically 20–26 years.',

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        engineeringOnly: true,
        engineeringBranchRule: {
          allowedBranches: [
            'MECHANICAL', 'AEROSPACE', 'AERONAUTICAL', 'ELECTRICAL',
            'ELECTRICAL_ELECTRONICS', 'ECE', 'COMPUTER_SCIENCE', 'COMPUTER_ENGINEERING',
          ],
        },
        finalYearAllowed: false,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        percentageRule: { minPercentage: 60 },
        backlogsAllowed: false,
      },
    },

    gateRule: {
      required: true,
      validPapers: ['ME', 'AE', 'EE', 'EC', 'CS'],
      validityNote: 'GATE score must be valid at time of application.',
    },

    cyclePattern: 'AS_NOTIFIED',
    selectionProcess: [
      'Application via IAF with valid GATE score',
      'AFSB Interview (5 days)',
      'Medical Examination',
    ],
    commissionType: 'SHORT_SERVICE',
    ssbCentres: ['AFSB_DEHRADUN', 'AFSB_MYSORE', 'AFSB_GANDHINAGAR', 'AFSB_VARANASI'],
    primarySource: SOURCES.IAF_GATE,
  },
];
