import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, LoadingSpinner, Button } from '@/components';
import { adminService } from '@/services/adminService';

interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photos: string[];
  description: string;
  verificationDocuments: string[];
  submittedAt: string;
  status: string;
}

export default function ValidateProfilesScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  // Récupérer les profils en attente
  const { data: profiles = [], isLoading, refetch } = useQuery({
    queryKey: ['pendingProfiles'],
    queryFn: async () => {
      const response = await adminService.getPendingProfiles();
      return response.data || [];
    },
  });

  // Mutation pour approuver un profil
  const approveMutation = useMutation({
    mutationFn: (profileId: string) => adminService.approveProfile(profileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingProfiles'] });
      Alert.alert('Succès', 'Profil approuvé avec succès');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.message || 'Erreur lors de l\'approbation');
    },
  });

  // Mutation pour rejeter un profil
  const rejectMutation = useMutation({
    mutationFn: ({ profileId, reason }: { profileId: string; reason: string }) =>
      adminService.rejectProfile(profileId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingProfiles'] });
      Alert.alert('Succès', 'Profil rejeté');
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.message || 'Erreur lors du rejet');
    },
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleApprove = (profile: Profile) => {
    Alert.alert(
      'Approuver le profil',
      `Êtes-vous sûr de vouloir approuver le profil de ${profile.firstName} ${profile.lastName} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Approuver',
          onPress: () => approveMutation.mutate(profile.id),
        },
      ]
    );
  };

  const handleReject = (profile: Profile) => {
    Alert.alert(
      'Rejeter le profil',
      'Veuillez saisir la raison du rejet :',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Rejeter',
          onPress: () => {
            // TODO: Implement rejection reason input
            rejectMutation.mutate({
              profileId: profile.id,
              reason: 'Profil incomplet ou non conforme',
            });
          },
        },
      ]
    );
  };

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
      <View style={styles.header}>
        <Text style={styles.title}>Validation des Profils</Text>
        <Text style={styles.subtitle}>
          {profiles.length} profil(s) en attente de validation
        </Text>
      </View>

      {profiles.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="check-circle-outline"
            size={64}
            color="#d1d5db"
          />
          <Text style={styles.emptyTitle}>Aucun profil en attente</Text>
          <Text style={styles.emptySubtitle}>
            Tous les profils ont été traités
          </Text>
        </View>
      ) : (
        <View style={styles.profilesList}>
          {profiles.map((profile: Profile) => (
            <Card key={profile.id} style={styles.profileCard}>
              <View style={styles.profileHeader}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {profile.firstName} {profile.lastName}
                  </Text>
                  <Text style={styles.userEmail}>{profile.email}</Text>
                  <Text style={styles.userPhone}>{profile.phone}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>En attente</Text>
                </View>
              </View>

              {profile.description && (
                <View style={styles.descriptionSection}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.description}>{profile.description}</Text>
                </View>
              )}

              {profile.photos && profile.photos.length > 0 && (
                <View style={styles.photosSection}>
                  <Text style={styles.sectionTitle}>Photos ({profile.photos.length})</Text>
                  <View style={styles.photosGrid}>
                    {profile.photos.slice(0, 3).map((photo, index) => (
                      <View key={index} style={styles.photoPlaceholder}>
                        <MaterialCommunityIcons
                          name="image"
                          size={24}
                          color="#9ca3af"
                        />
                      </View>
                    ))}
                    {profile.photos.length > 3 && (
                      <View style={styles.morePhotos}>
                        <Text style={styles.morePhotosText}>
                          +{profile.photos.length - 3}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

              <View style={styles.submittedInfo}>
                <Text style={styles.submittedText}>
                  Soumis le {new Date(profile.submittedAt).toLocaleDateString('fr-FR')}
                </Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.rejectButton, rejectMutation.isPending && styles.disabledButton]}
                  onPress={() => handleReject(profile)}
                  disabled={rejectMutation.isPending}
                >
                  <Text style={styles.rejectButtonText}>
                    {rejectMutation.isPending ? 'Rejet...' : 'Rejeter'}
                  </Text>
                </TouchableOpacity>
                <Button
                  title="Approuver"
                  onPress={() => handleApprove(profile)}
                  style={styles.approveButton}
                  disabled={approveMutation.isPending}
                />
              </View>
            </Card>
          ))}
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
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  profilesList: {
    padding: 16,
  },
  profileCard: {
    marginBottom: 16,
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  userPhone: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d97706',
  },
  descriptionSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  photosSection: {
    marginBottom: 16,
  },
  photosGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  photoPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  morePhotos: {
    width: 60,
    height: 60,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  morePhotosText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  submittedInfo: {
    marginBottom: 16,
  },
  submittedText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectButton: {
    flex: 1,
  },
  rejectButtonText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
  },
  approveButton: {
    flex: 1,
  },
  emptyState: {
    paddingVertical: 64,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
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
