import cron from 'node-cron';
import { logger } from '../utils/logger';
import { User } from '../models/User.model';

// Nettoyer les tokens expirés tous les jours à 2h du matin
cron.schedule('0 2 * * *', async () => {
  try {
    const now = new Date();
    
    // Supprimer les tokens de vérification expirés
    await User.updateMany(
      {
        verificationTokenExpiry: { $lt: now },
        isVerified: false,
      },
      {
        $unset: {
          verificationToken: '',
          verificationTokenExpiry: '',
        },
      }
    );

    // Supprimer les tokens de réinitialisation expirés
    await User.updateMany(
      {
        resetPasswordExpiry: { $lt: now },
      },
      {
        $unset: {
          resetPasswordToken: '',
          resetPasswordExpiry: '',
        },
      }
    );

    logger.info('Nettoyage des tokens expirés effectué');
  } catch (error) {
    logger.error('Erreur lors du nettoyage des tokens:', error);
  }
});

// Envoyer des rappels de rendez-vous (à implémenter)
cron.schedule('0 9 * * *', async () => {
  try {
    // Logique pour envoyer des rappels de rendez-vous
    logger.info('Vérification des rappels de rendez-vous');
    // TODO: Implémenter la logique de rappel
  } catch (error) {
    logger.error('Erreur lors de l\'envoi des rappels:', error);
  }
});

logger.info('✅ Tâches cron initialisées');
