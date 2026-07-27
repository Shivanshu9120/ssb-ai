'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2, ChevronRight, ChevronLeft, Save, CheckCircle2,
  User, Users, GraduationCap, Activity, Shield, FileText,
  UploadCloud, Sparkles, FileUp, AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiService, PIQData, FamilyMember, AcademicRecord, NCCDetail, SportRecord, ExtracurricularRecord, InterviewRecord } from '@/services/api';

// ---------------------------------------------------------------------------
// Default Data
// ---------------------------------------------------------------------------
const defaultFamilyMembers: FamilyMember[] = [
  { relation: 'Father', education: '', occupation: '', income: '' },
  { relation: 'Mother', education: '', occupation: '', income: '' },
  { relation: 'Guardian', education: '', occupation: '', income: '' },
  { relation: 'Elder Brother / Sister', education: '', occupation: '', income: '' },
  { relation: 'Elder Brother / Sister', education: '', occupation: '', income: '' },
  { relation: 'Younger Brother / Sister', education: '', occupation: '', income: '' },
  { relation: 'Younger Brother / Sister', education: '', occupation: '', income: '' },
];

const defaultAcademicRecords: AcademicRecord[] = [
  { qualification: 'Matric / Hr. Sec.', institution: '', board_university: '', year: '', division_marks: '', medium: '', boarder_day: '', achievement: '' },
  { qualification: '10+2 / Equivalent', institution: '', board_university: '', year: '', division_marks: '', medium: '', boarder_day: '', achievement: '' },
  { qualification: 'Graduation', institution: '', board_university: '', year: '', division_marks: '', medium: '', boarder_day: '', achievement: '' },
  { qualification: 'Post-Graduation / Professional', institution: '', board_university: '', year: '', division_marks: '', medium: '', boarder_day: '', achievement: '' },
];

const defaultPIQ: PIQData = {
  completed_steps: 0,
  is_submitted: false,
  selection_board: '', batch_no: '', chest_no: '', upsc_roll_no: '',
  full_name: '', father_name: '',
  max_residence: { place: '', district: '', state: '', population: '' },
  parents_residence: { place: '', district: '', state: '', population: '' },
  permanent_residence: { place: '', district: '', state: '', population: '', is_district_hq: false },
  state_district: '', religion: '', category: '', mother_tongue: '', date_of_birth: '', marital_status: '',
  parents_alive: null, mother_death_age: '', father_death_age: '',
  family_members: defaultFamilyMembers,
  academic_records: defaultAcademicRecords,
  age_years: '', age_months: '', height: '', weight: '',
  present_occupation: '', monthly_income: '',
  ncc_training: null, ncc_details: [{ total_training: '', wing: '', sub_unit: '', certificate: '' }],
  sports: [{ game: '', date_from: '', date_to: '', duration: '', represented: '', achievement: '' }],
  hobbies: '', extracurricular: [{ activity_group: '', duration: '', achievement: '' }],
  responsibility_positions: '',
  nature_of_commission: '', choice_of_service: '', commission_attempts: '',
  previous_interviews: [{ sl_no: 1, type_of_entry: '', ssb_place: '', date: '', chest_batch_no: '' }],
  exam: 'Army', level: 'Beginner',
};

// ---------------------------------------------------------------------------
// Tab config
// ---------------------------------------------------------------------------
const TABS = [
  { id: 0, label: 'Personal', icon: User, desc: 'Q1–Q5: Identity & Residences' },
  { id: 1, label: 'Family', icon: Users, desc: 'Q6: Family Members' },
  { id: 2, label: 'Academic', icon: GraduationCap, desc: 'Q7: Education' },
  { id: 3, label: 'Activities', icon: Activity, desc: 'Q8–Q11: Sports & Hobbies' },
  { id: 4, label: 'Service', icon: Shield, desc: 'Q12–Q14: Commission & Interviews' },
];

// ---------------------------------------------------------------------------
// Shared input styles
// ---------------------------------------------------------------------------
const inp = 'w-full px-3 py-2 rounded-lg border border-zinc-700 bg-[#0f0f0f] text-zinc-100 text-sm placeholder-zinc-600 focus:border-amber-500/60 focus:outline-none transition-colors';
const lbl = 'block text-xs font-semibold text-zinc-400 mb-1';
const sectionTitle = 'text-xs font-bold text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2';

