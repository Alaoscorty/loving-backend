import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';

import { Card, Button, LoadingSpinner } from '@/components';
import { adminService } from '@/services';
import { formatCurrency, formatNumber } from '@/utils/formatters';

/**
 * Dashboard Admin - Vue complète avec statistiques avancées
 * 
 * Fonctionnalités:
 * - Statistiques clés (utilisateurs, réservations, revenus)
 * - Graphiques de tendances
 * - Alertes et actions urgentes
 * - Accès rapide aux gestions
 */

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalBookings: number;
  completedBookings: number;
  totalRevenue: number;
  commissions: number;
  totalReports: number;
  unresolvedReports: number;
  averageRating: number;
}

interface UrgentAction {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

interface DashboardAlert {
  id: string;
  message: string;
  timestamp: string;
  color: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

export default function AdvancedDashboardScreen() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState('month'); // 'week', 'month', 'year'

  // Récupérer les statistiques
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats', dateRange],
    queryFn: () => adminService.getDashboardStats({ period: dateRange }),
  });

  // Récupérer les données pour les graphiques
  const { data: chartData, isLoading: chartsLoading } = useQuery({
    queryKey: ['chartData', dateRange],
    queryFn: () => adminService.getChartData({ period: dateRange }),
  });

  // Récupérer les alertes
  const { data: alerts = [] } = useQuery<DashboardAlert[]>({
    queryKey: ['adminAlerts'],
    queryFn: () => adminService.getAlerts(),
  });

  // Récupérer les actions urgentes
  const { data: urgentActions = [] } = useQuery<UrgentAction[]>({
    queryKey: ['urgentActions'],
    queryFn: () => adminService.getUrgentActions(),
  });

  if (statsLoading || chartsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Entête */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard Admin</Text>
          <Text style={styles.headerDate}>
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialCommunityIcons name="bell-outline" size={24} color="#007AFF" />
          {alerts.length > 0 && <View style={styles.notificationBadge} />}
        </TouchableOpacity>
      </View>

      {/* Sélecteur de période */}
      <View style={styles.dateSelector}>
        {['week', 'month', 'year'].map((range) => (
          <TouchableOpacity
            key={range}
            style={[
              styles.dateButton,
              dateRange === range && styles.dateButtonActive,
            ]}
            onPress={() => setDateRange(range)}
          >
            <Text
              style={[
                styles.dateButtonText,
                dateRange === range && styles.dateButtonTextActive,
              ]}
            >
              {range === 'week'
                ? 'Semaine'
                : range === 'month'
                ? 'Mois'
                : 'Année'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* KPIs Principal */}
      <View style={styles.kpisContainer}>
        <Card style={styles.kpiCard}>
          <View style={styles.kpiContent}>
            <View style={styles.kpiIcon}>
              <MaterialCommunityIcons name="account-group" size={28} color="#007AFF" />
            </View>
            <View style={styles.kpiData}>
              <Text style={styles.kpiValue}>{formatNumber(stats?.totalUsers || 0)}</Text>
              <Text style={styles.kpiLabel}>Utilisateurs</Text>
              <Text style={styles.kpiChange}>+12.5%</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.kpiCard}>
          <View style={styles.kpiContent}>
            <View style={styles.kpiIcon}>
              <MaterialCommunityIcons name="calendar-check" size={28} color="#4caf50" />
            </View>
            <View style={styles.kpiData}>
              <Text style={styles.kpiValue}>{formatNumber(stats?.totalBookings || 0)}</Text>
              <Text style={styles.kpiLabel}>Réservations</Text>
              <Text style={styles.kpiChange}>+8.3%</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.kpiCard}>
          <View style={styles.kpiContent}>
            <View style={styles.kpiIcon}>
              <MaterialCommunityIcons name="cash" size={28} color="#FFD700" />
            </View>
            <View style={styles.kpiData}>
              <Text style={styles.kpiValue}>{formatCurrency(stats?.totalRevenue || 0)}</Text>
              <Text style={styles.kpiLabel}>Revenus</Text>
              <Text style={styles.kpiChange}>+15.2%</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.kpiCard}>
          <View style={styles.kpiContent}>
            <View style={styles.kpiIcon}>
              <MaterialCommunityIcons name="alert-circle" size={28} color="#ff9800" />
            </View>
            <View style={styles.kpiData}>
              <Text style={styles.kpiValue}>{formatNumber(stats?.totalReports || 0)}</Text>
              <Text style={styles.kpiLabel}>Signalements</Text>
              <Text style={styles.kpiChange}>
                {stats?.unresolvedReports || 0} non résolus
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Graphique Revenus */}
      {chartData?.revenueData && (
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>📊 Tendance des Revenus</Text>
          <Card style={styles.chartCard}>
            <LineChart
              data={chartData.revenueData}
              width={320}
              height={220}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              style={styles.chart}
              withDots={true}
              withShadow={false}
            />
          </Card>
        </View>
      )}

      {/* Graphique Réservations */}
      {chartData?.bookingData && (
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>📈 Réservations par Jour</Text>
          <Card style={styles.chartCard}>
            <BarChart
              data={chartData.bookingData}
              width={320}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              style={styles.chart}
              withHorizontalLabels={true}
            />
          </Card>
        </View>
      )}

      {/* Actions Urgentes */}
      {urgentActions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ Actions Urgentes</Text>
          <FlatList
            scrollEnabled={false}
            data={urgentActions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card style={StyleSheet.flatten([styles.actionCard, { marginBottom: 12 }])}>
                <View style={styles.actionRow}>
                  <View style={styles.actionIcon}>
                    <MaterialCommunityIcons
                      name={item.severity === 'high' ? 'alert' : 'information'}
                      size={20}
                      color={item.severity === 'high' ? '#ff3b30' : '#ff9800'}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.actionTitle}>{item.title}</Text>
                    <Text style={styles.actionDescription}>{item.description}</Text>
                  </View>
                  <TouchableOpacity>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={24}
                      color="#ccc"
                    />
                  </TouchableOpacity>
                </View>
              </Card>
            )}
          />
        </View>
      )}

      {/* Alertes Système */}
      {alerts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 Alertes Système</Text>
          <FlatList
            scrollEnabled={false}
            data={alerts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card style={StyleSheet.flatten([styles.alertCard, { marginBottom: 12 }])}>
                <View style={styles.alertRow}>
                  <View style={[styles.alertIcon, { backgroundColor: item.color }]}>
                    <MaterialCommunityIcons name={item.icon} size={18} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.alertMessage}>{item.message}</Text>
                    <Text style={styles.alertTime}>
                      {new Date(item.timestamp).toLocaleString('fr-FR')}
                    </Text>
                  </View>
                </View>
              </Card>
            )}
          />
        </View>
      )}

      {/* Accès Rapide */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Accès Rapide</Text>
        <View style={styles.quickAccessGrid}>
          <TouchableOpacity
            style={styles.quickAccessButton}
            onPress={() => router.push('/(admin)/profiles')}
          >
            <MaterialCommunityIcons name="account-check" size={32} color="#007AFF" />
            <Text style={styles.quickAccessText}>Profils</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAccessButton}
            onPress={() => router.push('/(admin)/user-management')}
          >
            <MaterialCommunityIcons name="account-multiple" size={32} color="#4caf50" />
            <Text style={styles.quickAccessText}>Utilisateurs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAccessButton}
            onPress={() => router.push('/(admin)/reports')}
          >
            <MaterialCommunityIcons name="flag" size={32} color="#ff9800" />
            <Text style={styles.quickAccessText}>Signalements</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAccessButton}
            onPress={() => router.push('/(admin)/commissions')}
          >
            <MaterialCommunityIcons name="percent" size={32} color="#FFD700" />
            <Text style={styles.quickAccessText}>Commissions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    marginTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  headerDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff3b30',
  },
  dateSelector: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  dateButtonActive: {
    backgroundColor: '#007AFF',
  },
  dateButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  dateButtonTextActive: {
    color: '#fff',
  },
  kpisContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  kpiCard: {
    padding: 16,
  },
  kpiContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  kpiIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kpiData: {
    flex: 1,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  kpiLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  kpiChange: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4caf50',
    marginTop: 2,
  },
  chartSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  chartCard: {
    padding: 12,
    alignItems: 'center',
  },
  chart: {
    borderRadius: 8,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  actionCard: {
    padding: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff3e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  actionDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  alertCard: {
    padding: 12,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  alertIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertMessage: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  alertTime: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAccessButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  quickAccessText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
});
