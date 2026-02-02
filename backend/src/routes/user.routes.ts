import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { getMe, updateMe } from '../controllers/user.controller';

const router = express.Router();

// Toutes les routes utilisateur nécessitent une authentification
router.use(authenticate);

// ========================
// PROFIL (doit être avant /:id)
// ========================
router.get('/me', getMe);
router.put('/me', updateMe);

router.get('/:id', (req, res) => {
  res.json({ message: 'Profil utilisateur' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Profil utilisateur mis à jour' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Compte supprimé' });
});

// ========================
// STATS
// ========================
router.get('/me/stats', (req, res) => {
  res.json({
    favoriteCount: 0,
    averageRating: 0,
    reviewCount: 0,
    totalBookings: 0,
  });
});

// ========================
// BOOKINGS
// ========================
router.get('/bookings', (req, res) => {
  res.json({ data: [] });
});

router.get('/bookings/:id', (req, res) => {
  res.json({ message: 'Détail réservation' });
});

// ========================
// FAVORIS
// ========================
router.get('/favorites', (req, res) => {
  res.json({ data: [] });
});

router.post('/favorites/:providerId', (req, res) => {
  res.json({ message: 'Ajouté aux favoris' });
});

router.delete('/favorites/:providerId', (req, res) => {
  res.json({ message: 'Retiré des favoris' });
});

// ========================
// AVIS/REVIEWS
// ========================
router.get('/reviews', (req, res) => {
  res.json({ data: [] });
});

export default router;
