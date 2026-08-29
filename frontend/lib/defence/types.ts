// =============================================================================
// DEFENCE ENTRY CALCULATOR — CORE TYPE DEFINITIONS
// All TypeScript interfaces, enums and type aliases used across the feature.
// =============================================================================

// ---------------------------------------------------------------------------
// Enumerations
// ---------------------------------------------------------------------------

export type ServiceType = 'Army' | 'Navy' | 'Air Force' | 'Coast Guard';

export type GenderRule = 'MALE_ONLY' | 'FEMALE_ONLY' | 'BOTH';

export type EntryStatus =
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'DISCONTINUED'
  | 'PLANNED'
  | 'SEASONAL'
  | 'NOT_CURRENTLY_ADVERTISED';

export type AgeReferenceType =
  | 'COURSE_COMMENCEMENT'
  | 'ACADEMY_JOINING'
  | 'TRAINING_COMMENCEMENT'
  | 'NOTIFICATION_DATE'
  | 'EXAM_DATE'
  | 'OTHER';

export type CyclePattern =
  | 'TWICE_YEARLY'
  | 'ANNUAL'
  | 'IRREGULAR'
  | 'AS_NOTIFIED'
  | 'IN_SERVICE';

export type QualificationRequiredBy =
  | 'APPLICATION_DATE'
  | 'SSB_DATE'
  | 'DOCUMENT_VERIFICATION'
  | 'COURSE_COMMENCEMENT'
  | 'ACADEMY_JOINING'
  | 'OTHER';

export type CycleStatus = 'OFFICIAL' | 'PROJECTED';

export type ConditionResult = 'PASS' | 'FAIL' | 'NOT_APPLICABLE' | 'UNKNOWN' | 'WAIVED';

export type EducationLevel =
  | 'CLASS_10'
  | 'CLASS_12'
  | 'DIPLOMA'
  | 'GRADUATION'
  | 'POST_GRADUATION'
  | 'PROFESSIONAL';

export type EngineeringBranch =
  | 'COMPUTER_SCIENCE'
  | 'COMPUTER_ENGINEERING'
  | 'INFORMATION_TECHNOLOGY'
  | 'ELECTRONICS'
  | 'ECE'
  | 'ELECTRICAL'
  | 'ELECTRICAL_ELECTRONICS'
  | 'MECHANICAL'
  | 'CIVIL'
  | 'AEROSPACE'
  | 'AERONAUTICAL'
  | 'AUTOMOBILE'
  | 'MARINE'
  | 'NAVAL_ARCHITECTURE'
  | 'METALLURGY'
  | 'PRODUCTION'
  | 'INSTRUMENTATION'
  | 'CHEMICAL'
  | 'MINING'
  | 'ARCHITECTURE'
  | 'OTHER';

export type NCCWing = 'ARMY' | 'NAVY' | 'AIR';
export type NCCCertificate = 'A' | 'B' | 'C';
export type SSBResult = 
  | 'SCREENED_OUT'
  | 'CONFERENCE_OUT'
  | 'RECOMMENDED'
  | 'NOT_RECOMMENDED'
  | 'MEDICAL_UNFIT'
  | 'MERIT_OUT'
  | 'SELECTED'
  | 'OTHER';

export type CPSSResult = 'NEVER_APPEARED' | 'PASSED' | 'FAILED';

// ---------------------------------------------------------------------------
// Source Reference
// ---------------------------------------------------------------------------

export interface SourceRef {
  title: string;
  url?: string;
  notificationName?: string;
  notificationDate?: string; // 'YYYY-MM-DD'
  paragraph?: string;
  lastVerified: string; // 'YYYY-MM'
}

// ---------------------------------------------------------------------------
// Candidate Profile (form state)
// ---------------------------------------------------------------------------

export interface SSBAppearance {
  service: ServiceType;
  entry: string;
  year: number;
  centre?: string;
  result: SSBResult;
}

