import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// Toutes les routes utilisateur nécessitent une authentification
router.use(authenticate);

// Routes utilisateur (à implémenter)
router.get('/profile', (req, res) => {
  res.json({ message: 'Profil utilisateur (à implémenter)' });
});

export default router;
