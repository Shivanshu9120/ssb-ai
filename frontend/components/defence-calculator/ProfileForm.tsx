'use client';

import React, { useState } from 'react';
import {
  CandidateProfile,
  EducationLevel,
  EngineeringBranch,
  NCCWing,
  NCCCertificate,
  CPSSResult,
} from '@/lib/defence/types';
import {
  User, BookOpen, Award, ChevronRight, ChevronLeft,
  Calendar, Shield, Plane, Anchor, LifeBuoy, Check,
} from 'lucide-react';

interface ProfileFormProps {
  onSubmit: (profile: CandidateProfile) => void;
}

const ENGINEERING_BRANCHES: { value: EngineeringBranch; label: string }[] = [
  { value: 'COMPUTER_SCIENCE', label: 'Computer Science' },
  { value: 'COMPUTER_ENGINEERING', label: 'Computer Engineering' },
  { value: 'INFORMATION_TECHNOLOGY', label: 'Information Technology' },
  { value: 'ELECTRONICS', label: 'Electronics' },
  { value: 'ECE', label: 'Electronics & Communication' },
  { value: 'ELECTRICAL', label: 'Electrical Engineering' },
  { value: 'ELECTRICAL_ELECTRONICS', label: 'Electrical & Electronics' },
  { value: 'MECHANICAL', label: 'Mechanical Engineering' },
  { value: 'CIVIL', label: 'Civil Engineering' },
  { value: 'AEROSPACE', label: 'Aerospace Engineering' },
  { value: 'AERONAUTICAL', label: 'Aeronautical Engineering' },
  { value: 'AUTOMOBILE', label: 'Automobile Engineering' },
  { value: 'MARINE', label: 'Marine Engineering' },
  { value: 'NAVAL_ARCHITECTURE', label: 'Naval Architecture' },
  { value: 'METALLURGY', label: 'Metallurgy' },
  { value: 'PRODUCTION', label: 'Production Engineering' },
  { value: 'INSTRUMENTATION', label: 'Instrumentation' },
  { value: 'CHEMICAL', label: 'Chemical Engineering' },
  { value: 'MINING', label: 'Mining Engineering' },
  { value: 'ARCHITECTURE', label: 'Architecture' },
  { value: 'OTHER', label: 'Other Engineering Branch' },
];

const STEPS = [
  { id: 'basic', label: 'Personal', icon: User },
  { id: 'education', label: 'Education', icon: BookOpen },
  { id: 'special', label: 'Special Quals', icon: Award },
];

const emptyProfile = (): Partial<CandidateProfile> => ({
  dob: '',
  gender: 'Male',
  nationality: 'Indian',
  maritalStatus: 'Unmarried',
  isCurrentlyServing: false,
  highestQualification: 'GRADUATION',
  cpssResult: 'NEVER_APPEARED',
});

