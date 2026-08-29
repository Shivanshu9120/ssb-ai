'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Calendar, MessageSquare, ArrowBigUp } from 'lucide-react';
import { apiService, FeedPost } from '@/services/api';

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

export default function LandingFeedSection() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTopPosts() {
      try {
        setLoading(true);
        const data = await apiService.getFeedPosts(undefined, 0, 3);
        setPosts(data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load landing feed preview:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTopPosts();
  }, []);

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden bg-[#0a0f0a]/90 border-t border-b border-emerald-900/30 select-none">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Aspirants Community Feed 🇮🇳
            </div>
            <h2
              className="text-2xl sm:text-4xl font-black text-white tracking-tight"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              Real SSB & Exam Preparation Stories
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-1">
              Read authentic experiences shared by candidates across SSB interviews, written exams, medical tests, and academy life.
            </p>
          </div>

          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-amber-400 hover:text-amber-300 transition-colors self-start sm:self-auto group cursor-pointer"
          >
            <span>Explore All Stories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Posts Display: Mobile peek slider & Desktop 3-column grid */}
        {loading ? (
          <div className="flex md:grid md:grid-cols-3 gap-5 overflow-x-auto scrollbar-none pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-[85vw] sm:w-auto flex-shrink-0 p-6 rounded-2xl bg-[#111611] border border-zinc-800/80 animate-pulse space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 bg-zinc-800 rounded w-24" />
                    <div className="h-2 bg-zinc-800 rounded w-16" />
                  </div>
                </div>
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
                <div className="space-y-2">
                  <div className="h-3 bg-zinc-800 rounded w-full" />
                  <div className="h-3 bg-zinc-800 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-zinc-800 bg-[#111611] rounded-2xl space-y-3">
            <MessageSquare className="w-8 h-8 text-zinc-500 mx-auto" />
            <p className="text-xs text-zinc-400">No community posts yet. Be the first candidate to share your journey!</p>
            <Link
              href="/community"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-colors shadow-md"
            >
              Share Story
            </Link>
          </div>
        ) : (
          <div className="flex md:grid md:grid-cols-3 gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            {posts.map((post) => {
              const categoryStyle = CATEGORY_COLORS[post.category] || CATEGORY_COLORS['General'];
              const TRUNCATE_LEN = 160;
              const snippet =
                post.content.length > TRUNCATE_LEN
                  ? `${post.content.slice(0, TRUNCATE_LEN)}...`
                  : post.content;

              const formattedDate = new Date(post.created_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              });

              return (
                <Link
                  key={post.id}
                  href="/community"
                  className="w-[85vw] sm:w-auto snap-center flex-shrink-0 p-5 sm:p-6 rounded-2xl bg-[#111611] border border-zinc-800/80 hover:border-emerald-500/40 transition-all flex flex-col justify-between gap-4 group shadow-md hover:scale-[1.01] cursor-pointer"
                >
                  {/* Card Header: Author + Category */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-xs shadow-sm flex-shrink-0">
                        {post.author_initials || 'CD'}
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-zinc-100 group-hover:text-amber-400 transition-colors block leading-tight">
                          {post.author_name}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-semibold flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" /> {formattedDate}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border} uppercase tracking-wider flex-shrink-0`}
                    >
                      {post.category}
                    </span>
                  </div>

                  {/* Card Content Body */}
                  <div className="space-y-2 flex-1">
                    <h3 className="font-extrabold text-base text-zinc-100 group-hover:text-amber-400 transition-colors tracking-tight line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-normal line-clamp-3">
                      {snippet}
                    </p>
                  </div>

                  {/* Card Footer: Score + Action */}
                  <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-xs font-black font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                      <ArrowBigUp className="w-3.5 h-3.5 fill-current" />
                      {post.score > 0 ? `+${post.score}` : post.score}
                    </span>

                    <span className="text-xs font-extrabold text-zinc-400 group-hover:text-amber-400 transition-colors flex items-center gap-1">
                      Read Story <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Bottom Banner CTA */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#111611] to-amber-950/30 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wide">
              Have an SSB experience or exam tip to share?
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Help thousands of defence aspirants across India. Join the community today.
            </p>
          </div>

          <Link
            href="/community"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
          >
            <span>Visit Community Feed</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
