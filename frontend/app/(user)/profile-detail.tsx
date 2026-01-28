import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { profileService } from '@/services/profileService';
import { Button, Card, StarRating, LoadingSpinner } from '@/components';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProfileDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const profileId = params.id as string;
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', profileId],
    queryFn: () => profileService.getProfileById(profileId),
  });

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Profil non trouvé</Text>
        <Button
          title="Retour"
          onPress={() => router.back()}
          style={styles.backButton}
        />
      </View>
    );
  }

  const currentPhoto = profile.photos?.[selectedPhotoIndex];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Photo Gallery */}
      {currentPhoto && (
        <View>
          <Image
            source={{ uri: currentPhoto }}
            style={styles.mainPhoto}
            resizeMode="cover"
          />
          <View style={styles.photoIndicators}>
            {profile.photos?.map((_: any, index: number) => (
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
        </View>
      )}

      {/* Profile Info */}
      <View style={styles.content}>
        <Card>
          <View style={styles.header}>
            <View>
              <Text style={styles.name}>
                {profile.firstName} {profile.lastName}
              </Text>
              <View style={styles.badgesContainer}>
                {profile.isVerified && (
                  <View style={styles.badge}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={14}
                      color="#ffffff"
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.badgeText}>Vérifiée</Text>
                  </View>
                )}
              </View>
            </View>
            <TouchableOpacity style={styles.favoriteButton}>
              <MaterialCommunityIcons
                name="heart-outline"
                size={28}
                color="#ef4444"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={18} color="#6366f1" />
            <Text style={styles.infoText}>{profile.location}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="cake-variant" size={18} color="#6366f1" />
            <Text style={styles.infoText}>{profile.age} ans</Text>
          </View>

          <View style={styles.ratingContainer}>
            <StarRating rating={profile.rating} readOnly showNumber={false} />
            <Text style={styles.reviewCount}>
              {profile.reviewCount} avis
            </Text>
          </View>
        </Card>

        {/* Description */}
        <Card>
          <Text style={styles.sectionTitle}>À propos</Text>
          <Text style={styles.description}>{profile.description}</Text>
        </Card>

        {/* Pricing */}
        <Card>
          <Text style={styles.sectionTitle}>Tarifs</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>À l'heure</Text>
            <Text style={styles.price}>{profile.rates?.hourly}€</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>À la journée</Text>
            <Text style={styles.price}>{profile.rates?.daily}€</Text>
          </View>
        </Card>

        {/* Services */}
        {profile.services && profile.services.length > 0 && (
          <Card>
            <Text style={styles.sectionTitle}>Services</Text>
            <View style={styles.servicesContainer}>
              {profile.services.map((service: string, index: number) => (
                <View key={index} style={styles.serviceTag}>
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
            onPress={() =>
              router.push({
                pathname: '/(user)/booking',
                params: { providerId: profileId },
              })
            }
            style={{ flex: 1, marginRight: 8 }}
          />
          <Button
            title="Contacter"
            variant="secondary"
            size="large"
            onPress={() =>
              router.push({
                pathname: '/(user)/chat',
                params: { providerId: profileId },
              })
            }
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
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    marginBottom: 16,
  },
  backButton: {
    width: '100%',
  },
  mainPhoto: {
    width: '100%',
    height: 400,
  },
  photoIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
    paddingVertical: 8,
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
    marginBottom: 32,
  },
});
