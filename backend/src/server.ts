import express, { Application, Request, Response } from 'express';
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
import { initializeDefaultAdmins } from './utils/initializeAdmins';

import './cron/jobs';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import providerRoutes from './routes/provider.routes';
import adminRoutes from './routes/admin.routes';
import profilesRoutes from './routes/profiles.routes';
import chatRoutes from './routes/chat.routes';
import bookingRoutes from './routes/booking.routes';
import paymentRoutes from './routes/payment.routes';

// ========================
// CONFIG ENV
// ========================
dotenv.config();


const app: Application = express();
const httpServer = createServer(app);

app.set('trust proxy', 1);

// ========================
// SOCKET.IO
// ========================
const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.SOCKET_CORS_ORIGIN ||
      process.env.FRONTEND_URL ||
      '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// ========================
// CONSTANTES
// ========================
const PORT = Number(process.env.PORT) || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  logger.error('❌ MONGODB_URI manquant dans les variables d’environnement');
  process.exit(1);
}

// ========================
// MIDDLEWARES SÉCURITÉ
// ========================
app.use(helmet());
app.use(compression());

app.use(
  morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

// ========================
// CORS
// ========================
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);

// ========================
// BODY PARSER
// ========================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========================
// RATE LIMITING
// ========================
app.use('/api', generalLimiter);

// ========================
// HEALTH CHECK
// ========================
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================
// ROUTES API
// ========================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/profiles', profilesRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

// ========================
// SOCKET INIT
// ========================
initializeSocket(io);

// ========================
// ERROR HANDLER (DOIT ÊTRE EN DERNIER)
// ========================
app.use(errorHandler);

// ========================
// MONGODB + SERVER
// ========================
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    logger.info('✅ Connexion MongoDB réussie');

    // Initialiser les comptes admin par défaut
    await initializeDefaultAdmins();

    httpServer.listen(PORT, () => {
      logger.info(`🚀 Serveur démarré sur le port ${PORT}`);
      logger.info(`🌍 Environnement : ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((error) => {
    logger.error('❌ Connexion MongoDB échouée', error);
    process.exit(1);
  });

// ========================
// SHUTDOWN PROPRE
// ========================
process.on('SIGTERM', () => {
  logger.info('🛑 SIGTERM reçu, arrêt du serveur...');
  httpServer.close(() => {
    mongoose.connection.close(false).then(() => {
      logger.info('🔌 MongoDB déconnecté');
      process.exit(0);
    });
  });
});

export { app, io };
