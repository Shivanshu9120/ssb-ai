'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'dark' | 'airforce' | 'navy' | 'camo';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  shortName: string;
  subtitle: string;
  badgeBg: string;
  badgeBorder: string;
  accentColor: string;
}

export const THEME_CONFIGS: Record<ThemeMode, ThemeConfig> = {
  dark: {
    id: 'dark',
    name: 'Dark Mode',
    shortName: 'Dark',
    subtitle: 'Tactical Obsidian',
    badgeBg: 'bg-amber-500/20',
    badgeBorder: 'border-amber-500/40',
    accentColor: '#f0a924',
  },
  airforce: {
    id: 'airforce',
    name: 'Air Force',
    shortName: 'Air Force',
    subtitle: 'Sky Blue Aviation',
    badgeBg: 'bg-sky-500/20',
    badgeBorder: 'border-sky-500/40',
    accentColor: '#38bdf8',
  },
  navy: {
    id: 'navy',
    name: 'Navy',
    shortName: 'Navy',
    subtitle: 'Maritime Deep Abyss',
    badgeBg: 'bg-blue-600/20',
    badgeBorder: 'border-blue-500/40',
    accentColor: '#60a5fa',
  },
  camo: {
    id: 'camo',
    name: 'Army Camo',
    shortName: 'Army',
    subtitle: 'Woodland Olive Uniform',
    badgeBg: 'bg-lime-600/20',
    badgeBorder: 'border-lime-500/40',
    accentColor: '#84cc16',
  },
};

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  config: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'ssb_dashboard_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY) as ThemeMode;
      if (savedTheme && THEME_CONFIGS[savedTheme]) {
        setThemeState(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (e) {
      console.error('Failed to persist theme:', e);
    }
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const config = THEME_CONFIGS[theme] || THEME_CONFIGS.dark;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, config }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
