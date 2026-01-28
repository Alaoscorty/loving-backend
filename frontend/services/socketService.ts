import io, { Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Service Socket.IO pour le chat en temps réel
 * Gère:
 * - Connexion/Déconnexion
 * - Envoi/Réception de messages
 * - Notifications de statut en ligne
 * - Indicateurs de frappe
 */

let socket: Socket | null = null;
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

interface SocketEvents {
  messageReceived: (message: any) => void;
  userOnline: (userId: string) => void;
  userOffline: (userId: string) => void;
  typingIndicator: (data: any) => void;
  connectionError: (error: any) => void;
}

const socketEvents: Partial<SocketEvents> = {};

export const socketService = {
  /**
   * Initialiser la connexion Socket.IO
   */
  async connect(userId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = await AsyncStorage.getItem('authToken');

        socket = io(API_URL, {
          auth: {
            token,
            userId,
          },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
          transports: ['websocket', 'polling'],
        });

        // Événements de connexion
        socket.on('connect', () => {
          console.log('✓ Socket.IO connecté');
          resolve(socket);
        });

        socket.on('connect_error', (error) => {
          console.error('✗ Erreur connexion:', error);
          socketEvents.connectionError?.(error);
          reject(error);
        });

        socket.on('disconnect', () => {
          console.log('✗ Socket.IO déconnecté');
        });

        // Événements métier
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
      } catch (error) {
        reject(error);
      }
    });
  },

  /**
   * Envoyer un message
   */
  sendMessage(conversationId: string, message: any) {
    if (!socket) {
      console.error('Socket non connecté');
      return;
    }

    socket.emit('message:send', {
      conversationId,
      ...message,
      timestamp: new Date(),
    });
  },

  /**
   * Marquer une conversation comme lue
   */
  markAsRead(conversationId: string) {
    if (!socket) return;
    socket.emit('conversation:read', { conversationId });
  },

  /**
   * Envoyer indicateur de frappe
   */
  sendTypingIndicator(conversationId: string) {
    if (!socket) return;
    socket.emit('user:typing', { conversationId });
  },

  /**
   * Arrêter indicateur de frappe
   */
  stopTypingIndicator(conversationId: string) {
    if (!socket) return;
    socket.emit('user:stop-typing', { conversationId });
  },

  /**
   * S'abonner à un événement
   */
  on(event: string, callback: Function) {
    if (!socket) {
      console.error('Socket non connecté');
      return;
    }
    socket.on(event, callback);
  },

  /**
   * Se désabonner d'un événement
   */
  off(event: string, callback?: Function) {
    if (!socket) return;
    if (callback) {
      socket.off(event, callback as any);
    } else {
      socket.off(event);
    }
  },

  /**
   * Enregistrer les callbacks pour les événements
   */
  registerEventHandler(event: keyof SocketEvents, callback: Function) {
    socketEvents[event] = callback as any;
  },

  /**
   * Déconnecter le socket
   */
  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  /**
   * Vérifier si connecté
   */
  isConnected(): boolean {
    return socket?.connected || false;
  },

  /**
   * Obtenir l'instance socket
   */
  getSocket(): Socket | null {
    return socket;
  },
};

export default socketService;
