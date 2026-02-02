import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Conversation } from '../models/Conversation.model';
import { Message } from '../models/Message.model';
import { User } from '../models/User.model';

const ObjectId = mongoose.Types.ObjectId;

/** Liste des conversations de l'utilisateur connecté */
export async function getConversations(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const conversations = await Conversation.find({ participants: userId })
      .sort({ lastMessageAt: -1 })
      .populate('participants', 'firstName lastName avatar')
      .populate('lastMessage')
      .lean();

    const list = await Promise.all(
      conversations.map(async (conv: any) => {
        const other = conv.participants?.find((p: any) => p._id.toString() !== userId);
        const lastMsg = conv.lastMessage;
        const unread = (conv.unreadCount && conv.unreadCount.get && conv.unreadCount.get(userId)) || 0;
        return {
          id: conv._id,
          participantIds: conv.participants?.map((p: any) => p._id) || [],
          participantName: other ? `${other.firstName || ''} ${other.lastName || ''}`.trim() || 'Utilisateur' : 'Utilisateur',
          participantAvatar: other?.avatar,
          lastMessage: lastMsg?.content || 'Aucun message',
          lastMessageTime: lastMsg?.createdAt || conv.createdAt || new Date(),
          unreadCount: unread,
          isPinned: false,
        };
      })
    );

    res.json({ success: true, data: list });
  } catch (error: any) {
    console.error('getConversations:', error);
    res.status(500).json({ success: false, message: 'Erreur lors du chargement des conversations' });
  }
}

/** Créer ou récupérer une conversation avec un autre utilisateur */
export async function createOrGetConversation(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const { participantId } = req.body;
    if (!participantId) {
      return res.status(400).json({ success: false, message: 'participantId requis' });
    }
    const pId = new ObjectId(participantId);
    if (pId.toString() === userId) {
      return res.status(400).json({ success: false, message: 'Impossible de créer une conversation avec soi-même' });
    }

    let conv = await Conversation.findOne({
      participants: { $all: [new ObjectId(userId), pId] },
      $expr: { $eq: [{ $size: '$participants' }, 2] },
    })
      .populate('participants', 'firstName lastName avatar')
      .lean();

    if (!conv) {
      const sorted = [userId, participantId].sort();
      conv = await Conversation.create({
        participants: [new ObjectId(sorted[0]), new ObjectId(sorted[1])],
        unreadCount: new Map(),
      });
      conv = await Conversation.findById(conv._id)
        .populate('participants', 'firstName lastName avatar')
        .lean();
    }

    const other = (conv as any).participants?.find((p: any) => p._id.toString() !== userId);
    res.json({
      success: true,
      data: {
        id: (conv as any)._id,
        participantIds: [(conv as any).participants?.[0], (conv as any).participants?.[1]],
        participantName: other ? `${other.firstName || ''} ${other.lastName || ''}`.trim() || 'Utilisateur' : 'Utilisateur',
        lastMessage: '',
        lastMessageTime: (conv as any).createdAt,
        unreadCount: 0,
      },
    });
  } catch (error: any) {
    console.error('createOrGetConversation:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la création de la conversation' });
  }
}

/** Messages d'une conversation */
export async function getMessages(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const { id: conversationId } = req.params;
    const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit), 10) || 50));
    const skip = (page - 1) * limit;

    const conv = await Conversation.findById(conversationId).lean();
    if (!conv || !(conv as any).participants?.some((p: any) => p.toString() === userId)) {
      return res.status(404).json({ success: false, message: 'Conversation non trouvée' });
    }

    const messages = await Message.find({ conversationId: new ObjectId(conversationId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('senderId', 'firstName lastName avatar')
      .lean();

    const senders = await User.find({ _id: { $in: messages.map((m: any) => m.senderId?._id || m.senderId) } })
      .select('firstName lastName avatar')
      .lean();
    const senderMap = Object.fromEntries((senders as any).map((s: any) => [s._id.toString(), s]));

    const list = (messages as any[]).reverse().map((m) => ({
      id: m._id,
      content: m.content,
      senderId: m.senderId?._id || m.senderId,
      senderName: senderMap[m.senderId?._id?.toString() || m.senderId?.toString()] ? `${senderMap[m.senderId?._id?.toString() || m.senderId?.toString()].firstName} ${senderMap[m.senderId?._id?.toString() || m.senderId?.toString()].lastName}`.trim() : 'Utilisateur',
      createdAt: m.createdAt,
      isRead: m.isRead,
    }));

    res.json({ success: true, data: { messages: list } });
  } catch (error: any) {
    console.error('getMessages:', error);
    res.status(500).json({ success: false, message: 'Erreur lors du chargement des messages' });
  }
}

/** Envoyer un message */
export async function sendMessage(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const { id: conversationId } = req.params;
    const { content } = req.body;
    if (!content || !String(content).trim()) {
      return res.status(400).json({ success: false, message: 'Contenu du message requis' });
    }

    const conv = await Conversation.findById(conversationId);
    if (!conv || !conv.participants.some((p: any) => p.toString() === userId)) {
      return res.status(404).json({ success: false, message: 'Conversation non trouvée' });
    }

    const otherId = conv.participants.find((p: any) => p.toString() !== userId);
    const msg = await Message.create({
      conversationId: conv._id,
      senderId: new ObjectId(userId),
      recipientId: otherId,
      content: String(content).trim(),
      messageType: 'text',
    });

    conv.lastMessage = msg._id;
    conv.lastMessageAt = new Date();
    const unreadMap = (conv.unreadCount as any) || new Map();
    unreadMap.set(otherId?.toString(), (unreadMap.get(otherId?.toString()) || 0) + 1);
    conv.unreadCount = unreadMap;
    await conv.save();

    const populated = await Message.findById(msg._id)
      .populate('senderId', 'firstName lastName avatar')
      .lean();
    const sender = (populated as any)?.senderId;

    res.status(201).json({
      success: true,
      data: {
        id: msg._id,
        content: msg.content,
        senderId: userId,
        senderName: sender ? `${sender.firstName || ''} ${sender.lastName || ''}`.trim() : 'Moi',
        createdAt: msg.createdAt,
        isRead: false,
      },
    });
  } catch (error: any) {
    console.error('sendMessage:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi du message' });
  }
}

/** Marquer comme lu */
export async function markAsRead(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const { id: conversationId } = req.params;

    await Message.updateMany(
      { conversationId, recipientId: new ObjectId(userId) },
      { $set: { isRead: true, readAt: new Date() } }
    );

    const conv = await Conversation.findById(conversationId);
    if (conv && conv.unreadCount && (conv.unreadCount as any).get) {
      (conv.unreadCount as any).set(userId, 0);
      await conv.save();
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('markAsRead:', error);
    res.status(500).json({ success: false, message: 'Erreur' });
  }
}
