import { formatPrice, formatDate } from '../../utils/helpers';
import { Package, Truck, CheckCircle, XCircle, MapPin, CreditCard, Calendar, Hash } from 'lucide-react';
import { useState } from 'react';

const COLORS = {
  darkBlue: '#011D4D',
  mediumBlue: '#034078',
  teal: '#1282A2',
  cream: '#E4DFDA',
  brown: '#63372C'
};

const OrderCard = ({ order }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusIcon = () => {
    const status = order.orderStatus || order.status || 'pending';
    switch (status) {
      case 'delivered':
      case 'completed':
        return <CheckCircle className="animate-pulse" size={24} style={{ color: COLORS.teal }} />;
      case 'shipped':
        return <Truck className="animate-bounce" size={24} style={{ color: COLORS.mediumBlue }} />;
      case 'cancelled':
        return <XCircle className="animate-pulse" size={24} style={{ color: COLORS.brown }} />;
      default:
        return <Package className="animate-pulse" size={24} style={{ color: COLORS.darkBlue }} />;
    }
  };

  const getStatusColor = () => {
    const status = order.orderStatus || order.status || 'pending';
    switch (status) {
      case 'delivered':
      case 'completed':
        return {
          background: `linear-gradient(135deg, ${COLORS.teal}15 0%, ${COLORS.teal}05 100%)`,
          color: COLORS.teal,
          border: `1px solid ${COLORS.teal}30`
        };
      case 'shipped':
        return {
          background: `linear-gradient(135deg, ${COLORS.mediumBlue}15 0%, ${COLORS.mediumBlue}05 100%)`,
          color: COLORS.mediumBlue,
          border: `1px solid ${COLORS.mediumBlue}30`
        };
      case 'cancelled':
        return {
          background: `linear-gradient(135deg, ${COLORS.brown}15 0%, ${COLORS.brown}05 100%)`,
          color: COLORS.brown,
          border: `1px solid ${COLORS.brown}30`
        };
      case 'processing':
        return {
          background: `linear-gradient(135deg, ${COLORS.darkBlue}15 0%, ${COLORS.darkBlue}05 100%)`,
          color: COLORS.darkBlue,
          border: `1px solid ${COLORS.darkBlue}30`
        };
      default:
        return {
          background: `linear-gradient(135deg, #f59e0b15 0%, #f59e0b05 100%)`,
          color: '#d97706',
          border: `1px solid #f59e0b30`
        };
    }
  };

  const getStatusText = () => {
    const status = order.orderStatus || order.status || 'pending';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const orderItems = order.items || order.products || [];
  const orderTotal = order.totalAmount || order.total || 0;
  const orderDate = order.createdAt || order.date || new Date();
  const orderId = order.id || order._id || 'N/A';

  const statusColors = getStatusColor();

  return (
    <div 
      className="relative p-6 rounded-xl shadow-lg border-2 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl backdrop-blur-sm"
      style={{
        background: `linear-gradient(135deg, white 0%, ${COLORS.cream}10 50%, white 100%)`,
        borderColor: `${COLORS.cream}40`,
        transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${COLORS.teal}20, ${COLORS.mediumBlue}20, ${COLORS.teal}20)`,
          opacity: isHovered ? 1 : 0
        }}
      ></div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${COLORS.cream} 0%, white 100%)`,
                border: `2px solid ${COLORS.cream}60`
              }}
            >
              {getStatusIcon()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Hash size={16} style={{ color: COLORS.mediumBlue }} className="opacity-70" />
                <h3 
                  className="font-bold text-xl bg-gradient-to-r bg-clip-text text-transparent animate-gradient"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${COLORS.darkBlue} 0%, ${COLORS.mediumBlue} 100%)`,
                    backgroundSize: '200% 200%'
                  }}
                >
                  Order #{orderId.slice(-8).toUpperCase()}
                </h3>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar size={14} style={{ color: COLORS.teal }} />
                <p className="text-gray-600 font-medium">
                  {formatDate(orderDate)}
                </p>
              </div>
            </div>
          </div>
          
          <span 
            className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-md backdrop-blur-sm animate-pulse"
            style={statusColors}
          >
            {getStatusText()}
          </span>
        </div>

        {orderItems.length > 0 ? (
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold text-lg" style={{ color: COLORS.darkBlue }}>
              Order Items ({orderItems.length})
            </h4>
            {orderItems.map((item, index) => {
              const itemName = item.product?.name || item.name || 'Product';
              const itemPrice = item.product?.price || item.price || 0;
              const itemQuantity = item.quantity || 1;
              const itemImage = item.product?.image || item.image;
              
              return (
                <div 
                  key={index}
                  className="flex justify-between items-center p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.01] hover:shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.cream}05 0%, white 100%)`,
                    border: `1px solid ${COLORS.cream}30`
                  }}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    {itemImage && (
                      <div 
                        className="w-10 h-10 rounded-lg bg-cover bg-center shadow-sm"
                        style={{ backgroundImage: `url(${itemImage})` }}
                      ></div>
                    )}
                    <div className="flex-1">
                      <span className="text-gray-800 font-medium block">{itemName}</span>
                      {item.product?.category && (
                        <span 
                          className="text-xs px-2 py-1 rounded-full mt-1 inline-block"
                          style={{
                            background: `${COLORS.mediumBlue}10`,
                            color: COLORS.mediumBlue,
                            border: `1px solid ${COLORS.mediumBlue}20`
                          }}
                        >
                          {item.product.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center space-x-2 justify-end">
                      <span 
                        className="text-sm px-2 py-1 rounded-full font-medium"
                        style={{
                          background: `${COLORS.teal}10`,
                          color: COLORS.teal
                        }}
                      >
                        x{itemQuantity}
                      </span>
                    </div>
                    <span className="font-bold text-lg block" style={{ color: COLORS.darkBlue }}>
                      {formatPrice(itemPrice * itemQuantity)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div 
            className="mb-6 text-center py-6 rounded-xl transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${COLORS.cream}05 0%, white 100%)`,
              border: `1px dashed ${COLORS.cream}60`
            }}
          >
            <Package size={32} style={{ color: COLORS.mediumBlue }} className="mx-auto mb-2 opacity-50" />
            <p className="text-gray-500 font-medium">No items in this order</p>
          </div>
        )}

        <div 
          className="border-t pt-4 mb-4 transition-all duration-300"
          style={{ borderColor: `${COLORS.cream}40` }}
        >
          <div className="flex justify-between items-center">
            <span className="font-bold text-xl" style={{ color: COLORS.darkBlue }}>
              Total Amount
            </span>
            <span 
              className="font-bold text-2xl animate-pulse"
              style={{ 
                color: COLORS.teal,
                textShadow: `0 2px 4px ${COLORS.teal}20`
              }}
            >
              {formatPrice(orderTotal)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {order.shippingAddress && (
            <div 
              className="p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.01]"
              style={{
                background: `linear-gradient(135deg, ${COLORS.cream}08 0%, white 100%)`,
                border: `1px solid ${COLORS.cream}40`
              }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <MapPin size={16} style={{ color: COLORS.teal }} />
                <p className="font-semibold text-sm" style={{ color: COLORS.darkBlue }}>
                  Shipping Address:
                </p>
              </div>
              <p className="text-sm pl-6" style={{ color: COLORS.mediumBlue }}>
                {typeof order.shippingAddress === 'string' 
                  ? order.shippingAddress 
                  : `${order.shippingAddress.street || ''}, ${order.shippingAddress.city || ''}, ${order.shippingAddress.country || ''}`
                }
              </p>
            </div>
          )}

          {order.paymentStatus && (
            <div 
              className="flex items-center justify-between p-3 rounded-xl transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${COLORS.cream}08 0%, white 100%)`,
                border: `1px solid ${COLORS.cream}40`
              }}
            >
              <div className="flex items-center space-x-2">
                <CreditCard size={16} style={{ color: COLORS.mediumBlue }} />
                <span className="text-sm font-semibold" style={{ color: COLORS.darkBlue }}>
                  Payment Status:
                </span>
              </div>
              <span 
                className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  order.paymentStatus === 'paid' 
                    ? 'animate-pulse' 
                    : 'animate-pulse'
                }`}
                style={
                  order.paymentStatus === 'paid' 
                    ? {
                        background: `linear-gradient(135deg, ${COLORS.teal}15 0%, ${COLORS.teal}05 100%)`,
                        color: COLORS.teal,
                        border: `1px solid ${COLORS.teal}30`
                      }
                    : {
                        background: `linear-gradient(135deg, #f59e0b15 0%, #f59e0b05 100%)`,
                        color: '#d97706',
                        border: `1px solid #f59e0b30`
                      }
                }
              >
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </span>
            </div>
          )}
        </div>

        <div className="absolute top-0 right-0 w-20 h-20 opacity-5 pointer-events-none">
          <div 
            className="absolute top-2 right-2 w-12 h-12 rounded-full animate-pulse"
            style={{ backgroundColor: COLORS.teal }}
          ></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
          background-size: 200% 200%;
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderCard;