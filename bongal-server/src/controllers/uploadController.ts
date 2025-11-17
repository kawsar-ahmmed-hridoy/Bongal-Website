import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

// Helper function to upload buffer to Cloudinary
const uploadFromBuffer = (buffer: Buffer, options: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
};

export const uploadImage = async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Upload to Cloudinary from buffer
    const result = await uploadFromBuffer(req.file.buffer, {
      folder: 'bongal/products',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Image upload failed',
    });
  }
};

export const uploadMultipleImages = async (req: any, res: Response) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    const uploadPromises = req.files.map((file: any) =>
      uploadFromBuffer(file.buffer, {
        folder: 'bongal/products',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      })
    );

    const results = await Promise.all(uploadPromises);

    const urls = results.map((result) => ({
      url: result.secure_url,
      public_id: result.public_id,
    }));

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: urls,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Image upload failed',
    });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required',
      });
    }

    await cloudinary.uploader.destroy(publicId);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Image deletion failed',
    });
  }
};

// Upload logo specifically
export const uploadLogo = async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Upload to Cloudinary from buffer
    const result = await uploadFromBuffer(req.file.buffer, {
      folder: 'bongal/logo',
      transformation: [
        { width: 200, height: 200, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });

    res.status(200).json({
      success: true,
      message: 'Logo uploaded successfully',
      data: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Logo upload failed',
    });
  }
};
