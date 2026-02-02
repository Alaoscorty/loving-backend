import { Stack } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function UserLayout() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Ou un écran de chargement
  }

  if (!isAuthenticated || user?.role !== 'user') {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="home" />
      <Stack.Screen name="profile-settings" />
      <Stack.Screen name="reservation" />
      <Stack.Screen name="bookings" />
      <Stack.Screen name="calendar" />
      <Stack.Screen name="favorites" />
      <Stack.Screen name="reviews" />
      <Stack.Screen name="cancel-booking" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="conversations-list" />
      <Stack.Screen name="profile-detail" />
      <Stack.Screen name="profiles-list" />
      <Stack.Screen name="payment" />
    </Stack>
  );
}
