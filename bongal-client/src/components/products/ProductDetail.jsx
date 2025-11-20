import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingCart, Heart, Star, MapPin, Package, ChevronLeft, ChevronRight, Play, Minus, Plus, ArrowLeft, Send } from 'lucide-react';
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
  const [isVisible, setIsVisible] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const colors = {
    darkBlue: '#011D4D',
    mediumBlue: '#034078',
    teal: '#1282A2',
    cream: '#E4DFDA',
    brown: '#63372C'
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

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

  if (isLoading) {
    return <Loader />;
  }

  if (error || !product) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center transition-all duration-500"
        style={{ backgroundColor: colors.cream }}
      >
        <div 
          className="rounded-3xl border p-8 text-center max-w-md transition-all duration-500 transform hover:scale-105 backdrop-blur-sm"
          style={{
            backgroundColor: `${colors.cream}f8`,
            borderColor: `${colors.mediumBlue}20`
          }}
        >
          <Package 
            className="mx-auto mb-4 transition-all duration-500 transform hover:rotate-12" 
            size={48} 
            style={{ color: colors.mediumBlue }}
          />
          <h2 
            className="text-2xl font-bold mb-2 transition-all duration-500"
            style={{ color: colors.darkBlue }}
          >
            Product Not Found
          </h2>
          <p 
            className="mb-6 transition-all duration-500"
            style={{ color: colors.mediumBlue }}
          >
            {error?.message || "The product you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 border-2 shadow-lg"
            style={{
              backgroundColor: colors.teal,
              color: colors.cream,
              borderColor: colors.teal
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.mediumBlue;
              e.target.style.borderColor = colors.mediumBlue;
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = `0 12px 32px ${colors.teal}40`;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = colors.teal;
              e.target.style.borderColor = colors.teal;
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
            }}
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
    toast.success(`Added ${quantity} ${product.name} to cart!`);
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
        className={`transition-all duration-300 transform hover:scale-110 ${
          index < Math.floor(rating)
            ? 'text-yellow-500 fill-yellow-500'
            : 'text-gray-300'
        }`}
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
  };

  return (
    <div 
      className="min-h-screen transition-all duration-500"
      style={{ backgroundColor: colors.cream }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 mb-6 font-medium transition-all duration-500 transform hover:scale-105 hover:-translate-x-1 group"
          style={{ color: colors.darkBlue }}
        >
          <ArrowLeft 
            size={20} 
            className="group-hover:-translate-x-1 transition-transform duration-300" 
          />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className={`space-y-4 transition-all duration-700 delay-200 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
          }`}>
            <div 
              className="relative rounded-3xl overflow-hidden border-4 shadow-soft-lg aspect-square transition-all duration-500 transform hover:scale-105"
              style={{
                backgroundColor: colors.cream,
                borderColor: `${colors.mediumBlue}20`
              }}
            >
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-700 transform hover:scale-110"
              />

              {product.stock === 0 && (
                <div 
                  className="absolute inset-0 flex items-center justify-center transition-all duration-500"
                  style={{ backgroundColor: `${colors.darkBlue}80` }}
                >
                  <span 
                    className="font-bold text-2xl px-6 py-3 rounded-3xl transition-all duration-500 transform hover:scale-110"
                    style={{ 
                      backgroundColor: `${colors.darkBlue}90`,
                      color: colors.cream
                    }}
                  >
                    Out of Stock
                  </span>
                </div>
              )}

              {product.stock > 0 && product.stock < 10 && (
                <div 
                  className="absolute top-6 left-6 text-white px-4 py-2 rounded-2xl font-semibold shadow-lg transition-all duration-500 transform hover:scale-105 animate-pulse"
                  style={{ backgroundColor: colors.teal }}
                >
                  Only {product.stock} left!
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                    style={{ 
                      backgroundColor: `${colors.cream}dd`,
                      color: colors.darkBlue
                    }}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                    style={{ 
                      backgroundColor: `${colors.cream}dd`,
                      color: colors.darkBlue
                    }}
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            <div className="grid grid-cols-5 gap-3">
              {images.slice(0, 5).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-3 transition-all duration-500 transform hover:scale-110 ${
                    selectedImage === index
                      ? 'shadow-lg scale-105'
                      : 'hover:border-primary-300'
                  }`}
                  style={{
                    borderColor: selectedImage === index ? colors.teal : `${colors.mediumBlue}20`,
                    backgroundColor: colors.cream
                  }}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className={`space-y-6 transition-all duration-700 delay-300 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
          }`}>
            <div 
              className="rounded-3xl p-6 border backdrop-blur-sm transition-all duration-500 transform hover:scale-105"
              style={{
                backgroundColor: `${colors.cream}f8`,
                borderColor: `${colors.mediumBlue}20`
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 
                    className="text-3xl font-bold mb-2 transition-all duration-500"
                    style={{ color: colors.darkBlue }}
                  >
                    {product.name}
                  </h1>
                  <p 
                    className="text-lg bengali-text transition-all duration-500"
                    style={{ color: colors.mediumBlue }}
                  >
                    {product.name_bn}
                  </p>
                </div>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="flex-shrink-0 p-3 rounded-2xl transition-all duration-500 transform hover:scale-110 hover:rotate-12"
                  style={{ 
                    backgroundColor: `${colors.mediumBlue}15`,
                    color: isFavorite ? colors.brown : colors.mediumBlue
                  }}
                >
                  <Heart
                    size={24}
                    className={isFavorite ? 'fill-current' : ''}
                  />
                </button>
              </div>

              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating || 0)}
                </div>
                <span 
                  className="text-lg font-semibold transition-all duration-500"
                  style={{ color: colors.darkBlue }}
                >
                  {product.rating || '0.0'}
                </span>
                <span style={{ color: `${colors.mediumBlue}40` }}>•</span>
                <span style={{ color: colors.mediumBlue }}>
                  ({product.numReviews || 0} reviews)
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-6" style={{ color: colors.mediumBlue }}>
                <div className="flex items-center space-x-2">
                  <MapPin size={18} style={{ color: colors.teal }} />
                  <span>{product.location}</span>
                </div>
                <span style={{ color: `${colors.mediumBlue}40` }}>•</span>
                <span 
                  className="px-3 py-1 rounded-full text-sm font-medium transition-all duration-500 transform hover:scale-105"
                  style={{ 
                    backgroundColor: `${colors.teal}15`,
                    color: colors.teal
                  }}
                >
                  {product.category}
                </span>
              </div>

              <div 
                className="text-4xl font-bold transition-all duration-500 transform hover:scale-105 inline-block"
                style={{ color: colors.darkBlue }}
              >
                {formatPrice(product.price)}
              </div>
            </div>

            <div 
              className="rounded-3xl p-6 border backdrop-blur-sm transition-all duration-500 transform hover:scale-105"
              style={{
                backgroundColor: `${colors.cream}f8`,
                borderColor: `${colors.mediumBlue}20`
              }}
            >
              <h2 
                className="text-2xl font-bold mb-4 flex items-center space-x-2 transition-all duration-500"
                style={{ color: colors.darkBlue }}
              >
                <Package style={{ color: colors.teal }} size={24} />
                <span>Product Story</span>
              </h2>
              <p 
                className="leading-relaxed whitespace-pre-line transition-all duration-500"
                style={{ color: colors.mediumBlue }}
              >
                {product.description || 'No description available for this product.'}
              </p>
            </div>

            {product.video && (
              <div 
                className="rounded-3xl p-6 shadow-soft-lg transition-all duration-500 transform hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${colors.teal}, ${colors.mediumBlue})`
                }}
              >
                <a
                  href={product.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-3 text-white transition-all duration-500 transform hover:scale-105 group"
                >
                  <Play size={24} className="fill-white group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-lg font-semibold">Watch Product Video</span>
                </a>
              </div>
            )}

            <div 
              className="rounded-3xl p-6 border space-y-4 backdrop-blur-sm transition-all duration-500 transform hover:scale-105"
              style={{
                backgroundColor: `${colors.cream}f8`,
                borderColor: `${colors.mediumBlue}20`
              }}
            >
              <div>
                <label 
                  className="block text-sm font-semibold mb-2 transition-all duration-500"
                  style={{ color: colors.darkBlue }}
                >
                  Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-3 rounded-xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: `${colors.mediumBlue}15`,
                      color: colors.darkBlue
                    }}
                  >
                    <Minus size={20} />
                  </button>
                  <span 
                    className="text-2xl font-bold w-16 text-center transition-all duration-300"
                    style={{ color: colors.darkBlue }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                    className="p-3 rounded-xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: `${colors.mediumBlue}15`,
                      color: colors.darkBlue
                    }}
                  >
                    <Plus size={20} />
                  </button>
                  <span style={{ color: colors.mediumBlue }}>
                    {product.stock} available
                  </span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-500 transform hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg border-2"
                style={{
                  backgroundColor: product.stock === 0 ? `${colors.mediumBlue}30` : colors.teal,
                  color: colors.cream,
                  borderColor: product.stock === 0 ? `${colors.mediumBlue}30` : colors.teal
                }}
                onMouseEnter={(e) => {
                  if (product.stock !== 0) {
                    e.target.style.backgroundColor = colors.mediumBlue;
                    e.target.style.borderColor = colors.mediumBlue;
                    e.target.style.transform = 'scale(1.05) translateY(-2px)';
                    e.target.style.boxShadow = `0 16px 40px ${colors.teal}40`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (product.stock !== 0) {
                    e.target.style.backgroundColor = colors.teal;
                    e.target.style.borderColor = colors.teal;
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
                  }
                }}
              >
                <ShoppingCart size={24} />
                <span>{product.stock === 0 ? 'Out of Stock' : `Add ${quantity} to Cart`}</span>
              </button>
            </div>
          </div>
        </div>

        <div className={`mt-12 space-y-6 transition-all duration-700 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 
            className="text-3xl font-bold transition-all duration-500"
            style={{ color: colors.darkBlue }}
          >
            Customer Reviews
          </h2>

          {user && (
            <div 
              className="rounded-3xl p-6 border backdrop-blur-sm transition-all duration-500 transform hover:scale-105"
              style={{
                backgroundColor: `${colors.cream}f8`,
                borderColor: `${colors.mediumBlue}20`
              }}
            >
              <h3 
                className="text-xl font-bold mb-4 transition-all duration-500"
                style={{ color: colors.darkBlue }}
              >
                Write a Review
              </h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label 
                    className="block text-sm font-semibold mb-2 transition-all duration-500"
                    style={{ color: colors.darkBlue }}
                  >
                    Your Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="focus:outline-none transition-all duration-300 transform hover:scale-110"
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
                    <span 
                      className="ml-2 text-lg font-semibold transition-all duration-500"
                      style={{ color: colors.darkBlue }}
                    >
                      {newReview.rating} / 5
                    </span>
                  </div>
                </div>

                <div>
                  <label 
                    className="block text-sm font-semibold mb-2 transition-all duration-500"
                    style={{ color: colors.darkBlue }}
                  >
                    Your Review
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Share your thoughts about this product..."
                    rows={4}
                    className="w-full px-4 py-3 border rounded-2xl focus:outline-none transition-all duration-500 placeholder-opacity-70"
                    style={{
                      borderColor: `${colors.mediumBlue}30`,
                      color: colors.darkBlue,
                      placeholderColor: `${colors.mediumBlue}70`
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.teal;
                      e.target.style.boxShadow = `0 8px 24px ${colors.teal}15`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = `${colors.mediumBlue}30`;
                      e.target.style.boxShadow = 'none';
                    }}
                    maxLength={500}
                  />
                  <p 
                    className="text-sm mt-1 transition-all duration-500"
                    style={{ color: colors.mediumBlue }}
                  >
                    {newReview.comment.length} / 500 characters
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={createReviewMutation.isPending}
                  className="px-6 py-3 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 flex items-center space-x-2 border-2 shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: colors.teal,
                    color: colors.cream,
                    borderColor: colors.teal
                  }}
                  onMouseEnter={(e) => {
                    if (!createReviewMutation.isPending) {
                      e.target.style.backgroundColor = colors.mediumBlue;
                      e.target.style.borderColor = colors.mediumBlue;
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = `0 12px 32px ${colors.teal}40`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!createReviewMutation.isPending) {
                      e.target.style.backgroundColor = colors.teal;
                      e.target.style.borderColor = colors.teal;
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
                    }
                  }}
                >
                  <Send size={18} />
                  <span>{createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}</span>
                </button>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {reviewsLoading ? (
              <div className="text-center py-8">
                <Loader />
              </div>
            ) : reviews.length === 0 ? (
              <div 
                className="rounded-3xl p-8 border text-center transition-all duration-500 transform hover:scale-105 backdrop-blur-sm"
                style={{
                  backgroundColor: `${colors.cream}f8`,
                  borderColor: `${colors.mediumBlue}20`
                }}
              >
                <Star 
                  className="mx-auto mb-4 transition-all duration-500 transform hover:rotate-12" 
                  size={48} 
                  style={{ color: colors.mediumBlue }}
                />
                <p 
                  className="text-lg transition-all duration-500"
                  style={{ color: colors.mediumBlue }}
                >
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="rounded-3xl p-6 border backdrop-blur-sm transition-all duration-500 transform hover:scale-105"
                  style={{
                    backgroundColor: `${colors.cream}f8`,
                    borderColor: `${colors.mediumBlue}20`
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 
                        className="font-bold transition-all duration-500"
                        style={{ color: colors.darkBlue }}
                      >
                        {review.user?.name || 'Anonymous'}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                        <span 
                          className="text-sm font-semibold transition-all duration-500"
                          style={{ color: colors.darkBlue }}
                        >
                          {review.rating}.0
                        </span>
                      </div>
                    </div>
                    <span 
                      className="text-sm transition-all duration-500"
                      style={{ color: colors.mediumBlue }}
                    >
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <p 
                    className="leading-relaxed transition-all duration-500"
                    style={{ color: colors.mediumBlue }}
                  >
                    {review.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;