export default function ProfileForm({ onSubmit }: ProfileFormProps) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<CandidateProfile>>(emptyProfile());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (patch: Partial<CandidateProfile>) => {
    setProfile((p) => ({ ...p, ...patch }));
  };

  const validateStep0 = () => {
    const e: Record<string, string> = {};
    if (!profile.dob) e.dob = 'Date of birth is required';
    else {
      const dob = new Date(profile.dob);
      const now = new Date();
      const age = (now.getTime() - dob.getTime()) / (365.25 * 24 * 3600 * 1000);
      if (age < 13 || age > 45) e.dob = 'Please enter a valid date of birth (age 13–45)';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!profile.highestQualification) e.highestQualification = 'Please select your qualification';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    let valid = true;
    if (step === 0) valid = validateStep0();
    if (step === 1) valid = validateStep1();
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = () => {
    // Fill defaults for unset optional fields
    const finalProfile: CandidateProfile = {
      dob: profile.dob!,
      gender: profile.gender || 'Male',
      nationality: profile.nationality || 'Indian',
      maritalStatus: profile.maritalStatus || 'Unmarried',
      isCurrentlyServing: profile.isCurrentlyServing || false,
      highestQualification: profile.highestQualification || 'GRADUATION',
      cpssResult: profile.cpssResult || 'NEVER_APPEARED',
      class12: profile.class12,
      graduation: profile.graduation,
      postGraduation: profile.postGraduation,
      law: profile.law,
      ncc: profile.ncc,
      jeeMain: profile.jeeMain,
      gate: profile.gate,
      cpl: profile.cpl,
      ssbHistory: profile.ssbHistory,
      servingService: profile.servingService,
      servingRank: profile.servingRank,
    };
    onSubmit(finalProfile);
  };

  const isEngineering =
    profile.highestQualification === 'GRADUATION' &&
    profile.graduation?.engineeringBranch !== undefined;

  return (
    <div className="defence-form-wrapper">
      {/* Header */}
      <div className="defence-form-header">
        <div className="defence-form-title-row">
          <Shield size={28} className="defence-form-icon" />
          <div>
            <h1 className="defence-form-title">Defence Officer Eligibility Calculator</h1>
            <p className="defence-form-subtitle">
              Find which officer entries you're eligible for — Army, Navy, Air Force & Coast Guard
            </p>
          </div>
        </div>

        {/* Step progress */}
        <div className="defence-form-steps">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isDone = i < step;
            const isActive = i === step;
            return (
              <React.Fragment key={s.id}>
                <div className={`defence-step-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                  <div className="defence-step-circle">
                    {isDone ? <Check size={14} /> : <Icon size={14} />}
                  </div>
                  <span className="defence-step-label">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`defence-step-line ${i < step ? 'done' : ''}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step panels */}
      <div className="defence-form-body">
        {/* ── STEP 0: Personal ── */}
        {step === 0 && (
          <div className="defence-form-step">
            <h2 className="defence-step-title">Personal Information</h2>

            <div className="defence-field">
              <label className="defence-label">Date of Birth *</label>
              <input
                type="date"
                className={`defence-input ${errors.dob ? 'defence-input-error' : ''}`}
                value={profile.dob}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => update({ dob: e.target.value })}
              />
              {errors.dob && <span className="defence-error">{errors.dob}</span>}
              <span className="defence-hint">
                Age eligibility is calculated from DOB windows in official notifications — not current age.
              </span>
            </div>

            <div className="defence-field-row">
              <div className="defence-field">
                <label className="defence-label">Gender *</label>
                <div className="defence-toggle-group">
                  {(['Male', 'Female'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={`defence-toggle ${profile.gender === g ? 'active' : ''}`}
                      onClick={() => update({ gender: g })}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="defence-field">
                <label className="defence-label">Marital Status *</label>
                <div className="defence-toggle-group">
                  {(['Unmarried', 'Married'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`defence-toggle ${profile.maritalStatus === m ? 'active' : ''}`}
                      onClick={() => update({ maritalStatus: m })}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="defence-field">
              <label className="defence-label">Are you currently serving in the Armed Forces?</label>
              <div className="defence-toggle-group">
                {([false, true] as const).map((v) => (
                  <button
                    key={String(v)}
                    type="button"
                    className={`defence-toggle ${profile.isCurrentlyServing === v ? 'active' : ''}`}
                    onClick={() => update({ isCurrentlyServing: v })}
                  >
                    {v ? 'Yes' : 'No'}
                  </button>
                ))}
              </div>
            </div>

            {profile.isCurrentlyServing && (
              <div className="defence-conditional-block">
                <div className="defence-field">
                  <label className="defence-label">Service</label>
                  <div className="defence-service-grid">
                    {(['Army', 'Navy', 'Air Force', 'Coast Guard'] as const).map((svc) => {
                      const icons = { Army: Shield, Navy: Anchor, 'Air Force': Plane, 'Coast Guard': LifeBuoy };
                      const Icon = icons[svc];
                      return (
                        <button
                          key={svc}
                          type="button"
                          className={`defence-service-btn ${profile.servingService === svc ? 'active' : ''}`}
                          onClick={() => update({ servingService: svc })}
                        >
                          <Icon size={18} />
                          {svc}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="defence-field">
                  <label className="defence-label">Rank</label>
                  <input
                    type="text"
                    className="defence-input"
                    placeholder="e.g., Havildar, Petty Officer, Corporal"
                    value={profile.servingRank || ''}
                    onChange={(e) => update({ servingRank: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 1: Education ── */}
        {step === 1 && (
          <div className="defence-form-step">
            <h2 className="defence-step-title">Education</h2>

            <div className="defence-field">
              <label className="defence-label">Highest Qualification *</label>
              <div className="defence-qual-grid">
                {(
                  [
                    { v: 'CLASS_12', label: 'Class 12 / Intermediate' },
                    { v: 'GRADUATION', label: 'Graduation / B.E./B.Tech' },
                    { v: 'POST_GRADUATION', label: 'Post-Graduation / M.E./M.Tech' },
                    { v: 'PROFESSIONAL', label: 'Professional (LLB / MBA)' },
                  ] as { v: EducationLevel; label: string }[]
                ).map(({ v, label }) => (
                  <button
                    key={v}
                    type="button"
                    className={`defence-qual-btn ${profile.highestQualification === v ? 'active' : ''}`}
                    onClick={() => update({ highestQualification: v })}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Class 12 details */}
            {(profile.highestQualification === 'CLASS_12' ||
              profile.highestQualification === 'GRADUATION' ||
              profile.highestQualification === 'POST_GRADUATION' ||
              profile.highestQualification === 'PROFESSIONAL') && (
              <div className="defence-conditional-block">
                <h3 className="defence-sub-title">Class 12 Details</h3>
                <div className="defence-field-row">
                  <div className="defence-field">
                    <label className="defence-label">Status</label>
                    <div className="defence-toggle-group">
                      {(['PASSED', 'APPEARING'] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          className={`defence-toggle ${profile.class12?.status === s ? 'active' : ''}`}
                          onClick={() =>
                            update({
                              class12: { ...profile.class12, status: s, hasPCM: profile.class12?.hasPCM ?? false },
                            })
                          }
                        >
                          {s === 'PASSED' ? 'Passed' : 'Appearing'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="defence-field">
                    <label className="defence-label">Have Physics, Chemistry & Maths?</label>
                    <div className="defence-toggle-group">
                      {([true, false] as const).map((v) => (
                        <button
                          key={String(v)}
                          type="button"
                          className={`defence-toggle ${profile.class12?.hasPCM === v ? 'active' : ''}`}
                          onClick={() =>
                            update({
                              class12: { ...profile.class12!, hasPCM: v, status: profile.class12?.status || 'PASSED' },
                            })
                          }
                        >
                          {v ? 'Yes (PCM)' : 'No PCM'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {profile.class12?.hasPCM && (
                  <div className="defence-field-row">
                    <div className="defence-field">
                      <label className="defence-label">PCM Aggregate %</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        className="defence-input"
                        placeholder="e.g. 78"
                        value={profile.class12?.pcmPercentage ?? ''}
                        onChange={(e) =>
                          update({
                            class12: { ...profile.class12!, pcmPercentage: Number(e.target.value) },
                          })
                        }
                      />
                    </div>
                    <div className="defence-field">
                      <label className="defence-label">English Marks (out of 100)</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        className="defence-input"
                        placeholder="e.g. 72"
                        value={profile.class12?.englishMarks ?? ''}
                        onChange={(e) =>
                          update({
                            class12: { ...profile.class12!, englishMarks: Number(e.target.value) },
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Graduation details */}
            {(profile.highestQualification === 'GRADUATION' ||
              profile.highestQualification === 'POST_GRADUATION') && (
              <div className="defence-conditional-block">
                <h3 className="defence-sub-title">Graduation Details</h3>
                <div className="defence-field-row">
                  <div className="defence-field">
                    <label className="defence-label">Degree Type</label>
                    <div className="defence-toggle-group">
                      {(
                        [
                          { v: 'ENGINEERING', label: 'B.E./B.Tech' },
                          { v: 'OTHER', label: 'BSc/BCom/BA etc.' },
                        ] as { v: string; label: string }[]
                      ).map(({ v, label }) => (
                        <button
                          key={v}
                          type="button"
                          className={`defence-toggle ${
                            (v === 'ENGINEERING' ? !!profile.graduation?.engineeringBranch : !profile.graduation?.engineeringBranch)
                              ? 'active'
                              : ''
                          }`}
                          onClick={() => {
                            if (v === 'ENGINEERING') {
                              update({
                                graduation: {
                                  ...profile.graduation!,
                                  degree: 'B.E./B.Tech',
                                  engineeringBranch: 'MECHANICAL',
                                  status: profile.graduation?.status || 'COMPLETED',
                                  hasBacklogs: profile.graduation?.hasBacklogs ?? false,
                                },
                              });
                            } else {
                              const { engineeringBranch, ...rest } = profile.graduation || {};
                              update({
                                graduation: {
                                  ...rest,
                                  degree: 'Other',
                                  status: profile.graduation?.status || 'COMPLETED',
                                  hasBacklogs: profile.graduation?.hasBacklogs ?? false,
                                },
                              });
                            }
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="defence-field">
                    <label className="defence-label">Status</label>
                    <div className="defence-toggle-group">
                      {(['COMPLETED', 'FINAL_YEAR', 'IN_PROGRESS'] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          className={`defence-toggle ${profile.graduation?.status === s ? 'active' : ''}`}
                          onClick={() =>
                            update({
                              graduation: {
                                ...profile.graduation!,
                                status: s,
                                degree: profile.graduation?.degree || 'B.E.',
                                hasBacklogs: profile.graduation?.hasBacklogs ?? false,
                              },
                            })
                          }
                        >
                          {s === 'COMPLETED' ? 'Completed' : s === 'FINAL_YEAR' ? 'Final Year' : 'In Progress'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {profile.graduation?.engineeringBranch !== undefined && (
                  <div className="defence-field">
                    <label className="defence-label">Engineering Branch</label>
                    <select
                      className="defence-select"
                      value={profile.graduation?.engineeringBranch || ''}
                      onChange={(e) =>
                        update({
                          graduation: { ...profile.graduation!, engineeringBranch: e.target.value as EngineeringBranch },
                        })
                      }
                    >
                      {ENGINEERING_BRANCHES.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="defence-field-row">
                  <div className="defence-field">
                    <label className="defence-label">Percentage / CGPA</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      className="defence-input"
                      placeholder="e.g. 67.5"
                      value={profile.graduation?.percentage ?? ''}
                      onChange={(e) =>
                        update({
                          graduation: { ...profile.graduation!, percentage: Number(e.target.value) },
                        })
                      }
                    />
                  </div>
                  <div className="defence-field">
                    <label className="defence-label">Any Active Backlogs?</label>
                    <div className="defence-toggle-group">
                      {([false, true] as const).map((v) => (
                        <button
                          key={String(v)}
                          type="button"
                          className={`defence-toggle ${profile.graduation?.hasBacklogs === v ? 'active' : ''}`}
                          onClick={() =>
                            update({
                              graduation: {
                                ...profile.graduation!,
                                hasBacklogs: v,
                                degree: profile.graduation?.degree || 'B.E.',
                                status: profile.graduation?.status || 'COMPLETED',
                              },
                            })
                          }
                        >
                          {v ? 'Yes' : 'No'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {profile.graduation?.status === 'FINAL_YEAR' && (
                  <div className="defence-field">
                    <label className="defence-label">Expected Completion (Month & Year)</label>
                    <input
                      type="month"
                      className="defence-input"
                      value={profile.graduation?.expectedCompletionDate || ''}
                      onChange={(e) =>
                        update({ graduation: { ...profile.graduation!, expectedCompletionDate: e.target.value } })
                      }
                    />
                  </div>
                )}
              </div>
            )}

            {/* Law */}
            {profile.highestQualification === 'PROFESSIONAL' && (
              <div className="defence-conditional-block">
                <h3 className="defence-sub-title">LLB Details</h3>
                <div className="defence-field-row">
                  <div className="defence-field">
                    <label className="defence-label">LLB Type</label>
                    <div className="defence-toggle-group">
                      {(['3_YEAR', '5_YEAR'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          className={`defence-toggle ${profile.law?.llbType === t ? 'active' : ''}`}
                          onClick={() =>
                            update({ law: { ...profile.law!, llbType: t, status: profile.law?.status || 'COMPLETED' } })
                          }
                        >
                          {t === '3_YEAR' ? '3-Year LLB' : '5-Year Integrated'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="defence-field">
                    <label className="defence-label">Status</label>
                    <div className="defence-toggle-group">
                      {(['COMPLETED', 'FINAL_YEAR'] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          className={`defence-toggle ${profile.law?.status === s ? 'active' : ''}`}
                          onClick={() =>
                            update({ law: { ...profile.law!, status: s, llbType: profile.law?.llbType || '3_YEAR' } })
                          }
                        >
                          {s === 'COMPLETED' ? 'Completed' : 'Final Year'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="defence-field">
                  <label className="defence-label">Percentage</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="defence-input"
                    placeholder="e.g. 58"
                    value={profile.law?.percentage ?? ''}
                    onChange={(e) =>
                      update({ law: { ...profile.law!, percentage: Number(e.target.value) } })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: Special Qualifications ── */}
        {step === 2 && (
          <div className="defence-form-step">
            <h2 className="defence-step-title">Special Qualifications</h2>
            <p className="defence-step-hint">
              Only fill what applies to you. Leave blank if not applicable.
            </p>

            {/* NCC */}
            <div className="defence-field defence-special-card">
              <label className="defence-label">NCC Certificate</label>
              <div className="defence-toggle-group">
                <button
                  type="button"
                  className={`defence-toggle ${!profile.ncc ? 'active' : ''}`}
                  onClick={() => update({ ncc: undefined })}
                >
                  None
                </button>
                {(['A', 'B', 'C'] as NCCCertificate[]).map((cert) => (
                  <button
                    key={cert}
                    type="button"
                    className={`defence-toggle ${profile.ncc?.certificate === cert ? 'active' : ''}`}
                    onClick={() =>
                      update({ ncc: { ...profile.ncc!, certificate: cert, wing: profile.ncc?.wing || 'ARMY' } })
                    }
                  >
                    NCC {cert}
                  </button>
                ))}
              </div>
              {profile.ncc && (
                <div className="defence-field-row mt-3">
                  <div className="defence-field">
                    <label className="defence-label">Wing</label>
                    <div className="defence-toggle-group">
                      {(['ARMY', 'NAVY', 'AIR'] as NCCWing[]).map((w) => (
                        <button
                          key={w}
                          type="button"
                          className={`defence-toggle ${profile.ncc?.wing === w ? 'active' : ''}`}
                          onClick={() => update({ ncc: { ...profile.ncc!, wing: w } })}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="defence-field">
                    <label className="defence-label">Grade</label>
                    <div className="defence-toggle-group">
                      {(['A', 'B', 'C'] as const).map((g) => (
                        <button
                          key={g}
                          type="button"
                          className={`defence-toggle ${profile.ncc?.grade === g ? 'active' : ''}`}
                          onClick={() => update({ ncc: { ...profile.ncc!, grade: g } })}
                        >
                          Grade {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* JEE Main */}
            <div className="defence-field defence-special-card">
              <label className="defence-label">JEE Main</label>
              <div className="defence-toggle-group">
                {([false, true] as const).map((v) => (
                  <button
                    key={String(v)}
                    type="button"
                    className={`defence-toggle ${profile.jeeMain?.appeared === v ? 'active' : ''}`}
                    onClick={() => update({ jeeMain: { appeared: v } })}
                  >
                    {v ? 'Appeared' : 'Not appeared'}
                  </button>
                ))}
              </div>
              {profile.jeeMain?.appeared && (
                <div className="defence-field-row mt-3">
                  <div className="defence-field">
                    <label className="defence-label">Year</label>
                    <input
                      type="number"
                      min={2015}
                      max={new Date().getFullYear()}
                      className="defence-input"
                      placeholder="e.g. 2025"
                      value={profile.jeeMain?.year ?? ''}
                      onChange={(e) => update({ jeeMain: { ...profile.jeeMain!, year: Number(e.target.value) } })}
                    />
                  </div>
                  <div className="defence-field">
                    <label className="defence-label">Percentile (optional)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.01}
                      className="defence-input"
                      placeholder="e.g. 87.5"
                      value={profile.jeeMain?.percentile ?? ''}
                      onChange={(e) =>
                        update({ jeeMain: { ...profile.jeeMain!, percentile: Number(e.target.value) } })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* GATE */}
            <div className="defence-field defence-special-card">
              <label className="defence-label">GATE Score</label>
              <div className="defence-toggle-group">
                {([false, true] as const).map((v) => (
                  <button
                    key={String(v)}
                    type="button"
                    className={`defence-toggle ${profile.gate?.qualified === v ? 'active' : ''}`}
                    onClick={() => update({ gate: { qualified: v } })}
                  >
                    {v ? 'Qualified' : 'Not qualified'}
                  </button>
                ))}
              </div>
              {profile.gate?.qualified && (
                <div className="defence-field-row mt-3">
                  <div className="defence-field">
                    <label className="defence-label">GATE Paper</label>
                    <input
                      type="text"
                      className="defence-input"
                      placeholder="e.g. ME, CS, EC"
                      value={profile.gate?.paper ?? ''}
                      onChange={(e) => update({ gate: { ...profile.gate!, paper: e.target.value } })}
                    />
                  </div>
                  <div className="defence-field">
                    <label className="defence-label">Year</label>
                    <input
                      type="number"
                      min={2020}
                      max={new Date().getFullYear()}
                      className="defence-input"
                      placeholder={String(new Date().getFullYear())}
                      value={profile.gate?.year ?? ''}
                      onChange={(e) => update({ gate: { ...profile.gate!, year: Number(e.target.value) } })}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* CPSS */}
            <div className="defence-field defence-special-card defence-cpss-card">
              <label className="defence-label">
                CPSS / PABT History
                <span className="defence-field-badge">Flying entries only</span>
              </label>
              <div className="defence-cpss-note">
                ⚠️ CPSS failure is a <strong>permanent lifetime bar</strong> to all Flying branch entries.
              </div>
              <div className="defence-toggle-group">
                {(
                  [
                    { v: 'NEVER_APPEARED', label: 'Never appeared' },
                    { v: 'PASSED', label: 'Passed CPSS' },
                    { v: 'FAILED', label: 'Failed CPSS' },
                  ] as { v: CPSSResult; label: string }[]
                ).map(({ v, label }) => (
                  <button
                    key={v}
                    type="button"
                    className={`defence-toggle ${profile.cpssResult === v ? 'active' : ''} ${
                      v === 'FAILED' ? 'defence-toggle-danger' : ''
                    }`}
                    onClick={() => update({ cpssResult: v })}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* CPL */}
            <div className="defence-field defence-special-card">
              <label className="defence-label">Commercial Pilot Licence (DGCA)</label>
              <div className="defence-toggle-group">
                {([false, true] as const).map((v) => (
                  <button
                    key={String(v)}
                    type="button"
                    className={`defence-toggle ${profile.cpl?.holds === v ? 'active' : ''}`}
                    onClick={() => update({ cpl: { holds: v, dgcaValid: v } })}
                  >
                    {v ? 'Yes, I hold CPL' : 'No CPL'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer navigation */}
      <div className="defence-form-footer">
        <div className="defence-form-disclaimer">
          ℹ️ Results are computed from the latest official notifications in our database. Always verify against the official notification.
        </div>
        <div className="defence-form-nav">
          {step > 0 && (
            <button type="button" className="defence-btn-secondary" onClick={handleBack}>
              <ChevronLeft size={16} />
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" className="defence-btn-primary" onClick={handleNext}>
              Next
              <ChevronRight size={16} />
            </button>
          ) : (
            <button type="button" className="defence-btn-calculate" onClick={handleSubmit}>
              <Shield size={18} />
              Calculate My Eligibility
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
