'use client';

import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  FolderPlus, 
  FileText, 
  HardDrive, 
  Layers, 
  RefreshCw, 
  Trash2, 
  Edit3, 
  Eye, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Loader2, 
  AlertTriangle, 
  CheckCircle, 
  Database,
  X,
  UploadCloud,
  FileCode,
  File
} from 'lucide-react';
import { apiService } from '@/services/api';

interface DocumentInfo {
  filename: string;
  extension: string;
  size_bytes: number;
  size_formatted: string;
  modified_at: string;
  topic: string;
}

interface NamespaceInfo {
  topic: string;
  document_count: number;
  total_size_bytes: number;
  total_size_formatted: string;
  documents: DocumentInfo[];
}

interface SummaryInfo {
  total_namespaces: number;
  total_documents: number;
  total_size_bytes: number;
  total_size_formatted: string;
  total_vector_chunks: number;
  pinecone_available: boolean;
}

interface ChunkInfo {
  id: string;
  chunk_index: number;
  page: number;
  char_length: number;
  text: string;
}

interface NamespaceExplorerProps {
  onNamespaceChange?: () => void;
}

export default function NamespaceExplorer({ onNamespaceChange }: NamespaceExplorerProps) {
  const [summary, setSummary] = useState<SummaryInfo | null>(null);
  const [namespaces, setNamespaces] = useState<NamespaceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newNamespaceName, setNewNamespaceName] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const [renameTarget, setRenameTarget] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [renameLoading, setRenameLoading] = useState(false);

  const [previewTarget, setPreviewTarget] = useState<{ topic: string; filename: string } | null>(null);
  const [previewChunks, setPreviewChunks] = useState<ChunkInfo[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{
    type: 'namespace' | 'document';
    topic: string;
    filename?: string;
    message: string;
  } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiService.getNamespaces();
      setSummary(data.summary);
      setNamespaces(data.namespaces);
    } catch (err: any) {
      setError(err?.message || 'Failed to load namespace data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const toggleTopic = (topic: string) => {
    setExpandedTopics(prev => ({ ...prev, [topic]: !prev[topic] }));
  };

  const handleCreateNamespace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNamespaceName.trim()) return;
    try {
      setCreateLoading(true);
      const res = await apiService.createNamespace(newNamespaceName.trim());
      showNotify('success', res.message || 'Created namespace successfully');
      setNewNamespaceName('');
      setCreateModalOpen(false);
      await loadData();
      if (onNamespaceChange) onNamespaceChange();
    } catch (err: any) {
      showNotify('error', err?.message || 'Failed to create namespace');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleRenameNamespace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameTarget || !renameValue.trim()) return;
    try {
      setRenameLoading(true);
      const res = await apiService.renameNamespace(renameTarget, renameValue.trim());
      showNotify('success', res.message || 'Renamed namespace successfully');
      setRenameTarget(null);
      setRenameValue('');
      await loadData();
      if (onNamespaceChange) onNamespaceChange();
    } catch (err: any) {
      showNotify('error', err?.message || 'Failed to rename namespace');
    } finally {
      setRenameLoading(false);
    }
  };

  const handleDeleteNamespace = (topic: string) => {
    setDeleteConfirmTarget({
      type: 'namespace',
      topic,
      message: `Are you sure you want to delete namespace "${topic}"? This will delete all files inside and purge all vectors from Pinecone.`,
    });
  };

  const handleDeleteDocument = (topic: string, filename: string) => {
    setDeleteConfirmTarget({
      type: 'document',
      topic,
      filename,
      message: `Delete "${filename}" from "${topic}"? File and vectors will be permanently removed from disk and Pinecone.`,
    });
  };

  const executeConfirmDelete = async () => {
    if (!deleteConfirmTarget) return;
    const { type, topic, filename } = deleteConfirmTarget;
    setDeleteConfirmTarget(null);

    if (type === 'namespace') {
      const key = `delete_ns_${topic}`;
      try {
        setActionLoading(prev => ({ ...prev, [key]: true }));
        const res = await apiService.deleteNamespace(topic);
        showNotify('success', res.message || 'Namespace deleted');
        await loadData();
        if (onNamespaceChange) onNamespaceChange();
      } catch (err: any) {
        showNotify('error', err?.message || 'Failed deleting namespace');
      } finally {
        setActionLoading(prev => ({ ...prev, [key]: false }));
      }
    } else if (type === 'document' && filename) {
      const key = `delete_doc_${topic}_${filename}`;
      try {
        setActionLoading(prev => ({ ...prev, [key]: true }));
        const res = await apiService.deleteDocument(topic, filename);
        showNotify('success', res.message || 'Document deleted');
        await loadData();
      } catch (err: any) {
        showNotify('error', err?.message || 'Failed deleting document');
      } finally {
        setActionLoading(prev => ({ ...prev, [key]: false }));
      }
    }
  };

  const handleReindexDocument = async (topic: string, filename: string) => {
    const key = `reindex_${topic}_${filename}`;
    try {
      setActionLoading(prev => ({ ...prev, [key]: true }));
      const res = await apiService.reindexDocument(topic, filename);
      showNotify('success', res.message || `Re-indexed ${filename} (${res.chunks_count || 0} chunks)`);
      await loadData();
    } catch (err: any) {
      showNotify('error', err?.message || 'Re-indexing failed');
    } finally {
      setActionLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const handlePreviewChunks = async (topic: string, filename: string) => {
    try {
      setPreviewTarget({ topic, filename });
      setPreviewLoading(true);
      setPreviewChunks([]);
      const res = await apiService.getDocumentChunks(topic, filename);
      setPreviewChunks(res.chunks || []);
    } catch (err: any) {
      showNotify('error', err?.message || 'Failed loading chunk previews');
      setPreviewTarget(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const getFileIcon = (ext: string) => {
    switch (ext.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-rose-400" />;
      case 'docx':
      case 'doc':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'md':
      case 'txt':
        return <FileCode className="w-4 h-4 text-emerald-400" />;
      default:
        return <File className="w-4 h-4 text-zinc-400" />;
    }
  };

  // Filter namespaces/docs based on search query
  const filteredNamespaces = namespaces.filter(ns => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const matchesTopic = ns.topic.toLowerCase().includes(q);
    const matchesFile = ns.documents.some(doc => doc.filename.toLowerCase().includes(q));
    return matchesTopic || matchesFile;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border shadow-lg transition-all animate-in fade-in slide-in-from-top-2 ${
          notification.type === 'success' 
            ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300' 
            : 'bg-rose-950/80 border-rose-500/30 text-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#131313] border border-zinc-900 flex items-center justify-between">
          <div>
            <span className="block text-[11px] text-zinc-500 font-semibold uppercase">Namespaces</span>
            <span className="font-extrabold text-xl text-white font-mono mt-0.5 block">
              {summary ? summary.total_namespaces : '-'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
            <Folder className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#131313] border border-zinc-900 flex items-center justify-between">
          <div>
            <span className="block text-[11px] text-zinc-500 font-semibold uppercase">Documents</span>
            <span className="font-extrabold text-xl text-white font-mono mt-0.5 block">
              {summary ? summary.total_documents : '-'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#131313] border border-zinc-900 flex items-center justify-between">
          <div>
            <span className="block text-[11px] text-zinc-500 font-semibold uppercase">Knowledge Size</span>
            <span className="font-extrabold text-base text-zinc-200 font-mono mt-1 block">
              {summary ? summary.total_size_formatted : '-'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <HardDrive className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#131313] border border-zinc-900 flex items-center justify-between">
          <div>
            <span className="block text-[11px] text-zinc-500 font-semibold uppercase">Vector Chunks</span>
            <span className="font-extrabold text-xl text-emerald-400 font-mono mt-0.5 block">
              {summary ? summary.total_vector_chunks : '-'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Header Toolbar: Search & Create Namespace */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#131313] border border-zinc-900">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search namespaces or filenames..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#1b1b1b] border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-lg bg-[#1b1b1b] hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5"
            title="Refresh Namespaces"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-500' : ''}`} /> Refresh
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-[#f0a924] hover:bg-[#e09b1f] text-black font-extrabold text-xs transition-all shadow-md shadow-amber-500/10 flex items-center gap-1.5"
          >
            <FolderPlus className="w-4 h-4 stroke-[2.5]" /> New Namespace
          </button>
        </div>
      </div>

      {/* Namespace Visual Tree / Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-500 gap-2 border border-zinc-900 bg-[#131313] rounded-2xl">
          <Loader2 className="w-7 h-7 animate-spin text-amber-500" />
          <span className="text-xs">Loading Knowledge Base Namespaces...</span>
        </div>
      ) : error ? (
        <div className="p-6 text-center border border-rose-500/20 bg-rose-950/20 rounded-2xl space-y-2">
          <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
          <p className="text-xs text-rose-300 font-semibold">{error}</p>
          <button onClick={loadData} className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs font-bold text-zinc-200 hover:bg-zinc-700">
            Retry
          </button>
        </div>
      ) : filteredNamespaces.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-zinc-900 bg-[#131313] rounded-2xl space-y-3">
          <Folder className="w-10 h-10 text-zinc-700 mx-auto" />
          <p className="text-xs text-zinc-400 font-semibold">No matching namespaces or files found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNamespaces.map((ns) => {
            const isExpanded = !!expandedTopics[ns.topic];
            const isDeleting = !!actionLoading[`delete_ns_${ns.topic}`];

            return (
              <div 
                key={ns.topic} 
                className="rounded-xl border border-zinc-900 bg-[#131313] overflow-hidden transition-all shadow-sm"
              >
                {/* Namespace Header */}
                <div 
                  onClick={() => toggleTopic(ns.topic)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-800/30 transition-colors select-none"
                >
                  <div className="flex items-center gap-3">
                    <button className="text-zinc-500 hover:text-zinc-300">
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-amber-500" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0">
                      <Folder className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-zinc-100 capitalize">
                          {ns.topic.replace(/_/g, ' ')}
                        </h4>
                        <span className="text-[10px] text-zinc-500 font-mono">({ns.topic})</span>
                      </div>
                      <span className="text-[11px] text-zinc-400 font-mono block mt-0.5">
                        {ns.document_count} file{ns.document_count !== 1 ? 's' : ''} • {ns.total_size_formatted}
                      </span>
                    </div>
                  </div>

                  {/* Actions for Namespace */}
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setRenameTarget(ns.topic);
                        setRenameValue(ns.topic);
                      }}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Rename Namespace"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteNamespace(ns.topic)}
                      disabled={isDeleting}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                      title="Delete Namespace & Vectors"
                    >
                      {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Collapsible Document List */}
                {isExpanded && (
                  <div className="border-t border-zinc-900 bg-[#0d0d0d] p-4">
                    {ns.documents.length === 0 ? (
                      <div className="text-center py-6 text-xs text-zinc-500 italic">
                        No documents stored in this namespace directory yet.
                      </div>
                    ) : (
                      <div className="divide-y divide-zinc-900/60 border border-zinc-900 rounded-lg overflow-hidden bg-[#131313]">
                        {ns.documents.map((doc) => {
                          const isDocDeleting = !!actionLoading[`delete_doc_${ns.topic}_${doc.filename}`];
                          const isReindexing = !!actionLoading[`reindex_${ns.topic}_${doc.filename}`];

                          return (
                            <div 
                              key={doc.filename}
                              className="p-3 flex items-center justify-between hover:bg-zinc-800/20 transition-colors text-xs"
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                {getFileIcon(doc.extension)}
                                <div className="overflow-hidden">
                                  <span className="font-semibold text-zinc-200 block truncate" title={doc.filename}>
                                    {doc.filename}
                                  </span>
                                  <span className="text-[10px] text-zinc-500 font-mono block">
                                    {doc.size_formatted} • Modified: {new Date(doc.modified_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>

                              {/* Document Item Action buttons */}
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <button
                                  onClick={() => handlePreviewChunks(ns.topic, doc.filename)}
                                  className="px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-semibold flex items-center gap-1 transition-all"
                                  title="Preview Parsed Text Chunks"
                                >
                                  <Eye className="w-3 h-3 text-amber-500" /> Preview
                                </button>

                                <button
                                  onClick={() => handleReindexDocument(ns.topic, doc.filename)}
                                  disabled={isReindexing}
                                  className="px-2 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/20 hover:bg-emerald-900/50 text-emerald-400 text-[11px] font-semibold flex items-center gap-1 transition-all disabled:opacity-50"
                                  title="Re-index this file into Pinecone"
                                >
                                  {isReindexing ? (
                                    <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                                  ) : (
                                    <RefreshCw className="w-3 h-3" />
                                  )}
                                  Re-index
                                </button>

                                <button
                                  onClick={() => handleDeleteDocument(ns.topic, doc.filename)}
                                  disabled={isDocDeleting}
                                  className="p-1 rounded-md text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                                  title="Delete Document"
                                >
                                  {isDocDeleting ? (
                                    <Loader2 className="w-3 h-3 animate-spin text-rose-400" />
                                  ) : (
                                    <Trash2 className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal 1: Create Namespace */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131313] border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-amber-500" /> Create New Namespace
              </h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNamespace} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Namespace Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ssb_psychology_notes"
                  value={newNamespaceName}
                  onChange={(e) => setNewNamespaceName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-800 bg-[#1b1b1b] text-zinc-200 text-xs focus:border-amber-500 focus:outline-none"
                />
                <p className="text-[10px] text-zinc-500 mt-1">
                  Use lowercase letters, numbers, and underscores. Spaces will be converted automatically.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 font-bold text-xs hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-1.5"
                >
                  {createLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Create Namespace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Rename Namespace */}
      {renameTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131313] border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-500" /> Rename Namespace
              </h3>
              <button onClick={() => setRenameTarget(null)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRenameNamespace} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Renaming "{renameTarget}" to:
                </label>
                <input
                  type="text"
                  required
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-800 bg-[#1b1b1b] text-zinc-200 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRenameTarget(null)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 font-bold text-xs hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={renameLoading}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-1.5"
                >
                  {renameLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Rename Namespace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Document Chunks Preview Modal */}
      {previewTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131313] border border-zinc-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-amber-500" /> Parsed Text Chunks Preview
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  {previewTarget.topic} / {previewTarget.filename} ({previewChunks.length} chunks extracted)
                </p>
              </div>
              <button onClick={() => setPreviewTarget(null)} className="text-zinc-500 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {previewLoading ? (
                <div className="py-16 text-center text-zinc-500 flex flex-col items-center gap-2">
                  <Loader2 className="w-7 h-7 animate-spin text-amber-500" />
                  <span className="text-xs">Extracting text chunks from document...</span>
                </div>
              ) : previewChunks.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 text-xs italic">
                  No text content found or chunks generated for this file.
                </div>
              ) : (
                previewChunks.map((chunk) => (
                  <div 
                    key={chunk.id}
                    className="p-4 rounded-xl bg-[#1b1b1b] border border-zinc-800/80 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono border-b border-zinc-800 pb-2">
                      <span className="font-bold text-amber-500">Chunk #{chunk.chunk_index}</span>
                      <span>Page {chunk.page} • {chunk.char_length} chars</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap selection:bg-amber-500/30">
                      {chunk.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-800 flex justify-end flex-shrink-0">
              <button
                onClick={() => setPreviewTarget(null)}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 font-bold text-xs hover:bg-zinc-700"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setDeleteConfirmTarget(null)}
          />
          <div className="relative bg-[#18181b] border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl z-10 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Confirm Deletion</h3>
                <p className="text-[11px] text-zinc-400">Action cannot be undone</p>
              </div>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-3 text-xs text-zinc-300 leading-relaxed">
              {deleteConfirmTarget.message}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors flex items-center gap-2 shadow-lg shadow-rose-600/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
