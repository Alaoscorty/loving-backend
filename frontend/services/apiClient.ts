import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://loving-backend.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor pour ajouter le token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      // Token expiré ou invalide
      await AsyncStorage.removeItem('authToken');
      // Redirection vers login (à gérer au niveau de l'app)
    }
    return Promise.reject(error);
  }
);

export default apiClient;
