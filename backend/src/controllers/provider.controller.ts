import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Profile } from '../models/Profile.model';
import { User } from '../models/User.model';

const ObjectId = mongoose.Types.ObjectId;

export async function getProviderProfile(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    let profile = await Profile.findOne({ userId: new ObjectId(userId) })
      .populate('userId', 'firstName lastName')
      .lean();

    if (!profile) {
      profile = await Profile.create({
        userId: new ObjectId(userId),
        photos: [],
        services: [],
        availability: { daysOfWeek: [], timeSlots: [] },
        status: 'pending',
        isActive: true,
      });
      profile = await Profile.findById(profile._id)
        .populate('userId', 'firstName lastName')
        .lean();
    }

    const p = profile as any;
    const user = p.userId || {};
    const hourlyRate = Array.isArray(p.services) && p.services[0] ? p.services[0].basePrice : 0;
    const locationStr = p.location
      ? [p.location.city, p.location.country].filter(Boolean).join(', ')
      : '';

    res.json({
      success: true,
      data: {
        _id: p._id,
        userId: p.userId?._id || p.userId,
        firstName: user.firstName || p.displayName || '',
        lastName: user.lastName || '',
        displayName: p.displayName,
        bio: p.bio,
        location: locationStr || p.location,
        photos: p.photos || [],
        rating: p.rating ?? 0,
        reviewCount: p.reviewCount ?? 0,
        isVerified: !!p.isVerified,
        rates: { hourly: hourlyRate, daily: hourlyRate * 8 },
        services: p.services || [],
        availability: p.availability,
        age: p.age,
        status: p.status,
        isActive: p.isActive,
      },
    });
  } catch (error: any) {
    console.error('getProviderProfile:', error);
    res.status(500).json({ success: false, message: 'Erreur lors du chargement du profil' });
  }
}

export async function updateProviderProfile(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const { displayName, bio, age, location, services, availability, photos } = req.body;

    let profile = await Profile.findOne({ userId: new ObjectId(userId) });
    if (!profile) {
      profile = await Profile.create({
        userId: new ObjectId(userId),
        photos: [],
        services: [],
        availability: { daysOfWeek: [], timeSlots: [] },
        status: 'pending',
        isActive: true,
      });
    }

    const updates: Record<string, unknown> = {};
    if (displayName !== undefined) updates.displayName = displayName;
    if (bio !== undefined) updates.bio = bio;
    if (age !== undefined) updates.age = age;
    if (location !== undefined) updates.location = location;
    if (services !== undefined) updates.services = services;
    if (availability !== undefined) updates.availability = availability;
    if (photos !== undefined) updates.photos = Array.isArray(photos) ? photos : [];

    const updated = await Profile.findByIdAndUpdate(
      profile._id,
      { $set: updates },
      { new: true }
    )
      .populate('userId', 'firstName lastName')
      .lean();

    const p = updated as any;
    const user = p?.userId || {};
    const hourlyRate = Array.isArray(p?.services) && p.services[0] ? p.services[0].basePrice : 0;
    const locationStr = p?.location
      ? [p.location.city, p.location.country].filter(Boolean).join(', ')
      : '';

    res.json({
      success: true,
      data: {
        _id: p._id,
        firstName: user.firstName || p?.displayName,
        lastName: user.lastName,
        displayName: p?.displayName,
        bio: p?.bio,
        location: locationStr,
        photos: p?.photos || [],
        rating: p?.rating ?? 0,
        rates: { hourly: hourlyRate, daily: hourlyRate * 8 },
        services: p?.services || [],
        availability: p?.availability,
      },
    });
  } catch (error: any) {
    console.error('updateProviderProfile:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour du profil' });
  }
}
