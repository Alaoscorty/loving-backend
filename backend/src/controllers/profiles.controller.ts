import { Request, Response } from 'express';
import { Profile } from '../models/Profile.model';
import { User } from '../models/User.model';

/**
 * S'assure que chaque utilisateur avec rôle provider a un document Profile (pour les comptes créés avant l'auto-création).
 */
async function ensureProviderProfilesExist() {
  const providerUserIds = await User.find({ role: 'provider' }).select('_id').lean();
  const ids = providerUserIds.map((u: any) => u._id);
  const existing = await Profile.find({ userId: { $in: ids } }).select('userId').lean();
  const existingIds = new Set(existing.map((p: any) => p.userId?.toString()));
  const toCreate = ids.filter((id: any) => !existingIds.has(id.toString()));
  if (toCreate.length === 0) return;
  await Profile.insertMany(
    toCreate.map((userId: any) => ({
      userId,
      photos: [],
      services: [],
      availability: { daysOfWeek: [], timeSlots: [] },
      status: 'pending',
      isActive: true,
    }))
  );
}

/**
 * Liste des profils provider (pour les utilisateurs qui parcourent)
 * Retourne les profils approuvés ou en attente, actifs
 */
export const listProfiles = async (req: Request, res: Response) => {
  try {
    await ensureProviderProfilesExist();

    const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
    const limit = Math.min(20, Math.max(1, parseInt(String(req.query.limit), 10) || 10));
    const skip = (page - 1) * limit;

    const query = {
      status: { $in: ['approved', 'pending'] },
      isActive: true,
    };

    const [profiles, total] = await Promise.all([
      Profile.find(query)
        .populate('userId', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Profile.countDocuments(query),
    ]);

    const data = profiles.map((p: any) => {
      const user = p.userId || {};
      const hourlyRate = Array.isArray(p.services) && p.services[0]
        ? p.services[0].basePrice
        : 0;
      const locationStr = p.location
        ? [p.location.city, p.location.country].filter(Boolean).join(', ')
        : '';

      return {
        _id: p._id,
        id: p._id,
        userId: p.userId?._id || p.userId,
        firstName: user.firstName || p.displayName || 'Prénom',
        lastName: user.lastName || '',
        displayName: p.displayName,
        description: p.bio || 'Pas de description',
        location: locationStr || 'Localisation non renseignée',
        photos: p.photos || [],
        rating: typeof p.rating === 'number' ? p.rating : 0,
        reviewCount: p.reviewCount || 0,
        isVerified: !!p.isVerified,
        rates: {
          hourly: hourlyRate,
          daily: hourlyRate * 8,
        },
        services: p.services || [],
        age: p.age,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
    });

    res.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Erreur listProfiles:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des profils',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Détail d'un profil par ID (pour la page profil public)
 */
export const getProfileById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const profile = await Profile.findOne({
      _id: id,
      status: { $in: ['approved', 'pending'] },
      isActive: true,
    })
      .populate('userId', 'firstName lastName email')
      .lean();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profil non trouvé',
      });
    }

    const p = profile as any;
    const user = p.userId || {};
    const hourlyRate = Array.isArray(p.services) && p.services[0]
      ? p.services[0].basePrice
      : 0;
    const locationStr = p.location
      ? [p.location.city, p.location.country].filter(Boolean).join(', ')
      : '';

    const data = {
      _id: p._id,
      id: p._id,
      userId: p.userId?._id || p.userId,
      firstName: user.firstName || p.displayName || 'Prénom',
      lastName: user.lastName || '',
      displayName: p.displayName,
      description: p.bio || 'Pas de description',
      location: locationStr || 'Localisation non renseignée',
      photos: p.photos || [],
      rating: typeof p.rating === 'number' ? p.rating : 0,
      reviewCount: p.reviewCount || 0,
      isVerified: !!p.isVerified,
      rates: {
        hourly: hourlyRate,
        daily: hourlyRate * 8,
      },
      services: p.services || [],
      availability: p.availability,
      age: p.age,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Erreur getProfileById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement du profil',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