export interface CandidateProfile {
  // Basic
  dob: string; // ISO 'YYYY-MM-DD' — required
  gender: 'Male' | 'Female';
  nationality: 'Indian' | 'Other';
  maritalStatus: 'Unmarried' | 'Married';
  isCurrentlyServing: boolean;

  // In-service details (only if isCurrentlyServing)
  servingService?: ServiceType;
  servingRank?: string;
  serviceYears?: number;
  serviceMonths?: number;
  servingArm?: string;

  // Education
  highestQualification: EducationLevel;

  // Class 12
  class12?: {
    status: 'PASSED' | 'APPEARING';
    hasPCM: boolean;
    physicsMarks?: number;
    mathsMarks?: number;
    chemistryMarks?: number;
    pcmPercentage?: number;
    englishMarks?: number;
    overallPercentage?: number;
    yearOfPassing?: number;
  };

  // Graduation
  graduation?: {
    degree: string;
    university?: string;
    branch?: string;
    engineeringBranch?: EngineeringBranch;
    percentage?: number;
    cgpa?: number;
    cgpaScale?: number; // e.g. 10 for 10-point scale
    duration?: 3 | 4 | 5;
    passingYear?: number;
    status: 'COMPLETED' | 'FINAL_YEAR' | 'IN_PROGRESS';
    expectedCompletionDate?: string; // 'YYYY-MM'
    hasBacklogs: boolean;
    currentSemester?: number;
  };

  // Post-Graduation / Professional
  postGraduation?: {
    degree: string;
    branch?: string;
    percentage?: number;
    status: 'COMPLETED' | 'FINAL_YEAR' | 'IN_PROGRESS';
    expectedCompletionDate?: string;
  };

  // Law
  law?: {
    llbType: '3_YEAR' | '5_YEAR';
    percentage?: number;
    status: 'COMPLETED' | 'FINAL_YEAR';
    barCouncilRegistered?: boolean;
  };

  // NCC
  ncc?: {
    wing: NCCWing;
    certificate: NCCCertificate;
    grade?: 'A' | 'B' | 'C';
    certificateDate?: string; // 'YYYY-MM'
  };

  // JEE
  jeeMain?: {
    appeared: boolean;
    year?: number;
    rank?: number;
    percentile?: number;
  };

  // GATE
  gate?: {
    qualified: boolean;
    year?: number;
    paper?: string;
    score?: number;
    air?: number;
    validityYears?: number; // how many years from exam date
  };

  // CPL
  cpl?: {
    holds: boolean;
    issuingAuthority?: string;
    dgcaValid?: boolean;
  };

  // CPSS/PABT history — critical for Flying entries
  cpssResult: CPSSResult;

  // Previous SSB appearances (optional)
  ssbHistory?: SSBAppearance[];
}

// ---------------------------------------------------------------------------
// Education Rule
// ---------------------------------------------------------------------------

export interface EngineeringBranchRule {
  allowedBranches: EngineeringBranch[];
  rejectMessage?: string;
}

export interface PercentageRule {
  minPercentage: number;
  subjectPercentages?: {
    physics?: number;
    maths?: number;
    chemistry?: number;
    english?: number;
    pcm?: number;
  };
  cgpaAllowed?: boolean;
  cgpaConversionNote?: string;
}

export interface GraduationRule {
  required: boolean;
  minDuration?: 3 | 4 | 5;
  disciplines?: string[]; // Free text list of accepted disciplines
  engineeringOnly?: boolean;
  engineeringBranchRule?: EngineeringBranchRule;
  percentageRule?: PercentageRule;
  finalYearAllowed?: boolean;
  qualificationRequiredBy?: QualificationRequiredBy;
  backlogsAllowed?: boolean;
  backlogNote?: string;
  notes?: string;
}

export interface Class12Rule {
  required: boolean;
  pcmRequired?: boolean;
  percentageRule?: PercentageRule;
  finalYearAllowed?: boolean;
}

