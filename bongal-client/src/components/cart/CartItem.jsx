import { Link } from 'react-router-dom';
import { X, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
      <Link to={`/products/${item.id}`}>
        <img
          src={item.images?.[0] || item.image}
          alt={item.name}
          className="w-24 h-24 object-cover rounded"
        />
      </Link>

      <div className="flex-1">
        <Link to={`/products/${item.id}`}>
          <h3 className="font-bold text-lg hover:text-green-600 transition">{item.name}</h3>
        </Link>
        <p className="text-sm text-gray-600 bengali-text">{item.name_bn}</p>
        <p className="text-green-600 font-semibold mt-2">{formatPrice(item.price)}</p>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          <Minus size={16} />
        </button>
        <span className="font-semibold w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="text-right">
        <p className="font-bold text-lg">{formatPrice(item.price * item.quantity)}</p>
      </div>

      <button
        onClick={() => removeFromCart(item.id)}
        className="text-red-500 hover:text-red-700 transition"
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default CartItem;