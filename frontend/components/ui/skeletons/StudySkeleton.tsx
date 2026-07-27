'use client';

import React from 'react';
import { Skeleton } from '../Skeleton';

export function StudySkeleton() {
  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* Header Skeleton */}
      <div className="p-6 rounded-2xl theme-bg-card border theme-border space-y-3">
        <Skeleton className="h-7 w-48 rounded-lg" />
        <Skeleton className="h-3.5 w-96 rounded" />
      </div>

      {/* Category Pills Skeleton */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5, 6].map((cat) => (
          <Skeleton key={cat} className="h-10 w-28 rounded-xl flex-shrink-0" />
        ))}
      </div>

      {/* Study Material Grid Skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="p-5 rounded-2xl theme-bg-card border theme-border space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>
            <Skeleton className="h-5 w-3/4 rounded-lg" />
            <Skeleton className="h-3.5 w-full rounded" />
            <Skeleton className="h-3.5 w-5/6 rounded" />
            <div className="pt-2 flex justify-between items-center border-t theme-border">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudySkeleton;
