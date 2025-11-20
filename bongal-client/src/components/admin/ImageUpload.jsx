import { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Copy, Zap, Sparkles, FileImage, FolderOpen, Badge } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImage, uploadMultipleImages, uploadLogo, deleteImage } from '../../services/uploadService';

const COLORS = {
  darkBlue: '#011D4D',
  mediumBlue: '#034078',
  teal: '#1282A2',
  cream: '#E4DFDA',
  brown: '#63372C'
};

const ImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadType, setUploadType] = useState('single');
  const [mounted, setMounted] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      let result;

      if (uploadType === 'single') {
        result = await uploadImage(files[0]);
        setUploadedImages([...uploadedImages, result.data]);
        toast.success('Image uploaded successfully!');
      } else if (uploadType === 'multiple') {
        if (files.length > 5) {
          toast.error('You can upload maximum 5 images at once');
          setUploading(false);
          return;
        }
        result = await uploadMultipleImages(files);
        setUploadedImages([...uploadedImages, ...result.data]);
        toast.success(`${result.data.length} images uploaded successfully!`);
      } else if (uploadType === 'logo') {
        result = await uploadLogo(files[0]);
        setUploadedImages([...uploadedImages, result.data]);
        toast.success('Logo uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDeleteImage = async (publicId, index) => {
    try {
      await deleteImage(publicId);
      const newImages = uploadedImages.filter((_, i) => i !== index);
      setUploadedImages(newImages);
      toast.success('Image deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete image');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = uploadType === 'multiple';
      input.accept = 'image/*,video/*';
      Object.defineProperty(input, 'files', {
        value: files,
        writable: false,
      });
      const event = { target: input };
      handleFileUpload(event);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('URL copied to clipboard!');
  };

  const getUploadTypeIcon = () => {
    switch (uploadType) {
      case 'single': return <FileImage size={20} />;
      case 'multiple': return <FolderOpen size={20} />;
      case 'logo': return <Badge size={20} />;
      default: return <Upload size={20} />;
    }
  };

  const getUploadTypeDescription = () => {
    switch (uploadType) {
      case 'single': return 'Upload a single image';
      case 'multiple': return 'Upload up to 5 images at once';
      case 'logo': return 'Logo will be automatically resized to 200x200';
      default: return '';
    }
  };

  return (
    <div className="space-y-4">
      <div className={`flex justify-between items-center transition-all duration-700 transform ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Image Upload</h1>
          <p className="text-gray-600 text-sm font-light mt-1">
            Upload and manage images for your products and content
          </p>
        </div>
        {uploadedImages.length > 0 && (
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-gray-200/60 shadow-sm">
            <Zap size={16} className="text-blue-500" />
            <span className="text-xs font-semibold text-gray-700">Live Upload</span>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>

      <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-200/60 transition-all duration-700 transform ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Upload Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'single', label: 'Single Image', icon: FileImage, color: COLORS.teal },
            { value: 'multiple', label: 'Multiple Images', icon: FolderOpen, color: COLORS.mediumBlue },
            { value: 'logo', label: 'Logo', icon: Badge, color: COLORS.darkBlue }
          ].map((type, index) => {
            const Icon = type.icon;
            return (
              <label 
                key={type.value}
                className={`flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 group ${
                  uploadType === type.value 
                    ? 'border-gray-900 bg-gray-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: type.color }}
                >
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-900 text-sm">{type.label}</span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {type.value === 'multiple' ? 'Max 5 images' : type.value === 'logo' ? '200x200' : 'Single file'}
                  </p>
                </div>
                <input
                  type="radio"
                  name="uploadType"
                  value={type.value}
                  checked={uploadType === type.value}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="sr-only"
                />
              </label>
            );
          })}
        </div>
      </div>

      <div className={`transition-all duration-700 transform ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <label 
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
            dragOver 
              ? 'border-gray-900 bg-gray-50 scale-[1.02]' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center p-4">
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-sm text-gray-600">Uploading...</p>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-2 mb-2">
                  {getUploadTypeIcon()}
                  <Upload size={18} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 font-medium text-center mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 text-center">
                  {getUploadTypeDescription()}
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*,video/*"
            multiple={uploadType === 'multiple'}
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {uploadedImages.length > 0 && (
        <div className={`transition-all duration-700 transform ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <ImageIcon size={20} />
              <span>Uploaded Images ({uploadedImages.length})</span>
            </h3>
            <button
              onClick={() => setUploadedImages([])}
              className="text-xs text-gray-600 hover:text-gray-900 font-medium flex items-center space-x-1 transition-all duration-300"
            >
              <X size={14} />
              <span>Clear All</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {uploadedImages.map((image, index) => (
              <div
                key={index}
                className="relative group bg-white rounded-lg border border-gray-200/60 overflow-hidden hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="relative h-32 bg-gray-100">
                  <img
                    src={image.url}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleDeleteImage(image.public_id, index)}
                    className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                    title="Delete image"
                  >
                    <X size={12} />
                  </button>
                </div>

                <div className="p-3">
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">URL</p>
                      <div className="flex items-center space-x-1">
                        <p className="text-xs text-gray-700 truncate flex-1" title={image.url}>
                          {image.url.split('/').pop()}
                        </p>
                        <button
                          onClick={() => copyToClipboard(image.url)}
                          className="p-1 text-gray-500 hover:text-gray-700 transition-colors duration-300 transform hover:scale-110"
                          title="Copy URL"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Public ID</p>
                      <div className="flex items-center space-x-1">
                        <p className="text-xs text-gray-700 truncate flex-1" title={image.public_id}>
                          {image.public_id}
                        </p>
                        <button
                          onClick={() => copyToClipboard(image.public_id)}
                          className="p-1 text-gray-500 hover:text-gray-700 transition-colors duration-300 transform hover:scale-110"
                          title="Copy Public ID"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploadedImages.length === 0 && !uploading && (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200/60 p-8 text-center transition-all duration-700 transform ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles size={28} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No Images Uploaded</h3>
            <p className="text-gray-600 text-sm mb-2">
              Upload images to use in your products and content
            </p>
            <p className="text-xs text-gray-500">
              Supported formats: JPG, PNG, GIF, WebP • Max file size: 10MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;