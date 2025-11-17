import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ShoppingCart,
  Heart,
  Star,
  MapPin,
  Package,
  ChevronLeft,
  ChevronRight,
  Play,
  Minus,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';
import { productService } from '../../services/productService';
import Loader from '../common/Loader';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
    retry: 1
  });

  console.log('Product Detail - ID:', id);
  console.log('Product Detail - Loading:', isLoading);
  console.log('Product Detail - Error:', error);
  console.log('Product Detail - Product:', product);

  if (isLoading) {
    return <Loader />;
  }

  if (error || !product) {
    console.error('Product fetch error:', error);
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-primary-100 p-8 text-center max-w-md">
          <Package className="text-primary-300 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error?.message || "The product you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate('/products')}
            className="bg-primary-800 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-primary-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : ['/placeholder-product.jpg'];

  const handlePreviousImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={18}
        className={index < Math.floor(rating)
          ? 'text-yellow-500 fill-yellow-500'
          : 'text-gray-300'
        }
      />
    ));
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-primary-800 hover:text-primary-700 mb-6 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-3xl overflow-hidden border-4 border-primary-100 shadow-soft-lg aspect-square">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl bg-gray-900/90 px-6 py-3 rounded-3xl">
                    Out of Stock
                  </span>
                </div>
              )}

              {product.stock > 0 && product.stock < 10 && (
                <div className="absolute top-6 left-6 bg-accent-600 text-white px-4 py-2 rounded-2xl font-semibold shadow-lg">
                  Only {product.stock} left!
                </div>
              )}

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all"
                  >
                    <ChevronLeft size={24} className="text-primary-800" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all"
                  >
                    <ChevronRight size={24} className="text-primary-800" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-5 gap-3">
              {images.slice(0, 5).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-3 transition-all ${selectedImage === index
                    ? 'border-primary-600 shadow-lg scale-105'
                    : 'border-primary-100 hover:border-primary-300'
                    }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-3xl p-6 border border-primary-100 shadow-soft">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <p className="text-lg text-primary-700 bengali-text">{product.name_bn}</p>
                </div>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="flex-shrink-0 bg-cream-100 p-3 rounded-2xl hover:bg-cream-200 transition-colors"
                >
                  <Heart
                    size={24}
                    className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}
                  />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating || 0)}
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {product.rating || '0.0'}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  ({product.numReviews || 0} reviews)
                </span>
              </div>

              {/* Location & Category */}
              <div className="flex items-center space-x-4 text-gray-600 mb-6">
                <div className="flex items-center space-x-2">
                  <MapPin size={18} className="text-primary-600" />
                  <span>{product.location}</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="bg-primary-50 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
              </div>

              {/* Price */}
              <div className="text-4xl font-bold text-primary-800">
                {formatPrice(product.price)}
              </div>
            </div>

            {/* Product Story */}
            <div className="bg-white rounded-3xl p-6 border border-primary-100 shadow-soft">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Package className="text-primary-600" size={24} />
                <span>Product Story</span>
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description || 'No description available for this product.'}
              </p>
            </div>

            {/* Video Link */}
            {product.video && (
              <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl p-6 shadow-soft-lg">
                <a
                  href={product.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-3 text-white hover:scale-105 transition-transform"
                >
                  <Play size={24} className="fill-white" />
                  <span className="text-lg font-semibold">Watch Product Video</span>
                </a>
              </div>
            )}

            {/* Add to Cart Section */}
            <div className="bg-white rounded-3xl p-6 border border-primary-100 shadow-soft space-y-4">
              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="bg-cream-100 p-3 rounded-xl hover:bg-cream-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus size={20} className="text-primary-800" />
                  </button>
                  <span className="text-2xl font-bold text-gray-900 w-16 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                    className="bg-cream-100 p-3 rounded-xl hover:bg-cream-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={20} className="text-primary-800" />
                  </button>
                  <span className="text-gray-600 ml-2">
                    {product.stock} available
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-primary-800 text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
              >
                <ShoppingCart size={24} />
                <span>{product.stock === 0 ? 'Out of Stock' : `Add ${quantity} to Cart`}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;