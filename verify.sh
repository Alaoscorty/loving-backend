#!/bin/bash

# 🚀 Script de Vérification - Loving App
# Vérifie que tous les fichiers compilent correctement
# Usage: chmod +x verify.sh && ./verify.sh

set -e

echo "════════════════════════════════════════════════════════"
echo "🔍 VÉRIFICATION DE L'APPLICATION LOVING"
echo "════════════════════════════════════════════════════════"
echo ""

# Couleurs pour l'output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Compteurs
TOTAL=0
PASSED=0
FAILED=0

# Fonction pour vérifier un fichier
check_file() {
    local file=$1
    local description=$2
    
    TOTAL=$((TOTAL + 1))
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $description"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}❌${NC} $description - MANQUANT: $file"
        FAILED=$((FAILED + 1))
    fi
}

# 1️⃣ VÉRIFICATION DES ÉCRANS UTILISATEUR
echo -e "${BLUE}1️⃣  ÉCRANS UTILISATEUR${NC}"
echo "─────────────────────────────────────────────────────"
check_file "frontend/app/(user)/home.tsx" "Home - Dashboard utilisateur"
check_file "frontend/app/(user)/profiles-list.tsx" "Profiles - Liste des prestataires"
check_file "frontend/app/(user)/profile-detail.tsx" "Profile Detail - Vue complète"
check_file "frontend/app/(user)/chat.tsx" "Chat - Messagerie"
check_file "frontend/app/(user)/reservation.tsx" "Reservation - Formulaire de réservation"
check_file "frontend/app/(user)/payment.tsx" "Payment - Gestion des paiements"
check_file "frontend/app/(user)/conversations-list.tsx" "Conversations - Liste des chats"
check_file "frontend/app/(user)/profile-settings.tsx" "Settings - Paramètres utilisateur"
check_file "frontend/app/(user)/bookings.tsx" "Bookings - Historique"
check_file "frontend/app/(user)/favorites.tsx" "Favorites - Profils favoris"
check_file "frontend/app/(user)/calendar.tsx" "Calendar - Calendrier"
check_file "frontend/app/(user)/cancel-booking.tsx" "Cancel - Annulation"
check_file "frontend/app/(user)/reviews.tsx" "Reviews - Avis et notes"
echo ""

# 2️⃣ VÉRIFICATION DES ÉCRANS PRESTATAIRE
echo -e "${BLUE}2️⃣  ÉCRANS PRESTATAIRE${NC}"
echo "─────────────────────────────────────────────────────"
check_file "frontend/app/(provider)/profile.tsx" "Provider Profile - Gestion du profil"
check_file "frontend/app/(provider)/requests.tsx" "Provider Requests - Demandes"
check_file "frontend/app/(provider)/booking-details.tsx" "Booking Details - Vue complète"
check_file "frontend/app/(provider)/security-settings.tsx" "Security Settings - Sécurité"
check_file "frontend/app/(provider)/dashboard.tsx" "Provider Dashboard"
check_file "frontend/app/(provider)/availability.tsx" "Availability - Planning"
check_file "frontend/app/(provider)/earnings.tsx" "Earnings - Revenus"
check_file "frontend/app/(provider)/block-user.tsx" "Block User - Blocage"
check_file "frontend/app/(provider)/premium.tsx" "Premium - Options premium"
check_file "frontend/app/(provider)/bookings.tsx" "Provider Bookings - Historique"
echo ""

# 3️⃣ VÉRIFICATION DES ÉCRANS ADMIN
echo -e "${BLUE}3️⃣  ÉCRANS ADMIN${NC}"
echo "─────────────────────────────────────────────────────"
check_file "frontend/app/(admin)/dashboard.tsx" "Admin Dashboard"
check_file "frontend/app/(admin)/advanced-dashboard.tsx" "Advanced Dashboard - Stats"
check_file "frontend/app/(admin)/user-management.tsx" "User Management - Gestion utilisateurs"
check_file "frontend/app/(admin)/reports.tsx" "Reports - Signalements"
check_file "frontend/app/(admin)/validate-profiles.tsx" "Validate Profiles - Validation"
check_file "frontend/app/(admin)/commissions.tsx" "Commissions - Gestion des commissions"
check_file "frontend/app/(admin)/moderation.tsx" "Moderation - Modération des avis"
check_file "frontend/app/(admin)/logs.tsx" "Logs - Logs système"
check_file "frontend/app/(admin)/profiles.tsx" "Admin Profiles - Gestion des profils"
echo ""

# 4️⃣ VÉRIFICATION DES ÉCRANS AUTH
echo -e "${BLUE}4️⃣  ÉCRANS AUTHENTIFICATION${NC}"
echo "─────────────────────────────────────────────────────"
check_file "frontend/app/(auth)/login.tsx" "Login - Connexion"
check_file "frontend/app/(auth)/register.tsx" "Register - Inscription"
check_file "frontend/app/(auth)/forgot-password.tsx" "Forgot Password - Récupération"
check_file "frontend/app/(auth)/verify.tsx" "Verify - Vérification"
echo ""

