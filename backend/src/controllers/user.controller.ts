import { Request, Response } from 'express';
import { User } from '../models/User.model';

export async function getMe(req: Request, res: Response) {
  try {
    const user = await User.findById(req.user!.id)
      .select('-password -refreshToken -verificationToken -verificationTokenExpiry -resetPasswordToken -resetPasswordExpiry')
      .lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    res.json({ success: true, data: user });
  } catch (error: any) {
    console.error('getMe:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

export async function updateMe(req: Request, res: Response) {
  try {
    const { firstName, lastName, phone, bio, location, avatar } = req.body;
    const updates: Record<string, unknown> = {};
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (phone !== undefined) updates.phone = phone;
    if (bio !== undefined) updates.bio = bio;
    if (location !== undefined) updates.location = location;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user!.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .select('-password -refreshToken -verificationToken -verificationTokenExpiry -resetPasswordToken -resetPasswordExpiry')
      .lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    res.json({ success: true, data: user });
  } catch (error: any) {
    console.error('updateMe:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}
