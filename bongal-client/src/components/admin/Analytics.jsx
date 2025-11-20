import { useQuery } from "@tanstack/react-query";
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, ArrowUp, ArrowDown, Sparkles, AlertTriangle, BarChart3, Eye, Zap } from 'lucide-react';
import { formatPrice, formatDate } from '../../utils/helpers';
import { useState, useEffect } from 'react';

const COLORS = {
  darkBlue: '#011D4D',
  mediumBlue: '#034078',
  teal: '#1282A2',
  cream: '#E4DFDA',
  brown: '#63372C'
};

const Analytics = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: products, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['analytics-products'],
    queryFn: () => productService.getAllProducts({}),
    retry: 1,
    refetchOnWindowFocus: false
  });

  const { data: orders, isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ['analytics-orders'],
    queryFn: orderService.getAllOrders,
    retry: 1,
    refetchOnWindowFocus: false
  });

  const productsList = products?.products || products || [];
  const ordersList = orders?.orders || orders || [];

  const hasProducts = Array.isArray(productsList) && productsList.length > 0;
  const hasOrders = Array.isArray(ordersList) && ordersList.length > 0;

  const stats = {
    totalProducts: hasProducts ? productsList.length : 0,
    totalOrders: hasOrders ? ordersList.length : 0,
    totalRevenue: hasOrders ? ordersList.reduce((sum, order) => {
      const isCompleted = ['delivered', 'completed'].includes(order?.orderStatus || order?.status);
      const amount = isCompleted ? (order?.totalAmount || order?.total || 0) : 0;
      return sum + (typeof amount === 'number' ? amount : 0);
    }, 0) : 0,
    pendingOrders: hasOrders ? ordersList.filter((o) => 
      (o?.orderStatus || o?.status) === 'pending'
    ).length : 0,
    lowStockProducts: hasProducts ? productsList.filter((p) => (p?.stock || 0) < 10).length : 0,
  };

  const trends = {
    revenueTrend: 12.5,
    orderTrend: 8.2,
    productTrend: -2.1,
    conversionTrend: 15.7
  };

  const statCards = [
    {
      title: 'Total Products',
      value: hasProducts ? stats.totalProducts : '0',
      icon: Package,
      color: COLORS.mediumBlue,
      trend: trends.productTrend,
      description: hasProducts ? 'Active products' : 'Add products to start',
      delay: 100
    },
    {
      title: 'Total Orders',
      value: hasOrders ? stats.totalOrders : '0',
      icon: ShoppingBag,
      color: COLORS.teal,
      trend: trends.orderTrend,
      description: hasOrders ? 'All time orders' : 'No orders yet',
      delay: 200
    },
    {
      title: 'Pending Orders',
      value: hasOrders ? stats.pendingOrders : '0',
      icon: AlertTriangle,
      color: COLORS.brown,
      trend: 0,
      description: hasOrders ? 'Awaiting processing' : 'All processed',
      delay: 300
    },
    {
      title: 'Total Revenue',
      value: hasOrders ? formatPrice(stats.totalRevenue) : '$0',
      icon: DollarSign,
      color: COLORS.darkBlue,
      trend: trends.revenueTrend,
      description: hasOrders ? 'From completed orders' : 'Start selling',
      delay: 400
    },
  ];

  const recentOrders = hasOrders ? ordersList
    .sort((a, b) => new Date(b?.createdAt || b?.date) - new Date(a?.createdAt || a?.date))
    .slice(0, 5) : [];

  const lowStockProducts = hasProducts ? 
    productsList.filter((p) => (p?.stock || 0) < 10).slice(0, 5) : [];

  const getStatusBadge = (status) => {
    const baseClasses = "text-xs px-2 py-1 rounded-full font-semibold transition-all duration-300";
    const statusValue = status || 'pending';
    
    switch (statusValue) {
      case 'pending':
        return `${baseClasses} bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100`;
      case 'processing':
        return `${baseClasses} bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100`;
      case 'shipped':
        return `${baseClasses} bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100`;
      case 'delivered':
      case 'completed':
        return `${baseClasses} bg-green-50 text-green-700 border border-green-200 hover:bg-green-100`;
      case 'cancelled':
        return `${baseClasses} bg-red-50 text-red-700 border border-red-200 hover:bg-red-100`;
      default:
        return `${baseClasses} bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100`;
    }
  };

  const getStockBadge = (stock) => {
    const stockValue = stock || 0;
    const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold transition-all duration-300";
    
    if (stockValue === 0) return `${baseClasses} bg-red-50 text-red-700 border border-red-200 hover:bg-red-100`;
    if (stockValue < 5) return `${baseClasses} bg-red-50 text-red-700 border border-red-200 hover:bg-red-100`;
    if (stockValue < 10) return `${baseClasses} bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100`;
    return `${baseClasses} bg-green-50 text-green-700 border border-green-200 hover:bg-green-100`;
  };

  const AnimatedNumber = ({ value, duration = 1500 }) => {
    const [displayValue, setDisplayValue] = useState(0);
    
    useEffect(() => {
      if (typeof value === 'number') {
        const startTime = Date.now();
        const startValue = displayValue;
        const endValue = value;
        
        const updateValue = () => {
          const now = Date.now();
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          const current = Math.floor(startValue + (endValue - startValue) * progress);
          setDisplayValue(current);
          
          if (progress < 1) {
            requestAnimationFrame(updateValue);
          }
        };
        
        requestAnimationFrame(updateValue);
      }
    }, [value, duration, displayValue]);
    
    if (typeof value !== 'number') return value;
    
    return displayValue.toLocaleString();
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-200/60 animate-pulse">
            <div className="w-10 h-10 bg-gray-200 rounded-xl mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    </div>
  );

  if (productsLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/30 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (productsError || ordersError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/30 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="text-red-500" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load analytics</h3>
          <p className="text-gray-600 text-sm mb-4">Please check your connection and try again</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/30 p-4">
      <div className="max-w-7xl mx-auto">
        <div className={`mb-6 transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 text-sm font-light max-w-2xl">
                {hasOrders || hasProducts 
                  ? 'Real-time insights and performance metrics' 
                  : 'Add products and make sales to unlock analytics'
                }
              </p>
            </div>
            {hasOrders && (
              <div className="mt-3 lg:mt-0 flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-gray-200/60 shadow-sm">
                <Zap size={16} className="text-blue-500" />
                <span className="text-xs font-semibold text-gray-700">Live Data</span>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-500 transform hover:scale-105 group ${
                  mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{
                  transitionDelay: `${stat.delay}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: stat.color }}
                  >
                    <Icon size={20} />
                  </div>
                  {stat.trend !== 0 && (
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      stat.trend > 0 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {stat.trend > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                      <span>{Math.abs(stat.trend)}%</span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-gray-600 text-xs font-medium mb-1 uppercase tracking-wide">{stat.title}</h3>
                <p className="text-xl font-bold text-gray-900 mb-1 tracking-tight">
                  {typeof stat.value === 'string' && stat.value.startsWith('$') 
                    ? stat.value 
                    : <AnimatedNumber value={parseInt(stat.value) || 0} />
                  }
                </p>
                <p className="text-xs text-gray-500 font-medium">{stat.description}</p>
                
                <div className="mt-3 w-full bg-gray-100 rounded-full h-1">
                  <div 
                    className="h-1 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: mounted ? `${Math.min((parseInt(stat.value) / 100) * 100, 100)}%` : '0%',
                      backgroundColor: stat.color
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
          <div className={`bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-sm transition-all duration-700 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Recent Orders</h2>
                <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={16} className="text-blue-600" />
                </div>
              </div>
              
              <div className="space-y-3">
                {hasOrders && recentOrders.length > 0 ? (
                  recentOrders.map((order, index) => (
                    <div
                      key={order?.id || order?._id}
                      className="flex justify-between items-center p-3 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-all duration-300 transform hover:scale-[1.02] group cursor-pointer border border-transparent hover:border-gray-200"
                      style={{
                        transitionDelay: `${index * 100}ms`
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-xs shadow-sm"
                          style={{ backgroundColor: COLORS.teal }}
                        >
                          #{((order?.id || order?._id)?.slice(-4) || 'N/A').toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-gray-700 transition-colors">
                            {order?.user?.name || order?.customerName || 'Customer'}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {formatDate(order?.createdAt || order?.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600 text-sm">
                          {formatPrice(order?.totalAmount || order?.total || 0)}
                        </p>
                        <span className={getStatusBadge(order?.orderStatus || order?.status)}>
                          {(order?.orderStatus || order?.status || 'pending').slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <ShoppingBag size={24} className="text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-semibold text-sm mb-1">No recent orders</p>
                    <p className="text-gray-500 text-xs">Completed orders will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={`bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-sm transition-all duration-700 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`} style={{ transitionDelay: '200ms' }}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Stock Alerts</h2>
                <div className="w-8 h-8 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Package size={16} className="text-orange-600" />
                </div>
              </div>
              
              <div className="space-y-3">
                {hasProducts && lowStockProducts.length > 0 ? (
                  lowStockProducts.map((product, index) => (
                    <div
                      key={product?.id || product?._id}
                      className="flex justify-between items-center p-3 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-all duration-300 transform hover:scale-[1.02] group cursor-pointer border border-transparent hover:border-gray-200"
                      style={{
                        transitionDelay: `${index * 100 + 300}ms`
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={product?.images?.[0] || product?.image || 'https://via.placeholder.com/32?text=No+Image'}
                          alt={product?.name || 'Product'}
                          className="w-8 h-8 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/32?text=No+Image';
                          }}
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-gray-700 transition-colors">
                            {product?.name || 'Unnamed Product'}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{formatPrice(product?.price || 0)}</p>
                        </div>
                      </div>
                      <span className={getStockBadge(product?.stock)}>
                        {product?.stock === 0 ? 'Out' : `${product?.stock || 0}`}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Package size={24} className="text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-semibold text-sm mb-1">No stock alerts</p>
                    <p className="text-gray-500 text-xs">
                      {hasProducts ? 'All products well stocked' : 'Add products to monitor'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {(hasOrders || hasProducts) && (
          <div className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white shadow-xl transition-all duration-1000 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold mb-2 tracking-tight">Business Insights</h3>
                <p className="text-gray-300 text-sm">Key performance indicators</p>
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <TrendingUp size={20} className="text-white" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: 'Avg Order Value',
                  value: hasOrders ? formatPrice(Math.round((stats.totalRevenue / stats.totalOrders) || 0)) : formatPrice(0),
                  trend: trends.revenueTrend,
                  color: COLORS.teal
                },
                {
                  label: 'Orders per Product',
                  value: hasProducts ? Math.round((stats.totalOrders / stats.totalProducts) * 100) / 100 || 0 : 0,
                  trend: trends.conversionTrend,
                  color: COLORS.mediumBlue
                },
                {
                  label: 'Pending Rate',
                  value: hasOrders ? Math.round((stats.pendingOrders / stats.totalOrders) * 100) || 0 : 0,
                  trend: -5.2,
                  color: COLORS.brown
                }
              ].map((insight, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:scale-105">
                    <p className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {insight.value}{insight.label.includes('Rate') ? '%' : ''}
                    </p>
                    <p className="text-gray-300 text-xs font-medium mb-2">{insight.label}</p>
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      insight.trend > 0 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      {insight.trend > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                      <span>{Math.abs(insight.trend)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Analytics;