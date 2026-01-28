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
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/bookingService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';

export default function ProviderBookingsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<BookingStatus | 'all'>('pending');

  const { data: bookings, isLoading, refetch } = useQuery({
    queryKey: ['provider-bookings', filter],
    queryFn: () => bookingService.getProviderBookings(filter === 'all' ? undefined : filter),
  });

  const acceptMutation = useMutation({
    mutationFn: (bookingId: string) => bookingService.acceptBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-bookings'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (data: { bookingId: string; reason: string }) =>
      bookingService.rejectBooking(data.bookingId, data.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-bookings'] });
    },
  });

  const handleAccept = (bookingId: string) => {
    Alert.alert('Confirmer', 'Accepter cette réservation ?', [
      { text: 'Non', style: 'cancel' },
      { text: 'Oui', onPress: () => acceptMutation.mutate(bookingId) },
    ]);
  };

  const handleReject = (bookingId: string) => {
    Alert.prompt(
      'Refuser la réservation',
      'Raison du refus :',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: (reason) => {
            if (reason) {
              rejectMutation.mutate({ bookingId, reason });
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'accepted':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      case 'cancelled':
        return '#6b7280';
      case 'completed':
        return '#6366f1';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'accepted':
        return 'Acceptée';
      case 'rejected':
        return 'Refusée';
      case 'cancelled':
        return 'Annulée';
      case 'completed':
        return 'Terminée';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Demandes de réservation</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filters}
        contentContainerStyle={styles.filtersContent}
      >
        {(['all', 'pending', 'accepted', 'completed', 'cancelled'] as const).map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterButton, filter === status && styles.filterButtonActive]}
            onPress={() => setFilter(status)}
          >
            <Text
              style={[
                styles.filterText,
                filter === status && styles.filterTextActive,
              ]}
            >
              {status === 'all' ? 'Toutes' : getStatusLabel(status)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        {bookings?.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucune demande de réservation</Text>
          </View>
        ) : (
          bookings?.map((booking: any) => (
            <View key={booking._id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <View>
                  <Text style={styles.clientName}>{booking.clientName}</Text>
                  <Text style={styles.serviceName}>{booking.serviceName}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(booking.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{getStatusLabel(booking.status)}</Text>
                </View>
              </View>

              <View style={styles.bookingInfo}>
                <Text style={styles.infoText}>
                  📅 {format(new Date(booking.date), 'dd MMMM yyyy', { locale: fr })}
                </Text>
                <Text style={styles.infoText}>
                  🕐 {booking.startTime} - {booking.endTime}
                </Text>
                <Text style={styles.infoText}>📍 {booking.location?.address}</Text>
                <Text style={styles.infoText}>💰 {booking.totalAmount}€</Text>
                {booking.clientNotes && (
                  <Text style={styles.notes}>💬 {booking.clientNotes}</Text>
                )}
              </View>

              {booking.status === 'pending' && (
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.acceptButton]}
                    onPress={() => handleAccept(booking._id)}
                    disabled={acceptMutation.isPending}
                  >
                    <Text style={styles.actionButtonText}>Accepter</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleReject(booking._id)}
                    disabled={rejectMutation.isPending}
                  >
                    <Text style={styles.actionButtonText}>Refuser</Text>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => router.push(`/(provider)/booking-details?id=${booking._id}`)}
              >
                <Text style={styles.detailsButtonText}>Voir les détails</Text>
              </TouchableOpacity>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#8b5cf6',
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
    backgroundColor: '#8b5cf6',
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
  bookingCard: {
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
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 14,
    color: '#8b5cf6',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  bookingInfo: {
    marginBottom: 16,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  notes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#10b981',
  },
  rejectButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  detailsButton: {
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  detailsButtonText: {
    color: '#8b5cf6',
    fontWeight: '600',
  },
});
