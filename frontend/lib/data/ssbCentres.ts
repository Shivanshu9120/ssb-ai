export type ServiceType = 'Air Force' | 'Army' | 'Navy' | 'Coast Guard';

export type AccommodationBadge = 
  | 'Closest' 
  | 'Budget' 
  | 'Recommended' 
  | 'Women Friendly' 
  | 'Free' 
  | 'Call before booking';

export interface SSBBoard {
  id: string;
  name: string;
  code?: string;
  description?: string;
}

export interface Accommodation {
  id: string;
  name: string;
  price?: number; // numerically for filtering e.g. 1000
  priceMax?: number; // range max e.g. 600 for 500-600
  priceUnit?: string; // 'person' | 'room' | 'night' | '2 persons'
  priceNotes?: string; // e.g. "₹500–600/person", "Pricing unavailable", "Free of cost"
  distance: string; // e.g. "~10 m", "~800 m", "~1.5 km"
  distanceMeters: number; // for numeric sorting & filtering
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  verified: boolean;
  lastUpdated?: string;
  notes?: string;
  badges?: AccommodationBadge[];
}

export interface SSBCentre {
  id: string;
  service: ServiceType;
  centre: string; // e.g. "1 AFSB", "Selection Centre East"
  centreCode: string; // e.g. "1 AFSB", "SCE Prayagraj"
  city: string; // e.g. "Dehradun", "Prayagraj (Allahabad)"
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  googleMapsUrl?: string;
  reportingNotes?: string;
  boards: SSBBoard[];
  stays: Accommodation[];
}

