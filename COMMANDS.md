# 🔧 COMMANDES & SETUP RAPIDE - Projet LOVING

## 🚀 Installation Rapide (5 minutes)

### Étape 1: Installer les dépendances
```bash
cd frontend
npm install
```

### Étape 2: Ajouter les nouvelles dépendances
```bash
npm install axios \
  react-native-calendars \
  react-native-gifted-chat \
  react-native-date-picker \
  @tanstack/react-query \
  @react-native-async-storage/async-storage \
  date-fns
```

### Étape 3: Démarrer l'application
```bash
npm start
```

---

## 📱 Commandes Principales

### Développement
```bash
# Démarrer le projet en mode développement
npm start

# Ou pour Expo spécifiquement
expo start

# Lancer sur iOS (macOS seulement)
expo start --ios

# Lancer sur Android
expo start --android

# Lancer sur web
expo start --web
```

### Build & Production
```bash
# Build pour production
npm run build

# Exporter l'app pour distribution
eas build

# Preview du build
eas build --platform ios --profile preview
```

### Utilitaires
```bash
# Vérifier les dépendances
npm list

# Mettre à jour les dépendances
npm update

# Auditer les vulnérabilités
npm audit

# Fixer les vulnérabilités
npm audit fix

# Lister les packages outdated
npm outdated
```

---

## 🧪 Testing & Qualité

### TypeScript
```bash
# Vérifier les erreurs TypeScript
npx tsc --noEmit

# Compiler TypeScript
npx tsc

# Format avec Prettier (si configuré)
npx prettier --write .

# Lint avec ESLint (si configuré)
npx eslint .
```

### Testing
```bash
# Lancer les tests
npm test

# Lancer les tests en watch mode
npm test -- --watch

# Lancer les tests avec couverture
npm test -- --coverage

# Lancer un test spécifique
npm test -- ProfileService.test.ts
```

---

## 📦 Gestion des Dépendances

### Ajouter des packages
```bash
# Ajouter une dépendance
npm install <package-name>

# Ajouter comme dépendance de développement
npm install --save-dev <package-name>

# Ajouter une version spécifique
npm install <package-name>@1.2.3

# Ajouter depuis git
npm install git+https://github.com/user/repo.git
```

### Supprimer des packages
```bash
# Supprimer un package
npm uninstall <package-name>

# Supprimer du package.json
npm uninstall --save <package-name>
```

### Vérifier les versions
```bash
# Afficher les versions de tous les packages
npm list

# Afficher les packages outdated
npm outdated

# Afficher les dépendances circulaires
npm ls --depth=0
```

---

## 🐛 Debugging & Troubleshooting

### Logs & Debugging
```bash
# Voir les logs du build
npm run build -- --verbose

# Debugger avec React DevTools
npm install react-devtools -g
react-devtools

# Debugger le code JavaScript
# Ajouter des points de rupture dans VS Code
```

### Erreurs Communes & Solutions

#### ❌ "Cannot find module 'axios'"
```bash
npm install axios
```

#### ❌ "TypeScript error: Cannot find name..."
```bash
npm install @types/react-native
```

#### ❌ "Port 3000 already in use"
```bash
# Linux/Mac: Trouver et tuer le processus
lsof -i :3000
kill -9 <PID>

# Ou utiliser un autre port
npm start -- --port 3001
```

#### ❌ "Module not found after npm install"
```bash
# Nettoyer le cache npm
npm cache clean --force

# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

#### ❌ "Permission denied"
```bash
# Donner les permissions sur npm
sudo chown -R $(whoami) ~/.npm

# Ou changer le répertoire npm
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

---

## 📁 Fichiers de Configuration

### tsconfig.json (TypeScript)
```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "esnext",
    "lib": ["es2020"],
    "jsx": "react-native",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### .env (Variables d'environnement)
```bash
EXPO_PUBLIC_API_URL=http://localhost:5000/api
EXPO_PUBLIC_APP_NAME=Loving
EXPO_PUBLIC_VERSION=1.0.0
```

### .gitignore
```
node_modules/
.env
.env.local
.DS_Store
*.log
.expo/
dist/
build/
```

---

## 🚀 Déploiement

### Expo Hosting
```bash
# Publier sur Expo
eas build --platform all --auto-submit

