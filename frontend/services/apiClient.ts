import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ACCESS_TOKEN_KEY } from '@/contexts/AuthContext';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://loving-backend.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor pour ajouter le token (même clé que AuthContext)
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // SecureStore indisponible (ex: web)
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      } catch {
        // Redirection vers login à gérer au niveau de l'app
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
