import express from 'express';
import { uploadImage, uploadMultipleImages, deleteImage, uploadLogo, uploadCommunityImage } from '../controllers/uploadController';
import { protect, admin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

router.post('/image', protect, admin, upload.single('image'), uploadImage);

router.post('/images', protect, admin, upload.array('images', 5), uploadMultipleImages);

router.post('/community-image', protect, upload.single('image'), uploadCommunityImage);

router.post('/logo', protect, admin, upload.single('logo'), uploadLogo);

router.delete('/image/:publicId', protect, admin, deleteImage);

export default router;
