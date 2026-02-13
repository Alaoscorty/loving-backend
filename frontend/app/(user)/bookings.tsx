import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/services/bookingService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import LoadingSpinner from '@/components/LoadingSpinner';

type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';

export default function BookingsHistoryScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');

  const { data: bookings, isLoading, error, refetch } = useQuery({
    queryKey: ['bookings', filter],
    queryFn: () => bookingService.getUserBookings(filter === 'all' ? undefined : filter),
    retry: 1,
  });

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
      <LoadingSpinner fullScreen />
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Erreur lors du chargement des réservations</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes réservations</Text>
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
            <Text style={styles.emptyText}>Aucune réservation</Text>
          </View>
        ) : (
          bookings?.map((booking: any) => (
            <TouchableOpacity
              key={booking._id}
              style={styles.bookingCard}
              onPress={() => router.push(`/(user)/booking-details?id=${booking._id}`)}
            >
              <View style={styles.bookingHeader}>
                <Text style={styles.providerName}>{booking.providerName}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(booking.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{getStatusLabel(booking.status)}</Text>
                </View>
              </View>

              <Text style={styles.serviceName}>{booking.serviceName}</Text>

              <View style={styles.bookingInfo}>
                <Text style={styles.infoText}>
                  📅 {format(new Date(booking.date), 'dd MMMM yyyy', { locale: fr })}
                </Text>
                <Text style={styles.infoText}>
                  🕐 {booking.startTime} - {booking.endTime}
                </Text>
                <Text style={styles.infoText}>💰 {booking.totalAmount}€</Text>
              </View>

              {booking.status === 'completed' && !booking.reviewed && (
                <TouchableOpacity
                  style={styles.reviewButton}
                  onPress={() => router.push(`/(user)/reviews?bookingId=${booking._id}`)}
                >
                  <Text style={styles.reviewButtonText}>Laisser un avis</Text>
                </TouchableOpacity>
              )}

              {booking.status === 'pending' && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => router.push(`/(user)/cancel-booking?id=${booking._id}`)}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
              )}
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
    backgroundColor: '#6366f1',
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
    alignItems: 'center',
    marginBottom: 8,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
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
  serviceName: {
    fontSize: 16,
    color: '#6366f1',
    marginBottom: 12,
  },
  bookingInfo: {
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  reviewButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fbbf24',
    borderRadius: 8,
    alignItems: 'center',
  },
  reviewButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
