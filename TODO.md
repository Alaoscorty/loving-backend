

# Audit du Projet Loving - État Actuel ✅ COMPLÉTÉ

## ✅ IMPLÉMENTÉ

### Écrans Utilisateur
- [x] Favoris (favorites.tsx)
- [x] Calendrier de réservation (calendar.tsx)
- [x] Historique des réservations (bookings.tsx)
- [x] Annulation de réservation (cancel-booking.tsx)
- [x] Page d'avis et notes (reviews.tsx)
- [x] Écran d'accueil (home.tsx)

### Écrans Prestataire
- [x] Dashboard prestataire (dashboard.tsx)
- [x] Gestion du planning (availability.tsx)
- [x] Page des revenus (earnings.tsx)
- [x] Blocage d'utilisateurs (block-user.tsx)
- [x] Premium (premium.tsx)
- [x] Historique des réservations (bookings.tsx)

### Écrans Admin
- [x] Dashboard admin (dashboard.tsx)
- [x] Gestion des commissions (commissions.tsx)
- [x] Modération des avis (moderation.tsx)
- [x] Logs système (logs.tsx)
- [x] Gestion des profils (profiles.tsx)

### Authentification
- [x] Login (login.tsx)
- [x] Register (register.tsx)
- [x] Mot de passe oublié (forgot-password.tsx)
- [x] Vérification (verify.tsx)

### Services Backend
- [x] Service d'authentification (auth.controller.ts)
- [x] Middlewares de validation
- [x] Modèles de données (User, Booking, Profile, etc.)
- [x] Routage API

### Services Frontend
- [x] Service d'authentification (authService.ts)

---

## ✅ IMPLÉMENTÉS (Tâches Complétées)

### Écrans Utilisateur ✅
- [x] Liste des profils avec filtres → profiles-list.tsx
- [x] Détails d'un profil → profile-detail.tsx
- [x] Chat en temps réel → chat.tsx
- [x] Page de réservation/formulaire → reservation.tsx
- [x] Page de paiement → payment.tsx
- [x] Liste des conversations → conversations-list.tsx
- [x] Profil utilisateur/Paramètres → profile-settings.tsx
- [x] Accueil amélioré avec statistiques → home.tsx

### Écrans Prestataire ✅
- [x] Gestion du profil public/Édition → profile.tsx
- [x] Upload de photos → PhotoGallery.tsx
- [x] Liste des demandes → requests.tsx
- [x] Détails d'une réservation → booking-details.tsx
- [x] Paramètres de sécurité → security-settings.tsx

### Écrans Admin ✅
- [x] Liste des profils à valider → validate-profiles.tsx
- [x] Validation/Rejet de profils → validate-profiles.tsx
- [x] Dashboard avec statistiques avancées → advanced-dashboard.tsx
- [x] Gestion des utilisateurs → user-management.tsx
- [x] Gestion des signalements → reports.tsx

### Composants Réutilisables ✅
- [x] Composants UI (Button, Input, Card, etc.) → 9 composants
- [x] Composant notation/stars → StarRating.tsx
- [x] Composant filtres avancés → FilterBar.tsx
- [x] Composant galerie photos → PhotoGallery.tsx
- [x] Composant loader/spinner → LoadingSpinner.tsx
- [x] Composant modal/dialog → Modal.tsx
- [x] Composant toast/notification → Toast.tsx
- [x] Composant calendrier avancé → Calendar.tsx (NOUVEAU)

### Services Frontend ✅
- [x] apiClient.ts (client HTTP centralisé)
- [x] bookingService.ts
- [x] profileService.ts
- [x] paymentService.ts
- [x] chatService.ts
- [x] reviewService.ts
- [x] providerService.ts
- [x] adminService.ts
- [x] socketService.ts (Socket.IO temps réel - NOUVEAU)

### Contextes React ✅
- [x] AuthContext
- [x] NotificationContext
- [x] ChatContext

### Utilitaires Frontend ✅
- [x] formatters.ts (formatage date, devise, etc.)
- [x] validators.ts (validation formulaires)
- [x] errorHandler.ts (gestion des erreurs)

---

## � PROCHAINES ÉTAPES (Priorité)

### 🔴 CRITIQUE (Semaine 1-2)
- [ ] 1. Page de Réservation Complète
  - [ ] Formulaire de sélection de dates
  - [ ] Sélection d'options/services
  - [ ] Validation et confirmation
  - [ ] Lien vers paiement

