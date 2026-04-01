import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, Globe, ChevronDown, Phone, MapPin, Headphones, DollarSign, Tag, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import axios from 'axios';
import logo from "../assets/images/logo.png";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categoryMenuItems, setCategoryMenuItems] = useState([]);
  const dropdownRef = useRef(null);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  useEffect(() => {
    fetchMenus();
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      setMenuItems(response.data.menuItems || []);
      setCategoryMenuItems(response.data.categoryMenuItems || []);
    } catch (error) {
      console.error('Error fetching menus:', error);
      // Set default menus if fetch fails
      setMenuItems([
        { id: '1', name: 'Acasă', url: '/', type: 'link' }
      ]);
    }
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
                <span className="text-sm">Ai nevoie de ajutor ?</span>
                <span className="bg-yellow-400 text-black px-4 py-1.5 rounded-full font-bold text-sm">
                  (373) 697 11 967
                </span>
              </div>

              {/* Language */}
              <div className="hidden lg:flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="text-sm">Română</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Right Side */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Fashion Category
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                  <Tag className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm">Fashion Category</span>
                <span className="bg-yellow-400 text-black px-4 py-1.5 rounded-full font-bold text-sm">
                  25% OFF Today
                </span>
              </div> */}

              {/* Links */}
              <Link to="/about" className="hover:text-yellow-400 transition text-sm">Termeni și condiții</Link>
              <Link to="/brands" className="hover:text-yellow-400 transition text-sm">Branduri</Link>
              <Link to="/contact" className="hover:text-yellow-400 transition text-sm">Contact</Link>
              {/* <Link to="/track-order" className="hover:text-yellow-400 transition text-sm">Order Tracking</Link> */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between gap-8">
            <Link to="/" className="flex-shrink-0">
              <img
                src={logo}
                alt="Domix Logo"
                className="h-16 w-auto object-contain"
              />
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cauta produse"
                  className="w-full px-6 py-4 pr-14 border-2 border-gray-200 rounded-full focus:outline-none focus:border-teal-500 text-base"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600">
                  <Search className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Right Side - Account and Cart */}
            <div className="flex items-center gap-6 flex-shrink-0">
              {/* Account Button */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition shadow-md">
                    <User className="w-7 h-7 text-gray-900" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-gray-900">Contul meu</div>
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
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition shadow-none">
                    <User className="w-6 h-6 text-gray-900" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-gray-900">Contul meu</div>
                    <div className="text-sm text-gray-600">Loghează-te</div>
                  </div>
                </button>
              )}

              {/* Cart Button */}
              <Link
                to="/cart"
                className="flex items-center gap-2 group"
              >
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition shadow-none relative">
                  <ShoppingCart className="w-6 h-6 text-gray-900" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">Coș</div>
                  <div className="text-sm text-gray-600">{cartCount}- Articole</div>
                </div>
              </Link>

              {/* Mobile Menu Toggle */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden ml-4">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="w-full px-6">
          <div className="flex items-center justify-between py-3">
            {/* Explore Categories Button with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="bg-teal-600 text-white px-8 py-4 rounded-xl flex items-center gap-3 hover:bg-teal-700 transition shadow-md font-semibold"
              >
                <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                </div>
                Toate categoriile
                <ChevronDown className={`w-5 h-5 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isCategoriesOpen && categoryMenuItems.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                  {categoryMenuItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="relative"
                      onMouseEnter={() => setHoveredCategoryId(item.id)}
                      onMouseLeave={() => setHoveredCategoryId(null)}
                    >
                      <Link
                        to={item.url}
                        onClick={() => {
                          setIsCategoriesOpen(false);
                          setHoveredCategoryId(null);
                        }}
                        className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-teal-50 transition"
                      >
                        <div className="flex items-center gap-3">
                          {item.icon && (
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm hover:scale-105 transition-transform overflow-hidden bg-gray-100">
                              {item.icon.startsWith('data:image') ? (
                                <img src={item.icon} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-lg">{item.icon}</span>
                              )}
                            </div>
                          )}
                          <div className="font-semibold text-gray-900 hover:text-teal-600 transition text-base">
                            {item.name}
                          </div>
                        </div>
                        {item.hasChildren && item.children && item.children.length > 0 && (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </Link>

                      {/* Sub-dropdown for children - appears on hover */}
                      {item.hasChildren && item.children && item.children.length > 0 && hoveredCategoryId === item.id && (
                        <div className="absolute left-full top-0 ml-1 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                          {item.children.map((child) => (
                            <Link
                              key={child.id}
                              to={child.url}
                              onClick={() => {
                                setIsCategoriesOpen(false);
                                setHoveredCategoryId(null);
                              }}
                              className="flex items-center gap-3 px-4 py-2 hover:bg-teal-50 transition"
                            >
                              {child.icon && (
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm overflow-hidden bg-gray-100">
                                  {child.icon.startsWith('data:image') ? (
                                    <img src={child.icon} alt={child.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-base">{child.icon}</span>
                                  )}
                                </div>
                              )}
                              <div className="font-medium text-gray-700 hover:text-teal-600 transition text-sm">
                                {child.name}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dynamic Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 text-base font-medium">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.url}
                  className="text-gray-700 hover:text-teal-600 font-bold transition flex items-center gap-1"
                >
                  {item.icon && <span className="text-lg">{item.icon}</span>}
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Support Info */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="w-12 h-12 border-2 border-gray-300 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">24/7 Suport</div>
                <div className="text-base font-bold text-gray-900">069 711 967</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b shadow-lg">
          <nav className="w-full px-6 py-4 flex flex-col gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.url}
                className="text-gray-700 hover:text-teal-600 font-semibold flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon && <span>{item.icon}</span>}
                {item.name}
              </Link>
            ))}
            
            {categoryMenuItems.length > 0 && (
              <div className="border-t pt-4 mt-2">
                <div className="text-xs font-bold text-gray-500 mb-2">CATEGORII</div>
                {categoryMenuItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.url}
                    className="text-gray-700 hover:text-teal-600 flex items-center gap-2 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon && <span className="text-xl">{item.icon}</span>}
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
            
            {!isAuthenticated && (
              <button
                onClick={() => { openAuthModal('login'); setIsMenuOpen(false); }}
                className="text-left text-gray-700 hover:text-teal-600 font-semibold"
              >
                Loghează-te
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
