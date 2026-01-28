import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function ProviderDashboardScreen() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Bienvenue, {user?.firstName} !</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Fonctionnalités à venir</Text>
        <Text style={styles.text}>- Gestion du profil</Text>
        <Text style={styles.text}>- Planning</Text>
        <Text style={styles.text}>- Demandes de réservation</Text>
        <Text style={styles.text}>- Revenus</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#8b5cf6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e9d5ff',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
});
