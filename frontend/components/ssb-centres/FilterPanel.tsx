'use client';

import React, { useState } from 'react';
import { Search, MapPin, SlidersHorizontal, IndianRupee, Navigation, X } from 'lucide-react';

interface FilterPanelProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  priceFilter: string;
  onPriceChange: (val: string) => void;
  distanceFilter: string;
  onDistanceChange: (val: string) => void;
  onGeolocate: () => void;
  isLocating: boolean;
}

export default function FilterPanel({
  searchQuery,
  onSearchChange,
  priceFilter,
  onPriceChange,
  distanceFilter,
  onDistanceChange,
  onGeolocate,
  isLocating,
}: FilterPanelProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const priceOptions = [
    { label: 'Any Price', value: 'any' },
    { label: 'Under ₹300', value: 'under-300' },
    { label: '₹300 – ₹600', value: '300-600' },
    { label: '₹600 – ₹1,000', value: '600-1000' },
    { label: '₹1,000+', value: 'above-1000' },
  ];

  const distanceOptions = [
    { label: 'Any Distance', value: 'any' },
    { label: 'Under 500 m', value: '500m' },
    { label: 'Under 1 km', value: '1km' },
    { label: 'Under 2 km', value: '2km' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Bar Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 theme-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search SSB centre, city or accommodation..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl theme-bg-card border theme-border text-xs theme-text-primary placeholder:theme-text-muted focus:outline-none focus:theme-accent-border transition-colors shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons: Near Me & Filter Toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Near Me Geolocation Button */}
          <button
            onClick={onGeolocate}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
            title="Use browser location to find nearest SSB centre"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Near Me'}</span>
          </button>

          {/* Desktop Filter Controls / Mobile Expand Button */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="sm:hidden flex items-center gap-1.5 px-3 py-2.5 rounded-xl theme-bg-card border theme-border text-xs font-semibold theme-text-secondary cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 theme-accent-text" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Filter Options (Always visible on desktop, toggleable on mobile) */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 ${showMobileFilters ? 'block' : 'hidden sm:grid'}`}>
        {/* Accommodation Price Filter */}
        <div className="flex items-center gap-2 theme-bg-card p-2 rounded-xl border theme-border">
          <IndianRupee className="w-3.5 h-3.5 theme-accent-text ml-1 flex-shrink-0" />
          <span className="text-[11px] font-bold theme-text-muted flex-shrink-0">Price:</span>
          <select
            value={priceFilter}
            onChange={(e) => onPriceChange(e.target.value)}
            className="w-full bg-transparent text-xs font-semibold theme-text-primary focus:outline-none cursor-pointer"
          >
            {priceOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Distance Filter */}
        <div className="flex items-center gap-2 theme-bg-card p-2 rounded-xl border theme-border">
          <MapPin className="w-3.5 h-3.5 theme-accent-text ml-1 flex-shrink-0" />
          <span className="text-[11px] font-bold theme-text-muted flex-shrink-0">Distance:</span>
          <select
            value={distanceFilter}
            onChange={(e) => onDistanceChange(e.target.value)}
            className="w-full bg-transparent text-xs font-semibold theme-text-primary focus:outline-none cursor-pointer"
          >
            {distanceOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
