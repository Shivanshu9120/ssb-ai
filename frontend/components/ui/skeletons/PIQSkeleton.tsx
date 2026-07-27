'use client';

import React from 'react';
import { Skeleton } from '../Skeleton';

export function PIQSkeleton() {
  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-8 select-none">
      {/* Step Stepper Header Skeleton */}
      <div className="p-5 rounded-2xl theme-bg-card border theme-border flex justify-between items-center overflow-x-auto gap-4">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex items-center gap-3 flex-shrink-0">
            <Skeleton className="w-8 h-8 rounded-full" corners />
            <div className="space-y-1 hidden sm:block">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-2 w-12 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Form Skeleton Card */}
      <div className="p-6 rounded-2xl theme-bg-card border theme-border space-y-6">
        <div className="flex items-center justify-between border-b theme-border pb-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <Skeleton className="h-3 w-72 rounded" />
          </div>
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>

        {/* Input Grid Skeletons */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((field) => (
            <div key={field} className="space-y-2">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>

        {/* Table Placeholder Skeleton */}
        <div className="space-y-3 pt-4">
          <Skeleton className="h-4 w-36 rounded" />
          <div className="border theme-border rounded-xl p-4 space-y-3">
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        </div>

        {/* Button Bar Skeleton */}
        <div className="flex items-center justify-between pt-4 border-t theme-border">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default PIQSkeleton;
