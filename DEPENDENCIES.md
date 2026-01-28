# Installation des Dépendances - Projet LOVING

## 📦 Dépendances Actuelles

### Frontend (Expo/React Native)

Les dépendances essentielles déjà probablement installées :
- `react-native`
- `expo`
- `expo-router`
- `react`
- `typescript`

### ⚠️ Dépendances À Ajouter

Exécutez la commande suivante dans le dossier `frontend/`:

```bash
cd frontend
npm install axios react-native-calendars react-native-gifted-chat react-native-date-picker @tanstack/react-query @react-native-async-storage/async-storage date-fns
```

Ou ajouter manuellement à `package.json` et faire `npm install`:

```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "react-native-calendars": "^1.1.1",
    "react-native-gifted-chat": "^2.4.0",
    "react-native-date-picker": "^4.2.0",
    "@tanstack/react-query": "^5.0.0",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "@types/react-native": "^0.73.0"
  }
}
```

## 🎯 Utilisation des Dépendances

### axios
Client HTTP pour les appels API
```typescript
import apiClient from '@/services/apiClient';
const data = await apiClient.get('/endpoint');
```

### react-native-calendars
Calendrier React Native
```typescript
import { Calendar } from 'react-native-calendars';
<Calendar onDayPress={(day) => {}} />
```

### react-native-gifted-chat
Interface de chat complète
```typescript
import { GiftedChat } from 'react-native-gifted-chat';
<GiftedChat messages={messages} onSend={onSend} />
```

### react-native-date-picker
Sélecteur de date/heure
```typescript
import DatePicker from 'react-native-date-picker';
<DatePicker date={date} onDateChange={setDate} />
```

### @tanstack/react-query
Gestion des données et cache (déjà implémenté)
```typescript
import { useQuery } from '@tanstack/react-query';
const { data } = useQuery({ queryKey: [...], queryFn: ... });
```

### @react-native-async-storage/async-storage
Stockage local sécurisé
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.setItem('key', 'value');
```

### date-fns
Manipulation et formatage de dates
```typescript
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
const formatted = format(date, 'dd/MM/yyyy', { locale: fr });
```

## 🔌 Backend (Node.js/Express)

Les dépendances backend semblent déjà en place. Vérifiez `backend/package.json`

Dépendances recommandées si absentes :
```bash
npm install jsonwebtoken bcryptjs cors dotenv express-validator cloudinary stripe socket.io
```

## ✅ Vérification de l'Installation

Après installation, vérifiez que tout fonctionne :

```bash
# Dans le dossier frontend/
npm list axios
npm list @tanstack/react-query
npm list @react-native-async-storage/async-storage

# Build test
npm start
# ou pour Expo
expo start
```

## 🚨 Dépannage Courant

### Erreur: "Cannot find module 'axios'"
→ `npm install axios`

### Erreur: "Cannot find module '@tanstack/react-query'"
→ `npm install @tanstack/react-query`

### Erreur: "Cannot find module 'date-fns'"
→ `npm install date-fns`

### Build fail en TypeScript
→ Assurez-vous que `tsconfig.json` est correctement configuré

## 📝 Notes

- Toutes les versions sont compatibles avec Expo/React Native
- Les composants utilisent `expo-vector-icons` (généralement pré-installé)
- L'API client est configurée pour intercepter les erreurs 401

## 🎓 Ressources Utiles

- [Axios Documentation](https://axios-http.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [date-fns Documentation](https://date-fns.org/)
- [React Native Calendars](https://github.com/wix/react-native-calendars)
- [Gifted Chat](https://github.com/FaridSafi/react-native-gifted-chat)
