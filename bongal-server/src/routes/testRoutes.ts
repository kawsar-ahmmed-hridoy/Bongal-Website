import express from 'express';
import { testEmail } from '../controllers/testController';

const router = express.Router();

if (process.env.NODE_ENV === 'development') {
  router.post('/email', testEmail);
}

export default router;
