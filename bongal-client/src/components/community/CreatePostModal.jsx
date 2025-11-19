import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X, Image, AlertCircle } from 'lucide-react';
import { postService } from '../../services/postService';
import toast from 'react-hot-toast';

const CreatePostModal = ({ onClose, onSuccess, categories }) => {
  const [formData, setFormData] = useState({
    content: '',
    category: 'general',
    images: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const createPostMutation = useMutation({
    mutationFn: (postData) => postService.createPost(postData),
    onSuccess: () => {
      toast.success('🎉 Post created successfully! Waiting for admin approval.', {
        duration: 4000,
        position: 'top-center',
      });

      // Wait a bit before closing modal so user sees the success message
      setTimeout(() => {
        onSuccess();
      }, 1500);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create post';
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-center',
      });
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + imageFiles.length > 2) {
      toast.error('Maximum 2 images allowed per post');
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setImageFiles(prev => [...prev, ...validFiles]);

      // Create preview URLs
      const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
      setImagePreview(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => {
      const newPreview = prev.filter((_, i) => i !== index);
      // Revoke the URL to free memory
      URL.revokeObjectURL(prev[index]);
      return newPreview;
    });
  };

  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];

    setUploadingImages(true);
    const uploadedImages = [];

    try {
      for (const file of imageFiles) {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/upload/community-image`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to upload image');
        }

        const data = await response.json();
        if (data.success && data.data?.url) {
          uploadedImages.push(data.data.url);
        } else {
          throw new Error('Invalid response from image upload');
        }
      }

      return uploadedImages;
    } catch (error) {
      toast.error(error.message || 'Failed to upload images');
      throw error;
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.content.trim()) {
      toast.error('Please write something');
      return;
    }

    if (formData.content.length > 5000) {
      toast.error('Content cannot exceed 5000 characters');
      return;
    }

    try {
      const imageUrls = await uploadImages();

      const postData = {
        content: formData.content.trim(),
        category: formData.category,
        images: imageUrls
      };

      createPostMutation.mutate(postData);
    } catch (error) {
    }
  };

  const isLoading = createPostMutation.isPending || uploadingImages;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Share Your Story</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-all"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Share your thoughts, experiences, or stories..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-all resize-none"
              maxLength={5000}
              required
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.content.length}/5000
            </div>
          </div>

          {imageFiles.length < 2 && (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-primary-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                disabled={imageFiles.length >= 2}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex items-center justify-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Image size={20} />
                <span>Add photos (max 2)</span>
              </label>
            </div>
          )}

          {imagePreview.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {imagePreview.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="text-amber-600" size={16} />
              <p className="text-sm text-amber-800">
                Your post will be reviewed before publishing. Keep it respectful and genuine!
              </p>
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.content.trim()}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{uploadingImages ? 'Uploading...' : 'Posting...'}</span>
                </>
              ) : (
                <span>Post</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
