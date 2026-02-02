import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/bookingService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function CancelBookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState('');

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingService.getBooking(id!),
    enabled: !!id,
  });

  const cancelMutation = useMutation({
    mutationFn: (data: { reason: string }) => bookingService.cancelBooking(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      Alert.alert(
        'Réservation annulée',
        'Votre réservation a été annulée. Un remboursement sera effectué selon notre politique d\'annulation.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.message || 'Impossible d\'annuler la réservation');
    },
  });

  const handleCancel = () => {
    if (!reason.trim()) {
      Alert.alert('Erreur', 'Veuillez indiquer la raison de l\'annulation');
      return;
    }

    Alert.alert(
      'Confirmer l\'annulation',
      'Êtes-vous sûr de vouloir annuler cette réservation ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui',
          style: 'destructive',
          onPress: () => cancelMutation.mutate({ reason }),
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Annuler la réservation</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.bookingInfo}>
          <Text style={styles.sectionTitle}>Détails de la réservation</Text>
          <Text style={styles.infoText}>
            📅 {format(new Date(booking?.date || ''), 'dd MMMM yyyy', { locale: fr })}
          </Text>
          <Text style={styles.infoText}>
            🕐 {booking?.startTime} - {booking?.endTime}
          </Text>
          <Text style={styles.infoText}>👤 {booking?.providerName}</Text>
          <Text style={styles.infoText}>💰 {booking?.totalAmount}€</Text>
        </View>

        <View style={styles.policySection}>
          <Text style={styles.sectionTitle}>Politique d'annulation</Text>
          <Text style={styles.policyText}>
            • Annulation plus de 48h avant : Remboursement complet
          </Text>
          <Text style={styles.policyText}>
            • Annulation entre 24h et 48h avant : Remboursement de 50%
          </Text>
          <Text style={styles.policyText}>
            • Annulation moins de 24h avant : Pas de remboursement
          </Text>
        </View>

        <View style={styles.reasonSection}>
          <Text style={styles.label}>Raison de l'annulation *</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Expliquez pourquoi vous annulez..."
            placeholderTextColor="#999"
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={styles.charCount}>{reason.length}/500</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, cancelMutation.isPending && styles.buttonDisabled]}
          onPress={handleCancel}
          disabled={cancelMutation.isPending}
        >
          {cancelMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Confirmer l'annulation</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  content: {
    padding: 20,
  },
  bookingInfo: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  policySection: {
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  policyText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  reasonSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
  },
});
