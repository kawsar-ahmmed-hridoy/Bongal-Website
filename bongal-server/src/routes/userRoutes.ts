import express from 'express';
import { getAllUsers, updateProfile, deleteUser, makeAdmin } from '../controllers/userController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, admin, getAllUsers);
router.put('/profile', protect, updateProfile);
router.delete('/:id', protect, admin, deleteUser);
router.put('/make-admin', protect, makeAdmin);

export default router;