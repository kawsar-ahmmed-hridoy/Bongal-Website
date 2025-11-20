import { Link } from 'react-router-dom';
import { X, Plus, Minus, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  const handleQuantityIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60 hover:border-gray-300 transition-all duration-300 group">
      <div className="flex items-start space-x-4">
        <Link 
          to={`/products/${item.id}`} 
          className="flex-shrink-0 relative group/image"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={item.images?.[0] || item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-all duration-500 group-hover/image:scale-105"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-full h-full hidden items-center justify-center bg-gray-100">
              <Package size={24} className="text-gray-400" />
            </div>
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <Link to={`/products/${item.id}`}>
            <h3 className="font-semibold text-gray-900 text-lg leading-tight hover:text-gray-700 transition-colors duration-300 line-clamp-2">
              {item.name}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm bengali-text mt-1 leading-relaxed">
            {item.name_bn}
          </p>
          
          <div className="mt-3 flex items-center space-x-4">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(item.price)}
            </span>
            <span className="text-gray-400">×</span>
            <span className="text-gray-600 font-medium">{item.quantity}</span>
            <span className="text-gray-400">=</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl p-1">
            <button
              onClick={handleQuantityDecrease}
              className="w-10 h-10 flex items-center justify-center bg-white text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 font-semibold shadow-sm border border-gray-200"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            
            <span className="font-semibold text-gray-900 text-lg min-w-8 text-center">
              {item.quantity}
            </span>
            
            <button
              onClick={handleQuantityIncrease}
              className="w-10 h-10 flex items-center justify-center bg-white text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 font-semibold shadow-sm border border-gray-200"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            onClick={() => removeFromCart(item.id)}
            className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-all duration-300 px-3 py-2 rounded-xl hover:bg-red-50 font-medium text-sm group/remove"
            aria-label="Remove item from cart"
          >
            <X size={16} className="group-hover/remove:scale-110 transition-transform duration-300" />
            <span>Remove</span>
          </button>
        </div>
      </div>

      {item.stock && item.quantity > item.stock && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-yellow-800 text-sm font-medium">
            Only {item.stock} available in stock
          </p>
        </div>
      )}
    </div>
  );
};

export default CartItem;