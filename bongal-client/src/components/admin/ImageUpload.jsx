import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImage, uploadMultipleImages, uploadLogo, deleteImage } from '../../services/uploadService';

const ImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadType, setUploadType] = useState('single'); // 'single', 'multiple', 'logo'

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
      // Reset file input
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

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Image Upload</h2>

      {/* Upload Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Type
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="uploadType"
              value="single"
              checked={uploadType === 'single'}
              onChange={(e) => setUploadType(e.target.value)}
              className="mr-2"
            />
            Single Image
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="uploadType"
              value="multiple"
              checked={uploadType === 'multiple'}
              onChange={(e) => setUploadType(e.target.value)}
              className="mr-2"
            />
            Multiple Images (max 5)
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="uploadType"
              value="logo"
              checked={uploadType === 'logo'}
              onChange={(e) => setUploadType(e.target.value)}
              className="mr-2"
            />
            Logo (200x200)
          </label>
        </div>
      </div>

      {/* Upload Button */}
      <div className="mb-6">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-2 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              {uploadType === 'logo' ? 'Logo will be resized to 200x200' : 'Images and videos (max 10MB)'}
            </p>
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

      {uploading && (
        <div className="mb-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-2 text-sm text-gray-600">Uploading...</p>
        </div>
      )}

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Uploaded Images ({uploadedImages.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedImages.map((image, index) => (
              <div
                key={index}
                className="relative group border rounded-lg overflow-hidden"
              >
                <img
                  src={image.url}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => handleDeleteImage(image.public_id, index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Delete image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="p-3 bg-gray-50">
                  <p className="text-xs text-gray-600 truncate" title={image.url}>
                    URL: {image.url}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 truncate" title={image.public_id}>
                    ID: {image.public_id}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(image.url);
                      toast.success('URL copied to clipboard!');
                    }}
                    className="mt-2 text-xs text-green-600 hover:text-green-700 font-medium"
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
