import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { Notification } from '../models/Notification.model';
import { User } from '../models/User.model';
import { logger } from '../utils/logger';

const router = Router();

// Appliquer le middleware d'authentification à toutes les routes
router.use(authMiddleware);

// Récupérer les notifications de l'utilisateur connecté
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'firstName lastName')
      .populate('relatedBooking', 'id')
      .populate('relatedProfile', 'id displayName');

    const total = await Notification.countDocuments({ recipient: userId });

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Erreur récupération notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des notifications',
    });
  }
});

// Récupérer le nombre de notifications non lues
router.get('/unread-count', async (req, res) => {
  try {
    const userId = req.user?.id;
    const count = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

    res.json({
      success: true,
      data: { count },
    });
  } catch (error) {
    logger.error('Erreur récupération count notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du compteur',
    });
  }
});

// Marquer une notification comme lue
router.put('/:id/read', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user?.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée',
      });
    }

    res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    logger.error('Erreur marquage notification lue:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du marquage de la notification',
    });
  }
});

// Marquer toutes les notifications comme lues
router.put('/mark-all-read', async (req, res) => {
  try {
    const userId = req.user?.id;

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'Toutes les notifications ont été marquées comme lues',
    });
  } catch (error) {
    logger.error('Erreur marquage toutes notifications lues:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du marquage des notifications',
    });
  }
});

// Supprimer une notification
router.delete('/:id', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user?.id;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée',
      });
    }

    res.json({
      success: true,
      message: 'Notification supprimée',
    });
  } catch (error) {
    logger.error('Erreur suppression notification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la notification',
    });
  }
});

// Créer une notification (pour usage interne/admin)
router.post('/', async (req, res) => {
  try {
    const { recipient, type, title, message, sender, relatedBooking, relatedProfile } = req.body;

    // Vérifier que le destinataire existe
    const recipientUser = await User.findById(recipient);
    if (!recipientUser) {
      return res.status(404).json({
        success: false,
        message: 'Destinataire non trouvé',
      });
    }

    const notification = new Notification({
      recipient,
      type,
      title,
      message,
      sender,
      relatedBooking,
      relatedProfile,
    });

    await notification.save();

    // TODO: Envoyer notification push si nécessaire

    res.status(201).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    logger.error('Erreur création notification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la notification',
    });
  }
});

export default router;
