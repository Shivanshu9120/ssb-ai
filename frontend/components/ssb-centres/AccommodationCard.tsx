'use client';

import React from 'react';
import { Accommodation, AccommodationBadge } from '@/lib/data/ssbCentres';
import { Hotel, MapPin, IndianRupee, ExternalLink, CheckCircle2, AlertCircle, PhoneCall, ShieldCheck } from 'lucide-react';

interface AccommodationCardProps {
  stay: Accommodation;
  centreName: string;
}

export default function AccommodationCard({ stay, centreName }: AccommodationCardProps) {
  const getBadgeStyle = (badge: AccommodationBadge) => {
    switch (badge) {
      case 'Closest':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Budget':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'Recommended':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Women Friendly':
        return 'bg-pink-500/15 text-pink-400 border-pink-500/30';
      case 'Free':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'Call before booking':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 shadow-md space-y-3">
      {/* Title & Badges */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Hotel className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <h4 className="font-extrabold text-sm text-white">{stay.name}</h4>
          </div>

          {/* Badges container */}
          {stay.badges && stay.badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {stay.badges.map((badge) => (
                <span
                  key={badge}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${getBadgeStyle(
                    badge
                  )}`}
                >
                  {badge === 'Recommended' && <ShieldCheck className="w-2.5 h-2.5" />}
                  {badge === 'Call before booking' && <PhoneCall className="w-2.5 h-2.5" />}
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Verification Pill */}
        {stay.verified ? (
          <span
            className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 flex-shrink-0"
            title="Verified by community / ex-candidates"
          >
            <CheckCircle2 className="w-3 h-3" />
            Verified
          </span>
        ) : (
          <span
            className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 flex-shrink-0"
            title="Unverified estimate"
          >
            <AlertCircle className="w-3 h-3" />
            Community Sourced
          </span>
        )}
      </div>

      {/* Info Rows: Distance & Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80">
        <div className="flex items-center gap-1.5 text-zinc-300">
          <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className="font-semibold">{stay.distance}</span>
        </div>

        <div className="flex items-center gap-1.5 font-bold text-amber-400">
          <IndianRupee className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{stay.priceNotes || (stay.price ? `₹${stay.price}/${stay.priceUnit || 'person'}` : 'Pricing unavailable')}</span>
        </div>
      </div>

      {/* Notes if available */}
      {stay.notes && (
        <p className="text-[11px] text-zinc-400 leading-relaxed bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/50">
          {stay.notes}
        </p>
      )}

      {/* Prominent Google Maps Action Button */}
      <div>
        {stay.googleMapsUrl ? (
          <a
            href={stay.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-sm group"
          >
            <span className="text-sm">🗺️</span>
            <span>View on Maps</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        ) : (
          <button
            disabled
            className="w-full py-2 px-3 rounded-xl bg-zinc-900 text-zinc-500 border border-zinc-800 font-semibold text-xs flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <span>🗺️ Maps Location Unverified</span>
          </button>
        )}
      </div>
    </div>
  );
}