- [ ] 2. Page de Paiement
  - [ ] Intégration Stripe
  - [ ] Gestion des méthodes de paiement
  - [ ] Confirmation et reçu
  - [ ] Historique des paiements

- [ ] 3. Chat Temps Réel Avancé
  - [ ] Configuration WebSocket (Socket.IO)
  - [ ] Notifications de messages
  - [ ] Indicateurs de statut en ligne
  - [ ] Historique des messages

### 🟠 IMPORTANT (Semaine 3)
- [ ] 4. Liste des Conversations
  - [ ] Affichage du dernier message
  - [ ] Compteur de messages non lus
  - [ ] Recherche et filtres
  - [ ] Suppression de conversations

- [ ] 5. Profil Utilisateur Complet
  - [ ] Édition des infos personnelles
  - [ ] Gestion des méthodes de paiement
  - [ ] Paramètres de notification
  - [ ] Données de compte

- [ ] 6. Détails Réservation (Provider)
  - [ ] Vue complète de la réservation
  - [ ] Historique des communications
  - [ ] Actions (confirmer, annuler, modifier)
  - [ ] Contact avec le client

### 🟡 MEDIUM (Semaine 4)
- [ ] 7. Paramètres Sécurité (Provider)
  - [ ] Changement de mot de passe
  - [ ] Authentification 2FA
  - [ ] Sessions actives
  - [ ] Connexions

- [ ] 8. Agenda Personnel (User)
  - [ ] Vue calendrier personnel
  - [ ] Historique des activités
  - [ ] Synchronisation avec réservations
  - [ ] Rappels et notifications

- [ ] 9. Gestion Signalements (Admin)
  - [ ] Liste des signalements
  - [ ] Détails et preuves
  - [ ] Actions (résoudre, archiver, sanctions)
  - [ ] Historique

### 🟢 NICE-TO-HAVE (v1.1+)
- [ ] Notifications Push
- [ ] Système de Recommandations IA
- [ ] Statistiques Avancées Admin
- [ ] Exportation de Données
- [ ] Multi-langue Support

---

## 📊 STATISTIQUES D'IMPLÉMENTATION

**Date de l'Audit:** 25 Janvier 2026

| Catégorie | Implémenté | Total | % |
|-----------|-----------|-------|---|
| Composants | 9 | 9 | ✅ 100% |
| Services | 8 | 8 | ✅ 100% |
| Contextes | 3 | 3 | ✅ 100% |
| Utilitaires | 3 | 3 | ✅ 100% |
| Écrans Utilisateur | 3 | 8 | 38% |
| Écrans Prestataire | 3 | 6 | 50% |
| Écrans Admin | 2 | 5 | 40% |
| **TOTAL** | **31** | **41** | **76%** |

---

## 📝 NOTES IMPORTANTES

✅ **COMPLÉTÉ:**
- Architecture modulaire créée (33 fichiers)
- Base de composants réutilisables (9 composants)
- Services frontend complets (8 services)
- Contextes pour gestion d'état (3 contextes)
- Utilitaires pour validation et formatage
- Écrans d'exemple fonctionnels (6 écrans)
- Documentation complète (8 documents)

⏳ **EN ATTENTE:**
- Implémentation des écrans critiques (réservation, paiement)
- Intégration WebSocket pour chat temps réel
- Intégration Stripe pour paiements
- Écrans de support utilisateur/profil
- Gestion des signalements admin
- Optimisations et tests

🔧 **BACKEND:**
- Le backend possède une structure solide avec controllers, routes et modèles
- Besoin de vérifier que tous les endpoints API sont implémentés
- Configuration WebSocket requise pour chat

🎨 **FRONTEND:**
- Le frontend utilise Expo Router pour la navigation
- React Query est implémenté pour la gestion d'état
- TypeScript 100% typé pour sécurité
- Composants réutilisables et testables créés

---

## 📚 DOCUMENTATION

Tous les guides et documents sont disponibles:
- ✅ AUDIT_REPORT.md - Rapport détaillé
- ✅ IMPLEMENTATION_GUIDE.md - Guide avec exemples
- ✅ DEPENDENCIES.md - Installation des dépendances
- ✅ NAVIGATION.md - Guide de structure
- ✅ QUICK_REFERENCE.md - Résumé visuel
- ✅ COMMANDS.md - Commandes utiles
- ✅ CHECKLIST.md - Checklist de tracking
- ✅ INDEX.md - Index complet

