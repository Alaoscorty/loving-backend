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
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type LogType = 'security' | 'actions' | 'errors' | 'all';

export default function LogsScreen() {
  const [filter, setFilter] = useState<LogType>('all');
  const [level, setLevel] = useState<'info' | 'warning' | 'error' | 'all'>('all');

  const { data: logs, isLoading, refetch } = useQuery({
    queryKey: ['admin-logs', filter, level],
    queryFn: () => adminService.getLogs(filter, level),
  });

  const getLevelColor = (logLevel: string) => {
    switch (logLevel) {
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Logs & Audit</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filters}
        contentContainerStyle={styles.filtersContent}
      >
        {(['all', 'security', 'actions', 'errors'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.filterButton, filter === t && styles.filterButtonActive]}
            onPress={() => setFilter(t)}
          >
            <Text style={[styles.filterText, filter === t && styles.filterTextActive]}>
              {t === 'all'
                ? 'Tous'
                : t === 'security'
                ? 'Sécurité'
                : t === 'actions'
                ? 'Actions'
                : 'Erreurs'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.levelFilters}
        contentContainerStyle={styles.filtersContent}
      >
        {(['all', 'info', 'warning', 'error'] as const).map((l) => (
          <TouchableOpacity
            key={l}
            style={[styles.levelButton, level === l && styles.levelButtonActive]}
            onPress={() => setLevel(l)}
          >
            <Text style={[styles.levelText, level === l && styles.levelTextActive]}>
              {l === 'all' ? 'Tous' : l.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        {logs?.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucun log</Text>
          </View>
        ) : (
          logs?.map((log: any) => (
            <View key={log._id} style={styles.logCard}>
              <View style={styles.logHeader}>
                <View
                  style={[
                    styles.levelBadge,
                    { backgroundColor: getLevelColor(log.level) },
                  ]}
                >
                  <Text style={styles.levelBadgeText}>{log.level.toUpperCase()}</Text>
                </View>
                <Text style={styles.logDate}>
                  {format(new Date(log.timestamp), 'dd MMM yyyy HH:mm', { locale: fr })}
                </Text>
              </View>

              <Text style={styles.logMessage}>{log.message}</Text>

              {log.userId && (
                <Text style={styles.logUser}>Utilisateur: {log.userId}</Text>
              )}

              {log.action && (
                <Text style={styles.logAction}>Action: {log.action}</Text>
              )}

              {log.ip && <Text style={styles.logIp}>IP: {log.ip}</Text>}

              {log.details && (
                <View style={styles.logDetails}>
                  <Text style={styles.logDetailsText}>{JSON.stringify(log.details, null, 2)}</Text>
                </View>
              )}
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
  levelFilters: {
    maxHeight: 60,
    backgroundColor: '#f5f5f5',
  },
  levelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  levelButtonActive: {
    backgroundColor: '#6366f1',
  },
  levelText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  levelTextActive: {
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
  logCard: {
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
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  levelBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  logDate: {
    fontSize: 12,
    color: '#999',
  },
  logMessage: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 8,
    fontWeight: '500',
  },
  logUser: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  logAction: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  logIp: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  logDetails: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  logDetailsText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
});