export const SSB_CENTRES: SSBCentre[] = [
  // ================= AIR FORCE (5 AFSBs) =================
  {
    id: '1-afsb-dehradun',
    service: 'Air Force',
    centre: '1 AFSB — Dehradun',
    centreCode: '1 AFSB',
    city: 'Dehradun',
    state: 'Uttarakhand',
    coordinates: { lat: 30.3244, lng: 78.0417 },
    googleMapsUrl: 'https://maps.google.com/?q=1+AFSB+Dehradun+Clement+Town',
    reportingNotes: 'Reporting gate located at Clement Town Air Force Station, Dehradun. Candidates arrive at Dehradun Railway Station or ISBT.',
    boards: [
      { id: '1-afsb-b1', name: '1 AFSB Board 1', code: '1 AFSB' }
    ],
    stays: [
      {
        id: '1afsb-stay-1',
        name: 'Dolphin Guest House',
        price: 1000,
        priceUnit: 'person',
        priceNotes: '₹1,000/person',
        distance: '~10 m from AFSB',
        distanceMeters: 10,
        googleMapsUrl: 'https://maps.google.com/?q=Dolphin+Guest+House+Clement+Town+Dehradun',
        verified: true,
        badges: ['Closest', 'Recommended'],
        notes: 'Located directly opposite to 1 AFSB gate. Extremely convenient for early morning reporting.'
      },
      {
        id: '1afsb-stay-2',
        name: 'Doon Valley Homestay',
        priceNotes: 'Pricing unavailable',
        distance: '~300 m from AFSB',
        distanceMeters: 300,
        googleMapsUrl: 'https://maps.google.com/?q=Doon+Valley+Homestay+Clement+Town+Dehradun',
        verified: false,
        notes: 'Approximate location near Clement Town market.'
      },
      {
        id: '1afsb-stay-3',
        name: 'Aman Guest House',
        price: 500,
        priceMax: 600,
        priceUnit: 'person',
        priceNotes: '₹500–600/person',
        distance: '~400 m from AFSB',
        distanceMeters: 400,
        googleMapsUrl: 'https://maps.google.com/?q=Aman+Guest+House+Clement+Town+Dehradun',
        verified: true,
        badges: ['Budget'],
        notes: 'Clean rooms with basic amenities for candidates.'
      },
      {
        id: '1afsb-stay-4',
        name: 'Morning Star Guest House',
        priceNotes: 'Pricing unavailable',
        distance: '~500 m from AFSB',
        distanceMeters: 500,
        googleMapsUrl: 'https://maps.google.com/?q=Morning+Star+Guest+House+Dehradun',
        verified: false,
        notes: 'Near Clement Town main road.'
      },
      {
        id: '1afsb-stay-5',
        name: 'Shree Guest House',
        price: 600,
        priceUnit: 'person',
        priceNotes: 'Approximate ₹600/person',
        distance: '~200 m from centre',
        distanceMeters: 200,
        googleMapsUrl: 'https://maps.google.com/?q=Shree+Guest+House+Clement+Town+Dehradun',
        verified: true,
        badges: ['Closest', 'Budget'],
        notes: 'Short walking distance from reporting gate.'
      },
      {
        id: '1afsb-stay-6',
        name: 'GMVN Guest House',
        price: 400,
        priceMax: 600,
        priceUnit: 'person',
        priceNotes: '₹400–600/person',
        distance: '~1 km from AFSB',
        distanceMeters: 1000,
        googleMapsUrl: 'https://maps.google.com/?q=GMVN+Tourist+Rest+House+Dehradun',
        verified: true,
        badges: ['Budget', 'Recommended'],
        notes: 'Government tourism guest house with safe environment and dining facilities.'
      }
    ]
  },
  {
    id: '2-afsb-mysore',
    service: 'Air Force',
    centre: '2 AFSB — Mysore',
    centreCode: '2 AFSB',
    city: 'Mysore',
    state: 'Karnataka',
    coordinates: { lat: 12.3051, lng: 76.6551 },
    googleMapsUrl: 'https://maps.google.com/?q=2+AFSB+Mysore+Air+Force+Selection+Board',
    reportingNotes: 'Reporting gate near Mysore Junction Railway Station / Air Force Station Sidhartha Layout.',
    boards: [
      { id: '2-afsb-b1', name: '2 AFSB Board', code: '2 AFSB' }
    ],
    stays: [
      {
        id: '2afsb-stay-1',
        name: 'Ginger Mysore',
        price: 1400,
        priceUnit: 'room',
        priceNotes: '₹1,400–1,800/room',
        distance: '~800 m from AFSB',
        distanceMeters: 800,
        googleMapsUrl: 'https://maps.google.com/?q=Ginger+Hotel+Mysore',
        verified: true,
        badges: ['Recommended', 'Women Friendly'],
        notes: 'Premium budget hotel with modern facilities, gym, and in-house dining.'
      },
      {
        id: '2afsb-stay-2',
        name: 'Shreyas Residency',
        price: 650,
        priceUnit: 'person',
        priceNotes: '₹650/person',
        distance: '~1.3 km from AFSB',
        distanceMeters: 1300,
        googleMapsUrl: 'https://maps.google.com/?q=Shreyas+Residency+Mysore',
        verified: true,
        badges: ['Budget'],
        notes: 'Popular choice for SSB candidates. Clean rooms with hot water.'
      },
      {
        id: '2afsb-stay-3',
        name: 'San En Suites',
        priceNotes: 'Pricing unavailable',
        distance: '~1.5 km from AFSB',
        distanceMeters: 1500,
        googleMapsUrl: 'https://maps.google.com/?q=San+En+Suites+Mysore',
        verified: false,
        notes: 'Serviced apartment style accommodation.'
      },
      {
        id: '2afsb-stay-4',
        name: 'Sai Comfort Inn',
        price: 500,
        priceMax: 700,
        priceUnit: 'person',
        priceNotes: 'Approximately ₹500–700/person',
        distance: '~1 km from AFSB',
        distanceMeters: 1000,
        googleMapsUrl: 'https://maps.google.com/?q=Sai+Comfort+Inn+Mysore',
        verified: true,
        badges: ['Budget'],
        notes: 'Comfortable lodge near main road with auto rickshaws readily available.'
      }
    ]
  },
  {
    id: '3-afsb-gandhinagar',
    service: 'Air Force',
    centre: '3 AFSB — Gandhinagar',
    centreCode: '3 AFSB',
    city: 'Gandhinagar',
    state: 'Gujarat',
    coordinates: { lat: 23.2156, lng: 72.6369 },
    googleMapsUrl: 'https://maps.google.com/?q=3+AFSB+Gandhinagar+Air+Force+Station',
    reportingNotes: 'Reporting gate near Air Force Station Sector 9 / Sector 11 Gandhinagar.',
    boards: [
      { id: '3-afsb-b1', name: '3 AFSB Board', code: '3 AFSB' }
    ],
    stays: [
      {
        id: '3afsb-stay-1',
        name: 'Kadva Patidar Samaj Dharamshala',
        price: 250,
        priceUnit: 'person',
        priceNotes: '₹250/person (Approx)',
        distance: 'Near reporting gate',
        distanceMeters: 150,
        googleMapsUrl: 'https://maps.google.com/?q=Kadva+Patidar+Samaj+Gandhinagar',
        verified: true,
        badges: ['Closest', 'Budget', 'Recommended'],
        notes: 'Very close to reporting gate. Extremely economical with hygienic atmosphere.'
      },
      {
        id: '3afsb-stay-2',
        name: 'Hotel Downtown',
        priceNotes: 'Pricing unavailable',
        distance: '~1 km from AFSB',
        distanceMeters: 1000,
        googleMapsUrl: 'https://maps.google.com/?q=Hotel+Downtown+Gandhinagar',
        verified: false,
        notes: 'Located in Sector 11 commercial area.'
      },
      {
        id: '3afsb-stay-3',
        name: 'Hotel President',
        priceNotes: 'Pricing unavailable',
        distance: '~1.2 km from AFSB',
        distanceMeters: 1200,
        googleMapsUrl: 'https://maps.google.com/?q=Hotel+President+Gandhinagar',
        verified: false,
        notes: 'Near Gandhinagar bus terminus.'
      },
      {
        id: '3afsb-stay-4',
        name: 'Umiya Mata Temple Dharamshala',
        price: 700,
        priceUnit: 'room for 3',
        priceNotes: '₹700/room for 3 persons',
        distance: '~800 m from AFSB',
        distanceMeters: 800,
        googleMapsUrl: 'https://maps.google.com/?q=Umiya+Mata+Temple+Gandhinagar',
        verified: true,
        badges: ['Budget', 'Recommended'],
        notes: 'Great value group room booking for 3 candidates.'
      },
      {
        id: '3afsb-stay-5',
        name: 'Youth Hostel Gandhinagar',
        price: 135,
        priceUnit: 'person',
        priceNotes: '₹135/person',
        distance: '~1.8 km from AFSB',
        distanceMeters: 1800,
        googleMapsUrl: 'https://maps.google.com/?q=Youth+Hostel+Gandhinagar',
        verified: true,
        badges: ['Budget', 'Free'],
        notes: 'Government Youth Hostel dormitory rates. YHAI membership discount available.'
      },
      {
        id: '3afsb-stay-6',
        name: 'Gujarat Tourism Guest House',
        price: 300,
        priceMax: 500,
        priceUnit: 'person',
        priceNotes: 'Approximately ₹300–500/person',
        distance: '~1.5 km from AFSB',
        distanceMeters: 1500,
        googleMapsUrl: 'https://maps.google.com/?q=Toran+Gujarat+Tourism+Gandhinagar',
        verified: true,
        badges: ['Budget', 'Recommended'],
        notes: 'Safe and peaceful state tourism accommodation.'
      }
    ]
  },
  {
    id: '4-afsb-varanasi',
    service: 'Air Force',
    centre: '4 AFSB — Varanasi',
    centreCode: '4 AFSB',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    coordinates: { lat: 25.3176, lng: 82.9739 },
    googleMapsUrl: 'https://maps.google.com/?q=4+AFSB+Varanasi+Cantt',
    reportingNotes: 'Reporting gate near Varanasi Junction (BSB) Railway Station Cantt area.',
    boards: [
      { id: '4-afsb-b1', name: '4 AFSB Board', code: '4 AFSB' }
    ],
    stays: [
      {
        id: '4afsb-stay-1',
        name: 'Om Inn Hotel Residency',
        price: 700,
        priceUnit: 'person',
        priceNotes: '₹700/person',
        distance: '~500 m from AFSB',
        distanceMeters: 500,
        googleMapsUrl: 'https://maps.google.com/?q=Om+Inn+Hotel+Varanasi+Cantt',
        verified: true,
        badges: ['Closest', 'Recommended'],
        notes: 'Located in Cantt area close to reporting gate.'
      },
      {
        id: '4afsb-stay-2',
        name: 'IRCTC Dormitory (Varanasi Cantt Station)',
        price: 250,
        priceUnit: 'person',
        priceNotes: 'Advance booking recommended',
        distance: '~300 m from AFSB',
        distanceMeters: 300,
        googleMapsUrl: 'https://maps.google.com/?q=Varanasi+Junction+Railway+Station',
        verified: true,
        badges: ['Closest', 'Budget', 'Call before booking'],
        notes: 'Book via IRCTC Tourism portal using train ticket. Very clean AC dorms.'
      },
      {
        id: '4afsb-stay-3',
        name: 'Hotel Kashi',
        priceNotes: 'Pricing unavailable',
        distance: '~1 km from AFSB',
        distanceMeters: 1000,
        googleMapsUrl: 'https://maps.google.com/?q=Hotel+Kashi+Varanasi+Cantt',
        verified: false,
        notes: 'Located on Station Road Varanasi.'
      },
      {
        id: '4afsb-stay-4',
        name: 'Bhadaini Ghat Guest House',
        price: 300,
        priceMax: 400,
        priceUnit: 'person',
        priceNotes: 'Approximately ₹300–400/person',
        distance: '~2 km from AFSB',
        distanceMeters: 2000,
        googleMapsUrl: 'https://maps.google.com/?q=Bhadaini+Ghat+Varanasi',
        verified: true,
        badges: ['Budget'],
        notes: 'Budget guesthouse near ghats.'
      }
    ]
  },
  {
    id: '5-afsb-guwahati',
    service: 'Air Force',
    centre: '5 AFSB — Guwahati',
    centreCode: '5 AFSB',
    city: 'Guwahati',
    state: 'Assam',
    coordinates: { lat: 26.1445, lng: 91.7362 },
    googleMapsUrl: 'https://maps.google.com/?q=5+AFSB+Mountain+Shadow+Guwahati',
    reportingNotes: 'Reporting gate near Air Force Station Borjhar / Mountain Shadow, Guwahati.',
    boards: [
      { id: '5-afsb-b1', name: '5 AFSB Board', code: '5 AFSB' }
    ],
    stays: [
      {
        id: '5afsb-stay-1',
        name: 'Royal Arunachal Guest House',
        priceNotes: 'Pricing unavailable',
        distance: '~700 m from AFSB',
        distanceMeters: 700,
        googleMapsUrl: 'https://maps.google.com/?q=Royal+Arunachal+Guest+House+Guwahati',
        verified: false,
        notes: 'Near Borjhar area.'
      },
      {
        id: '5afsb-stay-2',
        name: 'Sarita F Sahani House',
        price: 300,
        priceUnit: 'person',
        priceNotes: '₹300/person',
        distance: '~500 m from AFSB',
        distanceMeters: 500,
        googleMapsUrl: 'https://maps.google.com/?q=Borjhar+Guwahati+Guest+House',
        verified: true,
        badges: ['Closest', 'Budget', 'Recommended'],
        notes: 'Economical homestay preferred by SSB candidates.'
      },
      {
        id: '5afsb-stay-3',
        name: 'Assam Tourism Guest House (Prashanti Tourist Lodge)',
        price: 400,
        priceMax: 600,
        priceUnit: 'person',
        priceNotes: 'Approximately ₹400–600/person',
        distance: '~2 km from AFSB',
        distanceMeters: 2000,
        googleMapsUrl: 'https://maps.google.com/?q=Prashanti+Tourist+Lodge+Guwahati',
        verified: true,
        badges: ['Budget', 'Recommended'],
        notes: 'State government tourist lodge with dining facilities.'
      }
    ]
  },

  // ================= ARMY (Selection Centres) =================
  {
    id: 'army-sce-prayagraj',
    service: 'Army',
    centre: 'Selection Centre East — Prayagraj (Allahabad)',
    centreCode: 'SCE Prayagraj',
    city: 'Prayagraj (Allahabad)',
    state: 'Uttar Pradesh',
    coordinates: { lat: 25.4358, lng: 81.8463 },
    googleMapsUrl: 'https://maps.google.com/?q=Selection+Centre+East+Prayagraj+Allahabad',
    reportingNotes: 'Movement Control Office (MCO) at Prayagraj Junction Railway Station Platform No. 1. Reporting bus provided by Selection Centre.',
    boards: [
      { id: '11-ssb', name: '11 SSB', code: '11 SSB', description: 'Army Selection Board' },
      { id: '14-ssb', name: '14 SSB', code: '14 SSB', description: 'Army Selection Board' },
      { id: '18-ssb', name: '18 SSB', code: '18 SSB', description: 'Army Selection Board' },
      { id: '19-ssb', name: '19 SSB', code: '19 SSB', description: 'Army Selection Board' },
      { id: '34-ssb', name: '34 SSB', code: '34 SSB', description: 'Army Selection Board' }
    ],
    stays: [
      {
        id: 'sce-prayagraj-stay-1',
        name: 'SSB Dormitory (Ex-Army Officer Managed)',
        price: 1000,
        priceUnit: 'night',
        priceNotes: '₹1,000/night',
        distance: '~1 km from SCE',
        distanceMeters: 1000,
        googleMapsUrl: 'https://maps.google.com/?q=SSB+Dormitory+Prayagraj',
        verified: true,
        badges: ['Recommended', 'Closest'],
        notes: 'Managed by an ex-Army officer. Includes free morning drop facility directly to reporting gate/MCO.'
      },
      {
        id: 'sce-prayagraj-stay-2',
        name: 'Dharmshala Inside SSB Campus',
        price: 200,
        priceUnit: 'person',
        priceNotes: '₹200/person',
        distance: '~600 m from SSB',
        distanceMeters: 600,
        googleMapsUrl: 'https://maps.google.com/?q=Selection+Centre+East+Prayagraj',
        verified: true,
        badges: ['Closest', 'Budget', 'Call before booking'],
        notes: 'Call letter mandatory before check-in. Strict security entry.'
      },
      {
        id: 'sce-prayagraj-stay-3',
        name: 'Hotel Veenit',
        price: 250,
        priceUnit: 'person',
        priceNotes: '₹250/person',
        distance: '~1.2 km from SCE',
        distanceMeters: 1200,
        googleMapsUrl: 'https://maps.google.com/?q=Hotel+Veenit+Prayagraj',
        verified: true,
        badges: ['Budget'],
        notes: 'Budget lodging option near station road.'
      }
    ]
  },
  {
    id: 'army-scs-bhopal',
    service: 'Army',
    centre: 'Selection Centre Central — Bhopal',
    centreCode: 'SCC Bhopal',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    coordinates: { lat: 23.2599, lng: 77.4126 },
    googleMapsUrl: 'https://maps.google.com/?q=Selection+Centre+Central+Sultania+Infantry+Lines+Bhopal',
    reportingNotes: 'Sultania Infantry Lines, Bhopal. Reporting MCO at Bhopal Junction Railway Station.',
    boards: [
      { id: '20-ssb', name: '20 SSB', code: '20 SSB' },
      { id: '21-ssb', name: '21 SSB', code: '21 SSB' },
      { id: '22-ssb', name: '22 SSB', code: '22 SSB' },
      { id: '23-ssb', name: '23 SSB', code: '23 SSB' }
    ],
    stays: [
      {
        id: 'scc-bhopal-stay-1',
        name: 'Jain Dharmshala Bhopal',
        price: 200,
        priceUnit: 'person',
        priceNotes: '₹200/person',
        distance: '~800 m from centre',
        distanceMeters: 800,
        googleMapsUrl: 'https://maps.google.com/?q=Jain+Dharamshala+Bhopal',
        verified: true,
        badges: ['Closest', 'Budget', 'Recommended'],
        notes: 'Popular candidate dormitory. Peaceful atmosphere near Sultania lines.'
      },
      {
        id: 'scc-bhopal-stay-2',
        name: 'Gufa Mandir Dharamshala',
        price: 50,
        priceUnit: 'person',
        priceNotes: 'Dinner approx ₹50',
        distance: 'Opposite centre',
        distanceMeters: 200,
        googleMapsUrl: 'https://maps.google.com/?q=Gufa+Mandir+Bhopal',
        verified: true,
        badges: ['Closest', 'Budget', 'Free'],
        notes: 'Located directly opposite to reporting area. Dinner available at approximate ₹50.'
      }
    ]
  },
  {
    id: 'army-scn-kapurthala',
    service: 'Army',
    centre: 'Selection Centre North — Kapurthala',
    centreCode: 'SCN Kapurthala',
    city: 'Kapurthala',
    state: 'Punjab',
    coordinates: { lat: 31.3802, lng: 75.3815 },
    googleMapsUrl: 'https://maps.google.com/?q=Selection+Centre+North+Kapurthala',
    reportingNotes: 'Reporting gate at Kapurthala Cantt. Candidates arrive at Kapurthala / Jalandhar City station.',
    boards: [
      { id: '31-ssb', name: '31 SSB', code: '31 SSB' },
      { id: '32-ssb', name: '32 SSB', code: '32 SSB' }
    ],
    stays: [
      {
        id: 'scn-kap-stay-1',
        name: 'Sainik Rest House Kapurthala',
        price: 150,
        priceUnit: 'person',
        priceNotes: '₹150/person',
        distance: '~1 km from centre',
        distanceMeters: 1000,
        googleMapsUrl: 'https://maps.google.com/?q=Sainik+Rest+House+Kapurthala',
        verified: true,
        badges: ['Budget', 'Recommended'],
        notes: 'Official Sainik rest house for defense aspirants and ex-servicemen dependents.'
      },
      {
        id: 'scn-kap-stay-2',
        name: 'Gurudwara Sahib Accommodation',
        price: 0,
        priceUnit: 'person',
        priceNotes: 'Free of cost',
        distance: '~800 m from centre',
        distanceMeters: 800,
        googleMapsUrl: 'https://maps.google.com/?q=Gurudwara+Kapurthala',
        verified: true,
        badges: ['Closest', 'Free', 'Recommended'],
        notes: 'Free of cost stay with clean facilities and Langar meal service.'
      },
      {
        id: 'scn-kap-stay-3',
        name: 'Sanatan Dharmshala',
        price: 200,
        priceUnit: 'day',
        priceNotes: '₹200/day',
        distance: 'Near reporting place',
        distanceMeters: 300,
        googleMapsUrl: 'https://maps.google.com/?q=Sanatan+Dharmshala+Kapurthala',
        verified: true,
        badges: ['Closest', 'Budget'],
        notes: 'Located very close to reporting gate.'
      }
    ]
  },
  {
    id: 'army-scs-bengaluru',
    service: 'Army',
    centre: 'Selection Centre South — Bengaluru',
    centreCode: 'SCS Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    googleMapsUrl: 'https://maps.google.com/?q=Selection+Centre+South+Cubbon+Road+Bengaluru',
    reportingNotes: 'Cubbon Road, Bengaluru Cantt. MCO at Bangalore City / Cantt station.',
    boards: [
      { id: '12-ssb', name: '12 SSB', code: '12 SSB' },
      { id: '24-ssb', name: '24 SSB', code: '24 SSB' }
    ],
    stays: [
      {
        id: 'scs-blr-stay-1',
        name: 'OYO 4558 Hotel',
        price: 1200,
        priceUnit: 'for 2',
        priceNotes: '₹1,200 for 2 persons',
        distance: '~1.2 km from centre',
        distanceMeters: 1200,
        googleMapsUrl: 'https://maps.google.com/?q=OYO+Rooms+Cubbon+Road+Bengaluru',
        verified: true,
        badges: ['Recommended'],
        notes: 'Good choice for candidates traveling in pairs.'
      },
      {
        id: 'scs-blr-stay-2',
        name: 'Local Uptown Stay',
        price: 800,
        priceUnit: 'person',
        priceNotes: '₹800/person (Approx)',
        distance: '~2 km from centre',
        distanceMeters: 2000,
        googleMapsUrl: 'https://maps.google.com/?q=Local+Uptown+PG+Bengaluru',
        verified: true,
        badges: ['Women Friendly', 'Recommended'],
        notes: 'Special facilities and secure environment for women candidates.'
      },
      {
        id: 'scs-blr-stay-3',
        name: 'Sainik Aram Ghar Bengaluru',
        price: 150,
        priceUnit: 'person',
        priceNotes: '₹150/person',
        distance: '~1.5 km from centre',
        distanceMeters: 1500,
        googleMapsUrl: 'https://maps.google.com/?q=Sainik+Aram+Ghar+Bengaluru',
        verified: true,
        badges: ['Budget', 'Call before booking'],
        notes: 'For children/dependents of ex-servicemen or serving personnel. Valid ID required.'
      }
    ]
  },
  {
    id: 'army-scn-jalandhar',
    service: 'Army',
    centre: 'Selection Centre North — Jalandhar',
    centreCode: 'SCN Jalandhar',
    city: 'Jalandhar',
    state: 'Punjab',
    coordinates: { lat: 31.3260, lng: 75.5762 },
    googleMapsUrl: 'https://maps.google.com/?q=Selection+Centre+North+Jalandhar+Cantt',
    reportingNotes: 'Jalandhar Cantt Railway Station MCO.',
    boards: [
      { id: '33-ssb-army', name: '33 SSB (Army)', code: '33 SSB' }
    ],
    stays: [
      {
        id: 'scn-jal-stay-1',
        name: 'Sainik Rest House Jalandhar Cantt',
        price: 150,
        priceUnit: 'person',
        priceNotes: '₹150/person',
        distance: '~1 km from centre',
        distanceMeters: 1000,
        googleMapsUrl: 'https://maps.google.com/?q=Sainik+Rest+House+Jalandhar+Cantt',
        verified: true,
        badges: ['Budget', 'Recommended'],
        notes: 'Safe military rest house near Jalandhar Cantt station.'
      },
      {
        id: 'scn-jal-stay-2',
        name: 'Hotel Green Park Jalandhar',
        price: 500,
        priceMax: 700,
        priceUnit: 'person',
        priceNotes: '₹500–700/person',
        distance: '~1.5 km from centre',
        distanceMeters: 1500,
        googleMapsUrl: 'https://maps.google.com/?q=Hotel+Green+Park+Jalandhar',
        verified: true,
        badges: ['Budget'],
        notes: 'Comfortable lodge near Cantt railway station.'
      }
    ]
  },

  // ================= NAVY (5 Functional Naval SSB Boards / Locations) =================
  {
    id: 'navy-12-ssb-bengaluru',
    service: 'Navy',
    centre: '12 SSB — Bengaluru',
    centreCode: '12 SSB',
    city: 'Bengaluru',
    state: 'Karnataka',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    googleMapsUrl: 'https://maps.google.com/?q=Selection+Centre+South+Cubbon+Road+Bengaluru',
    reportingNotes: 'Naval Selection Board (12 SSB) operating at Selection Centre South (SCS), Cubbon Road, Bengaluru. Candidates report at Bangalore City / Cantt railway station MCO.',
    boards: [
      { id: '12-ssb-navy-board', name: '12 SSB (Naval Board)', code: '12 SSB', description: 'Navy Selection Board at SCS Bengaluru' }
    ],
    stays: [
      {
        id: '12ssb-blr-stay-1',
        name: 'OYO 4558 Hotel',
        price: 1200,
        priceUnit: 'for 2',
        priceNotes: '₹1,200 for 2 persons',
        distance: '~1.2 km from centre',
        distanceMeters: 1200,
        googleMapsUrl: 'https://maps.google.com/?q=OYO+Rooms+Cubbon+Road+Bengaluru',
        verified: true,
        badges: ['Recommended'],
        notes: 'Good choice for candidates traveling in pairs near Cubbon Road.'
      },
      {
        id: '12ssb-blr-stay-2',
        name: 'Local Uptown Stay',
        price: 800,
        priceUnit: 'person',
        priceNotes: '₹800/person (Approx)',
        distance: '~2 km from centre',
        distanceMeters: 2000,
        googleMapsUrl: 'https://maps.google.com/?q=Local+Uptown+PG+Bengaluru',
        verified: true,
        badges: ['Women Friendly', 'Recommended'],
        notes: 'Special facilities and secure environment for women candidates.'
      },
      {
        id: '12ssb-blr-stay-3',
        name: 'Sainik Aram Ghar Bengaluru',
        price: 150,
        priceUnit: 'person',
        priceNotes: '₹150/person',
        distance: '~1.5 km from centre',
        distanceMeters: 1500,
        googleMapsUrl: 'https://maps.google.com/?q=Sainik+Aram+Ghar+Bengaluru',
        verified: true,
        badges: ['Budget', 'Call before booking'],
        notes: 'For children/dependents of ex-servicemen or serving defence personnel.'
      }
    ]
  },
  {
    id: 'navy-33-ssb-bhopal',
    service: 'Navy',
    centre: '33 SSB — Bhopal',
    centreCode: '33 SSB',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    coordinates: { lat: 23.2599, lng: 77.4126 },
    googleMapsUrl: 'https://maps.google.com/?q=Selection+Centre+Central+Bhopal',
    reportingNotes: 'Naval Selection Board (33 SSB) operating at Selection Centre Central (SCC), Sultania Infantry Lines, Bhopal. Reporting MCO at Bhopal Junction Railway Station.',
    boards: [
      { id: '33-ssb-navy-board', name: '33 SSB (Naval Board)', code: '33 SSB', description: 'Navy Selection Board at SCC Bhopal' }
    ],
    stays: [
      {
        id: '33ssb-bhopal-stay-1',
        name: 'Jain Dharmshala Bhopal',
        price: 200,
        priceUnit: 'person',
        priceNotes: '₹200/person',
        distance: '~800 m from centre',
        distanceMeters: 800,
        googleMapsUrl: 'https://maps.google.com/?q=Jain+Dharamshala+Bhopal',
        verified: true,
        badges: ['Closest', 'Budget', 'Recommended'],
        notes: 'Popular candidate dormitory near Sultania Infantry Lines gate.'
      },
      {
        id: '33ssb-bhopal-stay-2',
        name: 'Gufa Mandir Dharamshala',
        price: 50,
        priceUnit: 'person',
        priceNotes: 'Dinner approx ₹50',
        distance: 'Opposite centre',
        distanceMeters: 200,
        googleMapsUrl: 'https://maps.google.com/?q=Gufa+Mandir+Bhopal',
        verified: true,
        badges: ['Closest', 'Budget', 'Free'],
        notes: 'Located directly opposite to reporting area. Dinner available at approximate ₹50.'
      }
    ]
  },
  {
    id: 'navy-nsb-coimbatore',
    service: 'Navy',
    centre: 'NSB Coimbatore (INS Agrani)',
    centreCode: 'NSB Coimbatore',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    coordinates: { lat: 11.0168, lng: 76.9558 },
    googleMapsUrl: 'https://maps.google.com/?q=INS+Agrani+Red+Fields+Coimbatore',
    reportingNotes: 'Dedicated Naval Selection Board at INS Agrani, Red Fields, Coimbatore. Reporting at Coimbatore Junction Railway Station.',
    boards: [
      { id: 'nsb-cbe-board', name: 'NSB Coimbatore Board', code: 'NSB Coimbatore', description: 'Dedicated Naval Selection Board' }
    ],
    stays: [
      {
        id: 'nsb-cbe-stay-1',
        name: 'Railway Retiring Rooms (Coimbatore Junction)',
        price: 250,
        priceUnit: 'person',
        priceNotes: '₹250/person',
        distance: '~1.2 km from INS Agrani',
        distanceMeters: 1200,
        googleMapsUrl: 'https://maps.google.com/?q=Coimbatore+Junction+Railway+Station',
        verified: true,
        badges: ['Closest', 'Budget', 'Call before booking'],
        notes: 'Directly at railway station. Bookable via IRCTC portal.'
      },
      {
        id: 'nsb-cbe-stay-2',
        name: 'Sri Sai Guest House Coimbatore',
        price: 400,
        priceUnit: 'person',
        priceNotes: '₹400/person',
        distance: '~800 m from INS Agrani',
        distanceMeters: 800,
        googleMapsUrl: 'https://maps.google.com/?q=Sri+Sai+Guest+House+Red+Fields+Coimbatore',
        verified: true,
        badges: ['Closest', 'Budget', 'Recommended'],
        notes: 'Short walking distance to Red Fields naval station gate.'
      }
    ]
  },
  {
    id: 'navy-nsb-visakhapatnam',
    service: 'Navy',
    centre: 'NSB Visakhapatnam',
    centreCode: 'NSB Visakhapatnam',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    coordinates: { lat: 17.6868, lng: 83.2185 },
    googleMapsUrl: 'https://maps.google.com/?q=Naval+Selection+Board+Visakhapatnam',
    reportingNotes: 'Dedicated Naval Selection Board at INS Karna / Naval Base Visakhapatnam. Reporting MCO at Visakhapatnam Junction Railway Station.',
    boards: [
      { id: 'nsb-vizag-board', name: 'NSB Visakhapatnam Board', code: 'NSB Vizag', description: 'Dedicated Naval Selection Board' }
    ],
    stays: [
      {
        id: 'nsb-vizag-stay-1',
        name: 'Vizag Sainik Rest House',
        price: 200,
        priceUnit: 'person',
        priceNotes: '₹200/person',
        distance: '~1 km from NSB',
        distanceMeters: 1000,
        googleMapsUrl: 'https://maps.google.com/?q=Sainik+Rest+House+Visakhapatnam',
        verified: true,
        badges: ['Closest', 'Budget', 'Recommended'],
        notes: 'Economical stay for defence candidates near station.'
      },
      {
        id: 'nsb-vizag-stay-2',
        name: 'Hotel Dolphin Vizag',
        price: 800,
        priceUnit: 'person',
        priceNotes: '₹800/person (Approx)',
        distance: '~1.5 km from NSB',
        distanceMeters: 1500,
        googleMapsUrl: 'https://maps.google.com/?q=Hotel+Dolphin+Visakhapatnam',
        verified: true,
        badges: ['Recommended'],
        notes: 'Quality hotel with clean rooms.'
      }
    ]
  },
  {
    id: 'navy-nsb-kolkata',
    service: 'Navy',
    centre: 'NSB Kolkata — Diamond Harbour',
    centreCode: 'NSB Kolkata',
    city: 'Diamond Harbour (Kolkata)',
    state: 'West Bengal',
    coordinates: { lat: 22.1930, lng: 88.1925 },
    googleMapsUrl: 'https://maps.google.com/?q=Naval+Selection+Board+Diamond+Harbour+Kolkata',
    reportingNotes: 'Indian Navy’s 5th Service Selection Board inaugurated at Diamond Harbour, South 24 Parganas (Kolkata). Candidates report via Kolkata / Diamond Harbour railway station MCO.',
    boards: [
      { id: 'nsb-kolkata-board', name: 'NSB Kolkata Board', code: 'NSB Kolkata', description: 'Navy’s 5th Dedicated Naval Selection Board' }
    ],
    stays: [
      {
        id: 'nsb-kolkata-stay-1',
        name: 'West Bengal Tourism Lodge Diamond Harbour',
        price: 400,
        priceMax: 600,
        priceUnit: 'person',
        priceNotes: '₹400–600/person',
        distance: '~1.5 km from NSB',
        distanceMeters: 1500,
        googleMapsUrl: 'https://maps.google.com/?q=Diamond+Harbour+Tourist+Lodge+West+Bengal',
        verified: true,
        badges: ['Recommended', 'Budget'],
        notes: 'State government tourism lodge with safe environment and dining facilities.'
      },
      {
        id: 'nsb-kolkata-stay-2',
        name: 'Sagar Sangam Guest House',
        price: 300,
        priceUnit: 'person',
        priceNotes: '₹300/person',
        distance: '~800 m from NSB',
        distanceMeters: 800,
        googleMapsUrl: 'https://maps.google.com/?q=Sagar+Sangam+Guest+House+Diamond+Harbour',
        verified: true,
        badges: ['Closest', 'Budget'],
        notes: 'Walking distance to reporting area near riverside.'
      },
      {
        id: 'nsb-kolkata-stay-3',
        name: 'Sainik Rest House (Howrah / Kolkata)',
        price: 200,
        priceUnit: 'person',
        priceNotes: '₹200/person',
        distance: '~2.5 km from Station',
        distanceMeters: 2500,
        googleMapsUrl: 'https://maps.google.com/?q=Sainik+Rest+House+Kolkata',
        verified: true,
        badges: ['Budget', 'Call before booking'],
        notes: 'Official Sainik welfare accommodation for defence candidates.'
      }
    ]
  },

  // ================= COAST GUARD (Selection Boards) =================
  {
    id: 'cg-cgsb-noida',
    service: 'Coast Guard',
    centre: 'Coast Guard Selection Board (CGSB) — Noida',
    centreCode: 'CGSB Noida',
    city: 'Noida',
    state: 'Uttar Pradesh',
    coordinates: { lat: 28.5700, lng: 77.3200 },
    googleMapsUrl: 'https://maps.google.com/?q=Coast+Guard+Selection+Board+Noida+Sector+24',
    reportingNotes: 'CGSB Sector 24, Noida (Near Sector 12/22 Metro Station).',
    boards: [
      { id: 'cgsb-noida-b1', name: 'CGSB Noida Board', code: 'CGSB Noida' }
    ],
    stays: [
      {
        id: 'cgsb-noida-stay-1',
        name: 'Noida Sector 24 PG / Guest Stay',
        price: 350,
        priceUnit: 'person',
        priceNotes: '₹350/person',
        distance: '~1 km from CGSB',
        distanceMeters: 1000,
        googleMapsUrl: 'https://maps.google.com/?q=Sector+24+Noida+PG',
        verified: true,
        badges: ['Closest', 'Budget', 'Recommended'],
        notes: 'Clean PG rooms preferred by Coast Guard aspirants.'
      },
      {
        id: 'cgsb-noida-stay-2',
        name: 'Sainik Rest House Noida',
        price: 200,
        priceUnit: 'person',
        priceNotes: '₹200/person',
        distance: '~1.5 km from CGSB',
        distanceMeters: 1500,
        googleMapsUrl: 'https://maps.google.com/?q=Sainik+Rest+House+Noida',
        verified: true,
        badges: ['Budget'],
        notes: 'Ex-servicemen welfare rest house.'
      }
    ]
  },
  {
    id: 'cg-cgsb-mumbai',
    service: 'Coast Guard',
    centre: 'Coast Guard Selection Board (CGSB) — Mumbai',
    centreCode: 'CGSB Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    coordinates: { lat: 18.9400, lng: 72.8350 },
    googleMapsUrl: 'https://maps.google.com/?q=Coast+Guard+Selection+Board+Worli+Mumbai',
    reportingNotes: 'Coast Guard Regional HQ Worli Sea Face, Mumbai.',
    boards: [
      { id: 'cgsb-mumbai-b1', name: 'CGSB Mumbai Board', code: 'CGSB Mumbai' }
    ],
    stays: [
      {
        id: 'cgsb-mumbai-stay-1',
        name: 'Worli Sainik Rest House',
        price: 250,
        priceUnit: 'person',
        priceNotes: '₹250/person',
        distance: '~1.5 km from CGSB',
        distanceMeters: 1500,
        googleMapsUrl: 'https://maps.google.com/?q=Sainik+Rest+House+Worli+Mumbai',
        verified: true,
        badges: ['Budget', 'Recommended'],
        notes: 'Safe military rest house near Worli seafront.'
      }
    ]
  },
  {
    id: 'cg-cgsb-chennai',
    service: 'Coast Guard',
    centre: 'Coast Guard Selection Board (CGSB) — Chennai',
    centreCode: 'CGSB Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    coordinates: { lat: 13.0827, lng: 80.2707 },
    googleMapsUrl: 'https://maps.google.com/?q=Coast+Guard+Regional+HQ+East+Chennai',
    reportingNotes: 'Coast Guard Regional HQ (East), Near Chennai Central Railway Station.',
    boards: [
      { id: 'cgsb-chennai-b1', name: 'CGSB Chennai Board', code: 'CGSB Chennai' }
    ],
    stays: [
      {
        id: 'cgsb-chennai-stay-1',
        name: 'Chennai Central Railway Retiring Rooms',
        price: 300,
        priceUnit: 'person',
        priceNotes: '₹300/person',
        distance: '~1 km from CGSB',
        distanceMeters: 1000,
        googleMapsUrl: 'https://maps.google.com/?q=Chennai+Central+Railway+Station',
        verified: true,
        badges: ['Closest', 'Budget', 'Recommended'],
        notes: 'Directly at railway station terminal.'
      }
    ]
  }
];
