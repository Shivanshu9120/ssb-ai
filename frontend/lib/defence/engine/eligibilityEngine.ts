import {
  CandidateProfile,
  EntryRule,
  CourseIntake,
  EligibilityResult,
  ConditionDetail,
  ConditionResult,
  EducationLevel,
  EngineeringBranch,
} from '../types';

// =============================================================================
// ELIGIBILITY ENGINE
// Core evaluation function. All age checks use DOB window from CourseIntake.
// No "today - DOB" logic anywhere.
// =============================================================================

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseDate(iso: string): Date {
  return new Date(iso + 'T00:00:00Z');
}

/** Compare candidate DOB against official dobMin/dobMax window (inclusive on both ends). */
function checkAge(
  dob: string,
  dobMin: string,
  dobMax: string,
): ConditionDetail {
  const dobDate = parseDate(dob);
  const minDate = parseDate(dobMin);
  const maxDate = parseDate(dobMax);

  const pass = dobDate >= minDate && dobDate <= maxDate;

  return {
    result: pass ? 'PASS' : 'FAIL',
    label: 'Date of Birth',
    value: dob,
    required: `Born between ${dobMin} and ${dobMax}`,
    explanation: pass
      ? `Your DOB (${dob}) is within the eligible window (${dobMin} to ${dobMax}).`
      : dobDate < minDate
      ? `Your DOB (${dob}) is before the minimum DOB (${dobMin}). You are older than the upper age limit.`
      : `Your DOB (${dob}) is after the maximum DOB (${dobMax}). You are younger than the minimum age.`,
  };
}

function checkGender(
  candidateGender: 'Male' | 'Female',
  rule: EntryRule,
): ConditionDetail {
  const pass =
    rule.genderRule === 'BOTH' ||
    (rule.genderRule === 'MALE_ONLY' && candidateGender === 'Male') ||
    (rule.genderRule === 'FEMALE_ONLY' && candidateGender === 'Female');

  return {
    result: pass ? 'PASS' : 'FAIL',
    label: 'Gender',
    value: candidateGender,
    required:
      rule.genderRule === 'BOTH'
        ? 'Any gender'
        : rule.genderRule === 'MALE_ONLY'
        ? 'Male only'
        : 'Female only',
    explanation: pass
      ? undefined
      : rule.genderNote || `This entry is ${rule.genderRule === 'MALE_ONLY' ? 'male' : 'female'} only.`,
  };
}

function checkMaritalStatus(
  candidate: CandidateProfile,
  rule: EntryRule,
): ConditionDetail {
  if (!rule.maritalRule.unmarriedRequired) {
    return { result: 'NOT_APPLICABLE', label: 'Marital Status' };
  }
  const pass = candidate.maritalStatus === 'Unmarried';
  return {
    result: pass ? 'PASS' : 'FAIL',
    label: 'Marital Status',
    value: candidate.maritalStatus,
    required: 'Must be unmarried at course commencement',
    explanation: pass
      ? undefined
      : 'This entry requires candidates to be unmarried at the time of course commencement.',
  };
}

function checkNationality(candidate: CandidateProfile, rule: EntryRule): ConditionDetail {
  if (rule.nationalityRule === 'ANY') return { result: 'PASS', label: 'Nationality' };
  const pass = candidate.nationality === 'Indian';
  return {
    result: pass ? 'PASS' : 'FAIL',
    label: 'Nationality',
    value: candidate.nationality,
    required: 'Indian national',
    explanation: pass ? undefined : 'Only Indian nationals are eligible.',
  };
}

