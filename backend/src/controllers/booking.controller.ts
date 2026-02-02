import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Booking } from '../models/Booking.model';
import { Profile } from '../models/Profile.model';

const ObjectId = mongoose.Types.ObjectId;

export async function createBooking(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const { providerId, startDate, endDate, startTime, notes } = req.body;

    if (!providerId || !startDate) {
      return res.status(400).json({ success: false, message: 'providerId et startDate requis' });
    }

    let p: any = await Profile.findById(providerId).lean();
    if (!p) {
      p = await Profile.findOne({ userId: new ObjectId(providerId) }).lean();
    }
    if (!p) {
      return res.status(404).json({ success: false, message: 'Profil prestataire non trouvé' });
    }
    const provUserId = p.userId?.toString();
    const profileId = p._id;
    const service = Array.isArray(p?.services) && p.services[0]
      ? p.services[0]
      : { basePrice: 0, name: 'Service', type: 'hourly' };
    const startDateObj = new Date(startDate);
    const endDateObj = endDate ? new Date(endDate) : new Date(startDateObj.getTime() + 60 * 60 * 1000);
    const durationHours = Math.max(1, Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (60 * 60 * 1000)));
    const basePrice = (service.basePrice || 0) * durationHours;
    const commission = Math.round(basePrice * 0.1 * 100) / 100;
    const totalAmount = basePrice + commission;

    const startTimeStr = startTime || '09:00';
    const [h, m] = startTimeStr.toString().split(':').map(Number);
    const endHour = h + durationHours;
    const endTimeStr = `${String(endHour).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}`;

    const booking = await Booking.create({
      clientId: new ObjectId(userId),
      providerId: new ObjectId(provUserId),
      profileId: new ObjectId(profileId),
      serviceType: service.type || 'hourly',
      serviceName: service.name || 'Service',
      date: startDateObj,
      startTime: startTimeStr,
      endTime: endTimeStr,
      duration: durationHours,
      clientNotes: notes || undefined,
      basePrice,
      additionalFees: 0,
      commission,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
    });

    const created = await Booking.findById(booking._id).lean();
    res.status(201).json({
      success: true,
      data: {
        id: (created as any)._id,
        _id: (created as any)._id,
        providerId: provUserId,
        userId: userId,
        startDate: (created as any).date,
        endDate: endDateObj,
        status: (created as any).status,
        totalPrice: (created as any).totalAmount,
        ...created,
      },
    });
  } catch (error: any) {
    console.error('createBooking:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la création de la réservation' });
  }
}

export async function getUserBookings(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const { status } = req.query;
    const query: any = { clientId: new ObjectId(userId) };
    if (status && String(status).trim()) query.status = String(status).trim();

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .populate('providerId', 'firstName lastName')
      .populate('profileId')
      .lean();

    const data = (bookings as any[]).map((b) => ({
      id: b._id,
      _id: b._id,
      providerId: b.providerId?._id || b.providerId,
      userId: b.clientId,
      startDate: b.date,
      endDate: b.date,
      status: b.status,
      totalPrice: b.totalAmount,
      ...b,
    }));

    res.json({ success: true, data });
  } catch (error: any) {
    console.error('getUserBookings:', error);
    res.status(500).json({ success: false, message: 'Erreur' });
  }
}

export async function getBookingById(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate('providerId', 'firstName lastName')
      .populate('profileId')
      .lean();

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Réservation non trouvée' });
    }
    const b = booking as any;
    if (b.clientId?.toString() !== userId && b.providerId?._id?.toString() !== userId && b.providerId?.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    res.json({
      success: true,
      data: {
        id: b._id,
        _id: b._id,
        providerId: b.providerId?._id || b.providerId,
        userId: b.clientId,
        startDate: b.date,
        status: b.status,
        totalPrice: b.totalAmount,
        ...b,
      },
    });
  } catch (error: any) {
    console.error('getBookingById:', error);
    res.status(500).json({ success: false, message: 'Erreur' });
  }
}
