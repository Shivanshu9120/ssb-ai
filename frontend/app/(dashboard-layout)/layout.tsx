'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  Calendar, 
  BookOpen, 
  Plus, 
  Search, 
  MessageSquare, 
  Trash2, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Bell, 
  LogOut, 
  Loader2, 
  Ship,
  ChevronRight,
  Cpu,
  AlertTriangle,
  User,
  CreditCard,
  FileText,
  Palette,
  Anchor,
  Shield,
  Plane,
  MapPin,
  Medal
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { useTheme, THEME_CONFIGS, ThemeMode } from '@/context/ThemeContext';
import { apiService } from '@/services/api';

function MilitaryHatIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M4 14c0-3.5 3.5-7 8-7s8 3.5 8 7" />
      <path d="M2 14h20v2H2z" />
      <path d="M3 16c2.5 2 5.5 2.5 9 2.5s6.5-.5 9-2.5" opacity="0.8" />
      <circle cx="12" cy="10.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function DashboardLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const { chats, loadingHistory, deleteChat, loadChatHistory } = useChat();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeChatId = searchParams.get('id');

  // UI States
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Centralized Theme State
  const { theme, setTheme, config } = useTheme();

  const themeOrder: ThemeMode[] = ['dark', 'airforce', 'navy', 'camo'];
  const handleCycleTheme = () => {
    const currentIndex = themeOrder.indexOf(theme);
    const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
    setTheme(nextTheme);
  };
  const [usage, setUsage] = useState<any>(null);
  const [loadingUsage, setLoadingUsage] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeletingChat, setIsDeletingChat] = useState(false);

  // Fetch usage metrics for the bottom sidebar progress bar
  const fetchUsageMetrics = async () => {
    try {
      setLoadingUsage(true);
      const usageMetrics = await apiService.getUsage();
      const todayStr = new Date().toISOString().split('T')[0];
      const todayUsage = usageMetrics.find((u: any) => u.day === todayStr) || { total_tokens: 0, cost: 0.0 };
      setUsage(todayUsage);
    } catch (err) {
      console.error('Failed to load usage in sidebar:', err);
    } finally {
      setLoadingUsage(false);
    }
  };

  useEffect(() => {
    if (user && !authLoading) {
      fetchUsageMetrics();
    }
  }, [user, authLoading, pathname]); // Refetch on path changes to refresh token stats after queries

  // Filter chats by search query
  const filteredChats = chats.filter(chat => 
    chat.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle New Chat Trigger
  const handleCreateNewChat = () => {
    setMobileOpen(false);
    router.push('/chat');
  };

  // Nav items configuration
  const navigationItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Timeline', href: '/timeline', icon: Calendar },
    { name: 'Study', href: '/study', icon: BookOpen },
    { name: 'PIQ Form', href: '/piq', icon: FileText },
    { name: 'Profile', href: '/profile', icon: User },
    { name: '🎖️ Entry Calculator', href: '/calculator', icon: Medal },
    { name: 'SSB Centres', href: '/centres', icon: MapPin },
    { name: 'Billing', href: '/billing', icon: CreditCard },
  ];

  // Helper to check active state
  const isNavActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const getPageTitle = () => {
    if (pathname.startsWith('/dashboard')) return 'Dashboard';
    if (pathname.startsWith('/chat')) return 'SSB Mentor Room';
    if (pathname.startsWith('/timeline')) return 'SSB Journey Timeline';
    if (pathname.startsWith('/study')) return 'Study Hub';
    if (pathname.startsWith('/profile')) return 'Candidate Profile';
    if (pathname.startsWith('/piq')) return 'PIQ Questionnaire';
    if (pathname.startsWith('/calculator')) return '🎖️ Entry Calculator';
    if (pathname.startsWith('/centres')) return 'SSB Centres & Accommodations';
    if (pathname.startsWith('/billing')) return 'Billing & Subscription';
    return 'Sea Master';
  };

  // Open custom delete modal
  const openDeleteModal = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setChatToDelete({ id, title });
  };

  // Confirm delete handler
  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;
    try {
      setIsDeletingChat(true);
      await deleteChat(chatToDelete.id);
      if (activeChatId === chatToDelete.id) {
        router.push('/chat');
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    } finally {
      setIsDeletingChat(false);
      setChatToDelete(null);
    }
  };

  // Token percentage calculation
  const totalTokens = usage?.total_tokens || 0;
  const tokenQuotaPercent = Math.min(100, (totalTokens / 100000) * 100);

  // Render Sidebar Content (shared between desktop and mobile drawer)
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full theme-bg-sidebar theme-text-secondary border-r theme-border select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b theme-border-subtle">
        <img
          src="/SSBAI-logo.png"
          alt="SSB AI Logo"
          className="w-10 h-10 object-contain rounded-xl shadow-lg border theme-accent-border"
        />
        <div>
          <span className="font-extrabold text-base tracking-tight theme-text-primary block">
            SSB Mentor AI
          </span>
          <span className="text-[10px] theme-accent-text font-semibold uppercase tracking-wider block -mt-1">
            SSB AI Coach
          </span>
        </div>
      </div>

      {/* Main Pages Navigation */}
      <nav className="p-3 space-y-1">
        {navigationItems.map((item) => {
          const ActiveIcon = item.icon;
          const active = isNavActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                active 
                  ? 'theme-bg-card theme-text-primary theme-accent-border shadow-sm' 
                  : 'border-transparent theme-bg-card-hover theme-text-muted hover:theme-text-secondary'
              }`}
            >
              <ActiveIcon className={`w-4 h-4 ${active ? 'theme-accent-text' : 'theme-text-muted'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Action Button: New Chat */}
      <div className="px-4 py-2">
        <button
          onClick={handleCreateNewChat}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl theme-accent-bg theme-accent-bg-hover font-extrabold text-sm tracking-wide transition-all shadow-md theme-accent-glow hover:scale-[1.01] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> New Chat
        </button>
      </div>

      {/* Search Input */}
      <div className="px-4 py-2 relative">
        <Search className="w-4 h-4 theme-text-muted absolute left-7 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search chats..."
          className="w-full pl-9 pr-4 py-2 rounded-xl theme-bg-input border theme-border text-xs theme-text-primary placeholder:theme-text-muted focus:outline-none focus:theme-accent-border transition-colors"
        />
      </div>

      {/* Dynamic Chat History List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <span className="block text-[9px] font-bold theme-text-muted uppercase tracking-widest px-3 mb-1">
          Recent Conversations
        </span>

        {loadingHistory ? (
          <div className="flex items-center justify-center py-8 theme-text-muted text-xs gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin theme-accent-text" />
            <span>Loading...</span>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="text-center py-8 text-xs theme-text-muted">
            {searchQuery ? 'No matching chats' : 'No chats yet'}
          </div>
        ) : (
          filteredChats.map((c) => {
            const active = activeChatId === c.id;
            return (
              <div
                key={c.id}
                onClick={() => {
                  setMobileOpen(false);
                  router.push(`/chat?id=${c.id}`);
                }}
                className={`p-2.5 rounded-xl flex items-center justify-between group cursor-pointer transition-all duration-150 border ${
                  active 
                    ? 'theme-bg-card theme-accent-border theme-text-primary font-medium shadow-sm' 
                    : 'border-transparent theme-bg-card-hover theme-text-muted hover:theme-text-secondary'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden mr-2">
                  <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${active ? 'theme-accent-text' : 'theme-text-muted'}`} />
                  <span className="text-xs truncate block">{c.title || 'Untitled Chat'}</span>
                </div>
                <button
                  onClick={(e) => openDeleteModal(c.id, c.title || 'Untitled Chat', e)}
                  title="Delete conversation"
                  className="p-1.5 rounded-lg theme-text-muted hover:text-rose-400 hover:bg-rose-500/20 transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Area */}
      <div className="p-4 border-t theme-border-subtle theme-bg-bottom space-y-3.5">
        {/* Token Quota Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] theme-text-muted font-semibold">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 theme-text-muted" /> Token Quota
            </span>
            <span className="font-mono">{(totalTokens / 1000).toFixed(1)}k / 100k</span>
          </div>
          <div className="w-full theme-bg-input h-1.5 rounded-full overflow-hidden border theme-border-subtle">
            <div 
              className="theme-accent-bg h-full rounded-full transition-all duration-300"
              style={{ width: `${tokenQuotaPercent}%` }}
            />
          </div>
          <span className="block text-[8px] theme-text-muted text-right leading-none">
            Resets daily at midnight
          </span>
        </div>

        {/* Centralized Theme Badge Switcher */}
        <div className="pt-2.5 border-t theme-border-subtle flex items-center justify-between px-0.5">
          <span className="text-[10px] theme-text-muted font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 theme-accent-text" /> Dashboard Theme
          </span>
          {/* Interactive Badge Toggle Button */}
          <button
            type="button"
            onClick={handleCycleTheme}
            title="Click to switch theme (Dark → Air Force → Navy → Army)"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border theme-accent-border theme-accent-text bg-[var(--theme-accent-bg-subtle)] hover:scale-105 transition-all text-[11px] font-extrabold tracking-wide cursor-pointer shadow-sm active:scale-95"
          >
            {theme === 'dark' && <Moon className="w-3.5 h-3.5 text-current" />}
            {theme === 'airforce' && <Plane className="w-3.5 h-3.5 text-current" />}
            {theme === 'navy' && <Anchor className="w-3.5 h-3.5 text-current" />}
            {theme === 'camo' && <MilitaryHatIcon className="w-3.5 h-3.5 text-current" />}
            <span>{config.shortName}</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen theme-bg-app theme-text-primary flex overflow-hidden h-screen font-sans">
      
      {/* 1. Desktop Sidebar */}
      <aside className="w-72 hidden md:block flex-shrink-0 h-full z-20">
        {renderSidebarContent()}
      </aside>

      {/* 2. Mobile Sidebar Slide-over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay backdrop */}
          <div 
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />
          {/* Drawer menu */}
          <div className="relative flex flex-col w-72 max-w-xs h-full theme-bg-sidebar shadow-2xl animate-slide-left z-10">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 p-2 theme-text-muted hover:theme-text-primary rounded-lg theme-bg-card-hover transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* 3. Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b theme-border theme-bg-header/80 backdrop-blur-md flex items-center justify-between px-6 z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 -ml-2 theme-text-muted hover:theme-text-primary rounded-lg theme-bg-card-hover transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div>
              <h1 className="font-extrabold text-sm theme-text-primary tracking-tight flex items-center gap-2">
                {getPageTitle()}
              </h1>
              <p className="text-[10px] theme-text-muted font-semibold tracking-wide uppercase -mt-0.5">
                SSB Officer Intelligence Companion
              </p>
            </div>
          </div>

          {/* Action area (Right aligned) */}
          <div className="flex items-center gap-4 relative">
            
            {/* Profile Avatar / Details with Dropdown Modal */}
            <div className="relative">
              <div 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 p-1 px-2 rounded-xl theme-bg-card-hover cursor-pointer group transition-colors select-none"
                title="Account Menu"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--theme-accent-bg-subtle)] border theme-accent-border theme-accent-text flex items-center justify-center font-extrabold text-xs group-hover:scale-105 transition-transform">
                  {profile?.name ? profile.name.slice(0, 2).toUpperCase() : 'CD'}
                </div>
                <div className="hidden lg:block text-left leading-none">
                  <span className="block text-[11px] font-bold theme-text-secondary group-hover:theme-accent-text transition-colors">
                    {profile?.name || user?.email?.split('@')[0]}
                  </span>
                  <span className="text-[9px] theme-text-muted font-semibold uppercase tracking-wider block mt-0.5">
                    {profile?.profile?.exam || 'SSB Candidate'}
                  </span>
                </div>
              </div>

              {/* Profile Dropdown Modal */}
              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-20" 
                    onClick={() => setShowProfileMenu(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border theme-border theme-bg-card p-3 shadow-2xl z-30 space-y-3 animate-in fade-in zoom-in-95">
                    {/* Header Info */}
                    <div className="p-2.5 theme-bg-input rounded-xl border theme-border-subtle flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl theme-accent-bg flex items-center justify-center font-black text-xs shadow-md flex-shrink-0">
                        {profile?.name ? profile.name.slice(0, 2).toUpperCase() : 'CD'}
                      </div>
                      <div className="overflow-hidden">
                        <span className="font-bold text-xs theme-text-primary block truncate">
                          {profile?.name || user?.email?.split('@')[0]}
                        </span>
                        <span className="text-[10px] theme-accent-text font-semibold uppercase tracking-wider block">
                          {profile?.profile?.exam || 'SSB Candidate'} • {profile?.plan || 'Free'}
                        </span>
                      </div>
                    </div>

                    {/* Navigation Items in Modal */}
                    <div className="space-y-1">
                      <Link
                        href="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold theme-text-secondary hover:theme-text-primary theme-bg-card-hover transition-colors"
                      >
                        <User className="w-4 h-4 theme-accent-text" />
                        <span>Candidate Profile</span>
                      </Link>
                      <Link
                        href="/billing"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold theme-text-secondary hover:theme-text-primary theme-bg-card-hover transition-colors"
                      >
                        <CreditCard className="w-4 h-4 theme-accent-text" />
                        <span>Billing & Usage</span>
                      </Link>
                    </div>

                    {/* Logout Button inside Profile Modal */}
                    <div className="pt-2 border-t border-zinc-800/80">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          signOut();
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-500/20 border border-rose-500/20 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </header>

        {/* Content body container */}
        <main className="flex-1 min-h-0 overflow-y-auto relative pb-14 md:pb-0">
          {children}
        </main>
      </div>

      {/* 4. Delete Confirmation Application Modal */}
      {chatToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
            onClick={() => !isDeletingChat && setChatToDelete(null)}
          />
          <div className="relative bg-[#18181b] border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl z-10 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Delete Conversation?</h3>
                <p className="text-[11px] text-zinc-400">This action cannot be undone.</p>
              </div>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-3 text-xs text-zinc-300">
              Are you sure you want to delete <span className="font-semibold text-amber-400">"{chatToDelete.title || 'Untitled Chat'}"</span>?
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                disabled={isDeletingChat}
                onClick={() => setChatToDelete(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingChat}
                onClick={confirmDeleteChat}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-lg shadow-rose-600/20"
              >
                {isDeletingChat ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Mobile Footer Navigation (Small Screens) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#131313]/95 backdrop-blur-lg border-t border-zinc-800/80 px-2 py-2 flex items-center justify-around">
        {[
          { name: 'Home', href: '/dashboard', icon: Home },
          { name: 'Study', href: '/study', icon: BookOpen },
          { name: 'Ask', href: '/chat', icon: MessageSquare },
          { name: 'PIQ', href: '/piq', icon: FileText },
          { name: 'Profile', href: '/profile', icon: User },
        ].map((item) => {
          const ItemIcon = item.icon;
          const active = isNavActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all ${
                active 
                  ? 'text-amber-500 font-bold' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ItemIcon className={`w-4.5 h-4.5 ${active ? 'text-amber-500 scale-110' : 'text-zinc-400'} transition-transform`} />
              <span className="text-[9px] tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

import { MilitaryLoader } from '@/components/ui/MilitaryLoader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Suspense fallback={<MilitaryLoader variant="fullscreen" />}>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </React.Suspense>
  );
}

