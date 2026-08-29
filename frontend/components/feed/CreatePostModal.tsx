'use client';

import React, { useState } from 'react';
import { X, Send, Loader2, AlertCircle, FileText } from 'lucide-react';
import { apiService, FeedPost } from '@/services/api';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: FeedPost) => void;
}

const CATEGORIES = [
  'Personal Experience',
  'Psychology',
  'GTO',
  'Interview',
  'Screening & PPDT',
  'Written Exam',
  'Medicals',
  'Academy Life',
  'General',
];

export function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Personal Experience');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a heading/title for your post.');
      return;
    }
    if (!content.trim()) {
      setError('Please write your experience or story content.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newPost = await apiService.createFeedPost({
        title: title.trim(),
        category,
        content: content.trim(),
      });
      onPostCreated(newPost);
      // Reset form
      setTitle('');
      setContent('');
      setCategory('Personal Experience');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to post story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const charCount = content.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => !loading && onClose()}
      />

      {/* Modal Container */}
      <div className="relative bg-[#171b17] border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl z-10 space-y-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--theme-accent-bg-subtle)] border theme-accent-border theme-accent-text flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight">
                Share SSB Experience / Post
              </h2>
              <p className="text-[11px] text-zinc-400">
                Inspire and guide fellow defence candidates across India.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => !loading && onClose()}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Post Heading / Title */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Heading / Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={150}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. My 14 SSB Allahabad GTO Command Task Experience..."
              className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-[#101410] text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[var(--theme-accent-border)] transition-colors font-semibold"
            />
            <span className="text-[10px] text-zinc-500 block text-right mt-1 font-mono">
              {title.length}/150
            </span>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Category Tag
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-800 bg-[#101410] text-xs text-zinc-200 focus:outline-none focus:border-[var(--theme-accent-border)] font-semibold"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Story Body Content */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Full Experience / Story <span className="text-rose-400">*</span>
              </label>
              <span className="text-[10px] font-mono font-bold text-zinc-500">
                {charCount.toLocaleString()} characters
              </span>
            </div>
            <textarea
              required
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your story here... Detail your SSB board, entry type, tasks, learnings, and advice for fellow aspirants."
              className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-[#101410] text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-[var(--theme-accent-border)] transition-colors leading-relaxed font-normal resize-y"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl theme-accent-bg theme-accent-bg-hover font-extrabold text-xs transition-all shadow-md theme-accent-glow flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Publish Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
