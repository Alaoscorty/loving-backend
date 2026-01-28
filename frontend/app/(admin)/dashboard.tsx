import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboardScreen() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Tableau d’administration</Text>
        <Text style={styles.subtitle}>
          Bienvenue, {user?.firstName || 'Admin'}
        </Text>
      </View>

      {/* STATS */}
      <View style={styles.statsContainer}>
        <StatCard title="Utilisateurs" value="128" />
        <StatCard title="Prestataires" value="42" />
        <StatCard title="Réservations" value="87" />
        <StatCard title="Signalements" value="5" alert />
      </View>

      {/* GESTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gestion de la plateforme</Text>

        <AdminButton title="Valider les profils prestataires" />
        <AdminButton title="Gérer les utilisateurs" />
        <AdminButton title="Gérer les réservations" />
        <AdminButton title="Modération & signalements" />
        <AdminButton title="Statistiques détaillées" />
      </View>

      {/* SÉCURITÉ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sécurité</Text>
        <AdminButton title="Logs & activités" />
        <AdminButton title="Suspendre un compte" danger />
      </View>
    </ScrollView>
  );
}

/* =======================
   COMPONENTS
======================= */

function StatCard({
  title,
  value,
  alert,
}: {
  title: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <View style={[styles.statCard, alert && styles.alertCard]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}

function AdminButton({
  title,
  danger,
}: {
  title: string;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.button, danger && styles.dangerButton]}
      activeOpacity={0.8}
      onPress={() => {
        // navigation future
        console.log(title);
      }}
    >
      <Text style={[styles.buttonText, danger && styles.dangerText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

/* =======================
   STYLES
======================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ef4444',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 15,
    color: '#fee2e2',
    marginTop: 4,
  },

  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  alertCard: {
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  statTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },

  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },

  button: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  buttonText: {
    fontSize: 16,
    color: '#111827',
  },
  dangerText: {
    color: '#ef4444',
    fontWeight: '600',
  },
});
