'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Send, 
  Plus, 
  Loader2, 
  BookOpen, 
  ShieldAlert,
  ArrowRight,
  SlidersHorizontal,
  Paperclip,
  Mic,
  ArrowDown,
  FileText,
  Cpu,
  CornerDownLeft,
  ChevronDown,
  Copy,
  Check,
  Pencil,
  X,
  Shield,
  Ship,
  Plane,
  Star,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { apiService } from '@/services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}

function ChatConsoleInner() {
  const { user, profile, loading: authLoading } = useAuth();
  const { chats, loadChatHistory } = useChat();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL parameter chat id
  const chatIdParam = searchParams.get('id');

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const activeChatIdRef = useRef<string | null>(null);
  const skipLoadEffectRef = useRef<boolean>(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [streamingMessage, setStreamingMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const isStreamingRef = useRef<boolean>(false);
  const [errorBanner, setErrorBanner] = useState('');

  // Copy & Edit States
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editInputText, setEditInputText] = useState('');

  // Defense Service Selection State (1st Icon)
  const [selectedService, setSelectedService] = useState<'all' | 'army' | 'navy' | 'airforce'>('all');
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  // PIQ Context State
  const [includePIQ, setIncludePIQ] = useState(false);
  const [showPIQMissingModal, setShowPIQMissingModal] = useState(false);

  const handleTogglePIQ = async () => {
    if (includePIQ) {
      setIncludePIQ(false);
      return;
    }

    try {
      const piqData = await apiService.getPIQProfile();
      if (!piqData || (!piqData.full_name && !piqData.academic_records && !piqData.completed_steps)) {
        setShowPIQMissingModal(true);
      } else {
        setIncludePIQ(true);
      }
    } catch (err) {
      setShowPIQMissingModal(true);
    }
  };

  // Speech-To-Text (STT) Voice Input State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-IN';

        rec.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript) {
            setInputMessage(currentTranscript);
          }
        };

        rec.onerror = (event: any) => {
          console.error('STT Voice Input Error:', event.error);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported by your current browser. Please try Google Chrome or Brave.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start voice recognition:', err);
      }
    }
  };

  // Processing status statements carousel
  const [processingIndex, setProcessingIndex] = useState(0);
  const processingStatements = [
    'Processing your query...',
    'Retrieving SSB knowledge base vectors...',
    'Analyzing Officer Like Qualities (OLQ) guidelines...',
    'Synthesizing personalized coaching response...'
  ];

  useEffect(() => {
    if (isStreaming) {
      const interval = setInterval(() => {
        setProcessingIndex((prev) => (prev + 1) % processingStatements.length);
      }, 1800);
      return () => clearInterval(interval);
    } else {
      setProcessingIndex(0);
    }
  }, [isStreaming]);

  // RAG references for the current query
  const [citations, setCitations] = useState<any[]>([]);
  const [tokenMetrics, setTokenMetrics] = useState<{
    prompt_tokens: number;
    completion_tokens: number;
    model: string;
  } | null>(null);

  // Tab active state for each message
  const [messageTabs, setMessageTabs] = useState<Record<string, 'answer' | 'citations' | 'steps'>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Monitor scroll height to show/hide the scroll-down action button
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
    setShowScrollBottom(!isNearBottom && scrollHeight > clientHeight);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const copyToClipboard = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const loadMessages = async (id: string) => {
    try {
      setLoadingMessages(true);
      setErrorBanner('');
      const data = await apiService.getChatMessages(id);
      setMessages(data);
      
      // Clean citations and token metrics when switching rooms
      setCitations([]);
      setTokenMetrics(null);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setErrorBanner('Failed to load messages.');
    } finally {
      setLoadingMessages(false);
    }
  };

  // Synchronize with Auth status
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Synchronize active chat ID with URL query params
  useEffect(() => {
    if (skipLoadEffectRef.current) {
      skipLoadEffectRef.current = false;
      return;
    }

    if (chatIdParam) {
      if (activeChatIdRef.current !== chatIdParam) {
        setActiveChatId(chatIdParam);
        activeChatIdRef.current = chatIdParam;
        loadMessages(chatIdParam);
      }
    } else {
      setActiveChatId(null);
      activeChatIdRef.current = null;
      setMessages([]);
      setCitations([]);
      setTokenMetrics(null);
      setIncludePIQ(false);
    }
  }, [chatIdParam]);

  const sendQueryStream = async (messageText: string) => {
    setErrorBanner('');
    setIsStreaming(true);
    isStreamingRef.current = true;
    setStreamingMessage('');

    // Pre-insert user message locally into UI state
    const tempUserMsg: Message = {
      id: Math.random().toString(),
      role: 'user',
      message: messageText,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    let accumulatedStreamText = '';

    await apiService.streamChat(messageText, activeChatIdRef.current, {
      onInit: (initData) => {
        // If a new chat session was generated by backend, push ID to browser query
        if (!activeChatIdRef.current) {
          activeChatIdRef.current = initData.chat_id;
          setActiveChatId(initData.chat_id);
          skipLoadEffectRef.current = true;
          router.replace(`/chat?id=${initData.chat_id}`, { scroll: false });
        }
        if (initData.include_piq !== undefined) {
          setIncludePIQ(initData.include_piq);
        }
        setCitations(initData.citations);
      },
      onChunk: (chunkText) => {
        accumulatedStreamText += chunkText;
        setStreamingMessage((prev) => prev + chunkText);
      },
      onMetadata: (metadata) => {
        setTokenMetrics(metadata);
      },
      onError: (err) => {
        setErrorBanner(err);
        setIsStreaming(false);
        isStreamingRef.current = false;
      },
      onDone: () => {
        setIsStreaming(false);
        isStreamingRef.current = false;

        // Append completed streamed message directly into local messages state
        if (accumulatedStreamText) {
          const assistantMsg: Message = {
            id: Math.random().toString(),
            role: 'assistant',
            message: accumulatedStreamText,
            created_at: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
        }

        setStreamingMessage('');
        loadChatHistory();
      },
    }, includePIQ);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isStreaming) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    await sendQueryStream(messageText);
  };

  const startEditing = (msgId: string, currentText: string) => {
    setEditingMessageId(msgId);
    setEditInputText(currentText);
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditInputText('');
  };

  const handleSaveAndSubmitEdit = async (msgId: string) => {
    if (!editInputText.trim() || isStreaming) return;

    const editedText = editInputText.trim();
    setEditingMessageId(null);
    setEditInputText('');

    // Remove this user message and all subsequent messages to restart flow from edited prompt
    const msgIndex = messages.findIndex((m) => m.id === msgId);
    if (msgIndex !== -1) {
      setMessages((prev) => prev.slice(0, msgIndex));
    }

    await sendQueryStream(editedText);
  };

  const handleTabChange = (messageId: string, tab: 'answer' | 'citations' | 'steps') => {
    setMessageTabs((prev) => ({
      ...prev,
      [messageId]: tab,
    }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#1e1e1f] flex items-center justify-center text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // Sample static steps for the RAG pipeline reasoning
  const getPipelineSteps = (tokens: any) => [
    { name: '1. Semantic Query Extraction', desc: 'Gemini parsed context embeddings mapping tat-psychology vectors.' },
    { name: '2. Vector Store Retrieve', desc: 'Pinecone returned top 3 matches with >85% cosine similarity.' },
    { name: '3. OLQ Criteria Injection', desc: 'Context formatted with active Officer Like Qualities (OLQ) rules.' },
    { name: '4. Gemini Synthesis', desc: tokens ? `Prompt token cost ${tokens.prompt_tokens}, reply cost ${tokens.completion_tokens} using ${tokens.model}.` : 'Synthesizing response utilizing LLM context parameters.' }
  ];

  return (
    <div className="flex flex-col h-full theme-bg-app theme-text-primary relative">
      
      {/* PIQ Context Active Banner */}
      {includePIQ && (
        <div className="px-6 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span>⚡ <strong>PIQ Context Included</strong> — Responses will be tailored to your personal background, academics & SSB records.</span>
          </div>
          <button
            onClick={() => setIncludePIQ(false)}
            className="text-[11px] text-zinc-400 hover:text-rose-400 transition-colors font-medium underline"
          >
            Detach PIQ
          </button>
        </div>
      )}

      {/* Error banner */}
      {errorBanner && (
        <div className="px-6 py-2.5 bg-rose-500/10 border-b border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2 flex-shrink-0">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>{errorBanner}</span>
        </div>
      )}

      {/* Message logs area */}
      <div 
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6 scrollbar"
      >
        {loadingMessages ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            <span className="text-xs">Loading conversational history...</span>
          </div>
        ) : messages.length === 0 && !streamingMessage ? (
          <div className="max-w-2xl mx-auto py-16 text-center flex flex-col items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-500 mb-2">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-white">Ask your SSB AI Mentor</h3>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto mt-1">
                You can ask questions regarding psychological testing (TAT/WAT/SRT), Interview guidelines, GTO obstacles, and general criteria of the 15 Officer Like Qualities (OLQ).
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-3 mt-4 w-full">
              {(includePIQ ? [
                "🎯 Predict IO interview questions based on my PIQ",
                "⚠️ Analyze potential gaps & red flags in my PIQ",
                "⚡ Simulate a Rapid-Fire question set for my background",
                "🏆 How can I project my OLQs using my sports & hobbies?"
              ] : [
                "What are the 15 Officer Like Qualities (OLQs)?",
                "How should I tackle a Situation Reaction Test (SRT)?",
                "What questions are asked in the Personal Interview?",
                "Explain GTO Command Task procedures."
              ]).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => sendQueryStream(prompt)}
                  className={`p-3 text-left rounded-xl border transition-all font-semibold text-xs leading-normal ${
                    includePIQ
                      ? 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-300 hover:text-emerald-200'
                      : 'border-zinc-900 bg-[#131313]/60 hover:bg-[#131313] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.map((msg, index) => {
              const isLastMessage = index === messages.length - 1;
              const isUser = msg.role === 'user';
              const activeTab = messageTabs[msg.id] || 'answer';
              const isEditingThisMsg = editingMessageId === msg.id;

              if (isUser) {
                return (
                  <div key={msg.id} className="flex flex-col items-end group w-full">
                    <span className="text-[9px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">
                      Candidate
                    </span>

                    {isEditingThisMsg ? (
                      <div className="w-full max-w-[85%] bg-[#222224] border border-amber-500/40 rounded-2xl p-3 shadow-lg flex flex-col gap-2.5">
                        <textarea
                          value={editInputText}
                          onChange={(e) => setEditInputText(e.target.value)}
                          className="w-full bg-[#161617] border border-zinc-800 rounded-xl p-3 text-xs md:text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50 resize-none min-h-[80px]"
                          placeholder="Edit your prompt..."
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="px-3 py-1.5 rounded-lg border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={!editInputText.trim() || isStreaming}
                            onClick={() => handleSaveAndSubmitEdit(msg.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-xs font-bold text-black transition-all flex items-center gap-1.5"
                          >
                            Save & Submit
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative max-w-[85%] flex flex-col items-end">
                        <div className="p-3.5 px-4 rounded-2xl text-xs md:text-sm leading-relaxed theme-bg-input border theme-border theme-text-primary rounded-tr-none shadow-sm font-medium">
                          {msg.message}
                        </div>

                        {/* Action Toolbar below user message (visible ONLY on hover) */}
                        <div className="flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => copyToClipboard(msg.message, msg.id)}
                            className="p-1 theme-text-muted hover:theme-accent-text theme-bg-card-hover rounded transition-colors flex items-center gap-1 text-[11px]"
                            title="Copy query"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400 font-semibold text-[10px]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span className="text-[10px]">Copy</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => startEditing(msg.id, msg.message)}
                            disabled={isStreaming}
                            className="p-1 theme-text-muted hover:theme-accent-text theme-bg-card-hover rounded transition-colors flex items-center gap-1 text-[11px] disabled:opacity-40"
                            title="Edit query"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Edit</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // Assistant message card with tab layout
              const hasCitations = isLastMessage && citations.length > 0;
              
              return (
                <div key={msg.id} className="flex flex-col items-start w-full">
                  <span className="text-[9px] theme-text-muted font-bold mb-1 uppercase tracking-wider">
                    SSB AI Coach
                  </span>
                  
                  <div className="w-full max-w-[90%] md:max-w-[85%] theme-bg-card border theme-border rounded-2xl rounded-tl-none overflow-hidden shadow-md">
                    {/* Message Tabs Header + Copy Button */}
                    <div className="flex items-center justify-between border-b theme-border-subtle theme-bg-bottom px-3">
                      <div className="flex">
                        <button
                          onClick={() => handleTabChange(msg.id, 'answer')}
                          className={`py-2.5 px-4 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 -mb-[1px] cursor-pointer ${
                            activeTab === 'answer'
                              ? 'theme-accent-border theme-accent-text border-b-2'
                              : 'border-transparent theme-text-muted hover:theme-text-secondary'
                          }`}
                        >
                          Answer
                        </button>
                        <button
                          onClick={() => handleTabChange(msg.id, 'citations')}
                          className={`py-2.5 px-4 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 -mb-[1px] cursor-pointer ${
                            activeTab === 'citations'
                              ? 'theme-accent-border theme-accent-text border-b-2'
                              : 'border-transparent theme-text-muted hover:theme-text-secondary'
                          }`}
                        >
                          Related Content
                        </button>
                        <button
                          onClick={() => handleTabChange(msg.id, 'steps')}
                          className={`py-2.5 px-4 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 -mb-[1px] cursor-pointer ${
                            activeTab === 'steps'
                              ? 'theme-accent-border theme-accent-text border-b-2'
                              : 'border-transparent theme-text-muted hover:theme-text-secondary'
                          }`}
                        >
                          Steps
                        </button>
                      </div>

                      {/* Copy Response Button */}
                      <button
                        onClick={() => copyToClipboard(msg.message, msg.id)}
                        className="py-1 px-2.5 text-[11px] theme-text-muted hover:theme-accent-text theme-bg-card-hover rounded-md transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
                        title="Copy response"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Message Tabs Body */}
                    <div className="p-4 md:p-5 text-xs md:text-sm leading-relaxed theme-text-primary">
                      
                      {/* TAB 1: Answer */}
                      {activeTab === 'answer' && (
                        <div className="whitespace-pre-wrap font-medium theme-text-secondary">
                          {msg.message}
                        </div>
                      )}

                      {/* TAB 2: Related Content (Citations) */}
                      {activeTab === 'citations' && (
                        <div className="space-y-3.5">
                          {hasCitations ? (
                            <div className="grid gap-2.5">
                              <span className="block text-[10px] theme-text-muted uppercase font-bold tracking-wider">Matched RAG Citations</span>
                              {citations.map((cite, idx) => {
                                const displayTitle = cite.title || 'Referenced Documentation';
                                const topicBadge = cite.topic ? (cite.topic.charAt(0).toUpperCase() + cite.topic.slice(1)).replace(/_/g, ' ') : 'SSB Material';
                                return (
                                  <div key={idx} className="p-3 rounded-xl border theme-border theme-bg-input space-y-1.5 hover:theme-accent-border transition-colors">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[var(--theme-accent-bg-subtle)] border theme-accent-border theme-accent-text text-[9px] font-bold">
                                          Ref [{idx + 1}]
                                        </span>
                                        <span className="px-2 py-0.5 rounded theme-bg-card theme-accent-text border theme-border-subtle text-[9px] font-bold uppercase tracking-wider">
                                          {topicBadge}
                                        </span>
                                      </div>
                                      <span className="text-[10px] theme-text-muted font-semibold">Page {cite.page || 1}</span>
                                    </div>
                                    <h4 className="font-bold text-xs theme-text-primary mt-1 leading-snug">
                                      {displayTitle}
                                    </h4>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-6 theme-text-muted text-xs">
                              {isLastMessage ? 'No vector documents retrieved for this prompt.' : 'Citations archived for this conversation.'}
                            </div>
                          )}
                        </div>
                      )}

                      {/* TAB 3: Steps */}
                      {activeTab === 'steps' && (
                        <div className="space-y-3">
                          <span className="block text-[10px] theme-text-muted uppercase font-bold tracking-wider mb-1">Reasoning Pipeline</span>
                          <div className="space-y-2 border-l theme-border ml-1.5 pl-3.5">
                            {getPipelineSteps(isLastMessage ? tokenMetrics : null).map((step, idx) => (
                              <div key={idx} className="relative">
                                {/* Bullet indicator */}
                                <div className="absolute -left-[20px] top-1.5 w-2 h-2 rounded-full theme-accent-bg border theme-border" />
                                <span className="font-bold theme-text-primary text-xs block">{step.name}</span>
                                <span className="text-[10px] theme-text-muted block mt-0.5 leading-normal">{step.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              );
            })}

            {/* Streaming & Processing Message Card */}
            {isStreaming && (
              <div className="flex flex-col items-start w-full">
                <span className="text-[9px] theme-text-muted font-bold mb-1 uppercase tracking-wider">
                  SSB AI Coach ({!streamingMessage ? 'thinking...' : 'typing...'})
                </span>
                <div className="w-full max-w-[90%] md:max-w-[85%] theme-bg-card border theme-accent-border rounded-2xl rounded-tl-none overflow-hidden shadow-lg">
                  <div className="flex items-center justify-between border-b theme-border-subtle theme-bg-bottom px-3.5 py-2">
                    <div className="flex items-center gap-2 text-xs font-bold theme-accent-text">
                      <Loader2 className="w-4 h-4 animate-spin theme-accent-text" />
                      <span>{!streamingMessage ? 'Processing query' : 'Answer'}</span>
                    </div>
                    {streamingMessage && (
                      <button
                        onClick={() => copyToClipboard(streamingMessage, 'streaming-active')}
                        className="py-1 px-2.5 text-[11px] theme-text-muted hover:theme-accent-text theme-bg-card-hover rounded-md transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
                        title="Copy response"
                      >
                        {copiedId === 'streaming-active' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="p-4 md:p-5 text-xs md:text-sm leading-relaxed theme-text-secondary font-medium">
                    {!streamingMessage ? (
                      <div className="flex flex-col gap-2 py-1">
                        <div className="flex items-center gap-2.5 theme-accent-text font-semibold text-xs">
                          <span className="w-2 h-2 rounded-full theme-accent-bg animate-ping flex-shrink-0" />
                          <span>{processingStatements[processingIndex]}</span>
                        </div>
                        <p className="text-[11px] theme-text-muted leading-relaxed">
                          Searching vector store, evaluating candidate context & synthesizing answer...
                        </p>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">
                        {streamingMessage}
                        <span className="inline-block w-1.5 h-3 theme-accent-bg ml-1 animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Scroll to Bottom Action Button */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-28 right-8 z-30 w-9 h-9 rounded-full bg-[var(--theme-accent-bg-subtle)] hover:bg-[var(--theme-accent-bg-subtle)] border theme-accent-border theme-accent-text flex items-center justify-center transition-all shadow-md backdrop-blur-sm hover:scale-105 cursor-pointer"
          title="Scroll down"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}

      {/* Bottom Floating Chat Input Area */}
      <div className="p-4 border-t theme-border theme-bg-app flex-shrink-0">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="theme-bg-card border theme-border rounded-2xl shadow-lg p-2.5 flex flex-col focus-within:theme-accent-border transition-colors">
            
            {/* Input field */}
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isStreaming}
              placeholder={isStreaming ? "Awaiting assistant response..." : "Ask anything..."}
              className="px-3 py-2 bg-transparent theme-text-primary text-sm focus:outline-none disabled:theme-text-muted placeholder:theme-text-muted"
            />
            
            {/* Tools footer bar inside container */}
            <div className="flex items-center justify-between pt-2 px-1 border-t theme-border-subtle mt-1 select-none">
              
              {/* Left utility icons */}
              <div className="flex items-center gap-1.5 relative">
                
                {/* 1st Icon: Defense Service Branch Selector */}
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                    title="Select Defense Service Branch"
                    className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold ${
                      selectedService !== 'all' 
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
                        : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/40'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    {selectedService !== 'all' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {selectedService === 'army' ? 'Army' : selectedService === 'navy' ? 'Navy' : 'IAF'}
                      </span>
                    )}
                    <ChevronUp className={`w-3 h-3 transition-transform ${showServiceDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Popup */}
                  {showServiceDropdown && (
                    <div className="absolute bottom-full left-0 mb-2.5 w-52 bg-[#161617] border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 backdrop-blur-md">
                      <span className="text-[9px] uppercase font-bold text-zinc-500 px-2.5 py-1 tracking-wider">
                        Target Service Branch
                      </span>
                      {[
                        { id: 'all', label: 'All Services (General)', desc: 'SSB Guidelines & OLQs', icon: Star, color: 'text-amber-400' },
                        { id: 'army', label: 'Indian Army', desc: 'SSB & IMA / OTA Tasks', icon: Shield, color: 'text-emerald-400' },
                        { id: 'navy', label: 'Indian Navy', desc: 'NSB & Executive/Tech', icon: Ship, color: 'text-sky-400' },
                        { id: 'airforce', label: 'Indian Air Force', desc: 'AFSB & Flying/Ground', icon: Plane, color: 'text-indigo-400' },
                      ].map((srv) => (
                        <button
                          key={srv.id}
                          type="button"
                          onClick={() => {
                            setSelectedService(srv.id as any);
                            setShowServiceDropdown(false);
                          }}
                          className={`w-full p-2 rounded-xl text-left flex items-center gap-2.5 transition-all ${
                            selectedService === srv.id
                              ? 'bg-amber-500/10 border border-amber-500/30'
                              : 'hover:bg-zinc-800/60 border border-transparent'
                          }`}
                        >
                          <srv.icon className={`w-4 h-4 flex-shrink-0 ${srv.color}`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-zinc-200 flex items-center justify-between">
                              <span>{srv.label}</span>
                              {selectedService === srv.id && <Check className="w-3 h-3 text-amber-500" />}
                            </div>
                            <span className="text-[10px] text-zinc-500 block truncate">{srv.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* PIQ Context Import Button */}
                <button
                  type="button"
                  onClick={handleTogglePIQ}
                  title={includePIQ ? "PIQ Context Active (Click to detach)" : "Import PIQ Context for personalized interview prep"}
                  className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${
                    includePIQ
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  <FileText className={`w-3.5 h-3.5 ${includePIQ ? 'text-emerald-400' : ''}`} />
                  <span className="text-[11px] font-bold">
                    {includePIQ ? 'PIQ Attached' : 'Import PIQ'}
                  </span>
                  {includePIQ && <Check className="w-3 h-3 text-emerald-400" />}
                </button>

                {/* 2nd Icon: Attach Documents */}
                <button 
                  type="button"
                  title="Attach Documents"
                  className="p-1.5 text-zinc-600 hover:text-zinc-300 rounded-lg hover:bg-zinc-800/40 transition-colors"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                </button>

                {/* 3rd Icon: Voice Input STT */}
                <button 
                  type="button"
                  onClick={toggleVoiceInput}
                  title={isListening ? "Stop Voice Recording" : "Voice Input (Speech-to-Text)"}
                  className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    isListening
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                      : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/40'
                  }`}
                >
                  <Mic className={`w-3.5 h-3.5 ${isListening ? 'text-rose-500 animate-bounce' : ''}`} />
                  {isListening && <span className="text-[10px] text-rose-400 font-bold">Listening...</span>}
                </button>

              </div>

              {/* Right Send icon */}
              <button
                type="submit"
                disabled={isStreaming || !inputMessage.trim()}
                className="w-8 h-8 rounded-full theme-accent-bg theme-accent-bg-hover disabled:theme-bg-input disabled:theme-text-muted flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
              >
                {isStreaming ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                )}
              </button>

            </div>
          </div>
        </form>
      </div>

      {/* Missing PIQ Modal Prompt */}
      {showPIQMissingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#161617] border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-amber-500 font-extrabold text-base">
                <FileText className="w-5 h-5" />
                <span>PIQ Profile Required</span>
              </div>
              <button 
                onClick={() => setShowPIQMissingModal(false)}
                className="text-zinc-500 hover:text-zinc-300 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              You haven't completed your SSB Personal Information Questionnaire (PIQ) form yet. 
              Filling out your PIQ allows the AI to act as a personal Interviewing Officer (IO), spot gaps in your profile, and simulate candidate-specific interview questions.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPIQMissingModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPIQMissingModal(false);
                  router.push('/piq');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 transition-all flex items-center gap-1.5 shadow-md"
              >
                <span>Fill PIQ Form Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ChatConsole() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[#1e1e1f] flex items-center justify-center text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    }>
      <ChatConsoleInner />
    </React.Suspense>
  );
}
