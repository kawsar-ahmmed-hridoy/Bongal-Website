import { Router } from 'express';
import {
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
  getUserMessages,
  replyToMessage,
  getConversations,
  getUserConversation,
  sendMessageToUser,
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
router.get('/', protect, admin, getAllMessages);
router.get('/:id', protect, admin, getMessageById);
router.patch('/:id/status', protect, admin, updateMessageStatus);
router.post('/:id/reply', protect, admin, replyToMessage);
router.delete('/:id', protect, admin, deleteMessage);

export default router;
