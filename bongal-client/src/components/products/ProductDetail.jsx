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

  const { data: product, isLoading, error } = useQuery(
    ['product', id],
    () => productService.getProductById(id)
  );

  if (isLoading) return <Loader />;
  if (error || !product) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-red-600">Product not found</p>
        <button onClick={() => navigate('/products')} className="mt-4 text-green-600 hover:underline">
          Back to Products
        </button>
      </div>
    );
  }

  const images = product.images || [product.image];

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
        className="mb-6 flex items-center space-x-2 text-green-600 hover:underline"
      >
        <ChevronLeft size={20} />
        <span>Back to Products</span>
      </button>

      <div className="grid md:grid-cols-2 gap-8">

        <div>
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          {images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-green-600' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-xl text-gray-600 bengali-text">{product.name_bn}</p>
          </div>

          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin size={18} />
            <span>{product.location}</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < Math.floor(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="font-semibold">{product.rating}</span>
            <span className="text-gray-500">({product.numReviews || product.reviews} reviews)</span>
          </div>

          <div className="border-t border-b py-4">
            <p className="text-4xl font-bold text-green-600">{formatPrice(product.price)}</p>
            <p className="text-sm text-gray-600 mt-2">
              Stock: <span className="font-semibold">{product.stock} units available</span>
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Description</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Seller Information</h4>
            <p className="text-gray-700">
              Sold by: <span className="font-semibold">{product.seller?.name || product.seller}</span>
            </p>
          </div>

          <div>
            <label className="block font-semibold mb-2">Quantity</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                -
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <ShoppingCart size={20} />
              <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold hover:bg-orange-600 transition disabled:bg-gray-400"
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