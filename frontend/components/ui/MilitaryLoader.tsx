'use client';

import React, { useEffect, useState } from 'react';
import { Plane, Shield, Radio, Crosshair, Cpu } from 'lucide-react';

export interface MilitaryLoaderProps {
  variant?: 'fullscreen' | 'card' | 'spinner' | 'inline';
  message?: string;
  className?: string;
}

const TELEMETRY_MESSAGES = [
  "INITIALIZING TACTICAL RADAR HUD...",
  "AUTHENTICATING OFFICER CREDENTIALS...",
  "ESTABLISHING SECURE DEFENSE NETWORK LINK...",
  "SYNCING PSYCHOLOGICAL TEST DATASETS (PPDT, TAT, SRT)...",
  "CALIBRATING OFFICER LIKE QUALITIES (OLQ) ENGINE...",
  "TACTICAL COMMAND CENTER READY."
];

// SVG Fighter Jet Silhouette Vector (Top-down / Fighter Jet view)
function FighterJetSVG({ className = "w-6 h-6", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L10.5 7.5L3 11V13.5L10.5 12.5L10.5 18.5L7.5 20.5V22L12 20.5L16.5 22V20.5L13.5 18.5L13.5 12.5L21 13.5V11L13.5 7.5L12 2Z" />
    </svg>
  );
}