function checkInService(candidate: CandidateProfile, rule: EntryRule): ConditionDetail {
  if (!rule.inServiceRule) return { result: 'NOT_APPLICABLE', label: 'Service Status' };
  if (!rule.inServiceRule.required) return { result: 'NOT_APPLICABLE', label: 'Service Status' };

  if (!candidate.isCurrentlyServing) {
    return {
      result: 'FAIL',
      label: 'Service Status',
      value: 'Civilian',
      required: 'Must be a serving member of Indian Armed Forces',
      explanation: 'This entry (ACC/SCO) is only available to serving personnel.',
    };
  }

  const allowedServices = rule.inServiceRule.allowedServices;
  if (allowedServices && candidate.servingService && !allowedServices.includes(candidate.servingService)) {
    return {
      result: 'FAIL',
      label: 'Service Status',
      value: `Serving in ${candidate.servingService}`,
      required: `Must be serving in: ${allowedServices.join(', ')}`,
    };
  }

  return { result: 'PASS', label: 'Service Status', value: 'Serving' };
}

function checkCPSS(candidate: CandidateProfile, rule: EntryRule): ConditionDetail {
  if (!rule.cpssRule) return { result: 'NOT_APPLICABLE', label: 'CPSS/PABT' };

  if (candidate.cpssResult === 'FAILED' && rule.cpssRule.failureIsPermanentBar) {
    return {
      result: 'FAIL',
      label: 'CPSS/PABT',
      value: 'Previously failed CPSS/PABT',
      required: 'Must not have previously failed CPSS/PABT',
      explanation:
        'Failure in CPSS (Computerised Pilot Selection System) is a permanent bar to all Flying branch entries across all services. This cannot be overturned.',
    };
  }

  return { result: 'PASS', label: 'CPSS/PABT', value: candidate.cpssResult };
}

function checkCPL(candidate: CandidateProfile, rule: EntryRule): ConditionDetail {
  if (!rule.cplRule?.required) return { result: 'NOT_APPLICABLE', label: 'CPL (Pilot Licence)' };

  const pass = candidate.cpl?.holds === true && candidate.cpl?.dgcaValid === true;
  return {
    result: pass ? 'PASS' : 'FAIL',
    label: 'Commercial Pilot Licence (DGCA)',
    value: candidate.cpl?.holds ? 'CPL held' : 'No CPL',
    required: 'Valid DGCA CPL required',
    explanation: pass
      ? undefined
      : 'A valid DGCA-issued Commercial Pilot Licence is mandatory for this entry.',
  };
}

function checkNCC(candidate: CandidateProfile, rule: EntryRule): ConditionDetail {
  if (!rule.nccRule?.required) return { result: 'NOT_APPLICABLE', label: 'NCC Certificate' };

  if (!candidate.ncc) {
    return {
      result: 'FAIL',
      label: 'NCC Certificate',
      value: 'No NCC',
      required: `NCC ${rule.nccRule.minCertificate || 'C'} Certificate`,
      explanation: `This entry requires an NCC ${rule.nccRule.minCertificate || 'C'} Certificate${
        rule.nccRule.mandatoryWings ? ` (${rule.nccRule.mandatoryWings.join('/')} Wing)` : ''
      }.`,
    };
  }

  const certOrder = { A: 1, B: 2, C: 3 };
  const gradeOrder = { A: 1, B: 2, C: 3 };

  const minCert = rule.nccRule.minCertificate || 'C';
  const minGrade = rule.nccRule.minGrade;
  const requiredWings = rule.nccRule.mandatoryWings;

  const certOk = certOrder[candidate.ncc.certificate] >= certOrder[minCert];
  const wingOk = !requiredWings || requiredWings.includes(candidate.ncc.wing);
  const gradeOk =
    !minGrade || gradeOrder[candidate.ncc.grade || 'A'] >= gradeOrder[minGrade];

  const pass = certOk && wingOk && gradeOk;

  return {
    result: pass ? 'PASS' : 'FAIL',
    label: 'NCC Certificate',
    value: `NCC ${candidate.ncc.certificate} (${candidate.ncc.wing} Wing)${candidate.ncc.grade ? `, Grade ${candidate.ncc.grade}` : ''}`,
    required: `NCC ${minCert} cert${requiredWings ? ` (${requiredWings.join('/')} Wing)` : ''}${minGrade ? `, min Grade ${minGrade}` : ''}`,
    explanation: pass
      ? undefined
      : !wingOk
      ? `${requiredWings?.join('/')} Wing NCC certificate required. You have ${candidate.ncc.wing} Wing.`
      : !certOk
      ? `NCC ${minCert} Certificate required. You have NCC ${candidate.ncc.certificate}.`
      : `Minimum NCC Grade ${minGrade} required.`,
  };
}

