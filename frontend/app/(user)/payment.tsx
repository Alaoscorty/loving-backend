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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Button, Input, Card, LoadingSpinner } from '@/components';
import { paymentService, bookingService } from '@/services';
import { NotificationContext } from '@/contexts';
import { formatCurrency } from '@/utils/formatters';

/**
 * Écran de paiement - Gestion des paiements et méthodes
 * 
 * Fonctionnalités:
 * - Affichage du détail de la réservation
 * - Sélection de la méthode de paiement
 * - Formulaire de carte bancaire
 * - Historique des paiements
 * - Confirmation et reçu
 */

interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet' | 'bank_transfer';
  label: string;
  lastDigits?: string;
  isDefault?: boolean;
}

export default function PaymentScreen() {
  const router = useRouter();
  const { bookingId, amount } = useLocalSearchParams();
  const { addNotification } = React.useContext(NotificationContext);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
  });

  // Récupérer la réservation
  const { data: booking, isLoading: bookingLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingService.getBookingById(bookingId as string),
  });

  // Récupérer les méthodes de paiement
  const { data: paymentMethods = [], isLoading: methodsLoading } = useQuery({
    queryKey: ['paymentMethods'],
    queryFn: () => paymentService.getPaymentMethods(),
  });

  // Récupérer l'historique des paiements
  const { data: paymentHistory = [] } = useQuery({
    queryKey: ['paymentHistory'],
    queryFn: () => paymentService.getPaymentHistory(),
  });

  // Mutation pour ajouter une méthode de paiement
  const { mutate: addPaymentMethod, isPending: addingMethod } = useMutation({
    mutationFn: (data: any) => paymentService.addPaymentMethod(data),
    onSuccess: () => {
      addNotification({
        type: 'success',
        message: 'Méthode de paiement ajoutée',
        duration: 2000,
      });
      setShowAddMethod(false);
      setCardData({ cardNumber: '', cardholderName: '', expiryDate: '', cvv: '' });
    },
  });

  // Mutation pour traiter le paiement
  const { mutate: processPayment, isPending: processing } = useMutation({
    mutationFn: (data: any) => paymentService.processPayment(data),
    onSuccess: (payment) => {
      addNotification({
        type: 'success',
        message: 'Paiement effectué avec succès!',
        duration: 2000,
      });
      router.push({
        pathname: '/(user)/payment-receipt',
        params: { paymentId: payment.id },
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

  const handleAddPaymentMethod = () => {
    if (!cardData.cardNumber || !cardData.cardholderName || !cardData.expiryDate || !cardData.cvv) {
      addNotification({
        type: 'error',
        message: 'Veuillez remplir tous les champs',
        duration: 2000,
      });
      return;
    }

    addPaymentMethod(cardData);
  };

  const handleProcessPayment = () => {
    if (!selectedPaymentMethod) {
      addNotification({
        type: 'error',
        message: 'Veuillez sélectionner une méthode de paiement',
        duration: 2000,
      });
      return;
    }

    processPayment({
      bookingId,
      amount: parseFloat(amount as string),
      paymentMethodId: selectedPaymentMethod,
    });
  };

  if (bookingLoading || methodsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Entête */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paiement</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Résumé de la réservation */}
      {booking && (
        <Card style={styles.bookingCard}>
          <Text style={styles.cardTitle}>Résumé de la réservation</Text>
          <View style={styles.bookingDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Prestataire:</Text>
              <Text style={styles.detailValue}>
                {booking.provider?.firstName} {booking.provider?.lastName}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Service:</Text>
              <Text style={styles.detailValue}>{booking.serviceType || 'Service'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailValue}>
                {new Date(booking.startDate).toLocaleDateString('fr-FR')}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.totalLabel}>Montant total:</Text>
              <Text style={styles.totalValue}>{formatCurrency(parseFloat(amount as string))}</Text>
            </View>
          </View>
        </Card>
      )}

      {/* Méthodes de paiement */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>💳 Méthode de paiement</Text>
          <TouchableOpacity
            onPress={() => setShowAddMethod(!showAddMethod)}
            style={styles.addButton}
          >
            <MaterialCommunityIcons name={showAddMethod ? 'minus' : 'plus'} size={20} color="#007AFF" />
            <Text style={styles.addButtonText}>{showAddMethod ? 'Annuler' : 'Ajouter'}</Text>
          </TouchableOpacity>
        </View>

        {/* Formulaire ajout méthode */}
        {showAddMethod && (
          <Card style={styles.addMethodForm}>
            <Input
              placeholder="Numéro de carte"
              value={cardData.cardNumber}
              onChangeText={(text) =>
                setCardData((prev) => ({
                  ...prev,
                  cardNumber: text.replace(/\s/g, '').slice(0, 16),
                }))
              }
              keyboardType="numeric"
              maxLength={16}
            />
            <Input
              placeholder="Nom du titulaire"
              value={cardData.cardholderName}
              onChangeText={(text) =>
                setCardData((prev) => ({ ...prev, cardholderName: text }))
              }
              style={{ marginTop: 12 }}
            />
            <View style={styles.cardRow}>
              <Input
                placeholder="MM/AA"
                value={cardData.expiryDate}
                onChangeText={(text) =>
                  setCardData((prev) => ({ ...prev, expiryDate: text }))
                }
                keyboardType="numeric"
                maxLength={5}
                style={{ flex: 1 }}
              />
              <Input
                placeholder="CVV"
                value={cardData.cvv}
                onChangeText={(text) =>
                  setCardData((prev) => ({ ...prev, cvv: text }))
                }
                keyboardType="numeric"
                maxLength={3}
                style={{ flex: 1, marginLeft: 12 }}
              />
            </View>
            <Button
              title={addingMethod ? 'Ajout...' : 'Ajouter cette méthode'}
              onPress={handleAddPaymentMethod}
              disabled={addingMethod}
              style={{ marginTop: 16 }}
            />
          </Card>
        )}

        {/* Liste des méthodes */}
        {paymentMethods.length > 0 && (
          <FlatList
            scrollEnabled={false}
            data={paymentMethods}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.methodItem,
                  selectedPaymentMethod === item.id && styles.methodItemSelected,
                ]}
                onPress={() => setSelectedPaymentMethod(item.id)}
              >
                <View style={styles.methodIcon}>
                  <MaterialCommunityIcons
                    name={item.type === 'card' ? 'credit-card' : 'wallet'}
                    size={24}
                    color={selectedPaymentMethod === item.id ? '#007AFF' : '#ccc'}
                  />
                </View>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodLabel}>{item.label}</Text>
                  {item.lastDigits && (
                    <Text style={styles.methodDetails}>•••• {item.lastDigits}</Text>
                  )}
                </View>
                {selectedPaymentMethod === item.id && (
                  <MaterialCommunityIcons name="check-circle" size={24} color="#007AFF" />
                )}
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Historique des paiements */}
      {paymentHistory.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📜 Historique des paiements</Text>
          <FlatList
            scrollEnabled={false}
            data={paymentHistory.slice(0, 3)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card style={[styles.historyItem, { marginBottom: 12 }]}>
                <View style={styles.historyRow}>
                  <View>
                    <Text style={styles.historyAmount}>{formatCurrency(item.amount)}</Text>
                    <Text style={styles.historyDate}>
                      {new Date(item.date).toLocaleDateString('fr-FR')}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: item.status === 'completed' ? '#e8f5e9' : '#fff3e0' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: item.status === 'completed' ? '#2e7d32' : '#f57c00' },
                      ]}
                    >
                      {item.status === 'completed' ? 'Complété' : 'En attente'}
                    </Text>
                  </View>
                </View>
              </Card>
            )}
          />
        </View>
      )}

      {/* Boutons d'action */}
      <View style={styles.buttonContainer}>
        <Button
          title="Annuler"
          variant="secondary"
          onPress={() => router.back()}
        />
        <Button
          title={processing ? 'Traitement...' : 'Confirmer le paiement'}
          onPress={handleProcessPayment}
          disabled={processing || !selectedPaymentMethod}
        />
      </View>

      {/* Mentions légales */}
      <View style={styles.legalText}>
        <Text style={styles.legalTextSmall}>
          Vos données de paiement sont sécurisées et chiffrées.{'\n'}
          Vous recevrez un reçu par email après le paiement.
        </Text>
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
  bookingCard: {
    margin: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  bookingDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 13,
    color: '#666',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  addMethodForm: {
    padding: 16,
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  methodItemSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f7ff',
  },
  methodIcon: {
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  methodDetails: {
    fontSize: 12,
    color: '#999',
  },
  historyItem: {
    padding: 12,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  historyDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  legalText: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  legalTextSmall: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
});
