import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://loving-backend.onrender.com/api'; // <-- change avec ton backend réel

// Création d'une instance Axios
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// Intercepteur pour gérer le refresh token automatiquement
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            token: refreshToken,
          });
          const newToken = response.data.accessToken;
          await AsyncStorage.setItem('accessToken', newToken);
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Erreur lors du refresh token', refreshError);
          // Ici tu peux rediriger vers login si le refresh échoue
        }
      }
    }
    return Promise.reject(error);
  }
);

export const userService = {
  /** ---------------- USER FAVORITES ---------------- **/

  getFavorites: async () => {
    const response = await api.get('/favorites');
    return response.data;
  },

  addFavorite: async (providerId: string) => {
    const response = await api.post('/favorites', { providerId });
    return response.data;
  },

  removeFavorite: async (providerId: string) => {
    const response = await api.delete(`/favorites/${providerId}`);
    return response.data;
  },

  /** ---------------- USER PROFILE ---------------- **/

  getProfile: async (userId?: string) => {
    const endpoint = userId ? `/users/${userId}` : '/users/me';
    const response = await api.get(endpoint);
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },

  /** ---------------- BOOKINGS / RESERVATIONS ---------------- **/

  getBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  createBooking: async (bookingData: any) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  cancelBooking: async (bookingId: string) => {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  },

  /** ---------------- AUTH ---------------- **/

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken } = response.data;
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    return response.data.user;
  },

  logout: async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
  },
};