function checkJEE(candidate: CandidateProfile, rule: EntryRule): ConditionDetail {
  if (!rule.jeeRule?.required) return { result: 'NOT_APPLICABLE', label: 'JEE Main' };

  const pass = candidate.jeeMain?.appeared === true;
  return {
    result: pass ? 'PASS' : 'FAIL',
    label: 'JEE Main Score',
    value: candidate.jeeMain?.appeared ? `JEE Main appeared (${candidate.jeeMain.year || 'year not specified'})` : 'Not appeared',
    required: 'JEE Main score is mandatory',
    explanation: pass
      ? undefined
      : 'A JEE Main score is compulsory for this entry. Shortlisting is based on JEE Main rank.',
  };
}

function checkGATE(candidate: CandidateProfile, rule: EntryRule): ConditionDetail {
  if (!rule.gateRule?.required) return { result: 'NOT_APPLICABLE', label: 'GATE Score' };

  const pass = candidate.gate?.qualified === true;
  return {
    result: pass ? 'PASS' : 'FAIL',
    label: 'GATE Score',
    value: candidate.gate?.qualified ? `GATE qualified (${candidate.gate.paper}, ${candidate.gate.year})` : 'Not qualified',
    required: `Valid GATE score required${rule.gateRule.validPapers ? ` (Papers: ${rule.gateRule.validPapers.join(', ')})` : ''}`,
    explanation: pass
      ? undefined
      : 'A valid GATE score is mandatory for this entry.',
  };
}

// ---------------------------------------------------------------------------
// Education checks
// ---------------------------------------------------------------------------

const EDUCATION_LEVEL_ORDER: Record<EducationLevel, number> = {
  CLASS_10: 1,
  CLASS_12: 2,
  DIPLOMA: 2,
  GRADUATION: 3,
  PROFESSIONAL: 3,
  POST_GRADUATION: 4,
};

function checkEducationLevel(candidate: CandidateProfile, rule: EntryRule): ConditionDetail {
  const candLevel = EDUCATION_LEVEL_ORDER[candidate.highestQualification] || 0;
  const reqLevel = EDUCATION_LEVEL_ORDER[rule.educationRule.minLevel] || 0;

  if (candLevel >= reqLevel) return { result: 'PASS', label: 'Education Level' };

  // If candidate is a final-year graduation student and graduation is allowed
  if (
    rule.educationRule.minLevel === 'GRADUATION' &&
    rule.educationRule.graduationRule?.finalYearAllowed &&
    (candidate.graduation?.status === 'FINAL_YEAR' || candidate.graduation?.status === 'COMPLETED')
  ) {
    return { result: 'PASS', label: 'Education Level', value: 'Final year student' };
  }

  return {
    result: 'FAIL',
    label: 'Education Level',
    value: candidate.highestQualification,
    required: rule.educationRule.minLevel,
    explanation: `This entry requires ${rule.educationRule.minLevel.replace('_', ' ')} level education.`,
  };
}

