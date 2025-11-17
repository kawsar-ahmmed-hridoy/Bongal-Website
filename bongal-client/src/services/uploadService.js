import api from './api';

/**
 * Upload a single image to Cloudinary
 * @param {File} file - The image file to upload
 * @returns {Promise} - Returns the upload result with Cloudinary URL
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Upload multiple images to Cloudinary (max 5)
 * @param {FileList|File[]} files - Array of image files to upload
 * @returns {Promise} - Returns array of upload results with Cloudinary URLs
 */
export const uploadMultipleImages = async (files) => {
  const formData = new FormData();

  // Append each file to FormData
  Array.from(files).forEach((file) => {
    formData.append('images', file);
  });

  const response = await api.post('/upload/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Upload logo image (will be resized to 200x200)
 * @param {File} file - The logo file to upload
 * @returns {Promise} - Returns the upload result with Cloudinary URL
 */
export const uploadLogo = async (file) => {
  const formData = new FormData();
  formData.append('logo', file);

  const response = await api.post('/upload/logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - The Cloudinary public_id of the image to delete
 * @returns {Promise} - Returns the deletion result
 */
export const deleteImage = async (publicId) => {
  const response = await api.delete(`/upload/image/${publicId}`);
  return response.data;
};
