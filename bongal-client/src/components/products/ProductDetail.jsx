import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { productService } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { Star, MapPin, ShoppingCart, Heart, Share2, ChevronLeft } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import Loader from '../common/Loader';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
    retry: 1
  });

  if (isLoading) return <Loader />;
  
  if (error || !product) {
    console.error('Product detail error:', error);
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
          <p className="text-xl text-red-600 mb-4">Product not found</p>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or may have been removed.</p>
          <button 
            onClick={() => navigate('/products')} 
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const images = product.images || (product.image ? [product.image] : []);
  const mainImage = images[selectedImage] || 'https://via.placeholder.com/400x400?text=No+Image';

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/products')}
        className="mb-6 flex items-center space-x-2 text-green-600 hover:text-green-700 transition"
      >
        <ChevronLeft size={20} />
        <span>Back to Products</span>
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
              }}
            />
          </div>
          {images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-green-600' : 'border-gray-200'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} view ${index + 1}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x80?text=Image';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-xl text-gray-600 bengali-text">{product.name_bn || product.name}</p>
          </div>

          {product.location && (
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin size={18} />
              <span>{product.location}</span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < Math.floor(product.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="font-semibold">{product.rating || '0'}</span>
            <span className="text-gray-500">({product.numReviews || product.reviews || 0} reviews)</span>
          </div>

          <div className="border-t border-b py-4">
            <p className="text-4xl font-bold text-green-600">{formatPrice(product.price)}</p>
            <p className="text-sm text-gray-600 mt-2">
              Stock: <span className={`font-semibold ${
                (product.stock || 0) > 10 ? 'text-green-600' : 
                (product.stock || 0) > 0 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {product.stock || 0} units available
              </span>
            </p>
          </div>

          {product.description && (
            <div>
              <h3 className="font-bold text-lg mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {(product.seller?.name || product.seller) && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Seller Information</h4>
              <p className="text-gray-700">
                Sold by: <span className="font-semibold">{product.seller?.name || product.seller}</span>
              </p>
            </div>
          )}

          <div>
            <label className="block font-semibold mb-2">Quantity</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                -
              </button>
              <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock || 0, quantity + 1))}
                disabled={quantity >= (product.stock || 0)}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={(product.stock || 0) === 0}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <ShoppingCart size={20} />
              <span>{(product.stock || 0) === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
            
            <button
              onClick={handleBuyNow}
              disabled={(product.stock || 0) === 0}
              className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold hover:bg-orange-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
            
            <div className="flex space-x-2">
              <button className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center space-x-2">
                <Heart size={20} />
                <span>Wishlist</span>
              </button>
              <button className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center space-x-2">
                <Share2 size={20} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;