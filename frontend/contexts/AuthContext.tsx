import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { authService } from '@/services/authService';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'user' | 'provider' | 'admin';
  isVerified?: boolean;
  isActive?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
  accessToken: string,
  refreshToken: string,
  user: User
) => Promise<void>;

  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  refreshToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const ACCESS_TOKEN_KEY = 'token';
export const REFRESH_TOKEN_KEY = 'refreshToken';

const USER_KEY = 'user_data';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAuthData();
  }, []);

  const loadAuthData = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      const storedUser = await AsyncStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Vérifier si le token est toujours valide
        try {
          await authService.verifyToken(storedToken);
        } catch {
          // Token invalide, nettoyer le stockage
          await logout();
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données d\'authentification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    accessToken: string,
    refreshToken: string,
    newUser: User
  ) => {
    // Vérifier que les tokens sont des strings valides
    if (!accessToken || typeof accessToken !== 'string') {
      throw new Error('accessToken invalide ou manquant');
    }

    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new Error('refreshToken invalide ou manquant');
    }

    // S'assurer que les valeurs sont bien des strings pour SecureStore
    const tokenString = String(accessToken);
    const refreshTokenString = String(refreshToken);

    try {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokenString);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshTokenString);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));

      setToken(tokenString);
      setUser(newUser);
    } catch (error) {
      console.error('Erreur lors du stockage des tokens:', error);
      throw new Error('Erreur lors de la sauvegarde des données d\'authentification');
    }
  };



  const logout = async () => {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);

  setToken(null);
  setUser(null);
};


  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  };

  const refreshToken = async () => {
    try {
      const storedRefreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      if (!storedRefreshToken) return;

      const response = await authService.refreshToken(storedRefreshToken);
      // Le backend retourne { success: true, data: { token, refreshToken } }
      const data = response.data || response;
      const newToken = String(data.token);
      const newRefreshToken = String(data.refreshToken || storedRefreshToken);

      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, newToken);
      if (data.refreshToken) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newRefreshToken);
      }
      setToken(newToken);
    } catch (error) {
      console.error('Erreur refresh token', error);
      await logout();
    }
  };


  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    updateUser,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
