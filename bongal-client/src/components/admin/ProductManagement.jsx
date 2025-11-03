import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from '../../services/productService';
import { Plus, Edit, Trash2 } from 'lucide-react';
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
    image: '',
    stock: '',
    description: '',
    location: '',
  });

  const queryClient = useQueryClient();
  const { data: products, isLoading } = useQuery('admin-products', () =>
    productService.getAllProducts({})
  );

  const createMutation = useMutation(productService.createProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries('admin-products');
      resetForm();
      alert('Product created successfully!');
    },
  });

  const updateMutation = useMutation(
    ({ id, data }) => productService.updateProduct(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-products');
        resetForm();
        alert('Product updated successfully!');
      },
    }
  );

  const deleteMutation = useMutation(productService.deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries('admin-products');
      alert('Product deleted successfully!');
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      name_bn: '',
      price: '',
      category: 'honey',
      image: '',
      stock: '',
      description: '',
      location: '',
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      name_bn: product.name_bn,
      price: product.price,
      category: product.category,
      image: product.images?.[0] || product.image,
      stock: product.stock,
      description: product.description,
      location: product.location,
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      images: [formData.image],
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id || editingProduct._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Bengali Name *"
              value={formData.name_bn}
              onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })}
              className="px-4 py-2 border rounded-lg bengali-text"
              required
            />
            <input
              type="number"
              placeholder="Price (৳) *"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="px-4 py-2 border rounded-lg"
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            >
              {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Image URL *"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Stock Quantity *"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Location *"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="px-4 py-2 border rounded-lg"
              required
            />
            <textarea
              placeholder="Description *"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="px-4 py-2 border rounded-lg md:col-span-2"
              rows="3"
              required
            />
            <div className="md:col-span-2 flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products?.products?.map((product) => (
              <tr key={product.id || product._id}>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.images?.[0] || product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-500 bengali-text">{product.name_bn}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{formatPrice(product.price)}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      product.stock > 10
                        ? 'bg-green-100 text-green-800'
                        : product.stock > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 capitalize">{product.category}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id || product._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
