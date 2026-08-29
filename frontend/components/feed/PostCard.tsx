'use client';

import React, { useState } from 'react';
import { Trash2, Calendar, ChevronDown, ChevronUp, Shield, AlertTriangle, Loader2 } from 'lucide-react';
import { FeedPost, apiService } from '@/services/api';
import { UpvoteDownvote } from './UpvoteDownvote';

interface PostCardProps {
  post: FeedPost;
  currentUserId?: string;
  isAdmin?: boolean;
  onPostDeleted?: (postId: string) => void;
  onRequireLogin: () => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Personal Experience': {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  Psychology: {
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
  },
  GTO: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  Interview: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
  },
  'Screening & PPDT': {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    border: 'border-indigo-500/30',
  },
  'Written Exam': {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
  },
  Medicals: {
    bg: 'bg-teal-500/10',
    text: 'text-teal-400',
    border: 'border-teal-500/30',
  },
  'Academy Life': {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    border: 'border-yellow-500/30',
  },
  General: {
    bg: 'bg-zinc-500/10',
    text: 'text-zinc-300',
    border: 'border-zinc-500/30',
  },
};

export function PostCard({
  post,
  currentUserId,
  isAdmin = false,
  onPostDeleted,
  onRequireLogin,
}: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canDelete = isAdmin || (currentUserId && currentUserId === post.user_id);
  const categoryStyle = CATEGORY_COLORS[post.category] || CATEGORY_COLORS['General'];

  // Content truncation threshold
  const TRUNCATE_LIMIT = 280;
  const isLong = post.content.length > TRUNCATE_LIMIT;
  const displayContent = isLong && !expanded ? `${post.content.slice(0, TRUNCATE_LIMIT)}...` : post.content;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await apiService.deleteFeedPost(post.id);
      if (onPostDeleted) {
        onPostDeleted(post.id);
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Failed to delete post.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const formattedDate = new Date(post.created_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="p-5 sm:p-6 rounded-2xl theme-bg-card border theme-border shadow-md transition-all hover:border-[var(--theme-accent-border)] flex flex-col justify-between gap-4">
      {/* Header: Author + Category Tag + Delete Action */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Author Avatar */}
          <div className="w-10 h-10 rounded-xl bg-[var(--theme-accent-bg-subtle)] border theme-accent-border theme-accent-text flex items-center justify-center font-extrabold text-xs shadow-sm flex-shrink-0">
            {post.author_initials || 'CD'}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm theme-text-primary tracking-tight">
                {post.author_name}
              </span>
              {isAdmin && post.user_id === currentUserId && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-0.5">
                  <Shield className="w-3 h-3" /> Admin
                </span>
              )}
            </div>
            <span className="text-[10px] theme-text-muted font-semibold flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3" /> {formattedDate}
            </span>
          </div>
        </div>

        {/* Right side: Category Badge & Delete Action */}
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border} uppercase tracking-wider`}
          >
            {post.category}
          </span>

          {canDelete && (
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              title="Delete post"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Post Content Body */}
      <div className="space-y-2">
        {/* Bold Title / Heading */}
        <h3 className="font-extrabold text-base sm:text-lg theme-text-primary tracking-tight leading-snug">
          {post.title}
        </h3>

        {/* Story Body */}
        <div className="text-xs sm:text-sm theme-text-secondary leading-relaxed whitespace-pre-line font-normal">
          {displayContent}
        </div>

        {/* Truncation Toggle Button */}
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 text-xs font-bold theme-accent-text hover:underline mt-1 cursor-pointer"
          >
            {expanded ? (
              <>
                <span>Show Less</span> <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Read Full Story ({post.content.length.toLocaleString()} chars)</span>{' '}
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Footer Controls: Upvote / Downvote Widget */}
      <div className="pt-2 border-t theme-border-subtle flex items-center justify-between">
        <UpvoteDownvote
          postId={post.id}
          initialScore={post.score}
          initialUserVote={post.user_vote}
          isLoggedIn={!!currentUserId}
          onRequireLogin={onRequireLogin}
        />

        <span className="text-[10px] theme-text-muted font-semibold">
          {post.upvotes} upvotes • {post.downvotes} downvotes
        </span>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          />
          <div className="relative bg-[#18181b] border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl z-10 space-y-4 animate-in fade-in zoom-in-95 select-none">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Delete Post?</h3>
                <p className="text-[11px] text-zinc-400">
                  {isAdmin && post.user_id !== currentUserId
                    ? 'Admin deletion: this post will be removed from the feed.'
                    : 'This action cannot be undone.'}
                </p>
              </div>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-3 text-xs text-zinc-300">
              "<span className="font-semibold text-amber-400">{post.title}</span>"
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-lg shadow-rose-600/20 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
