import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from '../../services/productService';
import { Plus, Edit, Trash2, Package, Image, DollarSign, Hash, MapPin, FileText, X, Save, ArrowLeft, Play, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';
import { formatPrice } from '../../utils/helpers';

const COLORS = {
  darkBlue: '#011D4D',
  mediumBlue: '#034078',
  teal: '#1282A2',
  cream: '#E4DFDA',
  brown: '#63372C'
};

const ProductManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    name_bn: '',
    price: '',
    category: 'others',
    images: [''],
    stock: '',
    description: '',
    location: '',
    video: '',
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      category: 'others',
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
      category: product.category || 'others',
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

  const getProductStats = () => {
    const stats = {
      total: productsList.length,
      lowStock: productsList.filter(p => (p.stock || 0) < 10).length,
      outOfStock: productsList.filter(p => (p.stock || 0) === 0).length,
      categories: new Set(productsList.map(p => p.category)).size
    };
    return stats;
  };

  const productStats = getProductStats();

  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 text-sm font-light">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Package className="text-red-600" size={24} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Products</h3>
        <p className="text-gray-600 text-sm mb-4">Please try again later</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`flex justify-between items-center transition-all duration-700 transform ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Product Management</h1>
          <p className="text-gray-600 text-sm font-light mt-1">
            {productsList.length > 0
              ? `Managing ${productsList.length} products`
              : 'No products yet. Add your first product to get started.'}
          </p>
        </div>
        {productsList.length > 0 && (
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-gray-200/60 shadow-sm">
            <Zap size={16} className="text-blue-500" />
            <span className="text-xs font-semibold text-gray-700">Live Products</span>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>

      {productsList.length > 0 && (
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 transition-all duration-700 transform ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          {[
            { 
              label: 'Total Products', 
              value: productStats.total, 
              icon: Package, 
              color: COLORS.darkBlue,
              delay: 100
            },
            { 
              label: 'Categories', 
              value: productStats.categories, 
              icon: TrendingUp, 
              color: COLORS.teal,
              delay: 200
            },
            { 
              label: 'Low Stock', 
              value: productStats.lowStock, 
              icon: AlertCircle, 
              color: COLORS.brown,
              delay: 300
            },
            { 
              label: 'Out of Stock', 
              value: productStats.outOfStock, 
              icon: AlertCircle, 
              color: COLORS.brown,
              delay: 400
            }
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label}
                className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-3 hover:shadow-md transition-all duration-300 transform hover:scale-105 group"
                style={{ transitionDelay: `${stat.delay}ms` }}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: stat.color }}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        className="fixed bottom-6 right-6 z-40 bg-gray-900 text-white px-4 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center space-x-2 group shadow-lg hover:shadow-xl"
      >
        <Plus size={18} className="group-hover:scale-110 transition-transform duration-300" />
        <span className='text-sm'>Add Product</span>
      </button>

      {showForm && (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200/60 p-4 transition-all duration-700 transform ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={resetForm}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-all duration-300 transform hover:scale-110"
            >
              <X size={18} className="text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center text-xs font-semibold text-gray-700">
                <Package size={14} className="mr-2 text-gray-500" />
                Product Name *
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-xs font-semibold text-gray-700">
                <span className="mr-2">🇧🇩</span>
                Bengali Name *
              </label>
              <input
                type="text"
                placeholder="বাংলায় পণ্যের নাম"
                value={formData.name_bn}
                onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bengali-text focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-xs font-semibold text-gray-700">
                <DollarSign size={14} className="mr-2 text-gray-500" />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-xs font-semibold text-gray-700">
                <Hash size={14} className="mr-2 text-gray-500" />
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 bg-white text-sm"
              >
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center text-xs font-semibold text-gray-700">
                  <Image size={14} className="mr-2 text-gray-500" />
                  Product Images *
                </label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                  className="bg-gray-900 text-white px-2 py-1 rounded-lg text-xs font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 flex items-center space-x-1"
                >
                  <Plus size={12} />
                  <span>Add Image</span>
                </button>
              </div>
              <div className="space-y-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="url"
                      placeholder={`Image URL ${index + 1}`}
                      value={image}
                      onChange={(e) => {
                        const newImages = [...formData.images];
                        newImages[index] = e.target.value;
                        setFormData({ ...formData, images: newImages });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 text-sm"
                      required={index === 0}
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = formData.images.filter((_, i) => i !== index);
                          setFormData({ ...formData, images: newImages });
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 transform hover:scale-110"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-xs font-semibold text-gray-700">
                <Hash size={14} className="mr-2 text-gray-500" />
                Stock Quantity *
              </label>
              <input
                type="text"
                placeholder="Enter stock quantity"
                value={formData.stock}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d+$/.test(value)) {
                    setFormData({ ...formData, stock: value });
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-xs font-semibold text-gray-700">
                <MapPin size={14} className="mr-2 text-gray-500" />
                Location *
              </label>
              <input
                type="text"
                placeholder="Product origin location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-xs font-semibold text-gray-700">
                <Play size={14} className="mr-2 text-gray-500" />
                Video URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={formData.video}
                onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 text-sm"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="flex items-center text-xs font-semibold text-gray-700">
                <FileText size={14} className="mr-2 text-gray-500" />
                Description *
              </label>
              <textarea
                placeholder="Enter product description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 resize-none text-sm"
                rows="3"
                required
              />
            </div>

            <div className="md:col-span-2 flex space-x-3 pt-2">
              <button
                type="submit"
                disabled={createMutation.isLoading || updateMutation.isLoading}
                className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm group"
              >
                <Save size={16} className="group-hover:scale-110 transition-transform duration-300" />
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
                className="px-4 bg-white text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 border-2 border-gray-300 flex items-center space-x-2 text-sm"
              >
                <ArrowLeft size={16} />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {productsList.length > 0 ? (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden transition-all duration-700 transform ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {productsList.map((product, index) => (
                  <tr 
                    key={product.id || product._id} 
                    className="hover:bg-gray-50 transition-all duration-300 group"
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <img
                            src={product.images?.[0] || product.image}
                            alt={product.name}
                            className="w-8 h-8 object-cover rounded-md"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-8 h-8 hidden items-center justify-center">
                            <Package size={16} className="text-gray-400" />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{product.name}</p>
                          <p className="text-xs text-gray-500 bengali-text truncate">{product.name_bn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-900 text-sm">{formatPrice(product.price)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${product.stock > 10
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="capitalize text-gray-700 font-medium text-sm">{product.category}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-1">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-300 transform hover:scale-110"
                          disabled={deleteMutation.isLoading}
                          title="Edit product"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id || product._id)}
                          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 transform hover:scale-110"
                          disabled={deleteMutation.isLoading}
                          title="Delete product"
                        >
                          <Trash2 size={14} />
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
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200/60 p-8 text-center transition-all duration-700 transform ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No Products Yet</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Start by adding your first product to showcase in your store. Products will appear here once added.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto text-sm group"
            >
              <Plus size={16} className="group-hover:scale-110 transition-transform duration-300" />
              <span>Add Your First Product</span>
            </button>
          </div>
        </div>
      )}

      {(createMutation.isError || updateMutation.isError || deleteMutation.isError) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-red-800 text-xs font-medium">
            Error: {createMutation.error?.message || updateMutation.error?.message || deleteMutation.error?.message}
          </p>
        </div>
      )}

      {(createMutation.isSuccess || updateMutation.isSuccess || deleteMutation.isSuccess) && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
          <p className="text-green-800 text-xs font-medium">
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