'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { SSB_CENTRES, ServiceType, SSBCentre } from '@/lib/data/ssbCentres';
import ServiceTabs from '@/components/ssb-centres/ServiceTabs';
import FilterPanel from '@/components/ssb-centres/FilterPanel';
import CentreCard from '@/components/ssb-centres/CentreCard';
import CentreDetailDrawer from '@/components/ssb-centres/CentreDetailDrawer';
import { Search, Compass } from 'lucide-react';

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

  // Stats Counters
  const totalCentres = SSB_CENTRES.length;
  const totalBoards = SSB_CENTRES.reduce((acc, c) => acc + c.boards.length, 0);
  const totalStays = SSB_CENTRES.reduce((acc, c) => acc + c.stays.length, 0);

  return (
    <div className="h-full flex flex-col p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto overflow-hidden">
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

      {/* Main Split Layout: 35% Centre List / 65% Interactive Map (Stacked on Mobile) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0 overflow-hidden">
        {/* Left Side: Centre Cards Directory List (35% on Desktop -> 4/12 or 5/12 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-full min-h-0 overflow-hidden space-y-3">
          <div className="flex items-center justify-between px-1">
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

        {/* Right Side: Interactive Leaflet Map (65% on Desktop -> 7/12 or 8/12 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 h-[400px] lg:h-full min-h-[350px] relative">
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
