import Constants from 'expo-constants';

export const config = {
  API_URL: Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  SOCKET_URL: Constants.expoConfig?.extra?.socketUrl || process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:3000',
  APP_NAME: 'Loving',
  APP_DESCRIPTION: 'Plateforme d\'accompagnement social et événementiel',
};

export const colors = {
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  secondary: '#8b5cf6',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  background: '#ffffff',
  backgroundDark: '#1f2937',
  text: '#1f2937',
  textLight: '#6b7280',
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