// ---------------------------------------------------------------------------
// Tab 1 — Personal Details (Q1–Q5)
// ---------------------------------------------------------------------------
function PersonalTab({ data, setData }: { data: PIQData; setData: (d: PIQData) => void }) {
  const upd = (key: keyof PIQData, val: any) => setData({ ...data, [key]: val });
  const updRes = (key: 'max_residence' | 'parents_residence' | 'permanent_residence', field: string, val: string) =>
    setData({ ...data, [key]: { ...(data[key] as any), [field]: val } });

  return (
    <div className="space-y-7">
      {/* Q1 */}
      <div>
        <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">1</span> Administrative Details</p>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={lbl}>Selection Board (No. & Place)</label><input className={inp} value={data.selection_board || ''} onChange={e => upd('selection_board', e.target.value)} placeholder="e.g. 11 SSB Allahabad" /></div>
          <div><label className={lbl}>Batch No.</label><input className={inp} value={data.batch_no || ''} onChange={e => upd('batch_no', e.target.value)} placeholder="e.g. A-1" /></div>
          <div><label className={lbl}>Chest No.</label><input className={inp} value={data.chest_no || ''} onChange={e => upd('chest_no', e.target.value)} placeholder="Chest No." /></div>
          <div><label className={lbl}>UPSC / Other Roll No.</label><input className={inp} value={data.upsc_roll_no || ''} onChange={e => upd('upsc_roll_no', e.target.value)} placeholder="Roll No." /></div>
        </div>
      </div>

      {/* Q2 & Q3 */}
      <div>
        <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">2</span> Personal Identity</p>
        <div className="space-y-3">
          <div><label className={lbl}>Full Name (IN CAPITALS — as in Matriculation Certificate)</label><input className={inp + ' uppercase'} value={data.full_name || ''} onChange={e => upd('full_name', e.target.value.toUpperCase())} placeholder="E.G. RAHUL SHARMA" /></div>
          <div><label className={lbl}>Father's Name</label><input className={inp} value={data.father_name || ''} onChange={e => upd('father_name', e.target.value)} placeholder="Father's full name" /></div>
        </div>
      </div>

      {/* Q4 Residences */}
      <div>
        <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">4</span> Residences</p>
        <div className="space-y-4">
          {(['max_residence', 'parents_residence', 'permanent_residence'] as const).map((resKey, idx) => (
            <div key={resKey} className="p-3 rounded-xl border border-zinc-800 bg-[#0d0d0d]">
              <p className="text-[11px] font-semibold text-zinc-300 mb-2">
                {idx === 0 ? '(a) Place of Maximum Residence' : idx === 1 ? '(b) Place of Parents\' Residence' : '(c) Place of Permanent Residence'}
                <span className="text-zinc-500 ml-1">(with approximate population)</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div><label className={lbl}>Place</label><input className={inp} value={(data[resKey] as any)?.place || ''} onChange={e => updRes(resKey, 'place', e.target.value)} placeholder="Town / City" /></div>
                <div><label className={lbl}>District</label><input className={inp} value={(data[resKey] as any)?.district || ''} onChange={e => updRes(resKey, 'district', e.target.value)} placeholder="District" /></div>
                <div><label className={lbl}>State</label><input className={inp} value={(data[resKey] as any)?.state || ''} onChange={e => updRes(resKey, 'state', e.target.value)} placeholder="State" /></div>
                <div><label className={lbl}>Approx. Population</label><input className={inp} value={(data[resKey] as any)?.population || ''} onChange={e => updRes(resKey, 'population', e.target.value)} placeholder="e.g. 5 Lakh" /></div>
                {resKey === 'permanent_residence' && (
                  <div className="col-span-2 flex items-center gap-2 mt-1">
                    <input type="checkbox" id="district_hq" checked={!!(data.permanent_residence as any)?.is_district_hq} onChange={e => updRes('permanent_residence', 'is_district_hq', e.target.checked as any)} className="accent-amber-500 w-4 h-4 cursor-pointer" />
                    <label htmlFor="district_hq" className="text-xs text-zinc-400 cursor-pointer">Whether District HQ or not</label>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Q5 */}
      <div>
        <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">5</span> Fill in the Details Below</p>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={lbl}>State & District</label><input className={inp} value={data.state_district || ''} onChange={e => upd('state_district', e.target.value)} placeholder="State & District" /></div>
          <div><label className={lbl}>Religion</label><input className={inp} value={data.religion || ''} onChange={e => upd('religion', e.target.value)} placeholder="e.g. Hindu, Muslim, Sikh..." /></div>
          <div>
            <label className={lbl}>Category (SC / ST / OBC)</label>
            <select className={inp} value={data.category || ''} onChange={e => upd('category', e.target.value)}>
              <option value="">General (None)</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="OBC">OBC</option>
            </select>
          </div>
          <div><label className={lbl}>Mother Tongue</label><input className={inp} value={data.mother_tongue || ''} onChange={e => upd('mother_tongue', e.target.value)} placeholder="e.g. Hindi, Bengali..." /></div>
          <div><label className={lbl}>Date of Birth</label><input type="date" className={inp} value={data.date_of_birth || ''} onChange={e => upd('date_of_birth', e.target.value)} /></div>
          <div>
            <label className={lbl}>Marital Status</label>
            <select className={inp} value={data.marital_status || ''} onChange={e => upd('marital_status', e.target.value)}>
              <option value="">Select...</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Widower">Widower</option>
            </select>
          </div>
        </div>
      </div>

      {/* SSB Context */}
      <div>
        <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">★</span> SSB AI Context</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={lbl}>Target Service</label>
            <select className={inp} value={data.exam || 'Army'} onChange={e => upd('exam', e.target.value)}>
              <option value="Army">Indian Army</option>
              <option value="Navy">Indian Navy</option>
              <option value="Air Force">Indian Air Force</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Preparation Level</label>
            <select className={inp} value={data.level || 'Beginner'} onChange={e => upd('level', e.target.value)}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab 2 — Family Details (Q6)
// ---------------------------------------------------------------------------
function FamilyTab({ data, setData }: { data: PIQData; setData: (d: PIQData) => void }) {
  const members = data.family_members || defaultFamilyMembers;
  const updMember = (idx: number, field: keyof FamilyMember, val: string) => {
    const updated = members.map((m, i) => i === idx ? { ...m, [field]: val } : m);
    setData({ ...data, family_members: updated });
  };

  return (
    <div className="space-y-6">
      {/* Q6a */}
      <div>
        <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">6</span> Family Information</p>
        <div className="flex items-center gap-6 mb-4">
          <span className="text-sm text-zinc-300">(a) Parents Alive?</span>
          {[{ val: true, label: 'Yes / हाँ' }, { val: false, label: 'No / नहीं' }].map(opt => (
            <button key={String(opt.val)} type="button"
              onClick={() => setData({ ...data, parents_alive: opt.val })}
              className={`px-5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${data.parents_alive === opt.val ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}>
              {opt.label}
            </button>
          ))}
        </div>

        {data.parents_alive === false && (
          <div className="p-3 rounded-xl border border-zinc-800 bg-[#0d0d0d] space-y-2 mb-4">
            <p className="text-xs text-zinc-400">(b) If not alive, age at time of death</p>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>Mother's age at death</label><input className={inp} value={data.mother_death_age || ''} onChange={e => setData({ ...data, mother_death_age: e.target.value })} placeholder="Age in years" /></div>
              <div><label className={lbl}>Father's age at death</label><input className={inp} value={data.father_death_age || ''} onChange={e => setData({ ...data, father_death_age: e.target.value })} placeholder="Age in years" /></div>
            </div>
          </div>
        )}
      </div>

      {/* Q6c — Family table */}
      <div>
        <p className="text-xs text-zinc-400 mb-3">(c) Parents / Guardian and Siblings — Occupation / Income (as applicable)</p>
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-zinc-900 text-zinc-400">
                <th className="px-3 py-2 text-left w-36 border-r border-zinc-800">Relation / विवरण</th>
                <th className="px-3 py-2 text-left border-r border-zinc-800">Education / शिक्षा</th>
                <th className="px-3 py-2 text-left border-r border-zinc-800">Occupation / व्यवसाय</th>
                <th className="px-3 py-2 text-left">Income / आय (per month)</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, idx) => (
                <tr key={idx} className="border-t border-zinc-800 hover:bg-zinc-900/30 transition-colors">
                  <td className="px-3 py-2 text-zinc-300 font-medium border-r border-zinc-800 whitespace-nowrap">{member.relation}</td>
                  <td className="px-2 py-1 border-r border-zinc-800"><input className="w-full bg-transparent text-zinc-200 text-xs focus:outline-none placeholder-zinc-600 py-1" value={member.education} onChange={e => updMember(idx, 'education', e.target.value)} placeholder="Education" /></td>
                  <td className="px-2 py-1 border-r border-zinc-800"><input className="w-full bg-transparent text-zinc-200 text-xs focus:outline-none placeholder-zinc-600 py-1" value={member.occupation} onChange={e => updMember(idx, 'occupation', e.target.value)} placeholder="Occupation" /></td>
                  <td className="px-2 py-1"><input className="w-full bg-transparent text-zinc-200 text-xs focus:outline-none placeholder-zinc-600 py-1" value={member.income} onChange={e => updMember(idx, 'income', e.target.value)} placeholder="₹ per month" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab 3 — Academic Details (Q7)
// ---------------------------------------------------------------------------
function AcademicTab({ data, setData }: { data: PIQData; setData: (d: PIQData) => void }) {
  const records = data.academic_records || defaultAcademicRecords;
  const updRecord = (idx: number, field: keyof AcademicRecord, val: string) => {
    const updated = records.map((r, i) => i === idx ? { ...r, [field]: val } : r);
    setData({ ...data, academic_records: updated });
  };

  return (
    <div className="space-y-4">
      <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">7</span> Educational Record (commencing from Matriculation / Equivalent Examination)</p>
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-xs min-w-[900px]">
          <thead>
            <tr className="bg-zinc-900 text-zinc-400">
              <th className="px-3 py-2 text-left w-40 border-r border-zinc-800">Qualification / योग्यता</th>
              <th className="px-2 py-2 text-left border-r border-zinc-800">Full Name of Institution</th>
              <th className="px-2 py-2 text-left border-r border-zinc-800">Board / University</th>
              <th className="px-2 py-2 text-left border-r border-zinc-800 w-16">Year</th>
              <th className="px-2 py-2 text-left border-r border-zinc-800 w-20">Div / Marks %</th>
              <th className="px-2 py-2 text-left border-r border-zinc-800 w-24">Medium</th>
              <th className="px-2 py-2 text-left border-r border-zinc-800 w-24">Boarder / Day</th>
              <th className="px-2 py-2 text-left w-36">Outstanding Achievement</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec, idx) => (
              <tr key={idx} className="border-t border-zinc-800 hover:bg-zinc-900/30 transition-colors">
                <td className="px-3 py-2 text-amber-400/80 font-semibold border-r border-zinc-800 whitespace-nowrap">{rec.qualification}</td>
                {(['institution', 'board_university', 'year', 'division_marks', 'medium', 'boarder_day', 'achievement'] as (keyof AcademicRecord)[]).map(field => (
                  <td key={field} className={`px-2 py-1 ${field !== 'achievement' ? 'border-r border-zinc-800' : ''}`}>
                    <input className="w-full bg-transparent text-zinc-200 text-xs focus:outline-none placeholder-zinc-600 py-1" value={rec[field] as string} onChange={e => updRecord(idx, field, e.target.value)} placeholder={field === 'boarder_day' ? 'Boarder/Day' : ''} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab 4 — Activities (Q8–Q11)
// ---------------------------------------------------------------------------
function ActivitiesTab({ data, setData }: { data: PIQData; setData: (d: PIQData) => void }) {
  const upd = (key: keyof PIQData, val: any) => setData({ ...data, [key]: val });

  // Sports rows
  const sports = data.sports || [];
  const addSport = () => setData({ ...data, sports: [...sports, { game: '', duration: '', represented: '', achievement: '' }] });
  const removeSport = (i: number) => setData({ ...data, sports: sports.filter((_, idx) => idx !== i) });
  const updSport = (i: number, field: keyof SportRecord, val: string) => setData({ ...data, sports: sports.map((s, idx) => idx === i ? { ...s, [field]: val } : s) });

  // NCC rows
  const nccDetails = data.ncc_details || [];
  const addNCC = () => setData({ ...data, ncc_details: [...nccDetails, { total_training: '', wing: '', sub_unit: '', certificate: '' }] });
  const removeNCC = (i: number) => setData({ ...data, ncc_details: nccDetails.filter((_, idx) => idx !== i) });
  const updNCC = (i: number, field: keyof NCCDetail, val: string) => setData({ ...data, ncc_details: nccDetails.map((n, idx) => idx === i ? { ...n, [field]: val } : n) });

  // Extra-curricular rows
  const extra = data.extracurricular || [];
  const addExtra = () => setData({ ...data, extracurricular: [...extra, { activity_group: '', duration: '', achievement: '' }] });
  const removeExtra = (i: number) => setData({ ...data, extracurricular: extra.filter((_, idx) => idx !== i) });
  const updExtra = (i: number, field: keyof ExtracurricularRecord, val: string) => setData({ ...data, extracurricular: extra.map((e, idx) => idx === i ? { ...e, [field]: val } : e) });

  return (
    <div className="space-y-7">
      {/* Q8 */}
      <div>
        <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">8</span> Physical Details</p>
        <div className="grid grid-cols-4 gap-3">
          <div><label className={lbl}>Age (Years)</label><input type="number" className={inp} value={data.age_years || ''} onChange={e => upd('age_years', e.target.value)} placeholder="Yrs" /></div>
          <div><label className={lbl}>Age (Months)</label><input type="number" className={inp} value={data.age_months || ''} onChange={e => upd('age_months', e.target.value)} placeholder="Mths" /></div>
          <div><label className={lbl}>Height (Metres)</label><input className={inp} value={data.height || ''} onChange={e => upd('height', e.target.value)} placeholder="e.g. 1.75" /></div>
          <div><label className={lbl}>Weight (Kg)</label><input className={inp} value={data.weight || ''} onChange={e => upd('weight', e.target.value)} placeholder="e.g. 70" /></div>
        </div>
      </div>

      {/* Q9 */}
      <div>
        <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">9</span> Present Occupation</p>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={lbl}>Present Occupation</label><input className={inp} value={data.present_occupation || ''} onChange={e => upd('present_occupation', e.target.value)} placeholder="e.g. Student, Engineer..." /></div>
          <div><label className={lbl}>Personal Monthly Income (if any)</label><input className={inp} value={data.monthly_income || ''} onChange={e => upd('monthly_income', e.target.value)} placeholder="₹ per month" /></div>
        </div>
      </div>

      {/* Q10 NCC */}
      <div>
        <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">10</span> NCC Training</p>
        <div className="flex items-center gap-6 mb-4">
          <span className="text-sm text-zinc-300">NCC Training?</span>
          {[{ val: true, label: 'Yes / हाँ' }, { val: false, label: 'No / नहीं' }].map(opt => (
            <button key={String(opt.val)} type="button"
              onClick={() => upd('ncc_training', opt.val)}
              className={`px-5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${data.ncc_training === opt.val ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}>
              {opt.label}
            </button>
          ))}
        </div>
        {data.ncc_training === true && (
          <div className="rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="bg-zinc-900 text-zinc-400">
                <th className="px-3 py-2 text-left border-r border-zinc-800">Total Training</th>
                <th className="px-3 py-2 text-left border-r border-zinc-800">Wing</th>
                <th className="px-3 py-2 text-left border-r border-zinc-800">Sub-Unit / Division</th>
                <th className="px-3 py-2 text-left">Certificate Obtained</th>
                <th className="w-8"></th>
              </tr></thead>
              <tbody>
                {nccDetails.map((n, i) => (
                  <tr key={i} className="border-t border-zinc-800">
                    {(['total_training', 'wing', 'sub_unit', 'certificate'] as (keyof NCCDetail)[]).map(f => (
                      <td key={f} className="px-2 py-1 border-r border-zinc-800 last:border-r-0">
                        <input className="w-full bg-transparent text-zinc-200 text-xs focus:outline-none placeholder-zinc-600 py-1" value={n[f]} onChange={e => updNCC(i, f, e.target.value)} />
                      </td>
                    ))}
                    <td className="px-1 py-1 text-center"><button type="button" onClick={() => removeNCC(i)} className="text-zinc-600 hover:text-rose-400 text-lg leading-none cursor-pointer">×</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" onClick={addNCC} className="w-full py-2 text-xs text-amber-500 hover:bg-zinc-900 transition-colors cursor-pointer">+ Add NCC Row</button>
          </div>
        )}
      </div>

      {/* Q11a Sports */}
      <div className="mb-6">
        <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">11</span> Participation in Games & Sports</p>
        <div className="rounded-xl border border-zinc-800 overflow-x-auto">
          <table className="w-full text-xs min-w-[600px]">
            <thead><tr className="bg-zinc-900 text-zinc-400">
              <th className="px-2 py-2 text-left border-r border-zinc-800">Game / Sport</th>
              <th className="px-2 py-2 text-left border-r border-zinc-800">Period / Duration</th>
              <th className="px-2 py-2 text-left border-r border-zinc-800">Represented (School/College/Univ/Other)</th>
              <th className="px-2 py-2 text-left">Outstanding Achievement</th>
              <th className="w-8"></th>
            </tr></thead>
            <tbody>
              {sports.map((s, i) => (
                <tr key={i} className="border-t border-zinc-800">
                  {(['game', 'duration', 'represented', 'achievement'] as (keyof SportRecord)[]).map(f => (
                    <td key={f} className="px-2 py-1 border-r border-zinc-800 last:border-r-0">
                      <input className="w-full bg-transparent text-zinc-200 text-xs focus:outline-none placeholder-zinc-600 py-1" value={(s[f] || '') as string} onChange={e => updSport(i, f, e.target.value)} />
                    </td>
                  ))}
                  <td className="px-1 py-1 text-center"><button type="button" onClick={() => removeSport(i)} className="text-zinc-600 hover:text-rose-400 text-lg leading-none cursor-pointer">×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={addSport} className="w-full py-2 text-xs text-amber-500 hover:bg-zinc-900 transition-colors cursor-pointer">+ Add Sport / Game</button>
        </div>
      </div>

      {/* Q11b Hobbies */}
      <div>
        <p className="text-xs font-semibold text-zinc-400 mb-2">(b) Hobbies / Interest</p>
        <textarea className={inp + ' resize-none h-16'} value={data.hobbies || ''} onChange={e => upd('hobbies', e.target.value)} placeholder="e.g. Reading, Trekking, Photography..." />
      </div>

      {/* Q11c Extra-curricular */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-zinc-400 mb-2">(c) Participation in Extra-Curricular Activities</p>
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-xs">
            <thead><tr className="bg-zinc-900 text-zinc-400">
              <th className="px-3 py-2 text-left border-r border-zinc-800">Name of the Activity Group</th>
              <th className="px-3 py-2 text-left border-r border-zinc-800">Year / Duration of Participation</th>
              <th className="px-3 py-2 text-left">Outstanding Achievement</th>
              <th className="w-8"></th>
            </tr></thead>
            <tbody>
              {extra.map((e, i) => (
                <tr key={i} className="border-t border-zinc-800">
                  {(['activity_group', 'duration', 'achievement'] as (keyof ExtracurricularRecord)[]).map(f => (
                    <td key={f} className="px-2 py-1 border-r border-zinc-800 last:border-r-0">
                      <input className="w-full bg-transparent text-zinc-200 text-xs focus:outline-none placeholder-zinc-600 py-1" value={e[f]} onChange={ev => updExtra(i, f, ev.target.value)} />
                    </td>
                  ))}
                  <td className="px-1 py-1 text-center"><button type="button" onClick={() => removeExtra(i)} className="text-zinc-600 hover:text-rose-400 text-lg leading-none cursor-pointer">×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={addExtra} className="w-full py-2 text-xs text-amber-500 hover:bg-zinc-900 transition-colors cursor-pointer">+ Add Activity</button>
        </div>
      </div>

      {/* Q11d Responsibility */}
      <div>
        <p className="text-xs font-semibold text-zinc-400 mb-2">(d) Position of Responsibility held in NCC / Scouting / Sports Team / Extra-Curricular group and other fields</p>
        <textarea className={inp + ' resize-none h-16'} value={data.responsibility_positions || ''} onChange={e => upd('responsibility_positions', e.target.value)} placeholder="e.g. Captain of college cricket team, NCC Cadet Leader..." />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab 5 — Service Details (Q12–Q14)
// ---------------------------------------------------------------------------
function ServiceTab({ data, setData }: { data: PIQData; setData: (d: PIQData) => void }) {
  const upd = (key: keyof PIQData, val: any) => setData({ ...data, [key]: val });
  const interviews = data.previous_interviews || [];
  const addInterview = () => setData({ ...data, previous_interviews: [...interviews, { sl_no: interviews.length + 1, type_of_entry: '', ssb_place: '', date: '', chest_batch_no: '', result: '' }] });
  const removeInterview = (i: number) => setData({ ...data, previous_interviews: interviews.filter((_, idx) => idx !== i) });
  const updInterview = (i: number, field: keyof InterviewRecord, val: any) => setData({ ...data, previous_interviews: interviews.map((iv, idx) => idx === i ? { ...iv, [field]: val } : iv) });

  const getDurationPreview = (dateStr: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const endDate = new Date(d);
    endDate.setDate(endDate.getDate() + 5);
    const formatDate = (date: Date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };
    return `${formatDate(d)} to ${formatDate(endDate)} (5 Days)`;
  };

  return (
    <div className="space-y-7">
      {/* Q12 */}
      <div>
        <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">12</span> Nature of Commission & Service</p>
        <div className="space-y-3">
          <div><label className={lbl}>(a) Nature of Commission</label><input className={inp} value={data.nature_of_commission || ''} onChange={e => upd('nature_of_commission', e.target.value)} placeholder="e.g. Permanent Commission, Short Service Commission" /></div>
          <div><label className={lbl}>(b) Choice of Service</label><input className={inp} value={data.choice_of_service || ''} onChange={e => upd('choice_of_service', e.target.value)} placeholder="e.g. Infantry, Signals, EME, Flying Branch..." /></div>
        </div>
      </div>

      {/* Q13 */}
      <div>
        <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">13</span> Number of Commission Attempts</p>
        <div><label className={lbl}>Number of chances availed for commission in all three Services</label><input type="number" min={0} className={inp + ' max-w-xs'} value={data.commission_attempts || ''} onChange={e => upd('commission_attempts', e.target.value)} placeholder="e.g. 2" /></div>
      </div>

      {/* Q14 */}
      <div>
        <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">14</span> Details of All Previous Interviews (Army / Navy / Air Force Selection Boards)</p>
        <div className="rounded-xl border border-zinc-800 overflow-x-auto">
          <table className="w-full text-xs min-w-[700px]">
            <thead><tr className="bg-zinc-900 text-zinc-400">
              <th className="px-3 py-2 text-center border-r border-zinc-800 w-12">Sl. No.</th>
              <th className="px-3 py-2 text-left border-r border-zinc-800">Type of Entry</th>
              <th className="px-3 py-2 text-left border-r border-zinc-800">SSB No. & Place</th>
              <th className="px-3 py-2 text-left border-r border-zinc-800">Start Date</th>
              <th className="px-3 py-2 text-left border-r border-zinc-800">Calculated Duration (5 Days)</th>
              <th className="px-3 py-2 text-left border-r border-zinc-800">Chest No. / Batch No.</th>
              <th className="px-3 py-2 text-left border-r border-zinc-800">Result</th>
              <th className="w-8"></th>
            </tr></thead>
            <tbody>
              {interviews.map((iv, i) => (
                <tr key={i} className="border-t border-zinc-800">
                  <td className="px-3 py-2 text-center font-bold text-amber-500/80 border-r border-zinc-800">{i + 1}</td>
                  <td className="px-2 py-1 border-r border-zinc-800">
                    <input type="text" className="w-full bg-transparent text-zinc-200 text-xs focus:outline-none placeholder-zinc-600 py-1" value={iv.type_of_entry || ''} onChange={e => updInterview(i, 'type_of_entry', e.target.value)} placeholder="e.g. TES 46" />
                  </td>
                  <td className="px-2 py-1 border-r border-zinc-800">
                    <input type="text" className="w-full bg-transparent text-zinc-200 text-xs focus:outline-none placeholder-zinc-600 py-1" value={iv.ssb_place || ''} onChange={e => updInterview(i, 'ssb_place', e.target.value)} placeholder="e.g. 11 SSB Prayagraj" />
                  </td>
                  <td className="px-2 py-1 border-r border-zinc-800">
                    <input type="date" className="w-full bg-transparent text-zinc-200 text-xs focus:outline-none placeholder-zinc-600 py-1" value={iv.date || ''} onChange={e => updInterview(i, 'date', e.target.value)} />
                  </td>
                  <td className="px-2 py-1 border-r border-zinc-800 text-zinc-400 font-mono text-[11px]">
                    {getDurationPreview(iv.date)}
                  </td>
                  <td className="px-2 py-1 border-r border-zinc-800">
                    <input type="text" className="w-full bg-transparent text-zinc-200 text-xs focus:outline-none placeholder-zinc-600 py-1" value={iv.chest_batch_no || ''} onChange={e => updInterview(i, 'chest_batch_no', e.target.value)} placeholder="Batch/Chest" />
                  </td>
                  <td className="px-2 py-1 border-r border-zinc-800">
                    <select
                      className="w-full bg-[#0f0f0f] text-zinc-200 text-xs border border-zinc-700 rounded px-1.5 py-1 focus:outline-none focus:border-amber-500"
                      value={iv.result || ''}
                      onChange={e => updInterview(i, 'result', e.target.value)}
                    >
                      <option value="">Select Result</option>
                      <option value="Screen Out">Screen Out</option>
                      <option value="Conference Out">Conference Out</option>
                      <option value="Recommended">Recommended</option>
                    </select>
                  </td>
                  <td className="px-1 py-1 text-center"><button type="button" onClick={() => removeInterview(i)} className="text-zinc-600 hover:text-rose-400 text-lg leading-none cursor-pointer">×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={addInterview} className="w-full py-2 text-xs text-amber-500 hover:bg-zinc-900 transition-colors cursor-pointer">+ Add Interview Record</button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Onboarding Page
// ---------------------------------------------------------------------------
export default function Onboarding() {
  const { user, profile, fetchProfile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<PIQData>(defaultPIQ);
  const [saving, setSaving] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractSuccessMsg, setExtractSuccessMsg] = useState('');
  const [extractError, setExtractError] = useState('');
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const router = useRouter();

  const handlePdfFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setExtractError('Please upload a valid typed/digital PDF file.');
      return;
    }

    setExtracting(true);
    setExtractError('');
    setExtractSuccessMsg('');

    try {
      const res = await apiService.extractPIQ(file);
      if (res?.extracted) {
        const extracted = res.extracted;
        setFormData(prev => ({
          ...prev,
          ...extracted,
          max_residence: { ...(prev.max_residence as any), ...(extracted.max_residence || {}) },
          parents_residence: { ...(prev.parents_residence as any), ...(extracted.parents_residence || {}) },
          permanent_residence: { ...(prev.permanent_residence as any), ...(extracted.permanent_residence || {}) },
          family_members: extracted.family_members?.length ? extracted.family_members : (prev.family_members || defaultFamilyMembers),
          academic_records: extracted.academic_records?.length ? extracted.academic_records : (prev.academic_records || defaultAcademicRecords),
          sports: extracted.sports?.length ? extracted.sports : (prev.sports || defaultPIQ.sports),
          ncc_details: extracted.ncc_details?.length ? extracted.ncc_details : (prev.ncc_details || defaultPIQ.ncc_details),
          extracurricular: extracted.extracurricular?.length ? extracted.extracurricular : (prev.extracurricular || defaultPIQ.extracurricular),
          previous_interviews: extracted.previous_interviews?.length ? extracted.previous_interviews : (prev.previous_interviews || defaultPIQ.previous_interviews),
        }));

        setExtractSuccessMsg(
          'PIQ data successfully extracted and populated into the fields below! Please review each section, make any necessary edits, and click "Save & Continue" to save your progress.'
        );
      }
    } catch (err: any) {
      setExtractError(err?.message || 'Failed to extract data from PDF. Please ensure it is a typed/digital PIQ PDF or fill the form manually.');
    } finally {
      setExtracting(false);
      if (e.target) e.target.value = '';
    }
  };

  // Load existing PIQ data if user already has a profile
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      if (profile?.piq_profile) {
        // Pre-populate form with saved data
        const saved = profile.piq_profile;
        setFormData(prev => ({
          ...defaultPIQ,
          ...saved,
          family_members: saved.family_members || defaultFamilyMembers,
          academic_records: saved.academic_records || defaultAcademicRecords,
          sports: saved.sports || defaultPIQ.sports,
          ncc_details: saved.ncc_details || defaultPIQ.ncc_details,
          extracurricular: saved.extracurricular || defaultPIQ.extracurricular,
          previous_interviews: saved.previous_interviews || defaultPIQ.previous_interviews,
        }));
        setActiveTab(Math.min(saved.completed_steps || 0, 4));
      }
    }
  }, [user, profile, authLoading]);

  // Auto-save current tab data
  const saveCurrentTab = useCallback(async (data: PIQData, nextStep: number) => {
    setSaveStatus('saving');
    try {
      await apiService.updatePIQProfile({ ...data, completed_steps: nextStep });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (e: any) {
      setError(e.message || 'Auto-save failed. Please try again.');
      setSaveStatus('idle');
    }
  }, []);

  const handleNext = async () => {
    setError('');
    const next = activeTab + 1;
    await saveCurrentTab(formData, Math.max(formData.completed_steps || 0, next));
    setActiveTab(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setActiveTab(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      await apiService.updatePIQProfile({ ...formData, completed_steps: 5, is_submitted: true });
      await fetchProfile();
      setSubmitDone(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (e: any) {
      setError(e.message || 'Failed to submit PIQ. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSkipToDashboard = async () => {
    // Save current progress before navigating away
    await saveCurrentTab(formData, formData.completed_steps || 0);
    await fetchProfile();
    router.push('/dashboard');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (submitDone) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-2">PIQ Submitted!</h2>
        <p className="text-zinc-400 text-sm">Redirecting to your dashboard...</p>
      </div>
    );
  }

  const completedSteps = formData.completed_steps || 0;
  const progressPct = Math.round((completedSteps / 5) * 100);

  return (
    <div className="min-h-screen bg-[#0b0b0b] flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-[#0b0b0b]/95 backdrop-blur border-b border-zinc-800/70">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <FileText className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-100">Personal Information Questionnaire</p>
              <p className="text-[10px] text-zinc-500">DIPR Questionnaire No. 107-A (Revised)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saveStatus === 'saving' && <span className="text-[11px] text-zinc-500 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Saving...</span>}
            {saveStatus === 'saved' && <span className="text-[11px] text-green-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Saved</span>}
            <button onClick={handleSkipToDashboard} className="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 text-xs hover:text-zinc-200 hover:border-zinc-500 transition-colors cursor-pointer">
              Skip to Dashboard
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-zinc-800">
          <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-[#0f0f0f] border-b border-zinc-800/50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {TABS.map((tab, idx) => {
              const Icon = tab.icon;
              const isDone = idx < completedSteps;
              const isActive = idx === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => idx <= completedSteps && setActiveTab(idx)}
                  disabled={idx > completedSteps}
                  className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer disabled:cursor-not-allowed ${
                    isActive ? 'border-amber-500 text-amber-400 bg-amber-500/5' :
                    isDone ? 'border-transparent text-green-500 hover:text-green-400' :
                    'border-transparent text-zinc-500 hover:text-zinc-400 disabled:text-zinc-700'
                  }`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                    isActive ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' :
                    isDone ? 'bg-green-500/10 border-green-500/30 text-green-500' :
                    'bg-zinc-800 border-zinc-700 text-zinc-500'
                  }`}>
                    {isDone ? '✓' : idx + 1}
                  </span>
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form content */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {/* PDF Auto-Fill Upload Card */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-zinc-900 via-[#141414] to-zinc-900 border border-amber-500/20 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  Have an existing PIQ PDF?
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-semibold">
                    Digital / Typed PDF
                  </span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Upload your pre-filled PIQ PDF — our AI will extract fields into this form so you can review & edit.
                </p>
              </div>
            </div>

            <label className={`px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-500/10 shrink-0 ${extracting ? 'opacity-50 pointer-events-none' : ''}`}>
              {extracting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Extracting Data...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload PIQ PDF</span>
                </>
              )}
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handlePdfFileUpload}
                disabled={extracting}
                className="hidden"
              />
            </label>
          </div>

          {extractError && (
            <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{extractError}</span>
            </div>
          )}

          {extractSuccessMsg && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{extractSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* Tab subtitle */}
        <div className="mb-6">
          <h1 className="text-lg font-bold text-zinc-100">{TABS[activeTab].label} Details</h1>
          <p className="text-xs text-zinc-500">{TABS[activeTab].desc} — SSB PIQ Form</p>
        </div>

        {error && (
          <div className="p-3 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <div className="bg-[#111]/80 rounded-2xl border border-zinc-800/60 p-6 backdrop-blur shadow-xl">
          {activeTab === 0 && <PersonalTab data={formData} setData={setFormData} />}
          {activeTab === 1 && <FamilyTab data={formData} setData={setFormData} />}
          {activeTab === 2 && <AcademicTab data={formData} setData={setFormData} />}
          {activeTab === 3 && <ActivitiesTab data={formData} setData={setFormData} />}
          {activeTab === 4 && <ServiceTab data={formData} setData={setFormData} />}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={handlePrev}
            disabled={activeTab === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-semibold hover:border-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Save className="w-3.5 h-3.5" />
            Auto-saves on every step
          </div>

          {activeTab < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={saveStatus === 'saving'}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-amber-800/40 text-black font-bold text-sm transition-all shadow-md shadow-amber-500/20 cursor-pointer">
              {saveStatus === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Save & Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 disabled:bg-green-900/40 text-white font-bold text-sm transition-all shadow-md shadow-green-500/20 cursor-pointer">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Submit PIQ Form
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
