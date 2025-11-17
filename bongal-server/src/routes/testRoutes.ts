import express from 'express';
import { testEmail } from '../controllers/testController';

const router = express.Router();

// Test email endpoint - only use in development
if (process.env.NODE_ENV === 'development') {
  router.post('/email', testEmail);
}

export default router;