export interface EducationRule {
  minLevel: EducationLevel;
  class12Rule?: Class12Rule;
  graduationRule?: GraduationRule;
  pgRequired?: boolean;
  pgRule?: {
    disciplines?: string[];
    minPercentage?: number;
    bedRequired?: boolean;
  };
  lawRule?: {
    llbTypeAllowed: ('3_YEAR' | '5_YEAR')[];
    minPercentage: number;
    finalYearAllowed: boolean;
    barCouncilRequired?: boolean;
    qualificationRequiredBy?: QualificationRequiredBy;
  };
  notes?: string;
}

// ---------------------------------------------------------------------------
// Special Qualification Rules
// ---------------------------------------------------------------------------

export interface NCCRule {
  required: boolean;
  mandatoryWings?: NCCWing[];
  minCertificate?: NCCCertificate;
  minGrade?: 'A' | 'B' | 'C';
  notes?: string;
}

export interface JEERule {
  required: boolean;
  minRank?: number;
  notes?: string;
}

export interface GATERule {
  required: boolean;
  validPapers?: string[];
  validityNote?: string;
  notes?: string;
}

export interface CPLRule {
  required: boolean; // true if CPL is compulsory
  grantsAgeRelaxation?: boolean; // e.g. AFCAT Flying CPL holders up to 26
  ageRelaxedTo?: number;
  notes?: string;
}

export interface CPSSRule {
  required: boolean; // must the candidate appear for CPSS?
  failureIsPermanentBar: boolean; // if true, past failure = permanent ineligibility
  notes?: string;
}

// ---------------------------------------------------------------------------
// Marital Status Rule
// ---------------------------------------------------------------------------

export interface MaritalRule {
  unmarriedRequired: boolean; // at course commencement
  marriageProhibitedDuringTraining?: boolean;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Permanent Restriction
// ---------------------------------------------------------------------------

export interface PermanentRestriction {
  id: string;
  description: string;
  condition: 'CPSS_FAILED' | 'AGE_EXCEEDED' | 'QUALIFICATION_IMPOSSIBLE' | 'GENDER' | 'IN_SERVICE_REQUIRED' | 'OTHER';
  notes?: string;
}

// ---------------------------------------------------------------------------
// In-Service Rule (ACC / SCO)
// ---------------------------------------------------------------------------

export interface InServiceRule {
  required: boolean; // must be currently serving
  allowedServices?: ServiceType[];
  minServiceYears?: number;
  allowedRanks?: string[];
  notes?: string;
}

// ---------------------------------------------------------------------------
// Application Cycle (one officially-notified course intake)
// ---------------------------------------------------------------------------

export interface CourseIntake {
  entryId: string;
  cycleId: string;         // e.g. 'AFCAT_01_2026'
  cycleLabel: string;      // e.g. 'AFCAT 01/2026'
  status: CycleStatus;
  temporalStatus?: 'CURRENT' | 'FUTURE' | 'EXPIRED';
  applicationStart?: string;   // ISO date
  applicationEnd?: string;     // ISO date
  examDate?: string;           // ISO date
  ssbStartDate?: string;
  courseCommencementDate: string; // ISO date — PRIMARY age reference
  academyJoiningDate?: string;
  ageReferenceType: AgeReferenceType;
  dobMin: string;          // ISO date 'YYYY-MM-DD'
  dobMax: string;          // ISO date 'YYYY-MM-DD'
  vacancies?: number;
  source: string;
  sourceUrl?: string;
  notificationDate?: string;
  lastVerified: string;   // 'YYYY-MM'
  notes?: string;
}

// ---------------------------------------------------------------------------
// Entry Rule — one complete officer-entry definition
// ---------------------------------------------------------------------------

export interface EntryRule {
  entryId: string;
  service: ServiceType;
  entryName: string;          // Short canonical name e.g. 'AFCAT Flying'
  entryFullName: string;      // Full display name
  entryCode?: string;         // e.g. 'TGC', 'JAG', 'AFCAT'
  status: EntryStatus;
  category: 'CIVILIAN' | 'IN_SERVICE';

  // Gender
  genderRule: GenderRule;
  genderNote?: string;

  // Nationality
  nationalityRule: 'INDIAN_ONLY' | 'ANY';

