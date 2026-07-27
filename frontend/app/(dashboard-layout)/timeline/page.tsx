'use client';

import React from 'react';
import { 
  Milestone, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  ShieldCheck, 
  Info,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function TimelinePage() {
  const { profile } = useAuth();
  
  const schedule = [
    {
      day: 'Day 1',
      title: 'Stage I: Screening Tests',
      desc: 'Officer Intelligence Rating (OIR) verbal & non-verbal reasoning tests, followed by Picture Perception and Description Test (PPDT) and group narration/discussion.',
      status: 'completed',
      tips: 'Practice speed verbal tests. For PPDT, write a positive story showing proactive action with an logical outline.'
    },
    {
      day: 'Day 2',
      title: 'Stage II: Psychological Testing',
      desc: 'Written battery: Thematic Apperception Test (TAT) 11+1 slides, Word Association Test (WAT) 60 words, Situation Reaction Test (SRT) 60 situations, and Self Description (SD) writeup.',
      status: 'active',
      tips: 'Ensure your answers reflect realistic Officer Like Qualities (OLQ). Do not pre-memorize stories; be spontaneous.'
    },
    {
      day: 'Day 3 & 4',
      title: 'Stage II: Group Testing Officer (GTO) Tasks',
      desc: 'Group Discussions, Group Planning Exercise (GPE), Progressive Group Tasks (PGT), Half Group Task (HGT), Individual Obstacles (IOT), Command Task, and Final Group Task.',
      status: 'pending',
      tips: 'Be a team player. Focus on coordination and helping others cross obstacles rather than showing off individual skills.'
    },
    {
      day: 'Day 5',
      title: 'Stage II: Board Conference',
      desc: 'Individual interview/confrontation with all assessors in military uniform, checking overall suitability, resolving borderlines, and final selection list announcement.',
      status: 'pending',
      tips: 'Maintain upright posture, look directly at the President, smile, and answer general situational questions calmly.'
    }
  ];

  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto space-y-8 select-none">
      <div>
        <h2 className="text-xl font-extrabold theme-text-primary flex items-center gap-2">
          <Calendar className="w-5 h-5 theme-accent-text" /> SSB 5-Day Selection Board Journey
        </h2>
        <p className="text-xs theme-text-muted mt-1 max-w-xl">
          Understand the breakdown of the assessment days. Use the chatbot to practice tests corresponding to your active preparation day.
        </p>
      </div>

      {/* Progress summary banner */}
      <div className="p-4 rounded-xl border theme-accent-border bg-[var(--theme-accent-bg-subtle)] theme-accent-text text-xs flex items-center gap-3">
        <Info className="w-4 h-4 flex-shrink-0" />
        <div>
          Your active training is focused on <strong className="underline">Day 2 Psychology (TAT/WAT/SRT)</strong> based on your onboarding level (<strong>{profile?.profile?.level || 'Beginner'}</strong> candidate).
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="space-y-6 relative border-l theme-border ml-3 pl-6">
        {schedule.map((step) => {
          const isCompleted = step.status === 'completed';
          const isActive = step.status === 'active';
          
          return (
            <div key={step.day} className="relative group">
              {/* Point Node bullet */}
              <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                isCompleted 
                  ? 'theme-accent-bg theme-accent-border' 
                  : isActive
                    ? 'theme-bg-app theme-accent-border theme-accent-text animate-pulse'
                    : 'theme-bg-app theme-border theme-text-muted'
              }`}>
                {isCompleted && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
              </div>

              {/* Card content */}
              <div className={`p-5 rounded-2xl border transition-all ${
                isActive 
                  ? 'theme-bg-card theme-accent-border shadow-md theme-accent-glow' 
                  : 'theme-bg-card theme-border'
              }`}>
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    isCompleted 
                      ? 'theme-bg-input theme-text-muted' 
                      : isActive 
                        ? 'bg-[var(--theme-accent-bg-subtle)] theme-accent-text' 
                        : 'theme-bg-input theme-text-muted'
                  }`}>
                    {step.day} — {step.status.toUpperCase()}
                  </span>
                </div>
                
                <h4 className="font-extrabold text-sm theme-text-primary mt-2">{step.title}</h4>
                <p className="text-xs theme-text-muted mt-1 leading-relaxed">{step.desc}</p>
                
                {/* Expert Guidance Tips */}
                <div className="mt-4 pt-3.5 border-t theme-border-subtle text-[11px] theme-text-muted flex gap-2">
                  <AlertCircle className="w-3.5 h-3.5 theme-accent-text opacity-70 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold theme-text-secondary">Expert Tip:</span> {step.tips}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
