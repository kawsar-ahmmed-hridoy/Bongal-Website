import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/helpers';
import { Shield, Truck, Lock, ArrowRight, Package } from 'lucide-react';

const OrderSummary = ({ onCheckout }) => {
  const { cartTotal, cartCount } = useCart();
  const { user } = useAuth();

  const deliveryFee = cartTotal >= 500 ? 0 : 60;
  const tax = Math.round(cartTotal * 0.05);
  const total = cartTotal + deliveryFee + tax;

  const originalTotal = cartTotal + (cartTotal >= 500 ? 0 : 60);
  const savings = originalTotal - total;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 p-6 sticky top-24">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center">
          <Package className="text-white" size={20} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
          <p className="text-gray-600 text-sm">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Subtotal</span>
          <span className="text-gray-900 font-semibold">{formatPrice(cartTotal)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Delivery</span>
          <div className="text-right">
            {deliveryFee === 0 ? (
              <div className="flex items-center space-x-1 text-green-600">
                <span className="font-semibold">Free</span>
                <Truck size={16} />
              </div>
            ) : (
              <span className="text-gray-900 font-semibold">{formatPrice(deliveryFee)}</span>
            )}
            {cartTotal < 500 && (
              <p className="text-xs text-gray-500 mt-1">
                Free delivery on orders over ৳500
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">VAT (5%)</span>
          <span className="text-gray-900 font-semibold">{formatPrice(tax)}</span>
        </div>

        {savings > 0 && (
          <div className="flex justify-between items-center bg-green-50 rounded-2xl p-3 border border-green-200">
            <span className="text-green-800 font-medium text-sm">You save</span>
            <span className="text-green-800 font-bold text-sm">{formatPrice(savings)}</span>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <div className="text-right">
            <span className="text-2xl font-bold text-gray-900">{formatPrice(total)}</span>
            {tax > 0 && (
              <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={cartCount === 0}
        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-3 group"
      >
        <span>{'Proceed to Checkout'}</span>
        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
      </button>

      <div className="mt-6 space-y-4">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl border border-gray-200">
          <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
            <Lock size={16} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Secure Checkout</p>
            <p className="text-xs text-gray-600">SSL encrypted payment</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl border border-gray-200">
          <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
            <Truck size={16} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Delivery Promise</p>
            <p className="text-xs text-gray-600">2-5 business days in Bangladesh</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl border border-gray-200">
          <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
            <Shield size={16} className="text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Customer Support</p>
            <p className="text-xs text-gray-600">24/7 WhatsApp support available</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-600 mb-3 text-center">We Accept</p>
        <div className="flex justify-center space-x-3">
          {['bkash', 'nagad', 'rocket', 'card'].map((method) => (
            <div key={method} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600 uppercase">
                {method === 'bkash' ? 'bK' : method === 'nagad' ? 'NG' : method === 'rocket' ? 'RK' : 'CD'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;