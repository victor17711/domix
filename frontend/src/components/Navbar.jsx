import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  Globe,
  ChevronDown,
  Phone,
  Headphones,
  Tag,
  ChevronRight,
  X
} from 'lucide-react';
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
  const [mobileMenuTab, setMobileMenuTab] = useState('menu');
  const dropdownRef = useRef(null);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setMobileMenuTab('menu');
  };

  useEffect(() => {
    fetchMenus();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const fetchMenus = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      setMenuItems(response.data.menuItems || []);
      setCategoryMenuItems(response.data.categoryMenuItems || []);
    } catch (error) {
      console.error('Error fetching menus:', error);
      setMenuItems([
        { id: '1', name: 'Acasă', url: '/', type: 'link' }
      ]);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-teal-700 text-white">
        <div className="w-full px-4 md:px-6">
          <div className="flex items-center justify-center lg:justify-between py-3 text-sm">
            <div className="flex items-center gap-3 lg:hidden text-[15px] font-medium">
              <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                <Headphones className="w-4 h-4" />
              </div>
              <span>Ai nevoie de ajutor ?</span>
              <span className="bg-yellow-400 text-black px-4 py-1 rounded-full font-bold text-sm">
                (+373) 697 11 967
              </span>
            </div>

            <div className="hidden lg:flex items-center justify-between w-full">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                    <Headphones className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-bold">Ai nevoie de ajutor ?</span>
                  <span className="bg-yellow-400 text-black px-4 py-1.5 rounded-full font-bold text-sm">
                    (+373) 697 11 967
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold hover:text-yellow-400">Română</span>
                  <ChevronDown className="w-4 h-4 hover:text-yellow-400" />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <Link to="/page/termeni-si-conditii" className="hover:text-yellow-400 transition text-sm font-bold">
                  Termeni și condiții
                </Link>
                <Link to="/page/politica-de-confidentialitate" className="hover:text-yellow-400 transition text-sm font-bold">
                  Politica de confidențialitate
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b sticky top-0 z-50 lg:static">
        <div className="w-full px-4 md:px-6 py-4 md:py-4">
          <div className="lg:hidden">
            <div className="grid grid-cols-[auto_1fr_auto] items-center">
              <div className="flex justify-start">
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="w-[52px] h-[52px] md:w-[72px] md:h-[72px] rounded-full border-2 border-gray-200 flex items-center justify-center bg-white"
                >
                  <Menu className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              <div className="flex justify-center">
                <Link to="/" className="flex items-center justify-center">
                  <img
                    src={logo}
                    alt="Domix Logo"
                    className="h-16 md:h-20 max-h-none w-auto object-contain"
                  />
                </Link>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/cart"
                  className="w-[52px] h-[52px] md:w-[72px] md:h-[72px] bg-yellow-400 rounded-full flex items-center justify-center relative"
                >
                  <ShoppingCart className="w-5 h-5 text-gray-900" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            <div className="mt-7 hidden lg:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Caută produse"
                  className="w-full h-[55px] md:h-[74px] px-7 pr-16 border-2 border-gray-200 rounded-full focus:outline-none focus:border-teal-500 text-[16px] text-gray-500 placeholder:text-gray-400"
                />
                <button className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600">
                  <Search className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-between gap-8">
            <Link to="/" className="flex-shrink-0">
              <img
                src={logo}
                alt="Domix Logo"
                className="h-16 w-auto object-contain"
              />
            </Link>

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

            <div className="flex items-center gap-6 flex-shrink-0">
              {isAuthenticated ? (
                <Link
                  to="/contul-meu"
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition">
                    <User className="w-7 h-7 text-gray-900" strokeWidth={2.5} />
                  </div>

                  <div className="text-left leading-tight">
                    <div className="text-sm font-bold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </div>

                    <div className="text-sm text-gray-600 group-hover:text-gray-900 transition">
                      Contul meu
                    </div>
                  </div>
                </Link>
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

              <Link to="/cart" className="flex items-center gap-2 group">
                <div className="w-6 h-6 md:w-12 md:h-12 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition shadow-none relative">
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
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="hidden lg:block bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="w-full px-6">
          <div className="flex items-center justify-between py-3">
            <div className="relative hidden lg:block" ref={dropdownRef}>
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
                            <div className="w-9 min-w-[36px] h-9 flex items-center justify-center overflow-hidden flex-shrink-0">
                              {item.icon.startsWith('data:image') ? (
                                <img src={item.icon} alt={item.name} className="w-full h-full object-contain" />
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
                                <div className="w-7 h-7 min-w-[28px] rounded-lg flex items-center justify-center shadow-sm overflow-hidden bg-gray-100 flex-shrink-0">
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

            <nav className="hidden lg:flex items-center gap-8 text-base font-medium">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.url}
                  className="text-gray-700 hover:text-teal-600 font-bold transition flex items-center gap-1 uppercase"
                >
                  {item.icon && <span className="text-lg">{item.icon}</span>}
                  {item.name}
                </Link>
              ))}
            </nav>

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

      {/* MOBILE MENU OVERLAY */}
      <div
        onClick={closeMobileMenu}
        className={`fixed inset-0 bg-black/45 backdrop-blur-[2px] z-[90] lg:hidden transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
      />

      {/* MOBILE SIDE MENU */}
      <div
        className={`fixed top-0 left-0 h-full w-[86%] max-w-[360px] bg-white z-[100] lg:hidden shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex h-full flex-col">
          {/* Mobile Menu Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-5 py-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-white/70">
                  Navigare
                </div>
                <div className="text-2xl font-bold mt-1">Meniu</div>
              </div>

              <button
                onClick={closeMobileMenu}
                className="w-11 h-11 rounded-xl bg-white/15 hover:bg-white/20 flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="pt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Caută produse"
                  className="w-full h-[45px] px-7 pr-16 border-2 border-white/20 bg-white text-gray-500 rounded-[10px] focus:outline-none focus:border-white"
                />
                <button className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600">
                  <Search className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* TABS */}
            <div className="mt-4 rounded-2xl bg-white/10 p-1 flex items-center gap-1">
              <button
                onClick={() => setMobileMenuTab('menu')}
                className={`flex-1 rounded-xl px-4 py-3 text-[15px] font-semibold transition ${mobileMenuTab === 'menu'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-white/85'
                  }`}
              >
                Menu
              </button>

              <button
                onClick={() => setMobileMenuTab('categories')}
                className={`flex-1 rounded-xl px-3 py-3 text-[15px] font-semibold whitespace-nowrap transition ${mobileMenuTab === 'categories'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-white/85'
                  }`}
              >
                Toate categoriile
              </button>
            </div>
          </div>

          {/* Mobile Menu Body */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {mobileMenuTab === 'menu' ? (
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.url}
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-gray-800 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon && <span className="text-lg">{item.icon}</span>}
                      <span className="font-semibold">{item.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}

                <div className="pt-4 mt-4 border-t border-gray-200">
                  {!isAuthenticated ? (
                    <button
                      onClick={() => {
                        openAuthModal('login');
                        closeMobileMenu();
                      }}
                      className="w-full rounded-2xl bg-yellow-400 text-gray-900 font-bold px-4 py-3 text-left"
                    >
                      Loghează-te
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="rounded-2xl bg-gray-100 px-4 py-3">
                        <div className="text-sm text-gray-500">Contul meu</div>
                        <Link
                          to="/contul-meu"
                          onClick={closeMobileMenu}
                          className="block rounded-2xl bg-gray-100 px-4 py-3"
                        >
                          {/* <div className="text-sm text-gray-500">Contul meu</div> */}

                          <div className="font-semibold text-gray-900 w-full text-left">
                            {user?.firstName} {user?.lastName}
                          </div>
                        </Link>
                      </div>

                      <button
                        onClick={() => {
                          logout();
                          closeMobileMenu();
                        }}
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700"
                      >
                        Ieși din cont
                      </button>
                    </div>
                  )}
                </div>
              </nav>
            ) : (
              <div className="space-y-3">
                {categoryMenuItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2"
                  >
                    <Link
                      to={item.url}
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 py-2"
                    >
                      {item.icon && (
                        <div className="w-10 h-10 min-w-[40px] rounded-xl flex items-center justify-center shadow-sm overflow-hidden bg-white flex-shrink-0">
                          {typeof item.icon === 'string' && item.icon.startsWith('data:image') ? (
                            <img src={item.icon} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg">{item.icon}</span>
                          )}
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{item.name}</div>
                      </div>
                    </Link>

                    {item.hasChildren && item.children && item.children.length > 0 && (
                      <div className="ml-13 mt-1 space-y-1 pb-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            to={child.url}
                            onClick={closeMobileMenu}
                            className="block rounded-xl px-3 py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-white transition"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Footer */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <div className="text-sm text-gray-500">24/7 Suport</div>
              <a href="tel:069711967" className="text-lg font-bold text-gray-900">
                069 711 967
              </a>
            </div>
          </div>
        </div>
      </div>

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