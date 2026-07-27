'use client';

import React from 'react';
import { Skeleton } from '../Skeleton';

export function ChatSkeleton() {
  return (
    <div className="flex flex-col h-full theme-bg-app p-4 space-y-6 max-w-5xl mx-auto w-full select-none">
      {/* Header bar placeholder */}
      <div className="p-4 rounded-xl theme-bg-card border theme-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" corners />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-2.5 w-24 rounded" />
          </div>
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>

      {/* Message thread skeletons (alternating AI radar responses and user prompts) */}
      <div className="flex-1 space-y-6 overflow-hidden pr-2">
        {/* AI Tactical Response Skeleton */}
        <div className="flex items-start gap-3">
          <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" corners />
          <div className="space-y-2 p-4 rounded-2xl theme-bg-card border theme-border max-w-2xl w-full">
            <Skeleton className="h-4 w-1/3 rounded" />
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-5/6 rounded" />
            <Skeleton className="h-3 w-4/6 rounded" />
          </div>
        </div>

        {/* User Prompt Skeleton */}
        <div className="flex items-start gap-3 justify-end">
          <div className="space-y-2 p-4 rounded-2xl bg-[var(--theme-accent-bg-subtle)] border theme-accent-border max-w-lg w-full">
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-3/4 rounded" />
          </div>
          <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
        </div>

        {/* AI Tactical Response Skeleton 2 */}
        <div className="flex items-start gap-3">
          <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" corners />
          <div className="space-y-2 p-4 rounded-2xl theme-bg-card border theme-border max-w-2xl w-full">
            <Skeleton className="h-4 w-1/4 rounded" />
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-11/12 rounded" />
            <Skeleton className="h-3 w-2/3 rounded" />
          </div>
        </div>
      </div>

      {/* Bottom Command Prompt Bar Skeleton */}
      <div className="p-3 rounded-2xl theme-bg-card border theme-border space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-12 rounded-xl flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}

export default ChatSkeleton;
