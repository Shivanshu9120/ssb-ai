'use client';

import React from 'react';
import { Skeleton } from '../Skeleton';

export function DashboardSkeleton() {
  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* Welcome & Overview Skeleton Header */}
      <div className="p-6 rounded-2xl theme-bg-card border theme-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" corners />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <Skeleton className="h-3 w-80 rounded-lg" />
          </div>
        </div>
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>

      {/* Grid: PIQ Profile card & 3 Metrics cards */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Left PIQ Card Skeleton */}
        <div className="lg:col-span-1 p-6 rounded-2xl theme-bg-card border theme-border space-y-5">
          <Skeleton className="h-4 w-28 rounded-md" />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-3 w-10 rounded" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-3 w-32 rounded" />
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <Skeleton className="h-2.5 w-20 rounded" />
              <Skeleton className="h-4 w-28 rounded" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-2.5 w-24 rounded" />
              <Skeleton className="h-5 w-20 rounded-lg" />
            </div>
          </div>

          <Skeleton className="h-10 w-full rounded-xl" />
        </div>

        {/* Right 3 Metrics Cards Skeleton */}
        <div className="lg:col-span-3 grid sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl theme-bg-card border theme-border flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-6 w-24 rounded" />
            </div>
            <Skeleton className="w-8 h-8 rounded-lg" />
          </div>

          <div className="p-5 rounded-2xl theme-bg-card border theme-border flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-3 w-28 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>

          <div className="p-5 rounded-2xl theme-bg-card border theme-border flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-28 rounded" />
              <Skeleton className="h-6 w-20 rounded" />
            </div>
            <Skeleton className="w-8 h-8 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Tabs & Chat Cards Grid Skeleton */}
      <div className="space-y-6">
        <div className="flex gap-4 border-b theme-border pb-2">
          <Skeleton className="h-8 w-32 rounded-lg" />
          <Skeleton className="h-8 w-44 rounded-lg" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 rounded-xl border theme-border theme-bg-card flex items-center justify-between">
              <div className="flex items-center gap-3 w-3/4">
                <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-2.5 w-1/2 rounded" />
                </div>
              </div>
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;
