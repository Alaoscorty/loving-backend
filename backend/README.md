# Loving - Backend API

API backend Node.js/Express pour la plateforme d'accompagnement social et événementiel.

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Créer un fichier .env basé sur .env.example
cp .env.example .env

# Configurer les variables d'environnement dans .env

# Démarrer en mode développement
npm run dev

# Build pour production
npm run build

# Démarrer en production
npm start
```

## 📁 Structure du Projet

```
src/
 ├── controllers/     # Contrôleurs (logique métier)
 ├── models/          # Modèles Mongoose
 ├── routes/          # Routes Express
 ├── middlewares/     # Middlewares (auth, validation, etc.)
 ├── services/        # Services (email, payment, etc.)
 ├── utils/           # Utilitaires
 ├── sockets/         # Gestion Socket.io
 ├── cron/            # Tâches cron
 └── server.ts        # Point d'entrée
```

## 🔐 Authentification

L'API utilise JWT pour l'authentification :
- Token d'accès : expire après 24h
- Refresh token : expire après 7 jours
- Stockage sécurisé des mots de passe avec bcrypt

## 📡 Endpoints API

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/verify` - Vérifier le token
- `POST /api/auth/refresh` - Rafraîchir le token
- `POST /api/auth/verify-email` - Vérifier l'email
- `POST /api/auth/forgot-password` - Mot de passe oublié
- `POST /api/auth/reset-password` - Réinitialiser le mot de passe

## 🔒 Sécurité

- Helmet pour les en-têtes de sécurité
- Rate limiting
- Validation des entrées
- Hash des mots de passe
- JWT sécurisé

## 📝 Variables d'Environnement

Voir `.env.example` pour la liste complète des variables requises.
