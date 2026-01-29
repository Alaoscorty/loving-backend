import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { Card, LoadingSpinner } from '@/components';
import { providerService, bookingService } from '@/services';

export default function ProviderDashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // Récupérer les stats du provider
  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ['providerStats'],
    queryFn: async () => {
      // TODO: Créer l'endpoint /api/providers/me/stats
      return {
        totalBookings: 0,
        pendingRequests: 0,
        totalEarnings: 0,
        averageRating: 0,
      };
    },
  });

  // Récupérer les demandes de réservation
  const { data: bookingRequests = [], isLoading } = useQuery({
    queryKey: ['bookingRequests'],
    queryFn: async () => {
      // TODO: Créer l'endpoint /api/bookings/requests pour les providers
      return [];
    },
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchStats()]);
    setRefreshing(false);
  };

  const quickAccessItems = [
    {
      id: 'profile',
      icon: 'account',
      label: 'Profil',
      color: '#007AFF',
      bgColor: 'rgba(0, 122, 255, 0.1)',
      onPress: () => router.push('/(provider)/profile'),
    },
    {
      id: 'planning',
      icon: 'calendar',
      label: 'Planning',
      color: '#34C759',
      bgColor: 'rgba(52, 199, 89, 0.1)',
      onPress: () => router.push('/(provider)/availability'),
    },
    {
      id: 'requests',
      icon: 'bell',
      label: 'Demandes',
      color: '#FF9500',
      bgColor: 'rgba(255, 149, 0, 0.1)',
      badge: bookingRequests.length,
      onPress: () => router.push('/(provider)/requests'),
    },
    {
      id: 'earnings',
      icon: 'cash-multiple',
      label: 'Revenus',
      color: '#50C878',
      bgColor: 'rgba(80, 200, 120, 0.1)',
      onPress: () => router.push('/(provider)/earnings'),
    },
  ];

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Bienvenue 👋</Text>
          <Text style={styles.greetingName}>{user?.firstName} {user?.lastName}</Text>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push('/(provider)/profile')}
        >
          <MaterialCommunityIcons
            name="cog"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* Quick Access Icons */}
      <View style={styles.quickAccessContainer}>
        <View style={styles.quickAccessGrid}>
          {quickAccessItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.quickAccessItem,
                { backgroundColor: item.bgColor },
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={28}
                  color={item.color}
                />
                {item.badge && item.badge > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {item.badge > 9 ? '9+' : item.badge}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.quickAccessLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Statistiques</Text>
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <MaterialCommunityIcons
                name="calendar-check"
                size={24}
                color="#007AFF"
              />
            </View>
            <Text style={styles.statValue}>
              {stats?.totalBookings || 0}
            </Text>
            <Text style={styles.statLabel}>Réservations</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <MaterialCommunityIcons
                name="cash-multiple"
                size={24}
                color="#34C759"
              />
            </View>
            <Text style={styles.statValue}>
              {(stats?.totalEarnings || 0).toFixed(0)}€
            </Text>
            <Text style={styles.statLabel}>Revenus</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <MaterialCommunityIcons
                name="star"
                size={24}
                color="#FFD700"
              />
            </View>
            <Text style={styles.statValue}>
              {stats?.averageRating?.toFixed(1) || '-'}
            </Text>
            <Text style={styles.statLabel}>Note</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <MaterialCommunityIcons
                name="bell"
                size={24}
                color="#FF9500"
              />
            </View>
            <Text style={styles.statValue}>
              {stats?.pendingRequests || 0}
            </Text>
            <Text style={styles.statLabel}>En attente</Text>
          </Card>
        </View>
      </View>

      {/* Recent Requests */}
      {bookingRequests.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Demandes Récentes</Text>
            <TouchableOpacity onPress={() => router.push('/(provider)/requests')}>
              <Text style={styles.viewAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {bookingRequests.slice(0, 3).map((request: any) => (
            <Card key={request.id} style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <View style={styles.requestInfo}>
                  <Text style={styles.requestName}>
                    {request.user?.firstName} {request.user?.lastName}
                  </Text>
                  <Text style={styles.requestDate}>
                    {new Date(request.startDate).toLocaleDateString('fr-FR')}
                  </Text>
                </View>
                <View style={[
                  styles.requestStatus,
                  {
                    backgroundColor: request.status === 'pending'
                      ? 'rgba(255, 149, 0, 0.1)'
                      : 'rgba(52, 199, 89, 0.1)',
                  },
                ]}>
                  <Text style={[
                    styles.requestStatusText,
                    {
                      color: request.status === 'pending'
                        ? '#FF9500'
                        : '#34C759',
                    },
                  ]}>
                    {request.status === 'pending' ? 'Attente' : 'Accepté'}
                  </Text>
                </View>
              </View>

              {request.status === 'pending' && (
                <View style={styles.requestActions}>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => {
                      // TODO: Implémenter l'action de rejet
                    }}
                  >
                    <Text style={styles.rejectButtonText}>Rejeter</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => {
                      // TODO: Implémenter l'action d'acceptation
                    }}
                  >
                    <Text style={styles.acceptButtonText}>Accepter</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Card>
          ))}
        </View>
      )}

      {/* Empty State */}
      {bookingRequests.length === 0 && (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="inbox-outline"
            size={64}
            color="#d1d5db"
          />
          <Text style={styles.emptyTitle}>Aucune demande en attente</Text>
          <Text style={styles.emptySubtitle}>
            Vous recevrez les demandes ici
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#007AFF',
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  greetingName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginTop: 4,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAccessContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickAccessItem: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  quickAccessLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  statsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAll: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '500',
  },
  requestCard: {
    marginBottom: 12,
    padding: 16,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  requestDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  requestStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  requestStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  emptyState: {
    paddingVertical: 64,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
});
