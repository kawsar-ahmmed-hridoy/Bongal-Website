import { useQuery } from "@tanstack/react-query";
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import OrderCard from './OrderCard';
import Loader from '../common/Loader';
import { Package, ShoppingBag, ArrowRight, Sparkles, RotateCcw, ArrowLeft, HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const OrdersPage = () => {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { 
    data: orders, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['my-orders', user?.id],
    queryFn: orderService.getMyOrders,
    enabled: !!user,
    retry: 1,
    refetchOnWindowFocus: false
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (isLoading) return <Loader />;
  
  if (error) {
    console.error('Error loading orders:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200/60 p-8 lg:p-12 transition-all duration-700 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Package size={48} className="text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Error Loading Orders</h2>
            <p className="text-gray-600 text-lg mb-2">We couldn't load your orders at this time.</p>
            <p className="text-gray-500 mb-8">Please check your connection and try again.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-blue-500 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
              >
                <RotateCcw size={20} className={refreshing ? 'animate-spin' : ''} />
                <span>{refreshing ? 'Refreshing...' : 'Try Again'}</span>
              </button>
              <Link
                to="/products"
                className="bg-gray-800 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-green-600 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
              >
                <ShoppingBag size={20} />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ordersList = orders?.orders || orders || [];

  if (!ordersList || ordersList.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-300/60 p-8 lg:p-16 transition-all duration-700 ${
            mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
          }`}>
            <div className="w-32 h-32 bg-gradient-to-br from-black-50 to-gray-80 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Package size={64}/>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">No Orders Yet</h2>
            <p className="text-gray-600 text-lg mb-2">You haven't placed any orders yet.</p>
            <p className="text-gray-500 mb-2 bengali-text">আপনার কোনো অর্ডার নেই</p>
            <p className="text-gray-400 text-sm mb-8">Start shopping to see your orders here</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/products"
                className="bg-gray-800 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-1 group"
              >
                <ShoppingBag size={20} />
                <span>Start Shopping</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <Link
                to="/"
                className="bg-white text-gray-800 px-6 py-4 rounded-2xl font-semibold border border-gray-500 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-2"
              >
                <ArrowLeft size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                <HomeIcon size={20} />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sortedOrders = [...ordersList].sort((a, b) => 
    new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
  );

  const orderStats = {
    total: sortedOrders.length,
    delivered: sortedOrders.filter(order => 
      ['delivered', 'completed'].includes(order?.orderStatus || order?.status)
    ).length,
    pending: sortedOrders.filter(order => 
      ['pending', 'processing', 'shipped'].includes(order?.orderStatus || order?.status)
    ).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className={`mb-8 lg:mb-12 transition-all duration-700 ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3 tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                My Orders
              </h1>
              <p className="text-gray-600 text-lg font-light bengali-text">আমার অর্ডার</p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border border-gray-200/60 shadow-sm">
                <div className="flex items-center space-x-2">
                  <Sparkles size={16} className="text-blue-500" />
                  <span className="text-sm font-semibold text-gray-700">
                    {orderStats.total} Order{orderStats.total !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center space-x-2"
              >
                <RotateCcw size={16} className={refreshing ? 'animate-spin text-blue-500' : 'text-gray-600'} />
                <span className="text-sm font-semibold text-gray-700">Refresh</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/60 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={20} className="text-blue-500" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/60 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{orderStats.delivered}</p>
                  <p className="text-sm text-gray-600">Delivered</p>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <Package size={20} className="text-green-500" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/60 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-600">{orderStats.pending}</p>
                  <p className="text-sm text-gray-600">In Progress</p>
                </div>
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Sparkles size={20} className="text-orange-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {sortedOrders.map((order, index) => (
            <div
              key={order.id || order._id}
              className={`transition-all duration-700 ${
                mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
              <OrderCard order={order} />
            </div>
          ))}
        </div>

        <div className={`mt-12 text-center transition-all duration-700 ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/60 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Ready for your next order?</h3>
            <p className="text-gray-600 mb-6">Discover new products and exclusive deals</p>
            <Link
              to="/products"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 group"
            >
              <ShoppingBag size={20} />
              <span>Continue Shopping</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;