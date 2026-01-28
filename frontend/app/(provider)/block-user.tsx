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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { providerService } from '@/services/providerService';

export default function BlockUserScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState('');
  const [action, setAction] = useState<'block' | 'report'>('block');

  const blockMutation = useMutation({
    mutationFn: (data: { userId: string; reason: string }) =>
      providerService.blockUser(data.userId, data.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked-users'] });
      Alert.alert('Succès', 'Utilisateur bloqué', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    },
  });

  const reportMutation = useMutation({
    mutationFn: (data: { userId: string; reason: string }) =>
      providerService.reportUser(data.userId, data.reason),
    onSuccess: () => {
      Alert.alert('Succès', 'Signalement envoyé', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    },
  });

  const handleSubmit = () => {
    if (!reason.trim()) {
      Alert.alert('Erreur', 'Veuillez indiquer la raison');
      return;
    }

    if (action === 'block') {
      blockMutation.mutate({ userId: userId!, reason });
    } else {
      reportMutation.mutate({ userId: userId!, reason });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {action === 'block' ? 'Bloquer un utilisateur' : 'Signaler un utilisateur'}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.actionSelector}>
          <TouchableOpacity
            style={[styles.actionButton, action === 'block' && styles.actionButtonActive]}
            onPress={() => setAction('block')}
          >
            <Text
              style={[
                styles.actionButtonText,
                action === 'block' && styles.actionButtonTextActive,
              ]}
            >
              Bloquer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, action === 'report' && styles.actionButtonActive]}
            onPress={() => setAction('report')}
          >
            <Text
              style={[
                styles.actionButtonText,
                action === 'report' && styles.actionButtonTextActive,
              ]}
            >
              Signaler
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Raison *</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Expliquez la raison..."
            placeholderTextColor="#999"
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={6}
            maxLength={500}
          />
          <Text style={styles.charCount}>{reason.length}/500</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {action === 'block'
              ? '• L\'utilisateur ne pourra plus vous contacter'
              : '• Le signalement sera examiné par notre équipe'}
          </Text>
          <Text style={styles.infoText}>
            {action === 'block'
              ? '• Vous pourrez le débloquer depuis vos paramètres'
              : '• Vous recevrez une réponse sous 48h'}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (blockMutation.isPending || reportMutation.isPending) && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={blockMutation.isPending || reportMutation.isPending}
        >
          {(blockMutation.isPending || reportMutation.isPending) ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {action === 'block' ? 'Bloquer' : 'Signaler'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Annuler</Text>
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
  actionSelector: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonActive: {
    backgroundColor: '#8b5cf6',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  actionButtonTextActive: {
    color: '#fff',
  },
  section: {
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
    minHeight: 120,
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
  infoBox: {
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#8b5cf6',
    fontSize: 16,
    fontWeight: '600',
  },
});
