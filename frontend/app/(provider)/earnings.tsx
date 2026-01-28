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
import { useQuery, useMutation } from '@tanstack/react-query';
import { providerService } from '@/services/providerService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function EarningsScreen() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year' | 'all'>('month');

  const { data: earnings, isLoading, refetch } = useQuery({
    queryKey: ['earnings', period],
    queryFn: () => providerService.getEarnings(period),
  });

  const requestPayoutMutation = useMutation({
    mutationFn: (amount: number) => providerService.requestPayout(amount),
    onSuccess: () => {
      refetch();
    },
  });

  const handleRequestPayout = () => {
    if (earnings?.availableBalance && earnings.availableBalance > 0) {
      requestPayoutMutation.mutate(earnings.availableBalance);
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
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Mes revenus</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Solde disponible</Text>
          <Text style={styles.statValue}>{earnings?.availableBalance || 0}€</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>En attente</Text>
          <Text style={styles.statValue}>{earnings?.pendingBalance || 0}€</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total gagné</Text>
          <Text style={styles.statValue}>{earnings?.totalEarnings || 0}€</Text>
        </View>
      </View>

      <View style={styles.periodSelector}>
        {(['week', 'month', 'year', 'all'] as const).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.periodButton, period === p && styles.periodButtonActive]}
            onPress={() => setPeriod(p)}
          >
            <Text
              style={[
                styles.periodText,
                period === p && styles.periodTextActive,
              ]}
            >
              {p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : p === 'year' ? 'Année' : 'Tout'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Historique des paiements</Text>

        {earnings?.transactions?.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucune transaction</Text>
          </View>
        ) : (
          earnings?.transactions?.map((transaction: any) => (
            <View key={transaction._id} style={styles.transactionCard}>
              <View style={styles.transactionHeader}>
                <Text style={styles.transactionType}>
                  {transaction.type === 'booking' ? 'Réservation' : 'Retrait'}
                </Text>
                <Text
                  style={[
                    styles.transactionAmount,
                    transaction.amount > 0 ? styles.positive : styles.negative,
                  ]}
                >
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount}€
                </Text>
              </View>
              <Text style={styles.transactionDate}>
                {format(new Date(transaction.date), 'dd MMMM yyyy', { locale: fr })}
              </Text>
              {transaction.status && (
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        transaction.status === 'completed' ? '#10b981' : '#f59e0b',
                    },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {transaction.status === 'completed' ? 'Complété' : 'En attente'}
                  </Text>
                </View>
              )}
            </View>
          ))
        )}
      </View>

      {earnings?.availableBalance && earnings.availableBalance > 0 && (
        <View style={styles.payoutSection}>
          <TouchableOpacity
            style={[
              styles.payoutButton,
              requestPayoutMutation.isPending && styles.buttonDisabled,
            ]}
            onPress={handleRequestPayout}
            disabled={requestPayoutMutation.isPending}
          >
            {requestPayoutMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.payoutButtonText}>
                Demander un retrait ({earnings.availableBalance}€)
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
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
    backgroundColor: '#8b5cf6',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
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
  },
  positive: {
    color: '#10b981',
  },
  negative: {
    color: '#ef4444',
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  payoutSection: {
    padding: 16,
    paddingBottom: 32,
  },
  payoutButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  payoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