Consultez INDEX.md pour une navigation rapide !

MÉTHODE ALTERNATIVE (LOCAL – PLUS COMPLIQUÉE)

⚠️ Uniquement si tu insistes

npx expo prebuild
cd android
./gradlew assembleRelease


APK ici :

android/app/build/outputs/apk/release/app-release.apk


👉 MAIS : Java, Gradle, Android SDK doivent être parfaitement configurés
➡️ Je ne la recommande pas pour toi maintenant

Running application "main" with appParams:
 {rootTag: '#root', hydrate: false} 
Development-level warnings: ON.
Performance optimizations: OFF.
C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-native-web\dist\modules\warnOnce\index.js:26  "shadow*" style props are deprecated. Use "boxShadow".
warnOnce @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-native-web\dist\modules\warnOnce\index.js:26
preprocess @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-native-web\dist\exports\StyleSheet\preprocess.js:115
compileAndInsertAtomic @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-native-web\dist\exports\StyleSheet\index.js:58
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-native-web\dist\exports\StyleSheet\index.js:101
create @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-native-web\dist\exports\StyleSheet\index.js:89
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\app\(admin)\logs.tsx:142
loadModuleImplementation @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\metro-runtime\src\polyfills\require.js:286
guardedLoadModule @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\metro-runtime\src\polyfills\require.js:186
metroRequire @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\metro-runtime\src\polyfills\require.js:94
get @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\app:7
metroContext @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\app:49
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\expo-router\build\getRoutes.js:215
contextModuleToFileNodes @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\expo-router\build\getRoutes.js:207
contextModuleToTree @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\expo-router\build\getRoutes.js:397
getExactRoutesInternal @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\expo-router\build\getRoutes.js:379
getRoutes @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\expo-router\build\getRoutes.js:286
initialize @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\expo-router\build\global-state\router-store.js:76
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\expo-router\build\global-state\router-store.js:213
mountMemo @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:17227
useMemo @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:17672
useMemo @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react\cjs\react.development.js:1652
useInitializeExpoRouter @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\expo-router\build\global-state\router-store.js:212
ContextNavigator @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\expo-router\build\ExpoRoot.js:73
renderWithHooks @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:16307
mountIndeterminateComponent @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:20076
beginWork @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:21590
beginWork$1 @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:27428
performUnitOfWork @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:26559
workLoopSync @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:26468
renderRootSync @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:26436
performConcurrentWorkOnRoot @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:25741
workLoop @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\node_modules\scheduler\cjs\scheduler.development.js:269
flushWork @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\node_modules\scheduler\cjs\scheduler.development.js:241
performWorkUntilDeadline @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\node_modules\scheduler\cjs\scheduler.development.js:535
[NEW] Explain Console errors by using Copilot in Edge: click
         
         to explain an error. 
        Learn more
        Don't show again
C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@expo\metro-runtime\build\error-overlay\LogBox.web.js:98  Erreur lors du chargement des données d'authentification: TypeError: _ExpoSecureStore.default.getValueWithKeyAsync is not a function
    at Object.<anonymous> (C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\expo-secure-store\build\SecureStore.js:85:2)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:5:15)
    at _next (C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:19:7)
    at C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:24:4
    at new Promise (<anonymous>)
    at Object.<anonymous> (C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:16:7)
    at Object._getItemAsync (C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\expo-secure-store\build\SecureStore.js:96:35)
    at Object.getItemAsync (C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\expo-secure-store\build\SecureStore.js:87:1)
    at C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\contexts\AuthContext.tsx:47:38
