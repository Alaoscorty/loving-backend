import 'react-native-get-random-values';
import { Buffer } from 'buffer';
// Ensure Buffer is available globally for browser shims
if (typeof globalThis.Buffer === 'undefined') {
  // @ts-ignore
  globalThis.Buffer = Buffer;
}

import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { AuthProvider } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { notificationService } from '@/services/notificationService';

// ⚠️ Notifications UNIQUEMENT sur mobile
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      notificationService.requestPermissions();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChatProvider>
          <NotificationProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#fff' },
              }}
            >
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(user)" />
              <Stack.Screen name="(provider)" />
              <Stack.Screen name="(admin)" />
            </Stack>
          </NotificationProvider>
        </ChatProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
