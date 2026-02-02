import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
  getConversations,
  createOrGetConversation,
  getMessages,
  sendMessage,
  markAsRead,
} from '../controllers/chat.controller';

const router = express.Router();
router.use(authenticate);

router.get('/conversations', getConversations);
router.post('/conversations', createOrGetConversation);
router.get('/conversations/:id/messages', getMessages);
router.post('/conversations/:id/messages', sendMessage);
router.patch('/conversations/:id/read', markAsRead);

export default router;
