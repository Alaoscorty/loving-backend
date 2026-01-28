import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Button, Card, LoadingSpinner, Modal } from '@/components';
import { bookingService } from '@/services';
import { NotificationContext } from '@/contexts';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

/**
 * Écran des détails d'une réservation (Provider)
 * 
 * Fonctionnalités:
 * - Affichage complet des détails de réservation
 * - Historique des communications
 * - Actions (confirmer, annuler, modifier)
 * - Contact avec le client
 * - Système de notation
 */

interface BookingDetails {
  id: string;
  clientName: string;
  clientAvatar?: string;
  clientPhone?: string;
  clientEmail?: string;
  serviceType: string;
  startDate: Date;
  endDate: Date;
  location: string;
  notes?: string;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  messages: any[];
  rating?: number;
}

export default function BookingDetailsScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams();
  const { addNotification } = React.useContext(NotificationContext);

  const [showContactModal, setShowContactModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Récupérer les détails de la réservation
  const { data: booking, isLoading, refetch } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingService.getBookingById(bookingId as string),
  });

  // Mutation pour confirmer
  const { mutate: confirmBooking, isPending: confirming } = useMutation({
    mutationFn: () => bookingService.updateBookingStatus(bookingId as string, 'confirmed'),
    onSuccess: () => {
      addNotification({
        type: 'success',
        message: 'Réservation confirmée',
        duration: 2000,
      });
      refetch();
    },
  });

  // Mutation pour annuler
  const { mutate: cancelBooking, isPending: cancelling } = useMutation({
    mutationFn: () =>
      bookingService.cancelBooking(bookingId as string, { reason: cancelReason }),
    onSuccess: () => {
      addNotification({
        type: 'success',
        message: 'Réservation annulée',
        duration: 2000,
      });
      setShowCancelModal(false);
      refetch();
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#4caf50';
      case 'completed':
        return '#2196f3';
      case 'cancelled':
        return '#f44336';
      default:
        return '#ff9800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      completed: 'Complétée',
      cancelled: 'Annulée',
    };
    return statusMap[status] || status;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!booking) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Réservation non trouvée</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Entête */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails Réservation</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Statut */}
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(booking.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(booking.status)}</Text>
        </View>
        <Text style={styles.bookingId}>#{booking.id.slice(0, 8)}</Text>
      </View>

      {/* Info Client */}
      <Card style={styles.clientCard}>
        <View style={styles.clientHeader}>
          <View style={styles.clientAvatar}>
            <Text style={styles.clientAvatarText}>
              {booking.clientName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.clientName}>{booking.clientName}</Text>
            <View style={styles.ratingRow}>
              <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>4.8 • 24 réservations</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.contactButton}>
            <MaterialCommunityIcons name="phone" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.clientDetails}>
          <TouchableOpacity style={styles.detailRow}>
            <MaterialCommunityIcons name="email" size={18} color="#666" />
            <Text style={styles.detailText}>{booking.clientEmail}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.detailRow, { marginTop: 8 }]}>
            <MaterialCommunityIcons name="phone" size={18} color="#666" />
            <Text style={styles.detailText}>{booking.clientPhone}</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Détails Réservation */}
      <Card style={styles.bookingCard}>
        <Text style={styles.cardTitle}>📅 Détails de la Réservation</Text>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="briefcase" size={20} color="#007AFF" />
            <Text style={styles.detailLabel}>Service</Text>
            <Text style={styles.detailValue}>{booking.serviceType}</Text>
          </View>

          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="calendar" size={20} color="#007AFF" />
            <Text style={styles.detailLabel}>Date début</Text>
            <Text style={styles.detailValue}>
              {formatDateTime(new Date(booking.startDate))}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="calendar-end" size={20} color="#007AFF" />
            <Text style={styles.detailLabel}>Date fin</Text>
            <Text style={styles.detailValue}>
              {formatDateTime(new Date(booking.endDate))}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#007AFF" />
            <Text style={styles.detailLabel}>Localisation</Text>
            <Text style={styles.detailValue}>{booking.location}</Text>
          </View>
        </View>

        {booking.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Notes du client:</Text>
            <Text style={styles.notesText}>{booking.notes}</Text>
          </View>
        )}
      </Card>

      {/* Tarif */}
      <Card style={styles.pricingCard}>
        <Text style={styles.cardTitle}>💰 Tarification</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Montant</Text>
          <Text style={styles.priceValue}>{formatCurrency(booking.price)}</Text>
        </View>
        <View style={[styles.priceRow, { borderTopWidth: 1, borderTopColor: '#e0e0e0', paddingTop: 8, marginTop: 8 }]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(booking.price)}</Text>
        </View>
      </Card>

      {/* Historique Messages */}
      {booking.messages && booking.messages.length > 0 && (
        <Card style={styles.messagesCard}>
          <Text style={styles.cardTitle}>💬 Historique des messages</Text>
          <View style={styles.messagesList}>
            {booking.messages.slice(0, 3).map((msg, index) => (
              <View key={index} style={styles.messageItem}>
                <View style={styles.messageBubble}>
                  <Text style={styles.messageText}>{msg.text}</Text>
                  <Text style={styles.messageTime}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          {booking.messages.length > 3 && (
            <TouchableOpacity style={styles.viewMoreButton}>
              <Text style={styles.viewMoreText}>Voir tous les messages</Text>
            </TouchableOpacity>
          )}
        </Card>
      )}

      {/* Actions */}
      {booking.status === 'pending' && (
        <View style={styles.actionsContainer}>
          <Button
            title="Annuler"
            variant="secondary"
            onPress={() => setShowCancelModal(true)}
          />
          <Button
            title={confirming ? 'Confirmation...' : 'Confirmer'}
            onPress={() => confirmBooking()}
            disabled={confirming}
          />
        </View>
      )}

      {booking.status === 'confirmed' && (
        <View style={styles.actionsContainer}>
          <Button
            title="Annuler"
            variant="secondary"
            onPress={() => setShowCancelModal(true)}
          />
          <Button
            title="Marquer comme complétée"
            onPress={() => {}}
          />
        </View>
      )}

      {/* Modale Annulation */}
      <Modal
        visible={showCancelModal}
        title="Annuler la réservation"
        onClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            Êtes-vous sûr de vouloir annuler cette réservation?
          </Text>
          <TouchableOpacity style={styles.radioButton}>
            <View style={styles.radio} />
            <Text style={styles.radioLabel}>Conflit de planning</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.radioButton}>
            <View style={styles.radio} />
            <Text style={styles.radioLabel}>Raison personnelle</Text>
          </TouchableOpacity>
          <View style={styles.modalActions}>
            <Button
              title="Garder"
              variant="secondary"
              onPress={() => setShowCancelModal(false)}
            />
            <Button
              title={cancelling ? 'Annulation...' : 'Annuler'}
              onPress={() => cancelBooking()}
              disabled={cancelling}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 32,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  bookingId: {
    fontSize: 12,
    color: '#999',
  },
  clientCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  clientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clientAvatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  clientName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#999',
  },
  contactButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clientDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  bookingCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  detailsGrid: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  notesSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  pricingCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  messagesCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  messagesList: {
    gap: 8,
  },
  messageItem: {
    marginBottom: 8,
  },
  messageBubble: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  messageText: {
    fontSize: 13,
    color: '#1a1a1a',
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  viewMoreButton: {
    marginTop: 12,
    paddingVertical: 8,
  },
  viewMoreText: {
    fontSize: 13,
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  modalContent: {
    paddingVertical: 16,
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  radioLabel: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
});
