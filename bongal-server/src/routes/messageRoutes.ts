import { Router } from 'express';
import {
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
  getUserMessages,
} from '../controllers/messageController';
import { protect, admin } from '../middleware/auth';

const router = Router();

// User routes (authenticated)
router.post('/', protect, createMessage);
router.get('/my-messages', protect, getUserMessages);

// Admin routes
router.get('/', protect, admin, getAllMessages);
router.get('/:id', protect, admin, getMessageById);
router.patch('/:id/status', protect, admin, updateMessageStatus);
router.delete('/:id', protect, admin, deleteMessage);

export default router;
