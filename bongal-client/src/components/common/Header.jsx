import React from "react";
import { Package, ShoppingCart, Menu, X } from "lucide-react";

const Header = () => {
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  return (
    <header className="bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">

          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <Package className="text-green-700" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">বঙ্গাল</h1>
              <p className="text-xs text-green-100">ঐতিহ্যের সাথে বর্তমান</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ShoppingCart size={24} className="cursor-pointer" />
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
            <div className="block py-2 hover:bg-green-600 px-2 rounded cursor-pointer">
              Home
            </div>
            <div className="block py-2 hover:bg-green-600 px-2 rounded cursor-pointer">
              Products
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
