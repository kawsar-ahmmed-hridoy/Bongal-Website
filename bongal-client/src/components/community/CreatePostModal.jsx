import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X, Image, AlertCircle, Send, Sparkles } from 'lucide-react';
import { postService } from '../../services/postService';
import toast from 'react-hot-toast';

const COLORS = {
  darkBlue: '#011D4D',
  mediumBlue: '#034078',
  teal: '#1282A2',
  cream: '#E4DFDA',
  brown: '#63372C'
};

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

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setImageFiles(prev => [...prev, ...validFiles]);

      const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
      setImagePreview(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => {
      const newPreview = prev.filter((_, i) => i !== index);
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
      console.log(error);
    }
  };

  const isLoading = createPostMutation.isPending || uploadingImages;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 hover:scale-[1.02]">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Sparkles size={18} className="text-yellow-500" />
            <h2 className="text-lg font-bold text-gray-900">Share Your Story</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-110"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 text-sm"
              style={{ backgroundColor: 'white' }}
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
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 resize-none text-sm"
              maxLength={5000}
              required
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {formData.content.length}/5000
            </div>
          </div>

          {imageFiles.length < 2 && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-gray-400 transition-all duration-300 transform hover:scale-[1.02]">
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
                className="cursor-pointer flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-300"
              >
                <Image size={16} />
                <span className="text-sm">Add photos (max 2)</span>
              </label>
            </div>
          )}

          {imagePreview.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {imagePreview.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg transition-all duration-300 group-hover:brightness-90"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 transition-all duration-300 hover:shadow-sm">
            <div className="flex items-center space-x-2">
              <AlertCircle className="text-amber-600" size={14} />
              <p className="text-xs text-amber-800">
                Your post will be reviewed before publishing. Keep it respectful and genuine!
              </p>
            </div>
          </div>

          <div className="flex space-x-2 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.content.trim()}
              className="flex-1 px-3 py-2 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none text-sm flex items-center justify-center space-x-2 group"
              style={{ 
                backgroundColor: isLoading ? COLORS.teal : COLORS.mediumBlue,
                backgroundImage: !isLoading ? `linear-gradient(135deg, ${COLORS.mediumBlue} 0%, ${COLORS.teal} 100%)` : 'none'
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs">{uploadingImages ? 'Uploading...' : 'Posting...'}</span>
                </>
              ) : (
                <>
                  <Send size={14} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                  <span>Post</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;