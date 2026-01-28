import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { providerService } from '@/services/providerService';

export default function AvailabilityScreen() {
  const queryClient = useQueryClient();
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<Array<{ start: string; end: string }>>([]);
  const [isAvailable, setIsAvailable] = useState(true);

  const { data: availability, isLoading } = useQuery({
    queryKey: ['availability'],
    queryFn: () => providerService.getAvailability(),
  });

  const updateAvailabilityMutation = useMutation({
    mutationFn: (data: any) => providerService.updateAvailability(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      Alert.alert('Succès', 'Disponibilités mises à jour');
    },
  });

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { start: '09:00', end: '17:00' }]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index: number, field: 'start' | 'end', value: string) => {
    const updated = [...timeSlots];
    updated[index][field] = value;
    setTimeSlots(updated);
  };

  const handleSave = () => {
    // Logique de sauvegarde
    updateAvailabilityMutation.mutate({
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Tous les jours pour l'instant
      timeSlots,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestion des disponibilités</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Disponible</Text>
            <Switch
              value={isAvailable}
              onValueChange={setIsAvailable}
              trackColor={{ false: '#e5e5e5', true: '#8b5cf6' }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Créneaux horaires</Text>
          {timeSlots.map((slot, index) => (
            <View key={index} style={styles.timeSlotRow}>
              <View style={styles.timeInputs}>
                <TextInput
                  style={styles.timeInput}
                  value={slot.start}
                  onChangeText={(value) => updateTimeSlot(index, 'start', value)}
                  placeholder="09:00"
                />
                <Text style={styles.separator}>-</Text>
                <TextInput
                  style={styles.timeInput}
                  value={slot.end}
                  onChangeText={(value) => updateTimeSlot(index, 'end', value)}
                  placeholder="17:00"
                />
              </View>
              <TouchableOpacity
                onPress={() => removeTimeSlot(index)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={addTimeSlot}>
            <Text style={styles.addButtonText}>+ Ajouter un créneau</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jours de la semaine</Text>
          {['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map(
            (day, index) => (
              <TouchableOpacity key={index} style={styles.dayRow}>
                <Text style={styles.dayText}>{day}</Text>
                <Switch
                  value={availability?.daysOfWeek?.includes(index) || false}
                  onValueChange={(value) => {
                    // Logique de mise à jour
                  }}
                />
              </TouchableOpacity>
            )
          )}
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={updateAvailabilityMutation.isPending}
        >
          {updateAvailabilityMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  timeSlotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  timeInputs: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  separator: {
    fontSize: 16,
    color: '#666',
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 20,
    color: '#ef4444',
  },
  addButton: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#8b5cf6',
    fontWeight: '600',
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  dayText: {
    fontSize: 16,
    color: '#1f2937',
  },
  saveButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
