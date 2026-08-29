'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { SSB_CENTRES, ServiceType, SSBCentre } from '@/lib/data/ssbCentres';
import ServiceTabs from '@/components/ssb-centres/ServiceTabs';
import FilterPanel from '@/components/ssb-centres/FilterPanel';
import CentreCard from '@/components/ssb-centres/CentreCard';
import CentreDetailDrawer from '@/components/ssb-centres/CentreDetailDrawer';
import { Search, Compass, GripVertical, SlidersHorizontal, RotateCcw } from 'lucide-react';

// Dynamic import for Leaflet map component (SSR disabled)
const SSBMap = dynamic(() => import('@/components/ssb-centres/SSBMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[350px] rounded-2xl bg-zinc-900/80 border theme-border flex flex-col items-center justify-center p-6 space-y-3">
      <Compass className="w-8 h-8 text-amber-500 animate-spin" />
      <span className="text-xs font-bold theme-text-muted">Loading Interactive SSB Map...</span>
    </div>
  ),
});

export default function SSBCentresPage() {
  // State management
  const [activeTab, setActiveTab] = useState<ServiceType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('any');
  const [distanceFilter, setDistanceFilter] = useState('any');
  const [selectedCentreId, setSelectedCentreId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Split width state (percentage for left directory panel on desktop)
  const [listWidthPercent, setListWidthPercent] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ssb_centres_split_width');
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= 20 && parsed <= 80) return parsed;
      }
    }
    return 38; // Default split ratio: 38% directory / 62% map
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync split width with localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ssb_centres_split_width', listWidthPercent.toString());
    }
  }, [listWidthPercent]);

  // Window resize desktop check
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Draggable Handler logic
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newX = moveEvent.clientX - rect.left;
      const percent = (newX / rect.width) * 100;
      const clamped = Math.max(22, Math.min(78, percent));
      setListWidthPercent(clamped);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);

    const handleTouchMove = (touchEvent: TouchEvent) => {
      if (!containerRef.current || !touchEvent.touches[0]) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newX = touchEvent.touches[0].clientX - rect.left;
      const percent = (newX / rect.width) * 100;
      const clamped = Math.max(22, Math.min(78, percent));
      setListWidthPercent(clamped);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };

    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
  };

  // Filter calculation
  const filteredCentres = useMemo(() => {
    return SSB_CENTRES.filter((centre) => {
      // 1. Service Filter
      if (activeTab !== 'All' && centre.service !== activeTab) {
        return false;
      }

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = centre.centre.toLowerCase().includes(q);
        const matchesCity = centre.city.toLowerCase().includes(q);
        const matchesState = centre.state.toLowerCase().includes(q);
        const matchesCode = centre.centreCode.toLowerCase().includes(q);
        const matchesBoard = centre.boards.some((b) => b.name.toLowerCase().includes(q));
        const matchesStay = centre.stays.some((s) => s.name.toLowerCase().includes(q));

        if (!matchesName && !matchesCity && !matchesState && !matchesCode && !matchesBoard && !matchesStay) {
          return false;
        }
      }

      // 3. Accommodation Price Filter
      if (priceFilter !== 'any') {
        const hasMatchingPrice = centre.stays.some((s) => {
          if (s.price === undefined) return false;
          if (priceFilter === 'under-300') return s.price <= 300;
          if (priceFilter === '300-600') return s.price >= 300 && s.price <= 600;
          if (priceFilter === '600-1000') return s.price >= 600 && s.price <= 1000;
          if (priceFilter === 'above-1000') return s.price >= 1000;
          return true;
        });
        if (!hasMatchingPrice) return false;
      }

      // 4. Distance Filter
      if (distanceFilter !== 'any') {
        const hasMatchingDistance = centre.stays.some((s) => {
          if (distanceFilter === '500m') return s.distanceMeters <= 500;
          if (distanceFilter === '1km') return s.distanceMeters <= 1000;
          if (distanceFilter === '2km') return s.distanceMeters <= 2000;
          return true;
        });
        if (!hasMatchingDistance) return false;
      }

      return true;
    });
  }, [activeTab, searchQuery, priceFilter, distanceFilter]);

  // Geolocation Handler ("Near Me")
  const handleGeolocate = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to retrieve your location. Please check browser permissions.');
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const selectedCentre = useMemo(() => {
    return SSB_CENTRES.find((c) => c.id === selectedCentreId) || null;
  }, [selectedCentreId]);

  const handleSelectCentre = (id: string) => {
    setSelectedCentreId(id);
    setIsDrawerOpen(true);
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 space-y-4 max-w-[1700px] mx-auto overflow-hidden">
      {/* Service Tabs */}
      <ServiceTabs
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSelectedCentreId(null);
        }}
        centres={SSB_CENTRES}
      />

      {/* Search & Filter Bar */}
      <FilterPanel
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        priceFilter={priceFilter}
        onPriceChange={setPriceFilter}
        distanceFilter={distanceFilter}
        onDistanceChange={setDistanceFilter}
        onGeolocate={handleGeolocate}
        isLocating={isLocating}
      />

      {/* View Split Controls Header Bar */}
      <div className="flex items-center justify-between px-1 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-extrabold uppercase tracking-wider theme-text-muted">
            {filteredCentres.length} {filteredCentres.length === 1 ? 'Centre Found' : 'Centres Found'}
          </span>
          {(searchQuery || priceFilter !== 'any' || distanceFilter !== 'any' || activeTab !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setPriceFilter('any');
                setDistanceFilter('any');
                setActiveTab('All');
              }}
              className="text-[11px] font-bold text-amber-400 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Quick View Width Preset Controls (Desktop) */}
        <div className="hidden lg:flex items-center space-x-1 bg-zinc-900/90 border theme-border p-1 rounded-xl shadow-inner">
          <span className="text-[10px] font-extrabold uppercase theme-text-muted px-2 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            View Width:
          </span>
          <button
            onClick={() => setListWidthPercent(30)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
              Math.round(listWidthPercent) === 30
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            title="Wide Map View (30% List / 70% Map)"
          >
            Map Focus (70%)
          </button>
          <button
            onClick={() => setListWidthPercent(50)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
              Math.round(listWidthPercent) === 50
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            title="50:50 Balanced View"
          >
            50:50 Split
          </button>
          <button
            onClick={() => setListWidthPercent(70)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
              Math.round(listWidthPercent) === 70
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            title="Wide List View (70% List / 30% Map)"
          >
            List Focus (70%)
          </button>
          {Math.round(listWidthPercent) !== 38 && (
            <button
              onClick={() => setListWidthPercent(38)}
              className="px-2 py-1 rounded-lg text-[10px] font-bold text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 transition-all flex items-center gap-1"
              title="Reset to Default Split (38% List)"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Split Layout with Draggable Resizer */}
      <div
        ref={containerRef}
        className={`flex-1 flex flex-col lg:flex-row gap-0 lg:gap-2 min-h-0 overflow-hidden relative ${
          isDragging ? 'select-none' : ''
        }`}
      >
        {/* Left Side: Centre Cards Directory List */}
        <div
          style={{ width: isDesktop ? `${listWidthPercent}%` : '100%' }}
          className="flex flex-col h-full min-h-0 overflow-hidden space-y-3 shrink-0 transition-[width] duration-75 ease-out"
        >
          {/* Cards Container (Scrollable) */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-3">
            {filteredCentres.length === 0 ? (
              <div className="p-8 text-center theme-bg-card rounded-2xl border theme-border space-y-3">
                <Search className="w-8 h-8 theme-text-muted mx-auto" />
                <h4 className="text-sm font-extrabold theme-text-primary">No SSB Centres Match Filters</h4>
                <p className="text-xs theme-text-muted max-w-xs mx-auto">
                  Try clearing search keywords or selecting a different service category.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setPriceFilter('any');
                    setDistanceFilter('any');
                    setActiveTab('All');
                  }}
                  className="px-4 py-2 rounded-xl theme-accent-bg text-black font-extrabold text-xs shadow-md"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              filteredCentres.map((centre) => (
                <CentreCard
                  key={centre.id}
                  centre={centre}
                  isSelected={selectedCentreId === centre.id}
                  onSelect={handleSelectCentre}
                />
              ))
            )}
          </div>
        </div>

        {/* Resizer Handle Bar (Desktop only) */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onDoubleClick={() => setListWidthPercent(38)}
          title="Drag left/right to adjust view width. Double-click to reset."
          className="hidden lg:flex flex-col items-center justify-center w-4 hover:w-5 -mx-1 z-20 cursor-col-resize group select-none transition-all duration-150 relative shrink-0"
        >
          <div
            className={`w-1 h-full rounded-full transition-all duration-200 ${
              isDragging ? 'bg-amber-400 shadow-[0_0_12px_#f0a924]' : 'bg-zinc-800 group-hover:bg-amber-500/80'
            }`}
          />
          <div
            className={`absolute p-1.5 rounded-full border shadow-lg transition-all ${
              isDragging
                ? 'bg-amber-500 border-amber-400 text-black scale-110 shadow-amber-500/50'
                : 'bg-zinc-900 border-zinc-700 text-zinc-400 group-hover:border-amber-500 group-hover:text-amber-400 group-hover:scale-105'
            }`}
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Right Side: Interactive Leaflet Map */}
        <div
          style={{ width: isDesktop ? `${100 - listWidthPercent}%` : '100%' }}
          className={`flex-1 h-[400px] lg:h-full min-h-[350px] relative shrink-0 transition-[width] duration-75 ease-out ${
            isDragging ? 'pointer-events-none' : ''
          }`}
        >
          <SSBMap
            centres={filteredCentres}
            selectedCentreId={selectedCentreId}
            onSelectCentre={handleSelectCentre}
            userLocation={userLocation}
          />
        </div>
      </div>

      {/* Centre Detail Drawer Modal */}
      {isDrawerOpen && selectedCentre && (
        <CentreDetailDrawer
          centre={selectedCentre}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </div>
  );
}
