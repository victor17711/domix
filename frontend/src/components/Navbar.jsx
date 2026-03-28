import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, ChevronDown, Phone, MapPin, Headphones, DollarSign, Tag } from 'lucide-react';
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
          <div className="flex items-center justify-between py-3 text-sm">
            {/* Left Side */}
            <div className="flex items-center gap-6">
              {/* Need Support */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                  <Headphones className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm">Need Support ? Call Us</span>
                <span className="bg-yellow-400 text-black px-4 py-1.5 rounded-full font-bold text-sm">
                  (480) 555-0103
                </span>
              </div>

              {/* Language */}
              <div className="hidden lg:flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm">Română</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Right Side */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Fashion Category */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                  <Tag className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm">Fashion Category</span>
                <span className="bg-yellow-400 text-black px-4 py-1.5 rounded-full font-bold text-sm">
                  25% OFF Today
                </span>
              </div>
              
              {/* Links */}
              <Link to="/about" className="hover:text-yellow-400 transition text-sm">About us</Link>
              <Link to="/account" className="hover:text-yellow-400 transition text-sm">My Account</Link>
              <Link to="/wishlist" className="hover:text-yellow-400 transition text-sm">My Wishlist</Link>
              <Link to="/track-order" className="hover:text-yellow-400 transition text-sm">Order Tracking</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b">
        <div className="w-full px-6 py-6">
          <div className="flex items-center justify-between gap-8">
            {/* Logo - Text Style */}
            <Link to="/" className="flex-shrink-0">
              <div className="text-5xl font-bold">
                <span className="text-teal-600">S</span>
                <span className="text-gray-900">ellzy</span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for the Items"
                  className="w-full px-6 py-4 pr-14 border-2 border-gray-200 rounded-full focus:outline-none focus:border-teal-500 text-base"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600">
                  <Search className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Right Side - Account and Cart without yellow background */}
            <div className="flex items-center gap-6 flex-shrink-0">
              {/* Account Button - No background */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition shadow-md">
                    <User className="w-7 h-7 text-gray-900" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-gray-900">Account</div>
                    <button onClick={logout} className="text-sm text-gray-600 hover:text-gray-900">
                      log out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-2 group"
                >
                  <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition shadow-md">
                    <User className="w-7 h-7 text-gray-900" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-gray-900">Account</div>
                    <div className="text-sm text-gray-600">log in</div>
                  </div>
                </button>
              )}

              {/* Cart Button - No background */}
              <Link 
                to="/cart" 
                className="flex items-center gap-2 group"
              >
                <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition shadow-md relative">
                  <ShoppingCart className="w-7 h-7 text-gray-900" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">Cart</div>
                  <div className="text-sm text-gray-600">{cartCount}- Items</div>
                </div>
              </Link>

              {/* Mobile Menu Toggle */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden ml-4">
                {isMenuOpen ? <Menu className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            <button className="bg-teal-600 text-white px-8 py-4 rounded-xl flex items-center gap-3 hover:bg-teal-700 transition shadow-md font-semibold">
              <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                <div className="bg-white rounded-sm"></div>
                <div className="bg-white rounded-sm"></div>
                <div className="bg-white rounded-sm"></div>
                <div className="bg-white rounded-sm"></div>
              </div>
              Explore All Categories
              <ChevronDown className="w-5 h-5" />
            </button>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 text-base font-medium">
              <Link to="/" className="text-teal-600 hover:text-teal-700 transition flex items-center gap-1">
                Home <ChevronDown className="w-4 h-4" />
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
              <div className="w-12 h-12 border-2 border-gray-300 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">24/7 Support</div>
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
