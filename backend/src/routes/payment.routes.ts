import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// Toutes les routes de paiement nécessitent une authentification
router.use(authenticate);

// Création d'un PaymentIntent (simulation)
router.post('/intent', (req, res) => {
  const { bookingId, amount } = req.body || {};
  res.json({
    clientSecret: 'pi_dummy_client_secret',
    publishableKey: 'pk_test_dummy_key',
    bookingId,
    amount,
  });
});

// Confirmation de paiement (simulation)
router.post('/confirm', (req, res) => {
  const { bookingId, amount, paymentMethodId } = req.body || {};
  res.json({
    success: true,
    message: 'Paiement confirmé (simulation)',
    data: {
      id: 'pay_' + Date.now(),
      bookingId,
      amount,
      paymentMethodId,
      status: 'completed',
      date: new Date().toISOString(),
    },
  });
});

// Historique des paiements (simulation)
router.get('/history', (req, res) => {
  res.json([]);
});

// Liste des méthodes de paiement (simulation)
router.get('/methods', (req, res) => {
  res.json([
    {
      id: 'card_1',
      type: 'card',
      label: 'Carte principale',
      lastDigits: '4242',
      isDefault: true,
    },
  ]);
});

// Ajout d'une méthode de paiement (simulation)
router.post('/methods', (req, res) => {
  res.json({
    success: true,
    message: 'Méthode de paiement ajoutée (simulation)',
  });
});

// Suppression d'une méthode (simulation)
router.delete('/methods/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Méthode de paiement supprimée (simulation)',
  });
});

// Remboursement (simulation)
router.post('/:id/refund', (req, res) => {
  res.json({
    success: true,
    message: 'Remboursement créé (simulation)',
  });
});

// Traitement d'un paiement générique (utilisé par processPayment)
router.post('/process', (req, res) => {
  const { bookingId, amount, paymentMethodId } = req.body || {};
  res.json({
    success: true,
    message: 'Paiement traité (simulation)',
    id: 'pay_' + Date.now(),
    bookingId,
    amount,
    paymentMethodId,
    status: 'completed',
    date: new Date().toISOString(),
  });
});

export default router;

