import { Stack } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function ProviderLayout() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || (user?.role !== 'provider' && user?.role !== 'admin')) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="schedule" />
      <Stack.Screen name="bookings" />
      <Stack.Screen name="availability" />
      <Stack.Screen name="block-user" />
      <Stack.Screen name="earnings" />
      <Stack.Screen name="premium" />
    </Stack>
  );
}
