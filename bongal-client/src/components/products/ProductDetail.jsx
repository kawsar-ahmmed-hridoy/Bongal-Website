import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  ArrowLeft,
  Send
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/helpers';
import { productService } from '../../services/productService';
import { reviewService } from '../../services/reviewService';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
    retry: 1
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewService.getProductReviews(id),
    enabled: !!id
  });

  const createReviewMutation = useMutation({
    mutationFn: (reviewData) => reviewService.createReview(id, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews', id]);
      queryClient.invalidateQueries(['product', id]);
      setNewReview({ rating: 5, comment: '' });
      toast.success('Review submitted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
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

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      navigate('/login');
      return;
    }
    if (!newReview.comment.trim()) {
      toast.error('Please write a comment');
      return;
    }
    createReviewMutation.mutate(newReview);
  }; return (
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

        {/* Reviews Section */}
        <div className="mt-12 space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Customer Reviews</h2>

          {/* Write a Review */}
          {user && (
            <div className="bg-white rounded-3xl p-6 border border-primary-100 shadow-soft">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Star Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Your Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          size={32}
                          className={star <= newReview.rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                          }
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-lg font-semibold text-gray-900">
                      {newReview.rating} / 5
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Share your thoughts about this product..."
                    rows={4}
                    className="w-full px-4 py-3 border border-primary-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    maxLength={500}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {newReview.comment.length} / 500 characters
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={createReviewMutation.isPending}
                  className="bg-primary-800 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Send size={18} />
                  <span>{createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}</span>
                </button>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviewsLoading ? (
              <div className="text-center py-8">
                <Loader />
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-primary-100 text-center">
                <Star className="text-primary-300 mx-auto mb-4" size={48} />
                <p className="text-gray-600 text-lg">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white rounded-3xl p-6 border border-primary-100 shadow-soft"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">{review.user?.name || 'Anonymous'}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {review.rating}.0
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;