function checkClass12(candidate: CandidateProfile, rule: EntryRule): ConditionDetail {
  const r = rule.educationRule.class12Rule;
  if (!r?.required) return { result: 'NOT_APPLICABLE', label: 'Class 12' };

  if (!candidate.class12) {
    return {
      result: 'FAIL',
      label: 'Class 12',
      required: 'Class 12 pass certificate required',
      explanation: 'Class 12 information not provided.',
    };
  }

  if (candidate.class12.status === 'APPEARING' && !r.finalYearAllowed) {
    return {
      result: 'FAIL',
      label: 'Class 12',
      value: 'Appearing',
      required: 'Must have passed Class 12 (appearing not eligible)',
    };
  }

  if (r.pcmRequired && !candidate.class12.hasPCM) {
    return {
      result: 'FAIL',
      label: 'Class 12 — Physics, Chemistry & Mathematics',
      value: 'PCM not available',
      required: 'Physics, Chemistry and Mathematics required at Class 12',
    };
  }

  if (r.percentageRule) {
    const { minPercentage } = r.percentageRule;
    const subj = r.percentageRule.subjectPercentages;
    if (subj?.pcm) {
      const required = subj.pcm;
      const actual = candidate.class12.pcmPercentage;
      if (actual !== undefined && actual < required) {
        return {
          result: 'FAIL',
          label: 'Class 12 PCM Percentage',
          value: `${actual}%`,
          required: `≥${required}% aggregate in PCM`,
        };
      }
    }
    if (subj?.english) {
      const actual = candidate.class12.englishMarks;
      if (actual !== undefined && actual < subj.english) {
        return {
          result: 'FAIL',
          label: 'Class 12 English Marks',
          value: `${actual}`,
          required: `≥${subj.english} marks in English`,
        };
      }
    }
    if (minPercentage && candidate.class12.overallPercentage !== undefined) {
      if (candidate.class12.overallPercentage < minPercentage) {
        return {
          result: 'FAIL',
          label: 'Class 12 Overall Percentage',
          value: `${candidate.class12.overallPercentage}%`,
          required: `≥${minPercentage}%`,
        };
      }
    }
  }

  return { result: 'PASS', label: 'Class 12' };
}

function checkGraduation(candidate: CandidateProfile, rule: EntryRule, cycle: CourseIntake): ConditionDetail {
  const r = rule.educationRule.graduationRule;
  if (!r?.required) return { result: 'NOT_APPLICABLE', label: 'Graduation' };

  if (!candidate.graduation) {
    if (rule.educationRule.minLevel === 'GRADUATION') {
      return {
        result: 'FAIL',
        label: 'Graduation',
        required: 'Graduation required',
        explanation: 'Graduation details not provided.',
      };
    }
    return { result: 'NOT_APPLICABLE', label: 'Graduation' };
  }

  // Final year check
  if (candidate.graduation.status === 'FINAL_YEAR' && r.finalYearAllowed) {
    // Check if degree will be completed before qualifying deadline
    if (r.qualificationRequiredBy === 'COURSE_COMMENCEMENT' || r.qualificationRequiredBy === 'ACADEMY_JOINING') {
      const courseDate = parseDate(cycle.courseCommencementDate);
      if (candidate.graduation.expectedCompletionDate) {
        const completionDate = parseDate(candidate.graduation.expectedCompletionDate + '-01');
        if (completionDate > courseDate) {
          return {
            result: 'FAIL',
            label: 'Graduation — Final Year',
            value: `Expected completion: ${candidate.graduation.expectedCompletionDate}`,
            required: `Must complete degree before course commencement (${cycle.courseCommencementDate})`,
            explanation:
              'Your expected graduation date is after the course commencement date. You must possess the qualifying degree by course commencement.',
          };
        }
      }
    }
    return { result: 'PASS', label: 'Graduation', value: 'Final year — eligible pending results' };
  }

  if (candidate.graduation.status === 'IN_PROGRESS' && !r.finalYearAllowed) {
    return {
      result: 'FAIL',
      label: 'Graduation',
      value: 'In progress',
      required: 'Degree must be completed (final year not allowed for this entry)',
    };
  }

  // Engineering branch check
  if (r.engineeringOnly && !candidate.graduation.engineeringBranch) {
    return {
      result: 'FAIL',
      label: 'Engineering Degree',
      value: candidate.graduation.degree,
      required: 'Engineering degree (B.E./B.Tech) required',
    };
  }

  if (r.engineeringBranchRule && candidate.graduation.engineeringBranch) {
    const allowed = r.engineeringBranchRule.allowedBranches as EngineeringBranch[];
    if (!allowed.includes(candidate.graduation.engineeringBranch)) {
      return {
        result: 'FAIL',
        label: 'Engineering Branch',
        value: candidate.graduation.engineeringBranch,
        required: `Allowed branches: ${allowed.slice(0, 5).join(', ')}${allowed.length > 5 ? '…' : ''}`,
        explanation: `Your engineering branch (${candidate.graduation.engineeringBranch}) is not in the list of allowed branches for this entry.`,
      };
    }
  }

  // Percentage check
  if (r.percentageRule?.minPercentage && candidate.graduation.percentage !== undefined) {
    if (candidate.graduation.percentage < r.percentageRule.minPercentage) {
      return {
        result: 'FAIL',
        label: 'Graduation Percentage',
        value: `${candidate.graduation.percentage}%`,
        required: `≥${r.percentageRule.minPercentage}%`,
      };
    }
  }

  // Backlogs check
  if (!r.backlogsAllowed && candidate.graduation.hasBacklogs) {
    return {
      result: 'FAIL',
      label: 'Graduation — Backlogs',
      value: 'Has backlogs',
      required: 'No active backlogs allowed',
    };
  }

  return { result: 'PASS', label: 'Graduation' };
}

