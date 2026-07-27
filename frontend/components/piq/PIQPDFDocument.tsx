// PIQ PDF Document — DIPR Questionnaire No. 107-A (Revised)
// Standard 2-Page Official SSB PIQ Form Layout. Zero overlaps. Zero font glitches.

import React from 'react';
import {
  Document, Page, View, Text, StyleSheet
} from '@react-pdf/renderer';
import { PIQData, FamilyMember, AcademicRecord, NCCDetail, SportRecord, ExtracurricularRecord, InterviewRecord } from '@/services/api';

// ---------------------------------------------------------------------------
// Styles — Rigorously tested for @react-pdf/renderer Yoga Flexbox
// ---------------------------------------------------------------------------
const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 7.5,
    color: '#000000',
    paddingTop: 18,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
  },

  // Headers
  confidentialHeader: {
    textAlign: 'center',
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2,
    marginBottom: 2,
    color: '#000',
  },
  confidentialFooter: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2,
    color: '#000',
  },
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  diprRef: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: '#333',
  },
  oirBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  oirText: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#000',
  },
  oirBox: {
    width: 28,
    height: 14,
    borderWidth: 0.8,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    marginBottom: 1,
    color: '#000',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 7.5,
    marginBottom: 4,
    color: '#444',
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: '#000',
    marginBottom: 5,
  },

  // Question section container
  qBlock: {
    marginBottom: 4,
    display: 'flex',
    flexDirection: 'column',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 2,
    paddingHorizontal: 4,
    marginBottom: 3,
    borderWidth: 0.5,
    borderColor: '#666',
    gap: 4,
  },
  sectionNum: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#000',
    backgroundColor: '#ddd',
    paddingHorizontal: 3,
    paddingVertical: 0.5,
  },
  sectionTitle: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#000',
    textTransform: 'uppercase',
  },

  qSubLabel: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: '#222',
    marginBottom: 2,
    marginTop: 2,
  },

  // Horizontal Row of Fields (each child uses fieldBoxRow)
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 3,
    gap: 4,
  },
  // Field box INSIDE a horizontal row
  fieldBoxRow: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#555',
    padding: 2.5,
    minHeight: 18,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },
  // Field box STANDALONE (full width — NEVER use flex: 1 here)
  fieldBoxFull: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: '#555',
    padding: 2.5,
    minHeight: 18,
    backgroundColor: '#fff',
    marginBottom: 3,
    display: 'flex',
    flexDirection: 'column',
  },
  fieldLabel: {
    fontSize: 5.5,
    fontFamily: 'Helvetica-Bold',
    color: '#444',
    marginBottom: 1,
    textTransform: 'uppercase',
  },
  fieldValue: {
    fontSize: 7,
    fontFamily: 'Helvetica',
    color: '#000',
  },

  // Inline layout for (a) Parents Alive, etc.
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 6,
  },

  // Sub-section container (ensures header text sits ABOVE tables/boxes)
  subContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 3,
  },

  // Tables
  table: {
    borderWidth: 0.5,
    borderColor: '#000',
    marginTop: 1,
    marginBottom: 2,
    display: 'flex',
    flexDirection: 'column',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e6e6e6',
    borderBottomWidth: 0.5,
    borderColor: '#000',
    minHeight: 14,
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: '#888',
    minHeight: 13,
    alignItems: 'center',
  },
  tableCellHeader: {
    padding: 2,
    borderRightWidth: 0.5,
    borderColor: '#000',
    justifyContent: 'center',
  },
  tableCell: {
    padding: 2,
    borderRightWidth: 0.5,
    borderColor: '#888',
    justifyContent: 'center',
  },
  tableHeaderText: {
    fontSize: 5.5,
    fontFamily: 'Helvetica-Bold',
    color: '#000',
    textTransform: 'uppercase',
  },
  tableCellText: {
    fontSize: 6.5,
    fontFamily: 'Helvetica',
    color: '#000',
  },

  // Signature area
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    paddingHorizontal: 12,
  },
  signatureBox: {
    borderTopWidth: 0.5,
    borderColor: '#000',
    paddingTop: 2,
    width: '35%',
    textAlign: 'center',
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: '#222',
  },
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const val = (v: any) => (v !== undefined && v !== null && v !== '') ? String(v) : '—';
const resStr = (r: any) => r && (r.place || r.district || r.state)
  ? `${r.place || ''}${r.district ? ', ' + r.district : ''}${r.state ? ', ' + r.state : ''}${r.population ? ' (Pop: ' + r.population + ')' : ''}`
  : '—';

