import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, CheckCircle, Sparkles, MessageCircle } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef(null);

  const colors = {
    darkBlue: '#011D4D',
    mediumBlue: '#034078',
    teal: '#1282A2',
    cream: '#E4DFDA',
    brown: '#63372C'
  };

  const { data: unreadData } = useQuery({
    queryKey: ['notifications-unread'],
    queryFn: notificationService.getUnreadCount,
    enabled: !!user,
    refetchInterval: 30000
  });

  const { data: notificationsData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getNotifications(1, 10),
    enabled: !!user && isOpen
  });

  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['notifications-unread']);
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['notifications-unread']);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (unreadData?.data?.count > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [unreadData?.data?.count]);

  if (!user) return null;

  const unreadCount = unreadData?.data?.count || 0;
  const notifications = notificationsData?.data || [];

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsReadMutation.mutate(notification._id);
    }

    if (notification.post) {
      navigate(`/community/post/${notification.post._id || notification.post}`);
      setIsOpen(false);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffInMs = now - d;
    const diffInMinutes = diffInMs / (1000 * 60);

    if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}m ago`;
    }
    const diffInHours = diffInMinutes / 60;
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    }
    const diffInDays = diffInHours / 24;
    if (diffInDays < 7) {
      return `${Math.floor(diffInDays)}d ago`;
    }
    return d.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all duration-500 transform hover:scale-110 ${
          isAnimating ? 'animate-ring' : ''
        }`}
        style={{ 
          color: colors.darkBlue,
          backgroundColor: `${colors.mediumBlue}10`
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = `${colors.mediumBlue}20`;
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = `${colors.mediumBlue}10`;
          e.target.style.transform = isAnimating ? 'scale(1.1)' : 'scale(1)';
        }}
      >
        <Bell 
          size={24} 
          className={`transition-all duration-500 ${isAnimating ? 'animate-bounce' : ''}`}
        />
        
        {unreadCount > 0 && (
          <span 
            className="absolute -top-1 -right-1 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg transition-all duration-500 transform hover:scale-125"
            style={{ 
              backgroundColor: colors.teal,
              boxShadow: `0 4px 12px ${colors.teal}60`
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-96 rounded-2xl shadow-2xl border backdrop-blur-sm z-50 transform transition-all duration-500 animate-in slide-in-from-top-5"
          style={{
            backgroundColor: `${colors.cream}f8`,
            borderColor: `${colors.mediumBlue}20`
          }}
        >
          <div 
            className="p-4 border-b flex items-center justify-between transition-all duration-500"
            style={{ borderColor: `${colors.mediumBlue}20` }}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="p-2 rounded-xl transition-all duration-500 transform hover:scale-110"
                style={{ backgroundColor: `${colors.teal}15` }}
              >
                <Bell size={18} style={{ color: colors.teal }} />
              </div>
              <h3 
                className="font-bold transition-all duration-500"
                style={{ color: colors.darkBlue }}
              >
                Notifications
              </h3>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsReadMutation.mutate()}
                className="flex items-center space-x-2 text-sm font-medium transition-all duration-500 transform hover:scale-105 disabled:opacity-50"
                style={{ color: colors.teal }}
                disabled={markAllAsReadMutation.isPending}
                onMouseEnter={(e) => {
                  e.target.style.color = colors.mediumBlue;
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = colors.teal;
                }}
              >
                <Check size={16} />
                <span>{markAllAsReadMutation.isPending ? 'Marking...' : 'Mark all read'}</span>
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div 
                className="p-8 text-center transition-all duration-500"
                style={{ color: colors.mediumBlue }}
              >
                <MessageCircle 
                  size={48} 
                  className="mx-auto mb-4 opacity-50 transition-all duration-500 transform hover:scale-110"
                  style={{ color: colors.teal }}
                />
                <p className="font-medium">No notifications yet</p>
                <p className="text-sm mt-1 opacity-70">We'll notify you when something arrives</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full p-4 transition-all duration-500 transform hover:scale-105 text-left border-b group ${
                    !notification.read ? 'animate-pulse-gentle' : ''
                  }`}
                  style={{ 
                    borderColor: `${colors.mediumBlue}10`,
                    backgroundColor: !notification.read ? `${colors.teal}08` : 'transparent'
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 transition-all duration-500 transform group-hover:scale-150 ${
                      !notification.read 
                        ? 'animate-pulse' 
                        : 'opacity-50'
                    }`}
                    style={{ 
                      backgroundColor: !notification.read ? colors.teal : colors.mediumBlue
                    }} />
                    
                    <div className="flex-1 space-y-2">
                      <p 
                        className="font-semibold text-sm transition-all duration-500 group-hover:translate-x-1"
                        style={{ color: colors.darkBlue }}
                      >
                        {notification.title}
                      </p>
                      <p 
                        className="text-sm transition-all duration-500 group-hover:translate-x-1"
                        style={{ color: colors.mediumBlue }}
                      >
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <p 
                          className="text-xs transition-all duration-500 group-hover:translate-x-1"
                          style={{ color: `${colors.mediumBlue}70` }}
                        >
                          {formatDate(notification.createdAt)}
                        </p>
                        
                        {notification.read && (
                          <CheckCircle 
                            size={14} 
                            className="transition-all duration-500 transform group-hover:scale-125"
                            style={{ color: colors.teal }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="w-0 group-hover:w-full h-0.5 transition-all duration-500 mt-2 rounded-full"
                    style={{ backgroundColor: colors.teal }}
                  />
                </button>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div 
              className="p-3 border-t text-center transition-all duration-500"
              style={{ borderColor: `${colors.mediumBlue}20` }}
            >
              <button
                onClick={() => navigate('/notifications')}
                className="text-sm font-medium transition-all duration-500 transform hover:scale-105"
                style={{ color: colors.teal }}
                onMouseEnter={(e) => {
                  e.target.style.color = colors.mediumBlue;
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = colors.teal;
                }}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes ring {
          0% { transform: scale(1); }
          25% { transform: scale(1.1) rotate(5deg); }
          50% { transform: scale(1.05) rotate(-5deg); }
          75% { transform: scale(1.1) rotate(5deg); }
          100% { transform: scale(1); }
        }
        
        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .animate-ring {
          animation: ring 0.5s ease-in-out;
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;