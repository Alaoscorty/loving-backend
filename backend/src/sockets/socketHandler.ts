import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';
import { logger } from '../utils/logger';

interface SocketUser {
  userId: string;
  socketId: string;
}

const connectedUsers = new Map<string, string>(); // userId -> socketId

export const initializeSocket = (io: Server) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Token manquant'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as {
        id: string;
        role: string;
      };

      const user = await User.findById(decoded.id);

      if (!user || !user.isActive) {
        return next(new Error('Utilisateur non trouvé ou désactivé'));
      }

      socket.data.user = {
        id: user._id.toString(),
        role: user.role,
      };

      next();
    } catch (error) {
      next(new Error('Token invalide'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.user.id;

    logger.info(`Utilisateur connecté: ${userId}`);

    // Enregistrer l'utilisateur connecté
    connectedUsers.set(userId, socket.id);

    // Notifier les autres utilisateurs de la connexion
    socket.broadcast.emit('user:online', { userId });

    // Rejoindre la room de l'utilisateur
    socket.join(`user:${userId}`);

    // Gestion des messages de chat
    socket.on('message:send', async (data) => {
      try {
        const { recipientId, message } = data;

        // Vérifier que le destinataire est connecté
        const recipientSocketId = connectedUsers.get(recipientId);

        if (recipientSocketId) {
          io.to(recipientSocketId).emit('message:receive', {
            from: userId,
            message,
            timestamp: new Date(),
          });
        }

        // Sauvegarder le message dans la base de données (à implémenter)
        // await saveMessage(userId, recipientId, message);

        socket.emit('message:sent', { success: true });
      } catch (error) {
        logger.error('Erreur lors de l\'envoi du message:', error);
        socket.emit('message:error', { error: 'Erreur lors de l\'envoi' });
      }
    });

    // Déconnexion
    socket.on('disconnect', () => {
      logger.info(`Utilisateur déconnecté: ${userId}`);
      connectedUsers.delete(userId);
      socket.broadcast.emit('user:offline', { userId });
    });
  });

  logger.info('Socket.io initialisé');
};