function QBlock({ num, title }: { num: string; title: string }) {
  return (
    <View style={s.sectionHeader}>
      <Text style={s.sectionNum}>{num}</Text>
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// PIQ PDF Document — Exactly 2 Pages
// ---------------------------------------------------------------------------
export function PIQPDFDocument({ data }: { data: PIQData }) {
  const family = (data.family_members || []) as FamilyMember[];
  const academic = (data.academic_records || []) as AcademicRecord[];
  const nccDetails = (data.ncc_details || []) as NCCDetail[];
  const sports = (data.sports || []) as SportRecord[];
  const extra = (data.extracurricular || []) as ExtracurricularRecord[];
  const interviews = (data.previous_interviews || []) as InterviewRecord[];

  return (
    <Document title="PIQ Form - DIPR 107-A" author={data.full_name || 'Candidate'}>
      {/* ================================================================
          PAGE 1 (Q1 to Q7)
      ================================================================ */}
      <Page size="A4" style={s.page}>
        {/* Header */}
        <Text style={s.confidentialHeader}>CONFIDENTIAL</Text>
        <View style={s.topHeaderRow}>
          <Text style={s.diprRef}>DIPR Questionnaire No. 107-A (Revised)</Text>
          <View style={s.oirBoxContainer}>
            <Text style={s.oirText}>O.I.R.</Text>
            <View style={s.oirBox} />
          </View>
        </View>
        <Text style={s.title}>PERSONAL INFORMATION QUESTIONNAIRE</Text>
        <Text style={s.subtitle}>(To be completed by Candidate in Selection Board)</Text>
        <View style={s.divider} />

        {/* Q1 Administrative */}
        <View style={s.qBlock}>
          <QBlock num="1" title="Administrative Details" />
          <View style={s.fieldRow}>
            <View style={[s.fieldBoxRow, { flex: 1.3 }]}>
              <Text style={s.fieldLabel}>Selection Board (No. & Place)</Text>
              <Text style={s.fieldValue}>{val(data.selection_board)}</Text>
            </View>
            <View style={[s.fieldBoxRow, { flex: 0.9 }]}>
              <Text style={s.fieldLabel}>Batch No.</Text>
              <Text style={s.fieldValue}>{val(data.batch_no)}</Text>
            </View>
            <View style={[s.fieldBoxRow, { flex: 0.9 }]}>
              <Text style={s.fieldLabel}>Chest No.</Text>
              <Text style={s.fieldValue}>{val(data.chest_no)}</Text>
            </View>
            <View style={[s.fieldBoxRow, { flex: 1.1 }]}>
              <Text style={s.fieldLabel}>UPSC / Other Roll No.</Text>
              <Text style={s.fieldValue}>{val(data.upsc_roll_no)}</Text>
            </View>
          </View>
        </View>

        {/* Q2 Name */}
        <View style={s.qBlock}>
          <QBlock num="2" title="Name in CAPITALS (As in Matriculation Certificate)" />
          <View style={s.fieldBoxFull}>
            <Text style={[s.fieldValue, { fontFamily: 'Helvetica-Bold', fontSize: 8 }]}>{val(data.full_name)}</Text>
          </View>
        </View>

        {/* Q3 Father */}
        <View style={s.qBlock}>
          <QBlock num="3" title="Father's Name" />
          <View style={s.fieldBoxFull}>
            <Text style={s.fieldValue}>{val(data.father_name)}</Text>
          </View>
        </View>

        {/* Q4 Residences */}
        <View style={s.qBlock}>
          <QBlock num="4" title="Place of Residence" />
          <View style={s.subContainer}>
            <Text style={s.qSubLabel}>(a) Place of Maximum Residence (Place, District, State with approx population)</Text>
            <View style={s.fieldBoxFull}><Text style={s.fieldValue}>{resStr(data.max_residence)}</Text></View>
          </View>
          <View style={s.subContainer}>
            <Text style={s.qSubLabel}>(b) Place of Parents' Residence (Place, District, State with approx population)</Text>
            <View style={s.fieldBoxFull}><Text style={s.fieldValue}>{resStr(data.parents_residence)}</Text></View>
          </View>
          <View style={s.subContainer}>
            <Text style={s.qSubLabel}>(c) Place of Permanent Residence (Place, District, State with approx population)</Text>
            <View style={s.fieldBoxFull}>
              <Text style={s.fieldValue}>
                {resStr(data.permanent_residence)} {(data.permanent_residence as any)?.is_district_hq ? ' [District HQ: Yes]' : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Q5 Personal details */}
        <View style={s.qBlock}>
          <QBlock num="5" title="Personal Details" />
          <View style={s.fieldRow}>
            <View style={[s.fieldBoxRow, { flex: 1.2 }]}>
              <Text style={s.fieldLabel}>State & District</Text>
              <Text style={s.fieldValue}>{val(data.state_district)}</Text>
            </View>
            <View style={[s.fieldBoxRow, { flex: 0.9 }]}>
              <Text style={s.fieldLabel}>Religion</Text>
              <Text style={s.fieldValue}>{val(data.religion)}</Text>
            </View>
            <View style={[s.fieldBoxRow, { flex: 1 }]}>
              <Text style={s.fieldLabel}>Category</Text>
              <Text style={s.fieldValue}>{val(data.category) === '—' ? 'General' : val(data.category)}</Text>
            </View>
            <View style={[s.fieldBoxRow, { flex: 1 }]}>
              <Text style={s.fieldLabel}>Mother Tongue</Text>
              <Text style={s.fieldValue}>{val(data.mother_tongue)}</Text>
            </View>
            <View style={[s.fieldBoxRow, { flex: 1 }]}>
              <Text style={s.fieldLabel}>Date of Birth</Text>
              <Text style={s.fieldValue}>{val(data.date_of_birth)}</Text>
            </View>
            <View style={[s.fieldBoxRow, { flex: 0.9 }]}>
              <Text style={s.fieldLabel}>Marital Status</Text>
              <Text style={s.fieldValue}>{val(data.marital_status)}</Text>
            </View>
          </View>
        </View>

        {/* Q6 Family */}
        <View style={s.qBlock}>
          <QBlock num="6" title="Family Information" />
          <View style={s.inlineRow}>
            <Text style={s.qSubLabel}>(a) Parents Alive?</Text>
            <Text style={[s.fieldValue, { fontFamily: 'Helvetica-Bold', marginLeft: 4 }]}>
              {data.parents_alive === true ? 'Yes' : data.parents_alive === false ? 'No' : '—'}
            </Text>
            {data.parents_alive === false && (
              <Text style={[s.qSubLabel, { marginLeft: 16 }]}>
                (b) Age at death: Mother: {val(data.mother_death_age)} | Father: {val(data.father_death_age)}
              </Text>
            )}
          </View>

          <View style={s.subContainer}>
            <Text style={s.qSubLabel}>(c) Parents / Guardian & Siblings — Occupation / Income</Text>
            <View style={s.table}>
              <View style={s.tableHeader}>
                <View style={[s.tableCellHeader, { width: '22%' }]}><Text style={s.tableHeaderText}>Relation</Text></View>
                <View style={[s.tableCellHeader, { width: '28%' }]}><Text style={s.tableHeaderText}>Education</Text></View>
                <View style={[s.tableCellHeader, { width: '28%' }]}><Text style={s.tableHeaderText}>Occupation</Text></View>
                <View style={[s.tableCellHeader, { width: '22%', borderRightWidth: 0 }]}><Text style={s.tableHeaderText}>Income (Monthly)</Text></View>
              </View>
              {family.map((m, i) => (
                <View key={i} style={s.tableRow}>
                  <View style={[s.tableCell, { width: '22%' }]}><Text style={[s.tableCellText, { fontFamily: 'Helvetica-Bold' }]}>{m.relation}</Text></View>
                  <View style={[s.tableCell, { width: '28%' }]}><Text style={s.tableCellText}>{val(m.education)}</Text></View>
                  <View style={[s.tableCell, { width: '28%' }]}><Text style={s.tableCellText}>{val(m.occupation)}</Text></View>
                  <View style={[s.tableCell, { width: '22%', borderRightWidth: 0 }]}><Text style={s.tableCellText}>{val(m.income)}</Text></View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Q7 Academic */}
        <View style={s.qBlock}>
          <QBlock num="7" title="Educational Record (from Matriculation / Equivalent)" />
          <View style={s.table}>
            <View style={s.tableHeader}>
              <View style={[s.tableCellHeader, { width: '18%' }]}><Text style={s.tableHeaderText}>Qualification</Text></View>
              <View style={[s.tableCellHeader, { width: '20%' }]}><Text style={s.tableHeaderText}>Institution</Text></View>
              <View style={[s.tableCellHeader, { width: '18%' }]}><Text style={s.tableHeaderText}>Board / University</Text></View>
              <View style={[s.tableCellHeader, { width: '7%' }]}><Text style={s.tableHeaderText}>Year</Text></View>
              <View style={[s.tableCellHeader, { width: '9%' }]}><Text style={s.tableHeaderText}>Div/Marks%</Text></View>
              <View style={[s.tableCellHeader, { width: '9%' }]}><Text style={s.tableHeaderText}>Medium</Text></View>
              <View style={[s.tableCellHeader, { width: '9%' }]}><Text style={s.tableHeaderText}>Boarder/Day</Text></View>
              <View style={[s.tableCellHeader, { width: '10%', borderRightWidth: 0 }]}><Text style={s.tableHeaderText}>Achievement</Text></View>
            </View>
            {academic.map((a, i) => (
              <View key={i} style={s.tableRow}>
                <View style={[s.tableCell, { width: '18%' }]}><Text style={[s.tableCellText, { fontFamily: 'Helvetica-Bold' }]}>{a.qualification}</Text></View>
                <View style={[s.tableCell, { width: '20%' }]}><Text style={s.tableCellText}>{val(a.institution)}</Text></View>
                <View style={[s.tableCell, { width: '18%' }]}><Text style={s.tableCellText}>{val(a.board_university)}</Text></View>
                <View style={[s.tableCell, { width: '7%' }]}><Text style={s.tableCellText}>{val(a.year)}</Text></View>
                <View style={[s.tableCell, { width: '9%' }]}><Text style={s.tableCellText}>{val(a.division_marks)}</Text></View>
                <View style={[s.tableCell, { width: '9%' }]}><Text style={s.tableCellText}>{val(a.medium)}</Text></View>
                <View style={[s.tableCell, { width: '9%' }]}><Text style={s.tableCellText}>{val(a.boarder_day)}</Text></View>
                <View style={[s.tableCell, { width: '10%', borderRightWidth: 0 }]}><Text style={s.tableCellText}>{val(a.achievement)}</Text></View>
              </View>
            ))}
          </View>
        </View>

        {/* Page 1 Footer */}
        <Text style={s.confidentialFooter}>CONFIDENTIAL</Text>
      </Page>

      {/* ================================================================
          PAGE 2 (Q8 to Q14)
      ================================================================ */}
      <Page size="A4" style={s.page}>
        <Text style={s.confidentialHeader}>CONFIDENTIAL</Text>
        <View style={s.divider} />

        {/* Q8 Physical */}
        <View style={s.qBlock}>
          <QBlock num="8" title="Age, Height & Weight" />
          <View style={s.fieldRow}>
            <View style={s.fieldBoxRow}>
              <Text style={s.fieldLabel}>Age (Years)</Text>
              <Text style={s.fieldValue}>{val(data.age_years)}</Text>
            </View>
            <View style={s.fieldBoxRow}>
              <Text style={s.fieldLabel}>Age (Months)</Text>
              <Text style={s.fieldValue}>{val(data.age_months)}</Text>
            </View>
            <View style={s.fieldBoxRow}>
              <Text style={s.fieldLabel}>Height (in Metres)</Text>
              <Text style={s.fieldValue}>{val(data.height)}</Text>
            </View>
            <View style={s.fieldBoxRow}>
              <Text style={s.fieldLabel}>Weight (in Kilograms)</Text>
              <Text style={s.fieldValue}>{val(data.weight)}</Text>
            </View>
          </View>
        </View>

        {/* Q9 Occupation */}
        <View style={s.qBlock}>
          <QBlock num="9" title="Present Occupation and Personal Monthly Income" />
          <View style={s.fieldRow}>
            <View style={[s.fieldBoxRow, { flex: 2 }]}>
              <Text style={s.fieldLabel}>Present Occupation</Text>
              <Text style={s.fieldValue}>{val(data.present_occupation)}</Text>
            </View>
            <View style={[s.fieldBoxRow, { flex: 1 }]}>
              <Text style={s.fieldLabel}>Monthly Income (₹)</Text>
              <Text style={s.fieldValue}>{val(data.monthly_income)}</Text>
            </View>
          </View>
        </View>

        {/* Q10 NCC */}
        <View style={s.qBlock}>
          <QBlock num="10" title="NCC Training" />
          <View style={s.inlineRow}>
            <Text style={s.qSubLabel}>(a) NCC Training:</Text>
            <Text style={[s.fieldValue, { fontFamily: 'Helvetica-Bold', marginLeft: 4 }]}>
              {data.ncc_training === true ? 'Yes' : data.ncc_training === false ? 'No' : '—'}
            </Text>
          </View>
          {data.ncc_training === true && nccDetails.length > 0 && (
            <View style={s.subContainer}>
              <Text style={s.qSubLabel}>(b) Training Details:</Text>
              <View style={s.table}>
                <View style={s.tableHeader}>
                  <View style={[s.tableCellHeader, { width: '25%' }]}><Text style={s.tableHeaderText}>Total Training</Text></View>
                  <View style={[s.tableCellHeader, { width: '20%' }]}><Text style={s.tableHeaderText}>Wing</Text></View>
                  <View style={[s.tableCellHeader, { width: '25%' }]}><Text style={s.tableHeaderText}>Sub-Unit / Division</Text></View>
                  <View style={[s.tableCellHeader, { width: '30%', borderRightWidth: 0 }]}><Text style={s.tableHeaderText}>Certificate Obtained</Text></View>
                </View>
                {nccDetails.map((n, i) => (
                  <View key={i} style={s.tableRow}>
                    <View style={[s.tableCell, { width: '25%' }]}><Text style={s.tableCellText}>{val(n.total_training)}</Text></View>
                    <View style={[s.tableCell, { width: '20%' }]}><Text style={s.tableCellText}>{val(n.wing)}</Text></View>
                    <View style={[s.tableCell, { width: '25%' }]}><Text style={s.tableCellText}>{val(n.sub_unit)}</Text></View>
                    <View style={[s.tableCell, { width: '30%', borderRightWidth: 0 }]}><Text style={s.tableCellText}>{val(n.certificate)}</Text></View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Q11 Sports & Activities */}
        <View style={s.qBlock}>
          <QBlock num="11" title="Participation in Games, Sports & Extra-Curricular" />

          {/* 11a Sports */}
          <View style={s.subContainer}>
            <Text style={s.qSubLabel}>(a) Games & Sports:</Text>
            <View style={s.table}>
              <View style={s.tableHeader}>
                <View style={[s.tableCellHeader, { width: '25%' }]}><Text style={s.tableHeaderText}>Game / Sport</Text></View>
                <View style={[s.tableCellHeader, { width: '20%' }]}><Text style={s.tableHeaderText}>Duration</Text></View>
                <View style={[s.tableCellHeader, { width: '25%' }]}><Text style={s.tableHeaderText}>Represented</Text></View>
                <View style={[s.tableCellHeader, { width: '30%', borderRightWidth: 0 }]}><Text style={s.tableHeaderText}>Achievement</Text></View>
              </View>
              {sports.length > 0 ? sports.map((sp, i) => (
                <View key={i} style={s.tableRow}>
                  <View style={[s.tableCell, { width: '25%' }]}><Text style={s.tableCellText}>{val(sp.game)}</Text></View>
                  <View style={[s.tableCell, { width: '20%' }]}><Text style={s.tableCellText}>{val(sp.duration)}</Text></View>
                  <View style={[s.tableCell, { width: '25%' }]}><Text style={s.tableCellText}>{val(sp.represented)}</Text></View>
                  <View style={[s.tableCell, { width: '30%', borderRightWidth: 0 }]}><Text style={s.tableCellText}>{val(sp.achievement)}</Text></View>
                </View>
              )) : <View style={s.tableRow}><View style={[s.tableCell, { width: '100%', borderRightWidth: 0 }]}><Text style={s.tableCellText}>—</Text></View></View>}
            </View>
          </View>

          {/* 11b Hobbies */}
          <View style={s.subContainer}>
            <Text style={s.qSubLabel}>(b) Hobbies / Interests:</Text>
            <View style={s.fieldBoxFull}><Text style={s.fieldValue}>{val(data.hobbies)}</Text></View>
          </View>

          {/* 11c Extra-curricular */}
          <View style={s.subContainer}>
            <Text style={s.qSubLabel}>(c) Extra-Curricular Activities:</Text>
            <View style={s.table}>
              <View style={s.tableHeader}>
                <View style={[s.tableCellHeader, { width: '35%' }]}><Text style={s.tableHeaderText}>Name of Activity Group</Text></View>
                <View style={[s.tableCellHeader, { width: '25%' }]}><Text style={s.tableHeaderText}>Duration of Participation</Text></View>
                <View style={[s.tableCellHeader, { width: '40%', borderRightWidth: 0 }]}><Text style={s.tableHeaderText}>Outstanding Achievement</Text></View>
              </View>
              {extra.length > 0 ? extra.map((e, i) => (
                <View key={i} style={s.tableRow}>
                  <View style={[s.tableCell, { width: '35%' }]}><Text style={s.tableCellText}>{val(e.activity_group)}</Text></View>
                  <View style={[s.tableCell, { width: '25%' }]}><Text style={s.tableCellText}>{val(e.duration)}</Text></View>
                  <View style={[s.tableCell, { width: '40%', borderRightWidth: 0 }]}><Text style={s.tableCellText}>{val(e.achievement)}</Text></View>
                </View>
              )) : <View style={s.tableRow}><View style={[s.tableCell, { width: '100%', borderRightWidth: 0 }]}><Text style={s.tableCellText}>—</Text></View></View>}
            </View>
          </View>

          {/* 11d Positions */}
          <View style={s.subContainer}>
            <Text style={s.qSubLabel}>(d) Position of Responsibility (NCC / Scouting / Sports / Extra-Curricular):</Text>
            <View style={s.fieldBoxFull}><Text style={s.fieldValue}>{val(data.responsibility_positions)}</Text></View>
          </View>
        </View>

        {/* Q12 Commission */}
        <View style={s.qBlock}>
          <QBlock num="12" title="Nature of Commission & Choice of Service" />
          <View style={s.fieldRow}>
            <View style={[s.fieldBoxRow, { flex: 1 }]}>
              <Text style={s.fieldLabel}>(a) Nature of Commission</Text>
              <Text style={s.fieldValue}>{val(data.nature_of_commission)}</Text>
            </View>
            <View style={[s.fieldBoxRow, { flex: 1 }]}>
              <Text style={s.fieldLabel}>(b) Choice of Service</Text>
              <Text style={s.fieldValue}>{val(data.choice_of_service)}</Text>
            </View>
          </View>
        </View>

        {/* Q13 Attempts */}
        <View style={s.qBlock}>
          <QBlock num="13" title="Number of Chances Availed for Commission in All Three Services" />
          <View style={[s.fieldBoxFull, { maxWidth: 140, marginBottom: 1 }]}>
            <Text style={s.fieldValue}>{val(data.commission_attempts)}</Text>
          </View>
        </View>

        {/* Q14 Previous Interviews */}
        <View style={s.qBlock}>
          <QBlock num="14" title="Details of All Previous Interviews (Army / Navy / Air Force Selection Boards)" />
          <View style={s.table}>
            <View style={s.tableHeader}>
              <View style={[s.tableCellHeader, { width: '6%' }]}><Text style={s.tableHeaderText}>Sl.</Text></View>
              <View style={[s.tableCellHeader, { width: '18%' }]}><Text style={s.tableHeaderText}>Type of Entry</Text></View>
              <View style={[s.tableCellHeader, { width: '22%' }]}><Text style={s.tableHeaderText}>SSB No. & Place</Text></View>
              <View style={[s.tableCellHeader, { width: '24%' }]}><Text style={s.tableHeaderText}>Date / Duration</Text></View>
              <View style={[s.tableCellHeader, { width: '15%' }]}><Text style={s.tableHeaderText}>Chest / Batch</Text></View>
              <View style={[s.tableCellHeader, { width: '15%', borderRightWidth: 0 }]}><Text style={s.tableHeaderText}>Result</Text></View>
            </View>
            {interviews.length > 0 ? interviews.map((iv, i) => (
              <View key={i} style={s.tableRow}>
                <View style={[s.tableCell, { width: '6%' }]}><Text style={[s.tableCellText, { textAlign: 'center' }]}>{val(iv.sl_no ?? i + 1)}</Text></View>
                <View style={[s.tableCell, { width: '18%' }]}><Text style={s.tableCellText}>{val(iv.type_of_entry)}</Text></View>
                <View style={[s.tableCell, { width: '22%' }]}><Text style={s.tableCellText}>{val(iv.ssb_place)}</Text></View>
                <View style={[s.tableCell, { width: '24%' }]}><Text style={s.tableCellText}>{iv.date ? `${iv.date} (+5 Days)` : '—'}</Text></View>
                <View style={[s.tableCell, { width: '15%' }]}><Text style={s.tableCellText}>{val(iv.chest_batch_no)}</Text></View>
                <View style={[s.tableCell, { width: '15%', borderRightWidth: 0 }]}><Text style={s.tableCellText}>{val(iv.result)}</Text></View>
              </View>
            )) : (
              Array(2).fill(null).map((_, i) => (
                <View key={i} style={s.tableRow}>
                  <View style={[s.tableCell, { width: '6%' }]}><Text style={s.tableCellText}> </Text></View>
                  <View style={[s.tableCell, { width: '18%' }]}><Text style={s.tableCellText}> </Text></View>
                  <View style={[s.tableCell, { width: '22%' }]}><Text style={s.tableCellText}> </Text></View>
                  <View style={[s.tableCell, { width: '24%' }]}><Text style={s.tableCellText}> </Text></View>
                  <View style={[s.tableCell, { width: '15%' }]}><Text style={s.tableCellText}> </Text></View>
                  <View style={[s.tableCell, { width: '15%', borderRightWidth: 0 }]}><Text style={s.tableCellText}> </Text></View>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Signature area */}
        <View style={s.signatureRow}>
          <View style={s.signatureBox}>
            <Text>Date</Text>
          </View>
          <View style={s.signatureBox}>
            <Text>Signature of Candidate</Text>
          </View>
        </View>

        {/* Page 2 Footer */}
        <Text style={s.confidentialFooter}>CONFIDENTIAL</Text>
      </Page>
    </Document>
  );
}
