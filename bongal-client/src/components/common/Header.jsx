import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Package, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/60' 
          : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          <Link 
              to="/" 
              className="flex items-center space-x-3 group"
            >
              <div
                className={`p-2 rounded-xl transition-all duration-300 group-hover:bg-gray-100 ${
                  scrolled ? "bg-gray-100/50" : "bg-gray-100/30"
                }`}
              >
                <img 
                  src="https://scontent.fdac181-1.fna.fbcdn.net/v/t39.30808-6/470184105_122114903900614532_2858168539333650952_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHM-IciSRB9-gefxHFgl2kskf7vp9vzQvqR_u-n2_NC-vSjbtaEWskgFsTY5WpjheOz4c31HvlAcJwNGtaQrDYY&_nc_ohc=4hk26wdYcOYQ7kNvwGzqjk-&_nc_oc=AdmYK41PwJId2SLLRkirc0oPkcorbElHoD0nNFcueWWM2rwrV66DRvqQVg29pJJbGcw&_nc_zt=23&_nc_ht=scontent.fdac181-1.fna&_nc_gid=tHSJi7tgou5K390Ym2QXTw&oh=00_AfikdldmWxmtkOlZc8yDheaQoWjVC0vsAOcTgQymltZyvw&oe=691D83FE"
                  alt="Logo"
                  className="w-7 h-7 object-contain" 
                />
              </div>

              <div className="transition-all duration-300">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">বঙ্গাল</h1>
                <p className="text-xs text-gray-600 font-medium">ঐতিহ্যের সাথে বর্তমান</p>
              </div>
            </Link>


          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-5 py-2 rounded-2xl font-medium transition-all duration-300 ${
                isActiveLink('/') 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`px-5 py-2 rounded-2xl font-medium transition-all duration-300 ${
                isActiveLink('/products') 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
              }`}
            >
              Products
            </Link>
            {user && (
              <Link 
                to="/orders" 
                className={`px-5 py-2 rounded-2xl font-medium transition-all duration-300 ${
                  isActiveLink('/orders') 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
              >
                Orders
              </Link>
            )}
            {isAdmin && (
              <Link 
                to="/admin" 
                className={`px-5 py-2 rounded-2xl font-medium transition-all duration-300 ${
                  isActiveLink('/admin') 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
              >
                Admin
              </Link>
            )}
          </nav>

\          <div className="flex items-center space-x-3">

            <Link 
              to="/cart" 
              className="relative p-2 rounded-xl transition-all duration-300 hover:bg-gray-100/80 group"
            >
              <ShoppingCart 
                size={22} 
                className="text-gray-700" 
              />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-xl transition-all duration-300 hover:bg-gray-100/80 group"
                >
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="hidden md:block font-medium text-gray-700">
                    {user.name}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg py-2 text-gray-700 border border-gray-200/80 backdrop-blur-md">
                    <div className="px-4 py-3 border-b border-gray-200/60">
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 hover:bg-gray-100/50 transition-all duration-200"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={18} className="mr-3 text-gray-600" />
                      <span className="font-medium">Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-100/50 transition-all duration-200 text-gray-700"
                    >
                      <LogOut size={18} className="mr-3 text-gray-600" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-2xl font-medium transition-all duration-300 ${
                    isActiveLink('/login') 
                      ? 'bg-gray-900 text-white' 
                      : 'text-blue-900 hover:bg-gray-100/80 hover:text-gray-900'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-2xl font-medium transition-all duration-300 ${
                    isActiveLink('/register') 
                      ? 'bg-gray-900 text-white' 
                      : 'text-red-800 hover:bg-gray-100/80 hover:text-gray-900'
                  }`}
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              className="md:hidden p-2 rounded-xl transition-all duration-300 hover:bg-gray-100/80"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <X size={24} className="text-gray-700" />
              ) : (
                <Menu size={24} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <nav className="md:hidden pb-6 border-t border-gray-200/60 pt-4 space-y-2">
            <Link
              to="/"
              className={`block py-3 px-4 rounded-2xl font-medium transition-all duration-300 ${
                isActiveLink('/') 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-700 hover:bg-gray-100/80'
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`block py-3 px-4 rounded-2xl font-medium transition-all duration-300 ${
                isActiveLink('/products') 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-700 hover:bg-gray-100/80'
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              Products
            </Link>
            {user && (
              <Link
                to="/orders"
                className={`block py-3 px-4 rounded-2xl font-medium transition-all duration-300 ${
                  isActiveLink('/orders') 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-700 hover:bg-gray-100/80'
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                Orders
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className={`block py-3 px-4 rounded-2xl font-medium transition-all duration-300 ${
                  isActiveLink('/admin') 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-700 hover:bg-gray-100/80'
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                Admin
              </Link>
            )}
            {!user && (
              <div className="flex space-x-3 pt-2 border-t border-gray-200/60 mt-4">
                <Link
                  to="/login"
                  className="flex-1 text-center py-3 px-4 rounded-2xl font-medium text-gray-700 hover:bg-gray-100/80 transition-all duration-300"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-center py-3 px-4 rounded-2xl font-medium bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300"
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