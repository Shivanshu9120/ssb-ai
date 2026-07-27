'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Loader2, FileText, Edit3, Download, ChevronRight, ChevronLeft, Save,
  User, Users, GraduationCap, Activity, Shield, CheckCircle2, AlertCircle, X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { MilitaryLoader } from '@/components/ui/MilitaryLoader';
import { apiService, PIQData, FamilyMember, AcademicRecord, NCCDetail, SportRecord, ExtracurricularRecord, InterviewRecord } from '@/services/api';

// ---------------------------------------------------------------------------
// Helpers & Defaults
// ---------------------------------------------------------------------------
const v = (val: any) => (val !== undefined && val !== null && val !== '') ? String(val) : null;

function formatSSBDuration(dateStr: string | null | undefined): string | null {
  if (!dateStr || !dateStr.trim()) return null;
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
}

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
  sports: [{ game: '', duration: '', represented: '', achievement: '' }],
  hobbies: '', extracurricular: [{ activity_group: '', duration: '', achievement: '' }],
  responsibility_positions: '',
  nature_of_commission: '', choice_of_service: '', commission_attempts: '',
  previous_interviews: [{ sl_no: 1, type_of_entry: '', ssb_place: '', date: '', chest_batch_no: '', result: '' }],
  exam: 'Army', level: 'Beginner',
};

function SectionCard({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="theme-bg-card rounded-2xl border theme-border p-5 backdrop-blur">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-[var(--theme-accent-bg-subtle)] border theme-accent-border flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 theme-accent-text" />
        </div>
        <h3 className="text-sm font-bold theme-text-primary">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="mb-3">
      <p className="text-[10px] font-semibold theme-text-muted uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm theme-text-primary">{value || <span className="theme-text-muted italic">Not filled</span>}</p>
    </div>
  );
}

