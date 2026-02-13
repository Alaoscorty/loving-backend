import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';

type ProfileStatus = 'pending' | 'approved' | 'rejected';

export default function ProfilesValidationScreen() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<ProfileStatus>('pending');

  const { data: profiles, isLoading, refetch } = useQuery({
    queryKey: ['admin-profiles', filter],
    queryFn: () => adminService.getProfiles(filter),
  });

  const { data: stats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => adminService.getStats(),
  });

  const approveMutation = useMutation({
    mutationFn: (profileId: string) => adminService.approveProfile(profileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
      Alert.alert('Succès', 'Profil approuvé');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (data: { profileId: string; reason: string }) =>
      adminService.rejectProfile(data.profileId, data.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
      Alert.alert('Succès', 'Profil rejeté');
    },
  });

  const handleApprove = (profileId: string) => {
    Alert.alert('Confirmer', 'Approuver ce profil ?', [
      { text: 'Non', style: 'cancel' },
      { text: 'Oui', onPress: () => approveMutation.mutate(profileId) },
    ]);
  };

  const handleReject = (profileId: string) => {
    Alert.prompt(
      'Rejeter le profil',
      'Raison du rejet :',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: (reason) => {
            if (reason) {
              rejectMutation.mutate({ profileId, reason });
            }
          },
        },
      ],
      'plain-text'
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Validation des profils</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filters}
        contentContainerStyle={styles.filtersContent}
      >
        {(['pending', 'approved', 'rejected'] as const).map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterButton, filter === status && styles.filterButtonActive]}
            onPress={() => setFilter(status)}
          >
            <Text
              style={[styles.filterText, filter === status && styles.filterTextActive]}
            >
              {status === 'pending'
                ? 'En attente'
                : status === 'approved'
                ? 'Approuvés'
                : 'Rejetés'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        {profiles?.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucun profil</Text>
          </View>
        ) : (
          profiles?.map((profile: any) => (
            <View key={profile._id} style={styles.profileCard}>
              <View style={styles.profileHeader}>
                <Text style={styles.profileName}>{profile.displayName}</Text>
                <Text style={styles.profileEmail}>{profile.userEmail}</Text>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.infoText}>📍 {profile.location?.city}</Text>
                <Text style={styles.infoText}>📅 Inscrit le {profile.createdAt}</Text>
                {profile.photos?.length > 0 && (
                  <Text style={styles.infoText}>📷 {profile.photos.length} photos</Text>
                )}
              </View>

              {filter === 'pending' && (
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={() => handleApprove(profile._id)}
                    disabled={approveMutation.isPending}
                  >
                    <Text style={styles.actionButtonText}>Approuver</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleReject(profile._id)}
                    disabled={rejectMutation.isPending}
                  >
                    <Text style={styles.actionButtonText}>Rejeter</Text>
                  </TouchableOpacity>
                </View>
              )}

              {filter === 'rejected' && profile.rejectionReason && (
                <View style={styles.rejectionBox}>
                  <Text style={styles.rejectionLabel}>Raison du rejet :</Text>
                  <Text style={styles.rejectionReason}>{profile.rejectionReason}</Text>
                </View>
              )}
            </View>
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
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ef4444',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  filters: {
    maxHeight: 60,
    backgroundColor: '#f5f5f5',
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#ef4444',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
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
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  profileCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    marginBottom: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  profileInfo: {
    marginBottom: 16,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#10b981',
  },
  rejectButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  rejectionBox: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  rejectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#991b1b',
    marginBottom: 4,
  },
  rejectionReason: {
    fontSize: 14,
    color: '#991b1b',
  },
});
