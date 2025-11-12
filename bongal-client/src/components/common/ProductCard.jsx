import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = React.useState(false);

  if (!product) {
    return <div className="p-4 border rounded-lg">No product data</div>;
  }

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link to={`/products/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">

        <div className="relative h-48 overflow-hidden">
          <img
            src={product.images?.[0] || product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
          <button
            onClick={toggleFavorite}
            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
          >
            <Heart
              size={20}
              className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}
            />
          </button>
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-lg mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2 bengali-text">{product.name_bn}</p>

          <div className="flex items-center space-x-1 mb-2">
            <MapPin size={14} className="text-gray-500" />
            <span className="text-sm text-gray-600">{product.location}</span>
          </div>

          <div className="flex items-center space-x-1 mb-3">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold">{product.rating || 0}</span>
            <span className="text-sm text-gray-500">
              ({product.numReviews || product.reviews || 0} reviews)
            </span>
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold text-green-600">
                {formatPrice(product.price)}
              </span>
              {product.stock > 0 && product.stock < 10 && (
                <span className="text-xs text-orange-600 font-semibold">
                  Only {product.stock} left!
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <ShoppingCart size={18} />
              <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;