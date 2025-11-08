import express from 'express';
import { register, login, getMe, verifyCode, updateProfile } from '../controllers/authController';
import { protect } from '../middleware/auth';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/verify-code',verifyCode)
router.post('/verify-code', verifyCode);
router.put('/profile', protect, updateProfile);


export default router;