import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ssbai.netlify.app"),
  title: {
    default: "SSB AI Mentor — #1 AI Companion for SSB Interview & OLQ Coaching",
    template: "%s | SSB AI Mentor",
  },
  description:
    "Prepare for Indian Army, Navy, and Air Force SSB selection boards. Master Officer Like Qualities (OLQ), Psychological Tests (TAT, WAT, SRT, PPDT), GTO tasks, and Personal Interviews with Gemini AI coaching.",
  keywords: [
    "SSB Interview",
    "SSB AI Mentor",
    "Officer Like Qualities",
    "OLQ coaching",
    "PPDT practice",
    "TAT story writing",
    "WAT words practice",
    "SRT solver",
    "GTO tasks",
    "Services Selection Board",
    "Indian Army SSB",
    "Indian Navy SSB",
    "Indian Air Force AFSB",
    "CDS SSB prep",
    "NDA SSB prep",
    "AFCAT AFSB prep",
    "Google Search Console verified",
    "GEO AI Search Optimization",
  ],
  authors: [{ name: "SSB AI Team", url: "https://ssbai.netlify.app" }],
  creator: "SSB AI",
  publisher: "SSB AI",
  category: "Education",
  alternates: {
    canonical: "https://ssbai.netlify.app",
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" },
      { url: "/SSBAI-logo.png", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "SSB AI Mentor — #1 AI Companion for SSB Interview & OLQ Coaching",
    description:
      "Master Indian Armed Forces Services Selection Board (SSB) tests with real-time AI guidance, OLQ scoring, and psychological test evaluations.",
    url: "https://ssbai.netlify.app",
    siteName: "SSB AI Mentor",
    images: [{ url: "/SSBAI-logo.png", width: 512, height: 512, alt: "SSB AI Logo" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SSB AI Mentor — #1 AI Companion for SSB Interview & OLQ Coaching",
    description:
      "Master Indian Armed Forces Services Selection Board (SSB) tests with real-time AI guidance, OLQ scoring, and psychological test evaluations.",
    images: ["/SSBAI-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "googlecec55fc7c6d708f8",
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "geo.position": "28.6139;77.2090",
    "ICBM": "28.6139, 77.2090",
  },
};

const jsonLdData = [
  {
    "@context": "https://schema.org",
    "@type": "EducationalApplication",
    "name": "SSB AI Mentor",
    "operatingSystem": "Web",
    "applicationCategory": "EducationalApplication",
    "url": "https://ssbai.netlify.app",
    "description": "AI-powered preparation platform for Indian Armed Forces SSB (Services Selection Board) interviews, offering Officer Like Qualities (OLQ) evaluation, PPDT, TAT, WAT, SRT, and GTO practice.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1250"
    },
    "featureList": [
      "Psychological Test Evaluation (TAT, WAT, SRT)",
      "Picture Perception & Discussion Test (PPDT) Feedback",
      "Officer Like Qualities (OLQ) Scorecard & Analysis",
      "Personalized SSB Interview Coaching with Gemini AI",
      "Comprehensive Guidance for CDS, NDA, AFCAT & Direct Entry Candidates"
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SSB AI Mentor",
    "url": "https://ssbai.netlify.app",
    "logo": "https://ssbai.netlify.app/SSBAI-logo.png",
    "sameAs": ["https://ssbai.netlify.app"],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "areaServed": "IN"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is SSB AI Mentor?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SSB AI Mentor is an advanced AI-driven preparation platform designed to help NDA, CDS, AFCAT, and direct entry candidates clear the 5-day Services Selection Board (SSB) interview for the Indian Armed Forces (Army, Navy, Air Force)."
        }
      },
      {
        "@type": "Question",
        "name": "How does SSB AI help with psychological tests (TAT, WAT, SRT, PPDT)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SSB AI evaluates candidate responses for Thematic Apperception Test (TAT), Word Association Test (WAT), Situation Reaction Test (SRT), and PPDT stories against the 15 Officer Like Qualities (OLQs), providing instant feedback and improvement suggestions."
        }
      },
      {
        "@type": "Question",
        "name": "Which SSB selection centers are covered?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SSB AI guides candidates preparing for all major selection boards across India including 11 SSB Allahabad, 14 SSB Allahabad, 33 SSB Bhopal, 24 SSB Bengaluru, 1 AFSB Dehradun, 2 AFSB Mysore, 3 AFSB Gandhinagar, 4 AFSB Varanasi, NSB Visakhapatnam, and 3 SSB Kapurthala."
        }
      }
    ]
  }
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#1e1e1f] text-slate-100">
        <AuthProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
