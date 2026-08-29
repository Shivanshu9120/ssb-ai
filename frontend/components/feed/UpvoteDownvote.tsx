'use client';

import React, { useState } from 'react';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { apiService } from '@/services/api';

interface UpvoteDownvoteProps {
  postId: string;
  initialScore: number;
  initialUserVote: number; // 1, -1, or 0
  isLoggedIn: boolean;
  onRequireLogin: () => void;
}

export function UpvoteDownvote({
  postId,
  initialScore,
  initialUserVote,
  isLoggedIn,
  onRequireLogin,
}: UpvoteDownvoteProps) {
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState(initialUserVote);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (targetVote: 1 | -1) => {
    if (!isLoggedIn) {
      onRequireLogin();
      return;
    }
    if (isVoting) return;

    // Calculate optimistic state
    let nextVote: number = targetVote;
    let delta = 0;

    if (userVote === targetVote) {
      // Toggle off
      nextVote = 0;
      delta = -targetVote;
    } else if (userVote === 0) {
      delta = targetVote;
    } else {
      // Switching from +1 to -1 or vice versa
      delta = targetVote * 2;
    }

    const prevScore = score;
    const prevUserVote = userVote;

    // Apply optimistic updates
    setScore(prevScore + delta);
    setUserVote(nextVote);
    setIsVoting(true);

    try {
      const res = await apiService.voteFeedPost(postId, targetVote);
      setScore(res.score);
      setUserVote(res.user_vote);
    } catch (err) {
      console.error('Failed to vote:', err);
      // Revert on failure
      setScore(prevScore);
      setUserVote(prevUserVote);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5 bg-[#171b17] border border-zinc-800/80 rounded-xl p-1 select-none">
      {/* Upvote Button */}
      <button
        type="button"
        onClick={() => handleVote(1)}
        title={userVote === 1 ? 'Remove upvote' : 'Upvote post'}
        className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
          userVote === 1
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
            : 'text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800/60'
        }`}
      >
        <ArrowBigUp className={`w-4.5 h-4.5 ${userVote === 1 ? 'fill-current' : ''}`} />
      </button>

      {/* Net Score Display */}
      <span
        className={`text-xs font-black px-1.5 font-mono tracking-tight transition-colors ${
          score > 0
            ? 'text-emerald-400'
            : score < 0
            ? 'text-rose-400'
            : 'text-zinc-400'
        }`}
      >
        {score > 0 ? `+${score}` : score}
      </span>

      {/* Downvote Button */}
      <button
        type="button"
        onClick={() => handleVote(-1)}
        title={userVote === -1 ? 'Remove downvote' : 'Downvote post'}
        className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
          userVote === -1
            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-sm'
            : 'text-zinc-400 hover:text-rose-400 hover:bg-zinc-800/60'
        }`}
      >
        <ArrowBigDown className={`w-4.5 h-4.5 ${userVote === -1 ? 'fill-current' : ''}`} />
      </button>
    </div>
  );
}
