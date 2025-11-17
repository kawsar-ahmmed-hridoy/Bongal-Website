import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from '../../services/productService';
import { Plus, Edit, Trash2, Package, Image, DollarSign, Hash, MapPin, FileText, X, Save, ArrowLeft, Play } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';
import { formatPrice } from '../../utils/helpers';

const ProductManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    name_bn: '',
    price: '',
    category: 'honey',
    images: [''],
    stock: '',
    description: '',
    location: '',
    video: '',
  });

  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productService.getAllProducts({}),
    retry: 1,
    refetchOnWindowFocus: false
  });

  const createMutation = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      name_bn: '',
      price: '',
      category: 'honey',
      images: [''],
      stock: '',
      description: '',
      location: '',
      video: '',
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    const productImages = product.images && product.images.length > 0
      ? product.images
      : product.image ? [product.image] : [''];
    setFormData({
      name: product.name || '',
      name_bn: product.name_bn || '',
      price: product.price || '',
      category: product.category || 'honey',
      images: productImages,
      stock: product.stock || '',
      description: product.description || '',
      location: product.location || '',
      video: product.video || '',
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredImages = formData.images.filter(img => img.trim() !== '');
    const data = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      images: filteredImages,
    };

    if (editingProduct) {
      updateMutation.mutate({
        id: editingProduct.id || editingProduct._id,
        data
      });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  const productsList = products?.products || products || [];

  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-light">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Package className="text-red-600" size={32} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Products</h3>
        <p className="text-gray-600 mb-4">Please try again later</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Product Management</h1>
          <p className="text-gray-600 text-lg font-light mt-2">
            {productsList.length > 0
              ? `Managing ${productsList.length} products`
              : 'No products yet. Add your first product to get started.'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="fixed bottom-20 right-6 z-40 bg-gray-900 text-white px-6 py-4 rounded-3xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center space-x-0 group"
        >
          <Plus size={20} className="group-hover:scale-110 transition-transform duration-300" />
          <span className='text-sm'>Add Product</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={resetForm}
              className="p-2 hover:bg-gray-100 rounded-2xl transition-colors duration-300"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Package size={16} className="mr-2 text-gray-500" />
                Product Name *
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <span className="mr-2">🇧🇩</span>
                Bengali Name *
              </label>
              <input
                type="text"
                placeholder="বাংলায় পণ্যের নাম"
                value={formData.name_bn}
                onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl bengali-text focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <DollarSign size={16} className="mr-2 text-gray-500" />
                Price (৳) *
              </label>
              <input
                type="text"
                placeholder="Enter price (e.g., 299.99)"
                value={formData.price}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d*\.?\d*$/.test(value)) {
                    setFormData({ ...formData, price: value });
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Hash size={16} className="mr-2 text-gray-500" />
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 bg-white"
              >
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <Image size={16} className="mr-2 text-gray-500" />
                  Product Images *
                </label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                  className="bg-primary-800 text-white px-3 py-1.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors flex items-center space-x-1"
                >
                  <Plus size={16} />
                  <span>Add Image</span>
                </button>
              </div>
              <div className="space-y-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="url"
                      placeholder={`Image URL ${index + 1} (https://example.com/image.jpg)`}
                      value={image}
                      onChange={(e) => {
                        const newImages = [...formData.images];
                        newImages[index] = e.target.value;
                        setFormData({ ...formData, images: newImages });
                      }}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-all duration-300"
                      required={index === 0}
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = formData.images.filter((_, i) => i !== index);
                          setFormData({ ...formData, images: newImages });
                        }}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Hash size={16} className="mr-2 text-gray-500" />
                Stock Quantity *
              </label>
              <input
                type="text"
                placeholder="Enter stock quantity (e.g., 100)"
                value={formData.stock}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d+$/.test(value)) {
                    setFormData({ ...formData, stock: value });
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <MapPin size={16} className="mr-2 text-gray-500" />
                Location *
              </label>
              <input
                type="text"
                placeholder="Product origin location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Play size={16} className="mr-2 text-gray-500" />
                Video URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={formData.video}
                onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <FileText size={16} className="mr-2 text-gray-500" />
                Description *
              </label>
              <textarea
                placeholder="Enter product description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 resize-none"
                rows="4"
                required
              />
            </div>

            <div className="md:col-span-2 flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={createMutation.isLoading || updateMutation.isLoading}
                className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-3 group"
              >
                <Save size={20} className="group-hover:scale-110 transition-transform duration-300" />
                <span>
                  {(createMutation.isLoading || updateMutation.isLoading)
                    ? 'Saving...'
                    : editingProduct
                      ? 'Update Product'
                      : 'Add Product'
                  }
                </span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-8 bg-white text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300 border-2 border-gray-300 flex items-center space-x-3"
              >
                <ArrowLeft size={20} />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {productsList.length > 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {productsList.map((product) => (
                  <tr key={product.id || product._id} className="hover:bg-gray-50 transition-colors duration-300">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <img
                            src={product.images?.[0] || product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-xl"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-10 h-10 hidden items-center justify-center">
                            <Package size={20} className="text-gray-400" />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                          <p className="text-sm text-gray-500 bengali-text truncate">{product.name_bn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">{formatPrice(product.price)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-sm font-semibold ${product.stock > 10
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-gray-700 font-medium">{product.category}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all duration-300"
                          disabled={deleteMutation.isLoading}
                          title="Edit product"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id || product._id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300"
                          disabled={deleteMutation.isLoading}
                          title="Delete product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Package size={32} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Products Yet</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Start by adding your first product to showcase in your store. Products will appear here once added.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center space-x-3 mx-auto group"
            >
              <Plus size={20} className="group-hover:scale-110 transition-transform duration-300" />
              <span>Add Your First Product</span>
            </button>
          </div>
        </div>
      )}

      {(createMutation.isError || updateMutation.isError || deleteMutation.isError) && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-red-800 text-sm font-medium">
            Error: {createMutation.error?.message || updateMutation.error?.message || deleteMutation.error?.message}
          </p>
        </div>
      )}

      {(createMutation.isSuccess || updateMutation.isSuccess || deleteMutation.isSuccess) && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <p className="text-green-800 text-sm font-medium">
            {createMutation.isSuccess && 'Product created successfully!'}
            {updateMutation.isSuccess && 'Product updated successfully!'}
            {deleteMutation.isSuccess && 'Product deleted successfully!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;