import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { formatPrice, formatDate } from '../../utils/helpers';
import { Package, User, Calendar, DollarSign, RefreshCw, Truck, CheckCircle, Clock, XCircle, ShoppingBag, X, Phone, Mail, MapPin, CreditCard, Eye, TrendingUp, Zap } from 'lucide-react';

const COLORS = {
  darkBlue: '#011D4D',
  mediumBlue: '#034078',
  teal: '#1282A2',
  cream: '#E4DFDA',
  brown: '#63372C'
};

const OrderManagement = () => {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: orderService.getAllOrders,
    retry: 1,
    refetchOnWindowFocus: false
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (error) => {
      console.error('Failed to update order status:', error);
    }
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  const ordersList = orders?.orders || orders || [];

  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 text-sm font-light">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Package className="text-red-600" size={24} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Orders</h3>
        <p className="text-gray-600 text-sm mb-4">Please try again later</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 transition-all duration-300";
    const statusValue = status || 'pending';

    switch (statusValue) {
      case 'pending':
        return `${baseClasses} bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100`;
      case 'processing':
        return `${baseClasses} bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100`;
      case 'shipped':
        return `${baseClasses} bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100`;
      case 'delivered':
        return `${baseClasses} bg-green-50 text-green-700 border border-green-200 hover:bg-green-100`;
      case 'cancelled':
        return `${baseClasses} bg-red-50 text-red-700 border border-red-200 hover:bg-red-100`;
      default:
        return `${baseClasses} bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100`;
    }
  };

  const getStatusIcon = (status) => {
    const statusValue = status || 'pending';

    switch (statusValue) {
      case 'pending':
        return <Clock size={12} />;
      case 'processing':
        return <RefreshCw size={12} />;
      case 'shipped':
        return <Truck size={12} />;
      case 'delivered':
        return <CheckCircle size={12} />;
      case 'cancelled':
        return <XCircle size={12} />;
      default:
        return <Clock size={12} />;
    }
  };

  const getStatusCounts = () => {
    const counts = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      total: ordersList.length
    };

    ordersList.forEach(order => {
      const status = order.orderStatus || order.status || 'pending';
      if (counts[status] !== undefined) {
        counts[status]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      <div className={`flex justify-between items-center transition-all duration-700 transform ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-gray-600 text-sm font-light mt-1">
            {ordersList.length > 0
              ? `Managing ${ordersList.length} customer orders`
              : 'No orders yet. Orders will appear here when customers make purchases.'}
          </p>
        </div>
        {ordersList.length > 0 && (
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-gray-200/60 shadow-sm">
            <Zap size={16} className="text-blue-500" />
            <span className="text-xs font-semibold text-gray-700">Live Orders</span>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>

      {ordersList.length > 0 && (
        <div className={`grid grid-cols-2 md:grid-cols-5 gap-3 transition-all duration-700 transform ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          {[
            { status: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', bgColor: COLORS.cream },
            { status: 'processing', label: 'Processing', color: 'bg-blue-100 text-white-800', bgColor: COLORS.teal },
            { status: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800', bgColor: COLORS.cream },
            { status: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800', bgColor: COLORS.teal },
            { status: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800', bgColor: COLORS.cream }
          ].map((stat, index) => (
            <div 
              key={stat.status} 
              className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-3 text-center hover:shadow-md transition-all duration-300 transform hover:scale-105 group"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: stat.bgColor }}
              >
                {getStatusIcon(stat.status)}
              </div>
              <p className="text-lg font-bold text-gray-900">{statusCounts[stat.status]}</p>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {ordersList.length > 0 ? (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden transition-all duration-700 transform ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Package size={14} />
                      <span>Order</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                    <div className="flex items-center space-x-2">
                      <User size={14} />
                      <span>Customer</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} />
                      <span>Date</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                    <div className="flex items-center space-x-2">
                      <DollarSign size={14} />
                      <span>Total</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                    <div className="flex items-center space-x-2">
                      <RefreshCw size={14} />
                      <span>Status</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Eye size={14} />
                      <span>Actions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ordersList.map((order, index) => (
                  <tr
                    key={order.id || order._id}
                    className="hover:bg-gray-50 transition-all duration-300 group"
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-gray-900 font-mono text-sm">
                          #{((order.id || order._id)?.slice(-6) || 'N/A').toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {order.items?.length || 0} items
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {order.shippingAddress?.fullName || order.user?.name || 'Guest Customer'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.shippingAddress?.phone || order.user?.phone || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-gray-900 font-medium text-sm">
                          {formatDate(order.createdAt || order.date || new Date())}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt || order.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-900 text-sm">
                        {formatPrice(order.totalAmount || order.total || 0)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className={getStatusBadge(order.orderStatus || order.status)}>
                            {getStatusIcon(order.orderStatus || order.status)}
                            <span className="text-xs">
                              {(order.orderStatus || order.status || 'pending').slice(0, 10)}
                            </span>
                          </span>
                        </div>
                        <select
                          value={order.orderStatus || order.status || 'pending'}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleStatusChange(order.id || order._id, e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          disabled={updateStatusMutation.isLoading}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 text-xs bg-white disabled:bg-gray-100 disabled:cursor-not-allowed hover:border-gray-400"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        {updateStatusMutation.isLoading && updateStatusMutation.variables?.id === (order.id || order._id) && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <RefreshCw size={10} className="animate-spin" />
                            <span>Updating...</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 group"
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200/60 p-8 text-center transition-all duration-700 transform ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={28} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No Orders Yet</h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              When customers place orders, they will appear here for management. You can track order status, manage shipments, and view customer details.
            </p>
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
              <p className="text-blue-700 text-xs">
                Orders will automatically appear here once customers complete their purchases.
              </p>
            </div>
          </div>
        </div>
      )}

      {updateStatusMutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-red-800 text-xs font-medium">
            Error updating order status: {updateStatusMutation.error?.message || 'Please try again'}
          </p>
        </div>
      )}

      {updateStatusMutation.isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
          <p className="text-green-800 text-xs font-medium">
            Order status updated successfully!
          </p>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-xl">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <p className="text-gray-600 font-mono text-xs mt-0.5">
                  #{((selectedOrder.id || selectedOrder._id)?.slice(-6) || 'N/A').toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-md font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <User size={16} />
                  Customer Information
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Full Name</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {selectedOrder.shippingAddress?.fullName || selectedOrder.user?.name || 'Guest Customer'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <Phone size={12} />
                      Phone Number
                    </p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {selectedOrder.shippingAddress?.phone || selectedOrder.user?.phone || 'N/A'}
                    </p>
                  </div>
                  {selectedOrder.shippingAddress?.email && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                        <Mail size={12} />
                        Email
                      </p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {selectedOrder.shippingAddress.email}
                      </p>
                    </div>
                  )}
                  {selectedOrder.user?.email && !selectedOrder.shippingAddress?.email && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                        <Mail size={12} />
                        Email
                      </p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {selectedOrder.user.email}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-md font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin size={16} />
                  Shipping Address
                </h3>
                <div className="space-y-1">
                  <p className="text-gray-900 text-sm">
                    {selectedOrder.shippingAddress?.address || 'N/A'}
                  </p>
                  <p className="text-gray-700 text-sm">
                    {selectedOrder.shippingAddress?.city || 'N/A'}
                    {selectedOrder.shippingAddress?.postalCode && ` - ${selectedOrder.shippingAddress.postalCode}`}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-md font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Package size={16} />
                  Order Items
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {item.product?.images?.[0] && (
                          <img
                            src={item.product.images[0]}
                            alt={item.product?.name || 'Product'}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {item.product?.name || 'Product'}
                          </p>
                          <p className="text-xs text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-xs text-gray-600">
                            Price: {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-gray-900 text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-md font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <CreditCard size={16} />
                    Payment Method
                  </h3>
                  <p className="font-semibold text-gray-900 text-sm capitalize">
                    {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : selectedOrder.paymentMethod || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Payment Status: <span className="font-semibold capitalize">{selectedOrder.paymentStatus || 'Pending'}</span>
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-md font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign size={16} />
                    Order Summary
                  </h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-gray-700 text-sm">
                      <span>Subtotal</span>
                      <span>{formatPrice(selectedOrder.totalAmount || 0)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 text-sm">
                      <span>Delivery Fee</span>
                      <span className="text-green-600 font-semibold">Free</span>
                    </div>
                    <div className="border-t pt-1 flex justify-between font-bold text-md">
                      <span>Total</span>
                      <span className="text-green-600">{formatPrice(selectedOrder.totalAmount || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-md font-bold text-gray-900 mb-3">Additional Notes</h3>
                  <p className="text-gray-700 text-sm">{selectedOrder.notes}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-md font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar size={16} />
                  Order Information
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Order Status</p>
                    <span className={getStatusBadge(selectedOrder.orderStatus || selectedOrder.status)}>
                      {getStatusIcon(selectedOrder.orderStatus || selectedOrder.status)}
                      <span className="text-xs">
                        {(selectedOrder.orderStatus || selectedOrder.status || 'pending').charAt(0).toUpperCase() +
                          (selectedOrder.orderStatus || selectedOrder.status || 'pending').slice(1)}
                      </span>
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Order Date</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {formatDate(selectedOrder.createdAt || selectedOrder.date || new Date())}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(selectedOrder.createdAt || selectedOrder.date).toLocaleTimeString()}
                    </p>
                  </div>
                  {selectedOrder.deliveredAt && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Delivered Date</p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {formatDate(selectedOrder.deliveredAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;