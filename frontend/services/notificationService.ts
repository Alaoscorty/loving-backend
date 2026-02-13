import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import apiClient from './apiClient';

export interface PushNotificationData {
  title: string;
  body: string;
  data?: any;
  sound?: 'default' | null;
  priority?: 'default' | 'normal' | 'high';
}

class NotificationService {
  private notificationToken: string | null = null;

  constructor() {
    this.setupNotificationChannel();
    this.setupNotificationListeners();
  }

  // Configuration du canal de notification (Android)
  private async setupNotificationChannel() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }

  // Configuration des listeners de notifications
  private setupNotificationListeners() {
    // Listener pour les notifications reçues
    Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification reçue:', notification);
    });

    // Listener pour les interactions avec les notifications
    Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification cliquée:', response);
      this.handleNotificationResponse(response);
    });
  }

  // Demande de permission pour les notifications
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Permission de notification refusée');
      return false;
    }

    return true;
  }

  // Récupération du token de notification push
  async getExpoPushToken(): Promise<string | null> {
    if (Platform.OS === 'web') {
      console.log('Les notifications push ne sont pas supportées sur le web');
      return null;
    }

    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      this.notificationToken = token.data;
      console.log('Token de notification:', token.data);
      return token.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  }

  // Enregistrement du token auprès du backend
  async registerPushToken(userId: string): Promise<void> {
    try {
      const token = await this.getExpoPushToken();
      if (!token) return;

      await apiClient.post('/notifications/register-token', {
        userId,
        token,
        platform: Platform.OS,
      });

      console.log('Token enregistré auprès du backend');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du token:', error);
    }
  }

  // Désenregistrement du token
  async unregisterPushToken(userId: string): Promise<void> {
    try {
      await apiClient.post('/notifications/unregister-token', {
        userId,
      });
    } catch (error) {
      console.error('Erreur lors du désenregistrement du token:', error);
    }
  }

  // Envoi d'une notification locale
  async sendLocalNotification(data: PushNotificationData): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: data.title,
        body: data.body,
        data: data.data || {},
        sound: data.sound || 'default',
      },
      trigger: null, // Notification immédiate
    });
  }

  // Planification d'une notification
  async scheduleNotification(
    data: PushNotificationData,
    trigger: Notifications.NotificationTriggerInput
  ): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: data.title,
        body: data.body,
        data: data.data || {},
        sound: data.sound || 'default',
      },
      trigger,
    });

    return notificationId;
  }

  // Annulation d'une notification planifiée
  async cancelScheduledNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  // Annulation de toutes les notifications planifiées
  async cancelAllScheduledNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Gestion des réponses aux notifications
  private handleNotificationResponse(response: Notifications.NotificationResponse) {
    const data = response.notification.request.content.data;

    // Navigation basée sur le type de notification
    if (data?.type === 'booking_request') {
      // Navigation vers les demandes de réservation
      // router.push('/(provider)/requests');
    } else if (data?.type === 'booking_confirmed') {
      // Navigation vers les réservations
      // router.push('/(user)/bookings');
    } else if (data?.type === 'message') {
      // Navigation vers le chat
      // router.push(`/chat/${data.conversationId}`);
    }
  }

  // Notifications spécifiques à l'application
  async sendBookingRequestNotification(providerId: string, userName: string): Promise<void> {
    await this.sendLocalNotification({
      title: 'Nouvelle demande de réservation',
      body: `${userName} souhaite réserver vos services`,
      data: { type: 'booking_request', providerId },
    });
  }

  async sendBookingConfirmedNotification(userId: string, providerName: string): Promise<void> {
    await this.sendLocalNotification({
      title: 'Réservation confirmée',
      body: `${providerName} a accepté votre demande`,
      data: { type: 'booking_confirmed', userId },
    });
  }

  async sendMessageNotification(conversationId: string, senderName: string, message: string): Promise<void> {
    await this.sendLocalNotification({
      title: `Message de ${senderName}`,
      body: message.length > 50 ? `${message.substring(0, 50)}...` : message,
      data: { type: 'message', conversationId },
    });
  }

  async sendProfileApprovedNotification(providerId: string): Promise<void> {
    await this.sendLocalNotification({
      title: 'Profil approuvé',
      body: 'Votre profil a été validé et est maintenant visible',
      data: { type: 'profile_approved', providerId },
    });
  }

  async sendProfileRejectedNotification(providerId: string, reason: string): Promise<void> {
    await this.sendLocalNotification({
      title: 'Profil rejeté',
      body: `Votre profil a été rejeté: ${reason}`,
      data: { type: 'profile_rejected', providerId },
    });
  }

  // Récupération du nombre de notifications non lues (badge)
  async getBadgeCount(): Promise<number> {
    const badge = await Notifications.getBadgeCountAsync();
    return badge;
  }

  // Mise à jour du badge
  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }

  // Récupération de toutes les notifications planifiées
  async getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }
}

export const notificationService = new NotificationService();
