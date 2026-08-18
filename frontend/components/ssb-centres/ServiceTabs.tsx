'use client';

import React from 'react';
import { ServiceType, SSBCentre } from '@/lib/data/ssbCentres';
import { Plane, Shield, Anchor, LifeBuoy, Layers } from 'lucide-react';

interface ServiceTabsProps {
  activeTab: ServiceType | 'All';
  onTabChange: (tab: ServiceType | 'All') => void;
  centres: SSBCentre[];
}

export default function ServiceTabs({ activeTab, onTabChange, centres }: ServiceTabsProps) {
  const getCount = (service?: ServiceType) => {
    if (!service) return centres.length;
    return centres.filter((c) => c.service === service).length;
  };

  const tabs: { id: ServiceType | 'All'; label: string; icon: any; color: string }[] = [
    { id: 'All', label: 'All Services', icon: Layers, color: 'theme-accent-text' },
    { id: 'Air Force', label: 'Air Force', icon: Plane, color: 'text-sky-400' },
    { id: 'Army', label: 'Army', icon: Shield, color: 'text-lime-400' },
    { id: 'Navy', label: 'Navy', icon: Anchor, color: 'text-blue-400' },
    { id: 'Coast Guard', label: 'Coast Guard', icon: LifeBuoy, color: 'text-amber-500' },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const count = getCount(tab.id === 'All' ? undefined : (tab.id as ServiceType));
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer border ${
              isActive
                ? 'theme-bg-card theme-accent-border theme-text-primary shadow-md scale-[1.02]'
                : 'theme-bg-card/60 theme-border-subtle theme-text-muted hover:theme-text-secondary hover:theme-border'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? tab.color : 'theme-text-muted'}`} />
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                isActive
                  ? 'theme-accent-bg text-black'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