function TableView({ headers, rows }: { headers: string[]; rows: (string | null | undefined)[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border theme-border">
      <table className="w-full text-xs">
        <thead>
          <tr className="theme-bg-input">
            {headers.map(h => <th key={h} className="px-3 py-2 text-left theme-text-muted font-semibold border-r theme-border-subtle last:border-r-0 whitespace-nowrap">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t theme-border-subtle hover:theme-bg-card-hover transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 theme-text-secondary border-r theme-border-subtle last:border-r-0">
                  {cell || <span className="theme-text-muted italic">—</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const TAB_LABELS = ['Personal', 'Family', 'Academic', 'Activities', 'Service'];
const TAB_ICONS = [User, Users, GraduationCap, Activity, Shield];

function CompletionBadge({ steps }: { steps: number }) {
  const pct = Math.round((steps / 5) * 100);
  return (
    <div className="theme-bg-card rounded-2xl border theme-border p-5 backdrop-blur">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold theme-text-primary">PIQ Completion</h3>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${pct === 100 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-[var(--theme-accent-bg-subtle)] theme-accent-text border theme-accent-border'}`}>
          {pct}% Complete
        </span>
      </div>
      <div className="h-2 theme-bg-input rounded-full mb-4 overflow-hidden border theme-border-subtle">
        <div
          className="h-full theme-accent-bg rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        {TAB_LABELS.map((label, idx) => {
          const Icon = TAB_ICONS[idx];
          const done = idx < steps;
          return (
            <div key={label} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${done ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'theme-bg-input theme-border theme-text-muted'}`}>
              {done ? <CheckCircle2 className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Editor Form Shared Components
// ---------------------------------------------------------------------------
const inp = 'w-full px-3 py-2 rounded-lg border theme-border theme-bg-input theme-text-primary text-sm placeholder:theme-text-muted focus:theme-accent-border focus:outline-none transition-colors';
const lbl = 'block text-xs font-semibold theme-text-secondary mb-1';
const sectionTitle = 'text-xs font-bold theme-accent-text uppercase tracking-widest mb-3 flex items-center gap-2';

function PersonalTab({ data, setData }: { data: PIQData; setData: (d: PIQData) => void }) {
  const upd = (key: keyof PIQData, val: any) => setData({ ...data, [key]: val });
  const updRes = (key: 'max_residence' | 'parents_residence' | 'permanent_residence', field: string, val: string) =>
    setData({ ...data, [key]: { ...(data[key] as any), [field]: val } });

  return (
    <div className="space-y-7">
      <div>
        <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">1</span> Administrative Details</p>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={lbl}>Selection Board (No. & Place)</label><input className={inp} value={data.selection_board || ''} onChange={e => upd('selection_board', e.target.value)} placeholder="e.g. 11 SSB Allahabad" /></div>
          <div><label className={lbl}>Batch No.</label><input className={inp} value={data.batch_no || ''} onChange={e => upd('batch_no', e.target.value)} placeholder="e.g. A-1" /></div>
          <div><label className={lbl}>Chest No.</label><input className={inp} value={data.chest_no || ''} onChange={e => upd('chest_no', e.target.value)} placeholder="Chest No." /></div>
          <div><label className={lbl}>UPSC / Other Roll No.</label><input className={inp} value={data.upsc_roll_no || ''} onChange={e => upd('upsc_roll_no', e.target.value)} placeholder="Roll No." /></div>
        </div>
      </div>

      <div>
        <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">2</span> Personal Identity</p>
        <div className="space-y-3">
          <div><label className={lbl}>Full Name (IN CAPITALS)</label><input className={inp + ' uppercase'} value={data.full_name || ''} onChange={e => upd('full_name', e.target.value.toUpperCase())} placeholder="E.G. RAHUL SHARMA" /></div>
          <div><label className={lbl}>Father's Name</label><input className={inp} value={data.father_name || ''} onChange={e => upd('father_name', e.target.value)} placeholder="Father's full name" /></div>
        </div>
      </div>

      <div>
        <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">4</span> Residences</p>
        {[
          { key: 'max_residence', title: '(a) Place of Maximum Residence' },
          { key: 'parents_residence', title: '(b) Place of Parents Residence' },
          { key: 'permanent_residence', title: '(c) Permanent Home Address' },
        ].map(res => (
          <div key={res.key} className="mb-4">
            <label className="block text-xs font-semibold text-zinc-300 mb-2">{res.title}</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <input className={inp} value={(data as any)[res.key]?.place || ''} onChange={e => updRes(res.key as any, 'place', e.target.value)} placeholder="Place / City" />
              <input className={inp} value={(data as any)[res.key]?.district || ''} onChange={e => updRes(res.key as any, 'district', e.target.value)} placeholder="District" />
              <input className={inp} value={(data as any)[res.key]?.state || ''} onChange={e => updRes(res.key as any, 'state', e.target.value)} placeholder="State" />
              <input className={inp} value={(data as any)[res.key]?.population || ''} onChange={e => updRes(res.key as any, 'population', e.target.value)} placeholder="Approx Pop." />
            </div>
          </div>
        ))}
      </div>

      <div>
        <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">5</span> Demographics & DOB</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div><label className={lbl}>State & District</label><input className={inp} value={data.state_district || ''} onChange={e => upd('state_district', e.target.value)} placeholder="State & District" /></div>
          <div><label className={lbl}>Religion</label><input className={inp} value={data.religion || ''} onChange={e => upd('religion', e.target.value)} placeholder="e.g. Hindu, Sikh..." /></div>
          <div><label className={lbl}>Category</label><input className={inp} value={data.category || ''} onChange={e => upd('category', e.target.value)} placeholder="e.g. Gen/OBC/SC/ST" /></div>
          <div><label className={lbl}>Mother Tongue</label><input className={inp} value={data.mother_tongue || ''} onChange={e => upd('mother_tongue', e.target.value)} placeholder="e.g. Hindi, Punjabi..." /></div>
          <div><label className={lbl}>Date of Birth</label><input type="date" className={inp} value={data.date_of_birth || ''} onChange={e => upd('date_of_birth', e.target.value)} /></div>
          <div><label className={lbl}>Marital Status</label><input className={inp} value={data.marital_status || ''} onChange={e => upd('marital_status', e.target.value)} placeholder="Single / Married" /></div>
        </div>
      </div>
    </div>
  );
}

function FamilyTab({ data, setData }: { data: PIQData; setData: (d: PIQData) => void }) {
  const members = data.family_members || defaultFamilyMembers;
  const updMember = (idx: number, field: keyof FamilyMember, val: string) => {
    const updated = members.map((m, i) => i === idx ? { ...m, [field]: val } : m);
    setData({ ...data, family_members: updated });
  };

  return (
    <div className="space-y-6">
      <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">6</span> Family Members</p>
      
      <div className="flex items-center gap-6 mb-4">
        <span className="text-sm text-zinc-300 font-semibold">Parents Alive?</span>
        {[{ val: true, label: 'Yes / हाँ' }, { val: false, label: 'No / नहीं' }].map(opt => (
          <button key={String(opt.val)} type="button"
            onClick={() => setData({ ...data, parents_alive: opt.val })}
            className={`px-5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${data.parents_alive === opt.val ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}>
            {opt.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-xs min-w-[600px]">
          <thead>
            <tr className="bg-zinc-900 text-zinc-400">
              <th className="px-3 py-2 text-left border-r border-zinc-800 w-40">Relation</th>
              <th className="px-3 py-2 text-left border-r border-zinc-800">Education</th>
              <th className="px-3 py-2 text-left border-r border-zinc-800">Occupation</th>
              <th className="px-3 py-2 text-left">Income / Month</th>
            </tr>
          </thead>
          <tbody>
            {members.map((mem, idx) => (
              <tr key={idx} className="border-t border-zinc-800">
                <td className="px-3 py-2 text-amber-400/80 font-semibold border-r border-zinc-800">{mem.relation}</td>
                {(['education', 'occupation', 'income'] as (keyof FamilyMember)[]).map(field => (
                  <td key={field} className="px-2 py-1 border-r border-zinc-800 last:border-r-0">
                    <input className="w-full bg-transparent text-zinc-200 text-xs focus:outline-none placeholder-zinc-600 py-1" value={mem[field] || ''} onChange={e => updMember(idx, field, e.target.value)} placeholder={`Enter ${field}`} />
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

function AcademicTab({ data, setData }: { data: PIQData; setData: (d: PIQData) => void }) {
  const records = data.academic_records || defaultAcademicRecords;
  const updRecord = (idx: number, field: keyof AcademicRecord, val: string) => {
    const updated = records.map((r, i) => i === idx ? { ...r, [field]: val } : r);
    setData({ ...data, academic_records: updated });
  };

  return (
    <div className="space-y-4">
      <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">7</span> Educational Record</p>
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-xs min-w-[850px]">
          <thead>
            <tr className="bg-zinc-900 text-zinc-400">
              <th className="px-3 py-2 text-left w-36 border-r border-zinc-800">Qualification</th>
              <th className="px-2 py-2 text-left border-r border-zinc-800">Institution</th>
              <th className="px-2 py-2 text-left border-r border-zinc-800">Board / Univ</th>
              <th className="px-2 py-2 text-left border-r border-zinc-800 w-16">Year</th>
              <th className="px-2 py-2 text-left border-r border-zinc-800 w-20">Marks %</th>
              <th className="px-2 py-2 text-left border-r border-zinc-800 w-20">Medium</th>
              <th className="px-2 py-2 text-left border-r border-zinc-800 w-24">Boarder/Day</th>
              <th className="px-2 py-2 text-left w-32">Achievement</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec, idx) => (
              <tr key={idx} className="border-t border-zinc-800">
                <td className="px-3 py-2 text-amber-400/80 font-semibold border-r border-zinc-800 whitespace-nowrap">{rec.qualification}</td>
                {(['institution', 'board_university', 'year', 'division_marks', 'medium', 'boarder_day', 'achievement'] as (keyof AcademicRecord)[]).map(field => (
                  <td key={field} className={`px-2 py-1 ${field !== 'achievement' ? 'border-r border-zinc-800' : ''}`}>
                    <input className="w-full bg-transparent text-zinc-200 text-xs focus:outline-none placeholder-zinc-600 py-1" value={rec[field] || ''} onChange={e => updRecord(idx, field, e.target.value)} />
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

function ActivitiesTab({ data, setData }: { data: PIQData; setData: (d: PIQData) => void }) {
  const upd = (key: keyof PIQData, val: any) => setData({ ...data, [key]: val });
  const sports = data.sports || [];
  const addSport = () => setData({ ...data, sports: [...sports, { game: '', duration: '', represented: '', achievement: '' }] });
  const removeSport = (i: number) => setData({ ...data, sports: sports.filter((_, idx) => idx !== i) });
  const updSport = (i: number, field: keyof SportRecord, val: string) => setData({ ...data, sports: sports.map((s, idx) => idx === i ? { ...s, [field]: val } : s) });

  const nccDetails = data.ncc_details || [];
  const addNCC = () => setData({ ...data, ncc_details: [...nccDetails, { total_training: '', wing: '', sub_unit: '', certificate: '' }] });
  const removeNCC = (i: number) => setData({ ...data, ncc_details: nccDetails.filter((_, idx) => idx !== i) });
  const updNCC = (i: number, field: keyof NCCDetail, val: string) => setData({ ...data, ncc_details: nccDetails.map((n, idx) => idx === i ? { ...n, [field]: val } : n) });

  const extra = data.extracurricular || [];
  const addExtra = () => setData({ ...data, extracurricular: [...extra, { activity_group: '', duration: '', achievement: '' }] });
  const removeExtra = (i: number) => setData({ ...data, extracurricular: extra.filter((_, idx) => idx !== i) });
  const updExtra = (i: number, field: keyof ExtracurricularRecord, val: string) => setData({ ...data, extracurricular: extra.map((e, idx) => idx === i ? { ...e, [field]: val } : e) });

  return (
    <div className="space-y-7">
      <div>
        <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">8</span> Physical Details</p>
        <div className="grid grid-cols-4 gap-3">
          <div><label className={lbl}>Age (Years)</label><input type="number" className={inp} value={data.age_years || ''} onChange={e => upd('age_years', e.target.value)} placeholder="Yrs" /></div>
          <div><label className={lbl}>Age (Months)</label><input type="number" className={inp} value={data.age_months || ''} onChange={e => upd('age_months', e.target.value)} placeholder="Mths" /></div>
          <div><label className={lbl}>Height (Metres)</label><input className={inp} value={data.height || ''} onChange={e => upd('height', e.target.value)} placeholder="e.g. 1.75" /></div>
          <div><label className={lbl}>Weight (Kg)</label><input className={inp} value={data.weight || ''} onChange={e => upd('weight', e.target.value)} placeholder="e.g. 70" /></div>
        </div>
      </div>

      <div>
        <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">9</span> Present Occupation</p>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={lbl}>Present Occupation</label><input className={inp} value={data.present_occupation || ''} onChange={e => upd('present_occupation', e.target.value)} placeholder="e.g. Student, Engineer..." /></div>
          <div><label className={lbl}>Personal Monthly Income (if any)</label><input className={inp} value={data.monthly_income || ''} onChange={e => upd('monthly_income', e.target.value)} placeholder="₹ per month" /></div>
        </div>
      </div>

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
          <div className="rounded-xl border border-zinc-800 overflow-hidden mb-4">
            <table className="w-full text-xs">
              <thead><tr className="bg-zinc-900 text-zinc-400">
                <th className="px-3 py-2 text-left border-r border-zinc-800">Total Training</th>
                <th className="px-3 py-2 text-left border-r border-zinc-800">Wing</th>
                <th className="px-3 py-2 text-left border-r border-zinc-800">Sub-Unit</th>
                <th className="px-3 py-2 text-left">Certificate</th>
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
                    <td className="px-1 py-1 text-center"><button type="button" onClick={() => removeNCC(i)} className="text-zinc-600 hover:text-rose-400 text-lg cursor-pointer">×</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" onClick={addNCC} className="w-full py-2 text-xs text-amber-500 hover:bg-zinc-900 transition-colors cursor-pointer">+ Add NCC Row</button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">11</span> Participation in Games & Sports</p>
        <div className="rounded-xl border border-zinc-800 overflow-x-auto">
          <table className="w-full text-xs min-w-[600px]">
            <thead><tr className="bg-zinc-900 text-zinc-400">
              <th className="px-2 py-2 text-left border-r border-zinc-800">Game / Sport</th>
              <th className="px-2 py-2 text-left border-r border-zinc-800">Duration</th>
              <th className="px-2 py-2 text-left border-r border-zinc-800">Represented</th>
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
                  <td className="px-1 py-1 text-center"><button type="button" onClick={() => removeSport(i)} className="text-zinc-600 hover:text-rose-400 text-lg cursor-pointer">×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={addSport} className="w-full py-2 text-xs text-amber-500 hover:bg-zinc-900 transition-colors cursor-pointer">+ Add Sport / Game</button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold text-zinc-400 mb-2">(b) Hobbies / Interest</p>
        <textarea className={inp + ' resize-none h-16'} value={data.hobbies || ''} onChange={e => upd('hobbies', e.target.value)} placeholder="e.g. Reading, Trekking, Photography..." />
      </div>

      <div className="mb-6">
        <p className="text-xs font-semibold text-zinc-400 mb-2">(c) Participation in Extra-Curricular Activities</p>
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-xs">
            <thead><tr className="bg-zinc-900 text-zinc-400">
              <th className="px-3 py-2 text-left border-r border-zinc-800">Activity Group</th>
              <th className="px-3 py-2 text-left border-r border-zinc-800">Duration</th>
              <th className="px-3 py-2 text-left">Achievement</th>
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
                  <td className="px-1 py-1 text-center"><button type="button" onClick={() => removeExtra(i)} className="text-zinc-600 hover:text-rose-400 text-lg cursor-pointer">×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={addExtra} className="w-full py-2 text-xs text-amber-500 hover:bg-zinc-900 transition-colors cursor-pointer">+ Add Activity</button>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-zinc-400 mb-2">(d) Position of Responsibility</p>
        <textarea className={inp + ' resize-none h-16'} value={data.responsibility_positions || ''} onChange={e => upd('responsibility_positions', e.target.value)} placeholder="e.g. Captain of college cricket team, NCC Cadet Leader..." />
      </div>
    </div>
  );
}

function ServiceTab({ data, setData }: { data: PIQData; setData: (d: PIQData) => void }) {
  const upd = (key: keyof PIQData, val: any) => setData({ ...data, [key]: val });
  const interviews = data.previous_interviews || [];
  const addInterview = () => setData({ ...data, previous_interviews: [...interviews, { sl_no: interviews.length + 1, type_of_entry: '', ssb_place: '', date: '', chest_batch_no: '', result: '' }] });
  const removeInterview = (i: number) => setData({ ...data, previous_interviews: interviews.filter((_, idx) => idx !== i) });
  const updInterview = (i: number, field: keyof InterviewRecord, val: any) => setData({ ...data, previous_interviews: interviews.map((iv, idx) => idx === i ? { ...iv, [field]: val } : iv) });

  return (
    <div className="space-y-7">
      <div>
        <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">12</span> Nature of Commission & Service</p>
        <div className="space-y-3">
          <div><label className={lbl}>(a) Nature of Commission</label><input className={inp} value={data.nature_of_commission || ''} onChange={e => upd('nature_of_commission', e.target.value)} placeholder="e.g. Permanent Commission, Short Service Commission" /></div>
          <div><label className={lbl}>(b) Choice of Service</label><input className={inp} value={data.choice_of_service || ''} onChange={e => upd('choice_of_service', e.target.value)} placeholder="e.g. Infantry, Signals, EME, Flying Branch..." /></div>
        </div>
      </div>

      <div>
        <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">13</span> Number of Commission Attempts</p>
        <div><label className={lbl}>Number of chances availed for commission in all three Services</label><input type="number" min={0} className={inp + ' max-w-xs'} value={data.commission_attempts || ''} onChange={e => upd('commission_attempts', e.target.value)} placeholder="e.g. 2" /></div>
      </div>

      <div>
        <p className={sectionTitle}><span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">14</span> Details of All Previous Interviews</p>
        <div className="rounded-xl border border-zinc-800 overflow-x-auto">
          <table className="w-full text-xs min-w-[700px]">
            <thead><tr className="bg-zinc-900 text-zinc-400">
              <th className="px-3 py-2 text-center border-r border-zinc-800 w-12">Sl. No.</th>
              <th className="px-3 py-2 text-left border-r border-zinc-800">Type of Entry</th>
              <th className="px-3 py-2 text-left border-r border-zinc-800">SSB No. & Place</th>
              <th className="px-3 py-2 text-left border-r border-zinc-800">Start Date</th>
              <th className="px-3 py-2 text-left border-r border-zinc-800">Calculated Duration (5 Days)</th>
              <th className="px-3 py-2 text-left border-r border-zinc-800">Chest/Batch No.</th>
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
                    {formatSSBDuration(iv.date) || '—'}
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
                  <td className="px-1 py-1 text-center"><button type="button" onClick={() => removeInterview(i)} className="text-zinc-600 hover:text-rose-400 text-lg cursor-pointer">×</button></td>
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
// Main Page Component
// ---------------------------------------------------------------------------
export default function PIQPage() {
  const { user, profile, fetchProfile, loading: authLoading } = useAuth();
  const [piqData, setPiqData] = useState<PIQData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Editor state
  const [activeTab, setActiveTab] = useState(0);
  const [editFormData, setEditFormData] = useState<PIQData>(defaultPIQ);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [saveError, setSaveError] = useState('');

  const searchParams = useSearchParams();
  const router = useRouter();

  const loadPIQ = useCallback(async () => {
    try {
      const data = await apiService.getPIQProfile();
      setPiqData(data);
      if (data) {
        setEditFormData({
          ...defaultPIQ,
          ...data,
          family_members: data.family_members || defaultFamilyMembers,
          academic_records: data.academic_records || defaultAcademicRecords,
          sports: data.sports || defaultPIQ.sports,
          ncc_details: data.ncc_details || defaultPIQ.ncc_details,
          extracurricular: data.extracurricular || defaultPIQ.extracurricular,
          previous_interviews: data.previous_interviews || defaultPIQ.previous_interviews,
        });
      }
    } catch {
      setPiqData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      loadPIQ();
    }
  }, [user, authLoading, loadPIQ, router]);

  useEffect(() => {
    if (searchParams.get('edit') === 'true') {
      setIsEditing(true);
    }
  }, [searchParams]);

  const handleDownloadPDF = async () => {
    if (!piqData) return;
    try {
      setGeneratingPdf(true);
      const { pdf } = await import('@react-pdf/renderer');
      const { PIQPDFDocument } = await import('@/components/piq/PIQPDFDocument');
      
      const blob = await pdf(<PIQPDFDocument data={piqData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `PIQ_${(piqData.full_name || 'Candidate').replace(/\s+/g, '_')}_107A.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Failed to generate PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleSaveEdit = async (closeAfterSave = false) => {
    setSaving(true);
    setSaveError('');
    setSaveStatus('saving');
    try {
      const nextStep = Math.max(editFormData.completed_steps || 0, activeTab + 1);
      const updated = { ...editFormData, completed_steps: nextStep };
      await apiService.updatePIQProfile(updated);
      await fetchProfile();
      setPiqData(updated);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      if (closeAfterSave) {
        setIsEditing(false);
      }
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save changes.');
      setSaveStatus('idle');
    } finally {
      setSaving(false);
    }
  };

  const handleStartEditing = () => {
    if (piqData) {
      setEditFormData({
        ...defaultPIQ,
        ...piqData,
        family_members: piqData.family_members || defaultFamilyMembers,
        academic_records: piqData.academic_records || defaultAcademicRecords,
        sports: piqData.sports || defaultPIQ.sports,
        ncc_details: piqData.ncc_details || defaultPIQ.ncc_details,
        extracurricular: piqData.extracurricular || defaultPIQ.extracurricular,
        previous_interviews: piqData.previous_interviews || defaultPIQ.previous_interviews,
      });
    } else {
      setEditFormData(defaultPIQ);
    }
    setIsEditing(true);
  };

  if (authLoading || loading) {
    return <MilitaryLoader variant="fullscreen" />;
  }

  const steps = piqData?.completed_steps || 0;

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#131313] border border-zinc-900 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-zinc-100">Personal Information Questionnaire</h1>
            <p className="text-xs text-zinc-400">DIPR Questionnaire No. 107-A (Revised) — SSB PIQ Form</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isEditing ? (
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-700 text-zinc-300 text-xs font-bold hover:bg-zinc-800 transition-all cursor-pointer">
              <X className="w-3.5 h-3.5 text-zinc-400" />
              Close Editor
            </button>
          ) : (
            <button
              onClick={handleStartEditing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-700 text-zinc-300 text-xs font-bold hover:border-amber-500/40 hover:text-amber-400 transition-all cursor-pointer">
              <Edit3 className="w-3.5 h-3.5 text-amber-500" />
              {steps === 0 ? 'Start PIQ' : 'Edit PIQ'}
            </button>
          )}

          {piqData && steps > 0 && !isEditing && (
            <button
              onClick={handleDownloadPDF}
              disabled={generatingPdf}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                generatingPdf
                  ? 'bg-zinc-800 text-zinc-400'
                  : 'bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/10'
              }`}
            >
              {generatingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              {generatingPdf ? 'Generating PDF...' : 'Download PDF'}
            </button>
          )}
        </div>
      </div>

      {/* Mode Switch: In-Place Editing vs View Mode */}
      {isEditing ? (
        /* IN-PLACE PIQ EDITOR */
        <div className="bg-[#131313] border border-zinc-900 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-500" /> Editing PIQ Questionnaire
              </h2>
              <p className="text-xs text-zinc-400">Make edits below and click Save Changes when finished.</p>
            </div>

            <div className="flex items-center gap-3">
              {saveStatus === 'saved' && (
                <span className="text-xs font-semibold text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved
                </span>
              )}
              <button
                onClick={() => handleSaveEdit(false)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all cursor-pointer">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Draft
              </button>
              <button
                onClick={() => handleSaveEdit(true)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-bold transition-all cursor-pointer">
                Done & View
              </button>
            </div>
          </div>

          {saveError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {saveError}
            </div>
          )}

          {/* Editor Tabs Navigation */}
          <div className="flex border-b border-zinc-800 gap-2 overflow-x-auto pb-2">
            {TAB_LABELS.map((label, idx) => {
              const Icon = TAB_ICONS[idx];
              const active = activeTab === idx;
              return (
                <button
                  key={label}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {idx + 1}. {label}
                </button>
              );
            })}
          </div>

          {/* Active Form Tab Content */}
          <div className="py-2">
            {activeTab === 0 && <PersonalTab data={editFormData} setData={setEditFormData} />}
            {activeTab === 1 && <FamilyTab data={editFormData} setData={setEditFormData} />}
            {activeTab === 2 && <AcademicTab data={editFormData} setData={setEditFormData} />}
            {activeTab === 3 && <ActivitiesTab data={editFormData} setData={setEditFormData} />}
            {activeTab === 4 && <ServiceTab data={editFormData} setData={setEditFormData} />}
          </div>

          {/* Step Navigation Controls */}
          <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
            <button
              onClick={() => setActiveTab(prev => Math.max(0, prev - 1))}
              disabled={activeTab === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                activeTab === 0 ? 'opacity-40 cursor-not-allowed text-zinc-600' : 'text-zinc-300 bg-zinc-900 hover:bg-zinc-800'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Previous Tab
            </button>

            {activeTab < 4 ? (
              <button
                onClick={() => {
                  handleSaveEdit(false);
                  setActiveTab(prev => Math.min(4, prev + 1));
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold cursor-pointer transition-all">
                Next Tab <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => handleSaveEdit(true)}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-bold cursor-pointer transition-all">
                Finish & Save PIQ <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* VIEW MODE */
        <div>
          {!piqData || steps === 0 ? (
            /* Empty state */
            <div className="text-center py-20 bg-[#131313] rounded-2xl border border-zinc-900">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-amber-500" />
              </div>
              <h2 className="text-lg font-bold text-zinc-200 mb-2">PIQ Not Started</h2>
              <p className="text-sm text-zinc-500 mb-6 max-w-sm mx-auto">Fill in your Personal Information Questionnaire — the official SSB form used at selection boards.</p>
              <button
                onClick={handleStartEditing}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs mx-auto transition-all cursor-pointer shadow-md shadow-amber-500/10">
                Start PIQ Form <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Completion badge */}
              <CompletionBadge steps={steps} />

              {/* Personal Details */}
              {steps >= 1 && (
                <SectionCard title="Personal Details (Q1–Q5)" icon={User}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6">
                    <Field label="Selection Board" value={v(piqData.selection_board)} />
                    <Field label="Batch No." value={v(piqData.batch_no)} />
                    <Field label="Chest No." value={v(piqData.chest_no)} />
                    <Field label="UPSC Roll No." value={v(piqData.upsc_roll_no)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <Field label="Full Name" value={v(piqData.full_name)} />
                    <Field label="Father's Name" value={v(piqData.father_name)} />
                  </div>
                  <div className="grid grid-cols-1 gap-2 mt-1">
                    {[
                      ['Max Residence', piqData.max_residence],
                      ["Parents' Residence", piqData.parents_residence],
                      ['Permanent Residence', piqData.permanent_residence],
                    ].map(([label, r]) => (
                      <Field key={label as string} label={label as string} value={r ? `${(r as any).place || ''}${(r as any).district ? ', ' + (r as any).district : ''}${(r as any).state ? ', ' + (r as any).state : ''}${(r as any).population ? ' (Pop: ' + (r as any).population + ')' : ''}` : null} />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 mt-1">
                    <Field label="State & District" value={v(piqData.state_district)} />
                    <Field label="Religion" value={v(piqData.religion)} />
                    <Field label="Category" value={v(piqData.category) || 'General'} />
                    <Field label="Mother Tongue" value={v(piqData.mother_tongue)} />
                    <Field label="Date of Birth" value={v(piqData.date_of_birth)} />
                    <Field label="Marital Status" value={v(piqData.marital_status)} />
                  </div>
                </SectionCard>
              )}

              {/* Family Details */}
              {steps >= 2 && (
                <SectionCard title="Family Details (Q6)" icon={Users}>
                  <Field label="Parents Alive" value={piqData.parents_alive === true ? 'Yes' : piqData.parents_alive === false ? 'No' : null} />
                  {piqData.parents_alive === false && (
                    <div className="grid grid-cols-2 gap-x-6">
                      <Field label="Mother's Age at Death" value={v(piqData.mother_death_age)} />
                      <Field label="Father's Age at Death" value={v(piqData.father_death_age)} />
                    </div>
                  )}
                  {piqData.family_members && piqData.family_members.length > 0 && (
                    <TableView
                      headers={['Relation', 'Education', 'Occupation', 'Income (per month)']}
                      rows={(piqData.family_members as any[]).map(m => [m.relation, m.education, m.occupation, m.income])}
                    />
                  )}
                </SectionCard>
              )}

              {/* Academic */}
              {steps >= 3 && (
                <SectionCard title="Academic Details (Q7)" icon={GraduationCap}>
                  {piqData.academic_records && piqData.academic_records.length > 0 && (
                    <TableView
                      headers={['Qualification', 'Institution', 'Board/University', 'Year', 'Div/Marks%', 'Medium', 'Boarder/Day', 'Achievement']}
                      rows={(piqData.academic_records as any[]).map(r => [r.qualification, r.institution, r.board_university, r.year, r.division_marks, r.medium, r.boarder_day, r.achievement])}
                    />
                  )}
                </SectionCard>
              )}

              {/* Activities */}
              {steps >= 4 && (
                <SectionCard title="Activities & Physical Details (Q8–Q11)" icon={Activity}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6">
                    <Field label="Age (Years)" value={v(piqData.age_years)} />
                    <Field label="Age (Months)" value={v(piqData.age_months)} />
                    <Field label="Height (m)" value={v(piqData.height)} />
                    <Field label="Weight (kg)" value={v(piqData.weight)} />
                  </div>
                  <div className="grid grid-cols-2 gap-x-6">
                    <Field label="Present Occupation" value={v(piqData.present_occupation)} />
                    <Field label="Monthly Income" value={v(piqData.monthly_income)} />
                  </div>
                  <Field label="NCC Training" value={piqData.ncc_training === true ? 'Yes' : piqData.ncc_training === false ? 'No' : null} />
                  {piqData.ncc_training && piqData.ncc_details && (piqData.ncc_details as any[]).length > 0 && (
                    <div className="mb-6">
                      <TableView
                        headers={['Total Training', 'Wing', 'Sub-Unit', 'Certificate']}
                        rows={(piqData.ncc_details as any[]).map(n => [n.total_training, n.wing, n.sub_unit, n.certificate])}
                      />
                    </div>
                  )}
                  {piqData.sports && (piqData.sports as any[]).length > 0 && (
                    <div className="mb-6">
                      <p className="text-xs font-semibold text-zinc-500 mb-2">Games & Sports</p>
                      <TableView
                        headers={['Game', 'Duration', 'Represented', 'Achievement']}
                        rows={(piqData.sports as any[]).map(s => [s.game, s.duration, s.represented, s.achievement])}
                      />
                    </div>
                  )}
                  <div className="mb-4">
                    <Field label="Hobbies / Interests" value={v(piqData.hobbies)} />
                  </div>
                  {piqData.extracurricular && (piqData.extracurricular as any[]).length > 0 && (
                    <div className="mb-6">
                      <p className="text-xs font-semibold text-zinc-500 mb-2">Extra-Curricular Activities</p>
                      <TableView
                        headers={['Activity Group', 'Duration', 'Achievement']}
                        rows={(piqData.extracurricular as any[]).map(e => [e.activity_group, e.duration, e.achievement])}
                      />
                    </div>
                  )}
                  <Field label="Position of Responsibility" value={v(piqData.responsibility_positions)} />
                </SectionCard>
              )}

              {/* Service */}
              {steps >= 5 && (
                <SectionCard title="Service Details (Q12–Q14)" icon={Shield}>
                  <div className="grid grid-cols-2 gap-x-6">
                    <Field label="Nature of Commission" value={v(piqData.nature_of_commission)} />
                    <Field label="Choice of Service" value={v(piqData.choice_of_service)} />
                    <Field label="Commission Attempts" value={v(piqData.commission_attempts)} />
                  </div>
                  {piqData.previous_interviews && (piqData.previous_interviews as any[]).length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-zinc-500 mb-2">Previous SSB Interviews</p>
                      <TableView
                        headers={['Sl. No.', 'Type of Entry', 'SSB No. & Place', 'Date (5-Day Duration)', 'Chest/Batch No.', 'Result']}
                        rows={(piqData.previous_interviews as any[]).map((iv, i) => [
                          String(i + 1),
                          iv.type_of_entry,
                          iv.ssb_place,
                          formatSSBDuration(iv.date),
                          iv.chest_batch_no,
                          iv.result
                        ])}
                      />
                    </div>
                  )}
                </SectionCard>
              )}

              {/* Incomplete notice */}
              {steps < 5 && (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-amber-400">PIQ Incomplete</p>
                    <p className="text-xs text-zinc-400">{5 - steps} section{5 - steps !== 1 ? 's' : ''} remaining. Complete all sections to get the full PDF and better AI coaching context.</p>
                  </div>
                  <button onClick={handleStartEditing} className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-colors cursor-pointer">
                    Continue Editing <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
