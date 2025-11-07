import express from 'express';
import { getAllUsers, updateProfile, deleteUser } from '../controllers/userController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, admin, getAllUsers);
router.put('/profile', protect, updateProfile);
router.delete('/:id', protect, admin, deleteUser);

export default router;