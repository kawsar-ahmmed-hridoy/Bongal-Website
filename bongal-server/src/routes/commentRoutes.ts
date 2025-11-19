import express from 'express';
import { protect } from '../middleware/auth';
import {
  createComment,
  getComments,
  deleteComment
} from '../controllers/commentController';

const router = express.Router();

router.get('/:postId', getComments);

router.use(protect);
router.post('/:postId', createComment);
router.delete('/:id', deleteComment);

export default router;
