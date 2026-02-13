import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Button, Card, LoadingSpinner, Modal } from '@/components';
import { adminService } from '@/services';
import { useNotification } from '@/contexts';

/**
 * Écran Gestion des Utilisateurs (Admin)
 * 
 * Fonctionnalités:
 * - Liste de tous les utilisateurs
 * - Recherche et filtrage
 * - Suspension/Blocage d'utilisateurs
 * - Gestion des rôles
 * - Historique d'actions
 */

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'provider' | 'admin';
  status: 'active' | 'suspended' | 'blocked';
  createdAt: Date;
  lastLogin?: Date;
  profileVerified: boolean;
}

export default function UserManagementScreen() {
  const router = useRouter();
  const { addNotification } = useNotification();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<string>('');

  // Récupérer la liste des utilisateurs
  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['users', filterRole, searchQuery],
    queryFn: () =>
      adminService.getUsers({ role: filterRole, search: searchQuery }),
  });

  // Mutation pour changer le statut
  const { mutate: changeUserStatus, isPending } = useMutation({
    mutationFn: (data: {
      userId: string;
      status: 'active' | 'suspended' | 'blocked';
      reason?: string;
    }) => adminService.updateUserStatus(data),
    onSuccess: () => {
      addNotification('Utilisateur mis à jour', 'success', 2000);
      setShowActionModal(false);
      refetch();
    },
  });

  const handleUserAction = (user: User, action: string) => {
    setSelectedUser(user);
    setActionType(action);
    setShowActionModal(true);
  };

  const confirmAction = () => {
    if (!selectedUser) return;

    let status = selectedUser.status;
    if (actionType === 'suspend') status = 'suspended';
    if (actionType === 'block') status = 'blocked';
    if (actionType === 'activate') status = 'active';

    changeUserStatus({
      userId: selectedUser.id,
      status,
      reason: actionType,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4caf50';
      case 'suspended':
        return '#ff9800';
      case 'blocked':
        return '#f44336';
      default:
        return '#ccc';
    }
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      active: 'Actif',
      suspended: 'Suspendu',
      blocked: 'Bloqué',
    };
    return map[status] || status;
  };

  const filteredUsers = users.filter((user: User) => {
    if (searchQuery.trim()) {
      return (
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Text style={styles.headerTitle}>Gestion Utilisateurs</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#ccc" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un utilisateur..."
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

      {/* Filtres par rôle */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {['all', 'user', 'provider', 'admin'].map((role) => (
          <TouchableOpacity
            key={role}
            style={[
              styles.filterButton,
              filterRole === role && styles.filterButtonActive,
            ]}
            onPress={() => setFilterRole(role)}
          >
            <Text
              style={[
                styles.filterText,
                filterRole === role && styles.filterTextActive,
              ]}
            >
              {role === 'all' ? 'Tous' : role.charAt(0).toUpperCase() + role.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Liste des utilisateurs */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item: user }) => (
          <Card style={styles.userCard}>
            <View style={styles.userContent}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {user.firstName.charAt(0)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.userHeader}>
                    <Text style={styles.userName}>
                      {user.firstName} {user.lastName}
                    </Text>
                    <View style={[styles.roleBadge, { backgroundColor: '#f0f7ff' }]}>
                      <Text style={[styles.roleText, { color: '#007AFF' }]}>
                        {user.role}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  <View style={styles.userMetaRow}>
                    <View style={styles.metaItem}>
                      <MaterialCommunityIcons
                        name="calendar"
                        size={14}
                        color="#999"
                      />
                      <Text style={styles.metaText}>
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </Text>
                    </View>
                    {user.profileVerified && (
                      <View style={styles.metaItem}>
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={14}
                          color="#4caf50"
                        />
                        <Text style={[styles.metaText, { color: '#4caf50' }]}>
                          Vérifié
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* Statut et Actions */}
              <View style={styles.statusAndActions}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(user.status) + '20' },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor(user.status) },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusLabel,
                      { color: getStatusColor(user.status) },
                    ]}
                  >
                    {getStatusText(user.status)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.actionMenu}
                  onPress={() => handleUserAction(user, 'view')}
                >
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    size={20}
                    color="#ccc"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Actions rapides */}
            <View style={styles.quickActions}>
              {user.status === 'active' && (
                <>
                  <TouchableOpacity
                    style={styles.quickActionBtn}
                    onPress={() => handleUserAction(user, 'suspend')}
                  >
                    <MaterialCommunityIcons
                      name="pause-circle"
                      size={18}
                      color="#ff9800"
                    />
                    <Text style={styles.quickActionText}>Suspendre</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.quickActionBtn}
                    onPress={() => handleUserAction(user, 'block')}
                  >
                    <MaterialCommunityIcons
                      name="block-helper"
                      size={18}
                      color="#f44336"
                    />
                    <Text style={styles.quickActionText}>Bloquer</Text>
                  </TouchableOpacity>
                </>
              )}
              {user.status !== 'active' && (
                <TouchableOpacity
                  style={styles.quickActionBtn}
                  onPress={() => handleUserAction(user, 'activate')}
                >
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={18}
                    color="#4caf50"
                  />
                  <Text style={styles.quickActionText}>Activer</Text>
                </TouchableOpacity>
              )}
            </View>
          </Card>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="account-outline" size={64} color="#ddd" />
            <Text style={styles.emptyStateText}>Aucun utilisateur trouvé</Text>
          </View>
        )}
        scrollEnabled={true}
      />

      {/* Modale Action */}
      <Modal
        visible={showActionModal}
        title={`${getStatusText(selectedUser?.status || 'active')}`}
        onClose={() => setShowActionModal(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            Êtes-vous sûr de vouloir {actionType} cet utilisateur?
          </Text>
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
  userCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
  },
  userContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  userEmail: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  userMetaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#999',
  },
  statusAndActions: {
    alignItems: 'flex-end',
    gap: 8,
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
  statusLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionMenu: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    gap: 4,
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
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
    color: '#666',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
});
