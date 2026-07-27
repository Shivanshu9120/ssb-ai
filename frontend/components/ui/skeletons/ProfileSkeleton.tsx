'use client';

import React from 'react';
import { Skeleton } from '../Skeleton';

export function ProfileSkeleton() {
  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto space-y-8 select-none">
      {/* Profile Header Banner Skeleton */}
      <div className="p-6 rounded-2xl theme-bg-card border theme-border flex items-center gap-6">
        <Skeleton className="w-20 h-20 rounded-full flex-shrink-0" corners />
        <div className="space-y-2 w-full">
          <Skeleton className="h-6 w-44 rounded-lg" />
          <Skeleton className="h-3.5 w-60 rounded" />
          <Skeleton className="h-5 w-28 rounded-full" />
        </div>
      </div>

      {/* Details Card Grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-2xl theme-bg-card border theme-border space-y-3">
            <Skeleton className="h-3.5 w-24 rounded" />
            <Skeleton className="h-5 w-40 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function BillingSkeleton() {
  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-8 select-none">
      <div className="p-6 rounded-2xl theme-bg-card border theme-border space-y-3">
        <Skeleton className="h-7 w-48 rounded-lg" />
        <Skeleton className="h-3.5 w-72 rounded" />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((plan) => (
          <div key={plan} className="p-6 rounded-2xl theme-bg-card border theme-border space-y-5">
            <Skeleton className="h-5 w-24 rounded-lg" />
            <Skeleton className="h-8 w-32 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-3/4 rounded" />
            </div>
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
