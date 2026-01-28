import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = express.Router();

// Toutes les routes prestataire nécessitent une authentification et le rôle provider
router.use(authenticate);
router.use(authorize('provider', 'admin'));

// Routes prestataire (à implémenter)
router.get('/dashboard', (req, res) => {
  res.json({ message: 'Dashboard prestataire (à implémenter)' });
});

export default router;
