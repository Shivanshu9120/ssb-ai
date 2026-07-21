import { supabase } from '@/lib/supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function getHeaders(isMultipart = false) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error('No active session. Please log in again.');
  }

  const headers: Record<string, string> = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export interface UserProfileInput {
  exam: string;
  branch?: string;
  attempt: number;
  level: string;
}

export const apiService = {
  // User Profile
  async getProfile() {
    const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
      headers: await getHeaders(),
    });
    if (!res.ok) {
      const detail = await res.json().catch(() => ({}));
      throw new Error(`Failed to fetch profile [${res.status}]: ${detail?.detail ?? res.statusText}`);
    }
    return res.json();
  },

  async updateProfile(profile: UserProfileInput) {
    const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // Chats
  async getChatHistory() {
    const res = await fetch(`${API_BASE_URL}/api/chat/history`, {
      headers: await getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch chat history');
    return res.json();
  },

  async getChatMessages(chatId: string) {
    const res = await fetch(`${API_BASE_URL}/api/chat/${chatId}`, {
      headers: await getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async deleteChat(chatId: string) {
    const res = await fetch(`${API_BASE_URL}/api/chat/${chatId}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete conversation');
    return res.json();
  },

  // Usage Logs
  async getUsage() {
    const res = await fetch(`${API_BASE_URL}/api/usage`, {
      headers: await getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch usage metrics');
    return res.json();
  },

  // Admin Docs & Namespaces CRUD
  async getNamespaces() {
    const res = await fetch(`${API_BASE_URL}/api/documents/namespaces`, {
      headers: await getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch namespaces');
    return res.json();
  },

  async createNamespace(name: string) {
    const res = await fetch(`${API_BASE_URL}/api/documents/namespaces`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to create namespace');
    }
    return res.json();
  },

  async renameNamespace(topic: string, newName: string) {
    const res = await fetch(`${API_BASE_URL}/api/documents/namespaces/${encodeURIComponent(topic)}`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify({ new_name: newName }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to rename namespace');
    }
    return res.json();
  },

  async deleteNamespace(topic: string) {
    const res = await fetch(`${API_BASE_URL}/api/documents/namespaces/${encodeURIComponent(topic)}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to delete namespace');
    }
    return res.json();
  },

  async deleteDocument(topic: string, filename: string) {
    const res = await fetch(
      `${API_BASE_URL}/api/documents/namespaces/${encodeURIComponent(topic)}/documents/${encodeURIComponent(filename)}`,
      {
        method: 'DELETE',
        headers: await getHeaders(),
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to delete document');
    }
    return res.json();
  },

  async reindexDocument(topic: string, filename: string) {
    const res = await fetch(
      `${API_BASE_URL}/api/documents/namespaces/${encodeURIComponent(topic)}/documents/${encodeURIComponent(filename)}/reindex`,
      {
        method: 'POST',
        headers: await getHeaders(),
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to reindex document');
    }
    return res.json();
  },

  async getDocumentChunks(topic: string, filename: string) {
    const res = await fetch(
      `${API_BASE_URL}/api/documents/namespaces/${encodeURIComponent(topic)}/documents/${encodeURIComponent(filename)}/chunks`,
      {
        headers: await getHeaders(),
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to fetch document chunks');
    }
    return res.json();
  },

  async uploadDocument(topic: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE_URL}/api/documents/upload?topic=${encodeURIComponent(topic)}`, {
      method: 'POST',
      headers: await getHeaders(true),
      body: formData,
    });
    if (!res.ok) {
      const errorMsg = await res.text();
      throw new Error(errorMsg || 'Failed to upload document');
    }
    return res.json();
  },

  async triggerIndexing() {
    const res = await fetch(`${API_BASE_URL}/api/documents/index`, {
      method: 'POST',
      headers: await getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to trigger indexing');
    return res.json();
  },

  // SSE Chat Response Streaming
  async streamChat(
    message: string,
    chatId: string | null,
    callbacks: {
      onInit: (data: { chat_id: string; citations: any[] }) => void;
      onChunk: (text: string) => void;
      onMetadata: (metadata: { prompt_tokens: number; completion_tokens: number; model: string }) => void;
      onError: (err: string) => void;
      onDone: () => void;
    }
  ) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify({ message, chat_id: chatId }),
      });

      if (!response.ok) {
        const errText = await response.json().catch(() => ({ detail: 'Failed to connect to assistant' }));
        callbacks.onError(errText.detail || 'Failed to connect to assistant');
        return;
      }

      if (!response.body) {
        callbacks.onError('ReadableStream is not supported by your browser.');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        
        // Keep the last element in buffer in case it is incomplete
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            try {
              const payload = JSON.parse(trimmed.slice(6));
              
              if (payload.init) {
                callbacks.onInit(payload.init);
              } else if (payload.text) {
                callbacks.onChunk(payload.text);
              } else if (payload.metadata) {
                callbacks.onMetadata(payload.metadata);
              } else if (payload.error) {
                callbacks.onError(payload.error);
              }
            } catch (e) {
              console.error('SSE parser error', e);
            }
          }
        }
      }
      callbacks.onDone();
    } catch (error: any) {
      callbacks.onError(error?.message || 'Network error encountered.');
    }
  },
};
