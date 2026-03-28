import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Phone, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-teal-700 text-white">
        <div className="w-full px-6">
          <div className="flex items-center justify-between py-2.5 text-sm">
            {/* Left Side */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>Need Support ? Call Us</span>
                <span className="bg-yellow-400 text-black px-3 py-1 rounded font-semibold ml-1">
                  (480) 555-0103
                </span>
              </div>
              <div className="hidden lg:flex items-center gap-1 cursor-pointer">
                <MapPin className="w-4 h-4" />
                <span>English</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="hidden lg:flex items-center gap-1 cursor-pointer">
                <span>💲</span>
                <span>USD</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Right Side */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span>🏷️ Fashion Category</span>
                <span className="bg-yellow-400 text-black px-3 py-1 rounded font-semibold ml-1">
                  25% OFF Today
                </span>
              </div>
              <Link to="/about" className="hover:text-yellow-400 transition">About us</Link>
              <Link to="/account" className="hover:text-yellow-400 transition">My Account</Link>
              <Link to="/wishlist" className="hover:text-yellow-400 transition">My Wishlist</Link>
              <Link to="/track-order" className="hover:text-yellow-400 transition">Order Tracking</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b">
        <div className="w-full px-6 py-6">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="bg-teal-600 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-3xl shadow-lg">
                S
              </div>
              <span className="text-4xl font-bold text-gray-900">Sellzy</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for the Items"
                  className="w-full px-6 py-4 pr-14 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 text-base"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-teal-600 text-white p-3 rounded-md hover:bg-teal-700 transition">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Account Button */}
              {isAuthenticated ? (
                <div className="flex flex-col items-center cursor-pointer group">
                  <div className="bg-yellow-400 text-black w-14 h-14 rounded-full flex items-center justify-center mb-1 group-hover:bg-yellow-500 transition shadow-md">
                    <User className="w-7 h-7" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600">Account</div>
                    <button onClick={logout} className="text-sm font-semibold text-gray-900 hover:text-teal-600">
                      log out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex flex-col items-center group"
                >
                  <div className="bg-yellow-400 text-black w-14 h-14 rounded-full flex items-center justify-center mb-1 group-hover:bg-yellow-500 transition shadow-md">
                    <User className="w-7 h-7" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600">Account</div>
                    <div className="text-sm font-semibold text-gray-900">log in</div>
                  </div>
                </button>
              )}

              {/* Cart Button */}
              <Link to="/cart" className="flex flex-col items-center group">
                <div className="bg-yellow-400 text-black w-14 h-14 rounded-full flex items-center justify-center mb-1 relative group-hover:bg-yellow-500 transition shadow-md">
                  <ShoppingCart className="w-7 h-7" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600">Cart</div>
                  <div className="text-sm font-semibold text-gray-900">{cartCount} Items</div>
                </div>
              </Link>

              {/* Mobile Menu Toggle */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="w-full px-6">
          <div className="flex items-center justify-between py-4">
            {/* Explore Categories Button */}
            <button className="bg-teal-600 text-white px-8 py-3.5 rounded-lg flex items-center gap-3 hover:bg-teal-700 transition shadow-md font-semibold text-base">
              <Menu className="w-5 h-5" />
              Explore All Categories
              <ChevronDown className="w-5 h-5" />
            </button>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 text-base">
              <Link to="/" className="text-teal-600 font-semibold hover:text-teal-700 transition">
                Home
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-teal-600 transition">
                About Us
              </Link>
              <Link to="/shop" className="text-gray-700 hover:text-teal-600 transition flex items-center gap-1">
                Shop <ChevronDown className="w-4 h-4" />
              </Link>
              <Link to="/sellers" className="text-gray-700 hover:text-teal-600 transition flex items-center gap-1">
                Sellers <ChevronDown className="w-4 h-4" />
              </Link>
              <Link to="/mega-menu" className="text-gray-700 hover:text-teal-600 transition flex items-center gap-1">
                Mega Menu <ChevronDown className="w-4 h-4" />
              </Link>
              <Link to="/blog" className="text-gray-700 hover:text-teal-600 transition flex items-center gap-1">
                Blog <ChevronDown className="w-4 h-4" />
              </Link>
              <Link to="/pages" className="text-gray-700 hover:text-teal-600 transition flex items-center gap-1">
                Pages <ChevronDown className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-teal-600 transition">
                Contact
              </Link>
            </nav>

            {/* Support Info */}
            <div className="hidden lg:flex items-center gap-3">
              <Phone className="w-6 h-6 text-gray-600" />
              <div>
                <div className="text-xs text-gray-500">24/7 Support</div>
                <div className="text-base font-bold text-gray-900">888-777-999</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b shadow-lg">
          <nav className="w-full px-6 py-4 flex flex-col gap-4">
            <Link to="/" className="text-gray-700 hover:text-teal-600 font-semibold" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-teal-600" onClick={() => setIsMenuOpen(false)}>
              About Us
            </Link>
            <Link to="/shop" className="text-gray-700 hover:text-teal-600" onClick={() => setIsMenuOpen(false)}>
              Shop
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-teal-600" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            {!isAuthenticated && (
              <button
                onClick={() => { openAuthModal('login'); setIsMenuOpen(false); }}
                className="text-left text-gray-700 hover:text-teal-600 font-semibold"
              >
                Login
              </button>
            )}
          </nav>
        </div>
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
      />
    </>
  );
};

export default Navbar;
