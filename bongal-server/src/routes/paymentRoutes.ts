import express from 'express';
import { initializePayment, verifyPayment } from '../controllers/paymentController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/initialize', protect, initializePayment);
router.post('/verify', verifyPayment);

export default router;