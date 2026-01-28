export type UserRole = 'user' | 'provider' | 'admin';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  isVerified?: boolean;
  isActive?: boolean;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface ApiError {
  message: string;
  errors?: Array<{ field: string; message: string }>;
}
