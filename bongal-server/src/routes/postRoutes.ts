import express from 'express';
import { protect, requireAdmin, optionalAuth } from '../middleware/auth';
import {
  createPost,
  getPosts,
  getPostById,
  toggleLikePost,
  sharePost,
  getMyPosts,
  deletePost,
  getAllPostsAdmin,
  updatePostStatus,
  getPostCategories,
  createPostCategory,
  deletePostCategory
} from '../controllers/postController';

const router = express.Router();

// Public routes with optional auth (to check if user liked posts)
router.get('/', optionalAuth, getPosts);
router.get('/categories', getPostCategories);
router.get('/:id', optionalAuth, getPostById);

// Protected routes (require authentication)
router.use(protect);
router.post('/', createPost);
router.post('/:id/like', toggleLikePost);
router.post('/:id/share', sharePost);
router.get('/user/my-posts', getMyPosts);
router.delete('/:id', deletePost);

// Admin routes
router.get('/admin/all', requireAdmin, getAllPostsAdmin);
router.patch('/admin/:id/status', requireAdmin, updatePostStatus);
router.post('/admin/categories', requireAdmin, createPostCategory);
router.delete('/admin/categories/:id', requireAdmin, deletePostCategory);

export default router;
