import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { Card, LoadingSpinner, Button } from '@/components';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AdminProfilesScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const { data: profiles, isLoading, refetch } = useQuery({
    queryKey: ['pendingProfiles', selectedFilter],
    queryFn: () => adminService.getPendingProfiles(),
  });

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Gestion des Profils</Text>
        <Text style={styles.subtitle}>
          {profiles?.total || 0} profil(s) en attente
        </Text>
      </View>

      <View style={styles.content}>
        {profiles?.data?.map((profile: any) => (
          <Card key={profile.id} style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View>
                <Text style={styles.profileName}>
                  {profile.firstName} {profile.lastName}
                </Text>
                <Text style={styles.profileEmail}>{profile.email}</Text>
              </View>
              <View style={styles.statusBadge}>
                <MaterialCommunityIcons
                  name="clock"
                  size={16}
                  color="#ffffff"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.statusText}>En attente</Text>
              </View>
            </View>

            <Text style={styles.description} numberOfLines={2}>
              {profile.description}
            </Text>

            <View style={styles.documents}>
              <Text style={styles.documentLabel}>Documents :</Text>
              {profile.verificationDocuments?.map((doc: string, idx: number) => (
                <TouchableOpacity key={idx} style={styles.documentItem}>
                  <MaterialCommunityIcons
                    name="file-document"
                    size={16}
                    color="#6366f1"
                  />
                  <Text style={styles.documentName}>Document {idx + 1}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.actions}>
              <Button
                title="Rejeter"
                variant="danger"
                size="medium"
                onPress={() => console.log('Reject')}
                style={{ flex: 1, marginRight: 8 }}
              />
              <Button
                title="Approuver"
                variant="success"
                size="medium"
                onPress={() => console.log('Approve')}
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        ))}
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
    backgroundColor: '#ef4444',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#fee2e2',
  },
  content: {
    padding: 16,
  },
  profileCard: {
    marginBottom: 12,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 13,
    color: '#6b7280',
  },
  statusBadge: {
    flexDirection: 'row',
    backgroundColor: '#f59e0b',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 12,
    lineHeight: 18,
  },
  documents: {
    marginBottom: 12,
  },
  documentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 6,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  documentName: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
});
