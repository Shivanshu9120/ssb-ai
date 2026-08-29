'use client';

import React from 'react';
import { SSBCentre } from '@/lib/data/ssbCentres';
import { MapPin, Hotel, Map, ChevronRight, Shield, Plane, Anchor, LifeBuoy } from 'lucide-react';

interface CentreCardProps {
  centre: SSBCentre;
  isSelected: boolean;
  onSelect: (centreId: string) => void;
}

export default function CentreCard({ centre, isSelected, onSelect }: CentreCardProps) {
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

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'Air Force':
        return Plane;
      case 'Army':
        return Shield;
      case 'Navy':
        return Anchor;
      case 'Coast Guard':
        return LifeBuoy;
      default:
        return MapPin;
    }
  };

  const ServiceIcon = getServiceIcon(centre.service);

  // Price range summary from stays
  const prices = centre.stays
    .map((s) => s.price)
    .filter((p): p is number => typeof p === 'number' && p > 0);
  
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

  return (
    <div
      onClick={() => onSelect(centre.id)}
      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none relative group ${
        isSelected
          ? 'theme-bg-card theme-accent-border shadow-xl scale-[1.01]'
          : 'theme-bg-card/70 theme-border-subtle hover:theme-border theme-bg-card-hover'
      }`}
    >
      {/* Top Badge & Code */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getServiceBadgeStyle(
            centre.service
          )}`}
        >
          <ServiceIcon className="w-3 h-3" />
          {centre.service}
        </span>
        <span className="text-[10px] font-bold theme-text-muted bg-zinc-800/80 px-2 py-0.5 rounded-md border border-zinc-700/50 font-mono">
          {centre.centreCode}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-extrabold text-sm theme-text-primary group-hover:theme-accent-text transition-colors line-clamp-1">
        {centre.centre}
      </h3>

      {/* Location */}
      <p className="text-xs theme-text-muted flex items-center gap-1 mt-1 font-medium">
        <MapPin className="w-3.5 h-3.5 theme-accent-text flex-shrink-0" />
        <span>{centre.city}, {centre.state}</span>
      </p>

      {/* Boards List preview */}
      {centre.boards && centre.boards.length > 0 && (
        <div className="mt-2.5 pt-2 border-t theme-border-subtle flex flex-wrap gap-1">
          {centre.boards.map((b) => (
            <span
              key={b.id}
              className="text-[10px] font-semibold text-zinc-300 bg-zinc-800/60 px-2 py-0.5 rounded border border-zinc-700/40"
            >
              {b.name}
            </span>
          ))}
        </div>
      )}

      {/* Stays & Price info */}
      <div className="mt-3 flex items-center justify-between text-xs theme-text-muted font-semibold">
        <span className="flex items-center gap-1 text-[11px]">
          <Hotel className="w-3.5 h-3.5 theme-accent-text" />
          {centre.stays.length} {centre.stays.length === 1 ? 'Stay' : 'Stays Nearby'}
        </span>
        <span className="text-[11px] font-bold text-amber-400">
          {minPrice ? `From ₹${minPrice}${maxPrice && maxPrice > minPrice ? `–₹${maxPrice}` : ''}` : 'Pricing details inside'}
        </span>
      </div>

      {/* Quick Action Buttons */}
      <div className="mt-3.5 pt-2.5 border-t theme-border-subtle flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(centre.id);
          }}
          className="flex-1 py-1.5 px-2 rounded-lg theme-accent-bg theme-accent-bg-hover text-black font-extrabold text-[11px] flex items-center justify-center gap-1 shadow-sm transition-all"
        >
          <MapPin className="w-3 h-3 stroke-[2.5]" />
          <span>📍 Centre</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(centre.id);
          }}
          className="flex-1 py-1.5 px-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 theme-text-secondary font-bold text-[11px] flex items-center justify-center gap-1 transition-all border border-zinc-700/50"
        >
          <Hotel className="w-3 h-3 text-amber-400" />
          <span>🏨 Stays</span>
        </button>

        {centre.googleMapsUrl ? (
          <a
            href={centre.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/50 transition-colors flex items-center justify-center"
            title="Open Centre in Google Maps"
          >
            <Map className="w-3.5 h-3.5 text-blue-400" />
          </a>
        ) : (
          <button
            disabled
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg bg-zinc-900/50 text-zinc-600 border border-zinc-800 cursor-not-allowed"
            title="Maps location unverified"
          >
            <Map className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
