import { EntryRule } from '../types';
import { SOURCES } from '../sources';

// =============================================================================
// INDIAN ARMY — OFFICER ENTRY RULES
// All rules based on August 2026 notifications from joinindianarmy.nic.in
// and UPSC. Gender rules verified against latest official notifications.
// =============================================================================

export const ARMY_ENTRIES: EntryRule[] = [
  // ---------------------------------------------------------------------------
  // 1. NDA — National Defence Academy
  // ---------------------------------------------------------------------------
  {
    entryId: 'ARMY_NDA',
    service: 'Army',
    entryName: 'NDA',
    entryFullName: 'National Defence Academy — Army Wing',
    entryCode: 'NDA',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'BOTH',
    genderNote:
      'Open to women since Supreme Court order of September 2021. Female vacancies allocated across Army, Navy, and Air Force wings.',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: true,
      marriageProhibitedDuringTraining: true,
      notes: 'Candidates must be unmarried at the time of commencement of the course.',
    },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 16.5,
    maxAge: 19.5,
    ageNote: 'Age: 16½ to 19½ years as on course commencement date per UPSC notification.',

    educationRule: {
      minLevel: 'CLASS_12',
      class12Rule: {
        required: true,
        pcmRequired: false, // Army wing: 12th pass in any stream
        finalYearAllowed: true,
      },
      notes:
        'Army Wing: Class 12 in any stream. Navy/Air Force wings (separate entries) require Physics & Maths.',
    },

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: [
      'UPSC Written Exam',
      'SSB Interview (5 days)',
      'Medical Examination',
      'Merit List',
      'Training at NDA, Khadakwasla (3 years)',
    ],
    commissionType: 'PERMANENT',
    ssbCentres: ['ALLAHABAD_SC_EAST', 'BHOPAL_SC_CENTRAL', 'BANGALORE_SC_SOUTH', 'KAPURTHALA_SC_WEST'],
    primarySource: SOURCES.UPSC_NDA_I_2026,
  },

  // ---------------------------------------------------------------------------
  // 2. CDS — IMA (Indian Military Academy)
  // ---------------------------------------------------------------------------
  {
    entryId: 'ARMY_CDS_IMA',
    service: 'Army',
    entryName: 'CDS — IMA',
    entryFullName: 'Combined Defence Services — Indian Military Academy, Dehradun',
    entryCode: 'CDS-IMA',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'MALE_ONLY',
    genderNote: 'IMA Dehradun commissions male officers only as of August 2026.',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: true,
      marriageProhibitedDuringTraining: true,
    },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 19,
    maxAge: 24,
    ageNote: 'Age: 19–24 years on course commencement date per UPSC CDS notification.',

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        disciplines: ['Any discipline recognised by Association of Indian Universities'],
        finalYearAllowed: true,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        backlogsAllowed: false,
        backlogNote: 'Backlogs at time of application may affect candidature.',
      },
    },

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: [
      'UPSC CDS Written Exam',
      'SSB Interview (5 days)',
      'Medical Examination',
      'Merit List',
      'Training at IMA, Dehradun (18 months)',
    ],
    commissionType: 'PERMANENT',
    ssbCentres: ['ALLAHABAD_SC_EAST', 'BHOPAL_SC_CENTRAL', 'BANGALORE_SC_SOUTH', 'KAPURTHALA_SC_WEST'],
    primarySource: SOURCES.UPSC_CDS_I_2026,
  },

  // ---------------------------------------------------------------------------
  // 3. CDS — OTA (Officers Training Academy, Chennai)
  // ---------------------------------------------------------------------------
  {
    entryId: 'ARMY_CDS_OTA',
    service: 'Army',
    entryName: 'CDS — OTA',
    entryFullName: 'Combined Defence Services — Officers Training Academy, Chennai',
    entryCode: 'CDS-OTA',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'BOTH',
    genderNote: 'OTA Chennai commissions both male (SSC) and female (SSC Women) officers.',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: false,
      notes: 'No unmarried restriction for OTA; married candidates may apply.',
    },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 19,
    maxAge: 25,
    ageNote: 'Age: 19–25 years on course commencement date (male SSC). Check notification for women.',

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        disciplines: ['Any discipline recognised by Association of Indian Universities'],
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
      'Merit List',
      'Training at OTA, Chennai (11 months)',
    ],
    commissionType: 'SHORT_SERVICE',
    ssbCentres: ['ALLAHABAD_SC_EAST', 'BHOPAL_SC_CENTRAL', 'BANGALORE_SC_SOUTH', 'KAPURTHALA_SC_WEST'],
    primarySource: SOURCES.UPSC_CDS_I_2026,
  },

  // ---------------------------------------------------------------------------
  // 4. TES — Technical Entry Scheme
  // ---------------------------------------------------------------------------
  {
    entryId: 'ARMY_TES',
    service: 'Army',
    entryName: 'TES',
    entryFullName: 'Technical Entry Scheme',
    entryCode: 'TES',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'MALE_ONLY',
    genderNote: 'TES is currently male-only as of August 2026 notification.',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: true,
      marriageProhibitedDuringTraining: true,
    },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 16.5,
    maxAge: 19.5,
    ageNote: 'Age: 16½ to 19½ years on course commencement date.',

    educationRule: {
      minLevel: 'CLASS_12',
      class12Rule: {
        required: true,
        pcmRequired: true,
        percentageRule: {
          minPercentage: 70,
          subjectPercentages: { pcm: 70 },
        },
        finalYearAllowed: false,
      },
      notes: 'Must have passed Class 12 with Physics, Chemistry and Mathematics with minimum 70% aggregate in PCM.',
    },

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: [
      'Shortlisting (JEE Main score + 12th marks)',
      'SSB Interview (5 days)',
      'Medical Examination',
      'Training at IMA (1 year) + Technical Institution (3 years)',
    ],
    commissionType: 'PERMANENT',
    ssbCentres: ['ALLAHABAD_SC_EAST', 'BHOPAL_SC_CENTRAL', 'BANGALORE_SC_SOUTH', 'KAPURTHALA_SC_WEST'],
    primarySource: SOURCES.ARMY_TES,
  },

  // ---------------------------------------------------------------------------
  // 5. TGC — Technical Graduate Course
  // ---------------------------------------------------------------------------
  {
    entryId: 'ARMY_TGC',
    service: 'Army',
    entryName: 'TGC',
    entryFullName: 'Technical Graduate Course',
    entryCode: 'TGC',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'MALE_ONLY',
    genderNote: 'TGC is currently male-only as of August 2026 notification.',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: true,
    },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 20,
    maxAge: 27,

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        engineeringOnly: true,
        engineeringBranchRule: {
          allowedBranches: [
            'CIVIL', 'MECHANICAL', 'ELECTRICAL', 'ELECTRICAL_ELECTRONICS', 'ECE',
            'COMPUTER_SCIENCE', 'COMPUTER_ENGINEERING', 'INFORMATION_TECHNOLOGY',
            'ELECTRONICS', 'AEROSPACE', 'AERONAUTICAL', 'AUTOMOBILE', 'CHEMICAL',
            'METALLURGY', 'PRODUCTION', 'INSTRUMENTATION', 'MINING', 'ARCHITECTURE',
          ],
        },
        finalYearAllowed: true,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        percentageRule: { minPercentage: 60 },
        backlogsAllowed: false,
      },
    },

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: [
      'Direct SSB Interview (no written exam)',
      'SSB Interview (5 days)',
      'Medical Examination',
      'Training at IMA, Dehradun (1 year)',
    ],
    commissionType: 'PERMANENT',
    ssbCentres: ['ALLAHABAD_SC_EAST', 'BHOPAL_SC_CENTRAL', 'BANGALORE_SC_SOUTH', 'KAPURTHALA_SC_WEST'],
    primarySource: SOURCES.ARMY_TGC,
  },

  // ---------------------------------------------------------------------------
  // 6. SSC Technical — Men
  // ---------------------------------------------------------------------------
  {
    entryId: 'ARMY_SSC_TECH_MEN',
    service: 'Army',
    entryName: 'SSC Tech (Men)',
    entryFullName: 'Short Service Commission — Technical Men',
    entryCode: 'SSC-TECH',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'MALE_ONLY',
    genderNote: 'SSC Tech Men is a separate course (67th) with 350 male vacancies.',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: false,
      notes: 'No unmarried requirement for SSC Technical.',
    },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 20,
    maxAge: 27,
    ageNote: '20–27 years as on course commencement date.',

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        engineeringOnly: true,
        engineeringBranchRule: {
          allowedBranches: [
            'CIVIL', 'MECHANICAL', 'ELECTRICAL', 'ELECTRICAL_ELECTRONICS', 'ECE',
            'COMPUTER_SCIENCE', 'COMPUTER_ENGINEERING', 'INFORMATION_TECHNOLOGY',
            'ELECTRONICS', 'AEROSPACE', 'AERONAUTICAL', 'AUTOMOBILE', 'CHEMICAL',
            'METALLURGY', 'PRODUCTION', 'INSTRUMENTATION', 'MINING', 'ARCHITECTURE',
          ],
        },
        finalYearAllowed: true,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        percentageRule: { minPercentage: 60 },
        backlogsAllowed: false,
      },
    },

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: [
      'Application on joinindianarmy.nic.in',
      'SSB Interview (5 days)',
      'Medical Examination',
      'Training at OTA, Chennai (49 weeks)',
    ],
    commissionType: 'SHORT_SERVICE',
    ssbCentres: ['ALLAHABAD_SC_EAST', 'BHOPAL_SC_CENTRAL', 'BANGALORE_SC_SOUTH', 'KAPURTHALA_SC_WEST'],
    primarySource: SOURCES.ARMY_SSC_TECH_67,
  },

  // ---------------------------------------------------------------------------
  // 7. SSC Technical — Women (SSCW Tech)
  // ---------------------------------------------------------------------------
  {
    entryId: 'ARMY_SSCW_TECH',
    service: 'Army',
    entryName: 'SSC Tech (Women)',
    entryFullName: 'Short Service Commission — Technical Women (SSCW)',
    entryCode: 'SSCW-TECH',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'FEMALE_ONLY',
    genderNote: 'SSCW Tech is a separate course from SSC Tech Men. 30 female vacancies in 67th course.',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: false,
    },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 20,
    maxAge: 27,

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        engineeringOnly: true,
        engineeringBranchRule: {
          allowedBranches: [
            'CIVIL', 'MECHANICAL', 'ELECTRICAL', 'ELECTRICAL_ELECTRONICS', 'ECE',
            'COMPUTER_SCIENCE', 'COMPUTER_ENGINEERING', 'INFORMATION_TECHNOLOGY',
            'ELECTRONICS', 'AEROSPACE', 'AERONAUTICAL', 'AUTOMOBILE', 'CHEMICAL',
            'METALLURGY', 'PRODUCTION', 'INSTRUMENTATION', 'MINING', 'ARCHITECTURE',
          ],
        },
        finalYearAllowed: true,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        percentageRule: { minPercentage: 60 },
        backlogsAllowed: false,
      },
    },

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: [
      'Application on joinindianarmy.nic.in',
      'SSB Interview (5 days)',
      'Medical Examination',
      'Training at OTA, Chennai (49 weeks)',
    ],
    commissionType: 'SHORT_SERVICE',
    ssbCentres: ['ALLAHABAD_SC_EAST', 'BHOPAL_SC_CENTRAL', 'BANGALORE_SC_SOUTH', 'KAPURTHALA_SC_WEST'],
    primarySource: SOURCES.ARMY_SSCW_TECH,
  },

  // ---------------------------------------------------------------------------
  // 8. JAG — Judge Advocate General
  // ---------------------------------------------------------------------------
  {
    entryId: 'ARMY_JAG',
    service: 'Army',
    entryName: 'JAG',
    entryFullName: 'Judge Advocate General Entry',
    entryCode: 'JAG',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'BOTH',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: false,
    },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 21,
    maxAge: 27,
    ageNote: '21–27 years on course commencement date.',

    educationRule: {
      minLevel: 'GRADUATION',
      lawRule: {
        llbTypeAllowed: ['3_YEAR', '5_YEAR'],
        minPercentage: 55,
        finalYearAllowed: true,
        barCouncilRequired: false,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
      },
      notes: 'LLB degree with minimum 55% marks. Integrated 5-year LLB or 3-year LLB after graduation both accepted.',
    },

    cyclePattern: 'TWICE_YEARLY',
    selectionProcess: [
      'Application on joinindianarmy.nic.in',
      'SSB Interview (5 days)',
      'Medical Examination',
      'Training at OTA, Chennai',
    ],
    commissionType: 'SHORT_SERVICE',
    ssbCentres: ['ALLAHABAD_SC_EAST', 'BHOPAL_SC_CENTRAL', 'BANGALORE_SC_SOUTH', 'KAPURTHALA_SC_WEST'],
    primarySource: SOURCES.ARMY_JAG,
  },

  // ---------------------------------------------------------------------------
  // 9. NCC Special Entry (Army)
  // ---------------------------------------------------------------------------
  {
    entryId: 'ARMY_NCC',
    service: 'Army',
    entryName: 'NCC Special Entry',
    entryFullName: 'National Cadet Corps Special Entry — Army',
    entryCode: 'NCC-ARMY',
    status: 'ACTIVE',
    category: 'CIVILIAN',

    genderRule: 'BOTH',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: false,
    },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    minAge: 19,
    maxAge: 25,

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        disciplines: ['Any discipline recognised by AIU'],
        finalYearAllowed: true,
        qualificationRequiredBy: 'COURSE_COMMENCEMENT',
        backlogsAllowed: false,
        percentageRule: { minPercentage: 50 },
      },
    },

    nccRule: {
      required: true,
      mandatoryWings: ['ARMY'],
      minCertificate: 'C',
      minGrade: 'B',
      notes: 'Army NCC C Certificate with minimum B grade required.',
    },

    cyclePattern: 'ANNUAL',
    selectionProcess: [
      'Application on joinindianarmy.nic.in',
      'SSB Interview (5 days — no written exam)',
      'Medical Examination',
      'Training at OTA, Chennai',
    ],
    commissionType: 'SHORT_SERVICE',
    ssbCentres: ['ALLAHABAD_SC_EAST', 'BHOPAL_SC_CENTRAL', 'BANGALORE_SC_SOUTH', 'KAPURTHALA_SC_WEST'],
    primarySource: SOURCES.ARMY_NCC,
  },

  // ---------------------------------------------------------------------------
  // 10. ACC — Army Cadet College (In-Service)
  // ---------------------------------------------------------------------------
  {
    entryId: 'ARMY_ACC',
    service: 'Army',
    entryName: 'ACC Entry',
    entryFullName: 'Army Cadet College Entry',
    entryCode: 'ACC',
    status: 'ACTIVE',
    category: 'IN_SERVICE',

    genderRule: 'BOTH',
    genderNote: 'Both male and female serving soldiers may apply.',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: false,
    },

    ageReferenceType: 'NOTIFICATION_DATE',
    ageNote: 'Age limits as per specific ACC notification for the respective course.',

    educationRule: {
      minLevel: 'CLASS_12',
      class12Rule: {
        required: true,
        pcmRequired: false,
        finalYearAllowed: false,
      },
    },

    inServiceRule: {
      required: true,
      allowedServices: ['Army'],
      minServiceYears: 2,
      notes: 'Serving Army soldiers (JCOs/ORs) only. Minimum service varies by notification.',
    },

    cyclePattern: 'ANNUAL',
    selectionProcess: [
      'Unit recommendation',
      'Screening exam',
      'SSB Interview',
      'Medical Examination',
      'Training at ACC, Gaya (3 years) + IMA (1 year)',
    ],
    commissionType: 'PERMANENT',
    primarySource: SOURCES.ARMY_ACC,
  },

  // ---------------------------------------------------------------------------
  // 11. SCO — Special Commissioned Officer (In-Service)
  // ---------------------------------------------------------------------------
  {
    entryId: 'ARMY_SCO',
    service: 'Army',
    entryName: 'SCO',
    entryFullName: 'Special Commissioned Officer',
    entryCode: 'SCO',
    status: 'SEASONAL',
    category: 'IN_SERVICE',

    genderRule: 'BOTH',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: false,
    },

    ageReferenceType: 'NOTIFICATION_DATE',
    ageNote: 'Age and rank requirements as per specific SCO notification. Not regularly advertised.',

    educationRule: {
      minLevel: 'CLASS_12',
    },

    inServiceRule: {
      required: true,
      allowedServices: ['Army'],
      notes: 'Available to serving ORs/JCOs meeting specific criteria as per individual notification.',
    },

    cyclePattern: 'IRREGULAR',
    selectionProcess: [
      'Unit recommendation',
      'Interview',
      'Medical Examination',
    ],
    commissionType: 'SHORT_SERVICE',
    primarySource: SOURCES.ARMY_SCO,
  },

  // ---------------------------------------------------------------------------
  // 12. UES — University Entry Scheme (Suspended)
  // ---------------------------------------------------------------------------
  {
    entryId: 'ARMY_UES',
    service: 'Army',
    entryName: 'UES',
    entryFullName: 'University Entry Scheme',
    entryCode: 'UES',
    status: 'SUSPENDED',
    category: 'CIVILIAN',

    genderRule: 'MALE_ONLY',
    genderNote: 'Historically male-only; not currently advertised.',

    nationalityRule: 'INDIAN_ONLY',

    maritalRule: {
      unmarriedRequired: true,
    },

    ageReferenceType: 'COURSE_COMMENCEMENT',
    ageNote: 'Not currently advertised. Age: 18–24 years (historical).',

    educationRule: {
      minLevel: 'GRADUATION',
      graduationRule: {
        required: true,
        engineeringOnly: true,
        finalYearAllowed: false,
        backlogsAllowed: false,
        notes: 'Not currently advertised.',
      },
    },

    cyclePattern: 'AS_NOTIFIED',
    selectionProcess: [
      'Campus interviews at participating engineering institutions',
      'SSB Interview',
      'Medical Examination',
    ],
    commissionType: 'PERMANENT',
    primarySource: { title: 'UES — Currently Suspended', lastVerified: '2026-08' },
  },
];
