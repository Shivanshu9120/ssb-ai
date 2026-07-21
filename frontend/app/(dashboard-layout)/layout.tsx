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
  CreditCard
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { apiService } from '@/services/api';

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
  const [isLightMode, setIsLightMode] = useState(false);
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
    { name: 'Profile', href: '/profile', icon: User },
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
    <div className="flex flex-col h-full bg-[#131313] text-zinc-300 border-r border-zinc-900 select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-zinc-900/60">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/10">
          <Ship className="w-5 h-5 text-black" />
        </div>
        <div>
          <span className="font-extrabold text-base tracking-tight text-white block">
            Sea Master
          </span>
          <span className="text-[10px] text-amber-500 font-semibold uppercase tracking-wider block -mt-1">
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
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                active 
                  ? 'bg-zinc-800/80 text-white shadow-sm' 
                  : 'hover:bg-zinc-900 hover:text-zinc-100 text-zinc-400'
              }`}
            >
              <ActiveIcon className={`w-4 h-4 ${active ? 'text-amber-500' : 'text-zinc-500'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Action Button: New Chat */}
      <div className="px-4 py-2">
        <button
          onClick={handleCreateNewChat}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#f0a924] hover:bg-[#e09b1f] text-black font-extrabold text-sm tracking-wide transition-all shadow-md shadow-amber-500/10 hover:scale-[1.01]"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> New Chat
        </button>
      </div>

      {/* Search Input */}
      <div className="px-4 py-2 relative">
        <Search className="w-4 h-4 text-zinc-600 absolute left-7 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search chats..."
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#1b1b1b] border border-zinc-900 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/40 transition-colors"
        />
      </div>

      {/* Dynamic Chat History List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <span className="block text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-3 mb-1">
          Recent Conversations
        </span>

        {loadingHistory ? (
          <div className="flex items-center justify-center py-8 text-zinc-500 text-xs gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
            <span>Loading...</span>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="text-center py-8 text-xs text-zinc-600">
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
                    ? 'bg-zinc-800/50 border-zinc-800/80 text-white font-medium shadow-sm' 
                    : 'border-transparent hover:bg-zinc-900/60 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden mr-2">
                  <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${active ? 'text-amber-500' : 'text-zinc-600'}`} />
                  <span className="text-xs truncate block">{c.title || 'Untitled Chat'}</span>
                </div>
                <button
                  onClick={(e) => openDeleteModal(c.id, c.title || 'Untitled Chat', e)}
                  title="Delete conversation"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/20 transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Area */}
      <div className="p-4 border-t border-zinc-900/60 bg-[#0f0f0f] space-y-4">
        {/* Token Quota Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-semibold">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-zinc-600" /> Token Quota
            </span>
            <span className="font-mono">{(totalTokens / 1000).toFixed(1)}k / 100k</span>
          </div>
          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${tokenQuotaPercent}%` }}
            />
          </div>
          <span className="block text-[8px] text-zinc-600 text-right leading-none">
            Resets daily at midnight
          </span>
        </div>

        {/* Light Mode Switch */}
        <div className="flex items-center justify-between pt-1 border-t border-zinc-900/40">
          <span className="text-xs text-zinc-500 font-semibold">Light Mode</span>
          <button
            onClick={() => setIsLightMode(!isLightMode)}
            className="w-10 h-5.5 rounded-full bg-zinc-900 border border-zinc-800 p-0.5 relative transition-colors cursor-pointer"
          >
            <div 
              className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200 ${
                isLightMode 
                  ? 'translate-x-4 bg-amber-500' 
                  : 'translate-x-0 bg-zinc-700'
              }`}
            >
              {isLightMode ? (
                <Sun className="w-2.5 h-2.5 text-black" />
              ) : (
                <Moon className="w-2.5 h-2.5 text-zinc-300" />
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1e1e1f] text-slate-100 flex overflow-hidden h-screen font-sans">
      
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />
          {/* Drawer menu */}
          <div className="relative flex flex-col w-72 max-w-xs h-full bg-[#131313] shadow-2xl animate-slide-left z-10">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
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
        <header className="h-16 border-b border-zinc-900 bg-[#1e1e1f]/70 backdrop-blur-md flex items-center justify-between px-6 z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/40 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div>
              <h1 className="font-extrabold text-sm text-zinc-100 tracking-tight flex items-center gap-2">
                {getPageTitle()}
              </h1>
              <p className="text-[10px] text-zinc-500 font-semibold tracking-wide uppercase -mt-0.5">
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
                className="flex items-center gap-2.5 p-1 px-2 rounded-xl hover:bg-zinc-800/40 cursor-pointer group transition-colors select-none"
                title="Account Menu"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-extrabold text-xs group-hover:scale-105 transition-transform">
                  {profile?.name ? profile.name.slice(0, 2).toUpperCase() : 'CD'}
                </div>
                <div className="hidden lg:block text-left leading-none">
                  <span className="block text-[11px] font-bold text-zinc-200 group-hover:text-amber-400 transition-colors">
                    {profile?.name || user?.email?.split('@')[0]}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider block mt-0.5">
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
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-zinc-800 bg-[#161618] p-3 shadow-2xl z-30 space-y-3 animate-in fade-in zoom-in-95">
                    {/* Header Info */}
                    <div className="p-2.5 bg-zinc-900/90 rounded-xl border border-zinc-800/80 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-black text-xs text-black shadow-md flex-shrink-0">
                        {profile?.name ? profile.name.slice(0, 2).toUpperCase() : 'CD'}
                      </div>
                      <div className="overflow-hidden">
                        <span className="font-bold text-xs text-white block truncate">
                          {profile?.name || user?.email?.split('@')[0]}
                        </span>
                        <span className="text-[10px] text-amber-500 font-semibold uppercase tracking-wider block">
                          {profile?.profile?.exam || 'SSB Candidate'} • {profile?.plan || 'Free'}
                        </span>
                      </div>
                    </div>

                    {/* Navigation Items in Modal */}
                    <div className="space-y-1">
                      <Link
                        href="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors"
                      >
                        <User className="w-4 h-4 text-amber-500" />
                        <span>Candidate Profile</span>
                      </Link>
                      <Link
                        href="/billing"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors"
                      >
                        <CreditCard className="w-4 h-4 text-amber-500" />
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
        <main className="flex-1 min-h-0 overflow-y-auto relative pb-20 md:pb-0">
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
          { name: 'Timeline', href: '/timeline', icon: Calendar },
          { name: 'Study', href: '/study', icon: BookOpen },
          { name: 'Profile', href: '/profile', icon: User },
          { name: 'Billing', href: '/billing', icon: CreditCard },
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[#1e1e1f] flex items-center justify-center text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    }>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </React.Suspense>
  );
}

