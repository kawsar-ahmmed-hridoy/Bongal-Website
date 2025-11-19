import api from './api';

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

export const uploadMultipleImages = async (files) => {
  const formData = new FormData();

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

export const deleteImage = async (publicId) => {
  const response = await api.delete(`/upload/image/${publicId}`);
  return response.data;
};
