import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
  createBooking,
  getUserBookings,
  getBookingById,
} from '../controllers/booking.controller';

const router = express.Router();
router.use(authenticate);

// Réservations côté utilisateur
router.get('/user', getUserBookings);
router.post('/', createBooking);
router.get('/:id', getBookingById);

// Annulation d'une réservation (stub simplifié)
router.post('/:id/cancel', (req, res) => {
  const { id } = req.params;
  const { reason } = req.body || {};
  res.json({
    success: true,
    message: 'Réservation annulée (simulation)',
    data: { id, reason },
  });
});

// Rejet d'une réservation (utilisé côté provider)
router.post('/:id/reject', (req, res) => {
  const { id } = req.params;
  const { reason } = req.body || {};
  res.json({
    success: true,
    message: 'Réservation rejetée (simulation)',
    data: { id, reason },
  });
});

// Avis sur une réservation (submitReview)
router.post('/:id/reviews', (req, res) => {
  const { id } = req.params;
  const { rating, comment, categories } = req.body || {};
  res.json({
    success: true,
    message: 'Avis enregistré (simulation)',
    data: {
      id,
      rating,
      comment,
      categories,
      createdAt: new Date().toISOString(),
    },
  });
});

export default router;
