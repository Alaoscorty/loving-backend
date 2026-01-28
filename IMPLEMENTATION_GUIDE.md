# Guide d'Implémentation des Fonctionnalités Manquantes

## 🎯 Roadmap d'Implémentation

### Phase 1 : Fondations (Semaine 1-2)
**Objectif : Faire fonctionner les écrans de base**

#### ✅ Déjà Implémenté
- [x] Authentification (login/register)
- [x] Écrans utilisateur (home, favoris, réservations)
- [x] Écrans prestataire (dashboard, earnings, availability)
- [x] Écrans admin (dashboard, moderation)
- [x] Composants UI réutilisables
- [x] Services backend

#### ⏳ À Compléter Rapidement
- [ ] 1. **Page de Réservation** (`(user)/booking.tsx`)
  - Formulaire de sélection de dates
  - Confirmation des détails
  - Lien vers paiement
  
- [ ] 2. **Page de Paiement** (`(user)/payment.tsx`)
  - Intégration Stripe
  - Historique des paiements
  - Méthodes de paiement

- [ ] 3. **Chat en Temps Réel**
  - Configuration WebSocket (Socket.IO)
  - Notifications de nouveaux messages
  - Indicateur en ligne

---

### Phase 2 : Enrichissement (Semaine 3)
**Objectif : Améliorer l'UX et ajouter les fonctionnalités restantes**

#### À Implémenter
- [ ] 4. **Conversations** (`(user)/conversations-list.tsx`)
  - Liste des conversations
  - Recherche
  - Suppression de conversations

- [ ] 5. **Profil Utilisateur** (`(user)/profile.tsx`)
  - Infos personnelles
  - Paramètres
  - Méthodes de paiement

- [ ] 6. **Détails Réservation** (`(provider)/booking-detail.tsx`)
  - Vue complète de la réservation
  - Historique des messages
  - Actions (annuler, modifier)

- [ ] 7. **Paramètres Sécurité** (`(provider)/security.tsx`)
  - Changement de mot de passe
  - Authentification 2FA
  - Sessions actives

- [ ] 8. **Gestion Signalements** (`(admin)/reports.tsx`)
  - Liste des signalements
  - Détails
  - Actions (résoudre, archiver)

---

## 📋 Exemples d'Implémentation

### 1️⃣ Page de Réservation

```typescript
// frontend/app/(user)/booking.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import { Button, Card, Input, LoadingSpinner } from '@/components';
import { bookingService } from '@/services';

export default function BookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const providerId = params.providerId as string;

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDayPress = (day: any) => {
    // Logique pour sélectionner des dates
  };

  const handleBooking = async () => {
    try {
      setLoading(true);
      const booking = await bookingService.createBooking({
        providerId,
        startDate: selectedDates[0],
        endDate: selectedDates[selectedDates.length - 1],
        notes,
      });

      router.push({
        pathname: '/(user)/payment',
        params: { bookingId: booking.id },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Calendar onDayPress={handleDayPress} />
      <Card>
        <Input
          label="Notes supplémentaires"
          placeholder="Dites-en plus..."
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </Card>
      <Button
        title="Confirmer la réservation"
        onPress={handleBooking}
        loading={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
```

### 2️⃣ Page de Paiement (Stripe)

