import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController';
import { protect, admin, optionalAuth } from '../middleware/auth';

const router = express.Router();

router.post('/', optionalAuth, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;