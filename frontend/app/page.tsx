'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  BookOpen,
  MessageSquare,
  Activity,
  ArrowRight,
  Check,
  Lock,
  Award,
  HelpCircle,
  Menu,
  X,
  Star,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/* ─────────────────────────── JET SVG ─────────────────────────── */
function JetSVG({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      style={style}
      viewBox="0 0 120 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 25 L100 20 L115 25 L100 30 Z" fill="#c8c8c8" />
      <ellipse cx="92" cy="24" rx="10" ry="5" fill="#88aacc" />
      <path d="M40 24 L70 8 L80 24 L70 28 Z" fill="#aaaaaa" />
      <path d="M15 24 L30 16 L35 24 L30 26 Z" fill="#aaaaaa" />
      <path d="M12 24 L22 14 L26 24 Z" fill="#bbbbbb" />
      <circle cx="12" cy="25" r="4" fill="#444" />
      <ellipse cx="91" cy="22" rx="5" ry="2.5" fill="rgba(255,255,255,0.3)" />
    </svg>
  );
}

/* ─────────────────── FLYING JET WITH TRICOLOR SMOKE ─────────────────── */
function TricolorJet() {
  const [run, setRun] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const cycle = () => {
      setRun(true);
      timerRef.current = setTimeout(() => {
        setRun(false);
        timerRef.current = setTimeout(cycle, 4000);
      }, 5000);
    };
    timerRef.current = setTimeout(cycle, 1500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  if (!run) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 5 }}
    >
      <div
        style={{
          position: 'absolute',
          top: '18%',
          left: 0,
          animation: 'jetFly 5s linear forwards',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ height: '5px', borderRadius: '10px', background: 'linear-gradient(to left, rgba(255,153,51,0.9), rgba(255,153,51,0))', animation: 'smokeTrailSaffron 5s linear forwards' }} />
          <div style={{ height: '5px', borderRadius: '10px', background: 'linear-gradient(to left, rgba(255,255,255,0.9), rgba(255,255,255,0))', animation: 'smokeTrailWhite 5s linear forwards' }} />
          <div style={{ height: '5px', borderRadius: '10px', background: 'linear-gradient(to left, rgba(19,136,8,0.9), rgba(19,136,8,0))', animation: 'smokeTrailGreen 5s linear forwards' }} />
        </div>
        <JetSVG style={{ width: '90px', height: '38px', filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.5))' }} />
      </div>
    </div>
  );
}

/* ─────────────────── CAMOUFLAGE BLOB ─────────────────── */
function CamoBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute rounded-full opacity-20" style={{ width: 520, height: 340, top: '5%', left: '-5%', background: 'radial-gradient(ellipse, #2d5a1b 30%, #1a2a0e 100%)', filter: 'blur(40px)' }} />
      <div className="absolute rounded-full opacity-15" style={{ width: 400, height: 280, top: '20%', right: '-8%', background: 'radial-gradient(ellipse, #5c4a2a 30%, #3d2a0e 100%)', filter: 'blur(50px)' }} />
      <div className="absolute rounded-full opacity-25" style={{ width: 300, height: 200, bottom: '10%', left: '30%', background: 'radial-gradient(ellipse, #4a8c2a 30%, #1a2a0e 100%)', filter: 'blur(35px)' }} />
      <div className="absolute rounded-full opacity-10" style={{ width: 250, height: 180, top: '35%', left: '15%', background: 'radial-gradient(ellipse, #FF9933 30%, transparent 100%)', filter: 'blur(60px)' }} />
      <div className="absolute rounded-full opacity-10" style={{ width: 250, height: 180, top: '40%', right: '20%', background: 'radial-gradient(ellipse, #138808 30%, transparent 100%)', filter: 'blur(60px)' }} />
    </div>
  );
}

