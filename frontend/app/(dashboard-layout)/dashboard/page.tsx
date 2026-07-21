'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Award, 
  MessageSquare, 
  Activity, 
  UploadCloud, 
  Plus, 
  Trash2, 
  Loader2, 
  CheckCircle, 
  ShieldAlert,
  TrendingUp,
  ArrowRight,
  BookOpen,
  User,
  Settings,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { apiService } from '@/services/api';
import NamespaceExplorer from './NamespaceExplorer';

export default function Dashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const { chats, loadingHistory, deleteChat, loadChatHistory } = useChat();
  const [usage, setUsage] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<'chats' | 'admin'>('chats');
  
  // File upload & namespaces state
  const [uploadTopic, setUploadTopic] = useState('psychology');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [indexLoading, setIndexLoading] = useState(false);
  const [indexSuccess, setIndexSuccess] = useState('');
  const [indexError, setIndexError] = useState('');

  // Delete modal state
  const [chatToDelete, setChatToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeletingChat, setIsDeletingChat] = useState(false);

  const [availableTopics, setAvailableTopics] = useState<string[]>([
    "psychology", "interview", "gto", "wat", "srt", "tat", 
    "lecturette", "current_affairs", "olq", "army", "navy", "airforce"
  ]);

  const router = useRouter();

  const loadTopicsList = async () => {
    try {
      const res = await apiService.getNamespaces();
      if (res?.namespaces) {
        const topics = res.namespaces.map((ns: any) => ns.topic);
        setAvailableTopics(topics);
      }
    } catch (err) {
      console.error('Failed to load namespaces list for upload dropdown:', err);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoadingData(true);
      const usageMetrics = await apiService.getUsage();
      setUsage(usageMetrics);
    } catch (err) {
      console.error('Failed to load dashboard usage statistics:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        loadDashboardData();
        loadChatHistory();
      }
    }
  }, [user, authLoading, router]);

  const openDeleteModal = (chatId: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setChatToDelete({ id: chatId, title });
  };

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;
    try {
      setIsDeletingChat(true);
      await deleteChat(chatToDelete.id);
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    } finally {
      setIsDeletingChat(false);
      setChatToDelete(null);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError('Please select a file first.');
      return;
    }
    setUploadLoading(true);
    setUploadError('');
    setUploadSuccess('');
    try {
      await apiService.uploadDocument(uploadTopic, uploadFile);
      setUploadSuccess(`Successfully uploaded "${uploadFile.name}" to ${uploadTopic} category.`);
      setUploadFile(null);
      // Reset input element
      const fileInput = document.getElementById('file-upload-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to upload document.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleTriggerIndexing = async () => {
    setIndexLoading(true);
    setIndexSuccess('');
    try {
      await apiService.triggerIndexing();
      setIndexSuccess('RAG indexing successfully completed. All new files are now mapped to vectors!');
    } catch (err: any) {
      alert('Failed to trigger indexing. Please check backend environment keys.');
    } finally {
      setIndexLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#1e1e1f] flex items-center justify-center text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // Get current usage metrics for today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayUsage = usage.find(u => u.day === todayStr) || { total_tokens: 0, cost: 0.0 };

  const tokenQuotaPercent = Math.min(100, (todayUsage.total_tokens / 100000) * 100);

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Welcome & Overview section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#131313] border border-zinc-900 shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Welcome back, {profile?.name || 'Candidate'}</h2>
            <p className="text-xs text-zinc-400 max-w-lg mt-0.5">
              Review your customized coaching credentials and manage your uploaded vector files below.
            </p>
          </div>
        </div>
        
        <Link 
          href="/chat"
          className="px-4 py-2.5 rounded-xl bg-[#f0a924] hover:bg-[#e09b1f] text-black font-extrabold text-xs transition-all shadow-md shadow-amber-500/10 flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Start Coaching session
        </Link>
      </div>

      {/* Grid: Profile detail card & Metrics overview */}
      <div className="grid lg:grid-cols-4 gap-6">
        
        {/* Left Column Profile details card */}
        <div className="lg:col-span-1 p-6 rounded-2xl bg-[#131313] border border-zinc-900 space-y-5">
          <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
            <Award className="w-4 h-4" /> Profile Info
          </h3>
          
          <div className="space-y-4 text-xs">
            <div>
              <span className="block text-[10px] text-zinc-500 uppercase font-semibold">Service Branch</span>
              <span className="font-bold text-zinc-100">{profile?.profile?.exam || 'N/A'}</span>
            </div>
            {profile?.profile?.branch && (
              <div>
                <span className="block text-[10px] text-zinc-500 uppercase font-semibold">Entry / Branch</span>
                <span className="font-bold text-zinc-200">{profile.profile.branch}</span>
              </div>
            )}
            <div>
              <span className="block text-[10px] text-zinc-500 uppercase font-semibold">Attempt Count</span>
              <span className="font-bold text-zinc-200">
                {profile?.profile?.attempt === 1 ? '1st (Fresher)' : `${profile?.profile?.attempt} Attempts (Repeater)`}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-zinc-500 uppercase font-semibold">Coaching Level</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold mt-1">
                {profile?.profile?.level || 'Beginner'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Columns Quick Metrics */}
        <div className="lg:col-span-3 grid sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-[#131313] border border-zinc-900 flex items-center justify-between">
            <div>
              <span className="block text-xs text-zinc-500 font-semibold mb-1">Billing Plan</span>
              <span className="font-bold text-base text-zinc-200">{profile?.plan || 'Free'} Tier</span>
            </div>
            <Award className="w-8 h-8 text-amber-500/70" />
          </div>

          <div className="p-5 rounded-2xl bg-[#131313] border border-zinc-900 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-zinc-500 font-semibold">Today's Token Quota</span>
              <span className="text-[10px] text-zinc-400 font-mono">{(todayUsage.total_tokens / 1000).toFixed(1)}k / 100k</span>
            </div>
            <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${tokenQuotaPercent}%` }}
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#131313] border border-zinc-900 flex items-center justify-between">
            <div>
              <span className="block text-xs text-zinc-500 font-semibold mb-1">Estimated Cost (Today)</span>
              <span className="font-bold text-base text-emerald-400 font-mono">${todayUsage.cost.toFixed(5)}</span>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-400/80" />
          </div>
        </div>

      </div>

      {/* Tabs navigation */}
      <div className="space-y-6">
        <div className="flex border-b border-zinc-900">
          <button
            onClick={() => setActiveTab('chats')}
            className={`py-3 px-6 font-bold text-sm border-b-2 transition-all ${
              activeTab === 'chats'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-zinc-400 hover:text-zinc-300'
            }`}
          >
            Recent Chats
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`py-3 px-6 font-bold text-sm border-b-2 transition-all ${
              activeTab === 'admin'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-zinc-400 hover:text-zinc-300'
            }`}
          >
            Admin Knowledge Base
          </button>
        </div>

        {/* Tab content 1: Chats */}
        {activeTab === 'chats' && (
          <div className="space-y-4">
            {loadingHistory ? (
              <div className="flex items-center justify-center py-20 text-zinc-500">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500 mr-2" /> Loading conversations...
              </div>
            ) : chats.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-zinc-900 bg-[#131313] rounded-2xl flex flex-col items-center gap-3">
                <MessageSquare className="w-8 h-8 text-zinc-700" />
                <p className="text-sm text-zinc-400">No active conversations yet.</p>
                <Link 
                  href="/chat"
                  className="mt-1 text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1"
                >
                  Start your first chat <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {chats.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/chat?id=${chat.id}`}
                    className="p-4 rounded-xl border border-zinc-900 bg-[#131313] hover:bg-zinc-800/20 flex items-center justify-between transition-all group shadow-sm hover:scale-[1.005]"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-sm text-zinc-200 group-hover:text-white transition-colors truncate">
                          {chat.title || 'Untitled Chat'}
                        </h4>
                        <span className="text-[10px] text-zinc-500 font-semibold block mt-0.5">
                          Created: {new Date(chat.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => openDeleteModal(chat.id, chat.title || 'Untitled Chat', e)}
                      title="Delete conversation"
                      className="p-2 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/20 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab content 2: Admin Knowledge Base */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#131313] border border-zinc-900 space-y-6">
              <div>
                <h3 className="font-bold text-base text-zinc-100 mb-1 flex items-center gap-2">
                  Knowledge Ingestion Pipeline
                </h3>
                <p className="text-xs text-zinc-400">
                  Upload study documents directly to the backend storage directory and re-index vectors to populate your Pinecone database index.
                </p>
              </div>

              {/* Upload file Form */}
              <form onSubmit={handleFileUpload} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Study Topic / Subfolder</label>
                    <select
                      value={uploadTopic}
                      onChange={(e) => setUploadTopic(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-zinc-800 bg-[#1b1b1b] text-zinc-200 text-sm focus:border-amber-500 focus:outline-none capitalize"
                    >
                      {availableTopics.map(t => (
                        <option key={t} value={t}>
                          {t.replace(/_/g, ' ')} ({t})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Select Document (PDF, DOCX, TXT, MD)</label>
                    <input
                      id="file-upload-input"
                      type="file"
                      required
                      accept=".pdf,.docx,.txt,.md"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700 file:cursor-pointer cursor-pointer border border-zinc-800 rounded-lg p-1 bg-[#1b1b1b]"
                    />
                  </div>
                </div>

                {uploadError && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{uploadSuccess}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="px-5 py-2.5 rounded-lg bg-[#f0a924] hover:bg-[#e09b1f] text-black font-extrabold text-xs transition-all shadow-md shadow-amber-500/10 flex items-center gap-1.5"
                >
                  {uploadLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" /> Upload Document
                    </>
                  )}
                </button>
              </form>

              <hr className="border-zinc-900" />

              {/* Index Trigger */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-zinc-900 bg-[#1b1b1b]">
                <div>
                  <h4 className="font-bold text-sm text-zinc-200 mb-1 flex items-center gap-1.5">
                    Sync Vector Index Database
                  </h4>
                  <p className="text-[11px] text-zinc-500 max-w-md">
                    Click to process raw files. The pipeline extracts text, builds 768D embeddings using Gemini `text-embedding-004`, and pushes them to your `ssb-knowledge-base` Pinecone server.
                  </p>
                </div>
                
                <button
                  onClick={handleTriggerIndexing}
                  disabled={indexLoading}
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-bold text-xs transition-all flex items-center gap-1.5 self-start sm:self-auto whitespace-nowrap"
                >
                  {indexLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> Syncing...
                    </>
                  ) : (
                    'Trigger Vector Ingestion'
                  )}
                </button>
              </div>

              {indexSuccess && (
                <div className="p-3 rounded-lg bg-[#122b1c] border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{indexSuccess}</span>
                </div>
              )}
            </div>

            {/* Visual Namespace Explorer and CRUD Manager */}
            <div className="p-6 rounded-2xl bg-[#131313] border border-zinc-900 space-y-4">
              <h3 className="font-extrabold text-base text-zinc-100 flex items-center gap-2">
                Knowledge Base Namespaces & Vector Store Explorer
              </h3>
              <p className="text-xs text-zinc-400">
                Visualize namespaces, view document chunk previews, and manage document lifecycles with dual disk/Pinecone deletion.
              </p>

              <NamespaceExplorer onNamespaceChange={loadTopicsList} />
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Application Modal */}
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

    </div>
  );
}
