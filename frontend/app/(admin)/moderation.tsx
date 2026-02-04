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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type ModerationType = 'reviews' | 'chats' | 'reports';

export default function ModerationScreen() {
  const queryClient = useQueryClient();
  const [type, setType] = useState<ModerationType>('reports');

  const { data: items, isLoading, refetch } = useQuery({
    queryKey: ['admin-moderation', type],
    queryFn: () => adminService.getModerationItems(type),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminService.approveModerationItem(type, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-moderation'] });
      Alert.alert('Succès', 'Élément approuvé');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => adminService.rejectModerationItem(type, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-moderation'] });
      Alert.alert('Succès', 'Élément rejeté');
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Modération</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filters}
        contentContainerStyle={styles.filtersContent}
      >
        {(['reports', 'reviews', 'chats'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.filterButton, type === t && styles.filterButtonActive]}
            onPress={() => setType(t)}
          >
            <Text style={[styles.filterText, type === t && styles.filterTextActive]}>
              {t === 'reports'
                ? 'Signalements'
                : t === 'reviews'
                ? 'Avis'
                : 'Messages'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        {items?.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucun élément à modérer</Text>
          </View>
        ) : (
          items?.map((item: any) => (
            <View key={item._id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>
                  {type === 'reports'
                    ? `Signalement de ${item.reportedBy}`
                    : type === 'reviews'
                    ? `Avis de ${item.clientName}`
                    : `Message de ${item.senderName}`}
                </Text>
                <Text style={styles.itemDate}>
                  {format(new Date(item.createdAt), 'dd MMM yyyy', { locale: fr })}
                </Text>
              </View>

              <Text style={styles.itemContent}>
                {type === 'reports'
                  ? item.reason
                  : type === 'reviews'
                  ? item.comment
                  : item.content}
              </Text>

              {type === 'reports' && (
                <View style={styles.reportInfo}>
                  <Text style={styles.reportLabel}>Signalé par:</Text>
                  <Text style={styles.reportText}>{item.reportedBy}</Text>
                  <Text style={styles.reportLabel}>Raison:</Text>
                  <Text style={styles.reportText}>{item.reason}</Text>
                </View>
              )}

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={() => approveMutation.mutate(item._id)}
                  disabled={approveMutation.isPending}
                >
                  <Text style={styles.actionButtonText}>Approuver</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => rejectMutation.mutate(item._id)}
                  disabled={rejectMutation.isPending}
                >
                  <Text style={styles.actionButtonText}>Rejeter</Text>
                </TouchableOpacity>
              </View>
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
    marginTop: 40,
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
    backgroundColor: '#ef4444',
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
  itemCard: {
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
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  itemDate: {
    fontSize: 12,
    color: '#999',
  },
  itemContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  reportInfo: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  reportLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#991b1b',
    marginBottom: 4,
  },
  reportText: {
    fontSize: 14,
    color: '#991b1b',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#10b981',
  },
  rejectButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
