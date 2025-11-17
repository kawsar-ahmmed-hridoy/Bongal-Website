import express from 'express';
import { register, login, getMe, verifyCode, resendVerificationCode, updateProfile, forgotPassword, resetPassword } from '../controllers/authController';
import { protect } from '../middleware/auth';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/verify-code', verifyCode);
router.post('/resend-verification', resendVerificationCode);
router.put('/profile', protect, updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


export default router;