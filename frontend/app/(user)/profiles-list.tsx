import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { profileService } from '@/services/profileService';
import { Card, FilterBar, LoadingSpinner } from '@/components';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export default function ProfileListScreen() {
  const router = useRouter();
  const [filters, setFilters] = useState({});
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const { data: profilesData, isLoading, refetch } = useQuery({
    queryKey: ['profiles', filters, page],
    queryFn: async () => {
      try {
        const response = await profileService.getProfiles(filters, page, 10);
        return response?.data || response;
      } catch (error) {
        console.error('Erreur lors du chargement des profils:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const profiles = Array.isArray(profilesData) ? profilesData : profilesData?.data || [];

  const filterOptions = [
    { id: 'verified', label: 'Vérifiés', icon: 'check-circle' },
    { id: 'highly-rated', label: 'Top notés', icon: 'star' },
    { id: 'new', label: 'Nouveaux', icon: 'new-box' },
  ];

  const handleFilterChange = useCallback((filterId: string | number) => {
    const id = String(filterId);
    setSelectedFilters((prev) =>
      prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id]
    );
    setPage(1);
  }, []);

  const handleProfilePress = (profileId: string) => {
    router.push({
      pathname: '/(user)/profile-detail',
      params: { id: profileId },
    });
  };

  const handleLoadMore = () => {
    if (!isLoading) {
      setPage((prev) => prev + 1);
    }
  };

  const renderProfileCard = ({ item }: any) => {
    const profile = item;
    if (!profile || !profile._id) return null;

    const profileId = profile._id || profile.id;
    const firstName = profile.firstName || 'Utilisateur';
    const lastName = profile.lastName || '';
    const location = profile.location || 'Localisation inconnue';
    const description = profile.description || 'Pas de description';
    const rating = typeof profile.rating === 'number' ? profile.rating : 0;
    const hourlyRate = profile.rates?.hourly || 0;
    const photo = Array.isArray(profile.photos) && profile.photos[0] ? profile.photos[0] : null;

    return (
      <TouchableOpacity
        onPress={() => handleProfilePress(profileId)}
        activeOpacity={0.7}
      >
        <Card style={styles.profileCard}>
          {/* Photo */}
          {photo && (
            <View style={styles.photoContainer}>
              <View style={styles.placeholder} />
            </View>
          )}

          {/* Info */}
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name} numberOfLines={1}>
                  {firstName} {lastName}
                </Text>
                <View style={styles.locationRow}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={14}
                    color="#6b7280"
                  />
                  <Text style={styles.location} numberOfLines={1}>
                    {location}
                  </Text>
                </View>
              </View>
              {profile.isVerified && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color="#10b981"
                />
              )}
            </View>

            {/* Description */}
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>

            {/* Footer with rating and price */}
            <View style={styles.footer}>
              <View style={styles.ratingRow}>
                <MaterialCommunityIcons
                  name="star"
                  size={14}
                  color="#fbbf24"
                />
                <Text style={styles.rating}>{rating.toFixed(1)}</Text>
              </View>
              <Text style={styles.price}>{hourlyRate}€/h</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  if (isLoading && profiles.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  const canLoadMore = profiles.length >= page * 10;

  return (
    <View style={styles.container}>
      {/* Filters */}
      <FilterBar
        filters={filterOptions}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        multiSelect
      />

      {/* List */}
      {profiles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="account-search"
            size={64}
            color="#d1d5db"
          />
          <Text style={styles.emptyText}>Aucun profil trouvé</Text>
          <Text style={styles.emptySubtext}>
            Essayez d'ajuster les filtres
          </Text>
        </View>
      ) : (
        <FlatList
          data={profiles}
          renderItem={renderProfileCard}
          keyExtractor={(item) => item._id || item.id || Math.random().toString()}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      )}

      {/* Load more button */}
      {canLoadMore && profiles.length > 0 && (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={handleLoadMore}
          disabled={isLoading}
        >
          <Text style={styles.loadMoreText}>
            {isLoading ? 'Chargement...' : 'Charger plus'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingTop: 20,
  },
  listContent: {
    padding: 16,
  },
  profileCard: {
    marginBottom: 12,
    overflow: 'hidden',
  },
  photoContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#e5e7eb',
    marginBottom: 12,
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#d1d5db',
  },
  profileInfo: {
    padding: 12,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  location: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
  description: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 12,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10b981',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  loadMoreButton: {
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    alignItems: 'center',
  },
  loadMoreText: {
    color: '#fff',
    fontWeight: '600',
  },
});
