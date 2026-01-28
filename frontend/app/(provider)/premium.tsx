import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { providerService } from '@/services/providerService';

export default function PremiumScreen() {
  const queryClient = useQueryClient();

  const { data: premiumStatus } = useQuery({
    queryKey: ['premium-status'],
    queryFn: () => providerService.getPremiumStatus(),
  });

  const subscribeMutation = useMutation({
    mutationFn: (planId: string) => providerService.subscribePremium(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['premium-status'] });
    },
  });

  const plans = [
    {
      id: 'monthly',
      name: 'Premium Mensuel',
      price: 29.99,
      features: [
        'Mise en avant dans les résultats',
        'Badge Premium visible',
        'Statistiques avancées',
        'Support prioritaire',
      ],
    },
    {
      id: 'yearly',
      name: 'Premium Annuel',
      price: 299.99,
      originalPrice: 359.88,
      features: [
        'Tous les avantages Premium',
        'Économisez 17%',
        'Mise en avant prioritaire',
        'Badge Premium visible',
        'Statistiques avancées',
        'Support prioritaire',
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Abonnement Premium</Text>
        <Text style={styles.subtitle}>
          Boostez votre visibilité et augmentez vos réservations
        </Text>
      </View>

      {premiumStatus?.isPremium ? (
        <View style={styles.activeContainer}>
          <View style={styles.activeBadge}>
            <Text style={styles.activeText}>✓ Premium Actif</Text>
          </View>
          <Text style={styles.activeInfo}>
            Votre abonnement expire le {premiumStatus.expiresAt}
          </Text>
        </View>
      ) : (
        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <View key={plan.id} style={styles.planCard}>
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.priceContainer}>
                  {plan.originalPrice && (
                    <Text style={styles.originalPrice}>{plan.originalPrice}€</Text>
                  )}
                  <Text style={styles.price}>{plan.price}€</Text>
                  <Text style={styles.pricePeriod}>
                    /{plan.id === 'monthly' ? 'mois' : 'an'}
                  </Text>
                </View>
              </View>

              <View style={styles.featuresList}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Text style={styles.featureIcon}>✓</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.subscribeButton,
                  subscribeMutation.isPending && styles.buttonDisabled,
                ]}
                onPress={() => subscribeMutation.mutate(plan.id)}
                disabled={subscribeMutation.isPending}
              >
                {subscribeMutation.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.subscribeButtonText}>S'abonner</Text>
                )}
              </TouchableOpacity>
            </View>
          ))}
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
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#8b5cf6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e9d5ff',
  },
  activeContainer: {
    padding: 20,
    alignItems: 'center',
  },
  activeBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 16,
  },
  activeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  activeInfo: {
    fontSize: 16,
    color: '#666',
  },
  plansContainer: {
    padding: 20,
    gap: 20,
  },
  planCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#e5e5e5',
  },
  planHeader: {
    marginBottom: 20,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8b5cf6',
  },
  pricePeriod: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  featuresList: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 20,
    color: '#10b981',
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
