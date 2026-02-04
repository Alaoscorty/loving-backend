import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Tableau d’administration</Text>
            <Text style={styles.subtitle}>
              Bienvenue, {user?.firstName || 'Admin'} 👋
            </Text>
          </View>
          <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => router.push('/(user)/profile-settings')}
                  >
                    <View style={styles.profileAvatar}>
                      <Text style={styles.profileAvatarText}>
                        {user?.firstName?.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  </TouchableOpacity>
        </View>
      </View>

      {/* STATS */}
      <View style={styles.statsContainer}>
        <StatCard emoji="👥" title="Utilisateurs" value="128" />
        <StatCard emoji="🛠️" title="Prestataires" value="42" />
        <StatCard emoji="📅" title="Réservations" value="87" />
        <StatCard emoji="⚠️" title="Signalements" value="5" alert />
      </View>

      {/* GESTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gestion de la plateforme</Text>
        <AdminButton
          emoji="✅"
          title="Valider les profils prestataires"
          onPress={() => router.push('/(admin)/validate-profiles')}
        />
        <AdminButton
          emoji="👤"
          title="Gérer les utilisateurs"
          onPress={() => router.push('/(admin)/user-management')}
        />
        <AdminButton
          emoji="📊"
          title="Gérer les réservations"
          onPress={() => router.push('/(admin)/advanced-dashboard')}
        />
        <AdminButton
          emoji="🚨"
          title="Modération & signalements"
          onPress={() => router.push('/(admin)/reports')}
        />
        <AdminButton
          emoji="📈"
          title="Statistiques détaillées"
          onPress={() => router.push('/(admin)/advanced-dashboard')}
        />
      </View>

      {/* SÉCURITÉ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sécurité</Text>
        <AdminButton
          emoji="📝"
          title="Logs & activités"
          onPress={() => router.push('/(admin)/logs')}
        />
        <AdminButton emoji="⛔" title="Suspendre un compte" danger />
      </View>
    </ScrollView>
  );
}

/* =======================
   COMPONENTS
======================= */

function StatCard({
  emoji,
  title,
  value,
  alert,
}: {
  emoji: string;
  title: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <View style={[styles.statCard, alert && styles.alertCard]}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}

function AdminButton({
  emoji,
  title,
  danger,
  onPress,
}: {
  emoji?: string;
  title: string;
  danger?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.button, danger && styles.dangerButton]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, danger && styles.dangerText]}>
        {emoji ? `${emoji}  ` : ''}{title}
      </Text>
    </TouchableOpacity>
  );
}

/* =======================
   STYLES
======================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { paddingBottom: 16, backgroundColor: '#6366f1', paddingTop: 60, paddingHorizontal: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#dbeafe', marginTop: 4 },
  avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#fff' },

  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, justifyContent: 'space-between' },
  statCard: { width: '48%', backgroundColor: '#fff', padding: 16, borderRadius: 14, marginBottom: 12, elevation: 2, alignItems: 'center' },
  alertCard: { borderWidth: 1, borderColor: '#ef4444' },
  statEmoji: { fontSize: 24, marginBottom: 8 },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  statTitle: { fontSize: 14, color: '#6b7280', marginTop: 4, textAlign: 'center' },

  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 12 },

  button: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 10, elevation: 1 },
  dangerButton: { borderWidth: 1, borderColor: '#ef4444' },
  buttonText: { fontSize: 16, color: '#111827' },
  dangerText: { color: '#ef4444', fontWeight: '600' },
  profileButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
