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
      const conversation = await chatService.getConversation(conversationId);
      
      if (conversation.messages) {
        setMessages(
          conversation.messages.map((msg: any) => ({
            id: msg.id,
            text: msg.content,
            user: { _id: msg.senderId, name: msg.senderName },
            createdAt: new Date(msg.createdAt),
          }))
        );
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
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

  const sendMessage = useCallback(
    async (text: string) => {
      if (!currentConversationId) return;

      try {
        await chatService.sendMessage(currentConversationId, text);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    },
    [currentConversationId]
  );

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

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
