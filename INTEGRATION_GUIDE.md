# 🔧 Guide Complet d'Intégration - Loving App

## Table des Matières
1. [Installation des Dépendances](#installation)
2. [Vérification de la Compilation](#compilation)
3. [Configuration du Backend](#backend)
4. [Tests d'Intégration](#tests)
5. [Dépannage](#dépannage)
6. [Déploiement](#déploiement)

---

## 📦 Installation des Dépendances {#installation}

### Étape 1: Installer les Dépendances de Base

```bash
cd frontend
npm install --legacy-peer-deps
```

### Étape 2: Vérifier les Dépendances Requises

Le fichier `package.json` DOIT contenir:

```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.71.8",
    "expo": "^49.0.0",
    "expo-router": "^2.0.0",
    "@react-navigation/native": "^6.0.0",
    "@react-navigation/bottom-tabs": "^6.0.0",
    "@tanstack/react-query": "^4.29.0",
    "axios": "^1.4.0",
    "react-native-async-storage": "^1.0.0",
    "@react-native-async-storage/async-storage": "^1.17.0",
    "date-fns": "^2.30.0",
    "typescript": "^5.1.3",
    "@react-native-community/datetimepicker": "^6.7.0",
    "react-native-chart-kit": "^6.12.0",
    "socket.io-client": "^4.5.4",
    "react-native-material-design-icons": "^0.0.17",
    "@react-native-community/hooks": "^3.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-native": "^0.71.0",
    "@typescript-eslint/eslint-plugin": "^5.0.0",
    "@typescript-eslint/parser": "^5.0.0",
    "eslint": "^8.0.0"
  }
}
```

### Étape 3: Installer les Dépendances Manquantes (si nécessaire)

```bash
# Socket.IO pour le chat temps réel
npm install socket.io-client@4.5.4

# DateTimePicker pour les réservations
npm install @react-native-community/datetimepicker@6.7.0

# Charts pour le dashboard admin
npm install react-native-chart-kit@6.12.0

# Icons Material Design
npm install react-native-material-design-icons

# Hooks utilitaires
npm install @react-native-community/hooks
```

---

## ✅ Vérification de la Compilation {#compilation}

### Étape 1: Vérifier les Erreurs TypeScript

```bash
cd frontend
npx tsc --noEmit
```

**Résultat attendu:** `0 errors` 

Si des erreurs apparaissent:
- Vérifier que tous les imports sont corrects
- Vérifier que les types sont définis dans `types/index.ts`
- Vérifier que les chemins relatifs existent

### Étape 2: Vérifier les Imports/Exports

```bash
# Vérifier que tous les fichiers compilent
expo prebuild

# Ou exécuter la vérification personnalisée
chmod +x verify.sh && ./verify.sh
```

### Étape 3: Tester le Démarrage

```bash
# Démarrer le serveur de développement
expo start

# Dans le terminal, appuyer sur:
# 'i' pour iOS
# 'a' pour Android
# 'w' pour Web
```

---

## 🔌 Configuration du Backend {#backend}

### Socket.IO Configuration

Le backend DOIT avoir la configuration suivante:

```javascript
// backend/src/server.ts
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:19000", // Expo tunnel
    methods: ["GET", "POST"]
  }
});

// Middleware d'authentification
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    // Valider le token JWT
    next();
  } else {
    next(new Error("Authentication required"));
  }
});

// Événements de chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Réception des messages
  socket.on('message:send', (data) => {
    socket.to(data.conversationId).emit('message:received', data);
  });

  // Indicateur de frappe
  socket.on('user:typing', (data) => {
    socket.to(data.conversationId).emit('user:typing', data);
  });

  // Statut en ligne
  socket.on('user:online', (userId) => {
    io.emit('user:online', userId);
  });

  // Déconnexion
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
```

### API Endpoints Requis

Tous les endpoints suivants DOIVENT être implémentés au backend:

#### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `POST /api/auth/forgot-password` - Mot de passe oublié
- `POST /api/auth/verify` - Vérification
- `POST /api/auth/refresh` - Renouvellement du token

#### Profils
- `GET /api/profiles` - Liste des profils
- `GET /api/profiles/:id` - Détail d'un profil
- `PUT /api/profiles/:id` - Mise à jour du profil
- `GET /api/profiles/suggestions` - Suggestions

#### Réservations
- `POST /api/bookings` - Créer une réservation
- `GET /api/bookings` - Liste des réservations
- `GET /api/bookings/:id` - Détail d'une réservation
- `PUT /api/bookings/:id/status` - Mettre à jour le statut
- `DELETE /api/bookings/:id` - Annuler une réservation

#### Paiements
- `POST /api/payments` - Créer un paiement
- `GET /api/payments` - Historique des paiements
- `POST /api/payment-methods` - Ajouter une méthode
- `GET /api/payment-methods` - Lister les méthodes

#### Chat
- `GET /api/conversations` - Liste des conversations
- `GET /api/conversations/:id` - Détail d'une conversation
- `POST /api/messages` - Envoyer un message
- `GET /api/messages/:conversationId` - Historique des messages

#### Admin
- `GET /api/admin/dashboard` - Statistiques
- `GET /api/admin/users` - Liste des utilisateurs
- `PUT /api/admin/users/:id` - Mettre à jour un utilisateur
- `GET /api/admin/reports` - Liste des signalements
- `PUT /api/admin/reports/:id` - Mettre à jour un signalement

---

## 🧪 Tests d'Intégration {#tests}

### Test 1: Authentification

```typescript
// Tester la connexion
import { authService } from '../services';

const result = await authService.login(
  'test@example.com',
  'password123'
);

// Vérifier que le token est stocké
const token = await AsyncStorage.getItem('authToken');
console.log('Token stocké:', !!token);
```

### Test 2: Récupération des Profils

```typescript
import { profileService } from '../services';

const profiles = await profileService.getProfiles();
console.log('Profils récupérés:', profiles.length);
```

### Test 3: Socket.IO Connection

```typescript
import socketService from '../services/socketService';

socketService.connect('user-123');

socketService.on('message:received', (message) => {
  console.log('Message reçu:', message);
});

socketService.sendMessage({
  conversationId: '123',
  content: 'Hello!',
  senderId: 'user-456'
});
```

### Test 4: Réservation Complète

```typescript
import { bookingService } from '../services';

// Créer une réservation
const booking = await bookingService.createBooking({
  providerId: 'provider-123',
  startDate: new Date(),
  endDate: new Date(Date.now() + 86400000),
  price: 150
});

// Vérifier le statut
console.log('Réservation créée:', booking.id, booking.status);
```

### Test 5: Paiement Stripe

```typescript
import { paymentService } from '../services';

// Créer un paiement
const payment = await paymentService.createPayment({
  amount: 150,
  currency: 'EUR',
  bookingId: 'booking-123',
  paymentMethodId: 'pm_123'
});

// Vérifier le résultat
console.log('Paiement créé:', payment.id, payment.status);
```

---

## 🐛 Dépannage {#dépannage}

### Problème: npm install échoue

**Symptôme:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE could not resolve dependencies
```

**Solution:**
```bash
npm install --legacy-peer-deps
# ou
npm install --force
# ou
rm -rf node_modules package-lock.json
npm install
```

### Problème: Erreurs TypeScript après compilation

**Symptôme:**
```
error TS2307: Cannot find module 'some-module'
```

**Solutions:**
```bash
# 1. Vérifier que le module est installé
npm list some-module

# 2. Installer les types si disponibles
npm install --save-dev @types/some-module

# 3. Ajouter le chemin au tsconfig.json
```

### Problème: Socket.IO ne se connecte pas

**Symptôme:**
```
Socket connection failed
Error: Authentication required
```

**Solution:**
```typescript
// Dans socketService.ts, vérifier le token
const token = await AsyncStorage.getItem('authToken');
socketService.connect(userId, token); // Passer le token

// Au backend, logger les connexions
io.use((socket, next) => {
  console.log('Auth token:', socket.handshake.auth.token);
});
```

### Problème: Erreur "Module not found" à la compilation

**Solution:**
```bash
# Vérifier que le fichier existe
ls -la frontend/path/to/file.ts

# Vérifier les chemins d'import
grep -r "from.*path" frontend/app/(user)/

# Fixer les chemins relatifs
# ❌ Mauvais: from '@/components'
# ✅ Bon: from '../../../components'
```

### Problème: DateTimePicker ne fonctionne pas

**Symptôme:**
```
Module not found: 'react-native-datetimepicker'
```

**Solution:**
```bash
npm install @react-native-community/datetimepicker@6.7.0 --legacy-peer-deps
```

### Problème: Charts ne s'affichent pas

**Symptôme:**
```
Module not found: 'react-native-chart-kit'
```

**Solution:**
```bash
npm install react-native-chart-kit@6.12.0 --legacy-peer-deps
```

### Problème: AsyncStorage non disponible

**Symptôme:**
```
TypeError: Cannot read property 'getItem' of undefined
```

**Solution:**
```bash
npm install @react-native-async-storage/async-storage@1.17.0
```

### Problème: Images ne s'affichent pas

**Solution:**
```typescript
// Vérifier que les images sont accessibles
import { Image } from 'react-native';

// Utiliser des URIs correctes
<Image
  source={{ uri: 'http://example.com/image.png' }}
  style={{ width: 100, height: 100 }}
/>

// Pour les images locales
import photo from '../assets/photo.png';
<Image source={photo} style={{ width: 100, height: 100 }} />
```

---

## 🚀 Déploiement {#déploiement}

### Déploiement sur Android via Expo

```bash
# 1. Créer un compte Expo
expo login

# 2. Configurer le build
eas build --platform android

# 3. Générer l'APK
eas build --platform android --local

# 4. Installer sur le téléphone
adb install path/to/app.apk
```

### Déploiement sur iOS via Expo

```bash
# 1. Générer le build
eas build --platform ios

# 2. Télécharger le fichier .ipa
# (Disponible sur le dashboard Expo)

# 3. Installer via Xcode ou Testflight
```

### Checklist Pré-Déploiement

- [ ] Tous les imports compilent sans erreurs
- [ ] Socket.IO se connecte avec succès
- [ ] Les paiements Stripe fonctionnent
- [ ] Les notifications push fonctionnent
- [ ] Les images se chargent rapidement
- [ ] La performance est acceptable (< 2s de chargement)
- [ ] Pas de logs d'erreur dans la console
- [ ] Tous les écrans sont testés manuellement
- [ ] Les formulaires valident correctement
- [ ] Les tokens expirent et se renouvellent

### Performance Checklist

```typescript
// Optimisation des imports
import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

// Utiliser les hooks de performance
const memoizedData = useMemo(() => computeExpensive(), [deps]);
const memoizedCallback = useCallback(() => handleEvent(), [deps]);

// Lazy load les écrans
const Profile = lazy(() => import('./Profile'));

// Virtualiser les listes longues
import { FlatList, VirtualizedList } from 'react-native';
```

---

## 📞 Support et Dépannage Avancé

### Logs et Debugging

```bash
# Voir les logs React Native
expo start --clear

# Logs du bundle
expo start --verbose

# Logs du device
adb logcat | grep React

# Logs du backend
pm2 logs backend
```

### Monitoring en Production

- Utiliser Sentry pour les crash reports
- Configurer Firebase Analytics
- Mettre en place des alertes d'erreurs
- Monitorer les performances avec React DevTools

---

**Dernière mise à jour:** 25 Janvier 2026  
**Version:** 1.0.0 - Beta Ready
