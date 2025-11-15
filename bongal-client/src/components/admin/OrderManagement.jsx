import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from '../../services/orderService';
import { formatPrice, formatDate } from '../../utils/helpers';
import { Package, User, Calendar, DollarSign, RefreshCw, Truck, CheckCircle, Clock, XCircle, ShoppingBag } from 'lucide-react';

const OrderManagement = () => {
  const queryClient = useQueryClient();
  
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
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-light">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Package className="text-red-600" size={32} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Orders</h3>
        <p className="text-gray-600 mb-4">Please try again later</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300"
        >
          Retry
        </button>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1.5 rounded-full text-sm font-semibold flex items-center space-x-1.5";
    const statusValue = status || 'pending';
    
    switch (statusValue) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'processing':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'shipped':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'delivered':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusIcon = (status) => {
    const statusValue = status || 'pending';
    
    switch (statusValue) {
      case 'pending':
        return <Clock size={14} />;
      case 'processing':
        return <RefreshCw size={14} />;
      case 'shipped':
        return <Truck size={14} />;
      case 'delivered':
        return <CheckCircle size={14} />;
      case 'cancelled':
        return <XCircle size={14} />;
      default:
        return <Clock size={14} />;
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-gray-600 text-lg font-light mt-2">
            {ordersList.length > 0 
              ? `Managing ${ordersList.length} customer orders` 
              : 'No orders yet. Orders will appear here when customers make purchases.'}
          </p>
        </div>
      </div>

      {ordersList.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { status: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
            { status: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
            { status: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
            { status: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
            { status: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
          ].map((stat) => (
            <div key={stat.status} className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-4 text-center">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-2`}>
                {getStatusIcon(stat.status)}
              </div>
              <p className="text-2xl font-bold text-gray-900">{statusCounts[stat.status]}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {ordersList.length > 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Package size={16} />
                      <span>Order</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <div className="flex items-center space-x-2">
                      <User size={16} />
                      <span>Customer</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} />
                      <span>Date</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <div className="flex items-center space-x-2">
                      <DollarSign size={16} />
                      <span>Total</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <div className="flex items-center space-x-2">
                      <RefreshCw size={16} />
                      <span>Status</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ordersList.map((order) => (
                  <tr key={order.id || order._id} className="hover:bg-gray-50 transition-colors duration-300">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900 font-mono text-sm">
                          #{((order.id || order._id)?.slice(-8) || 'N/A').toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {order.items?.length || 0} items
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {order.user?.name || order.customerName || 'Customer'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.user?.email || order.email || 'N/A'}
                        </p>
                        {order.shippingAddress && (
                          <p className="text-xs text-gray-400 mt-1">
                            {order.shippingAddress.city}, {order.shippingAddress.country}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gray-900 font-medium">
                          {formatDate(order.createdAt || order.date || new Date())}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt || order.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 text-lg">
                        {formatPrice(order.totalAmount || order.total || 0)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className={getStatusBadge(order.orderStatus || order.status)}>
                            {getStatusIcon(order.orderStatus || order.status)}
                            <span>
                              {(order.orderStatus || order.status || 'pending').charAt(0).toUpperCase() + 
                              (order.orderStatus || order.status || 'pending').slice(1)}
                            </span>
                          </span>
                        </div>
                        <select
                          value={order.orderStatus || order.status || 'pending'}
                          onChange={(e) =>
                            handleStatusChange(order.id || order._id, e.target.value)
                          }
                          disabled={updateStatusMutation.isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 text-sm bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        {updateStatusMutation.isLoading && updateStatusMutation.variables?.id === (order.id || order._id) && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <RefreshCw size={12} className="animate-spin" />
                            <span>Updating status...</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={32} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Orders Yet</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              When customers place orders, they will appear here for management. You can track order status, manage shipments, and view customer details.
            </p>
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
              <p className="text-blue-700 text-sm">
                Orders will automatically appear here once customers complete their purchases.
              </p>
            </div>
          </div>
        </div>
      )}

      {updateStatusMutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-red-800 text-sm font-medium">
            Error updating order status: {updateStatusMutation.error?.message || 'Please try again'}
          </p>
        </div>
      )}

      {updateStatusMutation.isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <p className="text-green-800 text-sm font-medium">
            Order status updated successfully!
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;