export function MilitaryLoader({
  variant = 'fullscreen',
  message,
  className = '',
}: MilitaryLoaderProps) {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    if (variant !== 'fullscreen') return;
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % TELEMETRY_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [variant]);

  // Small button/inline spinner variant
  if (variant === 'spinner') {
    return (
      <span className={`inline-flex items-center justify-center relative ${className}`}>
        <span className="w-4 h-4 border-2 border-dashed border-current rounded-full animate-radar-sweep opacity-80" />
        <Crosshair className="w-2.5 h-2.5 absolute text-current animate-ping opacity-40" />
      </span>
    );
  }

  // Card / Inline widget variant
  if (variant === 'card' || variant === 'inline') {
    return (
      <div className={`p-6 rounded-2xl theme-bg-card border theme-border flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden select-none ${className}`}>
        {/* Subtle Jet overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
          <FighterJetSVG className="w-40 h-40 animate-jet-horizontal text-[var(--theme-accent)]" />
        </div>

        {/* Small Radar HUD */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-dashed theme-accent-border animate-radar-sweep" />
          <div className="absolute inset-2 rounded-full border theme-border animate-sonar-ripple" />
          <div className="w-8 h-8 rounded-full bg-[var(--theme-accent-bg-subtle)] border theme-accent-border flex items-center justify-center theme-accent-text z-10 shadow-lg">
            <FighterJetSVG className="w-4 h-4 text-current" />
          </div>
        </div>

        <div>
          <h4 className="font-extrabold text-xs tracking-wider theme-text-primary uppercase font-military">
            {message || "Processing Defense Request..."}
          </h4>
          <p className="text-[10px] theme-text-muted font-mono mt-0.5 animate-pulse">
            OPERATIONAL STATUS: ACTIVE
          </p>
        </div>
      </div>
    );
  }

  // Default: Fullscreen Command Center Radar HUD Loader
  return (
    <div className={`fixed inset-0 z-50 theme-bg-app flex flex-col items-center justify-center overflow-hidden select-none font-sans ${className}`}>
      {/* Background Camo & Radar Scanlines */}
      <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none" />
      
      {/* Subtle Grid Lines Overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(var(--theme-border) 1px, transparent 1px), linear-gradient(90deg, var(--theme-border) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* ===== FLYING FIGHTER JETS WITH TRICOLOR TRAILS ===== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Jet 1: Diagonal Cross Flyby */}
        <div className="absolute w-full h-full animate-jet-diagonal top-0 left-0">
          <div className="relative">
            {/* Jet Silhouette */}
            <div className="text-[var(--theme-accent)] filter drop-shadow(0 0 10px var(--theme-accent-glow))">
              <FighterJetSVG className="w-10 h-10 transform -rotate-45" />
            </div>
            {/* Tricolor Smoke Trails */}
            <div className="absolute top-1/2 left-[-180px] -translate-y-1/2 flex flex-col gap-[2px] opacity-75">
              <div className="h-[2px] w-[180px] bg-[#FF9933] blur-[0.5px] rounded-full shadow-[0_0_8px_#FF9933]" />
              <div className="h-[2px] w-[170px] bg-[#FFFFFF] blur-[0.5px] rounded-full shadow-[0_0_8px_#FFFFFF]" />
              <div className="h-[2px] w-[160px] bg-[#138808] blur-[0.5px] rounded-full shadow-[0_0_8px_#138808]" />
            </div>
          </div>
        </div>

        {/* Jet 2: Horizontal High-Speed Patrol */}
        <div className="absolute w-full top-1/4 animate-jet-horizontal left-0">
          <div className="relative">
            <div className="theme-accent-text filter drop-shadow(0 0 8px var(--theme-accent-glow))">
              <FighterJetSVG className="w-8 h-8 transform rotate-90" />
            </div>
            <div className="absolute top-1/2 right-full -translate-y-1/2 flex flex-col gap-[2px] opacity-60">
              <div className="h-[1.5px] w-[140px] bg-[#FF9933] blur-[0.5px]" />
              <div className="h-[1.5px] w-[130px] bg-[#FFFFFF] blur-[0.5px]" />
              <div className="h-[1.5px] w-[120px] bg-[#138808] blur-[0.5px]" />
            </div>
          </div>
        </div>
      </div>

      {/* ===== FOUR CORNER HUD BRACKETS ===== */}
      <div className="absolute top-3 left-3 sm:top-6 sm:left-6 flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[10px] font-mono theme-text-muted opacity-80 border-t-2 border-l-2 theme-accent-border pt-1 pl-1.5 sm:pt-2 sm:pl-2 max-w-[42%] sm:max-w-none">
        <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 theme-accent-text flex-shrink-0" />
        <span className="tracking-wider sm:tracking-widest font-extrabold uppercase truncate">
          <span className="hidden sm:inline">SYS.SYS // 28.6139° N 77.2090° E</span>
          <span className="sm:hidden">SYS.SYS // 28.61° N</span>
        </span>
      </div>

      <div className="absolute top-3 right-3 sm:top-6 sm:right-6 flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[10px] font-mono theme-text-muted opacity-80 border-t-2 border-r-2 theme-accent-border pt-1 pr-1.5 sm:pt-2 sm:pr-2 text-right justify-end max-w-[42%] sm:max-w-none">
        <span className="tracking-wider sm:tracking-widest font-extrabold uppercase truncate">
          <span className="hidden sm:inline">DEFENSE CLASS // CONFIDENTIAL</span>
          <span className="sm:hidden">CONFIDENTIAL</span>
        </span>
        <Radio className="w-3 h-3 sm:w-3.5 sm:h-3.5 theme-accent-text flex-shrink-0" />
      </div>

      <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 text-[8px] sm:text-[10px] font-mono theme-text-muted opacity-80 border-b-2 border-l-2 theme-accent-border pb-1 pl-1.5 sm:pb-2 sm:pl-2 max-w-[42%] sm:max-w-none">
        <span className="tracking-wider sm:tracking-widest font-extrabold uppercase truncate">
          <span className="hidden sm:inline">SECURE LINK: ENCRYPTED (AES-256)</span>
          <span className="sm:hidden">SECURE LINK: ENCRYPTED</span>
        </span>
      </div>

      <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 text-[8px] sm:text-[10px] font-mono theme-text-muted opacity-80 border-b-2 border-r-2 theme-accent-border pb-1 pr-1.5 sm:pb-2 sm:pr-2 text-right max-w-[42%] sm:max-w-none">
        <span className="tracking-wider sm:tracking-widest font-extrabold uppercase truncate">
          <span className="hidden sm:inline">INDIAN ARMED FORCES SSB ENGINE</span>
          <span className="sm:hidden">SSB ENGINE</span>
        </span>
      </div>

      {/* ===== CENTRAL TACTICAL RADAR HUD DISPLAY ===== */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        
        {/* Radar Ring Container */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          
          {/* Outer Compass Degree Ticks (0, 90, 180, 270) */}
          <div className="absolute inset-0 rounded-full border border-[var(--theme-border)] opacity-60" />
          <span className="absolute -top-6 text-[10px] font-mono font-bold theme-accent-text">N 000°</span>
          <span className="absolute -right-8 text-[10px] font-mono font-bold theme-accent-text">E 090°</span>
          <span className="absolute -bottom-6 text-[10px] font-mono font-bold theme-accent-text">S 180°</span>
          <span className="absolute -left-8 text-[10px] font-mono font-bold theme-accent-text">W 270°</span>

          {/* Sonar Ripple pulse */}
          <div className="absolute inset-4 rounded-full border-2 theme-accent-border animate-sonar-ripple pointer-events-none" />
          
          {/* Rotating Radar Sweep Line & Beam */}
          <div className="absolute inset-2 rounded-full border border-dashed theme-accent-border animate-radar-sweep overflow-hidden">
            <div 
              className="absolute top-1/2 left-1/2 w-1/2 h-1/2 origin-top-left"
              style={{
                background: 'conic-gradient(from 0deg, var(--theme-accent-glow) 0deg, transparent 60deg, transparent 360deg)',
              }}
            />
          </div>

          {/* Concentric Crosshairs */}
          <div className="absolute inset-12 rounded-full border border-[var(--theme-border-subtle)] opacity-80" />
          <div className="absolute w-full h-[1px] theme-bg-card border-t border-dashed theme-border" />
          <div className="absolute h-full w-[1px] theme-bg-card border-l border-dashed theme-border" />

          {/* Center Target Lock Badge */}
          <div className="relative z-20 w-24 h-24 rounded-2xl theme-bg-card border-2 theme-accent-border flex flex-col items-center justify-center shadow-2xl theme-accent-glow p-2">
            {/* Indian Armed Forces Emblem / Logo */}
            <img
              src="/SSBAI-logo.png"
              alt="SSB AI Logo"
              className="w-10 h-10 object-contain rounded-lg animate-pulse"
            />
            <span className="text-[9px] font-mono font-black theme-accent-text tracking-widest uppercase mt-1">
              SSB AI
            </span>
          </div>

          {/* Radar Blip Target Markers */}
          <div className="absolute top-12 left-16 w-2.5 h-2.5 rounded-full theme-accent-bg animate-ping opacity-75" />
          <div className="absolute bottom-16 right-16 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-90 delay-300" />
        </div>

        {/* ===== TELEMETRY STATUS & PROGRESS TEXT ===== */}
        <div className="text-center space-y-3 max-w-md px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border theme-accent-border bg-[var(--theme-accent-bg-subtle)] theme-accent-text text-xs font-extrabold uppercase tracking-widest shadow-sm">
            <Cpu className="w-3.5 h-3.5 animate-spin" />
            <span>COMMAND HUD SYSTEM ACTIVE</span>
          </div>

          <h3 className="text-sm md:text-base font-extrabold theme-text-primary uppercase tracking-wider font-military min-h-[24px]">
            {message || TELEMETRY_MESSAGES[msgIdx]}
          </h3>

          {/* Tricolor Indicator Line */}
          <div className="w-48 h-1 mx-auto rounded-full tricolor-gradient shadow-sm animate-tricolor" />

          <p className="text-[10px] theme-text-muted font-mono tracking-widest uppercase">
            STAND BY OFFICER • SYSTEM RESPONSIVE
          </p>
        </div>

      </div>
    </div>
  );
}

export default MilitaryLoader;
