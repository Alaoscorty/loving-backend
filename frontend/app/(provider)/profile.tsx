import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { providerService } from '@/services/providerService';
import { Button, Card, Input, PhotoGallery, LoadingSpinner } from '@/components';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProviderProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any>({});
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['providerProfile'],
    queryFn: () => providerService.getProviderProfile(),
    onSuccess: (data) => {
      setProfileData(data);
      setSelectedPhotos(data.photos || []);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data) => providerService.updateProviderProfile(data),
    onSuccess: () => {
      refetch();
      setIsEditing(false);
    },
  });

  const uploadPhotosMutation = useMutation({
    mutationFn: (photos: string[]) =>
      providerService.getProviderProfile(), // À remplacer avec la bonne fonction
    onSuccess: () => {
      refetch();
    },
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(profileData);
  };

  const handleAddPhoto = () => {
    // Implémenter la sélection de photo depuis la galerie
    console.log('Add photo');
  };

  const handleRemovePhoto = (index: number) => {
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Profil Public</Text>
          <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            style={styles.editButton}
          >
            <MaterialCommunityIcons
              name={isEditing ? 'close' : 'pencil'}
              size={20}
              color="#6366f1"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Photos */}
        <Card>
          <Text style={styles.sectionTitle}>Photos</Text>
          <PhotoGallery
            photos={selectedPhotos}
            editable={isEditing}
            onAddPhoto={handleAddPhoto}
            onRemovePhoto={handleRemovePhoto}
          />
        </Card>

        {/* Profile Information */}
        <Card>
          <Text style={styles.sectionTitle}>Informations</Text>
          
          <Input
            label="Prénom"
            value={profileData.firstName}
            onChangeText={(text) =>
              setProfileData({ ...profileData, firstName: text })
            }
            editable={isEditing}
          />

          <Input
            label="Nom"
            value={profileData.lastName}
            onChangeText={(text) =>
              setProfileData({ ...profileData, lastName: text })
            }
            editable={isEditing}
          />

          <Input
            label="Description"
            placeholder="Décrivez-vous en quelques lignes..."
            value={profileData.description}
            onChangeText={(text) =>
              setProfileData({ ...profileData, description: text })
            }
            multiline
            numberOfLines={4}
            editable={isEditing}
          />

          <Input
            label="Localisation"
            value={profileData.location}
            onChangeText={(text) =>
              setProfileData({ ...profileData, location: text })
            }
            editable={isEditing}
          />
        </Card>

        {/* Pricing */}
        <Card>
          <Text style={styles.sectionTitle}>Tarifs</Text>
          
          <Input
            label="Tarif horaire (€)"
            value={profileData.rates?.hourly?.toString()}
            onChangeText={(text) =>
              setProfileData({
                ...profileData,
                rates: { ...profileData.rates, hourly: parseFloat(text) },
              })
            }
            editable={isEditing}
            keyboardType="decimal-pad"
          />

          <Input
            label="Tarif journalier (€)"
            value={profileData.rates?.daily?.toString()}
            onChangeText={(text) =>
              setProfileData({
                ...profileData,
                rates: { ...profileData.rates, daily: parseFloat(text) },
              })
            }
            editable={isEditing}
            keyboardType="decimal-pad"
          />
        </Card>

        {isEditing && (
          <View style={styles.actions}>
            <Button
              title="Sauvegarder"
              variant="primary"
              size="large"
              onPress={handleSaveProfile}
              loading={updateProfileMutation.isPending}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#8b5cf6',
    padding: 20,
    paddingTop: 40,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  editButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  actions: {
    marginTop: 24,
    marginBottom: 32,
  },
});