registerError @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@expo\metro-runtime\build\error-overlay\LogBox.web.js:98
console.error @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@expo\metro-runtime\build\error-overlay\LogBox.web.js:37
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\contexts\AuthContext.tsx:62
asyncGeneratorStep @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:5
_throw @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:22
Promise.then
asyncGeneratorStep @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:10
_next @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:19
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:24
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:16
loadAuthData @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\contexts\AuthContext.tsx:64
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\contexts\AuthContext.tsx:42
commitHookEffectListMount @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:23153
commitPassiveMountOnFiber @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:24928
commitPassiveMountEffects_complete @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:24893
commitPassiveMountEffects_begin @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:24880
commitPassiveMountEffects @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:24869
flushPassiveEffectsImpl @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:27041
flushPassiveEffects @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:26986
performSyncWorkOnRoot @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:26079
flushSyncCallbacks @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:12044
commitRootImpl @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:26961
commitRoot @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:26684
finishConcurrentRender @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:25983
performConcurrentWorkOnRoot @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:25811
workLoop @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\node_modules\scheduler\cjs\scheduler.development.js:269
flushWork @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\node_modules\scheduler\cjs\scheduler.development.js:241
performWorkUntilDeadline @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\node_modules\scheduler\cjs\scheduler.development.js:535
C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-native-web\dist\modules\warnOnce\index.js:26  props.pointerEvents is deprecated. Use style.pointerEvents
warnOnce @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-native-web\dist\modules\warnOnce\index.js:26
createDOMProps @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-native-web\dist\modules\createDOMProps\index.js:807
createElement @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-native-web\dist\exports\createElement\index.js:24
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-native-web\dist\exports\View\index.js:113
renderWithHooks @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:16307
updateForwardRef @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:19229
beginWork @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:21639
beginWork$1 @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:27428
performUnitOfWork @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:26559
workLoopSync @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:26468
renderRootSync @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:26436
performSyncWorkOnRoot @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:26088
flushSyncCallbacks @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:12044
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:25653
C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\adapters\xhr.js:200   POST http://localhost:5000/api/auth/register net::ERR_CONNECTION_REFUSED
dispatchXhrRequest @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\adapters\xhr.js:200
xhr @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\adapters\xhr.js:17
dispatchRequest @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\core\dispatchRequest.js:52
Promise.then
_request @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\core\Axios.js:166
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\core\Axios.js:42
asyncGeneratorStep @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:5
_next @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:19
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:24
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:16
request @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\core\Axios.js:38
httpMethod @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\core\Axios.js:226
wrap @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\helpers\bind.js:14
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\services\authService.ts:75
asyncGeneratorStep @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:5
_next @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:19
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:24
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:16
register @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\services\authService.ts:78
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\app\(auth)\register.tsx:53
asyncGeneratorStep @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:5
_next @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:19
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:24
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:16
handleRegister @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\app\(auth)\register.tsx:74
onClick @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-native-web\dist\modules\usePressEvents\PressResponder.js:316
callCallback @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:4166
invokeGuardedCallbackDev @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:4216
invokeGuardedCallback @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:4279
invokeGuardedCallbackAndCatchFirstError @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:4294
executeDispatch @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:9043
processDispatchQueueItemsInOrder @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:9075
processDispatchQueue @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:9087
dispatchEventsForPlugins @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:9100
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:9290
batchedUpdates$1 @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:26142
batchedUpdates @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:3993
dispatchEventForPluginEventSystem @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:9289
dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:6467
dispatchEvent @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:6459
dispatchDiscreteEvent @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:6432
C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\adapters\xhr.js:200   POST http://localhost:5000/api/auth/login net::ERR_CONNECTION_REFUSED
dispatchXhrRequest @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\adapters\xhr.js:200
xhr @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\adapters\xhr.js:17
dispatchRequest @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\core\dispatchRequest.js:52
Promise.then
_request @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\core\Axios.js:166
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\core\Axios.js:42
asyncGeneratorStep @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:5
_next @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:19
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:24
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:16
request @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\core\Axios.js:38
httpMethod @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\core\Axios.js:226
wrap @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\helpers\bind.js:14
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\services\authService.ts:79
asyncGeneratorStep @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:5
_next @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:19
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:24
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:16
login @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\services\authService.ts:83
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\app\(auth)\login.tsx:34
asyncGeneratorStep @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:5
_next @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:19
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:24
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:16
handleLogin @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\app\(auth)\login.tsx:47
onClick @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-native-web\dist\modules\usePressEvents\PressResponder.js:316
callCallback @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:4166
invokeGuardedCallbackDev @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:4216
invokeGuardedCallback @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:4279
invokeGuardedCallbackAndCatchFirstError @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:4294
executeDispatch @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:9043
processDispatchQueueItemsInOrder @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:9075
processDispatchQueue @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:9087
dispatchEventsForPlugins @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:9100
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:9290
batchedUpdates$1 @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:26142
batchedUpdates @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:3993
dispatchEventForPluginEventSystem @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:9289
dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:6467
dispatchEvent @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:6459
dispatchDiscreteEvent @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:6432
C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\adapters\xhr.js:200   POST http://localhost:5000/api/auth/login net::ERR_CONNECTION_REFUSED
dispatchXhrRequest @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\adapters\xhr.js:200
xhr @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\adapters\xhr.js:17
dispatchRequest @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\core\dispatchRequest.js:52
Promise.then
_request @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\core\Axios.js:166
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\core\Axios.js:42
asyncGeneratorStep @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:5
_next @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:19
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:24
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:16
request @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\core\Axios.js:38
httpMethod @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\core\Axios.js:226
wrap @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\helpers\bind.js:14
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\services\authService.ts:79
asyncGeneratorStep @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:5
_next @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:19
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:24
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:16
login @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\services\authService.ts:83
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\app\(auth)\login.tsx:34
asyncGeneratorStep @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:5
_next @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:19
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:24
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:16
handleLogin @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\app\(auth)\login.tsx:47
onClick @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-native-web\dist\modules\usePressEvents\PressResponder.js:316
callCallback @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:4166
invokeGuardedCallbackDev @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:4216
invokeGuardedCallback @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:4279
invokeGuardedCallbackAndCatchFirstError @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:4294
executeDispatch @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:9043
processDispatchQueueItemsInOrder @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:9075
processDispatchQueue @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:9087
dispatchEventsForPlugins @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:9100
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:9290
batchedUpdates$1 @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:26142
batchedUpdates @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:3993
dispatchEventForPluginEventSystem @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:9289
dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:6467
dispatchEvent @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:6459
dispatchDiscreteEvent @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:6432
C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\adapters\xhr.js:200   POST http://localhost:5000/api/auth/login net::ERR_CONNECTION_REFUSED
dispatchXhrRequest @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\adapters\xhr.js:200
xhr @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\adapters\xhr.js:17
dispatchRequest @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\core\dispatchRequest.js:52
Promise.then
_request @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\core\Axios.js:166
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\core\Axios.js:42
asyncGeneratorStep @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:5
_next @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:19
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:24
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:16
request @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\core\Axios.js:38
httpMethod @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\core\Axios.js:226
wrap @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\helpers\bind.js:14
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\services\authService.ts:79
asyncGeneratorStep @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:5
_next @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:19
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:24
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:16
login @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\services\authService.ts:83
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\app\(auth)\login.tsx:34
asyncGeneratorStep @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:5
_next @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:19
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:24
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@babel\runtime\helpers\asyncToGenerator.js:16
handleLogin @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\app\(auth)\login.tsx:47
onClick @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-native-web\dist\modules\usePressEvents\PressResponder.js:316
callCallback @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:4166
invokeGuardedCallbackDev @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:4216
invokeGuardedCallback @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:4279
invokeGuardedCallbackAndCatchFirstError @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:4294
executeDispatch @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:9043
processDispatchQueueItemsInOrder @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:9075
processDispatchQueue @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:9087
dispatchEventsForPlugins @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:9100
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:9290
batchedUpdates$1 @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:26142
batchedUpdates @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:3993
dispatchEventForPluginEventSystem @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:9289
dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:6467
dispatchEvent @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:6459
dispatchDiscreteEvent @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\react-dom\cjs\react-dom.development.js:6432
C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@expo\metro-runtime\build\HMRClient.js:228  Disconnected from Metro (1006: "").

To reconnect:
- Ensure that Metro is running and available on the same network
- Reload this app (will trigger further help if Metro cannot be connected to)
      
setHMRUnavailableReason @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@expo\metro-runtime\build\HMRClient.js:228
(anonymous) @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\@expo\metro-runtime\build\HMRClient.js:200
emit @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\metro-runtime\src\modules\vendor\eventemitter3.js:81
HMRClient._this._ws.onclose @ C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\metro-runtime\src\modules\HMRClient.js:35
C:\Users\creationapplication\Appliconfirmer\Arefait\reussit\Loving\frontend\node_modules\axios\lib\adapters\xhr.js:200   POST http://localhost:5000/api/auth/login net::ERR_CONNECTION_REFUSED