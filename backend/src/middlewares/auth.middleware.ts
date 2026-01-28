import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';

// Étendre l'interface Request pour inclure user
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

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Token d\'authentification manquant',
      });
      return;
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as {
        id: string;
        role: string;
      };

      // Vérifier que l'utilisateur existe toujours
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
      res.status(401).json({
        success: false,
        message: 'Token invalide ou expiré',
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur d\'authentification',
    });
    return;
  }
};

// Middleware pour vérifier les rôles
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
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
};
