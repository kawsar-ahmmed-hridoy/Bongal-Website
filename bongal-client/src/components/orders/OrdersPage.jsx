import { useQuery } from "@tanstack/react-query";
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import OrderCard from './OrderCard';
import Loader from '../common/Loader';
import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const { user } = useAuth();
  const { data: orders, isLoading, error } = useQuery(
    'my-orders',
    orderService.getMyOrders,
    { enabled: !!user }
  );

  if (isLoading) return <Loader />;
  if (error) return <div className="text-center py-8 text-red-600">Error loading orders</div>;

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center bg-white rounded-lg shadow-md p-16">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6 bengali-text">আপনার কোনো অর্ডার নেই</p>
          <Link
            to="/products"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600 bengali-text">আমার অর্ডার</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id || order._id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;