import { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { Package, ShoppingBag, BarChart3, Home, LogOut, Menu, X, Users, DollarSign, TrendingUp, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { formatPrice, formatDate } from '../../utils/helpers';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import Analytics from './Analytics';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { data: products, isLoading: productsLoading} = useQuery({
    queryKey: ['dashboard-products'],
    queryFn: () => productService.getAllProducts({}),
    retry: 1,
    refetchOnWindowFocus: false
  });
  
  const { data: orders, isLoading: ordersLoading} = useQuery({
    queryKey: ['dashboard-orders'],
    queryFn: orderService.getAllOrders,
    retry: 1,
    refetchOnWindowFocus: false
  });

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };


  const DashboardContent = () => {
    const productsList = products?.products || products || [];
    const ordersList = orders?.orders || orders || [];

    const hasProducts = Array.isArray(productsList) && productsList.length > 0;
    const hasOrders = Array.isArray(ordersList) && ordersList.length > 0;

    const totalProducts = hasProducts ? productsList.length : 0;
    const totalOrders = hasOrders ? ordersList.length : 0;
    const totalRevenue = hasOrders ? ordersList.reduce((sum, order) => {
      const isCompleted = ['delivered', 'completed'].includes(order?.orderStatus || order?.status);
      const amount = isCompleted ? (order?.totalAmount || order?.total || 0) : 0;
      return sum + (typeof amount === 'number' ? amount : 0);
    }, 0) : 0;
    const pendingOrders = hasOrders ? ordersList.filter((o) => 
      (o?.orderStatus || o?.status) === 'pending'
    ).length : 0;
    const processingOrders = hasOrders ? ordersList.filter((o) => 
      (o?.orderStatus || o?.status) === 'processing'
    ).length : 0;
    const lowStockProducts = hasProducts ? 
      productsList.filter((p) => (p?.stock || 0) < 10).length : 0;
    const outOfStockProducts = hasProducts ? 
      productsList.filter((p) => (p?.stock || 0) === 0).length : 0;
    const recentOrders = hasOrders ? ordersList
      .sort((a, b) => new Date(b?.createdAt || b?.date) - new Date(a?.createdAt || a?.date))
      .slice(0, 5) : [];
    const criticalStockAlerts = hasProducts ? 
      productsList.filter((p) => (p?.stock || 0) < 5).slice(0, 5) : [];

    const statCards = [
      {
        title: 'Total Products',
        value: hasProducts ? totalProducts : 'No products',
        icon: <Package size={24} />,
        color: 'from-blue-500 to-blue-600',
        link: '/admin/products',
        description: hasProducts ? `${outOfStockProducts} out of stock` : 'Add your first product'
      },
      {
        title: 'Total Orders',
        value: hasOrders ? totalOrders : 'No orders',
        icon: <ShoppingBag size={24} />,
        color: 'from-green-500 to-green-600',
        link: '/admin/orders',
        description: hasOrders ? `${pendingOrders} pending, ${processingOrders} processing` : 'No orders yet'
      },
      {
        title: 'Total Revenue',
        value: hasOrders ? formatPrice(totalRevenue) : 'No revenue',
        icon: <DollarSign size={24} />,
        color: 'from-purple-500 to-purple-600',
        link: '/admin/analytics',
        description: hasOrders ? 'From completed orders' : 'Start selling to earn'
      },
      {
        title: 'Stock Alerts',
        value: hasProducts ? lowStockProducts : 'No alerts',
        icon: <AlertTriangle size={24} />,
        color: 'from-red-500 to-red-600',
        link: '/admin/products',
        description: hasProducts ? 'Low stock items' : 'All products well stocked'
      },
    ];

    const getStatusBadge = (status) => {
      const baseClasses = "text-xs px-2 py-1 rounded-full font-semibold";
      const statusValue = status || 'pending';
      
      switch (statusValue) {
        case 'pending': return `${baseClasses} bg-yellow-100 text-yellow-800`;
        case 'processing': return `${baseClasses} bg-blue-100 text-blue-800`;
        case 'shipped': return `${baseClasses} bg-purple-100 text-purple-800`;
        case 'delivered': case 'completed': return `${baseClasses} bg-green-100 text-green-800`;
        case 'cancelled': return `${baseClasses} bg-red-100 text-red-800`;
        default: return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    };

    if (productsLoading || ordersLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading dashboard data...</div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-2">
              {hasOrders ? 'Real-time store analytics' : 'Welcome! Start by adding products and making sales'}
            </p>
          </div>
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
              {hasOrders && (
                <Link to="/admin/orders" className="text-green-600 hover:text-green-700 text-sm font-semibold flex items-center space-x-1">
                  <span>View All</span>
                  <ArrowUpRight size={16} />
                </Link>
              )}
            </div>
            <div className="space-y-4">
              {hasOrders ? (
                recentOrders.map((order) => (
                  <div key={order?.id || order?._id} className="flex justify-between items-center border-b pb-4 last:border-b-0 last:pb-0">
                    <div>
                      <p className="font-semibold text-gray-900 font-mono">
                        #{((order?.id || order?._id)?.slice(-8) || 'N/A')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order?.user?.name || order?.customerName || 'Customer'} • {formatDate(order?.createdAt || order?.date)}
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
                  <Link to="/admin/products" className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                    Add Products
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Stock Alerts</h2>
              {hasProducts && (
                <Link to="/admin/products" className="text-green-600 hover:text-green-700 text-sm font-semibold flex items-center space-x-1">
                  <span>Manage Products</span>
                  <ArrowUpRight size={16} />
                </Link>
              )}
            </div>
            <div className="space-y-4">
              {hasProducts && criticalStockAlerts.length > 0 ? (
                criticalStockAlerts.map((product) => (
                  <div key={product?.id || product?._id} className="flex justify-between items-center border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product?.images?.[0] || product?.image || 'https://via.placeholder.com/40?text=No+Image'}
                        alt={product?.name || 'Product'}
                        className="w-10 h-10 object-cover rounded"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=No+Image'; }}
                      />
                      <div className="max-w-[150px]">
                        <p className="font-semibold text-gray-900 truncate">{product?.name || 'Unnamed Product'}</p>
                        <p className="text-sm text-gray-500 capitalize">{product?.category || 'uncategorized'}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      (product?.stock || 0) === 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {(product?.stock || 0) === 0 ? 'Out of Stock' : `${product?.stock || 0} left`}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Package size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">{hasProducts ? 'No stock alerts' : 'No products added'}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {hasProducts ? 'All products have sufficient stock' : 'Add products to manage inventory'}
                  </p>
                  {!hasProducts && (
                    <Link to="/admin/products" className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                      Add First Product
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {navigation.filter(item => item.name !== 'Dashboard').map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} to={item.href} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition group">
                  <div className="flex items-center space-x-3">
                    <Icon className="text-green-600" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-800">Manage {item.name}</h3>
                      <p className="text-sm text-gray-600">View and manage {item.name.toLowerCase()}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-md"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform lg:translate-x-0 z-40 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 bg-green-600 text-white">
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-green-100 text-green-700 border-r-4 border-green-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="lg:ml-64">
        <div className="p-4 lg:p-8">
          <Routes>
            <Route index element={<DashboardContent />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="analytics" element={<Analytics />} />
          </Routes>
        </div>
      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;