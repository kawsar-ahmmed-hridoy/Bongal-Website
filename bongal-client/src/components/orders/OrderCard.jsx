import { formatPrice, formatDate } from '../../utils/helpers';
import { Package, Truck, CheckCircle, XCircle } from 'lucide-react';

const OrderCard = ({ order }) => {
  const getStatusIcon = () => {
    switch (order.orderStatus || order.status) {
      case 'delivered':
        return <CheckCircle className="text-green-600" size={24} />;
      case 'shipped':
        return <Truck className="text-blue-600" size={24} />;
      case 'cancelled':
        return <XCircle className="text-red-600" size={24} />;
      default:
        return <Package className="text-yellow-600" size={24} />;
    }
  };

  const getStatusColor = () => {
    switch (order.orderStatus || order.status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-bold text-lg">Order #{order.id || order._id}</h3>
            <p className="text-sm text-gray-600">
              {formatDate(order.createdAt || order.date)}
            </p>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor()}`}>
          {(order.orderStatus || order.status).charAt(0).toUpperCase() + 
           (order.orderStatus || order.status).slice(1)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-700">
              {item.product?.name || item.name} x {item.quantity}
            </span>
            <span className="font-semibold">
              {formatPrice((item.product?.price || item.price) * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t pt-3">
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">Total</span>
          <span className="font-bold text-xl text-green-600">
            {formatPrice(order.totalAmount || order.total)}
          </span>
        </div>
      </div>

      {order.shippingAddress && (
        <div className="mt-4 text-sm text-gray-600">
          <p className="font-semibold">Shipping Address:</p>
          <p>{order.shippingAddress}</p>
        </div>
      )}
    </div>
  );
};

export default OrderCard;