/* ─────────────────── RADAR RING DECORATION ─────────────────── */
function RadarRing({ size = 200, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" className={className}>
      <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(74,140,42,0.2)" strokeWidth="1" strokeDasharray="4 8" />
      <circle cx="100" cy="100" r="65" fill="none" stroke="rgba(74,140,42,0.15)" strokeWidth="1" strokeDasharray="4 8" />
      <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(74,140,42,0.12)" strokeWidth="1" />
      <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(74,140,42,0.1)" strokeWidth="1" />
      <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(74,140,42,0.1)" strokeWidth="1" />
      <g style={{ transformOrigin: '100px 100px', animation: 'rotateRadar 4s linear infinite' }}>
        <path d="M100 100 L100 10" stroke="rgba(106,176,76,0.7)" strokeWidth="1.5" />
        <path d="M100 100 L170 30" stroke="rgba(106,176,76,0.4)" strokeWidth="1" />
      </g>
      <circle cx="100" cy="100" r="4" fill="rgba(74,140,42,0.8)" />
    </svg>
  );
}

/* ─────────────────── SERVICE CARD ─────────────────── */
interface ServiceCardProps {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  delay: string;
}
function ServiceCard({ icon, title, subtitle, description, color, delay }: ServiceCardProps) {
  return (
    <div
      className="relative group rounded-2xl overflow-hidden animate-fade-up"
      style={{
        animationDelay: delay,
        background: 'rgba(13,26,13,0.8)',
        backdropFilter: 'blur(12px)',
        borderColor: `${color}40`,
        border: `1px solid ${color}40`,
        boxShadow: `0 4px 40px ${color}15`,
      }}
    >
      <div className="absolute inset-0 camo-overlay opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div className="relative p-6 z-10">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" style={{ background: `${color}20`, border: `2px solid ${color}50`, boxShadow: `0 0 20px ${color}30` }}>
          {icon}
        </div>
        <h3 className="font-military text-xl font-bold text-center text-white mb-0.5 tracking-wider">{title}</h3>
        <p className="text-center text-xs font-semibold mb-3 tracking-widest uppercase" style={{ color }}>{subtitle}</p>
        <p className="text-sm text-center leading-relaxed" style={{ color: '#a0b0a0' }}>{description}</p>
      </div>
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: `inset 0 0 30px ${color}15` }} />
    </div>
  );
}

/* ─────────────────── FEATURE CARD ─────────────────── */
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconColor: string;
  delay: string;
}
function FeatureCard({ icon, title, description, iconColor, delay }: FeatureCardProps) {
  return (
    <div
      className="p-6 rounded-2xl border animate-fade-up group cursor-default relative overflow-hidden"
      style={{
        animationDelay: delay,
        background: 'rgba(13,26,13,0.6)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(74,140,42,0.2)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
      }}
    >
      <div className="absolute inset-0 camo-overlay opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
      <div className="relative z-10 w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300" style={{ background: `${iconColor}15`, border: `1.5px solid ${iconColor}40` }}>
        <span style={{ color: iconColor }}>{icon}</span>
      </div>
      <h3 className="relative z-10 font-military text-lg font-bold mb-2 text-white tracking-wide">{title}</h3>
      <p className="relative z-10 text-sm leading-relaxed" style={{ color: '#7a9a7a' }}>{description}</p>
    </div>
  );
}