# Mettre à jour l'app sans rebuild
eas update
```

### PlayStore (Android)
```bash
# Créer un build pour PlayStore
eas build --platform android --auto-submit
```

### AppStore (iOS)
```bash
# Créer un build pour AppStore
eas build --platform ios --auto-submit
```

---

## 📊 Scripts Utiles Personnalisés

Vous pouvez ajouter ces scripts à `package.json`:

```json
{
  "scripts": {
    "start": "expo start",
    "build": "tsc --noEmit && expo build",
    "test": "jest",
    "lint": "eslint .",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf node_modules && npm install",
    "audit": "npm audit && npm outdated",
    "update": "npm update && npm outdated"
  }
}
```

Utilisez-les:
```bash
npm run lint       # Lancer ESLint
npm run format     # Formatter le code
npm run type-check # Vérifier les types TypeScript
npm run clean      # Réinstaller les dépendances
```

---

## 🔗 Raccourcis VS Code

### Commandes VS Code Utiles
```
Ctrl+K Ctrl+P       - Quick Open Files
Ctrl+`              - Ouvrir terminal
Ctrl+Shift+D        - Ouvrir Debug view
F5                  - Démarrer debugging
Ctrl+/              - Commenter/Décommenter
Alt+Shift+F         - Formatter le code
Ctrl+Shift+X        - Ouvrir Extensions
```

### Extensions Recommandées
```
- ES7+ React/Redux/React-Native snippets
- TypeScript Vue Plugin
- Prettier - Code formatter
- ESLint
- REST Client (pour tester les APIs)
- Thunder Client (alternative à Postman)
```

---

## 📚 Ressources Utiles

### Documentation Officielle
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [npm CLI Documentation](https://docs.npmjs.com/cli/)

### Outils Online
- [npm Package Search](https://www.npmjs.com/)
- [npm Trends](https://www.npmtrends.com/)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Regex101](https://regex101.com/) - Tester regex

### Communautés
- Stack Overflow (tag: react-native)
- GitHub Discussions
- Discord Expo Community
- Reddit r/ReactNative

---

## ✅ Checklist Avant Déploiement

```
Avant de déployer en production:

[ ] npm audit - Pas de vulnérabilités critiques
[ ] npm test - Tous les tests passent
[ ] Type checking - Pas d'erreurs TypeScript
[ ] ESLint - Pas d'erreurs de linting
[ ] .env - Variables d'environnement configurées
[ ] API - Endpoints testés et accessibles
[ ] Performance - Pas de fuites mémoire
[ ] Sécurité - Tokens/secrets non visibles
[ ] Responsive - Testé sur plusieurs écrans
[ ] Accessibilité - Navigable au clavier
[ ] Offline - App fonctionne en offline (si applicable)
```

---

## 💡 Tips & Astuces

### Performance
```bash
# Analyser la taille des bundles
npm install -g webpack-bundle-analyzer

# Voir l'arborescence des dépendances
npm list --depth=0
```

### Développement Productif
```bash
# Utiliser npm scripts pour tâches répétitives
npm run <script-name>

# Activer le hot reload
expo start --clear

# Utiliser Expo DevTools
# Menu > DevTools dans l'app
```

### Debugging Avancé
```bash
# Ouvrir React DevTools
npm install react-devtools -g
react-devtools

# Debugger via Chrome DevTools
# Appuyer sur 'd' dans Expo terminal
```

---

## 📞 Aide & Support

### Où Trouver de l'Aide

1. **Documentation du projet**
   - AUDIT_REPORT.md
   - IMPLEMENTATION_GUIDE.md
   - NAVIGATION.md

2. **Stack Overflow**
   - Tag avec [react-native] [expo]
   - Cherchez avant de poser

3. **GitHub Issues**
   - Vérifiez les issues existantes
   - Cherchez des solutions similaires

4. **Community**
   - Expo Discord Community
   - React Native Community
   - Local meetups

---

## 📝 Logs Utiles

```bash
# Afficher les logs détaillés
npm start -- --verbose

# Voir les erreurs de build
npm run build 2>&1 | tee build.log

# Sauvegarder les logs dans un fichier
npm start > app.log 2>&1 &
```

---

**Last Updated:** 25 Janvier 2026  
**Version:** 1.0  
**Status:** ✅ Complet
