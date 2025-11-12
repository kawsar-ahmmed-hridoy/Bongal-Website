import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from '../../services/orderService';
import { formatPrice, formatDate } from '../../utils/helpers';

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
      alert('Order status updated successfully!');
    },
    onError: (error) => {
      alert('Failed to update order status: ' + (error.message || 'Please try again'));
    }
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  const ordersList = orders?.orders || orders || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading orders. Please try again later.
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-semibold";
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

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-2">
            {ordersList.length > 0 
              ? `Managing ${ordersList.length} orders` 
              : 'No orders yet. Orders will appear here when customers make purchases.'}
          </p>
        </div>
      </div>

      {ordersList.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ordersList.map((order) => (
                <tr key={order.id || order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm">
                    #{((order.id || order._id)?.slice(-8) || 'N/A').toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold">{order.user?.name || order.customerName || 'Customer'}</p>
                      <p className="text-sm text-gray-500">{order.user?.email || order.email || 'N/A'}</p>
                      {order.shippingAddress && (
                        <p className="text-xs text-gray-400 mt-1">
                          {order.shippingAddress.city}, {order.shippingAddress.country}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {formatDate(order.createdAt || order.date || new Date())}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {formatPrice(order.totalAmount || order.total || 0)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className={getStatusBadge(order.orderStatus || order.status)}>
                        {(order.orderStatus || order.status || 'pending').charAt(0).toUpperCase() + 
                         (order.orderStatus || order.status || 'pending').slice(1)}
                      </span>
                      <select
                        value={order.orderStatus || order.status || 'pending'}
                        onChange={(e) =>
                          handleStatusChange(order.id || order._id, e.target.value)
                        }
                        disabled={updateStatusMutation.isLoading}
                        className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    {updateStatusMutation.isLoading && updateStatusMutation.variables?.id === (order.id || order._id) && (
                      <span className="text-xs text-gray-500 mt-1">Updating...</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-4">
              When customers place orders, they will appear here for management.
            </p>
            <p className="text-sm text-gray-500">
              You can manage order status, track shipments, and view customer details.
            </p>
          </div>
        </div>
      )}

      {updateStatusMutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
          <p className="text-red-800 text-sm">
            Error updating order status: {updateStatusMutation.error?.message || 'Please try again'}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;