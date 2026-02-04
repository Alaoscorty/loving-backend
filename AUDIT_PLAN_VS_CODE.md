# Audit : Plan (AA_MON_PROJET.md) vs Code

Vérification systématique de la conformité du code par rapport au plan projet.

---

## 👤 UTILISATEUR (CLIENT)

### 1️⃣ Authentification
| Plan | Code | Statut |
|------|------|--------|
| Inscription / Connexion | `auth.controller.ts` : register, login. Frontend : `register.tsx`, `login.tsx` | ✅ OK |
| Redirection selon rôle | Login : user → `/(user)/home`, provider → `/(provider)/dashboard`, admin → `/(admin)/dashboard` | ✅ OK |

### 2️⃣ Profils (cœur de l'app)
| Plan | Code | Statut |
|------|------|--------|
| GET /profiles | `profiles.routes.ts` GET `/`, `profiles.controller.listProfiles` | ✅ OK |
| GET /profiles/:id | `profiles.routes.ts` GET `/:id`, `getProfileById` | ✅ OK |
| **Filtres : âge, localisation, prix, note, services** | Backend `listProfiles` n'utilise que `page` et `limit`. Pas de query `minAge`, `location`, `priceRange`, `minRating`, `services` | ⚠️ **Manquant** |
| Liste des profils (frontend) | `profiles-list.tsx`, `FilterBar` avec verified / highly-rated / new (filtres côté front uniquement) | ⚠️ Filtres non envoyés au backend |
| Détail d'un profil | `profile-detail.tsx`, `getProfileById` | ✅ OK |
| POST /favorites | `user.routes.ts` POST `/favorites/:providerId` (stub : retourne message, pas de DB) | ⚠️ **Stub** |
| GET favoris | `user.routes.ts` GET `/favorites` → `[]` | ⚠️ **Stub** |
| Notation + avis | GET /reviews (user) stub. POST avis = `booking.routes` POST `/:id/reviews` (stub). Modèle Booking a `reviewed`, `reviewId` | ⚠️ **Partiel** (avis lié à réservation, stub) |

### 3️⃣ Réservation
| Plan | Code | Statut |
|------|------|--------|
| Choisir date, heure, durée | `reservation.tsx` + `booking.controller.createBooking` (startDate, endDate, startTime, duration) | ✅ OK |
| **Voir disponibilité en temps réel** | `bookingService.getAvailability(providerId, startDate, endDate)` appelle GET `/bookings/availability/:providerId` → **route absente** dans `booking.routes.ts` | ❌ **Manquant** |
| Confirmer réservation | POST /bookings, createBooking | ✅ OK |
| Historique réservations | GET /bookings/user, getUserBookings (controller réel) | ✅ OK |
| Statuts pending / accepted / rejected / completed / cancelled | Modèle `Booking` + controller | ✅ OK |
| **Blocage automatique du créneau** | Aucune logique qui bloque un créneau après réservation acceptée (pas de vérif. dispo à la création) | ⚠️ **À renforcer** |

### 4️⃣ Chat temps réel
| Plan | Code | Statut |
|------|------|--------|
| Conversation 1-1 | `chat.controller` + Conversation model, createOrGetConversation | ✅ OK |
| Envoi messages texte | sendMessage, Message model | ✅ OK |
| Historique | getMessages | ✅ OK |
| Socket.IO | `server.ts` + `sockets/socketHandler.ts` (message:send, message:receive) | ✅ OK |
| Messages en DB | Conversation + Message models | ✅ OK |
| Notifications | Socket `user:online` / `user:offline`, pas de push notif métier | ⚠️ Partiel |

### 5️⃣ Paiement
| Plan | Code | Statut |
|------|------|--------|
| Paiement sécurisé | Routes `/api/payments` (intent, confirm, process) en stub | ⚠️ **Stub** |
| Historique | GET /payments/history (stub) | ⚠️ **Stub** |
| Facture | Non implémenté | ❌ **Manquant** |
| **Paiement AVANT la réservation** | Actuellement : création réservation → redirection vers écran paiement. Le plan exige paiement puis réservation. | ⚠️ **Inversé** |
| Wallet plateforme / commission / solde prestataire | Modèle Booking a `commission`, `totalAmount`. Pas de modèle Wallet ni logique payout réelle. | ⚠️ **Partiel** |

### 6️⃣ Dashboard utilisateur
| Plan | Code | Statut |
|------|------|--------|
| Réservations à venir | `home.tsx` : upcomingBookings depuis getRecentBookings. **GET /bookings/recent n'existe pas** → fallback `[]` | ⚠️ **Endpoint manquant** |
| Favoris | Stats `stats?.favoriteCount` depuis GET /users/me/stats (stub) | ⚠️ **Stub** |
| Messages | Liens vers conversations-list / chat | ✅ OK |
| Recherche | Lien "Chercher" → profiles-list | ✅ OK |
| Réservations | Lien → bookings | ✅ OK |
| **Stats dynamiques depuis l'API** | getUserStats = /users/me/stats (stub). getRecentBookings = /bookings/recent (404 → []) | ⚠️ **Non dynamiques** |

---

## 💃 PRESTATAIRE (PROVIDER)

