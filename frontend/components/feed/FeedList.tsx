'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, MessageSquare, Loader2, Sparkles, LogIn, Lock } from 'lucide-react';
import { FeedPost, apiService } from '@/services/api';
import { CategoryFilter } from './CategoryFilter';
import { PostCard } from './PostCard';
import { CreatePostModal } from './CreatePostModal';

interface FeedListProps {
  isLoggedIn: boolean;
  currentUserId?: string;
  isAdmin?: boolean;
}

export function FeedList({ isLoggedIn, currentUserId, isAdmin = false }: FeedListProps) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const fetchPosts = async (cat: string) => {
    try {
      setLoading(true);
      setError('');
      const data = await apiService.getFeedPosts(cat === 'All' ? undefined : cat);
      setPosts(data);
    } catch (err: any) {
      console.error('Failed to load feed posts:', err);
      setError(err?.message || 'Failed to load community posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(activeCategory);
  }, [activeCategory]);

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
  };

  const handlePostCreated = (newPost: FeedPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostDeleted = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleCreateClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      setIsCreateModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl theme-bg-card border theme-border shadow-sm select-none">
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-extrabold theme-text-primary uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 theme-accent-text" /> SSB Candidates Feed
          </h2>
          <p className="text-xs theme-text-muted mt-0.5">
            Filter stories by category or share your own SSB selection journey.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateClick}
          className="px-4 py-2.5 rounded-xl theme-accent-bg theme-accent-bg-hover font-extrabold text-xs transition-all shadow-md theme-accent-glow flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Write SSB Experience
        </button>
      </div>

      {/* Category Filter Pills */}
      <CategoryFilter
        activeCategory={activeCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* Main Feed Content List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 theme-text-muted gap-3">
          <Loader2 className="w-7 h-7 animate-spin theme-accent-text" />
          <span className="text-xs font-semibold">Loading community stories...</span>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center space-y-2">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => fetchPosts(activeCategory)}
            className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 border border-dashed theme-border theme-bg-card rounded-2xl flex flex-col items-center gap-3 select-none">
          <MessageSquare className="w-10 h-10 theme-text-muted" />
          <div>
            <h3 className="font-bold text-sm theme-text-primary">No stories published yet</h3>
            <p className="text-xs theme-text-muted mt-0.5">
              Be the first to share an SSB experience in{' '}
              <span className="font-semibold text-amber-400">{activeCategory}</span>!
            </p>
          </div>
          <button
            type="button"
            onClick={handleCreateClick}
            className="mt-2 text-xs font-extrabold theme-accent-text hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Share a Story
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onPostDeleted={handlePostDeleted}
              onRequireLogin={() => setShowLoginModal(true)}
            />
          ))}
        </div>
      )}

      {/* Modal: Create Post */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />

      {/* Modal: Require Login Prompt */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setShowLoginModal(false)}
          />
          <div className="relative bg-[#171b17] border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl z-10 space-y-5 animate-in fade-in zoom-in-95 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-white">Login Required</h3>
              <p className="text-xs text-zinc-400 mt-1">
                You need to log in to write posts, upvote, or react to community stories.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/login"
                className="w-full py-3 rounded-xl theme-accent-bg theme-accent-bg-hover font-extrabold text-xs transition-all shadow-md theme-accent-glow flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Log In / Sign Up
              </Link>
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="py-2.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
