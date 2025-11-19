import { Router } from 'express';
import {
  createMessage,
  getUserMessages,
  getConversations,
  getUserConversation,
  sendMessageToUser,
  deleteMessage,
} from '../controllers/messageController';
import { protect, admin } from '../middleware/auth';

const router = Router();

// User routes (authenticated)
router.post('/', protect, createMessage);
router.get('/my-messages', protect, getUserMessages);

// Admin routes
router.get('/conversations', protect, admin, getConversations);
router.get('/conversations/:userId', protect, admin, getUserConversation);
router.post('/send/:userId', protect, admin, sendMessageToUser);
router.delete('/:id', protect, admin, deleteMessage);

export default router;
