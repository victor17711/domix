import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import HeroSlider from '../components/HeroSlider';
import CategoryGrid from '../components/CategoryGrid';
import ProductCard from '../components/ProductCard';
import CountdownTimer from '../components/CountdownTimer';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('mens');
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    fetchSettings();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (settings?.featuredCategoryId) {
      fetchFeaturedProducts();
    }
  }, [settings]);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      // Fetch category details
      const categoryRes = await axios.get(`${API}/categories`);
      const category = categoryRes.data.find(cat => cat.id === settings.featuredCategoryId);

      if (category) {
        const response = await axios.get(`${API}/products?category=${encodeURIComponent(category.name)}`);
        setFeaturedProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    </div>;
  }

  // Product sections
  const hotPicksProducts = products.slice(0, 6);
  const flashDealProducts = products.slice(6, 11);
  const freshFindsProducts = products.slice(11, 19);

  const tabs = [
    { id: 'mens', label: "Men's Fashion" },
    { id: 'womens', label: "Women's Fashion" },
    { id: 'kids', label: 'Kids Clothing' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'jewelry', label: 'Jewelry & Watches' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Categories Grid */}
      <CategoryGrid />

      {/* Today's Hot Picks Section - Carousel */}
      <section className="py-12 bg-gray-50">
        <div className="w-full px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-3xl font-bold mb-4 md:mb-0">Produse cu reducere</h2>
            <CountdownTimer targetDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} />
          </div>

          {featuredProducts.length > 0 ? (
            <div className="relative">
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={12}
                slidesPerView={1.5}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                }}
                speed={900}
                autoplay={{
                  delay: 4500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true
                }}
                loop={true}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                  1280: { slidesPerView: 5 }
                }}
                className="hot-picks-carousel"
              >
                {featuredProducts.map((product) => (
                  <SwiperSlide key={product.id}>
                    <ProductCard product={product} showProgress />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Buttons */}
              <button
                ref={prevRef}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-teal-600 hover:bg-teal-600 hover:text-white transition-all duration-300 hover:scale-110 border border-gray-200"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                ref={nextRef}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-teal-600 hover:bg-teal-600 hover:text-white transition-all duration-300 hover:scale-110 border border-gray-200"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {products.slice(0, 10).map((product) => (
                <ProductCard key={product.id} product={product} showProgress />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Flash Fashion Deal Section */}
      <section className="py-12">
        <div className="w-full px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Flash Fashion Deal</h2>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8 border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-semibold transition border-b-2 ${activeTab === tab.id
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {flashDealProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-8">
        <div className="w-full px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Banner 1 */}
            <div className="bg-teal-600 rounded-2xl overflow-hidden relative group">
              <div className="p-8 relative z-10">
                <span className="text-white text-sm mb-2 block">Enjoy 20% savings</span>
                <h3 className="text-white text-2xl font-bold mb-4">From Runway to Your Closet</h3>
                <button className="bg-white text-teal-600 px-6 py-2 rounded-full hover:bg-gray-100 transition">
                  Shop Now
                </button>
              </div>
              <div className="absolute bottom-0 right-0 w-1/2 h-full opacity-20">
                <div className="w-full h-full bg-gradient-to-l from-white/20 to-transparent" />
              </div>
            </div>

            {/* Banner 2 */}
            <div className="bg-pink-100 rounded-2xl overflow-hidden relative group">
              <div className="p-8 relative z-10">
                <span className="text-gray-700 text-sm mb-2 block">Enjoy 20% savings</span>
                <h3 className="text-gray-900 text-2xl font-bold mb-4">Women's Clothing</h3>
                <button className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition">
                  Shop Now
                </button>
              </div>
            </div>

            {/* Banner 3 */}
            <div className="bg-blue-100 rounded-2xl overflow-hidden relative group">
              <div className="p-8 relative z-10">
                <span className="text-gray-700 text-sm mb-2 block">Enjoy 20% savings</span>
                <h3 className="text-gray-900 text-2xl font-bold mb-4">Kids & Baby Clothing</h3>
                <button className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Shipment Ticker */}
      <section className="py-6 bg-gray-50">
        <div className="w-full">
          <div className="overflow-hidden">
            <div className="flex animate-scroll">
              {[...Array(12)].map((_, i) => (
                <span key={i} className="mx-8 text-lg font-semibold text-gray-600 whitespace-nowrap">
                  ★ Free shipment
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-12">
        <div className="w-full px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
            {['Cowshed', 'Ninoa', 'Claudia', 'Minut', 'Orchard'].map((brand, index) => (
              <div key={index} className="flex justify-center">
                <div className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition">
                  {brand}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Fresh Finds Section */}
      <section className="py-12">
        <div className="w-full px-6">
          <div className="flex flex-wrap justify-center gap-4 mb-8 border-b">
            <button className="px-6 py-3 font-semibold border-b-2 border-teal-600 text-teal-600">
              Fresh Finds
            </button>
            <button className="px-6 py-3 font-semibold border-b-2 border-transparent text-gray-600 hover:text-gray-900">
              Top Sellers
            </button>
            <button className="px-6 py-3 font-semibold border-b-2 border-transparent text-gray-600 hover:text-gray-900">
              Most Wanted
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {freshFindsProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 bg-[#fff]">
        <div className="w-full px-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

            <div className="rounded-[24px] bg-[#9ad3d3] px-8 py-6 text-center flex flex-col items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
              <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center mb-5">
                <svg className="w-9 h-9 text-[#2f3137]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17H6a2 2 0 01-2-2v-3.5a1.5 1.5 0 011.5-1.5H7l1.5-3h5l1.5 3H17a3 3 0 013 3v2a2 2 0 01-2 2h-1m-8 0a2 2 0 104 0m-4 0a2 2 0 104 0m-4 0H9m4 0h2" />
                </svg>
              </div>
              <h3 className="text-[18px] leading-none font-extrabold text-[#1f2430] mb-2">
                Livrare gratuită
              </h3>
              <p className="text-[15px] leading-[1.45] text-[#4b5563] max-w-[360px]">
                Bucură-te de livrare gratuită pentru fiecare comandă
              </p>
            </div>

            <div className="rounded-[24px] bg-[#f3e466] px-8 py-6 text-center flex flex-col items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
              <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center mb-5">
                <svg className="w-9 h-9 text-[#2f3137]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18 10a6 6 0 10-12 0v4a2 2 0 002 2h1v-4H8m8 0v4h1a2 2 0 002-2v-4m-5 9h-4" />
                </svg>
              </div>
              <h3 className="text-[18px] leading-none font-extrabold text-[#1f2430] mb-2">
                Suport 24/7
              </h3>
              <p className="text-[15px] leading-[1.45] text-[#4b5563] max-w-[360px]">
                Asistență non-stop, ori de câte ori ai nevoie
              </p>
            </div>

            <div className="rounded-[24px] bg-[#f3b98f] px-8 py-6 text-center flex flex-col items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
              <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center mb-5">
                <svg className="w-9 h-9 text-[#2f3137]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h10M7 11h10M8 4h8a2 2 0 012 2v9a5 5 0 11-10 0V6a2 2 0 012-2z" />
                </svg>
              </div>
              <h3 className="text-[18px] leading-none font-extrabold text-[#1f2430] mb-2">
                Retur în 30 de zile
              </h3>
              <p className="text-[15px] leading-[1.45] text-[#4b5563] max-w-[390px]">
                Satisfacția ta este prioritatea noastră: poți returna orice produs în termen de 30 de zile
              </p>
            </div>

            <div className="rounded-[24px] bg-[#99dc6c] px-8 py-6 text-center flex flex-col items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
              <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center mb-5">
                <svg className="w-9 h-9 text-[#2f3137]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0zm-9 7a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
              </div>
              <h3 className="text-[18px] leading-none font-extrabold text-[#1f2430] mb-2">
                Plată securizată
              </h3>
              <p className="text-[15px] leading-[1.45] text-[#4b5563] max-w-[380px]">
                Cumpărături fără griji, cu opțiuni de plată sigure și protejate
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

