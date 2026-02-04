import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Button, Card, LoadingSpinner, Modal } from '@/components';
import { adminService } from '@/services';
import { useNotification } from '@/contexts';

/**
 * Écran Gestion des Signalements (Admin)
 * 
 * Fonctionnalités:
 * - Liste des signalements
 * - Affichage des preuves
 * - Actions (résoudre, archiver, sanctions)
 * - Historique des signalements
 * - Filtrage par statut
 */

interface Report {
  id: string;
  reporterName: string;
  targetName: string;
  reason: string;
  description: string;
  evidence?: string[];
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  severity: 'low' | 'medium' | 'high';
  createdAt: Date;
  resolvedAt?: Date;
  resolution?: string;
}

export default function ReportsScreen() {
  const router = useRouter();
  const { addNotification } = useNotification();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<string>('');
  const [resolution, setResolution] = useState('');

  // Récupérer les signalements
  const { data: reports = [], isLoading, refetch } = useQuery({
    queryKey: ['reports', filterStatus],
    queryFn: () => adminService.getReports({ status: filterStatus }),
  });

  // Mutation pour mettre à jour le statut
  const { mutate: updateReportStatus, isPending } = useMutation({
    mutationFn: (data: {
      reportId: string;
      status: string;
      resolution?: string;
    }) => adminService.updateReportStatus(data),
    onSuccess: () => {
      addNotification('Signalement mis à jour', 'success', 2000);
      setShowActionModal(false);
      refetch();
    },
  });

  const handleReportAction = (report: Report, action: string) => {
    setSelectedReport(report);
    setActionType(action);
    setShowActionModal(true);
  };

  const confirmAction = () => {
    if (!selectedReport) return;

    let newStatus = selectedReport.status;
    if (actionType === 'resolve') newStatus = 'resolved';
    if (actionType === 'investigating') newStatus = 'investigating';
    if (actionType === 'dismiss') newStatus = 'dismissed';

    updateReportStatus({
      reportId: selectedReport.id,
      status: newStatus,
      resolution: resolution || actionType,
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#ffc107';
      default:
        return '#ccc';
    }
  };

  const getSeverityText = (severity: string) => {
    const map: Record<string, string> = {
      high: 'Critique',
      medium: 'Moyen',
      low: 'Faible',
    };
    return map[severity] || severity;
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#2196f3';
      case 'investigating':
        return '#ff9800';
      case 'resolved':
        return '#4caf50';
      case 'dismissed':
        return '#999';
      default:
        return '#ccc';
    }
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      pending: 'En attente',
      investigating: 'Enquête',
      resolved: 'Résolu',
      dismissed: 'Rejeté',
    };
    return map[status] || status;
  };

  const filteredReports = reports.filter((report) => {
    if (searchQuery.trim()) {
      return (
        report.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reason.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Entête */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Signalements</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Stats rapides */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {reports.filter((r) => r.status === 'pending').length}
          </Text>
          <Text style={styles.statLabel}>En attente</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {reports.filter((r) => r.status === 'investigating').length}
          </Text>
          <Text style={styles.statLabel}>Enquête</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {reports.filter((r) => r.status === 'resolved').length}
          </Text>
          <Text style={styles.statLabel}>Résolus</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {reports.filter((r) => r.severity === 'high').length}
          </Text>
          <Text style={styles.statLabel}>Critiques</Text>
        </View>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#ccc" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un signalement..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#ccc"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialCommunityIcons name="close-circle" size={20} color="#ccc" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtres par statut */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {['all', 'pending', 'investigating', 'resolved', 'dismissed'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              filterStatus === status && styles.filterButtonActive,
            ]}
            onPress={() => setFilterStatus(status)}
          >
            <Text
              style={[
                styles.filterText,
                filterStatus === status && styles.filterTextActive,
              ]}
            >
              {status === 'all' ? 'Tous' : getStatusText(status)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Liste des signalements */}
      <FlatList
        data={filteredReports}
        keyExtractor={(item) => item.id}
        renderItem={({ item: report }) => (
          <Card style={styles.reportCard}>
            {/* En-tête */}
            <View style={styles.reportHeader}>
              <View style={{ flex: 1 }}>
                <View style={styles.titleRow}>
                  <Text style={styles.reportTitle}>{report.reason}</Text>
                  <View
                    style={[
                      styles.severityBadge,
                      { backgroundColor: getSeverityColor(report.severity) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.severityText,
                        { color: getSeverityColor(report.severity) },
                      ]}
                    >
                      {getSeverityText(report.severity)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.reportDate}>
                  {new Date(report.createdAt).toLocaleDateString('fr-FR')}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusBadgeColor(report.status) + '20' },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusBadgeColor(report.status) },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusBadgeColor(report.status) },
                  ]}
                >
                  {getStatusText(report.status)}
                </Text>
              </View>
            </View>

            {/* Contenu */}
            <View style={styles.reportContent}>
              <View style={styles.parties}>
                <View style={styles.party}>
                  <MaterialCommunityIcons
                    name="flag-outline"
                    size={18}
                    color="#999"
                  />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.partyLabel}>Signaleur</Text>
                    <Text style={styles.partyName}>{report.reporterName}</Text>
                  </View>
                </View>
                <View style={styles.party}>
                  <MaterialCommunityIcons
                    name="account-alert"
                    size={18}
                    color="#999"
                  />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.partyLabel}>Cible</Text>
                    <Text style={styles.partyName}>{report.targetName}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.descriptionBox}>
                <Text style={styles.descriptionLabel}>Description:</Text>
                <Text style={styles.descriptionText}>{report.description}</Text>
              </View>

              {/* Preuves */}
              {report.evidence && report.evidence.length > 0 && (
                <View style={styles.evidenceSection}>
                  <Text style={styles.evidenceLabel}>📸 Preuves ({report.evidence.length})</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {report.evidence.map((evidence, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.evidenceItem}
                      >
                        <MaterialCommunityIcons
                          name="image-outline"
                          size={32}
                          color="#007AFF"
                        />
                        <Text style={styles.evidenceIndex}>{index + 1}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Actions */}
            <View style={styles.actionsRow}>
              {report.status === 'pending' && (
                <>
                  <Button
                    title="Enquête"
                    variant="secondary"
                    onPress={() => handleReportAction(report, 'investigating')}
                    style={styles.actionButton}
                  />
                  <Button
                    title="Rejeter"
                    onPress={() => handleReportAction(report, 'dismiss')}
                    style={styles.actionButton}
                  />
                </>
              )}
              {report.status === 'investigating' && (
                <>
                  <Button
                    title="Résoudre"
                    onPress={() => handleReportAction(report, 'resolve')}
                    style={styles.actionButton}
                  />
                  <Button
                    title="Retour"
                    variant="secondary"
                    onPress={() => handleReportAction(report, 'pending')}
                    style={styles.actionButton}
                  />
                </>
              )}
            </View>
          </Card>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="flag-outline" size={64} color="#ddd" />
            <Text style={styles.emptyStateText}>Aucun signalement</Text>
          </View>
        )}
        scrollEnabled={true}
      />

      {/* Modale Action */}
      <Modal
        visible={showActionModal}
        title="Signalement"
        onClose={() => setShowActionModal(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            {selectedReport?.reporterName} signale {selectedReport?.targetName}
          </Text>
          <Text style={styles.modalDescription}>{selectedReport?.description}</Text>

          {['resolve', 'dismiss'].includes(actionType) && (
            <TextInput
              style={styles.resolutionInput}
              placeholder="Ajouter une note de résolution..."
              value={resolution}
              onChangeText={setResolution}
              multiline
              numberOfLines={3}
            />
          )}

          <View style={styles.modalActions}>
            <Button
              title="Annuler"
              variant="secondary"
              onPress={() => setShowActionModal(false)}
            />
            <Button
              title={isPending ? 'Traitement...' : 'Confirmer'}
              onPress={confirmAction}
              disabled={isPending}
            />
          </View>
        </View>
      </Modal>
    </View>
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  statItem: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 24,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  filterTextActive: {
    color: '#fff',
  },
  reportCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  reportDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  reportContent: {
    gap: 12,
  },
  parties: {
    gap: 8,
  },
  party: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  partyLabel: {
    fontSize: 11,
    color: '#999',
  },
  partyName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  descriptionBox: {
    paddingVertical: 8,
  },
  descriptionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 13,
    color: '#1a1a1a',
    lineHeight: 18,
  },
  evidenceSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  evidenceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  evidenceItem: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    position: 'relative',
  },
  evidenceIndex: {
    position: 'absolute',
    bottom: -8,
    right: 0,
    backgroundColor: '#007AFF',
    color: '#fff',
    borderRadius: 10,
    width: 18,
    height: 18,
    textAlign: 'center',
    lineHeight: 18,
    fontSize: 10,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  modalContent: {
    paddingVertical: 16,
  },
  modalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
    lineHeight: 18,
  },
  resolutionInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 13,
    color: '#1a1a1a',
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
});