function checkPostGraduation(candidate: CandidateProfile, rule: EntryRule): ConditionDetail {
  if (!rule.educationRule.pgRequired) return { result: 'NOT_APPLICABLE', label: 'Post-Graduation' };

  if (!candidate.postGraduation) {
    return {
      result: 'FAIL',
      label: 'Post-Graduation',
      required: 'Post-graduate degree required',
    };
  }

  const pgRule = rule.educationRule.pgRule;
  if (pgRule?.minPercentage && candidate.postGraduation.percentage !== undefined) {
    if (candidate.postGraduation.percentage < pgRule.minPercentage) {
      return {
        result: 'FAIL',
        label: 'Post-Graduation Percentage',
        value: `${candidate.postGraduation.percentage}%`,
        required: `≥${pgRule.minPercentage}%`,
      };
    }
  }
  if (pgRule?.bedRequired && !candidate.graduation) {
    return {
      result: 'FAIL',
      label: 'B.Ed. Requirement',
      value: 'B.Ed. not provided',
      required: 'B.Ed. or equivalent teaching qualification required',
    };
  }

  return { result: 'PASS', label: 'Post-Graduation' };
}

function checkLaw(candidate: CandidateProfile, rule: EntryRule): ConditionDetail {
  const lawRule = rule.educationRule.lawRule;
  if (!lawRule) return { result: 'NOT_APPLICABLE', label: 'LLB' };

  if (!candidate.law) {
    return {
      result: 'FAIL',
      label: 'LLB Degree',
      required: `LLB (${lawRule.minPercentage}% minimum)`,
    };
  }

  if (!lawRule.llbTypeAllowed.includes(candidate.law.llbType)) {
    return {
      result: 'FAIL',
      label: 'LLB Type',
      value: candidate.law.llbType,
      required: `Allowed: ${lawRule.llbTypeAllowed.join(', ')}`,
    };
  }

  if (candidate.law.status === 'FINAL_YEAR' && !lawRule.finalYearAllowed) {
    return {
      result: 'FAIL',
      label: 'LLB — Final Year',
      value: 'Final year',
      required: 'Must have completed LLB (final year not eligible)',
    };
  }

  if (lawRule.minPercentage && candidate.law.percentage !== undefined) {
    if (candidate.law.percentage < lawRule.minPercentage) {
      return {
        result: 'FAIL',
        label: 'LLB Percentage',
        value: `${candidate.law.percentage}%`,
        required: `≥${lawRule.minPercentage}%`,
      };
    }
  }

  return { result: 'PASS', label: 'LLB Degree' };
}

