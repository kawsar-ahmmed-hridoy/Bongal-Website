import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';

const OrderSummary = ({ onCheckout }) => {
  const { cartTotal, cartCount } = useCart();
  const deliveryFee = 0;
  const tax = Math.round(cartTotal * 0.05);
  const total = cartTotal + deliveryFee + tax;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({cartCount} items)</span>
          <span>{formatPrice(cartTotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Delivery Fee</span>
          <span className="text-green-600 font-semibold">Free</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax (5%)</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="border-t pt-3 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-green-600">{formatPrice(total)}</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
      >
        Proceed to Checkout
      </button>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Secure checkout with SSL encryption
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;