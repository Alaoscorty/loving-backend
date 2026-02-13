import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { User } from '../models/User.model';
import { Profile } from '../models/Profile.model';
import { Booking } from '../models/Booking.model';

const router = express.Router();

// Toutes les routes admin nécessitent une authentification et le rôle admin
router.use(authenticate);
router.use(authorize('admin'));

// ========================
// DASHBOARD
// ========================
router.get('/dashboard', async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    // Calculer la date de début selon la période
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    // Stats générales
    const totalUsers = await User.countDocuments();
    const totalProviders = await User.countDocuments({ role: 'provider' });
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Stats par période
    const newUsersThisPeriod = await User.countDocuments({
      createdAt: { $gte: startDate }
    });

    const bookingsThisPeriod = await Booking.countDocuments({
      createdAt: { $gte: startDate }
    });

    const revenueThisPeriod = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const pendingProfiles = await Profile.countDocuments({ status: 'pending' });
    const activeListings = await Profile.countDocuments({
      status: 'approved',
      isActive: true
    });

    res.json({
      totalUsers,
      totalProviders,
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      newUsersThisPeriod,
      bookingsThisPeriod,
      revenueThisPeriod: revenueThisPeriod[0]?.total || 0,
      pendingProfiles,
      activeListings,
      period
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ========================
// GESTION DES UTILISATEURS
// ========================
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;

    const query: any = {};
    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password -refreshToken')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    const total = await User.countDocuments(query);

    res.json({
      data: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/users/:id', (req, res) => {
  res.json({ message: 'Détail utilisateur' });
});

router.put('/users/:id', (req, res) => {
  res.json({ message: 'Utilisateur mis à jour' });
});

router.delete('/users/:id', (req, res) => {
  res.json({ message: 'Utilisateur supprimé' });
});

// ========================
// VALIDATION PROFILS
// ========================
router.get('/profiles/pending', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const profiles = await Profile.find({ status: 'pending' })
      .populate('userId', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    const total = await Profile.countDocuments({ status: 'pending' });

    const formattedProfiles = profiles.map(profile => {
      const user = profile.userId as any; // Type assertion for populated user
      return {
        id: profile._id,
        userId: user?._id || user,
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        photos: profile.photos || [],
        description: profile.bio || '',
        verificationDocuments: [], // TODO: implement document upload
        submittedAt: profile.createdAt,
        status: profile.status,
      };
    });

    res.json({
      data: formattedProfiles,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get pending profiles error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/profiles/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const profile = await Profile.findByIdAndUpdate(
      id,
      {
        status: 'approved',
        validatedAt: new Date(),
        validatedBy: req.user!.id,
        rejectionReason: undefined
      },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }

    res.json({
      success: true,
      message: 'Profil approuvé avec succès',
      data: profile
    });
  } catch (error) {
    console.error('Approve profile error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/profiles/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: 'Raison de rejet requise' });
    }

    const profile = await Profile.findByIdAndUpdate(
      id,
      {
        status: 'rejected',
        rejectionReason: reason,
        validatedAt: new Date(),
        validatedBy: req.user!.id
      },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }

    res.json({
      success: true,
      message: 'Profil rejeté',
      data: profile
    });
  } catch (error) {
    console.error('Reject profile error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ========================
// SIGNALEMENTS/RAPPORTS
// ========================
router.get('/reports', (req, res) => {
  res.json({ data: [] });
});

router.get('/reports/:id', (req, res) => {
  res.json({ message: 'Détail signalement' });
});

router.post('/reports/:id/resolve', (req, res) => {
  res.json({ message: 'Signalement résolu' });
});

// ========================
// STATISTIQUES PLATEFORME
// ========================
router.get('/stats', (req, res) => {
  res.json({
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeListings: 0,
  });
});

router.get('/stats/daily', (req, res) => {
  res.json({ data: [] });
});

// ========================
// MODÉRATION
// ========================
router.post('/block-user/:id', (req, res) => {
  res.json({ message: 'Utilisateur bloqué' });
});

router.post('/unblock-user/:id', (req, res) => {
  res.json({ message: 'Utilisateur débloqué' });
});

router.post('/suspend-provider/:id', (req, res) => {
  res.json({ message: 'Prestataire suspendu' });
});

// ========================
// LOGS/AUDIT
// ========================
router.get('/logs', (req, res) => {
  res.json({ data: [] });
});

export default router;
