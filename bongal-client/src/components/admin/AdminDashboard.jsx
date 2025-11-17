import { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { Package, ShoppingBag, BarChart3, Home, LogOut, Menu, X, Users, DollarSign, TrendingUp, AlertTriangle, ArrowRight, Settings, Shield, Upload } from 'lucide-react';
import { formatPrice, formatDate } from '../../utils/helpers';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import Analytics from './Analytics';
import ImageUpload from './ImageUpload';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['dashboard-products'],
    queryFn: () => productService.getAllProducts({}),
    retry: 1,
    refetchOnWindowFocus: false
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
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
    { name: 'Upload Images', href: '/admin/upload', icon: Upload },
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
        value: hasProducts ? totalProducts : '0',
        icon: Package,
        color: 'bg-blue-100 text-blue-600',
        bgColor: 'from-blue-500 to-blue-600',
        link: '/admin/products',
        description: hasProducts ? `${outOfStockProducts} out of stock` : 'Add your first product',
        trend: hasProducts ? 'positive' : 'neutral'
      },
      {
        title: 'Total Orders',
        value: hasOrders ? totalOrders : '0',
        icon: ShoppingBag,
        color: 'bg-green-100 text-green-600',
        bgColor: 'from-green-500 to-green-600',
        link: '/admin/orders',
        description: hasOrders ? `${pendingOrders} pending orders` : 'No orders yet',
        trend: hasOrders ? 'positive' : 'neutral'
      },
      {
        title: 'Total Revenue',
        value: hasOrders ? formatPrice(totalRevenue) : formatPrice(0),
        icon: DollarSign,
        color: 'bg-purple-100 text-purple-600',
        bgColor: 'from-purple-500 to-purple-600',
        link: '/admin/analytics',
        description: hasOrders ? 'From completed orders' : 'Start selling to earn',
        trend: hasOrders ? 'positive' : 'neutral'
      },
      {
        title: 'Stock Alerts',
        value: hasProducts ? lowStockProducts : '0',
        icon: AlertTriangle,
        color: 'bg-red-100 text-red-600',
        bgColor: 'from-red-500 to-red-600',
        link: '/admin/products',
        description: hasProducts ? 'Low stock items' : 'All products well stocked',
        trend: lowStockProducts > 0 ? 'negative' : 'positive'
      },
    ];

    const getStatusBadge = (status) => {
      const baseClasses = "text-xs px-3 py-1.5 rounded-full font-semibold";
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
        <div className="min-h-96 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 font-light">Loading dashboard data...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-gray-600 text-lg font-light mt-2">
              {hasOrders ? 'Real-time store analytics and insights' : 'Welcome! Start by adding products and making sales'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link
                key={index}
                to={stat.link}
                className="block bg-white rounded-3xl shadow-sm border border-gray-200/60 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center`}>
                    <Icon size={24} />
                  </div>
                  <ArrowRight size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              {hasOrders && (
                <Link to="/admin/orders" className="text-gray-600 hover:text-gray-900 text-sm font-semibold flex items-center space-x-1 transition-colors duration-300">
                  <span>View All</span>
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
            <div className="space-y-4">
              {hasOrders ? (
                recentOrders.map((order) => (
                  <div key={order?.id || order?._id} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <div>
                      <p className="font-semibold text-gray-900 font-mono text-sm">
                        #{((order?.id || order?._id)?.slice(-8) || 'N/A')}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {order?.user?.name || order?.customerName || 'Customer'} • {formatDate(order?.createdAt || order?.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
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
                  <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">No orders yet</p>
                  <p className="text-sm text-gray-400 mt-2">Orders will appear here when customers make purchases</p>
                  <Link to="/admin/products" className="inline-block mt-4 bg-gray-900 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300">
                    Add Products
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Stock Alerts</h2>
              {hasProducts && (
                <Link to="/admin/products" className="text-gray-600 hover:text-gray-900 text-sm font-semibold flex items-center space-x-1 transition-colors duration-300">
                  <span>Manage Products</span>
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
            <div className="space-y-4">
              {hasProducts && criticalStockAlerts.length > 0 ? (
                criticalStockAlerts.map((product) => (
                  <div key={product?.id || product?._id} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Package size={20} className="text-gray-400" />
                      </div>
                      <div className="max-w-[150px]">
                        <p className="font-semibold text-gray-900 truncate text-sm">{product?.name || 'Unnamed Product'}</p>
                        <p className="text-xs text-gray-500 capitalize">{product?.category || 'uncategorized'}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${(product?.stock || 0) === 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {(product?.stock || 0) === 0 ? 'Out of Stock' : `${product?.stock || 0} left`}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Package size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">{hasProducts ? 'No stock alerts' : 'No products added'}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {hasProducts ? 'All products have sufficient stock' : 'Add products to manage inventory'}
                  </p>
                  {!hasProducts && (
                    <Link to="/admin/products" className="inline-block mt-4 bg-gray-900 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300">
                      Add First Product
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {navigation.filter(item => item.name !== 'Dashboard').map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="bg-gray-50 border border-gray-200 rounded-2xl p-5 hover:bg-gray-100 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Manage {item.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">View and manage {item.name.toLowerCase()}</p>
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
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden fixed top-6 left-6 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 bg-white rounded-2xl shadow-sm border border-gray-200/60 hover:bg-gray-50 transition-all duration-300"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className={`fixed inset-y-0 left-0 w-80 bg-white shadow-lg border-r border-gray-200/60 transform transition-transform lg:translate-x-0 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex flex-col h-full mt-11">
          <div className="flex items-center space-x-3 p-6 border-b border-gray-200/60">
            <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600 text-sm">বঙ্গাল Management</p>
            </div>
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
                  className={`flex items-center space-x-3 px-4 py-4 rounded-2xl transition-all duration-300 ${isActive
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200/60 mb-10">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all duration-300 font-medium"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="lg:ml-80">
        <div className="p-6 lg:p-8">
          <Routes>
            <Route index element={<DashboardContent />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="upload" element={<ImageUpload />} />
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