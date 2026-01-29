import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Button, Input, Card, LoadingSpinner, Modal } from '@/components';
import { profileService } from '@/services';
import { AuthContext, NotificationContext } from '@/contexts';
import { validateEmail } from '@/utils/validators';

/**
 * Écran de profil utilisateur et paramètres
 * 
 * Fonctionnalités:
 * - Édition des informations personnelles
 * - Gestion des paramètres de notification
 * - Paramètres de confidentialité
 * - Gestion des méthodes de paiement
 * - Données de compte
 */

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  preferences?: {
    notifications: boolean;
    emailUpdates: boolean;
    smsNotifications: boolean;
    showProfile: boolean;
  };
}

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { user, logout } = React.useContext(AuthContext)! as any;
  const { addNotification } = React.useContext(NotificationContext)! as any;

  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    firstName: (user as any)?.firstName || '',
    lastName: (user as any)?.lastName || '',
    email: (user as any)?.email || '',
    phone: (user as any)?.phone || '',
    bio: (user as any)?.bio || '',
    location: (user as any)?.location || '',
  });

  const [preferences, setPreferences] = useState({
    notifications: true,
    emailUpdates: true,
    smsNotifications: false,
    showProfile: true,
  });

  // Récupérer le profil complet
  const userId = (user as any)?.id;
  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => profileService.getProfileById(userId || ''),
    enabled: !!userId,
  });

  // Mutation pour mettre à jour le profil
  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: (data: Partial<UserProfile>) => {
      if (!userId) throw new Error('No user ID');
      return profileService.updateProfile(userId, data);
    },
    onSuccess: () => {
      addNotification('Profil mis à jour avec succès', 'success', 2000);
      setEditMode(false);
    },
    onError: (error: any) => {
      addNotification(`Erreur: ${error?.message || 'Erreur inconnue'}`, 'error', 3000);
    },
  });

  // Mutation pour supprimer le compte
  const { mutate: deleteAccount, isPending: deleting } = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('No user ID');
      // Appel API pour supprimer le compte
      return fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
    },
    onSuccess: () => {
      addNotification('Compte supprimé', 'success', 2000);
      logout();
      router.push('/(auth)/login');
    },
    onError: (error: any) => {
      addNotification(`Erreur: ${error?.message || 'Erreur inconnue'}`, 'error', 3000);
    },
  });

  const validateForm = (): boolean => {
    if (!formData.firstName?.trim() || !formData.lastName?.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return false;
    }

    if (!validateEmail(formData.email || '')) {
      Alert.alert('Erreur', 'Email invalide');
      return false;
    }

    return true;
  };

  const handleSaveProfile = () => {
    if (validateForm()) {
      updateProfile(formData);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          onPress: () => {
            logout();
            router.push('/(auth)/login');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '⚠️ Supprimer le compte',
      'Cette action est irréversible. Tous vos données seront supprimées.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: () => deleteAccount(),
          style: 'destructive',
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Entête */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon Profil</Text>
        <TouchableOpacity
          onPress={() => setEditMode(!editMode)}
          style={styles.editButton}
        >
          <MaterialCommunityIcons
            name={editMode ? 'close' : 'pencil'}
            size={24}
            color="#007AFF"
          />
        </TouchableOpacity>
      </View>

      {/* Avatar et infos de base */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {formData.firstName?.[0]?.toUpperCase() || 'U'}
            </Text>
          </View>
          {editMode && (
            <TouchableOpacity style={styles.editAvatarButton}>
              <MaterialCommunityIcons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.profileName}>
          {formData.firstName} {formData.lastName}
        </Text>
        <Text style={styles.profileEmail}>{formData.email}</Text>
      </View>

      {/* Informations personnelles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Informations Personnelles</Text>
        {editMode ? (
          <Card style={styles.editForm}>
            <Input
              label="Prénom"
              value={formData.firstName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, firstName: text }))
              }
              editable={editMode}
            />
            <Input
              label="Nom"
              value={formData.lastName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, lastName: text }))
              }
              editable={editMode}
              style={{ marginTop: 12 }}
            />
            <Input
              label="Email"
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
              editable={editMode}
              keyboardType="email-address"
              style={{ marginTop: 12 }}
            />
            <Input
              label="Téléphone"
              value={formData.phone}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, phone: text }))
              }
              editable={editMode}
              keyboardType="phone-pad"
              style={{ marginTop: 12 }}
            />
            <Input
              label="Localisation"
              value={formData.location}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, location: text }))
              }
              editable={editMode}
              style={{ marginTop: 12 }}
            />
            <Input
              label="Bio"
              value={formData.bio}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, bio: text }))
              }
              editable={editMode}
              multiline
              numberOfLines={3}
              style={{ marginTop: 12 }}
            />
          </Card>
        ) : (
          <Card style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons name="phone" size={20} color="#007AFF" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Téléphone</Text>
                <Text style={styles.infoValue}>{formData.phone || 'Non fourni'}</Text>
              </View>
            </View>
            <View style={[styles.infoRow, { marginTop: 12 }]}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons name="map-marker" size={20} color="#007AFF" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Localisation</Text>
                <Text style={styles.infoValue}>{formData.location || 'Non fournie'}</Text>
              </View>
            </View>
            <View style={[styles.infoRow, { marginTop: 12 }]}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons name="information" size={20} color="#007AFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Bio</Text>
                <Text style={styles.infoValue}>{formData.bio || 'Non fournie'}</Text>
              </View>
            </View>
          </Card>
        )}
        {editMode && (
          <View style={styles.editActions}>
            <Button
              title="Annuler"
              variant="secondary"
              onPress={() => setEditMode(false)}
            />
            <Button
              title={isPending ? 'Sauvegarde...' : 'Enregistrer'}
              onPress={handleSaveProfile}
              disabled={isPending}
            />
          </View>
        )}
      </View>

      {/* Notifications et Confidentialité */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔔 Notifications et Confidentialité</Text>
        <Card style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Recevoir les alertes de réservation
              </Text>
            </View>
            <Switch
              value={preferences.notifications}
              onValueChange={(value) =>
                setPreferences((prev) => ({ ...prev, notifications: value }))
              }
            />
          </View>

          <View style={[styles.settingRow, { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0' }]}>
            <View>
              <Text style={styles.settingLabel}>Mises à jour par email</Text>
              <Text style={styles.settingDescription}>
                Actualités et promotions
              </Text>
            </View>
            <Switch
              value={preferences.emailUpdates}
              onValueChange={(value) =>
                setPreferences((prev) => ({ ...prev, emailUpdates: value }))
              }
            />
          </View>

          <View style={[styles.settingRow, { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0' }]}>
            <View>
              <Text style={styles.settingLabel}>SMS</Text>
              <Text style={styles.settingDescription}>
                Notifications par SMS
              </Text>
            </View>
            <Switch
              value={preferences.smsNotifications}
              onValueChange={(value) =>
                setPreferences((prev) => ({ ...prev, smsNotifications: value }))
              }
            />
          </View>

          <View style={[styles.settingRow, { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0' }]}>
            <View>
              <Text style={styles.settingLabel}>Profil public</Text>
              <Text style={styles.settingDescription}>
                Rendre votre profil visible
              </Text>
            </View>
            <Switch
              value={preferences.showProfile}
              onValueChange={(value) =>
                setPreferences((prev) => ({ ...prev, showProfile: value }))
              }
            />
          </View>
        </Card>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={20} color="#007AFF" />
            <Text style={styles.actionButtonText}>Déconnexion</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleDeleteAccount}
          >
            <MaterialCommunityIcons name="delete" size={20} color="#ff3b30" />
            <Text style={[styles.actionButtonText, { color: '#ff3b30' }]}>
              Supprimer le compte
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Infos légales */}
      <View style={styles.legalSection}>
        <TouchableOpacity>
          <Text style={styles.legalLink}>Conditions d'utilisation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 8 }}>
          <Text style={styles.legalLink}>Politique de confidentialité</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
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
  editButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  editForm: {
    padding: 16,
  },
  infoCard: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  settingsCard: {
    padding: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  settingDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 12,
  },
  dangerButton: {
    borderColor: '#ffe0e0',
    backgroundColor: '#fff5f5',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#007AFF',
  },
  legalSection: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: 'center',
  },
  legalLink: {
    fontSize: 13,
    color: '#007AFF',
  },
  versionText: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 16,
  },
});
