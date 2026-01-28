import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';

export default function FavoritesScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: favorites, isLoading, refetch } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => userService.getFavorites(),
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (providerId: string) => userService.removeFavorite(providerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes favoris</Text>
      </View>

      <ScrollView
        style={styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        {favorites?.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>⭐</Text>
            <Text style={styles.emptyText}>Aucun favori pour le moment</Text>
            <Text style={styles.emptySubtext}>
              Explorez les profils et ajoutez vos favoris
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push('/(user)/home')}
            >
              <Text style={styles.exploreButtonText}>Explorer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          favorites?.map((favorite: any) => (
            <TouchableOpacity
              key={favorite._id}
              style={styles.card}
              onPress={() => router.push(`/(user)/provider-profile?id=${favorite._id}`)}
            >
              <Image
                source={{ uri: favorite.photos?.[0] || 'https://via.placeholder.com/150' }}
                style={styles.photo}
              />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.name}>{favorite.displayName}</Text>
                  <TouchableOpacity
                    onPress={() => removeFavoriteMutation.mutate(favorite._id)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.location}>
                  📍 {favorite.location?.city}, {favorite.location?.country}
                </Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.rating}>★ {favorite.rating?.toFixed(1)}</Text>
                  <Text style={styles.reviewCount}>({favorite.reviewCount} avis)</Text>
                </View>
                <Text style={styles.price}>
                  À partir de {favorite.services?.[0]?.basePrice}€
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#6366f1',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  list: {
    flex: 1,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  photo: {
    width: 120,
    height: 120,
    backgroundColor: '#f5f5f5',
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  removeButtonText: {
    fontSize: 20,
    color: '#ef4444',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fbbf24',
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: '#999',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
    marginTop: 4,
  },
});
