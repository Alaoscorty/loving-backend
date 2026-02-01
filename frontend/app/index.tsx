import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
      
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // Rediriger selon le rôle
  if (user?.role === 'provider') {
    return <Redirect href="/(provider)/dashboard" />;
  }

  if (user?.role === 'admin') {
    return <Redirect href="/(admin)/dashboard" />;
  }

  return <Redirect href="/(user)/home" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c8bcf7f3',
  },
  Images: {
    flex:1,
    justifyContent: "center",
    alignItems: "center",
  },
});
