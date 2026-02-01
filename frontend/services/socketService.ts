import io, { Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import { ACCESS_TOKEN_KEY } from '@/contexts/AuthContext';

let socket: Socket | null = null;

const API_URL =
  process.env.EXPO_PUBLIC_SOCKET_URL ||
  process.env.EXPO_PUBLIC_API_URL ||
  'http://localhost:3000';

interface SocketEvents {
  messageReceived: (message: any) => void;
  userOnline: (userId: string) => void;
  userOffline: (userId: string) => void;
  typingIndicator: (data: any) => void;
  connectionError: (error: any) => void;
}

const socketEvents: Partial<Record<keyof SocketEvents, (...args: any[]) => void>> = {};

export const socketService = {
  /** 🔌 Connexion Socket */
  async connect(userId: string): Promise<Socket> {
    const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

    if (!token) {
      throw new Error('Token manquant pour la connexion Socket.IO');
    }

    socket = io(API_URL, {
      auth: {
        token,
        userId,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('✅ Socket.IO connecté');
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      socketEvents.connectionError?.(error);
    });

    socket.on('disconnect', () => {
      console.log('⚠️ Socket.IO déconnecté');
    });

    socket.on('message:received', (message) => {
      socketEvents.messageReceived?.(message);
    });

    socket.on('user:online', (userId) => {
      socketEvents.userOnline?.(userId);
    });

    socket.on('user:offline', (userId) => {
      socketEvents.userOffline?.(userId);
    });

    socket.on('user:typing', (data) => {
      socketEvents.typingIndicator?.(data);
    });

    return socket;
  },

  /** ✉️ Envoyer un message */
  sendMessage(conversationId: string, message: any) {
    if (!socket) return;
    socket.emit('message:send', {
      conversationId,
      ...message,
      timestamp: new Date().toISOString(),
    });
  },

  markAsRead(conversationId: string) {
    if (!socket) return;
    socket.emit('conversation:read', { conversationId });
  },

  sendTypingIndicator(conversationId: string) {
    if (!socket) return;
    socket.emit('user:typing', { conversationId });
  },

  stopTypingIndicator(conversationId: string) {
    if (!socket) return;
    socket.emit('user:stop-typing', { conversationId });
  },

  /** 🧠 Gestion des events */
  registerEventHandler<K extends keyof SocketEvents>(
    event: K,
    callback: SocketEvents[K]
  ) {
    socketEvents[event] = callback as (...args: any[]) => void;
  },

  on(event: string, callback: (...args: any[]) => void) {
    if (!socket) return;
    socket.on(event, callback);
  },

  off(event: string, callback?: (...args: any[]) => void) {
    if (!socket) return;
    callback ? socket.off(event, callback) : socket.off(event);
  },

  disconnect() {
    socket?.disconnect();
    socket = null;
  },

  isConnected() {
    return socket?.connected ?? false;
  },

  getSocket() {
    return socket;
  },
};

export default socketService;
