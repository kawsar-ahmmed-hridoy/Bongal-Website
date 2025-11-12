import { formatPrice, formatDate } from '../../utils/helpers';
import { Package, Truck, CheckCircle, XCircle } from 'lucide-react';

const OrderCard = ({ order }) => {
  const getStatusIcon = () => {
    const status = order.orderStatus || order.status || 'pending';
    switch (status) {
      case 'delivered':
      case 'completed':
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
    const status = order.orderStatus || order.status || 'pending';
    switch (status) {
      case 'delivered':
      case 'completed':
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

  const getStatusText = () => {
    const status = order.orderStatus || order.status || 'pending';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const orderItems = order.items || order.products || [];
  const orderTotal = order.totalAmount || order.total || 0;
  const orderDate = order.createdAt || order.date || new Date();
  const orderId = order.id || order._id || 'N/A';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-bold text-lg text-gray-900">Order #{orderId.slice(-8).toUpperCase()}</h3>
            <p className="text-sm text-gray-600">
              {formatDate(orderDate)}
            </p>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor()} self-start sm:self-auto`}>
          {getStatusText()}
        </span>
      </div>

      {orderItems.length > 0 ? (
        <div className="space-y-3 mb-4">
          {orderItems.map((item, index) => {
            const itemName = item.product?.name || item.name || 'Product';
            const itemPrice = item.product?.price || item.price || 0;
            const itemQuantity = item.quantity || 1;
            
            return (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex-1">
                  <span className="text-gray-800 font-medium">{itemName}</span>
                  {item.product?.category && (
                    <span className="text-gray-500 text-xs ml-2">({item.product.category})</span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-gray-700">x{itemQuantity}</span>
                  <span className="font-semibold text-gray-900 ml-2">
                    {formatPrice(itemPrice * itemQuantity)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mb-4 text-center py-4 text-gray-500">
          No items in this order
        </div>
      )}

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg text-gray-900">Total</span>
          <span className="font-bold text-xl text-green-600">
            {formatPrice(orderTotal)}
          </span>
        </div>
      </div>

      {order.shippingAddress && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="font-semibold text-sm text-gray-700 mb-1">Shipping Address:</p>
          <p className="text-sm text-gray-600">
            {typeof order.shippingAddress === 'string' 
              ? order.shippingAddress 
              : `${order.shippingAddress.street || ''}, ${order.shippingAddress.city || ''}, ${order.shippingAddress.country || ''}`
            }
          </p>
        </div>
      )}

      {order.paymentStatus && (
        <div className="mt-3">
          <span className={`text-xs px-2 py-1 rounded ${
            order.paymentStatus === 'paid' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
          </span>
        </div>
      )}
    </div>
  );
};

export default OrderCard;