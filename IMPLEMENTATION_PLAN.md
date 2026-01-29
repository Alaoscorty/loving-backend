# Plan d'implémentation complète

## 🔴 BUGS CRITIQUES À CORRIGER (Priorité 1)

### ✅ 1. Chat crash - ChatProvider non fourni
- **Fichier:** `frontend/app/_layout.tsx`
- **Status:** ✅ FIXÉ - ChatProvider ajouté au layout root

### 2. Profile Avatar crash
- **Fichier:** `frontend/app/(user)/profile-settings.tsx`
- **Problème:** Pas de vérification si profile existe avant rendu
- **Status:** À corriger

### 3. Profile list vide - données non affichées
- **Fichier:** `frontend/app/(user)/profiles-list.tsx`
- **Problème:** Les utilisateurs ne s'affichent pas, pas responsive
- **Status:** À corriger

### 4. Stats n'affichent rien
- **Fichier:** `frontend/app/(user)/home.tsx`
- **Problème:** API getUserStats() n'existe pas
- **Status:** À corriger

### 5. Profil provider sans données
- **Fichier:** `frontend/app/(provider)/profile.tsx` ou équivalent
- **Problème:** Données du provider pas affichées, pas d'édition
- **Status:** À créer/corriger

## 🟡 NOUVELLES PAGES À CRÉER (Priorité 2)

### Frontend - Pages utilisateur (user)
1. ✅ `home.tsx` - existe, à améliorer
2. ✅ `profiles-list.tsx` - existe, à réparer  
3. ✅ `profile-detail.tsx` - existe, à corriger
4. ✅ `profile-settings.tsx` - existe, à corriger
5. ✅ `chat.tsx` - existe, à améliorer
6. ⏳ `conversations-list.tsx` - liste des conversations
7. ⏳ `payment.tsx` - paiement Stripe
8. ⏳ `bookings.tsx` - mes réservations
9. ⏳ `reservation.tsx` - nouvelle réservation
10. ⏳ `reviews.tsx` - mes avis

### Frontend - Pages provider (provider)
1. ⏳ `dashboard.tsx` - avec icônes mobiles pour profil, planning, demandes, revenus
2. ⏳ `profile.tsx` - modifier profil provider
3. ⏳ `availability.tsx` - disponibilités
4. ⏳ `earnings.tsx` - revenus et historique
5. ⏳ `bookings.tsx` - demandes de réservation

### Frontend - Pages admin (admin)
1. ⏳ `dashboard.tsx` - gestion complète
2. ⏳ `user-management.tsx` - gestion des utilisateurs
3. ⏳ `validate-profiles.tsx` - validation/rejet de profils
4. ⏳ `reports.tsx` - liste des signalements
5. ⏳ `moderation.tsx` - modération du contenu

## 🟢 AMÉLIORATIONS UX (Priorité 3)

1. **Home page utilisateur:**
   - Cartes actions rapides avec background transparent (couleur icône + opacité)
   - Bouton accès réservations

2. **Dashboard provider:**
   - Icônes mobiles en haut pour: Profil | Planning | Demandes | Revenus

3. **Chat système Facebook-like:**
   - Users voient profils providers
   - Users contactent providers par chat
   - Providers voient users qui les ont contactés

## 🔧 BACKEND À IMPLÉMENTER

### Routes User
- GET `/api/users/:id` - profil utilisateur
- PUT `/api/users/:id` - mettre à jour profil
- GET `/api/users/:id/stats` - statistiques
- GET `/api/profiles` - liste profils (avec filtres)
- GET `/api/profiles/:id` - détail profil

### Routes Provider  
- GET `/api/providers/:id` - profil provider
- PUT `/api/providers/:id` - mettre à jour profil
- GET `/api/providers/dashboard` - stats dashboard
- GET `/api/bookings/requests` - demandes de réservation
- POST `/api/bookings/:id/accept|reject` - accepter/rejeter

### Routes Admin
- GET `/api/admin/users` - liste utilisateurs
- GET `/api/admin/providers` - liste providers
- GET `/api/admin/profiles/pending` - profils en attente
- POST `/api/admin/profiles/:id/approve|reject` - valider/rejeter
- GET `/api/admin/reports` - signalements

### Routes Chat/Messages
- GET `/api/chat/conversations` - liste conversations
- GET `/api/chat/conversations/:id` - détails conversation
- POST `/api/chat/conversations` - créer conversation
- POST `/api/chat/messages` - envoyer message
- GET `/api/chat/messages/:id` - lister messages

### Routes Paiement
- POST `/api/payments/intent` - créer intent Stripe
- GET `/api/payments/history` - historique paiements
- GET `/api/payments/:id` - détail paiement

## 👥 COMPTES ADMIN PAR DÉFAUT

À ajouter dans l'initialisation:
1. alaoscorty@gmail.com / 123456
2. alaoservice1@gmail.com / 123456
3. alaoempire1@gmail.com / 123456

## ⏳ TÂCHES ORDONNÉES

### Phase 1: Corrections (Cette session)
- [ ] Corriger crash ChatProvider
- [ ] Corriger profile-settings
- [ ] Corriger profiles-list
- [ ] Corriger stats affichage
- [ ] Corriger profil provider

### Phase 2: Pages critiques
- [ ] conversations-list.tsx
- [ ] payment.tsx avec Stripe
- [ ] reservation.tsx (booking form)
- [ ] provider dashboard avec icônes
- [ ] Chat système Facebook-like

### Phase 3: Pages secondaires
- [ ] Toutes les autres pages

### Phase 4: Admin
- [ ] Dashboard admin
- [ ] Validation profils
- [ ] Gestion utilisateurs
- [ ] Signalements
- [ ] Comptes admin par défaut
