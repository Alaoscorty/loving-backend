# Guide de Déploiement - Loving

## 📋 Prérequis

- Node.js 18+ et npm
- MongoDB Atlas (ou MongoDB local)
- Compte Cloudinary (pour les images)
- Compte Stripe/Paystack/Flutterwave (pour les paiements)
- Compte email (pour l'envoi d'emails)

## 🚀 Déploiement Backend

### 1. Configuration MongoDB Atlas

1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un cluster
3. Créer un utilisateur de base de données
4. Obtenir la chaîne de connexion

### 2. Configuration des Variables d'Environnement

Créer un fichier `.env` dans `backend/` :

```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/loving
JWT_SECRET=votre-secret-jwt-tres-securise
JWT_REFRESH_SECRET=votre-secret-refresh-tres-securise
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=votre-cloud-name//lovely
CLOUDINARY_API_KEY=votre-api-key//856872778367396
CLOUDINARY_API_SECRET=votre-api-secret//Ef05UN_e1takPswDCd8txHes9z8
STRIPE_SECRET_KEY=sk_live_votre-cle
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=alaoscorty@gmail.com
EMAIL_PASS=sikirath
EMAIL_FROM=noreply@loving.app
FRONTEND_URL=https://votre-app.com
SOCKET_CORS_ORIGIN=https://votre-app.com
```

### 3. Déploiement sur Heroku/Railway/Render

```bash
cd backend
npm install
npm run build
```

**Heroku:**
```bash
heroku create loving-backend
heroku config:set MONGODB_URI=...
heroku config:set JWT_SECRET=...
# ... autres variables
git push heroku main
```

**Railway/Render:**
- Connecter le repository GitHub
- Configurer les variables d'environnement
- Déployer automatiquement

## 📱 Déploiement Frontend

### 1. Configuration Expo

Créer un fichier `.env` dans `frontend/` :

```env
EXPO_PUBLIC_API_URL=https://votre-backend.com/api
EXPO_PUBLIC_SOCKET_URL=https://votre-backend.com
```

### 2. Build pour Production

```bash
cd frontend
npm install

# Pour iOS
eas build --platform ios

# Pour Android
eas build --platform android
```

### 3. Publication

```bash
# Publier sur Expo
eas update --branch production

# Ou build standalone
eas build --platform all
```

## 🔒 Sécurité en Production

1. **Variables d'Environnement**
   - Ne jamais commiter les fichiers `.env`
   - Utiliser des secrets sécurisés

2. **HTTPS**
   - Forcer HTTPS sur toutes les connexions
   - Certificats SSL valides

3. **Rate Limiting**
   - Déjà configuré dans le backend
   - Ajuster selon les besoins

4. **Base de Données**
   - Utiliser MongoDB Atlas avec IP whitelist
   - Activer l'authentification

5. **JWT**
   - Utiliser des secrets forts
   - Rotation régulière des secrets

## 📊 Monitoring

- Configurer des logs (Winston déjà intégré)
- Monitoring d'erreurs (Sentry recommandé)
- Analytics (Firebase Analytics, Mixpanel)

## 🧪 Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📝 Checklist de Déploiement

- [ ] Variables d'environnement configurées
- [ ] Base de données accessible
- [ ] HTTPS activé
- [ ] Tests passés
- [ ] Logs configurés
- [ ] Monitoring en place
- [ ] Backup de la base de données
- [ ] Documentation à jour
