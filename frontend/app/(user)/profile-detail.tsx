import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { profileService } from '@/services/profileService';
import { Button, Card, StarRating, LoadingSpinner } from '@/components';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ProfileData {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  description?: string;
  age?: number;
  location?: string;
  photos?: string[];
  rating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  rates?: {
    hourly?: number;
    daily?: number;
  };
  services?: string[];
}

export default function ProfileDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const profileId = params.id as string;
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', profileId],
    queryFn: async () => {
      if (!profileId) {
        throw new Error('ID de profil manquant');
      }
      try {
        const response = await profileService.getProfileById(profileId);
        return response?.data || response;
      } catch (err) {
        console.error('Erreur lors du chargement du profil:', err);
        throw err;
      }
    },
    enabled: !!profileId,
    retry: 2,
  });

  // Valider les données du profil
  const validProfile = useMemo(() => {
    if (!profile) return null;
    return {
      id: profile._id || profile.id || profileId,
      firstName: profile.firstName || 'Utilisateur',
      lastName: profile.lastName || '',
      description: profile.description || 'Pas de description',
      age: profile.age || 0,
      location: profile.location || 'Localisation inconnue',
      photos: Array.isArray(profile.photos) ? profile.photos : [],
      rating: typeof profile.rating === 'number' ? profile.rating : 0,
      reviewCount: typeof profile.reviewCount === 'number' ? profile.reviewCount : 0,
      isVerified: profile.isVerified || false,
      rates: profile.rates || { hourly: 0, daily: 0 },
      services: Array.isArray(profile.services) ? profile.services : [],
    };
  }, [profile, profileId]);

  const currentPhoto = validProfile?.photos?.[selectedPhotoIndex];

  // Gestion des erreurs
  if (error) {
    return (
      <View style={styles.center}>
        <MaterialCommunityIcons
          name="alert-circle"
          size={48}
          color="#ef4444"
          style={{ marginBottom: 12 }}
        />
        <Text style={styles.errorText}>Erreur lors du chargement</Text>
        <Text style={styles.errorSubtext}>
          {error instanceof Error ? error.message : 'Une erreur est survenue'}
        </Text>
        <Button
          title="Retour"
          onPress={() => router.back()}
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!validProfile) {
    return (
      <View style={styles.center}>
        <MaterialCommunityIcons
          name="account-question"
          size={48}
          color="#d1d5db"
          style={{ marginBottom: 12 }}
        />
        <Text style={styles.errorText}>Profil non trouvé</Text>
        <Button
          title="Retour"
          onPress={() => router.back()}
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }

  const handleBooking = () => {
    router.push({
      pathname: '/(user)/reservation',
      params: { providerId: validProfile.id },
    });
  };

  const handleChat = () => {
    router.push({
      pathname: '/(user)/chat',
      params: { providerId: validProfile.id, providerName: `${validProfile.firstName} ${validProfile.lastName}` },
    });
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      'Favoris',
      isFavorite
        ? `${validProfile.firstName} a été retiré de vos favoris`
        : `${validProfile.firstName} a été ajouté à vos favoris`
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Photo Gallery */}
      <View style={styles.photoContainer}>
        {currentPhoto ? (
          <Image
            source={{ uri: currentPhoto }}
            style={styles.mainPhoto}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderPhoto}>
            <MaterialCommunityIcons
              name="image-off"
              size={64}
              color="#d1d5db"
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <View style={styles.backButtonBg}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Photo Indicators */}
        {validProfile.photos.length > 0 && (
          <View style={styles.photoIndicators}>
            {validProfile.photos.map((_: any, index: number) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.indicator,
                  selectedPhotoIndex === index && styles.indicatorActive,
                ]}
                onPress={() => setSelectedPhotoIndex(index)}
              />
            ))}
          </View>
        )}
      </View>

      {/* Profile Info */}
      <View style={styles.content}>
        <Card style={styles.headerCard}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>
                {validProfile.firstName} {validProfile.lastName}
              </Text>
              {validProfile.isVerified && (
                <View style={styles.badgesContainer}>
                  <View style={styles.badge}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={14}
                      color="#ffffff"
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.badgeText}>Vérifiée</Text>
                  </View>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={handleFavorite}
            >
              <MaterialCommunityIcons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={28}
                color={isFavorite ? '#ef4444' : '#9ca3af'}
              />
            </TouchableOpacity>
          </View>

          {/* Quick Info */}
          <View style={styles.quickInfo}>
            {validProfile.location && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={18}
                  color="#6366f1"
                />
                <Text style={styles.infoText}>{validProfile.location}</Text>
              </View>
            )}

            {validProfile.age > 0 && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="cake-variant"
                  size={18}
                  color="#6366f1"
                />
                <Text style={styles.infoText}>{validProfile.age} ans</Text>
              </View>
            )}

            {validProfile.rating > 0 && (
              <View style={styles.ratingContainer}>
                <StarRating
                  rating={validProfile.rating}
                  readOnly
                  showNumber={false}
                />
                <Text style={styles.reviewCount}>
                  {validProfile.reviewCount} avis
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* Description */}
        {validProfile.description && (
          <Card>
            <Text style={styles.sectionTitle}>À propos</Text>
            <Text style={styles.description}>{validProfile.description}</Text>
          </Card>
        )}

        {/* Pricing */}
        <Card>
          <Text style={styles.sectionTitle}>Tarifs</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>À l'heure</Text>
            <Text style={styles.price}>
              {validProfile.rates?.hourly || 0}€
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>À la journée</Text>
            <Text style={styles.price}>
              {validProfile.rates?.daily || 0}€
            </Text>
          </View>
        </Card>

        {/* Services */}
        {validProfile.services.length > 0 && (
          <Card>
            <Text style={styles.sectionTitle}>Services</Text>
            <View style={styles.servicesContainer}>
              {validProfile.services.map((service: string, index: number) => (
                <View key={`service-${index}`} style={styles.serviceTag}>
                  <Text style={styles.serviceText}>{service}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Réserver"
            variant="primary"
            size="large"
            onPress={handleBooking}
            style={{ flex: 1, marginRight: 8 }}
          />
          <Button
            title="Contacter"
            variant="secondary"
            size="large"
            onPress={handleChat}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingTop: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  photoContainer: {
    position: 'relative',
    backgroundColor: '#e5e7eb',
  },
  mainPhoto: {
    width: '100%',
    height: 400,
    backgroundColor: '#f3f4f6',
  },
  placeholderPhoto: {
    width: '100%',
    height: 400,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
  },
  backButtonBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoIndicators: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  indicatorActive: {
    backgroundColor: '#ffffff',
    width: 12,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  favoriteButton: {
    padding: 8,
  },
  quickInfo: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#4b5563',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  reviewCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  priceLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10b981',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  serviceText: {
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
  },
});
