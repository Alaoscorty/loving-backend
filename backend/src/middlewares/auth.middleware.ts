import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/User.model';

// 🔹 Extension propre de Express.Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

interface DecodedToken extends JwtPayload {
  id: string;
  role: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: "Token d'authentification manquant",
      });
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    let decoded: DecodedToken;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as DecodedToken;
    } catch {
      res.status(401).json({
        success: false,
        message: 'Token invalide ou expiré',
      });
      return;
    }

    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé ou désactivé',
      });
      return;
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: "Erreur interne d'authentification",
    });
  }
};

// 🔒 Middleware de rôle
export const authorize =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Non authentifié',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Accès refusé. Permissions insuffisantes.',
      });
      return;
    }

    next();
  };

// Alias pour compatibilité
export const authMiddleware = authenticate;
