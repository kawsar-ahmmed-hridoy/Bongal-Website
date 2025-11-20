import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import NotificationBell from './NotificationBell';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const colors = {
    darkBlue: '#011D4D',
    mediumBlue: '#034078',
    teal: '#1282A2',
    cream: '#E4DFDA',
    brown: '#63372C'
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (path, callback) => {
    setIsNavigating(true);
    
    setTimeout(() => {
      if (callback) callback();
      navigate(path);
      
      setTimeout(() => setIsNavigating(false), 300);
    }, 150);
  };

  const handleLogout = () => {
    setIsNavigating(true);
    setTimeout(() => {
      logout();
      navigate('/');
      setTimeout(() => setIsNavigating(false), 300);
    }, 150);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const NavLink = ({ to, children, mobile = false, onClick }) => {
    const handleClick = (e) => {
      e.preventDefault();
      handleNavigation(to, () => {
        if (onClick) onClick();
        setShowMobileMenu(false);
        setShowUserMenu(false);
      });
    };

    const baseClasses = mobile 
      ? `block py-3 px-4 rounded-2xl font-medium transition-all duration-500 transform hover:scale-105`
      : `px-5 py-2 rounded-2xl font-medium transition-all duration-500 transform hover:scale-105`;

    const activeClasses = isActiveLink(to)
      ? 'text-white shadow-lg scale-105'
      : 'text-gray-800 hover:text-white';

    return (
      <Link
        to={to}
        onClick={handleClick}
        className={`
          ${baseClasses}
          ${activeClasses}
          relative overflow-hidden group
          ${isActiveLink(to) 
            ? `bg-gradient-to-r from-[${colors.darkBlue}] to-[${colors.mediumBlue}]` 
            : `hover:bg-gradient-to-r hover:from-[${colors.mediumBlue}] hover:to-[${colors.teal}]`
          }
        `}
        style={{
          background: isActiveLink(to) 
            ? `linear-gradient(135deg, ${colors.darkBlue}, ${colors.mediumBlue})`
            : 'transparent'
        }}
      >
        <span className="relative z-10">{children}</span>
        <div 
          className="absolute inset-0 bg-gradient-to-r from-[#011D4D] to-[#1282A2] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${colors.darkBlue}, ${colors.teal})`
          }}
        />
      </Link>
    );
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-gradient-to-br from-[${colors.darkBlue}] to-[${colors.teal}] z-40 transition-all duration-500 transform ${
          isNavigating ? 'scale-100 opacity-30' : 'scale-110 opacity-0 pointer-events-none'
        }`}
      />
      
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? `bg-[${colors.cream}]/95 backdrop-blur-md shadow-soft border-b`
            : `bg-[${colors.cream}]/90 backdrop-blur-sm`
        }`}
        style={{
          backgroundColor: scrolled ? `${colors.cream}f2` : `${colors.cream}e6`,
          borderColor: `${colors.mediumBlue}20`
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/');
              }}
              className="flex items-center space-x-3 group relative"
            >
              <div
                className={`p-1 rounded-l transition-all duration-500 group-hover:scale-110 ${
                  scrolled 
                    ? `bg-[${colors.mediumBlue}]/10` 
                    : `bg-[${colors.mediumBlue}]/5`
                }`}
                style={{
                  background: scrolled 
                    ? `${colors.mediumBlue}1a`
                    : `${colors.mediumBlue}0d`
                }}
              >
                <img
                  src="https://res.cloudinary.com/dnjvavy1h/image/upload/v1763387402/bongal/products/idcxtkv2xwenosvexbnw.png"
                  alt="Bongal Logo"
                  className="w-16 h-16 object-contain transition-transform duration-500 group-hover:rotate-6"
                />
              </div>

              <div className="transition-all duration-500 group-hover:translate-x-1">
                <h1 
                  className="text-2xl font-bold tracking-tight"
                  style={{ color: colors.darkBlue }}
                >
                  বঙ্গাল
                </h1>
                <p 
                  className="text-xs font-medium"
                  style={{ color: colors.mediumBlue }}
                >
                  ঐতিহ্যের সাথে বর্তমান
                </p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/products">Products</NavLink>
              <NavLink to="/community">Community</NavLink>
              {user && <NavLink to="/orders">Orders</NavLink>}
              {isAdmin && <NavLink to="/admin">Admin</NavLink>}
            </nav>

            <div className="flex items-center space-x-3">
              <NotificationBell />

              <Link
                to="/cart"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('/cart');
                }}
                className="relative p-2 rounded-xl transition-all duration-500 hover:scale-110 group"
                style={{ backgroundColor: `${colors.mediumBlue}10` }}
              >
                <ShoppingCart
                  size={22}
                  style={{ color: colors.darkBlue }}
                />
                {cartCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg transition-all duration-500 hover:scale-125"
                    style={{ 
                      backgroundColor: colors.teal,
                      boxShadow: `0 4px 12px ${colors.teal}40`
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-xl transition-all duration-500 hover:scale-105 group"
                    style={{ backgroundColor: `${colors.mediumBlue}10` }}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 transition-all duration-500 group-hover:border-[#1282A2]"
                        style={{ borderColor: `${colors.mediumBlue}40` }}
                      />
                    ) : (
                      <div 
                        className="text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg transition-all duration-500 group-hover:scale-110"
                        style={{ 
                          backgroundColor: colors.darkBlue,
                          boxShadow: `0 4px 12px ${colors.darkBlue}40`
                        }}
                      >
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <span 
                      className="hidden md:block font-medium"
                      style={{ color: colors.darkBlue }}
                    >
                      {user.name}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div 
                      className="absolute right-0 mt-2 w-56 rounded-2xl shadow-soft-lg py-2 border backdrop-blur-md animate-in fade-in-0 zoom-in-95"
                      style={{ 
                        backgroundColor: `${colors.cream}f2`,
                        borderColor: `${colors.mediumBlue}20`
                      }}
                    >
                      <div className="px-4 py-3 border-b" style={{ borderColor: `${colors.mediumBlue}20` }}>
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold" style={{ color: colors.darkBlue }}>{user.name}</p>
                          {user.isVerified && (
                            <CheckCircle size={16} style={{ color: colors.teal }} title="Verified" />
                          )}
                        </div>
                        <p className="text-sm" style={{ color: colors.mediumBlue }}>{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigation('/profile', () => setShowUserMenu(false));
                        }}
                        className="flex items-center px-4 py-3 transition-all duration-300 hover:pl-6 group"
                        style={{ backgroundColor: `${colors.mediumBlue}08` }}
                      >
                        <User size={18} className="mr-3" style={{ color: colors.mediumBlue }} />
                        <span className="font-medium" style={{ color: colors.darkBlue }}>Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-3 transition-all duration-300 hover:pl-6 group"
                        style={{ backgroundColor: `${colors.brown}08` }}
                      >
                        <LogOut size={18} className="mr-3" style={{ color: colors.brown }} />
                        <span className="font-medium" style={{ color: colors.brown }}>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <NavLink to="/login">Login</NavLink>
                </div>
              )}

              <button
                className="md:hidden p-2 rounded-xl transition-all duration-500 hover:scale-110"
                style={{ backgroundColor: `${colors.mediumBlue}10` }}
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? (
                  <X size={24} style={{ color: colors.darkBlue }} />
                ) : (
                  <Menu size={24} style={{ color: colors.darkBlue }} />
                )}
              </button>
            </div>
          </div>

          {showMobileMenu && (
            <nav 
              className="md:hidden pb-6 border-t pt-4 space-y-2 animate-in slide-in-from-top-5"
              style={{ 
                borderColor: `${colors.mediumBlue}20`,
                backgroundColor: `${colors.cream}f8`
              }}
            >
              <NavLink to="/" mobile onClick={() => setShowMobileMenu(false)}>Home</NavLink>
              <NavLink to="/products" mobile onClick={() => setShowMobileMenu(false)}>Products</NavLink>
              <NavLink to="/community" mobile onClick={() => setShowMobileMenu(false)}>Community</NavLink>
              {user && <NavLink to="/orders" mobile onClick={() => setShowMobileMenu(false)}>Orders</NavLink>}
              {isAdmin && <NavLink to="/admin" mobile onClick={() => setShowMobileMenu(false)}>Admin</NavLink>}
              
              {!user && (
                <div className="flex space-x-3 pt-2 border-t mt-4" style={{ borderColor: `${colors.mediumBlue}20` }}>
                  <NavLink to="/login" mobile onClick={() => setShowMobileMenu(false)}>Login</NavLink>
                  <Link
                    to="/register"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation('/register', () => setShowMobileMenu(false));
                    }}
                    className="flex-1 text-center py-3 px-4 rounded-2xl font-medium text-white shadow-lg transition-all duration-500 transform hover:scale-105"
                    style={{ backgroundColor: colors.teal }}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;