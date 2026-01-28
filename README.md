# Loving - Plateforme d'Accompagnement Social & Événementiel

Application mobile professionnelle permettant la réservation d'accompagnatrices pour des sorties sociales.

## 📋 Structure du Projet

```
Loving/
├── frontend/          # Application React Native (Expo)
├── backend/           # API Node.js/Express
└── README.md          # Ce fichier
```

## 🚀 Démarrage Rapide

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Configurer les variables d'environnement
npm run dev
```

## 🛠️ Stack Technique

### Frontend
- React Native avec Expo
- TypeScript
- Expo Router
- Zustand / Context API
- React Query
- Socket.io Client

### Backend
- Node.js + Express
- MongoDB Atlas
- JWT Auth
- Socket.io
- Cloudinary
- Stripe

## 📱 Fonctionnalités

### Utilisateurs
- Inscription / Connexion
- Consultation des profils
- Réservation
- Chat en temps réel
- Paiement sécurisé

### Prestataires
- Gestion de profil
- Planning
- Gestion des réservations
- Revenus

### Administrateurs
- Modération
- Gestion des utilisateurs
- Statistiques

## 🔐 Sécurité

- Authentification JWT
- Hash des mots de passe (bcrypt)
- Validation des entrées
- Rate limiting
- HTTPS en production

## 📝 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Guide de démarrage rapide
- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - État du projet et fonctionnalités
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Documentation complète de l'API
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Guide de déploiement en production
- **[frontend/README.md](frontend/README.md)** - Documentation frontend
- **[backend/README.md](backend/README.md)** - Documentation backend

## 🎯 État Actuel

✅ **Authentification complète** - Inscription, connexion, vérification email, réinitialisation mot de passe
✅ **Structure du projet** - Frontend et backend configurés
✅ **Modèles de données** - User, Profile, Booking, Review, Message, Conversation
✅ **Sécurité** - JWT, hash passwords, rate limiting, validation

🚧 **En cours de développement** - Voir [PROJECT_STATUS.md](PROJECT_STATUS.md) pour la liste complète
