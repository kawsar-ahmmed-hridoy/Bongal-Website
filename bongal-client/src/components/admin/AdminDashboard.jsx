import { useQuery } from "@tanstack/react-query";
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { formatPrice, formatDate } from '../../utils/helpers';

const Dashboard = () => {
  const { data: products, isLoading: productsLoading, error: productsError } = useQuery(
    'dashboard-products', 
    () => productService.getAllProducts({}),
    {
      retry: 1,
      refetchOnWindowFocus: false
    }
  );
  
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useQuery(
    'dashboard-orders', 
    orderService.getAllOrders,
    {
      retry: 1,
      refetchOnWindowFocus: false
    }
  );

  const productsList = products?.products || products || [];
  const ordersList = orders || [];

  const totalProducts = Array.isArray(productsList) ? productsList.length : 0;
  const totalOrders = ordersList.length || 0;
  const totalRevenue = ordersList.reduce((sum, order) => {
    const amount = order?.totalAmount || order?.total || 0;
    return sum + (typeof amount === 'number' ? amount : 0);
  }, 0) || 0;
  
  const pendingOrders = ordersList.filter((o) => 
    (o?.orderStatus || o?.status) === 'pending'
  ).length || 0;
  
  const processingOrders = ordersList.filter((o) => 
    (o?.orderStatus || o?.status) === 'processing'
  ).length || 0;

  const lowStockProducts = Array.isArray(productsList) ? 
    productsList.filter((p) => (p?.stock || 0) < 10).length : 0;
  
  const outOfStockProducts = Array.isArray(productsList) ? 
    productsList.filter((p) => (p?.stock || 0) === 0).length : 0;

  const recentOrders = Array.isArray(ordersList) ? ordersList.slice(0, 5) : [];

  const criticalStockAlerts = Array.isArray(productsList) ? 
    productsList.filter((p) => (p?.stock || 0) < 5).slice(0, 5) : [];

  const statCards = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: <Package size={24} />,
      color: 'from-blue-500 to-blue-600',
      link: '/admin/products',
      description: `${outOfStockProducts} out of stock`
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: <ShoppingBag size={24} />,
      color: 'from-green-500 to-green-600',
      link: '/admin/orders',
      description: `${pendingOrders} pending, ${processingOrders} processing`
    },
    {
      title: 'Total Revenue',
      value: formatPrice(totalRevenue),
      icon: <DollarSign size={24} />,
      color: 'from-purple-500 to-purple-600',
      link: '/admin/analytics',
      description: 'All time sales'
    },
    {
      title: 'Stock Alerts',
      value: lowStockProducts,
      icon: <AlertTriangle size={24} />,
      color: 'from-red-500 to-red-600',
      link: '/admin/products',
      description: 'Low stock items'
    },
  ];

  const getStatusBadge = (status) => {
    const baseClasses = "text-xs px-2 py-1 rounded-full font-semibold";
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

  if (productsLoading || ordersLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading dashboard data...</div>
      </div>
    );
  }

  if (productsError || ordersError) {
    console.error('Dashboard data error:', { productsError, ordersError });
  }

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome to your admin panel - Real-time store analytics</p>
        </div>
        <Link
          to="/admin/analytics"
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center space-x-2"
        >
          <TrendingUp size={20} />
          <span>View Detailed Analytics</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
              <ArrowUpRight size={18} className="text-gray-400" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.description}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link 
              to="/admin/orders" 
              className="text-green-600 hover:text-green-700 text-sm font-semibold flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order?.id || order?._id || Math.random()}
                  className="flex justify-between items-center border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div>
                    <p className="font-semibold text-gray-900 font-mono">
                      #{((order?.id || order?._id)?.slice(-8) || 'N/A')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order?.user?.name || 'Customer'} • {formatDate(order?.createdAt || order?.date || new Date())}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {formatPrice(order?.totalAmount || order?.total || 0)}
                    </p>
                    <span className={getStatusBadge(order?.orderStatus || order?.status)}>
                      {order?.orderStatus || order?.status || 'pending'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No orders yet</p>
                <p className="text-sm text-gray-400 mt-1">Orders will appear here when customers make purchases</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Stock Alerts</h2>
            <Link 
              to="/admin/products" 
              className="text-green-600 hover:text-green-700 text-sm font-semibold flex items-center space-x-1"
            >
              <span>Manage Products</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {criticalStockAlerts.length > 0 ? (
              criticalStockAlerts.map((product) => (
                <div
                  key={product?.id || product?._id || Math.random()}
                  className="flex justify-between items-center border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={product?.images?.[0] || product?.image || 'https://via.placeholder.com/40?text=No+Image'}
                      alt={product?.name || 'Product'}
                      className="w-10 h-10 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/40?text=No+Image';
                      }}
                    />
                    <div className="max-w-[150px]">
                      <p className="font-semibold text-gray-900 truncate">{product?.name || 'Unnamed Product'}</p>
                      <p className="text-sm text-gray-500 capitalize">{product?.category || 'uncategorized'}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    (product?.stock || 0) === 0 
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {(product?.stock || 0) === 0 ? 'Out of Stock' : `${product?.stock || 0} left`}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Package size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No stock alerts</p>
                <p className="text-sm text-gray-400 mt-1">All products have sufficient stock</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/admin/products" 
            className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition group"
          >
            <div className="flex items-center space-x-3">
              <Package className="text-green-600" size={24} />
              <div>
                <h3 className="font-semibold text-green-800">Manage Products</h3>
                <p className="text-sm text-green-600">Add, edit, or remove products</p>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/admin/orders" 
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition group"
          >
            <div className="flex items-center space-x-3">
              <ShoppingBag className="text-blue-600" size={24} />
              <div>
                <h3 className="font-semibold text-blue-800">Manage Orders</h3>
                <p className="text-sm text-blue-600">Update order status</p>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/admin/analytics" 
            className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:bg-purple-100 transition group"
          >
            <div className="flex items-center space-x-3">
              <TrendingUp className="text-purple-600" size={24} />
              <div>
                <h3 className="font-semibold text-purple-800">View Analytics</h3>
                <p className="text-sm text-purple-600">Detailed sales reports</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {(productsError || ordersError) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            Some data may not be loading correctly, but you can still use all admin features.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;