  // Marital status
  maritalRule: MaritalRule;

  // Age (generic fallback — specific DOB windows live in CourseIntake)
  ageReferenceType: AgeReferenceType;
  minAge?: number;
  maxAge?: number;
  ageNote?: string;

  // Education
  educationRule: EducationRule;

  // Special qualifications
  nccRule?: NCCRule;
  jeeRule?: JEERule;
  gateRule?: GATERule;
  cplRule?: CPLRule;
  cpssRule?: CPSSRule;

  // In-service (ACC / SCO)
  inServiceRule?: InServiceRule;

  // Permanent restrictions
  permanentRestrictions?: PermanentRestriction[];

  // Cycle recurrence
  cyclePattern: CyclePattern;

  // SSB/selection centres
  ssbCentres?: string[]; // names matching SSBCentre.centreCode in ssbCentres.ts

  // Selection process steps (for display)
  selectionProcess?: string[];

  // Commission type
  commissionType?: 'PERMANENT' | 'SHORT_SERVICE' | 'BOTH';

  // Official source
  primarySource: SourceRef;
  additionalSources?: SourceRef[];
}

// ---------------------------------------------------------------------------
// Eligibility Result — output of the rule engine per entry per cycle
// ---------------------------------------------------------------------------

export interface ConditionDetail {
  result: ConditionResult;
  label: string;         // e.g. 'Age', 'Physics & Maths at 12th'
  value?: string;        // candidate value e.g. '72% PCM'
  required?: string;     // required value e.g. '≥70% PCM'
  explanation?: string;  // human-readable reason
  sourceNote?: string;   // which notification rule this comes from
}

export interface EligibilityResult {
  entryId: string;
  cycleId: string;
  eligible: boolean;
  status: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'PROJECTED_ELIGIBLE' | 'NOT_APPLICABLE' | 'UNKNOWN';
  conditions: Record<string, ConditionDetail>;
  failedConditions: string[];   // condition keys
  satisfiedConditions: string[];
  isLastChance: boolean;
  isPermanentlyBarred: boolean;
  permanentBarReasons?: string[];
  ageDetail?: {
    dobMin: string;
    dobMax: string;
    referenceDate: string;
    referenceType: AgeReferenceType;
    candidateDOB: string;
  };
  source: SourceRef;
}

// ---------------------------------------------------------------------------
// Opportunity Result — counts future eligible/projected cycles
// ---------------------------------------------------------------------------

export interface CycleOpportunity {
  cycleId: string;
  cycleLabel: string;
  courseCommencementDate: string;
  status: CycleStatus;
  temporalStatus?: 'CURRENT' | 'FUTURE' | 'EXPIRED';
  eligibilityResult: EligibilityResult;
  isLastChance: boolean;
}

export interface OpportunityResult {
  entryId: string;
  entry: EntryRule;
  confirmedEligible: number;     // OFFICIAL cycles where ELIGIBLE
  projectedEligible: number;     // PROJECTED cycles where PROJECTED_ELIGIBLE
  totalOpportunities: number;    // sum of above
  notEligible: number;
  cycles: CycleOpportunity[];
  ageExpiryYear?: number;        // last year candidate is eligible
  isLastChance: boolean;
  isPermanentlyBarred: boolean;
  permanentBarReasons?: string[];
  overallStatus: 'ELIGIBLE' | 'PROJECTED' | 'NOT_ELIGIBLE' | 'NOT_APPLICABLE' | 'PERMANENTLY_BARRED';
}

// ---------------------------------------------------------------------------
// Summary (top-level result for one candidate)
// ---------------------------------------------------------------------------

export interface CalculatorResult {
  candidate: CandidateProfile;
  calculatedAt: string; // ISO timestamp
  eligible: OpportunityResult[];
  projected: OpportunityResult[];
  notEligible: OpportunityResult[];
  notApplicable: OpportunityResult[];
  permanentlyBarred: OpportunityResult[];
  totalEntries: number;
  totalOpportunities: number;
}
