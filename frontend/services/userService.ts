import axios, { InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/contexts/AuthContext';

const API_BASE_URL = 'https://loving-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

/** 🔐 Ajouter le token aux requêtes */
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/** 🔁 Refresh token automatique */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = response.data.accessToken;

        await SecureStore.setItemAsync(
          ACCESS_TOKEN_KEY,
          newAccessToken
        );

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('❌ Refresh token échoué', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const userService = {
  /** -------- FAVORIS -------- */
  getFavorites: () => api.get('/favorites').then(res => res.data),
  addFavorite: (providerId: string) =>
    api.post('/favorites', { providerId }).then(res => res.data),
  removeFavorite: (providerId: string) =>
    api.delete(`/favorites/${providerId}`).then(res => res.data),

  /** -------- PROFIL -------- */
  getProfile: (userId?: string) =>
    api.get(userId ? `/users/${userId}` : '/users/me').then(res => res.data),

  updateProfile: (data: any) =>
    api.put('/users/me', data).then(res => res.data),

  /** -------- BOOKINGS -------- */
  getBookings: () => api.get('/bookings').then(res => res.data),
  createBooking: (data: any) =>
    api.post('/bookings', data).then(res => res.data),
  cancelBooking: (bookingId: string) =>
    api.delete(`/bookings/${bookingId}`).then(res => res.data),

  /** -------- AUTH -------- */
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });

    const { accessToken, refreshToken, user } = response.data;

    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);

    return user;
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },
};
