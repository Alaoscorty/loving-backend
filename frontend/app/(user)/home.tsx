import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AuthContext, NotificationContext } from '@/contexts';
import { bookingService, profileService } from '@/services';
import { Card, Button, LoadingSpinner } from '@/components';
import { formatCurrency, formatRelativeTime } from '@/utils/formatters';

/**
 * Écran Accueil Utilisateur - Vue principale avec suggestions et accès rapide
 */

export default function UserHomeScreen() {
  const { user } = React.useContext(AuthContext);
  const router = useRouter();

  // Récupérer les réservations récentes
  const { data: recentBookings = [] } = useQuery({
    queryKey: ['userRecentBookings'],
    queryFn: () => bookingService.getRecentBookings({ limit: 3 }),
  });

  // Récupérer les profils suggérés
  const { data: suggestedProfiles = [], isLoading: profilesLoading } = useQuery({
    queryKey: ['suggestedProfiles'],
    queryFn: () => profileService.getSuggestedProfiles(),
  });

  // Récupérer les statistiques utilisateur
  const { data: stats } = useQuery({
    queryKey: ['userStats'],
    queryFn: () => bookingService.getUserStats(),
  });

  const upcomingBookings = recentBookings.filter((b) =>
    new Date(b.startDate) > new Date()
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Entête personnalisée */}
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>
            Bienvenue, {user?.firstName}! 👋
          </Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
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

      {/* Stats rapides */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <MaterialCommunityIcons name="calendar-check" size={24} color="#007AFF" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.statValue}>{upcomingBookings.length}</Text>
              <Text style={styles.statLabel}>Réservations</Text>
            </View>
          </View>
        </Card>
        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <MaterialCommunityIcons name="heart" size={24} color="#e91e63" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.statValue}>{stats?.favoriteCount || 0}</Text>
              <Text style={styles.statLabel}>Favoris</Text>
            </View>
          </View>
        </Card>
        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.statValue}>{stats?.averageRating?.toFixed(1) || '-'}</Text>
              <Text style={styles.statLabel}>Note moyenne</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Prochaines réservations */}
      {upcomingBookings.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📅 Prochaines Réservations</Text>
            <TouchableOpacity onPress={() => router.push('/(user)/bookings')}>
              <Text style={styles.viewAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            scrollEnabled={false}
            data={upcomingBookings.slice(0, 2)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card style={[styles.bookingCard, { marginBottom: 12 }]}>
                <View style={styles.bookingRow}>
                  <View>
                    <Text style={styles.bookingProvider}>
                      {item.provider?.firstName} {item.provider?.lastName}
                    </Text>
                    <Text style={styles.bookingDate}>
                      {new Date(item.startDate).toLocaleDateString('fr-FR')} à{' '}
                      {new Date(item.startDate).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                    <Text style={styles.bookingStatus}>
                      Statut: <Text style={{ fontWeight: '600' }}>{item.status}</Text>
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: '/(user)/bookings',
                        params: { bookingId: item.id },
                      })
                    }
                  >
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={24}
                      color="#007AFF"
                    />
                  </TouchableOpacity>
                </View>
              </Card>
            )}
          />
        </View>
      )}

      {/* Sections rapides */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Actions Rapides</Text>
        <View style={styles.quickAccessGrid}>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => router.push('/(user)/profiles-list')}
          >
            <MaterialCommunityIcons name="magnify" size={32} color="#007AFF" />
            <Text style={styles.quickButtonText}>Chercher</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => router.push('/(user)/conversations-list')}
          >
            <MaterialCommunityIcons name="chat" size={32} color="#4caf50" />
            <Text style={styles.quickButtonText}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => router.push('/(user)/favorites')}
          >
            <MaterialCommunityIcons name="heart" size={32} color="#e91e63" />
            <Text style={styles.quickButtonText}>Favoris</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => router.push('/(user)/bookings')}
          >
            <MaterialCommunityIcons name="calendar-multiple" size={32} color="#FFD700" />
            <Text style={styles.quickButtonText}>Réservations</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Profils Suggérés */}
      {suggestedProfiles.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>✨ Suggestions pour Vous</Text>
            <TouchableOpacity onPress={() => router.push('/(user)/profiles-list')}>
              <Text style={styles.viewAll}>Voir plus</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            scrollEnabled={false}
            data={suggestedProfiles.slice(0, 2)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item.id}
                style={styles.profileCard}
                onPress={() =>
                  router.push({
                    pathname: '/(user)/profile-detail',
                    params: { profileId: item.id },
                  })
                }
              >
                <View style={styles.profileContent}>
                  <View style={styles.profileInfo}>
                    <View style={styles.profileAvatar2}>
                      <Text style={styles.profileAvatarText2}>
                        {item.firstName.charAt(0)}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.profileName}>
                        {item.firstName} {item.lastName}
                      </Text>
                      <View style={styles.ratingRow}>
                        <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
                        <Text style={styles.profileRating}>
                          {item.averageRating?.toFixed(1)} • {item.reviewCount} avis
                        </Text>
                      </View>
                      <Text style={styles.profileService}>
                        {item.services?.[0] || 'Service'}
                      </Text>
                    </View>
                    <Text style={styles.profilePrice}>{item.hourlyRate}€/h</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Call to Action */}
      {upcomingBookings.length === 0 && (
        <Card style={styles.ctaCard}>
          <MaterialCommunityIcons name="information" size={32} color="#007AFF" />
          <Text style={styles.ctaTitle}>Aucune réservation planifiée</Text>
          <Text style={styles.ctaText}>
            Explorez nos prestataires et trouvez celui qui correspond à vos besoins
          </Text>
          <Button
            title="Parcourir les profils"
            onPress={() => router.push('/(user)/profiles-list')}
            style={styles.ctaButton}
          />
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
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
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  date: {
    fontSize: 13,
    color: '#e0f2ff',
    marginTop: 4,
  },
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
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  statCard: {
    flex: 1,
    padding: 12,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  viewAll: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '500',
  },
  bookingCard: {
    padding: 16,
  },
  bookingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingProvider: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  bookingDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  bookingStatus: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickButton: {
    width: '48%',
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  quickButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  profileCard: {
    marginBottom: 12,
  },
  profileContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileAvatar2: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText2: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  profileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  profileRating: {
    fontSize: 11,
    color: '#999',
  },
  profileService: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  profilePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007AFF',
  },
  ctaCard: {
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 24,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 12,
  },
  ctaText: {
    fontSize: 13,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  ctaButton: {
    marginTop: 16,
    width: '100%',
  },
});
