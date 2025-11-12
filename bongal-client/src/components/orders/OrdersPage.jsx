import { useQuery } from "@tanstack/react-query";
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import OrderCard from './OrderCard';
import Loader from '../common/Loader';
import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const { user } = useAuth();
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['my-orders', user?.id],
    queryFn: orderService.getMyOrders,
    enabled: !!user,
    retry: 1,
    refetchOnWindowFocus: false
  });

  if (isLoading) return <Loader />;
  
  if (error) {
    console.error('Error loading orders:', error);
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center bg-white rounded-lg shadow-md p-8">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Orders</h2>
          <p className="text-gray-600 mb-6">Unable to load your orders. Please try again later.</p>
          <Link
            to="/products"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const ordersList = orders?.orders || orders || [];

  if (!ordersList || ordersList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center bg-white rounded-lg shadow-md p-8">
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
        <p className="text-sm text-gray-500 mt-2">
          Showing {ordersList.length} order{ordersList.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-4">
        {ordersList.map((order) => (
          <OrderCard key={order.id || order._id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;