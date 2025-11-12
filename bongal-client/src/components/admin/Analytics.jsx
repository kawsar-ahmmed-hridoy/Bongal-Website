import { useQuery } from "@tanstack/react-query";
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { Package, ShoppingBag, Users, DollarSign, TrendingUp } from 'lucide-react';
import { formatPrice, formatDate } from '../../utils/helpers';

const Analytics = () => {
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
  };

  const statCards = [
    {
      title: 'Total Products',
      value: hasProducts ? stats.totalProducts : 'No products',
      icon: <Package size={32} />,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      description: hasProducts ? 'Active products in store' : 'Add products to start'
    },
    {
      title: 'Total Orders',
      value: hasOrders ? stats.totalOrders : 'No orders',
      icon: <ShoppingBag size={32} />,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
      description: hasOrders ? 'All time orders' : 'No orders placed yet'
    },
    {
      title: 'Pending Orders',
      value: hasOrders ? stats.pendingOrders : 'No orders',
      icon: <TrendingUp size={32} />,
      color: 'from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-600',
      description: hasOrders ? 'Awaiting processing' : 'All orders processed'
    },
    {
      title: 'Total Revenue',
      value: hasOrders ? formatPrice(stats.totalRevenue) : 'No revenue',
      icon: <DollarSign size={32} />,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      description: hasOrders ? 'From completed orders' : 'Start selling to earn'
    },
  ];

  const recentOrders = hasOrders ? ordersList
    .sort((a, b) => new Date(b?.createdAt || b?.date) - new Date(a?.createdAt || a?.date))
    .slice(0, 5) : [];

  const lowStockProducts = hasProducts ? 
    productsList.filter((p) => (p?.stock || 0) < 10).slice(0, 5) : [];

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
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStockBadge = (stock) => {
    const stockValue = stock || 0;
    if (stockValue === 0) return 'bg-red-100 text-red-800';
    if (stockValue < 5) return 'bg-red-100 text-red-800';
    if (stockValue < 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  if (productsLoading || ordersLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  if (productsError || ordersError) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading analytics data. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">
          {hasOrders || hasProducts ? 'Real-time business insights' : 'Add products and make sales to see analytics'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-white mb-4`}>
              {stat.icon}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className={`text-3xl font-bold ${stat.textColor} mb-1`}>{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.description}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {hasOrders && recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order?.id || order?._id}
                  className="flex justify-between items-center border-b pb-3 last:border-b-0 last:pb-0"
                >
                  <div>
                    <p className="font-semibold">Order #{((order?.id || order?._id)?.slice(-8) || 'N/A').toUpperCase()}</p>
                    <p className="text-sm text-gray-500">
                      {order?.user?.name || order?.customerName || 'Customer'} • {formatDate(order?.createdAt || order?.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {formatPrice(order?.totalAmount || order?.total || 0)}
                    </p>
                    <span className={getStatusBadge(order?.orderStatus || order?.status)}>
                      {(order?.orderStatus || order?.status || 'pending').charAt(0).toUpperCase() + 
                       (order?.orderStatus || order?.status || 'pending').slice(1)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No recent orders</p>
                <p className="text-sm text-gray-400 mt-1">Completed orders will appear here</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Low Stock Products</h2>
          <div className="space-y-3">
            {hasProducts && lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div
                  key={product?.id || product?._id}
                  className="flex justify-between items-center border-b pb-3 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={product?.images?.[0] || product?.image || 'https://via.placeholder.com/48?text=No+Image'}
                      alt={product?.name || 'Product'}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/48?text=No+Image';
                      }}
                    />
                    <div>
                      <p className="font-semibold">{product?.name || 'Unnamed Product'}</p>
                      <p className="text-sm text-gray-500">{formatPrice(product?.price || 0)}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStockBadge(product?.stock)}`}>
                    {product?.stock === 0 ? 'Out of Stock' : `${product?.stock || 0} left`}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Package size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No stock alerts</p>
                <p className="text-sm text-gray-400 mt-1">
                  {hasProducts ? 'All products have sufficient stock' : 'Add products to monitor stock'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {(hasOrders || hasProducts) && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Business Insights</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {hasOrders ? Math.round((stats.totalRevenue / stats.totalOrders) || 0) : 0}
              </p>
              <p className="text-gray-600">Average Order Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {hasProducts ? Math.round((stats.totalOrders / stats.totalProducts) * 100) / 100 || 0 : 0}
              </p>
              <p className="text-gray-600">Orders per Product</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {hasOrders ? Math.round((stats.pendingOrders / stats.totalOrders) * 100) || 0 : 0}%
              </p>
              <p className="text-gray-600">Pending Rate</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;