### 1️⃣ Profil prestataire
| Plan | Code | Statut |
|------|------|--------|
| Photo, description, services, tarifs | `provider.controller` getProviderProfile, updateProviderProfile. Modèle Profile | ✅ OK |
| Modifier après inscription | `(provider)/profile.tsx` + PUT /providers/profile | ✅ OK |
| Stats dynamiques | Dashboard provider utilise useQuery avec stub (totalBookings: 0, etc.) | ⚠️ **Stub** |
| Accepter / refuser réservation | acceptBooking, rejectBooking (booking.routes stubs) | ⚠️ **Stub** |

### 2️⃣ Planning
| Plan | Code | Statut |
|------|------|--------|
| Disponibilités | GET/POST /providers/availability (routes en stub), modèle Profile.availability (daysOfWeek, timeSlots) | ⚠️ **Stub** |
| Blocage de dates | Non implémenté (pas de modèle blockedDates) | ❌ **Manquant** |
| **Récurrence** | Aucune notion de récurrence dans le modèle availability | ❌ **Manquant** |
| Planning = vérité / aucune résa hors planning | Pas de contrôle strict créneau vs availability à la création de résa | ⚠️ **À renforcer** |

### 3️⃣ Réservations (prestataire)
| Plan | Code | Statut |
|------|------|--------|
| Accepter / refuser | POST /bookings/:id/reject, accept (stubs). provider.routes GET /bookings, /requests (stubs) | ⚠️ **Stub** |
| Historique, détails client | Écrans requests / bookings côté front, données stub | ⚠️ **Stub** |

### 4️⃣ Revenus
| Plan | Code | Statut |
|------|------|--------|
| Gains totaux / en attente / retraits | GET /providers/earnings, POST /providers/payout (stubs) | ⚠️ **Stub** |
| Commission auto / Payout manuel | Booking a commission; pas de logique wallet/payout réelle | ⚠️ **Stub** |

### 5️⃣ Blocage utilisateur
| Plan | Code | Statut |
|------|------|--------|
| Bloquer un client, raison, déblocage | `provider.routes` GET /blocked-users, POST /block-user, DELETE /blocked-users/:userId | ✅ Routes présentes (implémentation à vérifier) |

---

## 🛠 ADMINISTRATEUR

### 1️⃣ Modération
| Plan | Code | Statut |
|------|------|--------|
| Validation des profils | GET /admin/profiles/pending, POST approve/reject → **stubs** (res.json uniquement, pas de mise à jour DB) | ⚠️ **Stub** |
| Suspension | POST /admin/suspend-provider/:id (stub) | ⚠️ **Stub** |
| Suppression | DELETE /admin/users/:id (stub) | ⚠️ **Stub** |

### 2️⃣ Gestion utilisateurs
| Plan | Code | Statut |
|------|------|--------|
| Voir utilisateurs / prestataires | GET /admin/users → `{ data: [] }` (stub) | ⚠️ **Stub** |
| Bloquer / débloquer | POST block-user, unblock-user (stubs) | ⚠️ **Stub** |

### 3️⃣ Statistiques
| Plan | Code | Statut |
|------|------|--------|
| CA global, réservations, utilisateurs actifs dynamiques | GET /admin/dashboard, GET /admin/stats → réponses en dur (0, []) | ⚠️ **Stub** |
| Stats calculées depuis l'API | Aucune requête MongoDB dans admin.routes | ❌ **Non fait** |

---

## 🚦 NAVIGATION ET RÈGLES

| Plan | Code | Statut |
|------|------|--------|
| user → (user)/* | Layout (user) vérifie `user?.role === 'user'` | ✅ OK |
| provider → (provider)/* | Layout (provider) + redirect login | ✅ OK |
| admin → (admin)/* | Layout (admin) + redirect login | ✅ OK |
| Redirection automatique selon rôle après login | login.tsx : role → replace dashboard/home | ✅ OK |
| Un rôle = un dashboard | 3 zones (user), (provider), (admin) | ✅ OK |

---

## Résumé des écarts

### À implémenter ou corriger en priorité
1. **Filtres profils** : Backend `listProfiles` doit accepter et utiliser `minAge`, `maxAge`, `location`, `minRating`, `priceRange`, `services` (query params).
2. **Disponibilité en temps réel** : Ajouter GET `/bookings/availability/:providerId` (ou sous /providers) et l’utiliser avant création de réservation.
3. **Paiement avant réservation** : Inverser le flux : création d’intent / paiement → puis création de la réservation (ou réservation en brouillon jusqu’au paiement).
4. **Stats dynamiques** :  
   - User : implémenter GET `/users/me/stats` et GET `/bookings/recent` (ou réutiliser GET `/bookings/user` avec limit) avec vraies données.  
   - Admin : brancher dashboard et stats sur les vrais contrôleurs (User, Booking, Profile counts, revenus).
5. **Admin modération** : Brancher approve/reject/suspend/delete sur les contrôleurs et modèles (Profile.status, User.isActive, etc.).
6. **Favoris et reviews** : Persister favoris (modèle ou relation User–Profile). Persister les avis (modèle Review ou équivalent) et les lier au profil.
7. **Prestataire** : Disponibilités, demandes, revenus : remplacer les stubs par des appels aux vrais modèles (Booking, Profile.availability, wallet/payout si prévus).
8. **Planning** : Blocage de dates et récurrence (modèle ou champs dédiés + endpoints).


### Déjà conformes
- Authentification et redirection par rôle.
- Liste et détail des profils (sans filtres backend).
- Création de réservation (sans vérif. dispo ni paiement avant).
- Chat (HTTP + Socket.IO), messages en DB.
- Structure navigation et layouts par rôle.
- Modèles Booking (statuts, commission), Profile (availability basique), Conversation, Message.