/* ─────────────────────────── MAIN PAGE ─────────────────────────── */
export default function Home() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const faqs = [
    {
      q: 'How does the AI coach actually help me prepare?',
      a: 'Think of it like having a senior officer mentor available 24/7. You ask any SSB-related question — about group tasks, self-introduction, psychology tests, or interview techniques — and the AI gives you a clear, well-researched answer based on real study material. No vague advice, no generic tips.',
    },
    {
      q: 'Can I add my own notes or study material?',
      a: 'Yes! You can upload your own documents — PDFs, text files, Word documents — and the AI will learn from them too. That means your coaching gets even more personalised over time.',
    },
    {
      q: 'How many questions can I ask per day on the free plan?',
      a: 'Free users can ask up to 20 questions every day. That resets automatically each night so you can start fresh the next morning. Your dashboard shows you exactly how many you have left at any point.',
    },
    {
      q: 'Does this work for all three defence services?',
      a: 'Absolutely. Whether you are appearing for the Army SSB, Navy SSB, or the Air Force Selection Board, our platform covers you. Each service has its own selection style and we help you prepare for exactly that.',
    },
  ];

  return (
    <div className="min-h-screen text-slate-100 font-sans" style={{ background: 'var(--bg-deep)' }}>

      {/* ──────── HEADER ──────── */}
      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(10,15,10,0.92)' : 'rgba(10,15,10,0.75)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(74,140,42,0.2)',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        <div className="tricolor-gradient h-0.5 w-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg font-tech relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2d5a1b, #4a8c2a)', boxShadow: '0 0 20px rgba(74,140,42,0.5)' }}>
              <span className="relative z-10">S</span>
              <div className="absolute inset-0 camo-overlay opacity-40" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight block leading-none" style={{ background: 'linear-gradient(90deg, #8dc870, #ffffff, #6ab04c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: 'Rajdhani, sans-serif' }}>
                SSB Mentor AI
              </span>
              <span className="text-[9px] tracking-widest uppercase" style={{ color: '#4a8c2a' }}>Jai Hind 🇮🇳</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: '#7a9a7a' }}>
            {['#features', '#services', '#how-it-works', '#pricing', '#faq'].map((href) => (
              <a key={href} href={href} className="hover:text-white transition-colors capitalize tracking-wide" style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                {href.replace('#', '').replace('-', ' ')}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link href="/dashboard" className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition-all text-white" style={{ background: 'linear-gradient(135deg, #2d5a1b, #4a8c2a)', boxShadow: '0 0 15px rgba(74,140,42,0.4)', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}>
                Mission Control <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold transition-colors px-3 py-1.5 rounded-md" style={{ color: '#8dc870', border: '1px solid rgba(74,140,42,0.3)', fontFamily: 'Rajdhani, sans-serif' }}>Sign In</Link>
                <Link href="/signup" className="px-4 py-2 rounded-lg font-semibold text-sm transition-all text-white" style={{ background: 'linear-gradient(135deg, #2d5a1b, #4a8c2a)', boxShadow: '0 0 15px rgba(74,140,42,0.4)', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}>Enlist Now</Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg transition-colors" style={{ color: '#8dc870', border: '1px solid rgba(74,140,42,0.2)' }}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-4 flex flex-col gap-3" style={{ borderTop: '1px solid rgba(74,140,42,0.15)', background: 'rgba(10,15,10,0.97)' }}>
            {['#features', '#services', '#how-it-works', '#pricing', '#faq'].map((href) => (
              <a key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="capitalize py-2 font-semibold text-sm" style={{ color: '#7a9a7a', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}>
                {href.replace('#', '').replace('-', ' ')}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2" style={{ borderTop: '1px solid rgba(74,140,42,0.2)' }}>
              {user ? (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 rounded-lg font-bold text-sm text-white" style={{ background: 'linear-gradient(135deg, #2d5a1b, #4a8c2a)' }}>Mission Control</Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 rounded-lg text-sm font-semibold" style={{ border: '1px solid rgba(74,140,42,0.3)', color: '#8dc870' }}>Sign In</Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 rounded-lg text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #2d5a1b, #4a8c2a)' }}>Enlist Now</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ──────── HERO SECTION ──────── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #0a0f0a 0%, #0d1a0d 40%, #111f11 70%, #0a0f0a 100%)' }} />
          <CamoBlobs />
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(74,140,42,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(74,140,42,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <RadarRing size={280} className="absolute top-16 right-6 opacity-40 hidden lg:block" />
        <RadarRing size={140} className="absolute bottom-20 left-8 opacity-25 hidden lg:block" />
        <TricolorJet />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left text */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 animate-fade-up" style={{ background: 'rgba(74,140,42,0.12)', border: '1px solid rgba(74,140,42,0.4)' }}>
                <span className="animate-blink" style={{ color: '#4a8c2a', fontSize: '8px' }}>●</span>
                <span className="font-military text-xs font-bold tracking-widest uppercase" style={{ color: '#8dc870' }}>India&apos;s #1 AI-Powered SSB Coach</span>
                <Award className="w-3.5 h-3.5" style={{ color: '#d4a843' }} />
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6 animate-fade-up delay-100" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                <span style={{ color: '#ffffff' }}>Master the</span>{' '}
                <span style={{ background: 'linear-gradient(135deg, #6ab04c 0%, #8dc870 40%, #4a8c2a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>15 OLQs</span>
                <br />
                <span style={{ color: '#e0e8d0' }}>Serve Your</span>{' '}
                <span style={{ background: 'linear-gradient(90deg, #FF9933, #ffffff, #138808)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Nation</span>
              </h1>

              <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg mb-10 leading-relaxed animate-fade-up delay-200" style={{ color: '#7a9a7a' }}>
                Your personal AI coach that trains you like a real officer — for Army, Navy &amp; Air Force SSB.
                Get instant answers, study smarter, and walk into your interview board with unshakeable confidence.
              </p>

              <div className="flex items-center gap-0 mb-10 animate-fade-up delay-200 lg:justify-start justify-center">
                <div className="h-1 w-20 rounded-l-full" style={{ background: '#FF9933' }} />
                <div className="h-1 w-20" style={{ background: '#ffffff' }} />
                <div className="h-1 w-20 rounded-r-full" style={{ background: '#138808' }} />
              </div>

              <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4 animate-fade-up delay-300">
                <Link
                  href={user ? '/dashboard' : '/signup'}
                  className="group flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-base transition-all text-white w-full sm:w-auto justify-center"
                  style={{ background: 'linear-gradient(135deg, #2d5a1b 0%, #4a8c2a 50%, #3d7a22 100%)', boxShadow: '0 0 25px rgba(74,140,42,0.5), 0 4px 15px rgba(0,0,0,0.4)', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.08em' }}
                >
                  <span>Begin Mission</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#services"
                  className="group flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-base transition-all w-full sm:w-auto justify-center"
                  style={{ border: '1.5px solid rgba(74,140,42,0.5)', background: 'rgba(74,140,42,0.08)', color: '#8dc870', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.08em' }}
                >
                  View Services
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                </a>
              </div>

              <div className="flex items-center gap-8 mt-12 lg:justify-start justify-center animate-fade-up delay-400">
                {[{ num: '15', label: 'Officer Qualities' }, { num: '3', label: 'Defence Arms' }, { num: '100%', label: 'Exam Focused' }].map(({ num, label }) => (
                  <div key={label} className="text-center">
                    <div className="font-tech text-2xl font-bold" style={{ color: '#6ab04c' }}>{num}</div>
                    <div className="text-xs tracking-wider uppercase mt-0.5" style={{ color: '#5a7a5a' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right visual card */}
            <div className="flex-1 flex justify-center lg:justify-end animate-slide-right delay-300">
              <div className="relative w-full max-w-sm">
                <div
                  className="relative rounded-3xl overflow-hidden"
                  style={{ background: 'rgba(13,26,13,0.85)', backdropFilter: 'blur(20px)', border: '1.5px solid rgba(74,140,42,0.35)', boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 50px rgba(74,140,42,0.15)' }}
                >
                  <div className="absolute inset-0 camo-overlay opacity-25" />
                  <div className="relative h-1.5 w-full tricolor-gradient" />
                  <div className="relative p-6 z-10">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-tech font-bold" style={{ background: 'rgba(74,140,42,0.3)', border: '1px solid rgba(74,140,42,0.5)', color: '#8dc870' }}>AI</div>
                        <div>
                          <p className="text-xs font-bold text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>SSB MENTOR AI</p>
                          <p className="text-[10px]" style={{ color: '#4a8c2a' }}>● ONLINE</p>
                        </div>
                      </div>
                      <div className="text-xs" style={{ color: '#5a7a5a', fontFamily: 'monospace' }}>v2.1.0</div>
                    </div>

                    <div className="space-y-3 mb-5">
                      <div className="rounded-xl p-3 text-xs leading-relaxed" style={{ background: 'rgba(74,140,42,0.1)', border: '1px solid rgba(74,140,42,0.2)', color: '#a0c090' }}>
                        <span className="font-bold text-white block mb-1">🎖 SSB Mentor</span>
                        "Effective leadership in the Officer Selection Board is assessed through your spontaneity, planning, and sense of responsibility during GTO tasks…"
                      </div>
                      <div className="rounded-xl p-3 text-xs ml-4 leading-relaxed" style={{ background: 'rgba(26,42,14,0.8)', border: '1px solid rgba(74,140,42,0.15)', color: '#7a9a7a' }}>
                        <span className="font-bold" style={{ color: '#6ab04c' }}>You →</span>
                        {' '}What are the key OLQs tested in Group Discussion?
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-5">
                      {[{ emoji: '🪖', name: 'Army', color: '#4a8c2a' }, { emoji: '⚓', name: 'Navy', color: '#2a6b8c' }, { emoji: '✈️', name: 'Air Force', color: '#8c6b2a' }].map(({ emoji, name, color }) => (
                        <div key={name} className="rounded-lg py-2 text-center" style={{ background: `${color}18`, border: `1px solid ${color}40` }}>
                          <div className="text-base">{emoji}</div>
                          <div className="text-[9px] mt-0.5 font-bold tracking-wider uppercase" style={{ color, fontFamily: 'Rajdhani, sans-serif' }}>{name}</div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(74,140,42,0.15)' }}>
                      <div className="flex justify-between text-[10px] mb-2" style={{ color: '#5a7a5a', fontFamily: 'monospace' }}>
                        <span>DAILY MISSIONS</span>
                        <span style={{ color: '#6ab04c' }}>14 / 20</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(74,140,42,0.15)' }}>
                        <div className="h-full rounded-full" style={{ width: '70%', background: 'linear-gradient(90deg, #2d5a1b, #6ab04c)', boxShadow: '0 0 8px rgba(74,140,42,0.6)' }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full animate-pulse-glow" style={{ background: 'rgba(74,140,42,0.6)' }} />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full" style={{ background: 'rgba(255,153,51,0.6)' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #0a0f0a)' }} />
      </section>

      {/* ──────── THREE SERVICES ──────── */}
      <section id="services" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 camo-pattern opacity-30" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0a0f0a 0%, rgba(13,26,13,0.4) 50%, #0a0f0a 100%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ background: 'rgba(74,140,42,0.1)', border: '1px solid rgba(74,140,42,0.3)' }}>
              <span className="font-military text-xs tracking-widest uppercase font-bold" style={{ color: '#6ab04c' }}>One Platform. All Three Arms.</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-white" style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.02em' }}>
              Train for{' '}
              <span style={{ background: 'linear-gradient(90deg, #6ab04c, #8dc870)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>All Three Arms</span>
              {' '}of Defence
            </h2>
            <p className="max-w-xl mx-auto text-sm leading-relaxed" style={{ color: '#5a7a5a' }}>
              Whether you dream of wearing olive green, navy white, or air force blue — we prepare you for exactly the interview board you&apos;re facing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard icon="🪖" title="Indian Army" subtitle="ARMY SSB · OTA · IMA" description="From your first written test to the final interview, we coach you on every stage — how to tell your story, lead your group, and think like the officer you were born to be." color="#4a8c2a" delay="0s" />
            <ServiceCard icon="⚓" title="Indian Navy" subtitle="NAVY SSB · CDS · NDA" description="Stand tall on the parade ground with confidence. We help you master the Navy's selection process — from group discussions to the Personal Interview with the assessors." color="#2a6b8c" delay="0.15s" />
            <ServiceCard icon="✈️" title="Indian Air Force" subtitle="IAF AFSB · AFCAT" description="The sky is not the limit — it's your starting point. Get ready for the Air Force board with sharp thinking, strong leadership presence, and answers that make assessors sit up." color="#8c6b2a" delay="0.3s" />
          </div>

          <div className="flex justify-center mt-16">
            <div className="flex gap-0 rounded-full overflow-hidden h-1.5 w-60">
              <div className="flex-1" style={{ background: '#FF9933' }} />
              <div className="flex-1" style={{ background: '#ffffff' }} />
              <div className="flex-1" style={{ background: '#138808' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ──────── FEATURES ──────── */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0a0f0a 0%, #0d1a0d 50%, #0a0f0a 100%)' }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(74,140,42,1) 1px, transparent 1px), linear-gradient(90deg, rgba(74,140,42,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ background: 'rgba(74,140,42,0.1)', border: '1px solid rgba(74,140,42,0.3)' }}>
              <span className="font-military text-xs tracking-widest uppercase font-bold" style={{ color: '#6ab04c' }}>Why Aspirants Love Us</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Built for{' '}
              <span style={{ background: 'linear-gradient(90deg, #6ab04c, #8dc870)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>One Purpose</span>
            </h2>
            <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: '#5a7a5a' }}>
              Every feature is designed with a single goal — to give you the best possible shot at cracking your SSB interview.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard icon={<BookOpen className="w-5 h-5" />} title="Answers Backed by Real Books" description="Every answer your AI coach gives is pulled from real SSB preparation material — official psychology guides, past board patterns, and expert-curated study content. No guesswork, ever." iconColor="#6ab04c" delay="0s" />
            <FeatureCard icon={<MessageSquare className="w-5 h-5" />} title="Chat Like You're in Training" description="Talk to your AI mentor the same way you'd talk to a senior officer. Ask anything — from how to structure your self-introduction to handling tough interview questions — and get instant, sharp answers." iconColor="#2a9d8c" delay="0.15s" />
            <FeatureCard icon={<Activity className="w-5 h-5" />} title="Track Your Daily Progress" description="See at a glance how much you've studied each day, how many questions you've asked, and where you stand on your preparation. Stay consistent. Stay ahead." iconColor="#d4a843" delay="0.3s" />
          </div>
        </div>
      </section>

      {/* ──────── HOW IT WORKS ──────── */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 camo-overlay opacity-20" />
        <div className="absolute inset-0" style={{ background: 'rgba(10,15,10,0.7)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ background: 'rgba(74,140,42,0.1)', border: '1px solid rgba(74,140,42,0.3)' }}>
              <span className="font-military text-xs tracking-widest uppercase font-bold" style={{ color: '#6ab04c' }}>Simple as 1 — 2 — 3</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Getting Started is{' '}
              <span style={{ background: 'linear-gradient(90deg, #6ab04c, #8dc870)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Effortless</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Your Free Account', desc: 'Sign up in under 60 seconds. Tell us which service you are targeting — Army, Navy, or Air Force — and we personalise your coaching experience right away.', icon: '🎯', color: '#4a8c2a' },
              { step: '02', title: 'Ask. Learn. Grow.', desc: 'Type any SSB question — "How do I handle a GD where no one listens?" or "What does a good self-introduction sound like?" — and get a sharp, expert-level answer instantly.', icon: '🤖', color: '#2a9d8c' },
              { step: '03', title: 'See Your Confidence Rise', desc: 'Track how much you practise each day. Review what you learned, revisit tough topics, and walk into your board feeling 100% prepared and battle-ready.', icon: '📊', color: '#d4a843' },
            ].map(({ step, title, desc, icon, color }, i) => (
              <div key={step} className="relative animate-fade-up" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="relative z-10 rounded-2xl p-6 text-center" style={{ background: 'rgba(13,26,13,0.7)', backdropFilter: 'blur(12px)', border: `1px solid ${color}30`, boxShadow: `0 4px 30px ${color}10` }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4" style={{ background: `${color}15`, border: `2px solid ${color}40` }}>{icon}</div>
                  <div className="font-tech text-3xl font-black mb-2" style={{ color: `${color}60` }}>{step}</div>
                  <h3 className="font-military text-lg font-bold mb-2 text-white tracking-wide">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#5a7a5a' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── PRICING ──────── */}
      <section id="pricing" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0a0f0a 0%, #0d1a0d 50%, #0a0f0a 100%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ background: 'rgba(74,140,42,0.1)', border: '1px solid rgba(74,140,42,0.3)' }}>
              <span className="font-military text-xs tracking-widest uppercase font-bold" style={{ color: '#6ab04c' }}>Simple, Honest Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Start Free.{' '}<span style={{ background: 'linear-gradient(90deg, #6ab04c, #8dc870)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Upgrade Anytime.</span>
            </h2>
            <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: '#5a7a5a' }}>
              No credit card needed to start. Begin practising today for free — upgrade whenever you want more.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="rounded-2xl p-8 flex flex-col justify-between" style={{ background: 'rgba(13,26,13,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(74,140,42,0.2)' }}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🪖</span>
                  <h3 className="font-military text-xl font-bold text-white tracking-wider">Recruit Tier</h3>
                </div>
                <p className="text-xs mb-6 tracking-wide" style={{ color: '#5a7a5a' }}>Just starting out? This is perfect for you.</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-tech text-4xl font-black text-white">₹0</span>
                  <span className="text-sm" style={{ color: '#5a7a5a' }}>/ month</span>
                </div>
                <ul className="space-y-3.5 mb-8">
                  {['20 Questions Per Day with Your AI Coach', 'Answers from Real SSB Study Material', 'Source References with Every Answer', 'All 15 Officer Qualities Covered'].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: '#a0b090' }}>
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#4a8c2a' }} />{item}
                    </li>
                  ))}
                  <li className="flex items-center gap-2.5 text-sm" style={{ color: '#3a4a3a' }}>
                    <Lock className="w-3.5 h-3.5 flex-shrink-0" />Faster Priority Responses
                  </li>
                </ul>
              </div>
              <Link href={user ? '/dashboard' : '/signup'} className="w-full text-center py-3 rounded-xl font-bold text-sm transition-all" style={{ border: '1.5px solid rgba(74,140,42,0.4)', background: 'rgba(74,140,42,0.08)', color: '#8dc870', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.08em' }}>
                ENLIST FOR FREE
              </Link>
            </div>

            {/* Premium Tier */}
            <div className="relative rounded-2xl p-8 flex flex-col justify-between overflow-hidden" style={{ background: 'rgba(13,26,13,0.85)', backdropFilter: 'blur(16px)', border: '1.5px solid rgba(74,140,42,0.5)', boxShadow: '0 0 40px rgba(74,140,42,0.15)' }}>
              <div className="absolute inset-0 camo-overlay opacity-20" />
              <div className="absolute -top-px left-6 px-3 py-1 rounded-b-lg text-[10px] font-bold tracking-widest uppercase text-white" style={{ background: 'linear-gradient(135deg, #2d5a1b, #4a8c2a)' }}>🎖 RECOMMENDED</div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1 mt-4">
                  <span className="text-lg">⭐</span>
                  <h3 className="font-military text-xl font-bold text-white tracking-wider">Officer Tier</h3>
                </div>
                <p className="text-xs mb-6 tracking-wide" style={{ color: '#5a7a5a' }}>For aspirants who are serious about getting selected.</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-tech text-4xl font-black" style={{ color: '#8dc870' }}>₹999</span>
                  <span className="text-sm" style={{ color: '#5a7a5a' }}>/ month</span>
                </div>
                <ul className="space-y-3.5 mb-8">
                  {['Unlimited Daily Questions — No Cap', 'Lightning-Fast Responses, Always', 'Smarter, More Detailed Answers', 'Upload Your Own Notes & Study Material', 'Army, Navy & Air Force — All Covered'].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: '#a0b090' }}>
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#6ab04c' }} />{item}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className="relative z-10 w-full py-3 rounded-xl font-bold text-sm text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #2d5a1b, #4a8c2a)', boxShadow: '0 0 20px rgba(74,140,42,0.4)', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.08em' }}
                onClick={() => alert('We are setting this up! Paid plans will launch soon. Contact us to get early access.')}
              >
                GET OFFICER ACCESS — COMING SOON
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ──────── FAQ ──────── */}
      <section id="faq" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 camo-overlay opacity-15" />
        <div className="absolute inset-0" style={{ background: 'rgba(10,15,10,0.75)' }} />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ background: 'rgba(74,140,42,0.1)', border: '1px solid rgba(74,140,42,0.3)' }}>
              <span className="font-military text-xs tracking-widest uppercase font-bold" style={{ color: '#6ab04c' }}>Got Questions? We&apos;ve Got Answers.</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Things People Ask <span style={{ background: 'linear-gradient(90deg, #6ab04c, #8dc870)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>All the Time</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl overflow-hidden" style={{ border: openFaq === i ? '1px solid rgba(74,140,42,0.5)' : '1px solid rgba(74,140,42,0.15)', background: 'rgba(13,26,13,0.7)', backdropFilter: 'blur(8px)', transition: 'border-color 0.3s' }}>
                <button className="w-full text-left px-5 py-4 flex items-center justify-between gap-4" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#4a8c2a' }} />
                    <span className="font-military font-bold text-sm text-white tracking-wide">{faq.q}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform duration-300" style={{ color: '#4a8c2a', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: '#7a9a7a', borderTop: '1px solid rgba(74,140,42,0.1)' }}>
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── CTA BANNER ──────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(45,90,27,0.3) 0%, rgba(13,26,13,0.95) 50%, rgba(26,42,14,0.3) 100%)' }} />
        <div className="absolute inset-0 camo-overlay opacity-20" />
        <div className="absolute top-0 left-0 right-0 flex h-1">
          <div className="flex-1" style={{ background: '#FF9933' }} />
          <div className="flex-1" style={{ background: '#ffffff' }} />
          <div className="flex-1" style={{ background: '#138808' }} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-4">🇮🇳</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-white" style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.02em' }}>Your Dream Uniform Is One Step Away</h2>
          <p className="text-base mb-8 leading-relaxed" style={{ color: '#7a9a7a' }}>
            Stop guessing. Stop cramming alone. Start training with an AI coach that knows exactly what your selection board is looking for.
          </p>
          <Link href={user ? '/dashboard' : '/signup'} className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base text-white transition-all" style={{ background: 'linear-gradient(135deg, #2d5a1b, #4a8c2a)', boxShadow: '0 0 30px rgba(74,140,42,0.5)', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.08em' }}>
            Start Coaching for Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ──────── FOOTER ──────── */}
      <footer className="py-10 relative" style={{ borderTop: '1px solid rgba(74,140,42,0.15)', background: '#0a0f0a' }}>
        <div className="absolute bottom-0 left-0 right-0 flex h-0.5">
          <div className="flex-1" style={{ background: '#FF9933' }} />
          <div className="flex-1" style={{ background: '#ffffff' }} />
          <div className="flex-1" style={{ background: '#138808' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm font-tech" style={{ background: 'linear-gradient(135deg, #2d5a1b, #4a8c2a)', boxShadow: '0 0 12px rgba(74,140,42,0.4)' }}>S</div>
            <span className="font-military font-bold tracking-wider" style={{ color: '#8dc870' }}>SSB MENTOR AI</span>
          </div>
          <p className="text-xs mb-1" style={{ color: '#3a5a3a' }}>
            © {new Date().getFullYear()} SSB Mentor AI. All rights reserved. | Jai Hind 🇮🇳
          </p>
          <p className="text-xs" style={{ color: '#2a3a2a' }}>
            Powered by advanced AI · Trusted by defence aspirants across India
          </p>
        </div>
      </footer>
    </div>
  );
}
