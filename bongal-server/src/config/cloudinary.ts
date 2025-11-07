import { v2 as cloudinary, ConfigOptions } from 'cloudinary';

const CLOUD_NAME: string = process.env.CLOUDINARY_CLOUD_NAME!;
const API_KEY: string = process.env.CLOUDINARY_API_KEY!;
const API_SECRET: string = process.env.CLOUDINARY_API_SECRET!;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
} as ConfigOptions);

export const uploadImage = async (file: string): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'bongal/products',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });
    return result.secure_url;
  } catch (error) {
    throw new Error('Image upload failed');
  }
};

export default cloudinary;
