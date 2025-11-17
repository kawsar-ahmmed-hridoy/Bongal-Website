import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, MapPin, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  if (!product) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/60 p-6 text-center">
        <Package className="text-gray-400 mx-auto mb-3" size={32} />
        <p className="text-gray-600 font-medium">No product data</p>
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

  if (viewMode === 'grid') {
    return (
      <Link to={`/products/${product.id}`} className="block group">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col group-hover:border-gray-300">
          <div className="relative h-56 overflow-hidden bg-gray-100">
            <img
              src={product.images?.[0] || product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <Package className="text-gray-400" size={32} />
              </div>
            )}

            <button
              onClick={toggleFavorite}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-2xl shadow-sm hover:bg-white hover:shadow-md transition-all duration-300"
            >
              <Heart
                size={20}
                className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}
              />
            </button>

            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-semibold text-lg bg-gray-900/90 px-4 py-2 rounded-2xl">
                  Out of Stock
                </span>
              </div>
            )}

            {product.stock > 0 && product.stock < 10 && (
              <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1.5 rounded-2xl text-xs font-semibold">
                Only {product.stock} left
              </div>
            )}
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <div className="flex-1 space-y-3">
              <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-gray-700 transition-colors">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm bengali-text leading-relaxed">
                {product.name_bn}
              </p>

              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-gray-400" />
                <span className="text-gray-500 text-sm">{product.location}</span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-gray-900">
                    {product.rating || '0.0'}
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500 text-sm">
                  ({product.numReviews || product.reviews || 0} reviews)
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-gray-900 text-white py-3.5 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group/button"
              >
                <ShoppingCart size={18} className="group-hover/button:scale-110 transition-transform duration-300" />
                <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/products/${product.id}`} className="block group">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:border-gray-300">
        <div className="flex">
          <div className="w-32 h-32 flex-shrink-0 relative overflow-hidden bg-gray-100">
            <img
              src={product.images?.[0] || product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <Package className="text-gray-400" size={24} />
              </div>
            )}

            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-xs font-semibold bg-gray-900/90 px-2 py-1 rounded-lg">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 p-5 flex flex-col">
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-gray-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm bengali-text mt-1">
                    {product.name_bn}
                  </p>
                </div>
                <button
                  onClick={toggleFavorite}
                  className="flex-shrink-0 ml-3 p-2 hover:bg-gray-100 rounded-2xl transition-colors duration-300"
                >
                  <Heart
                    size={18}
                    className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}
                  />
                </button>
              </div>

              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <MapPin size={14} className="text-gray-400" />
                  <span className="text-gray-500">{product.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-gray-900">{product.rating || '0.0'}</span>
                  <span className="text-gray-400">({product.numReviews || 0})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="bg-gray-900 text-white px-6 py-2.5 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2 text-sm"
              >
                <ShoppingCart size={16} />
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