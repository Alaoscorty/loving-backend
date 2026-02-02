import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { chatService } from '@/services/chatService';

export interface ChatMessage {
  id: string;
  text: string;
  user: { _id: string; name: string; avatar?: string };
  createdAt: Date;
}

interface ChatContextType {
  currentConversationId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  setCurrentConversation: (conversationId: string) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadConversation = useCallback(async (conversationId: string) => {
    try {
      setIsLoading(true);
      const { messages: list } = await chatService.getConversation(conversationId);
      const msgs = Array.isArray(list)
        ? list.map((msg: any) => ({
            id: msg.id || msg._id,
            text: msg.content || msg.text,
            user: { _id: msg.senderId || msg.senderId?._id, name: msg.senderName || 'Utilisateur' },
            createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
          }))
        : [];
      setMessages(msgs);
    } catch (error) {
      console.error('Failed to load conversation:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setCurrentConversation = useCallback(
    async (conversationId: string) => {
      setCurrentConversationId(conversationId);
      await loadConversation(conversationId);
    },
    [loadConversation]
  );

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!currentConversationId) return;
      try {
        const sent = await chatService.sendMessage(currentConversationId, text);
        if (sent && (sent.id || sent._id)) {
          addMessage({
            id: sent.id || sent._id,
            text: sent.content || text,
            user: { _id: sent.senderId, name: sent.senderName || 'Moi' },
            createdAt: sent.createdAt ? new Date(sent.createdAt) : new Date(),
          });
        }
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    },
    [currentConversationId, addMessage]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentConversationId(null);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        currentConversationId,
        messages,
        isLoading,
        setCurrentConversation,
        sendMessage,
        addMessage,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};
