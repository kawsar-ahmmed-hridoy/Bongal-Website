import express from 'express';
import { uploadImage, uploadMultipleImages, deleteImage, uploadLogo } from '../controllers/uploadController';
import { protect, admin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// Single image upload
router.post('/image', protect, admin, upload.single('image'), uploadImage);

// Multiple images upload
router.post('/images', protect, admin, upload.array('images', 5), uploadMultipleImages);

// Logo upload
router.post('/logo', protect, admin, upload.single('logo'), uploadLogo);

// Delete image
router.delete('/image/:publicId', protect, admin, deleteImage);

export default router;
