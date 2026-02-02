import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Conversation } from '../models/Conversation.model';
import { Message } from '../models/Message.model';
import { User } from '../models/User.model';

const ObjectId = mongoose.Types.ObjectId;

/** Liste des conversations */
export async function getConversations(req: Request, res: Response) {
  try {
    const userId = req.user!.id;

    const conversations = await Conversation.find({ participants: userId })
      .sort({ lastMessageAt: -1 })
      .populate('participants', 'firstName lastName avatar')
      .populate('lastMessage')
      .lean<any[]>();

    const list = conversations.map((conv) => {
      const other = conv.participants?.find(
        (p: any) => p._id.toString() !== userId
      );

      const unread =
        conv.unreadCount instanceof Map
          ? conv.unreadCount.get(userId) || 0
          : conv.unreadCount?.[userId] || 0;

      return {
        id: conv._id,
        participantIds: conv.participants?.map((p: any) => p._id) || [],
        participantName: other
          ? `${other.firstName || ''} ${other.lastName || ''}`.trim() || 'Utilisateur'
          : 'Utilisateur',
        participantAvatar: other?.avatar,
        lastMessage: conv.lastMessage?.content || 'Aucun message',
        lastMessageTime: conv.lastMessage?.createdAt || conv.createdAt,
        unreadCount: unread,
        isPinned: false,
      };
    });

    res.json({ success: true, data: list });
  } catch (error) {
    console.error('getConversations:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

/** Créer ou récupérer une conversation */
export async function createOrGetConversation(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const { participantId } = req.body;

    if (!participantId) {
      return res.status(400).json({ success: false, message: 'participantId requis' });
    }

    if (participantId === userId) {
      return res.status(400).json({ success: false, message: 'Action impossible' });
    }

    const u1 = new ObjectId(userId);
    const u2 = new ObjectId(participantId);

    let conv = await Conversation.findOne({
      participants: { $all: [u1, u2] },
      $expr: { $eq: [{ $size: '$participants' }, 2] },
    })
      .populate('participants', 'firstName lastName avatar')
      .lean<any>();

    if (!conv) {
      const created = await Conversation.create({
        participants: [u1, u2],
        unreadCount: new Map(),
      });

      conv = await Conversation.findById(created._id)
        .populate('participants', 'firstName lastName avatar')
        .lean<any>();
    }

    const other = conv.participants.find(
      (p: any) => p._id.toString() !== userId
    );

    res.json({
      success: true,
      data: {
        id: conv._id,
        participantIds: conv.participants.map((p: any) => p._id),
        participantName: other
          ? `${other.firstName || ''} ${other.lastName || ''}`.trim()
          : 'Utilisateur',
        lastMessage: '',
        lastMessageTime: conv.createdAt,
        unreadCount: 0,
      },
    });
  } catch (error) {
    console.error('createOrGetConversation:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

/** Messages d'une conversation */
export async function getMessages(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const conversationId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const conv = await Conversation.findById(conversationId).lean<any>();
    if (!conv || !conv.participants.some((p: any) => p.toString() === userId)) {
      return res.status(404).json({ success: false, message: 'Conversation introuvable' });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .populate('senderId', 'firstName lastName avatar')
      .lean<any[]>();

    const list = messages.reverse().map((m) => ({
      id: m._id,
      content: m.content,
      senderId: m.senderId?._id || m.senderId,
      senderName: m.senderId
        ? `${m.senderId.firstName || ''} ${m.senderId.lastName || ''}`.trim()
        : 'Utilisateur',
      createdAt: m.createdAt,
      isRead: m.isRead,
    }));

    res.json({ success: true, data: { messages: list } });
  } catch (error) {
    console.error('getMessages:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

/** Envoyer un message */
export async function sendMessage(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const conversationId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const { content } = req.body;
    if (!content?.trim()) {
      return res.status(400).json({ success: false, message: 'Message vide' });
    }

    const conv = await Conversation.findById(conversationId);
    if (!conv || !conv.participants.some((p) => p.toString() === userId)) {
      return res.status(404).json({ success: false, message: 'Conversation introuvable' });
    }

    const recipientId = conv.participants.find(
      (p) => p.toString() !== userId
    );

    const msg = await Message.create({
      conversationId: conv._id,
      senderId: new ObjectId(userId),
      recipientId,
      content: content.trim(),
      messageType: 'text',
    });

    conv.lastMessage = msg._id;
    conv.lastMessageAt = new Date();

    const map = conv.unreadCount ?? new Map();
    map.set(recipientId!.toString(), (map.get(recipientId!.toString()) || 0) + 1);
    conv.unreadCount = map;

    await conv.save();

    res.status(201).json({
      success: true,
      data: {
        id: msg._id,
        content: msg.content,
        senderId: userId,
        createdAt: msg.createdAt,
        isRead: false,
      },
    });
  } catch (error) {
    console.error('sendMessage:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
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
