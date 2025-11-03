import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from '../../services/orderService';
import { formatPrice, formatDate } from '../../utils/helpers';

const OrderManagement = () => {
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useQuery('admin-orders', orderService.getAllOrders);

  const updateStatusMutation = useMutation(
    ({ id, status }) => orderService.updateOrderStatus(id, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-orders');
        alert('Order status updated successfully!');
      },
    }
  );

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Management</h1>

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
            {orders?.map((order) => (
              <tr key={order.id || order._id}>
                <td className="px-6 py-4 font-mono text-sm">
                  #{(order.id || order._id).slice(-8)}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold">{order.user?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{order.user?.email || 'N/A'}</p>
                  </div>
                </td>
                <td className="px-6 py-4">{formatDate(order.createdAt || order.date)}</td>
                <td className="px-6 py-4 font-semibold">
                  {formatPrice(order.totalAmount || order.total)}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.orderStatus || order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id || order._id, e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;