```typescript
// frontend/app/(user)/payment.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { CardField, useConfirmPayment } from '@stripe/react-native';
import { Button, Card } from '@/components';
import { paymentService } from '@/services';

export default function PaymentScreen() {
  const params = useLocalSearchParams();
  const bookingId = params.bookingId as string;
  const { confirmPayment } = useConfirmPayment();

  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState<any>(null);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // 1. Créer l'intention de paiement
      const paymentIntent = await paymentService.createPaymentIntent(
        bookingId,
        99.99 // À remplacer par le montant réel
      );

      // 2. Confirmer le paiement avec Stripe
      const { paymentIntent: confirmedPI } = await confirmPayment(
        paymentIntent.clientSecret,
        {
          type: 'Card',
          billingDetails: {
            email: 'user@example.com',
          },
        }
      );

      if (confirmedPI?.status === 'Succeeded') {
        Alert.alert('Succès', 'Paiement effectué avec succès!');
        // Redirection vers confirmation
      }
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors du paiement');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <CardField
          postalCodeEnabled={true}
          placeholders={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={styles.card}
          onCardChange={setCardDetails}
          dangerouslyGetFullCardDetails={true}
        />
      </Card>

      <Button
        title="Payer 99,99€"
        onPress={handlePayment}
        loading={loading}
        disabled={!cardDetails?.complete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { backgroundColor: '#f5f5f5' },
});
```

### 3️⃣ Chat avec Socket.IO

```typescript
// frontend/services/chatService.ts - À enrichir
import io from 'socket.io-client';

let socket: any = null;

export const initializeChat = (userId: string) => {
  socket = io(process.env.EXPO_PUBLIC_API_URL, {
    auth: {
      token: localStorage.getItem('authToken'),
    },
  });

  socket.on('connect', () => {
    console.log('Chat connected');
    socket.emit('user:join', { userId });
  });

  socket.on('message:new', (message: any) => {
    // Ajouter le message au contexte
    console.log('New message:', message);
  });

  return socket;
};

export const sendChatMessage = (conversationId: string, text: string) => {
  socket?.emit('message:send', { conversationId, text });
};

export const onNewMessage = (callback: (msg: any) => void) => {
  socket?.on('message:new', callback);
};
```

### 4️⃣ Conversations List

```typescript
// frontend/app/(user)/conversations-list.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { chatService } from '@/services';
import { Card, LoadingSpinner } from '@/components';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ConversationsScreen() {
  const router = useRouter();
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => chatService.getConversations(),
  });

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <ScrollView style={styles.container}>
      {conversations?.map((conv: any) => (
        <TouchableOpacity
          key={conv.id}
          onPress={() =>
            router.push({
              pathname: '/(user)/chat',
              params: { conversationId: conv.id },
            })
          }
        >
          <Card style={styles.conversationCard}>
            <View style={styles.header}>
              <View>
                <Text style={styles.name}>{conv.participantNames[0]}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {conv.lastMessage?.content || 'Pas de message'}
                </Text>
              </View>
              {conv.unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{conv.unreadCount}</Text>
                </View>
              )}
            </View>
          </Card>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  conversationCard: { marginBottom: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  name: { fontSize: 16, fontWeight: '700' },
  lastMessage: { fontSize: 13, color: '#6b7280' },
  badge: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontWeight: '600' },
});
```

---

## 🔌 Intégration Backend Requise

Pour que les services fonctionnent, le backend doit avoir les routes :

```javascript
// Backend - Routes requises
POST   /api/bookings              // Créer réservation
GET    /api/bookings/:id          // Détails réservation
PATCH  /api/bookings/:id          // Modifier réservation
POST   /api/payments/intent       // Créer intention paiement
POST   /api/payments/confirm      // Confirmer paiement
GET    /api/chat/conversations    // Lister conversations
GET    /api/chat/conversations/:id // Détails conversation
POST   /api/chat/conversations/:id/messages // Envoyer message
WebSocket /chat                   // Pour chat temps réel
```

Vérifiez que le backend implémente ces endpoints !

---

## 🚀 Prochaines Actions

1. **Installer les dépendances** (voir DEPENDENCIES.md)
2. **Implémenter la page de réservation**
3. **Ajouter intégration Stripe pour paiements**
4. **Configurer Socket.IO pour chat**
5. **Tester chaque écran**
6. **Déployer progressivement**

---

## 💬 Questions ?

- Vérifiez le code d'exemple dans `AUDIT_REPORT.md`
- Consultez les services dans `frontend/services/`
- Utilisez les composants de `frontend/components/`
