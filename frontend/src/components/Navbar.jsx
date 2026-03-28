import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Heart, Menu, X, ChevronDown, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const Navbar = () => {
  const { cartCount, wishlist } = useCart();
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
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>Need Support ? Call Us</span>
                <span className="bg-yellow-500 text-black px-2 py-0.5 rounded font-semibold">(485) 555-0103</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <span>English</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="hidden md:flex items-center gap-2">
                <span>USD</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="bg-yellow-500 text-black px-2 py-0.5 rounded font-semibold">25% OFF</span>
                Fashion Category Today
              </span>
              <Link to="/about" className="hover:text-yellow-400">About us</Link>
              <Link to="/account" className="hover:text-yellow-400">My Account</Link>
              <Link to="/wishlist" className="hover:text-yellow-400">My Wishlist</Link>
              <Link to="/track-order" className="hover:text-yellow-400">Order Tracking</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="w-full px-6">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-teal-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">
                S
              </div>
              <span className="text-2xl font-bold text-gray-800">Sellzy</span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for the items"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-2">
                  <div className="bg-yellow-400 text-black w-10 h-10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Account</span>
                    <button onClick={logout} className="text-sm font-semibold text-gray-800 hover:text-teal-600">log out</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="hidden md:flex items-center gap-2"
                >
                  <div className="bg-yellow-400 text-black w-10 h-10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Account</span>
                    <span className="text-sm font-semibold text-gray-800">log in</span>
                  </div>
                </button>
              )}

              <Link to="/cart" className="relative">
                <div className="bg-yellow-400 text-black w-10 h-10 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="border-t">
          <div className="w-full px-6">
            <div className="flex items-center justify-between">
              <button className="bg-teal-600 text-white px-6 py-3 rounded-md flex items-center gap-2 hover:bg-teal-700 transition">
                <Menu className="w-5 h-5" />
                Explore All Categories
                <ChevronDown className="w-4 h-4" />
              </button>

              <nav className="hidden md:flex items-center gap-6 py-3">
                <Link to="/" className="text-teal-600 font-semibold hover:text-teal-700">Home</Link>
                <Link to="/about" className="text-gray-700 hover:text-teal-600">About Us</Link>
                <Link to="/shop" className="text-gray-700 hover:text-teal-600 flex items-center gap-1">
                  Shop <ChevronDown className="w-4 h-4" />
                </Link>
                <Link to="/sellers" className="text-gray-700 hover:text-teal-600 flex items-center gap-1">
                  Sellers <ChevronDown className="w-4 h-4" />
                </Link>
                <Link to="/mega-menu" className="text-gray-700 hover:text-teal-600 flex items-center gap-1">
                  Mega Menu <ChevronDown className="w-4 h-4" />
                </Link>
                <Link to="/blog" className="text-gray-700 hover:text-teal-600 flex items-center gap-1">
                  Blog <ChevronDown className="w-4 h-4" />
                </Link>
                <Link to="/pages" className="text-gray-700 hover:text-teal-600 flex items-center gap-1">
                  Pages <ChevronDown className="w-4 h-4" />
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-teal-600">Contact</Link>
              </nav>

              <div className="hidden md:flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-600" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">24/7 Support</span>
                  <span className="text-sm font-semibold text-gray-800">888-777-999</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="w-full px-6 py-4 flex flex-col gap-4">
            <Link to="/" className="text-gray-700 hover:text-teal-600">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-teal-600">About Us</Link>
            <Link to="/shop" className="text-gray-700 hover:text-teal-600">Shop</Link>
            <Link to="/contact" className="text-gray-700 hover:text-teal-600">Contact</Link>
            {!isAuthenticated && (
              <button
                onClick={() => openAuthModal('login')}
                className="text-left text-gray-700 hover:text-teal-600"
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
