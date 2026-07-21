'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from './AuthContext';

interface ChatContextType {
  chats: any[];
  loadingHistory: boolean;
  loadChatHistory: () => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType>({
  chats: [],
  loadingHistory: false,
  loadChatHistory: async () => {},
  deleteChat: async () => {},
});

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [chats, setChats] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const loadChatHistory = async () => {
    if (!user) return;
    try {
      setLoadingHistory(true);
      const data = await apiService.getChatHistory();
      setChats(data);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      await apiService.deleteChat(chatId);
      setChats((prev) => prev.filter((c) => c.id !== chatId));
    } catch (err) {
      console.error('Failed to delete chat:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (user && !authLoading) {
      loadChatHistory();
    } else {
      setChats([]);
    }
  }, [user, authLoading]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        loadingHistory,
        loadChatHistory,
        deleteChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
