import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { authService } from '@/services/authService';

export default function VerifyScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const router = useRouter();

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      await authService.verifyEmail(token!);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'verifying') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.text}>Vérification en cours...</Text>
      </View>
    );
  }

  if (status === 'success') {
    return (
      <View style={styles.container}>
        <Text style={styles.successIcon}>✓</Text>
        <Text style={styles.title}>Email vérifié !</Text>
        <Text style={styles.subtitle}>Votre compte a été vérifié avec succès.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.errorIcon}>✗</Text>
      <Text style={styles.title}>Erreur de vérification</Text>
      <Text style={styles.subtitle}>
        Le lien de vérification est invalide ou a expiré.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/(auth)/login')}
      >
        <Text style={styles.buttonText}>Retour à la connexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  successIcon: {
    fontSize: 64,
    color: '#10b981',
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 64,
    color: '#ef4444',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
