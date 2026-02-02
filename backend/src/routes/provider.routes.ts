import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { getProviderProfile, updateProviderProfile } from '../controllers/provider.controller';

const router = express.Router();

// Toutes les routes prestataire nécessitent une authentification et le rôle provider
router.use(authenticate);
router.use(authorize('provider', 'admin'));

// ========================
// PROFIL
// ========================
router.get('/profile', getProviderProfile);
router.put('/profile', updateProviderProfile);

// ========================
// STATS & DASHBOARD
// ========================
router.get('/stats', (req, res) => {
  res.json({
    totalEarnings: 0,
    pendingEarnings: 0,
    availableBalance: 0,
    bookingsCompleted: 0,
    averageRating: 0,
    reviewCount: 0,
  });
});

router.get('/dashboard', (req, res) => {
  res.json({
    totalBookings: 0,
    pendingRequests: 0,
    totalEarnings: 0,
    averageRating: 0,
  });
});

// ========================
// AVAILABILITY/PLANNING
// ========================
router.get('/availability', (req, res) => {
  const { startDate, endDate } = req.query;
  res.json({ message: 'Disponibilités', startDate, endDate });
});

router.post('/availability', (req, res) => {
  res.json({ message: 'Disponibilités mises à jour' });
});

// ========================
// BOOKINGS/DEMANDES
// ========================
router.get('/bookings', (req, res) => {
  const { status } = req.query;
  res.json({ message: 'Réservations du prestataire', status });
});

router.get('/bookings/:id', (req, res) => {
  res.json({ message: 'Détail réservation' });
});

router.get('/requests', (req, res) => {
  res.json({ data: [] });
});

router.post('/bookings/:id/accept', (req, res) => {
  res.json({ message: 'Réservation acceptée' });
});

router.post('/bookings/:id/reject', (req, res) => {
  res.json({ message: 'Réservation rejetée' });
});

// ========================
// EARNINGS/REVENUS
// ========================
router.get('/earnings', (req, res) => {
  const { period } = req.query;
  res.json({ earnings: 0, period });
});

router.get('/earnings/detail', (req, res) => {
  res.json({ data: [] });
});

router.post('/payout', (req, res) => {
  res.json({ message: 'Demande de retrait créée' });
});

router.get('/payout-history', (req, res) => {
  res.json({ data: [] });
});

// ========================
// BLOCKED USERS
// ========================
router.get('/blocked-users', (req, res) => {
  res.json({ data: [] });
});

router.post('/block-user', (req, res) => {
  res.json({ message: 'Utilisateur bloqué' });
});

router.delete('/blocked-users/:userId', (req, res) => {
  res.json({ message: 'Utilisateur débloqué' });
});

export default router;
