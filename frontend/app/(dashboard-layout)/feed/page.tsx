'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { FeedList } from '@/components/feed/FeedList';

export default function FeedPage() {
  const { user, profile, isAdmin } = useAuth();

  return (
    <div className="px-4 py-5 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black theme-text-primary tracking-tight">
          Community Experience Feed
        </h1>
        <p className="text-xs sm:text-sm theme-text-muted mt-1">
          Share and explore SSB interview stories, written exam prep, medical experiences, and academy life insights.
        </p>
      </div>

      <FeedList
        isLoggedIn={!!user}
        currentUserId={user?.id}
        isAdmin={isAdmin}
      />
    </div>
  );
}
