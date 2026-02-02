# Documentation API - Loving



## Authentification

Toutes les routes protégées nécessitent un token JWT dans l'en-tête :

```
Authorization: Bearer <token>
```

## Endpoints

### 🔐 Authentification

#### POST `/auth/register`
Inscription d'un nouvel utilisateur.

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+33612345678",
  "password": "password123",
  "role": "user" // ou "provider"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Inscription réussie. Un email de vérification a été envoyé.",
  "data": {
    "token": "jwt_token",
    "refreshToken": "refresh_token",
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+33612345678",
      "role": "user",
      "isVerified": false
    }
  }
}
```

#### POST `/auth/login`
Connexion d'un utilisateur.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "token": "jwt_token",
    "refreshToken": "refresh_token",
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+33612345678",
      "role": "user",
      "isVerified": true
    }
  }
}
```

#### GET `/auth/verify`
Vérifier le token d'authentification (protégé).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+33612345678",
      "role": "user",
      "isVerified": true
    }
  }
}
```

#### POST `/auth/refresh`
Rafraîchir le token d'accès.

**Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
}
```

#### POST `/auth/verify-email`
Vérifier l'email avec un token.

**Body:**
```json
{
  "token": "verification_token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email vérifié avec succès"
}
```

#### POST `/auth/resend-verification`
Renvoyer l'email de vérification (protégé).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Email de vérification renvoyé"
}
```

#### POST `/auth/forgot-password`
Demander une réinitialisation de mot de passe.

**Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Si cet email existe, un lien de réinitialisation a été envoyé"
}
```

#### POST `/auth/reset-password`
Réinitialiser le mot de passe avec un token.

**Body:**
```json
{
  "token": "reset_token",
  "password": "new_password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mot de passe réinitialisé avec succès"
}
```

### 👤 Utilisateurs

#### GET `/users/profile`
Obtenir le profil de l'utilisateur connecté (protégé).

**Headers:**
```
Authorization: Bearer <token>
```

### 🎭 Prestataires

#### GET `/providers/dashboard`
Obtenir le dashboard du prestataire (protégé, rôle provider).

**Headers:**
```
Authorization: Bearer <token>
```

### 👨‍💼 Administrateurs

#### GET `/admin/dashboard`
Obtenir le dashboard administrateur (protégé, rôle admin).

**Headers:**
```
Authorization: Bearer <token>
```

## Codes de Statut

- `200` - Succès
- `201` - Créé avec succès
- `400` - Erreur de validation
- `401` - Non authentifié
- `403` - Accès refusé
- `404` - Ressource non trouvée
- `500` - Erreur serveur

## Format des Erreurs

```json
{
  "success": false,
  "message": "Message d'erreur",
  "errors": [
    {
      "field": "email",
      "message": "Email invalide"
    }
  ]
}
```

## Rate Limiting

- Authentification : 5 tentatives par 15 minutes
- Général : 100 requêtes par 15 minutes

## WebSocket (Socket.io)

### Connexion

```javascript
const socket = io(SOCKET_URL, {
  auth: {
    token: 'jwt_token'
  }
});
```

### Événements

#### `message:send`
Envoyer un message.

```javascript
socket.emit('message:send', {
  recipientId: 'user_id',
  message: 'Hello!'
});
```

#### `message:receive`
Recevoir un message.

```javascript
socket.on('message:receive', (data) => {
  console.log(data.from, data.message);
});
```

#### `user:online`
Un utilisateur est en ligne.

```javascript
socket.on('user:online', (data) => {
  console.log('User online:', data.userId);
});
```

#### `user:offline`
Un utilisateur est hors ligne.

```javascript
socket.on('user:offline', (data) => {
  console.log('User offline:', data.userId);
});
```
