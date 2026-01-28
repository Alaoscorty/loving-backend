import express from 'express';
import {
  register,
  login,
  verifyToken,
  refreshToken,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateRegister, validateLogin } from '../middlewares/validation.middleware';
import { authLimiter } from '../utils/rateLimiter';

const router = express.Router();

// Routes publiques avec rate limiting
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/refresh', refreshToken);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Routes protégées
router.get('/verify', authenticate, verifyToken);
router.post('/resend-verification', authenticate, resendVerificationEmail);

export default router;
