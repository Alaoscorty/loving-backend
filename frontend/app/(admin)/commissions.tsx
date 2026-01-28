import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function CommissionsScreen() {
  const queryClient = useQueryClient();
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [newCommissionRate, setNewCommissionRate] = useState('');

  const { data: commissions, isLoading, refetch } = useQuery({
    queryKey: ['admin-commissions', period],
    queryFn: () => adminService.getCommissions(period),
  });

  const updateCommissionMutation = useMutation({
    mutationFn: (rate: number) => adminService.updateCommissionRate(rate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-commissions'] });
      Alert.alert('Succès', 'Taux de commission mis à jour');
      setNewCommissionRate('');
    },
  });

  const handleUpdateCommission = () => {
    const rate = parseFloat(newCommissionRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      Alert.alert('Erreur', 'Veuillez entrer un taux valide (0-100)');
      return;
    }

    Alert.alert('Confirmer', `Définir le taux de commission à ${rate}% ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Confirmer',
        onPress: () => updateCommissionMutation.mutate(rate),
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Gestion des commissions</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Taux actuel</Text>
          <Text style={styles.statValue}>{commissions?.currentRate || 0}%</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total collecté</Text>
          <Text style={styles.statValue}>{commissions?.totalCollected || 0}€</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Ce mois</Text>
          <Text style={styles.statValue}>{commissions?.monthlyTotal || 0}€</Text>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Modifier le taux de commission</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Nouveau taux (%)"
            value={newCommissionRate}
            onChangeText={setNewCommissionRate}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={[
              styles.updateButton,
              updateCommissionMutation.isPending && styles.buttonDisabled,
            ]}
            onPress={handleUpdateCommission}
            disabled={updateCommissionMutation.isPending}
          >
            {updateCommissionMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.updateButtonText}>Mettre à jour</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.periodSelector}>
        {(['week', 'month', 'year'] as const).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.periodButton, period === p && styles.periodButtonActive]}
            onPress={() => setPeriod(p)}
          >
            <Text
              style={[styles.periodText, period === p && styles.periodTextActive]}
            >
              {p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : 'Année'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Historique des commissions</Text>

        {commissions?.transactions?.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucune transaction</Text>
          </View>
        ) : (
          commissions?.transactions?.map((transaction: any) => (
            <View key={transaction._id} style={styles.transactionCard}>
              <View style={styles.transactionHeader}>
                <Text style={styles.transactionType}>
                  Réservation #{transaction.bookingId?.slice(-6)}
                </Text>
                <Text style={styles.transactionAmount}>+{transaction.amount}€</Text>
              </View>
              <Text style={styles.transactionDate}>
                {format(new Date(transaction.date), 'dd MMMM yyyy', { locale: fr })}
              </Text>
              <Text style={styles.transactionDetails}>
                Taux: {transaction.rate}% | Montant réservation: {transaction.bookingAmount}€
              </Text>
            </View>
          ))
        )}
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
    backgroundColor: '#ef4444',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  settingsSection: {
    padding: 16,
    backgroundColor: '#fff7ed',
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  updateButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#ef4444',
  },
  periodText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  periodTextActive: {
    color: '#fff',
  },
  content: {
    padding: 16,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  transactionCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  transactionDetails: {
    fontSize: 12,
    color: '#999',
  },
});
