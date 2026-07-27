'use client';

import React from 'react';
import { Skeleton } from '../Skeleton';

export function TimelineSkeleton() {
  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto space-y-8 select-none">
      <div className="p-6 rounded-2xl theme-bg-card border theme-border space-y-3">
        <Skeleton className="h-7 w-56 rounded-lg" />
        <Skeleton className="h-3.5 w-80 rounded" />
      </div>

      <div className="space-y-6 relative pl-6 border-l-2 theme-border">
        {[1, 2, 3, 4, 5].map((day) => (
          <div key={day} className="relative space-y-3 p-5 rounded-2xl theme-bg-card border theme-border">
            <div className="absolute -left-9 top-5 w-6 h-6 rounded-full border-2 theme-accent-border theme-bg-card flex items-center justify-center">
              <Skeleton className="w-2.5 h-2.5 rounded-full" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-32 rounded-lg" />
              <Skeleton className="h-4 w-20 rounded-full" />
            </div>
            <Skeleton className="h-3.5 w-full rounded" />
            <Skeleton className="h-3.5 w-4/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimelineSkeleton;
