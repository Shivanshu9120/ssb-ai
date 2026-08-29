'use client';

import React from 'react';

interface CategoryFilterProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

const CATEGORIES = [
  'All',
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

export function CategoryFilter({ activeCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
              isActive
                ? 'theme-accent-bg theme-accent-border theme-text-primary shadow-sm scale-[1.02]'
                : 'border-zinc-800 bg-[#141814] text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
