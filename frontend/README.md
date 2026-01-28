# Loving - Application Mobile Frontend

Application mobile React Native avec Expo pour la plateforme d'accompagnement social et événementiel.

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Démarrer l'application
npm start

# Pour iOS
npm run ios

# Pour Android
npm run android
```

## 📁 Structure du Projet

```
app/
 ├── (auth)/          # Écrans d'authentification
 ├── (user)/          # Écrans utilisateur
 ├── (provider)/      # Écrans prestataire
 ├── (admin)/         # Écrans administrateur
components/           # Composants réutilisables
contexts/             # Contextes React
services/             # Services API
utils/                # Utilitaires
constants/            # Constantes
```

## 🔐 Authentification

L'authentification utilise JWT avec stockage sécurisé via Expo SecureStore.

## 🌐 Variables d'Environnement

Créer un fichier `.env` basé sur `.env.example` :

```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000
```
