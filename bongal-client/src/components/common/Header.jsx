import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Package, LogOut, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import NotificationBell from './NotificationBell';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-cream-100/95 backdrop-blur-md shadow-soft border-b border-primary-100/60'
        : 'bg-cream-100/90 backdrop-blur-sm'
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          <Link
            to="/"
            className="flex items-center space-x-3 group"
          >
            <div
              className={`p-2 rounded-xl transition-all duration-300 group-hover:bg-primary-50 ${scrolled ? "bg-primary-50/50" : "bg-primary-50/30"
                }`}
            >
              <img
                src="https://res.cloudinary.com/dnjvavy1h/image/upload/v1763387402/bongal/products/idcxtkv2xwenosvexbnw.png"
                alt="Bongal Logo"
                className="w-16 h-16 object-contain"
              />
            </div>

            <div className="transition-all duration-300">
              <h1 className="text-2xl font-bold text-primary-800 tracking-tight">বঙ্গাল</h1>
              <p className="text-xs text-primary-700 font-medium">ঐতিহ্যের সাথে বর্তমান</p>
            </div>
          </Link>


          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-5 py-2 rounded-2xl font-medium transition-all duration-300 ${isActiveLink('/')
                ? 'bg-primary-800 text-white shadow-soft'
                : 'text-primary-900 hover:bg-primary-50 hover:text-primary-800'
                }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`px-5 py-2 rounded-2xl font-medium transition-all duration-300 ${isActiveLink('/products')
                ? 'bg-primary-800 text-white shadow-soft'
                : 'text-primary-900 hover:bg-primary-50 hover:text-primary-800'
                }`}
            >
              Products
            </Link>
            <Link
              to="/community"
              className={`px-5 py-2 rounded-2xl font-medium transition-all duration-300 ${isActiveLink('/community')
                ? 'bg-primary-800 text-white shadow-soft'
                : 'text-primary-900 hover:bg-primary-50 hover:text-primary-800'
                }`}
            >
              Community
            </Link>
            {user && (
              <Link
                to="/orders"
                className={`px-5 py-2 rounded-2xl font-medium transition-all duration-300 ${isActiveLink('/orders')
                  ? 'bg-primary-800 text-white shadow-soft'
                  : 'text-primary-900 hover:bg-primary-50 hover:text-primary-800'
                  }`}
              >
                Orders
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-5 py-2 rounded-2xl font-medium transition-all duration-300 ${isActiveLink('/admin')
                  ? 'bg-primary-800 text-white shadow-soft'
                  : 'text-primary-900 hover:bg-primary-50 hover:text-primary-800'
                  }`}
              >
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-3">

            {/* Notification Bell */}
            <NotificationBell />

            <Link
              to="/cart"
              className="relative p-2 rounded-xl transition-all duration-300 hover:bg-primary-50 group"
            >
              <ShoppingCart
                size={22}
                className="text-primary-800"
              />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-soft">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-xl transition-all duration-300 hover:bg-primary-50 group"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary-300"
                    />
                  ) : (
                    <div className="bg-primary-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-soft">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="hidden md:block font-medium text-primary-900">
                    {user.name}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-cream-100 rounded-2xl shadow-soft-lg py-2 text-primary-900 border border-primary-100 backdrop-blur-md">
                    <div className="px-4 py-3 border-b border-primary-100">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-primary-900">{user.name}</p>
                        {user.isVerified && (
                          <CheckCircle size={16} className="text-accent-600" title="Verified" />
                        )}
                      </div>
                      <p className="text-sm text-primary-700">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 hover:bg-primary-50 transition-all duration-200"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={18} className="mr-3 text-primary-700" />
                      <span className="font-medium">Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-3 hover:bg-primary-50 transition-all duration-200 text-primary-900"
                    >
                      <LogOut size={18} className="mr-3 text-primary-700" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-2xl font-medium transition-all duration-300 ${isActiveLink('/login')
                    ? 'bg-primary-800 text-white shadow-soft'
                    : 'text-primary-800 hover:bg-primary-50 hover:text-primary-900'
                    }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-2xl font-medium transition-all duration-300 ${isActiveLink('/register')
                    ? 'bg-accent-600 text-white shadow-soft'
                    : 'bg-accent-600 text-white hover:bg-accent-700'
                    }`}
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              className="md:hidden p-2 rounded-xl transition-all duration-300 hover:bg-primary-50"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <X size={24} className="text-primary-800" />
              ) : (
                <Menu size={24} className="text-primary-800" />
              )}
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <nav className="md:hidden pb-6 border-t border-primary-100 pt-4 space-y-2">
            <Link
              to="/"
              className={`block py-3 px-4 rounded-2xl font-medium transition-all duration-300 ${isActiveLink('/')
                ? 'bg-primary-800 text-white shadow-soft'
                : 'text-primary-900 hover:bg-primary-50'
                }`}
              onClick={() => setShowMobileMenu(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`block py-3 px-4 rounded-2xl font-medium transition-all duration-300 ${isActiveLink('/products')
                ? 'bg-primary-800 text-white shadow-soft'
                : 'text-primary-900 hover:bg-primary-50'
                }`}
              onClick={() => setShowMobileMenu(false)}
            >
              Products
            </Link>
            <Link
              to="/community"
              className={`block py-3 px-4 rounded-2xl font-medium transition-all duration-300 ${isActiveLink('/community')
                ? 'bg-primary-800 text-white shadow-soft'
                : 'text-primary-900 hover:bg-primary-50'
                }`}
              onClick={() => setShowMobileMenu(false)}
            >
              Community
            </Link>
            {user && (
              <Link
                to="/orders"
                className={`block py-3 px-4 rounded-2xl font-medium transition-all duration-300 ${isActiveLink('/orders')
                  ? 'bg-primary-800 text-white shadow-soft'
                  : 'text-primary-900 hover:bg-primary-50'
                  }`}
                onClick={() => setShowMobileMenu(false)}
              >
                Orders
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className={`block py-3 px-4 rounded-2xl font-medium transition-all duration-300 ${isActiveLink('/admin')
                  ? 'bg-primary-800 text-white shadow-soft'
                  : 'text-primary-900 hover:bg-primary-50'
                  }`}
                onClick={() => setShowMobileMenu(false)}
              >
                Admin
              </Link>
            )}
            {!user && (
              <div className="flex space-x-3 pt-2 border-t border-primary-100 mt-4">
                <Link
                  to="/login"
                  className="flex-1 text-center py-3 px-4 rounded-2xl font-medium text-primary-800 hover:bg-primary-50 transition-all duration-300"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-center py-3 px-4 rounded-2xl font-medium bg-accent-600 text-white hover:bg-accent-700 shadow-soft transition-all duration-300"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;