// ---------------------------------------------------------------------------
// Main Evaluator
// ---------------------------------------------------------------------------

export function evaluateEntry(
  candidate: CandidateProfile,
  entry: EntryRule,
  cycle: CourseIntake,
): EligibilityResult {
  const conditions: Record<string, ConditionDetail> = {};

  // Guard: In-service entries for civilians
  const inServiceCheck = checkInService(candidate, entry);
  conditions.inService = inServiceCheck;
  if (inServiceCheck.result === 'FAIL') {
    return buildResult(entry, cycle, candidate, conditions, 'NOT_APPLICABLE');
  }

  // Civilian entries for serving personnel (show them too — they may apply)
  // No block here; serving personnel can still apply to civilian entries.

  // CPSS — permanent bar check
  const cpssCheck = checkCPSS(candidate, entry);
  conditions.cpss = cpssCheck;
  if (cpssCheck.result === 'FAIL' && entry.cpssRule?.failureIsPermanentBar) {
    return buildResult(entry, cycle, candidate, conditions, 'NOT_ELIGIBLE', true, [
      'Previously failed CPSS/PABT — permanent bar to all Flying entries.',
    ]);
  }

  // All condition checks
  conditions.age = checkAge(candidate.dob, cycle.dobMin, cycle.dobMax);
  conditions.gender = checkGender(candidate.gender, entry);
  conditions.nationality = checkNationality(candidate, entry);
  conditions.maritalStatus = checkMaritalStatus(candidate, entry);

  // Education
  conditions.educationLevel = checkEducationLevel(candidate, entry);
  conditions.class12 = checkClass12(candidate, entry);
  conditions.graduation = checkGraduation(candidate, entry, cycle);
  conditions.postGraduation = checkPostGraduation(candidate, entry);
  conditions.law = checkLaw(candidate, entry);

  // Special qualifications
  conditions.ncc = checkNCC(candidate, entry);
  conditions.jee = checkJEE(candidate, entry);
  conditions.gate = checkGATE(candidate, entry);
  conditions.cpl = checkCPL(candidate, entry);

  // Determine overall eligibility
  const failed = Object.entries(conditions)
    .filter(([, v]) => v.result === 'FAIL')
    .map(([k]) => k);

  const satisfied = Object.entries(conditions)
    .filter(([, v]) => v.result === 'PASS')
    .map(([k]) => k);

  const eligible = failed.length === 0;
  const status = cycle.status === 'PROJECTED'
    ? eligible ? 'PROJECTED_ELIGIBLE' : 'NOT_ELIGIBLE'
    : eligible ? 'ELIGIBLE' : 'NOT_ELIGIBLE';

  return buildResult(entry, cycle, candidate, conditions, status);
}

function buildResult(
  entry: EntryRule,
  cycle: CourseIntake,
  candidate: CandidateProfile,
  conditions: Record<string, ConditionDetail>,
  status: EligibilityResult['status'],
  isPermanentlyBarred = false,
  permanentBarReasons: string[] = [],
): EligibilityResult {
  const failed = Object.entries(conditions)
    .filter(([, v]) => v.result === 'FAIL')
    .map(([k]) => k);

  const satisfied = Object.entries(conditions)
    .filter(([, v]) => v.result === 'PASS')
    .map(([k]) => k);

  return {
    entryId: entry.entryId,
    cycleId: cycle.cycleId,
    eligible: failed.length === 0 && !isPermanentlyBarred,
    status,
    conditions,
    failedConditions: failed,
    satisfiedConditions: satisfied,
    isLastChance: false, // set by opportunityEngine
    isPermanentlyBarred,
    permanentBarReasons,
    ageDetail: {
      dobMin: cycle.dobMin,
      dobMax: cycle.dobMax,
      referenceDate: cycle.courseCommencementDate,
      referenceType: cycle.ageReferenceType,
      candidateDOB: candidate.dob,
    },
    source: entry.primarySource,
  };
}
