import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Button, Input, Card, LoadingSpinner, Modal } from '@/components';
import { profileService } from '@/services';
import { AuthContext, NotificationContext } from '@/contexts';
import { validatePassword } from '@/utils/validators';

/**
 * Écran de paramètres de sécurité (Provider)
 * 
 * Fonctionnalités:
 * - Changement de mot de passe
 * - Authentification 2FA
 * - Sessions actives
 * - Historique des connexions
 * - Sécurité du compte
 */

interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod?: 'sms' | 'email' | 'authenticator';
  phoneVerified: boolean;
  emailVerified: boolean;
}

export default function SecuritySettingsScreen() {
  const router = useRouter();
  const { user } = React.useContext(AuthContext);
  const { addNotification } = React.useContext(NotificationContext);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [twoFactorSettings, setTwoFactorSettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    twoFactorMethod: 'sms',
    phoneVerified: false,
    emailVerified: true,
  });

  const [verificationCode, setVerificationCode] = useState('');

  // Récupérer les paramètres de sécurité
  const { data: securitySettings, isLoading } = useQuery({
    queryKey: ['securitySettings', user?.id],
    queryFn: () => profileService.getSecuritySettings(user?.id || ''),
    enabled: !!user?.id,
  });

  // Mutation pour changer le mot de passe
  const { mutate: changePassword, isPending: changingPassword } = useMutation({
    mutationFn: (data: any) => profileService.changePassword(data),
    onSuccess: () => {
      addNotification({
        type: 'success',
        message: 'Mot de passe changé avec succès',
        duration: 2000,
      });
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: `Erreur: ${error.message}`,
        duration: 3000,
      });
    },
  });

  // Mutation pour activer 2FA
  const { mutate: enable2FA, isPending: enabling2FA } = useMutation({
    mutationFn: (data: any) => profileService.enable2FA(data),
    onSuccess: () => {
      addNotification({
        type: 'success',
        message: 'Authentification 2FA activée',
        duration: 2000,
      });
      setShow2FAModal(false);
      setVerificationCode('');
    },
  });

  const validatePasswordChange = (): boolean => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return false;
    }

    if (!validatePassword(passwordData.newPassword)) {
      Alert.alert(
        'Erreur',
        'Le mot de passe doit contenir au minimum 8 caractères, une majuscule, une minuscule et un chiffre'
      );
      return false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return false;
    }

    return true;
  };

  const handleChangePassword = () => {
    if (validatePasswordChange()) {
      changePassword(passwordData);
    }
  };

  const handleEnable2FA = () => {
    if (!verificationCode || verificationCode.length !== 6) {
      Alert.alert('Erreur', 'Veuillez entrer un code de 6 chiffres');
      return;
    }

    enable2FA({
      method: twoFactorSettings.twoFactorMethod,
      verificationCode,
    });
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
        <Text style={styles.headerTitle}>Sécurité</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Mot de passe */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔐 Mot de Passe</Text>
        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Changer le mot de passe</Text>
              <Text style={styles.settingDescription}>
                Modifiez votre mot de passe régulièrement
              </Text>
            </View>
            <TouchableOpacity
              style={styles.settingButton}
              onPress={() => setShowPasswordModal(true)}
            >
              <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>
          </View>
        </Card>
      </View>

      {/* Authentification 2FA */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🛡️ Authentification 2FA</Text>
        <Card style={styles.settingCard}>
          <View style={[styles.settingRow, { gap: 12 }]}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>
                Authentification à deux facteurs
              </Text>
              <Text style={styles.settingDescription}>
                Sécurité supplémentaire pour votre compte
              </Text>
            </View>
            <Switch
              value={twoFactorSettings.twoFactorEnabled}
              onValueChange={(value) => {
                if (value) {
                  setShow2FAModal(true);
                } else {
                  Alert.alert(
                    'Désactiver 2FA',
                    'Êtes-vous sûr?',
                    [
                      { text: 'Annuler', style: 'cancel' },
                      {
                        text: 'Désactiver',
                        onPress: () =>
                          setTwoFactorSettings((prev) => ({
                            ...prev,
                            twoFactorEnabled: false,
                          })),
                        style: 'destructive',
                      },
                    ]
                  );
                }
              }}
            />
          </View>

          {twoFactorSettings.twoFactorEnabled && (
            <View style={[styles.methodsContainer, { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0' }]}>
              <Text style={styles.methodsLabel}>Méthode de vérification</Text>
              {['sms', 'email', 'authenticator'].map((method) => (
                <TouchableOpacity
                  key={method}
                  style={styles.methodOption}
                  onPress={() =>
                    setTwoFactorSettings((prev) => ({
                      ...prev,
                      twoFactorMethod: method as any,
                    }))
                  }
                >
                  <View
                    style={[
                      styles.radio,
                      twoFactorSettings.twoFactorMethod === method &&
                        styles.radioSelected,
                    ]}
                  >
                    {twoFactorSettings.twoFactorMethod === method && (
                      <View style={styles.radioDot} />
                    )}
                  </View>
                  <View>
                    <Text style={styles.methodName}>
                      {method === 'sms'
                        ? 'SMS'
                        : method === 'email'
                        ? 'Email'
                        : 'Authenticator'}
                    </Text>
                    <Text style={styles.methodDescription}>
                      {method === 'sms'
                        ? 'Code envoyé par SMS'
                        : method === 'email'
                        ? 'Code envoyé par email'
                        : 'App authenticateur'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Card>
      </View>

      {/* Vérification des comptes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✅ Vérification</Text>
        <Card style={styles.verificationCard}>
          <View style={styles.verificationItem}>
            <View style={styles.verificationIcon}>
              {twoFactorSettings.emailVerified ? (
                <MaterialCommunityIcons name="check-circle" size={24} color="#4caf50" />
              ) : (
                <MaterialCommunityIcons name="alert-circle" size={24} color="#ff9800" />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.verificationLabel}>Email</Text>
              <Text style={styles.verificationStatus}>
                {twoFactorSettings.emailVerified ? 'Vérifié' : 'Non vérifié'}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.verificationItem,
              { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
            ]}
          >
            <View style={styles.verificationIcon}>
              {twoFactorSettings.phoneVerified ? (
                <MaterialCommunityIcons name="check-circle" size={24} color="#4caf50" />
              ) : (
                <MaterialCommunityIcons name="alert-circle" size={24} color="#ff9800" />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.verificationLabel}>Numéro de téléphone</Text>
              <Text style={styles.verificationStatus}>
                {twoFactorSettings.phoneVerified ? 'Vérifié' : 'Non vérifié'}
              </Text>
            </View>
            {!twoFactorSettings.phoneVerified && (
              <TouchableOpacity>
                <Text style={styles.actionLink}>Vérifier</Text>
              </TouchableOpacity>
            )}
          </View>
        </Card>
      </View>

      {/* Sessions actives */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 Sessions Actives</Text>
        <Card style={styles.sessionsCard}>
          <View style={styles.sessionItem}>
            <View style={styles.sessionIcon}>
              <MaterialCommunityIcons name="phone" size={24} color="#007AFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sessionName}>iPhone 14</Text>
              <Text style={styles.sessionDetails}>
                iOS 17.0 • Connecté il y a 2 min
              </Text>
            </View>
            <View style={styles.currentBadge}>
              <Text style={styles.currentText}>Actuel</Text>
            </View>
          </View>

          <View
            style={[
              styles.sessionItem,
              {
                marginTop: 12,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: '#f0f0f0',
              },
            ]}
          >
            <View style={styles.sessionIcon}>
              <MaterialCommunityIcons name="laptop" size={24} color="#999" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sessionName}>MacBook Pro</Text>
              <Text style={styles.sessionDetails}>
                Chrome • Connecté il y a 1 semaine
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.actionLink}>Déconnecter</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>

      {/* Historique de connexion */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Historique de Connexion</Text>
        <Card style={styles.historyCard}>
          <View style={styles.historyItem}>
            <View>
              <Text style={styles.historyTime}>Aujourd'hui, 14:32</Text>
              <Text style={styles.historyDetails}>
                iPhone • Succès
              </Text>
            </View>
            <View style={styles.successBadge}>
              <Text style={styles.successText}>✓</Text>
            </View>
          </View>

          <View
            style={[
              styles.historyItem,
              {
                marginTop: 12,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: '#f0f0f0',
              },
            ]}
          >
            <View>
              <Text style={styles.historyTime}>Hier, 09:15</Text>
              <Text style={styles.historyDetails}>
                MacBook • Succès
              </Text>
            </View>
            <View style={styles.successBadge}>
              <Text style={styles.successText}>✓</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Modale Changement Mot de Passe */}
      <Modal
        visible={showPasswordModal}
        title="Changer le mot de passe"
        onClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalContent}>
          <Input
            label="Mot de passe actuel"
            placeholder="Entrez votre mot de passe"
            value={passwordData.currentPassword}
            onChangeText={(text) =>
              setPasswordData((prev) => ({ ...prev, currentPassword: text }))
            }
            secureTextEntry
          />
          <Input
            label="Nouveau mot de passe"
            placeholder="Entrez le nouveau mot de passe"
            value={passwordData.newPassword}
            onChangeText={(text) =>
              setPasswordData((prev) => ({ ...prev, newPassword: text }))
            }
            secureTextEntry
            style={{ marginTop: 12 }}
          />
          <Input
            label="Confirmer le mot de passe"
            placeholder="Confirmez le nouveau mot de passe"
            value={passwordData.confirmPassword}
            onChangeText={(text) =>
              setPasswordData((prev) => ({ ...prev, confirmPassword: text }))
            }
            secureTextEntry
            style={{ marginTop: 12 }}
          />
          <View style={styles.modalActions}>
            <Button
              title="Annuler"
              variant="secondary"
              onPress={() => setShowPasswordModal(false)}
            />
            <Button
              title={changingPassword ? 'Changement...' : 'Changer'}
              onPress={handleChangePassword}
              disabled={changingPassword}
            />
          </View>
        </View>
      </Modal>

      {/* Modale 2FA */}
      <Modal
        visible={show2FAModal}
        title="Activer l'authentification 2FA"
        onClose={() => setShow2FAModal(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            Entrez le code de vérification reçu
          </Text>
          <Input
            placeholder="000000"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
            maxLength={6}
            style={{ marginTop: 12, textAlign: 'center', fontSize: 24 }}
          />
          <View style={styles.modalActions}>
            <Button
              title="Annuler"
              variant="secondary"
              onPress={() => setShow2FAModal(false)}
            />
            <Button
              title={enabling2FA ? 'Activation...' : 'Confirmer'}
              onPress={handleEnable2FA}
              disabled={enabling2FA}
            />
          </View>
        </View>
      </Modal>
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
  settingCard: {
    padding: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  settingDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  settingButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodsContainer: {
    gap: 12,
  },
  methodsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#007AFF',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  methodName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  methodDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  verificationCard: {
    padding: 16,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  verificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  verificationStatus: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  actionLink: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '500',
  },
  sessionsCard: {
    padding: 16,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sessionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  sessionDetails: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  currentBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2e7d32',
  },
  historyCard: {
    padding: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  historyDetails: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  successBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2e7d32',
  },
  modalContent: {
    paddingVertical: 16,
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
});
