import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, MapPin, Package, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';

const ProductCard = ({ product, viewMode = 'grid', className = '' }) => {
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const colors = {
    darkBlue: '#011D4D',
    mediumBlue: '#034078',
    teal: '#1282A2',
    cream: '#E4DFDA',
    brown: '#63372C'
  };

  if (!product) {
    return (
      <div 
        className="rounded-2xl border p-6 text-center transition-all duration-500 transform hover:scale-105"
        style={{
          backgroundColor: colors.cream,
          borderColor: `${colors.mediumBlue}20`
        }}
      >
        <Package 
          className="mx-auto mb-3 transition-all duration-500 transform hover:rotate-12" 
          size={32} 
          style={{ color: colors.mediumBlue }}
        />
        <p 
          className="font-medium transition-all duration-500"
          style={{ color: colors.mediumBlue }}
        >
          No product data
        </p>
      </div>
    );
  }

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={14}
        className={`transition-all duration-300 transform hover:scale-110 ${
          index < Math.floor(rating)
            ? 'text-yellow-500 fill-yellow-500'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (viewMode === 'grid') {
    return (
      <Link 
        to={`/products/${product._id || product.id}`} 
        className={`block group ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="rounded-2xl border overflow-hidden transition-all duration-500 h-full flex flex-col backdrop-blur-sm"
          style={{
            backgroundColor: `${colors.cream}f8`,
            borderColor: isHovered ? colors.teal : `${colors.mediumBlue}20`,
            transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
            boxShadow: isHovered 
              ? `0 20px 40px ${colors.teal}20` 
              : '0 4px 20px rgba(0,0,0,0.08)'
          }}
        >
          <div className="relative h-44 overflow-hidden bg-white">
            <img
              src={product.images?.[0] || product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-700 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              } ${isHovered ? 'scale-110' : 'scale-100'}`}
              onLoad={() => setImageLoaded(true)}
            />
            
            {!imageLoaded && (
              <div 
                className="absolute inset-0 animate-pulse flex items-center justify-center transition-all duration-500"
                style={{ backgroundColor: `${colors.mediumBlue}10` }}
              >
                <Package 
                  className="transition-all duration-500 transform hover:rotate-12" 
                  size={28} 
                  style={{ color: colors.mediumBlue }}
                />
              </div>
            )}

            <button
              onClick={toggleFavorite}
              className="absolute top-3 right-3 p-2 rounded-xl backdrop-blur-sm transition-all duration-500 transform hover:scale-110 hover:rotate-12"
              style={{ 
                backgroundColor: `${colors.cream}dd`,
                color: isFavorite ? colors.brown : colors.mediumBlue
              }}
            >
              <Heart
                size={18}
                className={isFavorite ? 'fill-current' : ''}
              />
            </button>

            {product.stock === 0 && (
              <div 
                className="absolute inset-0 flex items-center justify-center transition-all duration-500"
                style={{ backgroundColor: `${colors.darkBlue}80` }}
              >
                <span 
                  className="font-semibold text-lg px-4 py-2 rounded-2xl transition-all duration-500 transform hover:scale-110"
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
                className="absolute top-3 left-3 text-white px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all duration-500 transform hover:scale-105 animate-pulse"
                style={{ backgroundColor: colors.teal }}
              >
                Only {product.stock} left
              </div>
            )}

            <div 
              className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"
            />
          </div>

          <div className="p-4 flex-1 flex flex-col space-y-3">
            <div className="space-y-2">
              <h3 
                className="font-semibold text-lg leading-tight line-clamp-2 transition-all duration-500 group-hover:translate-x-1"
                style={{ color: colors.darkBlue }}
              >
                {product.name}
              </h3>
              <p 
                className="text-sm bengali-text leading-relaxed transition-all duration-500 group-hover:translate-x-1"
                style={{ color: colors.mediumBlue }}
              >
                {product.name_bn}
              </p>

              <div className="flex items-center space-x-2">
                <MapPin 
                  size={14} 
                  style={{ color: colors.teal }}
                  className="transition-transform duration-500 group-hover:scale-110"
                />
                <span 
                  className="text-sm transition-all duration-500 group-hover:translate-x-1"
                  style={{ color: colors.mediumBlue }}
                >
                  {product.location}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {renderStars(product.rating || 0)}
              </div>
              <span 
                className="text-sm font-semibold transition-all duration-500 group-hover:scale-110 inline-block"
                style={{ color: colors.darkBlue }}
              >
                {product.rating || '0.0'}
              </span>
              <span style={{ color: `${colors.mediumBlue}40` }}>•</span>
              <span 
                className="text-sm transition-all duration-500"
                style={{ color: colors.mediumBlue }}
              >
                ({product.numReviews || product.reviews || 0})
              </span>
            </div>

            <div className="mt-auto space-y-3">
              <div className="flex items-center justify-between">
                <span 
                  className="text-xl font-bold transition-all duration-500 transform hover:scale-105 inline-block"
                  style={{ color: colors.darkBlue }}
                >
                  {formatPrice(product.price)}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full py-3 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 flex items-center justify-center space-x-2 border-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: product.stock === 0 ? `${colors.mediumBlue}30` : colors.teal,
                  color: colors.cream,
                  borderColor: product.stock === 0 ? `${colors.mediumBlue}30` : colors.teal
                }}
                onMouseEnter={(e) => {
                  if (product.stock !== 0) {
                    e.target.style.backgroundColor = colors.mediumBlue;
                    e.target.style.borderColor = colors.mediumBlue;
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = `0 8px 24px ${colors.teal}30`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (product.stock !== 0) {
                    e.target.style.backgroundColor = colors.teal;
                    e.target.style.borderColor = colors.teal;
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                <ShoppingCart 
                  size={16} 
                  className="transition-transform duration-300 group-hover:scale-110" 
                />
                <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={`/products/${product._id || product.id}`} 
      className={`block group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="rounded-2xl border overflow-hidden transition-all duration-500 backdrop-blur-sm"
        style={{
          backgroundColor: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.cream}dd 50%, ${colors.cream}bb 100%)`,
          borderColor: isHovered ? colors.teal : `${colors.mediumBlue}20`,
          transform: isHovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
          boxShadow: isHovered 
            ? `0 12px 32px ${colors.teal}15` 
            : '0 4px 20px rgba(0,0,0,0.06)'
        }}
      >
        <div className="flex">
          <div className="w-28 h-28 flex-shrink-0 relative overflow-hidden bg-white m-3 rounded-xl">
            <img
              src={product.images?.[0] || product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              } ${isHovered ? 'scale-105' : 'scale-100'}`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div 
                className="absolute inset-0 animate-pulse flex items-center justify-center transition-all duration-500"
                style={{ backgroundColor: `${colors.mediumBlue}10` }}
              >
                <Package 
                  size={20} 
                  style={{ color: colors.mediumBlue }}
                />
              </div>
            )}

            {product.stock === 0 && (
              <div 
                className="absolute inset-0 bg-black/60 flex items-center justify-center transition-all duration-500"
              >
                <span 
                  className="text-white text-xs font-semibold px-2 py-1 rounded-lg transition-all duration-500"
                  style={{ backgroundColor: `${colors.darkBlue}90` }}
                >
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 
                    className="font-semibold text-lg leading-tight transition-all duration-500 group-hover:translate-x-1"
                    style={{ color: colors.darkBlue }}
                  >
                    {product.name}
                  </h3>
                  <p 
                    className="text-sm bengali-text mt-1 transition-all duration-500 group-hover:translate-x-1"
                    style={{ color: colors.mediumBlue }}
                  >
                    {product.name_bn}
                  </p>
                </div>
                <button
                  onClick={toggleFavorite}
                  className="flex-shrink-0 ml-3 p-2 rounded-xl transition-all duration-500 transform hover:scale-110 hover:rotate-12"
                  style={{ 
                    backgroundColor: `${colors.mediumBlue}10`,
                    color: isFavorite ? colors.brown : colors.mediumBlue
                  }}
                >
                  <Heart
                    size={16}
                    className={isFavorite ? 'fill-current' : ''}
                  />
                </button>
              </div>

              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <MapPin 
                    size={12} 
                    style={{ color: colors.teal }}
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                  <span style={{ color: colors.mediumBlue }}>{product.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating || 0)}
                  <span 
                    className="font-semibold transition-all duration-500 group-hover:scale-110 inline-block"
                    style={{ color: colors.darkBlue }}
                  >
                    {product.rating || '0.0'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span 
                className="text-xl font-bold transition-all duration-500 transform hover:scale-105 inline-block"
                style={{ color: colors.darkBlue }}
              >
                {formatPrice(product.price)}
              </span>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="px-5 py-2.5 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 flex items-center space-x-2 text-sm border-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: product.stock === 0 ? `${colors.mediumBlue}30` : colors.teal,
                  color: colors.cream,
                  borderColor: product.stock === 0 ? `${colors.mediumBlue}30` : colors.teal
                }}
                onMouseEnter={(e) => {
                  if (product.stock !== 0) {
                    e.target.style.backgroundColor = colors.mediumBlue;
                    e.target.style.borderColor = colors.mediumBlue;
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = `0 6px 20px ${colors.teal}30`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (product.stock !== 0) {
                    e.target.style.backgroundColor = colors.teal;
                    e.target.style.borderColor = colors.teal;
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                <ShoppingCart size={14} />
                <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;