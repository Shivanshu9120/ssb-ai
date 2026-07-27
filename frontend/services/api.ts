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

// ---------------------------------------------------------------------------
// PIQ Data Types
// ---------------------------------------------------------------------------

export interface ResidenceData {
  place: string;
  district: string;
  state: string;
  population: string;
}

export interface PermanentResidenceData extends ResidenceData {
  is_district_hq: boolean;
}

export interface FamilyMember {
  relation: string;
  education: string;
  occupation: string;
  income: string;
}

export interface AcademicRecord {
  qualification: string;
  institution: string;
  board_university: string;
  year: string;
  division_marks: string;
  medium: string;
  boarder_day: string;
  achievement: string;
}

export interface NCCDetail {
  total_training: string;
  wing: string;
  sub_unit: string;
  certificate: string;
}

export interface SportRecord {
  game: string;
  date_from?: string;
  date_to?: string;
  duration: string;
  represented: string;
  achievement: string;
}

export interface ExtracurricularRecord {
  activity_group: string;
  duration: string;
  achievement: string;
}

export interface InterviewRecord {
  sl_no: number;
  type_of_entry: string;
  ssb_place: string;
  date: string;
  chest_batch_no: string;
  result?: 'Screen Out' | 'Conference Out' | 'Recommended' | string;
}

export interface PIQData {
  // Completion
  completed_steps?: number;
  is_submitted?: boolean;
  // Q1
  selection_board?: string;
  batch_no?: string;
  chest_no?: string;
  upsc_roll_no?: string;
  // Q2 & Q3
  full_name?: string;
  father_name?: string;
  // Q4
  max_residence?: ResidenceData;
  parents_residence?: ResidenceData;
  permanent_residence?: PermanentResidenceData;
  // Q5
  state_district?: string;
  religion?: string;
  category?: string;
  mother_tongue?: string;
  date_of_birth?: string;
  marital_status?: string;
  // Q6
  parents_alive?: boolean | null;
  mother_death_age?: string;
  father_death_age?: string;
  family_members?: FamilyMember[];
  // Q7
  academic_records?: AcademicRecord[];
  // Q8
  age_years?: number | string;
  age_months?: number | string;
  height?: string;
  weight?: string;
  // Q9
  present_occupation?: string;
  monthly_income?: string;
  // Q10
  ncc_training?: boolean | null;
  ncc_details?: NCCDetail[];
  // Q11
  sports?: SportRecord[];
  hobbies?: string;
  extracurricular?: ExtracurricularRecord[];
  responsibility_positions?: string;
  // Q12–Q14
  nature_of_commission?: string;
  choice_of_service?: string;
  commission_attempts?: number | string;
  previous_interviews?: InterviewRecord[];
  // SSB context
  exam?: string;
  level?: string;
}

// ---------------------------------------------------------------------------
// Legacy profile input (kept for backward compat if needed)
// ---------------------------------------------------------------------------
export interface UserProfileInput {
  exam: string;
  branch?: string;
  attempt: number;
  level: string;
}

export const apiService = {
  // ---------------------------------------------------------------------------
  // User Profile (returns user + piq_profile)
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // PIQ Profile — Full DIPR 107-A
  // ---------------------------------------------------------------------------
  async getPIQProfile() {
    const res = await fetch(`${API_BASE_URL}/api/user/piq`, {
      headers: await getHeaders(),
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch PIQ profile');
    return res.json();
  },

  async updatePIQProfile(data: PIQData) {
    const cleanData: any = { ...data };
    if (cleanData.date_of_birth === '' || cleanData.date_of_birth === undefined) cleanData.date_of_birth = null;
    if (cleanData.age_years === '' || cleanData.age_years === undefined) cleanData.age_years = null;
    if (cleanData.age_months === '' || cleanData.age_months === undefined) cleanData.age_months = null;
    if (cleanData.commission_attempts === '' || cleanData.commission_attempts === undefined) cleanData.commission_attempts = null;

    if (Array.isArray(cleanData.previous_interviews)) {
      cleanData.previous_interviews = cleanData.previous_interviews.map((item: any) => ({
        ...item,
        sl_no: item.sl_no === '' || item.sl_no === undefined ? null : item.sl_no,
      }));
    }

    const res = await fetch(`${API_BASE_URL}/api/user/piq`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify(cleanData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      let msg = 'Failed to save PIQ profile';
      if (typeof err?.detail === 'string') {
        msg = err.detail;
      } else if (Array.isArray(err?.detail) && err.detail.length > 0) {
        msg = err.detail.map((e: any) => e.msg || e.detail).filter(Boolean).join(', ');
      }
      throw new Error(msg);
    }
    return res.json();
  },

  async extractPIQ(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE_URL}/api/user/piq/extract`, {
      method: 'POST',
      headers: await getHeaders(true),
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.detail || 'Failed to extract PIQ form');
    }
    return res.json();
  },

  // ---------------------------------------------------------------------------
  // Chats
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Usage Logs
  // ---------------------------------------------------------------------------
  async getUsage() {
    const res = await fetch(`${API_BASE_URL}/api/usage`, {
      headers: await getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch usage metrics');
    return res.json();
  },

  // ---------------------------------------------------------------------------
  // Admin Docs & Namespaces CRUD
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // SSE Chat Response Streaming
  // ---------------------------------------------------------------------------
  async streamChat(
    message: string,
    chatId: string | null,
    callbacks: {
      onInit: (data: { chat_id: string; citations: any[]; include_piq?: boolean }) => void;
      onChunk: (text: string) => void;
      onMetadata: (metadata: { prompt_tokens: number; completion_tokens: number; model: string }) => void;
      onError: (err: string) => void;
      onDone: () => void;
    },
    includePiq?: boolean
  ) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify({ message, chat_id: chatId, include_piq: includePiq }),
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
