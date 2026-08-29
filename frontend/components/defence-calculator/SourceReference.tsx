'use client';

import React from 'react';
import { SourceRef } from '@/lib/defence/types';
import { ExternalLink } from 'lucide-react';

interface SourceReferenceProps {
  source: SourceRef;
  compact?: boolean;
}

export default function SourceReference({ source, compact = false }: SourceReferenceProps) {
  if (!source.url) {
    return (
      <span className="defence-source-text">
        📋 {source.title}
        {source.lastVerified && (
          <span className="defence-source-verified">Verified {source.lastVerified}</span>
        )}
      </span>
    );
  }

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`defence-source-link ${compact ? 'defence-source-compact' : ''}`}
    >
      <ExternalLink size={12} />
      {compact ? 'Official Notification' : source.title}
      {source.notificationDate && !compact && (
        <span className="defence-source-date">{source.notificationDate}</span>
      )}
    </a>
  );
}
