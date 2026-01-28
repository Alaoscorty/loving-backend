import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const API_URL = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL || 'https://loving-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  async (config) => {
    const token = await getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expiré, essayer de rafraîchir
      // Cette logique sera gérée par le contexte d'authentification
    }
    return Promise.reject(error);
  }
);

// Fonction utilitaire pour récupérer le token (à implémenter avec SecureStore)
const getStoredToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync('auth_token');
  } catch {
    return null;
  }
};

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'user' | 'provider';
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: 'user' | 'provider' | 'admin';
    isVerified: boolean;
  };
}

export const authService = {
  async register(data: RegisterData) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async verifyToken(token: string) {
    const response = await api.get('/auth/verify', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async refreshToken(token: string) {
    const response = await api.post('/auth/refresh', { refreshToken: token });
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, password: string) {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  async verifyEmail(token: string) {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  async resendVerificationEmail() {
    const response = await api.post('/auth/resend-verification');
    return response.data;
  },
};
