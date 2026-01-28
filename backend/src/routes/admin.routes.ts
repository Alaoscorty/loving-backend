import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = express.Router();

// Toutes les routes admin nécessitent une authentification et le rôle admin
router.use(authenticate);
router.use(authorize('admin'));

// Routes admin (à implémenter)
router.get('/dashboard', (req, res) => {
  res.json({ message: 'Dashboard admin (à implémenter)' });
});

export default router;
