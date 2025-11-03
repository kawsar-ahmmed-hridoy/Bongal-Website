import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Package, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <Package className="text-green-700" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">বঙ্গাল</h1>
              <p className="text-xs text-green-100">Village Purity, Digital Convenience</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-green-200 transition">Home</Link>
            <Link to="/products" className="hover:text-green-200 transition">Products</Link>
            {user && (
              <Link to="/orders" className="hover:text-green-200 transition">Orders</Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="hover:text-green-200 transition">Admin</Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">

            <Link to="/cart" className="relative hover:text-green-200 transition">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 hover:text-green-200 transition"
                >
                  <div className="bg-white text-green-700 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="hidden md:block">{user.name}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 text-gray-800">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100 transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={16} className="inline mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-red-600"
                    >
                      <LogOut size={16} className="inline mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition"
              >
                Login
              </Link>
            )}

            <button
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <nav className="md:hidden mt-4 pb-4 border-t border-green-500 pt-4 space-y-2">
            <Link
              to="/"
              className="block py-2 hover:bg-green-600 px-2 rounded"
              onClick={() => setShowMobileMenu(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block py-2 hover:bg-green-600 px-2 rounded"
              onClick={() => setShowMobileMenu(false)}
            >
              Products
            </Link>
            {user && (
              <Link
                to="/orders"
                className="block py-2 hover:bg-green-600 px-2 rounded"
                onClick={() => setShowMobileMenu(false)}
              >
                Orders
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="block py-2 hover:bg-green-600 px-2 rounded"
                onClick={() => setShowMobileMenu(false)}
              >
                Admin
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
