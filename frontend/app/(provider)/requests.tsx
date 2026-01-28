import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { providerService } from '@/services/providerService';
import { Card, LoadingSpinner, Button } from '@/components';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BookingRequestsScreen() {
  const [selectedStatus, setSelectedStatus] = useState<'pending' | 'all'>('pending');

  const { data: bookings, isLoading, refetch } = useQuery({
    queryKey: ['providerBookings', selectedStatus],
    queryFn: () => providerService.getProviderProfile(),
  });

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  const statuses = [
    { id: 'pending', label: 'En attente', color: '#f59e0b' },
    { id: 'accepted', label: 'Acceptées', color: '#10b981' },
    { id: 'completed', label: 'Terminées', color: '#6366f1' },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Demandes de Réservation</Text>
      </View>

      <View style={styles.statusTabs}>
        {statuses.map((status) => (
          <TouchableOpacity
            key={status.id}
            style={[
              styles.statusTab,
              selectedStatus === status.id && styles.statusTabActive,
            ]}
            onPress={() =>
              setSelectedStatus(status.id as 'pending' | 'all')
            }
          >
            <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
              <Text style={styles.statusLabel}>{status.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {/* Exemple de demande */}
        <Card>
          <View style={styles.bookingHeader}>
            <View>
              <Text style={styles.userName}>Jean Dupont</Text>
              <Text style={styles.date}>28-30 Janvier 2026</Text>
            </View>
            <View style={styles.statusBadge_new}>
              <Text style={styles.statusLabel_new}>En attente</Text>
            </View>
          </View>

          <View style={styles.bookingDetails}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="calendar"
                size={18}
                color="#6366f1"
              />
              <Text style={styles.detailText}>3 jours (210€)</Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="message"
                size={18}
                color="#6366f1"
              />
              <Text style={styles.detailText}>Message du client...</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Button
              title="Refuser"
              variant="danger"
              size="medium"
              onPress={() => console.log('Refuse')}
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button
              title="Accepter"
              variant="success"
              size="medium"
              onPress={() => console.log('Accept')}
              style={{ flex: 1 }}
            />
          </View>
        </Card>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  statusTab: {
    flex: 1,
  },
  statusTabActive: {},
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusBadge_new: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusLabel: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  statusLabel_new: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#6b7280',
  },
  bookingDetails: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#4b5563',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
});
