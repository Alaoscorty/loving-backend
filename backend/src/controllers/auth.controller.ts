import { Request, Response } from 'express';
import { User, IUser } from '../models/User.model';
import { Profile } from '../models/Profile.model';
import { generateToken, generateRefreshToken } from '../utils/jwt';
import { sendPasswordResetEmail, sendVerificationEmail } from '../utils/email';
import crypto from 'crypto';
import { logger } from '../utils/logger';

// Inscription
export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email ou téléphone existe déjà',
      });
    }

    // Créer l'utilisateur (sans vérification d'email)
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: role || 'user',
      isVerified: true,
    });

    await user.save();

    // Créer un profil provider si le rôle est provider (pour apparaître dans la liste des profils)
    if (user.role === 'provider') {
      try {
        const existingProfile = await Profile.findOne({ userId: user._id });
        if (!existingProfile) {
          await Profile.create({
            userId: user._id,
            photos: [],
            services: [],
            availability: { daysOfWeek: [], timeSlots: [] },
            status: 'pending',
            isActive: true,
          });
        }
      } catch (profileError: any) {
        logger.error('Création profil provider:', profileError);
        // Ne pas bloquer l\'inscription
      }
    }

    // Générer les tokens
    const token = generateToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    // Sauvegarder le refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Inscription réussie.',
      data: {
        token,
        refreshToken,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error: any) {
    logger.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Connexion
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur avec le mot de passe
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect',
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect',
      });
    }

    // Vérifier si le compte est actif
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Votre compte a été désactivé. Contactez le support.',
      });
    }

    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();
    const refreshToken = generateRefreshToken(user._id.toString());
    user.refreshToken = refreshToken;
    await user.save();

    // Générer les tokens
    const token = generateToken(user._id.toString(), user.role);

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        token,
        refreshToken,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error: any) {
    logger.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Vérification du token
export const verifyToken = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error: any) {
    logger.error('Erreur lors de la vérification du token:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification',
    });
  }
};

// Rafraîchir le token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token requis',
      });
    }

    // Vérifier le refresh token (implémentation simplifiée)
    // En production, utiliser jwt.verify avec JWT_REFRESH_SECRET
    const user = await User.findOne({ refreshToken });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token invalide',
      });
    }

    const newToken = generateToken(user._id.toString(), user.role);
    const newRefreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error: any) {
    logger.error('Erreur lors du rafraîchissement du token:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du rafraîchissement',
    });
  }
};

// Vérification de l'email
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token de vérification invalide ou expiré',
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email vérifié avec succès',
    });
  } catch (error: any) {
    logger.error('Erreur lors de la vérification de l\'email:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification',
    });
  }
};

// Renvoyer l'email de vérification
export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email déjà vérifié',
      });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = verificationTokenExpiry;
    await user.save();

    await sendVerificationEmail(user.email, verificationToken);

    res.json({
      success: true,
      message: 'Email de vérification renvoyé',
    });
  } catch (error: any) {
    logger.error('Erreur lors de l\'envoi de l\'email:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de l\'email',
    });
  }
};

// Mot de passe oublié
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      // Ne pas révéler si l'email existe ou non
      return res.json({
        success: true,
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (emailError) {
      logger.error('Erreur lors de l\'envoi de l\'email:', emailError);
    }

    res.json({
      success: true,
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
    });
  } catch (error: any) {
    logger.error('Erreur lors de la demande de réinitialisation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la demande',
    });
  }
};

// Réinitialiser le mot de passe
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token invalide ou expiré',
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès',
    });
  } catch (error: any) {
    logger.error('Erreur lors de la réinitialisation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réinitialisation',
    });
  }
};

/** Code par défaut pour créer un compte administrateur */
const ADMIN_REGISTER_CODE = '20025';

/** Inscription administrateur (nécessite le code 20025) */
export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { code, firstName, lastName, email, phone, password } = req.body;

    if (!code || String(code).trim() !== ADMIN_REGISTER_CODE) {
      return res.status(403).json({
        success: false,
        message: 'Code d\'administration incorrect',
      });
    }

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !phone?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs (prénom, nom, email, téléphone, mot de passe) sont requis',
      });
    }
    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 6 caractères',
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email: (email || '').toLowerCase().trim() }, { phone: (phone || '').trim() }],
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email ou téléphone existe déjà',
      });
    }

    const user = new User({
      firstName: (firstName || '').trim(),
      lastName: (lastName || '').trim(),
      email: (email || '').toLowerCase().trim(),
      phone: (phone || '').trim(),
      password: password || '',
      role: 'admin',
      isVerified: true,
    });
    await user.save();

    const token = generateToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Compte administrateur créé avec succès.',
      data: {
        token,
        refreshToken,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error: any) {
    logger.error('Erreur registerAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du compte administrateur',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};
