import { useQuery } from "@tanstack/react-query";
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { Package, ShoppingBag, Users, DollarSign, TrendingUp } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';

const Analytics = () => {
  const { data: products } = useQuery('analytics-products', () =>
    productService.getAllProducts({})
  );
  const { data: orders } = useQuery('analytics-orders', orderService.getAllOrders);

  const stats = {
    totalProducts: products?.total || products?.products?.length || 0,
    totalOrders: orders?.length || 0,
    totalRevenue: orders?.reduce((sum, order) => sum + (order.totalAmount || order.total), 0) || 0,
    pendingOrders: orders?.filter((o) => (o.orderStatus || o.status) === 'pending').length || 0,
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <Package size={32} />,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <ShoppingBag size={32} />,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: <TrendingUp size={32} />,
      color: 'from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: <DollarSign size={32} />,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-white mb-4`}>
              {stat.icon}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {orders?.slice(0, 5).map((order) => (
              <div
                key={order.id || order._id}
                className="flex justify-between items-center border-b pb-3"
              >
                <div>
                  <p className="font-semibold">Order #{(order.id || order._id).slice(-8)}</p>
                  <p className="text-sm text-gray-500">{order.user?.name || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    {formatPrice(order.totalAmount || order.total)}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      (order.orderStatus || order.status) === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.orderStatus || order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Low Stock Products</h2>
          <div className="space-y-3">
            {products?.products
              ?.filter((p) => p.stock < 10)
              .slice(0, 5)
              .map((product) => (
                <div
                  key={product.id || product._id}
                  className="flex justify-between items-center border-b pb-3"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.images?.[0] || product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-500">{formatPrice(product.price)}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                    {product.stock} left
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;