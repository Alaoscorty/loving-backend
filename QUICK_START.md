# Guide de Démarrage Rapide - Loving

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+ installé
- npm ou yarn
- MongoDB Atlas (gratuit) ou MongoDB local
- Compte Expo (gratuit) pour le développement mobile

### 1. Installation Backend

```bash
cd backend
npm install
```

### 2. Configuration Backend

Créer un fichier `.env` dans `backend/` :

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/loving
JWT_SECRET=changez-ce-secret-en-production
JWT_REFRESH_SECRET=changez-ce-secret-en-production
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=http://localhost:8081
SOCKET_CORS_ORIGIN=http://localhost:8081
```

**Note:** Pour MongoDB Atlas :
1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un cluster gratuit
3. Créer un utilisateur de base de données
4. Autoriser l'accès depuis n'importe quelle IP (0.0.0.0/0) pour le développement
5. Copier la chaîne de connexion

### 3. Démarrer le Backend

```bash
cd backend
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

### 4. Installation Frontend

```bash
cd frontend
npm install
```

### 5. Configuration Frontend

Créer un fichier `.env` dans `frontend/` (optionnel pour le développement local) :

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000
```

### 6. Démarrer le Frontend

```bash
cd frontend
npm start
```

Puis :
- Appuyer sur `i` pour iOS (nécessite Xcode)
- Appuyer sur `a` pour Android (nécessite Android Studio)
- Scanner le QR code avec l'app Expo Go sur votre téléphone

## 🧪 Tester l'Authentification

### 1. Inscription

1. Ouvrir l'app
2. Aller sur "S'inscrire"
3. Remplir le formulaire
4. Choisir le rôle (Utilisateur ou Prestataire)
5. Valider

### 2. Vérification Email

- Un email de vérification sera envoyé (si configuré)
- Ou utiliser le token directement dans l'URL : `/verify?token=...`

### 3. Connexion

1. Aller sur "Se connecter"
2. Entrer email et mot de passe
3. Vous serez redirigé selon votre rôle

## 📱 Structure des Écrans

### Authentification
- `/login` - Connexion
- `/register` - Inscription
- `/forgot-password` - Mot de passe oublié
- `/verify` - Vérification email

### Utilisateur
- `/home` - Accueil
- `/profile` - Profil
- `/booking` - Réservation
- `/chat` - Chat

### Prestataire
- `/dashboard` - Dashboard
- `/profile` - Gestion profil
- `/schedule` - Planning

### Admin
- `/dashboard` - Dashboard admin

## 🔧 Dépannage

### Erreur de connexion MongoDB

- Vérifier que la chaîne de connexion est correcte
- Vérifier que l'IP est autorisée dans MongoDB Atlas
- Vérifier que l'utilisateur de base de données existe

### Erreur CORS

- Vérifier que `FRONTEND_URL` dans `.env` correspond à l'URL du frontend
- Vérifier que `SOCKET_CORS_ORIGIN` est correct

### Erreur d'authentification

- Vérifier que `JWT_SECRET` est défini
- Vérifier que le token n'est pas expiré
- Vérifier que l'utilisateur existe et est actif

### L'app ne se connecte pas au backend

- Vérifier que le backend est démarré
- Vérifier `EXPO_PUBLIC_API_URL` dans le frontend
- Vérifier que le port 3000 n'est pas utilisé par un autre service

## 📚 Documentation

- `README.md` - Vue d'ensemble
- `PROJECT_STATUS.md` - État du projet
- `API_DOCUMENTATION.md` - Documentation API
- `DEPLOYMENT.md` - Guide de déploiement

## 🎯 Prochaines Étapes

1. Tester l'authentification complète
2. Configurer l'envoi d'emails (optionnel pour le développement)
3. Implémenter les fonctionnalités suivantes selon `PROJECT_STATUS.md`

## 💡 Astuces

- Utiliser [MongoDB Compass](https://www.mongodb.com/products/compass) pour visualiser la base de données
- Utiliser [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/) pour tester l'API
- Activer les logs détaillés en mode développement
- Utiliser React Native Debugger pour déboguer l'app
