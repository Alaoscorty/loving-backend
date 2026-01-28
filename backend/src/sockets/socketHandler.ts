import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';
import { logger } from '../utils/logger';

// ========================
// TYPES
// ========================
interface JwtPayload {
  id: string;
  role: string;
}

interface SocketUserData {
  id: string;
  role: string;
}

// ========================
// CONNECTED USERS
// ========================
const connectedUsers = new Map<string, string>(); // userId -> socketId

// ========================
// INIT SOCKET
// ========================
export const initializeSocket = (io: Server) => {
  // ========================
  // AUTH MIDDLEWARE
  // ========================
  io.use(async (socket: Socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        logger.warn('🔐 Socket connexion refusée : token manquant');
        return next(new Error('AUTH_REQUIRED'));
      }

      if (!process.env.JWT_SECRET) {
        logger.error('❌ JWT_SECRET manquant');
        return next(new Error('SERVER_CONFIG_ERROR'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

      const user = await User.findById(decoded.id).select('_id role isActive');

      if (!user || !user.isActive) {
        logger.warn(`⛔ Utilisateur invalide : ${decoded.id}`);
        return next(new Error('USER_NOT_ALLOWED'));
      }

      socket.data.user = {
        id: user._id.toString(),
        role: user.role,
      } as SocketUserData;

      next();
    } catch (error) {
      logger.warn('❌ Token socket invalide');
      next(new Error('INVALID_TOKEN'));
    }
  });

  // ========================
  // CONNECTION
  // ========================
  io.on('connection', (socket: Socket) => {
    const user = socket.data.user as SocketUserData;
    const userId = user.id;

    logger.info(`🟢 Socket connecté : ${userId}`);

    // Enregistrer l'utilisateur
    connectedUsers.set(userId, socket.id);

    // Room personnelle
    socket.join(`user:${userId}`);

    // Notifier les autres
    socket.broadcast.emit('user:online', { userId });

    // ========================
    // CHAT MESSAGE
    // ========================
    socket.on(
      'message:send',
      async (data: { recipientId: string; message: string }) => {
        try {
          const { recipientId, message } = data;

          if (!recipientId || !message) {
            return socket.emit('message:error', {
              error: 'Données invalides',
            });
          }

          const recipientSocketId = connectedUsers.get(recipientId);

          if (recipientSocketId) {
            io.to(recipientSocketId).emit('message:receive', {
              from: userId,
              message,
              timestamp: new Date().toISOString(),
            });
          }

          socket.emit('message:sent', {
            success: true,
            timestamp: new Date().toISOString(),
          });

          // TODO : sauvegarde BDD
          // await Message.create({ from: userId, to: recipientId, message });
        } catch (error) {
          logger.error('❌ Erreur message socket', error);
          socket.emit('message:error', {
            error: 'Erreur lors de l’envoi du message',
          });
        }
      }
    );

    // ========================
    // DISCONNECT
    // ========================
    socket.on('disconnect', () => {
      logger.info(`🔴 Socket déconnecté : ${userId}`);
      connectedUsers.delete(userId);
      socket.broadcast.emit('user:offline', { userId });
    });
  });

  logger.info('⚡ Socket.io initialisé avec succès');
};
