# ⚡ Quick Start - Loving App

## 🚀 Démarrage Rapide (5 minutes)

### 1️⃣ Installation (1 min)

```bash
cd frontend
npm install --legacy-peer-deps
```

### 2️⃣ Vérification (1 min)

```bash
npx tsc --noEmit
```

Devrait afficher: `0 errors`

### 3️⃣ Backend (1 min)

```bash
cd ../backend
npm start
```

Devrait afficher: `Server running on port 3000`

### 4️⃣ Démarrage du Frontend (1 min)

Dans un nouveau terminal:

```bash
cd frontend
npm start
# ou
expo start
```

### 5️⃣ Test sur Device (1 min)

Depuis le terminal Expo:

```
i  → iOS (simulateur)
a  → Android (émulateur)
w  → Web
j  → Debug (DevTools)
```

---

## 🧪 Tests Rapides

### Test 1: Login Fonctionne?

```bash
# Terminal
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"Test123!"}'

# Devrait retourner un token
```

### Test 2: Socket.IO Connecté?

```typescript
// Dans un terminal Node.js
const io = require('socket.io-client');
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('✅ Connecté au serveur');
});
```

### Test 3: TypeScript OK?

```bash
npx tsc --noEmit
# Devrait afficher: 0 errors
```

### Test 4: Build APK?

```bash
eas build --platform android --local
# ou
expo build:android
```

---

## 📝 Commandes Essentielles

### Développement

```bash
# Démarrer le serveur
npm start

# Démarrer avec clearing cache
npm start -- --clear

# Démarrer en mode Tunnel (pour les appareils physiques)
expo start --tunnel

# Démarrer le web
npm start -- --web

# Tests
npm test

# TypeScript checking
npx tsc --noEmit

# Linting
npm run lint
```

### Backend

```bash
# Démarrer le serveur
npm start

# Démarrer en développement (avec nodemon)
npm run dev

# Compiler TypeScript
npm run build

# Voir les logs
npm run logs

# Arrêter le serveur
npm stop
```

### Build & Deploy

```bash
# Build Expo (Android)
eas build --platform android

# Build Expo (iOS)
eas build --platform ios

# Build local
expo build:android

# Générer APK directement
eas build --platform android --local

# Preview (sans publier)
eas build --platform android --profile preview

# Production
eas build --platform android --profile production
```

---

## 🔑 Comptes de Test

### Utilisateur Standard
```
Email: user@test.com
Mot de passe: Test123!
Rôle: USER
```

### Prestataire
```
Email: provider@test.com
Mot de passe: Test123!
Rôle: PROVIDER
```

### Administrateur
```
Email: admin@test.com
Mot de passe: Test123!
Rôle: ADMIN
```

---

## 🐛 Dépannage Rapide

### Erreur: "Cannot find module"

```bash
npm install --legacy-peer-deps
rm -rf node_modules package-lock.json
npm install
```

### Erreur: "Port already in use"

```bash
# Trouver et tuer le process
lsof -i :3000
kill -9 <PID>

# Ou changer le port
PORT=3001 npm start
```

### Erreur: "Module compilation failed"

```bash
npx tsc --noEmit
# Vérifier les erreurs TypeScript et corriger
```

### Erreur: "Socket.IO connection failed"

```bash
# Vérifier que le backend tourne
curl http://localhost:3000

# Vérifier les logs du backend
npm run logs

# Redémarrer
npm stop
npm start
```

### Erreur: "async-storage not found"

```bash
npm install @react-native-async-storage/async-storage --legacy-peer-deps
```

---

## 📊 Structure Complète

```
Loving/
├── frontend/              # React Native + Expo
│   ├── app/
│   │   ├── (user)/       # 8 screens utilisateur
│   │   ├── (provider)/   # 5 screens prestataire
│   │   ├── (admin)/      # 5 screens admin
│   │   └── (auth)/       # 4 screens authentification
│   ├── components/        # 10 composants réutilisables
│   ├── services/          # 9 services API
│   ├── contexts/          # 3 contextes global state
│   ├── utils/             # 3 utilitaires
│   ├── types/             # Définitions TypeScript
│   └── constants/         # Config et constantes
│
├── backend/               # Node.js + Express
│   ├── src/
│   │   ├── controllers/   # Logique métier
│   │   ├── models/        # Schémas MongoDB
│   │   ├── routes/        # Endpoints API
│   │   ├── middlewares/   # Auth, validation, etc
│   │   ├── services/      # Logique réutilisable
│   │   ├── sockets/       # Socket.IO handlers
│   │   ├── utils/         # Helpers
│   │   └── server.ts      # Entry point
│   └── package.json
│
└── Documentation/
    ├── README.md
    ├── API_DOCUMENTATION.md
    ├── QUICK_START.md
    ├── VERIFICATION_CHECKLIST.md
    ├── INTEGRATION_GUIDE.md
    ├── TESTING_GUIDE.md
    └── DEPLOYMENT.md
```

---

## ✅ Checklist Pré-Déploiement

- [ ] `npm install --legacy-peer-deps` réussi
- [ ] `npx tsc --noEmit` retourne 0 errors
- [ ] Backend tourne: `http://localhost:3000`
- [ ] Socket.IO connecté: logs visibles
- [ ] `expo start` fonctionne
- [ ] L'app se lance sur l'appareil
- [ ] Login fonctionne
- [ ] Chat temps réel fonctionne
- [ ] Paiement Stripe fonctionne
- [ ] Tous les écrans testés manuellement

---

## 🔗 Liens Importants

### Documentation Officielle
- [Expo Docs](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Expo Router](https://expo.github.io/router)
- [Tanstack React Query](https://tanstack.com/query)

### Services Intégrés
- [Socket.IO](https://socket.io)
- [Stripe](https://stripe.com)
- [Firebase](https://firebase.google.com)

### Outils
- [Expo CLI](https://docs.expo.dev/more/expo-cli)
- [TypeScript](https://www.typescriptlang.org)
- [VS Code Extensions](https://code.visualstudio.com/docs/editor/extension-gallery)

---

## 📞 Support

### Si ça ne marche pas:

1. **Logs du Backend**
   ```bash
   npm run logs
   ```

2. **Logs du Frontend**
   ```bash
   expo start --verbose
   ```

3. **Vérifier TypeScript**
   ```bash
   npx tsc --noEmit
   ```

4. **Nettoyer et réinstaller**
   ```bash
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

5. **Redémarrer tout**
   ```bash
   # Backend
   npm stop && npm start
   
   # Frontend (nouveau terminal)
   npm start --clear
   ```

---

## 🎉 C'est prêt!

L'application est **100% implémentée** et prête pour:

✅ Tester en développement  
✅ Générer un APK avec Expo  
✅ Déployer en production  
✅ Maintenir et évoluer  

**Bon développement! 🚀**

---

*Dernière mise à jour: 25 Janvier 2026*  
*Version: 1.0.0 - Beta Ready*
