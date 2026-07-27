'use client';

import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  corners?: boolean;
}

export function Skeleton({ className = '', corners = false, ...props }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden theme-bg-card border theme-border-subtle rounded-xl select-none ${className}`}
      {...props}
    >
      {/* Animated shimmer overlay using theme accent */}
      <div 
        className="absolute inset-0 -translate-x-full animate-skeleton-shimmer"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, var(--theme-accent-bg-subtle) 50%, transparent 100%)',
        }}
      />
      {corners && (
        <>
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 theme-accent-border" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 theme-accent-border" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 theme-accent-border" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 theme-accent-border" />
        </>
      )}
    </div>
  );
}

export default Skeleton;
