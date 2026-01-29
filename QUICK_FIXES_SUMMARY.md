# ⚡ QUICK START - Commandes Rapides

**Pour tester immédiatement après les corrections**

---

## 🚀 Démarrer Backend

```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Vous devriez voir:
# ✅ Connexion MongoDB réussie
# ✅ Admin account created: alaoscorty@gmail.com
# ✅ Admin account created: alaoservice1@gmail.com
# ✅ Admin account created: alaoempire1@gmail.com
# 🚀 Serveur démarré sur le port 3000
```

---

## 📱 Démarrer Frontend (Expo)

```bash
# Terminal 2: Frontend
cd frontend
npm install
npm start

# Presser 'a' pour Android (APK)
# ou 'i' pour iOS (si sur Mac)
# ou utiliser EAS Build:
```

---

## 🏗️ Build APK Production

```bash
cd frontend

# Option 1: EAS Build (recommandé)
eas build --platform android --profile preview

# Option 2: Build local
npx react-native run-android

# Option 3: Build via Expo
expo build:android
```

---

## 🧪 Tester les 5 Corrections

### 1️⃣ Tester Crash Avatar
```
1. Ouvrir l'app APK
2. Créer un compte (register)
3. Cliquer sur avatar en haut à gauche
✅ Doit afficher profile-settings sans crash
```

### 2️⃣ Tester Crash Messages
```
1. Home → Cliquer "Messages" (Actions Rapides)
✅ Doit ouvrir chat screen sans crash
```

### 3️⃣ Tester Profils Vides
```
1. Home → Cliquer "Chercher" (Actions Rapides)
✅ Doit afficher 10+ profils de prestataires
```

### 4️⃣ Tester Stats Manquantes
```
1. Home page
✅ Doit afficher:
   - Nombre de demandes
   - Nombre de favoris
   - Note moyenne
   - Demandes récentes
```

### 5️⃣ Tester Détail Profil Crash
```
1. Chercher → Cliquer sur un profil
✅ Doit afficher:
   - Photos
   - Nom, localisation, note
   - Services, tarifs
   - Avis clients
```

---

## 🔐 Tester Comptes Admin

```
Connexion Admin:
Email: alaoscorty@gmail.com
Password: 123456

Autres admin accounts:
- alaoservice1@gmail.com / 123456
- alaoempire1@gmail.com / 123456
```

---

## 📡 Tester Endpoints API

```bash
# Remplacer YOUR_TOKEN par un JWT valide

# ====== PROVIDER ROUTES ======
curl http://localhost:3000/api/providers/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

curl http://localhost:3000/api/providers/stats \
  -H "Authorization: Bearer YOUR_TOKEN"

curl http://localhost:3000/api/providers/requests \
  -H "Authorization: Bearer YOUR_TOKEN"

# ====== USER ROUTES ======
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"

curl http://localhost:3000/api/users/me/stats \
  -H "Authorization: Bearer YOUR_TOKEN"

curl http://localhost:3000/api/users/bookings \
  -H "Authorization: Bearer YOUR_TOKEN"

# ====== ADMIN ROUTES ======
curl http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"

curl http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN"

curl http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN"

# ====== HEALTH CHECK ======
curl http://localhost:3000/health
# Response: { "status": "OK", "uptime": 123.45, "timestamp": "..." }
```

---

## 🐛 Debugging Tips

### Si Crash au Démarrage App
```
1. Vérifier que ChatProvider est dans _layout.tsx
2. Vérifier que NotificationProvider est importé
3. Vérifier les logs console
4. Vérifier que backend est accessible
```

### Si Crash Avatar Click
```
1. Vérifier profile-settings.tsx a user ID check
2. Vérifier try/catch blocks
3. Vérifier que mutation utilise user?.id
```

### Si Profils Vides
```
1. Vérifier que API /profiles retourne données
2. Vérifier FlatList est bien initialisé
3. Vérifier que error handling retourne [] si erreur
4. Vérifier network tab pour API response
```

### Si Stats = 0
```
1. Vérifier que getUserStats() existe dans bookingService
2. Vérifier fallback values par défaut (0, 0, 0, 0)
3. Vérifier API /users/me/stats existe
```

### Si Messages Crash
```
1. Vérifier ChatProvider wraps entière app
2. Vérifier ChatContext.tsx existe et exporte
3. Vérifier useChat() hook existe
4. Vérifier Socket.IO connecté au backend
```

---

## 📊 Logs à Vérifier

### Backend Startup
```
✅ MONGODB CONNECTED
✅ ADMIN ACCOUNTS CREATED (x3)
✅ SOCKET.IO READY
🚀 SERVER STARTED ON PORT 3000
```

### Frontend Build
```
✅ METRO BUNDLER READY
✅ BUILD SUCCESSFUL
✅ APP RUNNING ON DEVICE
```

### APK Build
```
✅ BUILD COMPLETE
APK: /frontend/build/app-release.apk
```

---

## 🎯 Priority Test Order

```
1. FIRST: Test avatar crash (most critical)
2. SECOND: Test messages crash
3. THIRD: Test profiles empty
4. FOURTH: Test stats display
5. FIFTH: Test profile detail crash
6. BONUS: Test admin accounts
```

---

## 📱 Quick Device Testing

```bash
# Android (APK)
adb install app-release.apk
adb shell am start -n com.lovingapp/.MainActivity

# View logs
adb logcat | grep -i "error\|crash"

# iOS (if available)
xcrun simctl install booted app.app
xcrun simctl launch booted com.lovingapp
```

---

## ⚙️ Environment Check

```bash
# Vérifier Node.js
node --version  # Should be 16+

# Vérifier npm
npm --version   # Should be 8+

# Vérifier MongoDB connection
mongo $MONGODB_URI

# Vérifier ports
netstat -tuln | grep 3000    # Backend port
netstat -tuln | grep 8081    # Expo port
```

---

## 🔄 Restart Everything

```bash
# Kill all processes
pkill -f node
pkill -f expo
pkill -f react-native

# Or on Windows PowerShell:
Get-Process node | Stop-Process -Force
Get-Process expo | Stop-Process -Force

# Restart fresh
cd backend && npm run dev &
cd frontend && npm start
```

---

## 📋 Checklist Before Testing

- [ ] Backend running on port 3000
- [ ] Frontend running on Expo
- [ ] MongoDB connected (check logs)
- [ ] 3 admin accounts created (check logs)
- [ ] No TypeScript errors
- [ ] APK built and installed on device
- [ ] Device connected with adb (Android)
- [ ] Console open to see crash messages
- [ ] Network tab open to see API calls
- [ ] Backend accessible from device/emulator

---

## 🎉 Done!

Tout est prêt. Testez rapidement et reportez les problèmes.

**Session Date:** 29 janvier 2026  
**All Bugs Status:** Fixed ✅
