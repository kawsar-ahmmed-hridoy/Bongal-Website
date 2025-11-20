import { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { Package, ShoppingBag, BarChart3, Home, LogOut, Menu, X, Users, DollarSign, TrendingUp, AlertTriangle, ArrowRight, Settings, Shield, Upload, MessageCircle, FileText, Eye, Plus } from 'lucide-react';
import { formatPrice, formatDate } from '../../utils/helpers';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import Analytics from './Analytics';
import ImageUpload from './ImageUpload';
import MessageManagement from './MessageManagement';
import PostManagement from './PostManagement';

const COLORS = {
  darkBlue: '#011D4D',
  mediumBlue: '#034078',
  teal: '#1282A2',
  cream: '#E4DFDA',
  brown: '#63372C'
};

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
    { name: 'Posts', href: '/admin/posts', icon: FileText },
    { name: 'Messages', href: '/admin/messages', icon: MessageCircle },
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
        gradient: `linear-gradient(135deg, ${COLORS.mediumBlue}15 0%, ${COLORS.mediumBlue}05 100%)`,
        link: '/admin/products',
        description: hasProducts ? `${outOfStockProducts} out of stock` : 'Add your first product',
        trend: hasProducts ? 'positive' : 'neutral'
      },
      {
        title: 'Total Orders',
        value: hasOrders ? totalOrders : '0',
        icon: ShoppingBag,
        color: 'bg-green-100 text-green-600',
        gradient: `linear-gradient(135deg, #10b98115 0%, #10b98105 100%)`,
        link: '/admin/orders',
        description: hasOrders ? `${pendingOrders} pending` : 'No orders yet',
        trend: hasOrders ? 'positive' : 'neutral'
      },
      {
        title: 'Total Revenue',
        value: hasOrders ? formatPrice(totalRevenue) : formatPrice(0),
        icon: DollarSign,
        color: 'bg-purple-100 text-purple-600',
        gradient: `linear-gradient(135deg, ${COLORS.teal}15 0%, ${COLORS.teal}05 100%)`,
        link: '/admin/analytics',
        description: hasOrders ? 'From completed orders' : 'Start selling',
        trend: hasOrders ? 'positive' : 'neutral'
      },
      {
        title: 'Stock Alerts',
        value: hasProducts ? lowStockProducts : '0',
        icon: AlertTriangle,
        color: 'bg-red-100 text-red-600',
        gradient: `linear-gradient(135deg, ${COLORS.brown}15 0%, ${COLORS.brown}05 100%)`,
        link: '/admin/products',
        description: hasProducts ? 'Low stock items' : 'All products stocked',
        trend: lowStockProducts > 0 ? 'negative' : 'positive'
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
        <div className="min-h-96 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 text-sm font-light">Loading dashboard...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-gray-600 text-sm font-light mt-1">
              {hasOrders ? 'Real-time store analytics and insights' : 'Welcome! Start by adding products'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link
                key={index}
                to={stat.link}
                className="block bg-white rounded-xl shadow-sm border border-gray-200/60 p-4 hover:shadow-md transition-all duration-300 cursor-pointer group hover:scale-105"
                style={{ background: stat.gradient }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center shadow-sm`}>
                    <Icon size={20} />
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
                </div>
                <h3 className="text-gray-600 text-xs font-medium mb-1">{stat.title}</h3>
                <p className="text-lg font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              {hasOrders && (
                <Link to="/admin/orders" className="text-gray-600 hover:text-gray-900 text-xs font-semibold flex items-center space-x-1 transition-colors duration-300">
                  <span>View All</span>
                  <ArrowRight size={12} />
                </Link>
              )}
            </div>
            <div className="space-y-3">
              {hasOrders ? (
                recentOrders.map((order) => (
                  <div key={order?.id || order?._id} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate font-mono">
                        #{((order?.id || order?._id)?.slice(-6) || 'N/A')}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {order?.user?.name || order?.customerName || 'Customer'} • {formatDate(order?.createdAt || order?.date)}
                      </p>
                    </div>
                    <div className="text-right ml-2">
                      <p className="font-semibold text-gray-900 text-sm">
                        {formatPrice(order?.totalAmount || order?.total || 0)}
                      </p>
                      <span className={getStatusBadge(order?.orderStatus || order?.status)}>
                        {(order?.orderStatus || order?.status || 'pending').slice(0, 10)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <ShoppingBag size={32} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm font-medium">No orders yet</p>
                  <p className="text-xs text-gray-400 mt-1">Orders will appear here</p>
                  <Link to="/admin/products" className="inline-block mt-3 bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-800 transition-all duration-300">
                    Add Products
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Stock Alerts</h2>
              {hasProducts && (
                <Link to="/admin/products" className="text-gray-600 hover:text-gray-900 text-xs font-semibold flex items-center space-x-1 transition-colors duration-300">
                  <span>Manage</span>
                  <ArrowRight size={12} />
                </Link>
              )}
            </div>
            <div className="space-y-3">
              {hasProducts && criticalStockAlerts.length > 0 ? (
                criticalStockAlerts.map((product) => (
                  <div key={product?.id || product?._id} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package size={16} className="text-gray-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 text-sm truncate">{product?.name || 'Unnamed Product'}</p>
                        <p className="text-xs text-gray-500 truncate capitalize">{product?.category || 'uncategorized'}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2 ${(product?.stock || 0) === 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {(product?.stock || 0) === 0 ? 'Out' : `${product?.stock || 0}`}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Package size={32} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm font-medium">{hasProducts ? 'No stock alerts' : 'No products'}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {hasProducts ? 'All products well stocked' : 'Add products to start'}
                  </p>
                  {!hasProducts && (
                    <Link to="/admin/products" className="inline-block mt-3 bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-800 transition-all duration-300">
                      Add First Product
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {navigation.filter(item => item.name !== 'Dashboard').slice(0, 3).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-all duration-300 group hover:scale-105"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="text-white" size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">Manage {item.name}</h3>
                      <p className="text-xs text-gray-600 truncate">View and edit {item.name.toLowerCase()}</p>
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
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-xl shadow-sm border border-gray-200/60 hover:bg-gray-50 transition-all duration-300"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div className={`fixed inset-y-12 left-0 w-64 bg-white shadow-lg border-r border-gray-200/60 transform transition-transform lg:translate-x-0 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center space-x-3 p-4 border-b border-gray-200/60">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <Shield className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600 text-xs">বঙ্গাল Management</p>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-300 text-sm ${isActive
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="p-3 border-t border-gray-200/60">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-3 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-300 text-sm font-medium"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="lg:ml-64">
        <div className="p-4 lg:p-6">
          <Routes>
            <Route index element={<DashboardContent />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="posts" element={<PostManagement />} />
            <Route path="messages" element={<MessageManagement />} />
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