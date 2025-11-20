import { useQuery } from "@tanstack/react-query";
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import OrderCard from './OrderCard';
import Loader from '../common/Loader';
import { Package, ShoppingBag, ArrowRight, Sparkles, RotateCcw, ArrowLeft, HomeIcon, Truck, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const COLORS = {
  primaryDark: '#011D4D',
  primary: '#034078',
  accent: '#1282A2',
  light: '#E4DFDA',
  brown: '#63372C'
};

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
      <div 
        className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-all duration-1000"
        style={{
          background: `linear-gradient(135deg, ${COLORS.light}15 0%, ${COLORS.primary}08 50%, ${COLORS.accent}05 100%)`
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className={`text-center backdrop-blur-sm rounded-3xl shadow-2xl border p-8 lg:p-12 transition-all duration-700 transform ${
            mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
          }`}
          style={{
            background: `linear-gradient(135deg, white 0%, ${COLORS.light}15 100%)`,
            borderColor: `${COLORS.light}60`
          }}>
            <div className="relative">
              <div 
                className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse-glow"
                style={{ backgroundColor: `${COLORS.light}40` }}
              >
                <Package size={48} style={{ color: COLORS.accent }} />
              </div>
              <div 
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full animate-ping"
                style={{ backgroundColor: COLORS.brown }}
              ></div>
            </div>
            <h2 
              className="text-3xl font-bold mb-4 tracking-tight bg-gradient-to-r bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${COLORS.primaryDark} 0%, ${COLORS.accent} 100%)`
              }}
            >
              Error Loading Orders
            </h2>
            <p className="text-lg mb-2" style={{ color: COLORS.primaryDark }}>
              We couldn't load your orders at this time.
            </p>
            <p className="mb-8 opacity-70" style={{ color: COLORS.primaryDark }}>
              Please check your connection and try again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
                  color: 'white'
                }}
              >
                <RotateCcw size={20} className={refreshing ? 'animate-spin' : ''} />
                <span>{refreshing ? 'Refreshing...' : 'Try Again'}</span>
              </button>
              <Link
                to="/products"
                className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 shadow-lg backdrop-blur-sm"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.light} 0%, white 100%)`,
                  color: COLORS.primaryDark,
                  border: `1px solid ${COLORS.light}`
                }}
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
      <div 
        className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-all duration-1000"
        style={{
          background: `linear-gradient(135deg, ${COLORS.light}15 0%, ${COLORS.primary}08 50%, ${COLORS.accent}05 100%)`
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className={`text-center backdrop-blur-sm rounded-3xl shadow-2xl border p-8 lg:p-16 transition-all duration-700 transform ${
            mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
          }`}
          style={{
            background: `linear-gradient(135deg, white 0%, ${COLORS.light}15 100%)`,
            borderColor: `${COLORS.light}60`
          }}>
            <div className="relative">
              <div 
                className="w-32 h-32 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg animate-float"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.light} 0%, white 100%)`,
                  border: `2px solid ${COLORS.light}80`
                }}
              >
                <Package size={64} style={{ color: COLORS.primary }} />
              </div>
              
              {[0, 1, 2].map((dot) => (
                <div
                  key={dot}
                  className="absolute w-2 h-2 rounded-full animate-float-slow"
                  style={{
                    backgroundColor: COLORS.accent,
                    animationDelay: `${dot * 0.6}s`,
                    top: `${20 + dot * 10}%`,
                    left: `${10 + dot * 25}%`
                  }}
                />
              ))}
            </div>
            
            <h2 
              className="text-3xl font-bold mb-4 tracking-tight bg-gradient-to-r bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${COLORS.primaryDark} 0%, ${COLORS.accent} 100%)`
              }}
            >
              No Orders Yet
            </h2>
            <p className="text-lg mb-2 opacity-90" style={{ color: COLORS.primaryDark }}>
              You haven't placed any orders yet.
            </p>
            <p className="mb-2 bengali-text font-medium opacity-80" style={{ color: COLORS.primary }}>
              আপনার কোনো অর্ডার নেই
            </p>
            <p className="text-sm mb-8 opacity-60" style={{ color: COLORS.primaryDark }}>
              Start shopping to see your orders here
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/products"
                className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-3 group shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
                  color: 'white'
                }}
              >
                <ShoppingBag size={20} />
                <span>Start Shopping</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <Link
                to="/"
                className="px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-3 group shadow-lg backdrop-blur-sm"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.light} 0%, white 100%)`,
                  color: COLORS.primaryDark,
                  border: `1px solid ${COLORS.light}`
                }}
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
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
    <div 
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-all duration-1000"
      style={{
        background: `linear-gradient(135deg, ${COLORS.cream} 0%, ${COLORS.cream}dd 50%, ${COLORS.cream}bb 100%)`
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className={`mb-8 lg:mb-12 transition-all duration-700 transform ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 
                className="text-4xl lg:text-5xl font-bold mb-3 tracking-tight bg-gradient-to-r bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${COLORS.primaryDark} 0%, ${COLORS.accent} 100%)`
                }}
              >
                My Orders
              </h1>
              <p 
                className="text-lg font-light bengali-text opacity-80"
                style={{ color: COLORS.primaryDark }}
              >
                আমার অর্ডার
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="backdrop-blur-sm rounded-2xl px-4 py-2 border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center space-x-2"
                style={{
                  background: `linear-gradient(135deg, white 0%, ${COLORS.light}15 100%)`,
                  borderColor: `${COLORS.light}60`,
                  color: COLORS.primaryDark
                }}
              >
                <RotateCcw size={16} className={refreshing ? 'animate-spin' : ''} style={{ color: COLORS.accent }} />
                <span className="text-sm font-semibold">Refresh</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div 
              className="backdrop-blur-sm rounded-2xl p-4 border shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105"
              style={{
                background: `linear-gradient(135deg, white 0%, ${COLORS.light}15 100%)`,
                borderColor: `${COLORS.light}60`
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold" style={{ color: COLORS.primaryDark }}>
                    {orderStats.total}
                  </p>
                  <p className="text-sm opacity-70" style={{ color: COLORS.primaryDark }}>
                    Total Orders
                  </p>
                </div>
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                  style={{ backgroundColor: `${COLORS.primary}15` }}
                >
                  <ShoppingBag size={20} style={{ color: COLORS.primary }} />
                </div>
              </div>
            </div>
            
            <div 
              className="backdrop-blur-sm rounded-2xl p-4 border shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105"
              style={{
                background: `linear-gradient(135deg, white 0%, ${COLORS.light}15 100%)`,
                borderColor: `${COLORS.light}60`
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold" style={{ color: COLORS.accent }}>
                    {orderStats.delivered}
                  </p>
                  <p className="text-sm opacity-70" style={{ color: COLORS.primaryDark }}>
                    Delivered
                  </p>
                </div>
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                  style={{ backgroundColor: `${COLORS.accent}15` }}
                >
                  <CheckCircle size={20} style={{ color: COLORS.accent }} />
                </div>
              </div>
            </div>
            
            <div 
              className="backdrop-blur-sm rounded-2xl p-4 border shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105"
              style={{
                background: `linear-gradient(135deg, white 0%, ${COLORS.light}15 100%)`,
                borderColor: `${COLORS.light}60`
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold" style={{ color: COLORS.brown }}>
                    {orderStats.pending}
                  </p>
                  <p className="text-sm opacity-70" style={{ color: COLORS.primaryDark }}>
                    In Progress
                  </p>
                </div>
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                  style={{ backgroundColor: `${COLORS.brown}15` }}
                >
                  <Clock size={20} style={{ color: COLORS.brown }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {sortedOrders.map((order, index) => (
            <div
              key={order.id || order._id}
              className={`transition-all duration-700 transform ${
                mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
              <OrderCard order={order} />
            </div>
          ))}
        </div>

        <div className={`mt-12 text-center transition-all duration-700 transform ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div 
            className="backdrop-blur-sm rounded-3xl p-8 border shadow-2xl"
            style={{
              background: `linear-gradient(135deg, white 0%, ${COLORS.light}15 100%)`,
              borderColor: `${COLORS.light}60`
            }}
          >
            <h3 
              className="text-2xl font-bold mb-4 tracking-tight"
              style={{ color: COLORS.primaryDark }}
            >
              Ready for your next order?
            </h3>
            <p className="mb-6 opacity-80" style={{ color: COLORS.primaryDark }}>
              Discover new products and exclusive deals
            </p>
            <Link
              to="/products"
              className="inline-flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 group shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
                color: 'white'
              }}
            >
              <ShoppingBag size={20} />
              <span>Continue Shopping</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-5px) translateX(2px);
          }
          66% {
            transform: translateY(3px) translateX(-2px);
          }
        }
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default OrdersPage;