'use client';

import React, { useState } from 'react';
import { SSBCentre, Accommodation } from '@/lib/data/ssbCentres';
import AccommodationCard from './AccommodationCard';
import { X, MapPin, ExternalLink, Shield, Hotel, ArrowUpDown, Info, Plane, Anchor, LifeBuoy } from 'lucide-react';

interface CentreDetailDrawerProps {
  centre: SSBCentre | null;
  onClose: () => void;
}

type SortOption = 'distance' | 'price' | 'recommended';

export default function CentreDetailDrawer({ centre, onClose }: CentreDetailDrawerProps) {
  const [sortBy, setSortBy] = useState<SortOption>('distance');

  if (!centre) return null;

  // Sorting logic for stays
  const sortedStays = [...centre.stays].sort((a, b) => {
    if (sortBy === 'distance') {
      return a.distanceMeters - b.distanceMeters;
    }
    if (sortBy === 'price') {
      const priceA = a.price ?? 99999;
      const priceB = b.price ?? 99999;
      return priceA - priceB;
    }
    if (sortBy === 'recommended') {
      const isRecA = a.badges?.includes('Recommended') ? 1 : 0;
      const isRecB = b.badges?.includes('Recommended') ? 1 : 0;
      return isRecB - isRecA;
    }
    return 0;
  });

  const getServiceBadgeStyle = (service: string) => {
    switch (service) {
      case 'Air Force':
        return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
      case 'Army':
        return 'bg-lime-500/15 text-lime-400 border-lime-500/30';
      case 'Navy':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'Coast Guard':
        return 'bg-amber-500/15 text-amber-500 border-amber-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer / Sheet Container */}
      <div className="relative w-full max-w-lg h-full theme-bg-card border-l theme-border shadow-2xl z-10 flex flex-col overflow-hidden animate-slide-left">
        {/* Header */}
        <div className="p-5 border-b theme-border-subtle flex items-start justify-between gap-4 theme-bg-header">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getServiceBadgeStyle(
                  centre.service
                )}`}
              >
                {centre.service}
              </span>
              <span className="text-[10px] font-bold theme-text-muted bg-zinc-800 px-2 py-0.5 rounded font-mono">
                {centre.centreCode}
              </span>
            </div>

            <h2 className="text-lg font-black theme-text-primary leading-snug">
              {centre.centre}
            </h2>

            <p className="text-xs theme-text-muted flex items-center gap-1 font-semibold">
              <MapPin className="w-3.5 h-3.5 theme-accent-text" />
              <span>{centre.city}, {centre.state}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Quick Actions & Maps link */}
          {centre.googleMapsUrl && (
            <a
              href={centre.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl theme-accent-bg theme-accent-bg-hover text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span className="text-base">📍</span>
              <span>Open Centre in Google Maps</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {/* Reporting Gate Info */}
          {centre.reportingNotes && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <Info className="w-4 h-4 flex-shrink-0" />
                <span>Reporting & MCO Information</span>
              </div>
              <p className="text-[11px] text-amber-100/80">{centre.reportingNotes}</p>
            </div>
          )}

          {/* SSB Boards Section */}
          {centre.boards && centre.boards.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider theme-text-muted flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 theme-accent-text" />
                <span>SSB Boards at this Centre ({centre.boards.length})</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {centre.boards.map((board) => (
                  <div
                    key={board.id}
                    className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-200 font-bold flex items-center justify-between"
                  >
                    <span>{board.name}</span>
                    <span className="text-[9px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nearby Accommodations Section Header & Sorting */}
          <div className="space-y-3 pt-2 border-t theme-border-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Hotel className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-extrabold theme-text-primary">
                  Nearby Stays & Accommodation ({centre.stays.length})
                </h3>
              </div>

              {/* Nearest Stay Sorting Options */}
              <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-[11px]">
                <ArrowUpDown className="w-3 h-3 text-zinc-400 ml-1" />
                <button
                  onClick={() => setSortBy('distance')}
                  className={`px-2 py-1 rounded-lg font-bold transition-colors ${
                    sortBy === 'distance'
                      ? 'bg-amber-500 text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Distance
                </button>
                <button
                  onClick={() => setSortBy('price')}
                  className={`px-2 py-1 rounded-lg font-bold transition-colors ${
                    sortBy === 'price'
                      ? 'bg-amber-500 text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Price
                </button>
                <button
                  onClick={() => setSortBy('recommended')}
                  className={`px-2 py-1 rounded-lg font-bold transition-colors ${
                    sortBy === 'recommended'
                      ? 'bg-amber-500 text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Top Rated
                </button>
              </div>
            </div>

            {/* Accommodation List */}
            <div className="space-y-3">
              {sortedStays.map((stay) => (
                <AccommodationCard key={stay.id} stay={stay} centreName={centre.centre} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
