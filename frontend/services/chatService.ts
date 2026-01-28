import apiClient from './apiClient';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: string[];
  participantAvatars: string[];
  lastMessage?: Message;
  lastActivity: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

class ChatService {
  async getConversations(page: number = 1, limit: number = 20) {
    try {
      const response = await apiClient.get('/chat/conversations', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getConversation(conversationId: string, page: number = 1, limit: number = 50) {
    try {
      const response = await apiClient.get(
        `/chat/conversations/${conversationId}`,
        {
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createConversation(userId: string) {
    try {
      const response = await apiClient.post('/chat/conversations', {
        participantId: userId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async sendMessage(
    conversationId: string,
    content: string,
    type: 'text' | 'image' | 'file' = 'text',
    fileData?: any
  ) {
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('type', type);

      if (fileData) {
        formData.append('file', {
          uri: fileData.uri,
          type: fileData.type,
          name: fileData.name,
        } as any);
      }

      const response = await apiClient.post(
        `/chat/conversations/${conversationId}/messages`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async markAsRead(conversationId: string) {
    try {
      const response = await apiClient.patch(
        `/chat/conversations/${conversationId}/read`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteConversation(conversationId: string) {
    try {
      const response = await apiClient.delete(
        `/chat/conversations/${conversationId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async blockUser(userId: string) {
    try {
      const response = await apiClient.post('/chat/block', {
        blockedUserId: userId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async unblockUser(userId: string) {
    try {
      const response = await apiClient.post('/chat/unblock', {
        blockedUserId: userId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const chatService = new ChatService();
