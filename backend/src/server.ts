import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './utils/logger';
import { initializeSocket } from './sockets/socketHandler';
import { generalLimiter } from './utils/rateLimiter';
import './cron/jobs'; // Initialiser les tâches cron
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import providerRoutes from './routes/provider.routes';
import adminRoutes from './routes/admin.routes';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || '';

// Middlewares de sécurité
app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8081',
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting général
app.use('/api', generalLimiter);

// Routes de santé
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/admin', adminRoutes);

// Initialiser Socket.io
initializeSocket(io);

// Gestion des erreurs
app.use(errorHandler);

// Connexion à MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    logger.info('✅ Connexion à MongoDB réussie');
    httpServer.listen(PORT, () => {
      logger.info(`🚀 Serveur démarré sur le port ${PORT}`);
      logger.info(`📱 Environnement: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((error) => {
    logger.error('❌ Erreur de connexion à MongoDB:', error);
    process.exit(1);
  });

// Gestion de l'arrêt propre
process.on('SIGTERM', () => {
  logger.info('SIGTERM reçu, arrêt du serveur...');
  httpServer.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});

export { app, io };
