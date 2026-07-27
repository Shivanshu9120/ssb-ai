import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SSB AI Mentor — SSB Interview & OLQ Coaching Platform',
    short_name: 'SSB AI',
    description: 'AI-powered Officer Like Qualities (OLQ) coaching and SSB interview preparation companion for Indian Armed Forces.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1e1e1f',
    theme_color: '#1e1e1f',
    icons: [
      {
        src: '/SSBAI-logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
