import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = (process.env.JWT_SECRET || 'your-secret-key') as any;

const JWT_REFRESH_SECRET = (process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key') as any;

const JWT_EXPIRE: SignOptions['expiresIn'] =
  (process.env.JWT_EXPIRE as SignOptions['expiresIn']) || '24h';

const JWT_REFRESH_EXPIRE: SignOptions['expiresIn'] =
  (process.env.JWT_REFRESH_EXPIRE as SignOptions['expiresIn']) || '7d';

export interface TokenPayload {
  id: string;
  role: string;
}

export const generateToken = (userId: string, role: string): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRE,
  };

  return jwt.sign(
    { id: userId, role },
    JWT_SECRET,
    options
  );
};

export const generateRefreshToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: JWT_REFRESH_EXPIRE,
  };

  return jwt.sign(
    { id: userId },
    JWT_REFRESH_SECRET,
    options
  );
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): { id: string } => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as { id: string };
};
