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

// Paramètres de sécurité pour l'écran provider security-settings
router.get('/me/security-settings', (req, res) => {
  res.json({
    success: true,
    data: {
      twoFactorEnabled: false,
      twoFactorMethod: 'sms',
      phoneVerified: false,
      emailVerified: true,
    },
  });
});

// Changement de mot de passe (stub, à sécuriser en prod)
router.post('/change-password', (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Mot de passe actuel et nouveau mot de passe requis',
    });
  }
  return res.json({
    success: true,
    message: 'Mot de passe changé (simulation)',
  });
});

// Activation 2FA (stub)
router.post('/2fa/enable', (req, res) => {
  const { method, verificationCode } = req.body;
  if (!method || !verificationCode) {
    return res.status(400).json({
      success: false,
      message: 'Méthode et code de vérification requis',
    });
  }
  return res.json({
    success: true,
    message: '2FA activée (simulation)',
  });
});

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
