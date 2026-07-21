'use client';

import React, { useState } from 'react';
import { BookOpen, Sparkles, HelpCircle, Target, ArrowRight, Lightbulb, Award } from 'lucide-react';
import Link from 'next/link';

export default function StudyPage() {
  const [selectedCategory, setSelectedCategory] = useState<'olq' | 'psych' | 'gto'>('olq');

  const olqList = [
    { factor: 'Factor 1: Planning & Organizing', qualities: ['Effective Intelligence', 'Reasoning Ability', 'Organizing Ability', 'Power of Expression'] },
    { factor: 'Factor 2: Social Adjustment', qualities: ['Social Adaptability', 'Cooperation', 'Sense of Responsibility'] },
    { factor: 'Factor 3: Social Effectiveness', qualities: ['Initiative', 'Self Confidence', 'Speed of Decision', 'Ability to Influence Group', 'Liveliness'] },
    { factor: 'Factor 4: Dynamic (Grit & Force)', qualities: ['Determination', 'Courage', 'Stamina'] }
  ];

  const psychTips = [
    { title: 'TAT: Thematic Apperception Test', tip: 'Focus on writing realistic stories. Your hero should identify a problem, lay out a step-by-step action plan, and reach a positive resolution. Avoid magic or instant success.' },
    { title: 'WAT: Word Association Test', tip: 'Write short, positive, observation-based sentences. Avoid using "should", "must", or quoting universal definitions. Keep sentences active and showing action.' },
    { title: 'SRT: Situation Reaction Test', tip: 'Provide a complete reaction: Action + Result. Do not leave situations blank or give half-baked solutions. React safely, responsibly, and logically.' }
  ];

  const gtoTips = [
    { title: 'Progressive Group Task (PGT)', tip: 'Focus on bridging obstacles using plank, balli, and rope. Stay active but do not shout or argue. Support the leader if you do not have the immediate idea.' },
    { title: 'Command Task Strategy', tip: 'Choose subordinates who are cooperative. Explain the plan clearly. Do not do all physical labor yourself; delegate effectively while directing the construction.' }
  ];

  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto space-y-8 select-none">
      <div>
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-500" /> SSB Syllabus & Study Guides
        </h2>
        <p className="text-xs text-zinc-400 mt-1 max-w-xl">
          Browse specialized preparatory material compiled directly into the vector database. Use these guidelines to structure your responses during evaluations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-900 bg-[#131313] p-1 rounded-xl">
        {[
          { id: 'olq', name: '15 Officer Like Qualities (OLQ)', icon: Award },
          { id: 'psych', name: 'Psychology Test Guidelines', icon: Lightbulb },
          { id: 'gto', name: 'GTO Task Procedures', icon: Target },
        ].map((tab) => {
          const TabIcon = tab.icon;
          const active = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                active 
                  ? 'bg-zinc-800 text-white shadow-md border border-zinc-700/30' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <TabIcon className={`w-3.5 h-3.5 ${active ? 'text-amber-500' : ''}`} />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Tab Panel Content */}
      <div className="bg-[#131313] border border-zinc-900 rounded-2xl p-6 shadow-sm min-h-[300px]">
        {/* OLQs Tab */}
        {selectedCategory === 'olq' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-extrabold text-sm text-zinc-100 flex items-center gap-1.5">
                The 15 Officer Like Qualities (OLQs)
              </h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                The SSB evaluation maps every response and action to these 15 qualities divided into 4 core psychological factors.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4 pt-1">
              {olqList.map((factor) => (
                <div key={factor.factor} className="p-4 rounded-xl bg-[#181818]/60 border border-zinc-900">
                  <h4 className="font-bold text-xs text-amber-500/80 mb-2">{factor.factor}</h4>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {factor.qualities.map((qual, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-zinc-600" />
                        {qual}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Psych Tab */}
        {selectedCategory === 'psych' && (
          <div className="space-y-5">
            <div>
              <h3 className="font-extrabold text-sm text-zinc-100">
                Psychological Battery Techniques
              </h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Written tests designed to evaluate your subconscious and conscious profiling parameters.
              </p>
            </div>

            <div className="space-y-4">
              {psychTips.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#181818]/60 border border-zinc-900 space-y-1">
                  <h4 className="font-bold text-xs text-zinc-200">{item.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{item.tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GTO Tab */}
        {selectedCategory === 'gto' && (
          <div className="space-y-5">
            <div>
              <h3 className="font-extrabold text-sm text-zinc-100">
                Group Testing Officer Outdoor Tasks
              </h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                On-ground physical and planning tasks to test team coordination, resource optimization, and leadership.
              </p>
            </div>

            <div className="space-y-4">
              {gtoTips.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#181818]/60 border border-zinc-900 space-y-1">
                  <h4 className="font-bold text-xs text-zinc-200">{item.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{item.tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Call to Chat action */}
      <div className="p-5 rounded-2xl border border-zinc-900 bg-[#131313] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-bold text-sm text-zinc-200">Practice with your AI Coach</h4>
          <p className="text-xs text-zinc-500">Ask the chatbot to test you on a specific SRT situation or evaluate a TAT story.</p>
        </div>
        <Link 
          href="/chat"
          className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/20 text-zinc-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          Open Chat Room <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
        </Link>
      </div>

    </div>
  );
}
