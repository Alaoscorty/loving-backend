import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Button, Input, Card, LoadingSpinner, Toast } from '@/components';
import { bookingService, profileService } from '@/services';
import { NotificationContext } from '@/contexts';
import { useNotification } from '@/contexts/NotificationContext';
import { validateEmail, validatePhoneNumber } from '@/utils/validators';

// 👇 Import conditionnel DateTimePicker pour mobile uniquement
let DateTimePicker: any = null;
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

interface ReservationFormData {
  providerId: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  notes?: string;
  quantity?: number;
}

interface BookingRequest {
  providerId: string;
  startDate: string; // ISO
  endDate: string;   // ISO
  startTime: string;
  notes?: string;
  quantity?: number;
  totalAmount: number;
}


export default function ReservationScreen() {
  const router = useRouter();
  const { providerId } = useLocalSearchParams();
  const { addNotification } = useNotification();

  const [formData, setFormData] = useState<Partial<ReservationFormData>>({
    providerId: providerId as string,
    startDate: new Date(),
    endDate: new Date(),
    startTime: '09:00',
    notes: '',
    quantity: 1,
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const { data: provider, isLoading: providerLoading } = useQuery({
    queryKey: ['provider', providerId],
    queryFn: () => profileService.getProfileById(providerId as string),
  });

  const { mutate: createReservation, isPending } = useMutation({
    mutationFn: (data: BookingRequest) =>
      bookingService.createBooking(data),
    onSuccess: (booking: any) => {
      addNotification(
        'Réservation créée ! Passage au paiement...',
        'success',
        2000
      );
  
      router.push({
        pathname: '/(user)/payment',
        params: {
          bookingId: booking?.id || booking?._id,
          amount: String(
            booking?.totalPrice ??
            booking?.totalAmount ??
            0
          ),
        },
      });
    },
    onError: (error: any) => {
      addNotification(
        `Erreur: ${error.message}`,
        'error',
        3000
      );
    },
  });
  

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        startDate: selectedDate,
        endDate: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000),
      }));
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, endDate: selectedDate }));
    }
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      setFormData((prev) => ({ ...prev, startTime: `${hours}:${minutes}` }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.startDate || !formData.endDate) {
      Alert.alert('Erreur', 'Veuillez sélectionner les dates');
      return false;
    }
    if (formData.endDate < formData.startDate) {
      Alert.alert('Erreur', 'La date de fin doit être après la date de début');
      return false;
    }
    if (!formData.startTime) {
      Alert.alert('Erreur', 'Veuillez sélectionner une heure');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
  
    const hours = Math.ceil(
      (formData.endDate!.getTime() - formData.startDate!.getTime()) /
      (1000 * 60 * 60)
    );
  
    const totalAmount = hours * 1600; // 💰 1600 FCFA / heure
  
    const payload: BookingRequest = {
      providerId: providerId as string,
      startDate: formData.startDate!.toISOString(),
      endDate: formData.endDate!.toISOString(),
      startTime: formData.startTime!,
      notes: formData.notes,
      quantity: formData.quantity,
      totalAmount,
    };
  
    createReservation(payload);
  };
  

  if (providerLoading) return <LoadingSpinner fullScreen />;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouvelle Réservation</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Infos prestataire */}
      {provider && (
        <Card style={styles.providerCard}>
          <View style={styles.providerInfo}>
            <View>
              <Text style={styles.providerName}>{provider.firstName} {provider.lastName}</Text>
              <Text style={styles.providerService}>
                {typeof provider.services?.[0] === 'object' ? (provider.services[0] as any)?.name : provider.services?.[0] || 'Service'}
              </Text>
              <View style={styles.ratingContainer}>
                <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>
                  {(typeof provider.rating === 'number' ? provider.rating : 0)?.toFixed?.(1) || 'N/A'} ({provider.reviewCount || 0} avis)
                </Text>
              </View>
            </View>
            <Text style={styles.price}>{(provider.rates?.hourly ?? provider.hourlyRate ?? 0)}€/h</Text>
          </View>
        </Card>
      )}

      {/* Formulaire */}
      <View style={styles.form}>
        {/* Dates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Dates</Text>

          {/* Start Date Picker */}
          {Platform.OS === 'web' ? (
            <input
              type="date"
              value={formData.startDate?.toISOString().split('T')[0]}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  startDate: new Date(e.target.value),
                }))
              }
            />
          ) : (
            <>
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartDatePicker(true)}>
                <MaterialCommunityIcons name="calendar" size={20} color="#007AFF" />
                <View style={styles.dateButtonContent}>
                  <Text style={styles.dateButtonLabel}>Date de début</Text>
                  <Text style={styles.dateButtonValue}>
                    {formData.startDate?.toLocaleDateString('fr-FR', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                  </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
              </TouchableOpacity>
              {showStartDatePicker && DateTimePicker && (
                <DateTimePicker
                  value={formData.startDate || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={handleStartDateChange}
                  minimumDate={new Date()}
                />
              )}
            </>
          )}

          {/* End Date Picker */}
          {Platform.OS === 'web' ? (
            <input
              type="date"
              value={formData.endDate?.toISOString().split('T')[0]}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  endDate: new Date(e.target.value),
                }))
              }
            />
          ) : (
            <>
              <TouchableOpacity style={[styles.dateButton, { marginTop: 12 }]} onPress={() => setShowEndDatePicker(true)}>
                <MaterialCommunityIcons name="calendar" size={20} color="#007AFF" />
                <View style={styles.dateButtonContent}>
                  <Text style={styles.dateButtonLabel}>Date de fin</Text>
                  <Text style={styles.dateButtonValue}>
                    {formData.endDate?.toLocaleDateString('fr-FR', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                  </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
              </TouchableOpacity>
              {showEndDatePicker && DateTimePicker && (
                <DateTimePicker
                  value={formData.endDate || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={handleEndDateChange}
                  minimumDate={formData.startDate || new Date()}
                />
              )}
            </>
          )}
        </View>

        {/* Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏰ Heure</Text>
          {Platform.OS === 'web' ? (
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, startTime: e.target.value }))
              }
            />
          ) : (
            <>
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowTimePicker(true)}>
                <MaterialCommunityIcons name="clock" size={20} color="#007AFF" />
                <View style={styles.dateButtonContent}>
                  <Text style={styles.dateButtonLabel}>Heure de début</Text>
                  <Text style={styles.dateButtonValue}>{formData.startTime}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
              </TouchableOpacity>
              {showTimePicker && DateTimePicker && (
                <DateTimePicker
                  value={new Date(`2024-01-01T${formData.startTime}:00`)}
                  mode="time"
                  display="spinner"
                  onChange={handleTimeChange}
                />
              )}
            </>
          )}
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Message</Text>
          <Input
            placeholder="Ajouter une note pour le prestataire..."
            value={formData.notes}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, notes: text }))
            }
            multiline
            numberOfLines={4}
            style={styles.notesInput}
          />
        </View>

        {/* Résumé */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tarif horaire</Text>
            <Text style={styles.summaryValue}>{provider?.rates?.hourly ?? provider?.hourlyRate ?? 0}€</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Durée estimée</Text>
            <Text style={styles.summaryValue}>
              {formData.endDate && formData.startDate
                ? Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000*60*60))
                : 0} h
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Prix total</Text>
            <Text style={styles.totalValue}>
              {((provider?.rates?.hourly ?? provider?.hourlyRate ?? 0) * (formData.endDate && formData.startDate
                ? Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000*60*60))
                : 0)).toFixed(2)} €
            </Text>
          </View>
        </Card>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button title="Annuler" variant="secondary" onPress={() => router.back()} style={styles.button} />
          <Button
            title={isPending ? 'Chargement...' : 'Continuer vers le paiement'}
            onPress={handleSubmit}
            disabled={isPending}
            style={styles.button}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8', paddingTop: 20, },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a1a' },
  providerCard: { margin: 16, padding: 16 },
  providerInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  providerName: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 4 },
  providerService: { fontSize: 13, color: '#666', marginBottom: 6 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rating: { fontSize: 12, color: '#666' },
  price: { fontSize: 18, fontWeight: '700', color: '#007AFF' },
  form: { paddingHorizontal: 16, paddingBottom: 32 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', marginBottom: 12 },
  dateButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: '#e0e0e0', gap: 12 },
  dateButtonContent: { flex: 1 },
  dateButtonLabel: { fontSize: 12, color: '#999', marginBottom: 2 },
  dateButtonValue: { fontSize: 15, fontWeight: '500', color: '#1a1a1a' },
  notesInput: { height: 100, textAlignVertical: 'top', paddingTop: 12 },
  summaryCard: { marginTop: 24, marginBottom: 24, padding: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: '#666' },
  summaryValue: { fontSize: 14, fontWeight: '500', color: '#1a1a1a' },
  divider: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 12 },
  totalLabel: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  totalValue: { fontSize: 18, fontWeight: '700', color: '#007AFF' },
  buttonContainer: { flexDirection: 'row', gap: 12, marginTop: 16 },
  button: { flex: 1 },
});
