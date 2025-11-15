import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, Package, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';

const CartPage = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/cart');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 p-12">
              <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShoppingCart size={40} className="text-gray-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Your Cart is Empty</h2>
              <p className="text-gray-600 font-light mb-2 bengali-text">আপনার কার্ট খালি</p>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Explore our collection of authentic Bangladeshi products and add items to your cart.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center space-x-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 group"
                >
                  <Package size={20} className="group-hover:scale-110 transition-transform duration-300" />
                  <span>Continue Shopping</span>
                </Link>
                
                <Link
                  to="/"
                  className="inline-flex items-center justify-center space-x-3 bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300 border-2 border-gray-300 group"
                >
                  <ArrowLeft size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Shopping Cart</h1>
              <p className="text-gray-600 text-lg font-light">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            
            <button
              onClick={clearCart}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-all duration-300 px-4 py-2 rounded-2xl hover:bg-red-50 font-medium"
            >
              <Trash2 size={18} />
              <span>Clear Cart</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cart Items</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Continue Shopping</h3>
                  <p className="text-gray-600 text-sm">Discover more authentic products</p>
                </div>
                <Link
                  to="/products"
                  className="inline-flex items-center space-x-2 text-gray-900 hover:text-gray-700 transition-colors duration-300 font-medium"
                >
                  <span>Browse Products</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <OrderSummary onCheckout={handleCheckout} />
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-2xl border border-gray-200/60">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold text-lg">✓</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Secure Checkout</h4>
            <p className="text-gray-600 text-sm">Your payment information is protected</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-2xl border border-gray-200/60">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold text-lg">🚚</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Fast Delivery</h4>
            <p className="text-gray-600 text-sm">Quick shipping across Bangladesh</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-2xl border border-gray-200/60">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 font-bold text-lg">↩️</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Easy Returns</h4>
            <p className="text-gray-600 text-sm">30-day return policy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;