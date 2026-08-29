import { SourceRef } from './types';

// =============================================================================
// Official Source Registry
// Source hierarchy: Tier 1 = Official notification > Tier 2 = Official career
// pages > Tier 3 = Historical notification archive > Tier 4 = Secondary only
// for discovery, never for rule authority.
// =============================================================================

export const SOURCES: Record<string, SourceRef> = {
  // ---------------------------------------------------------------------------
  // UPSC
  // ---------------------------------------------------------------------------
  UPSC_NDA_I_2026: {
    title: 'UPSC NDA & NA (I) Examination 2026 Notification',
    url: 'https://upsc.gov.in/examinations/nda-na-i-2026',
    notificationName: 'NDA NA I 2026',
    notificationDate: '2026-01-08',
    lastVerified: '2026-08',
  },
  UPSC_NDA_II_2026: {
    title: 'UPSC NDA & NA (II) Examination 2026 Notification',
    url: 'https://upsc.gov.in/examinations/nda-na-ii-2026',
    notificationName: 'NDA NA II 2026',
    notificationDate: '2026-05-28',
    lastVerified: '2026-08',
  },
  UPSC_CDS_I_2026: {
    title: 'UPSC CDS (I) Examination 2026 Notification',
    url: 'https://upsc.gov.in/examinations/cds-i-2026',
    notificationName: 'CDS I 2026',
    notificationDate: '2026-01-08',
    lastVerified: '2026-08',
  },
  UPSC_CDS_II_2026: {
    title: 'UPSC CDS (II) Examination 2026 Notification',
    url: 'https://upsc.gov.in/examinations/cds-ii-2026',
    notificationName: 'CDS II 2026',
    notificationDate: '2026-05-28',
    lastVerified: '2026-08',
  },

  // ---------------------------------------------------------------------------
  // Indian Army
  // ---------------------------------------------------------------------------
  ARMY_SSC_TECH_67: {
    title: 'Indian Army SSC Technical 67th Course Notification',
    url: 'https://joinindianarmy.nic.in/',
    notificationName: 'SSC Tech 67',
    lastVerified: '2026-08',
  },
  ARMY_SSCW_TECH: {
    title: 'Indian Army SSCW Technical Women Entry Notification',
    url: 'https://joinindianarmy.nic.in/',
    notificationName: 'SSCW Tech',
    lastVerified: '2026-08',
  },
  ARMY_TGC: {
    title: 'Indian Army TGC Notification — joinindianarmy.nic.in',
    url: 'https://joinindianarmy.nic.in/',
    lastVerified: '2026-08',
  },
  ARMY_TES: {
    title: 'Indian Army Technical Entry Scheme (TES) Notification',
    url: 'https://joinindianarmy.nic.in/',
    lastVerified: '2026-08',
  },
  ARMY_JAG: {
    title: 'Indian Army JAG Entry Notification',
    url: 'https://joinindianarmy.nic.in/',
    lastVerified: '2026-08',
  },
  ARMY_NCC: {
    title: 'Indian Army NCC Special Entry Notification',
    url: 'https://joinindianarmy.nic.in/',
    lastVerified: '2026-08',
  },
  ARMY_ACC: {
    title: 'Army Cadet College (ACC) Entry — Official Rules',
    url: 'https://joinindianarmy.nic.in/',
    lastVerified: '2026-08',
  },
  ARMY_SCO: {
    title: 'Special Commissioned Officer (SCO) Scheme — Indian Army',
    url: 'https://joinindianarmy.nic.in/',
    lastVerified: '2026-08',
  },

  // ---------------------------------------------------------------------------
  // Indian Navy
  // ---------------------------------------------------------------------------
  NAVY_10_2_BTECH_2026: {
    title: 'Indian Navy 10+2 B.Tech Cadet Entry 2026 Official Notification',
    url: 'https://www.joinindiannavy.gov.in/',
    notificationDate: '2026-04',
    lastVerified: '2026-08',
  },
  NAVY_SSC_2026: {
    title: 'Indian Navy SSC Officer Entry Notification 2026',
    url: 'https://www.joinindiannavy.gov.in/',
    lastVerified: '2026-08',
  },
  NAVY_SSC_IT_2026: {
    title: 'Indian Navy SSC IT Officer Entry 2026 — NDTV / Official Notification',
    url: 'https://www.joinindiannavy.gov.in/',
    notificationDate: '2026-05',
    lastVerified: '2026-08',
  },
  NAVY_NCC: {
    title: 'Indian Navy NCC Special Entry Notification',
    url: 'https://www.joinindiannavy.gov.in/',
    lastVerified: '2026-08',
  },

  // ---------------------------------------------------------------------------
  // Indian Air Force
  // ---------------------------------------------------------------------------
  IAF_AFCAT_01_2026: {
    title: 'AFCAT 01/2026 Official Notification — IAF',
    url: 'https://afcat.cdac.in/',
    notificationName: 'AFCAT 01/2026',
    notificationDate: '2026-06-07',
    paragraph: 'Para 5.2.1 (Age & DOB), Para 5.3 (Education), Para 5.5 (CPSS)',
    lastVerified: '2026-08',
  },
  IAF_AFCAT_02_2026: {
    title: 'AFCAT 02/2026 — Expected December 2026 notification (not yet released)',
    url: 'https://afcat.cdac.in/',
    lastVerified: '2026-08',
  },
  IAF_NCC_FLYING: {
    title: 'IAF NCC Special Entry Flying — Official Notification',
    url: 'https://indianairforce.nic.in/content/officer-selection',
    lastVerified: '2026-08',
  },
  IAF_GATE: {
    title: 'IAF GATE Technical Entry — Official Notification',
    url: 'https://indianairforce.nic.in/',
    lastVerified: '2026-08',
  },

  // ---------------------------------------------------------------------------
  // Indian Coast Guard
  // ---------------------------------------------------------------------------
  ICGR_AC_2026: {
    title: 'Indian Coast Guard Assistant Commandant Recruitment 2026',
    url: 'https://joinindiancoastguard.cdac.in/',
    lastVerified: '2026-08',
  },

  // ---------------------------------------------------------------------------
  // Secondary / Discovery only (NEVER used as rule authority)
  // ---------------------------------------------------------------------------
  SC_NDA_WOMEN_2021: {
    title: 'Supreme Court of India — Writ Petition ordering NDA open to women, September 2021',
    url: 'https://main.sci.gov.in/',
    notificationDate: '2021-09-08',
    lastVerified: '2026-08',
  },
};