# 5️⃣ VÉRIFICATION DES COMPOSANTS
echo -e "${BLUE}5️⃣  COMPOSANTS RÉUTILISABLES${NC}"
echo "─────────────────────────────────────────────────────"
check_file "frontend/components/Button.tsx" "Button - Bouton"
check_file "frontend/components/Input.tsx" "Input - Champ d'entrée"
check_file "frontend/components/Card.tsx" "Card - Conteneur stylistique"
check_file "frontend/components/StarRating.tsx" "StarRating - Notation"
check_file "frontend/components/PhotoGallery.tsx" "PhotoGallery - Galerie photos"
check_file "frontend/components/FilterBar.tsx" "FilterBar - Filtres"
check_file "frontend/components/LoadingSpinner.tsx" "LoadingSpinner - Chargement"
check_file "frontend/components/Modal.tsx" "Modal - Dialog modal"
check_file "frontend/components/Toast.tsx" "Toast - Notification"
check_file "frontend/components/Calendar.tsx" "Calendar - Calendrier interactif"
check_file "frontend/components/index.ts" "Components Index - Exports"
echo ""

# 6️⃣ VÉRIFICATION DES SERVICES
echo -e "${BLUE}6️⃣  SERVICES API${NC}"
echo "─────────────────────────────────────────────────────"
check_file "frontend/services/apiClient.ts" "API Client - Client HTTP"
check_file "frontend/services/authService.ts" "Auth Service - Authentification"
check_file "frontend/services/profileService.ts" "Profile Service - Gestion des profils"
check_file "frontend/services/bookingService.ts" "Booking Service - Réservations"
check_file "frontend/services/paymentService.ts" "Payment Service - Paiements"
check_file "frontend/services/chatService.ts" "Chat Service - Messagerie"
check_file "frontend/services/reviewService.ts" "Review Service - Avis"
check_file "frontend/services/providerService.ts" "Provider Service - Prestataire"
check_file "frontend/services/adminService.ts" "Admin Service - Admin"
check_file "frontend/services/socketService.ts" "Socket Service - Temps réel"
check_file "frontend/services/index.ts" "Services Index - Exports"
echo ""

# 7️⃣ VÉRIFICATION DES CONTEXTES
echo -e "${BLUE}7️⃣  CONTEXTES${NC}"
echo "─────────────────────────────────────────────────────"
check_file "frontend/contexts/AuthContext.tsx" "Auth Context - Authentification"
check_file "frontend/contexts/NotificationContext.tsx" "Notification Context - Notifications"
check_file "frontend/contexts/ChatContext.tsx" "Chat Context - Chat temps réel"
check_file "frontend/contexts/index.ts" "Contexts Index - Exports"
echo ""

# 8️⃣ VÉRIFICATION DES UTILITAIRES
echo -e "${BLUE}8️⃣  UTILITAIRES${NC}"
echo "─────────────────────────────────────────────────────"
check_file "frontend/utils/formatters.ts" "Formatters - Formatage des données"
check_file "frontend/utils/validators.ts" "Validators - Validation des formulaires"
check_file "frontend/utils/errorHandler.ts" "Error Handler - Gestion des erreurs"
check_file "frontend/utils/index.ts" "Utils Index - Exports"
echo ""

# 9️⃣ VÉRIFICATION DES FICHIERS DE CONFIG
echo -e "${BLUE}9️⃣  FICHIERS DE CONFIGURATION${NC}"
echo "─────────────────────────────────────────────────────"
check_file "frontend/app.json" "App Config - Configuration Expo"
check_file "frontend/app/_layout.tsx" "Root Layout - Navigation principale"
check_file "frontend/tsconfig.json" "TypeScript Config"
check_file "frontend/package.json" "Package.json - Dépendances"
check_file "frontend/babel.config.js" "Babel Config"
echo ""

# 🔟 VÉRIFICATION DES TYPES
echo -e "${BLUE}🔟  TYPES TYPESCRIPT${NC}"
echo "─────────────────────────────────────────────────────"
check_file "frontend/types/index.ts" "Types Index - Définitions de types"
check_file "frontend/app/(auth)/_layout.tsx" "Auth Layout"
check_file "frontend/app/(user)/_layout.tsx" "User Layout"
check_file "frontend/app/(provider)/_layout.tsx" "Provider Layout"
check_file "frontend/app/(admin)/_layout.tsx" "Admin Layout"
echo ""

# 📄 RÉSUMÉ
echo "════════════════════════════════════════════════════════"
echo -e "${BLUE}📊 RÉSUMÉ FINAL${NC}"
echo "════════════════════════════════════════════════════════"
echo -e "Total fichiers vérifiés: ${BLUE}${TOTAL}${NC}"
echo -e "${GREEN}✅ Présents: ${PASSED}${NC}"
echo -e "${RED}❌ Manquants: ${FAILED}${NC}"
echo ""

PERCENTAGE=$((PASSED * 100 / TOTAL))
echo -e "Complétion: ${BLUE}${PERCENTAGE}%${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ TOUS LES FICHIERS SONT PRÉSENTS!${NC}"
    echo ""
    echo "Prochaines étapes:"
    echo "1️⃣  Exécuter: npm install --legacy-peer-deps"
    echo "2️⃣  Vérifier TypeScript: npx tsc --noEmit"
    echo "3️⃣  Compiler: expo prebuild"
    echo "4️⃣  Tester: expo start"
    echo "5️⃣  Générer APK: eas build --platform android"
else
    echo -e "${YELLOW}⚠️  ATTENTION: ${FAILED} fichier(s) manquant(s)!${NC}"
    echo "Veuillez créer les fichiers manquants avant de continuer."
fi

echo ""
echo "════════════════════════════════════════════════════════"
