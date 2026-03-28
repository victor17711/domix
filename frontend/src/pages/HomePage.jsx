import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroSlider from '../components/HeroSlider';
import CategoryGrid from '../components/CategoryGrid';
import ProductCard from '../components/ProductCard';
import CountdownTimer from '../components/CountdownTimer';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('mens');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProducts();
  }, []);

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

      {/* Today's Hot Picks Section */}
      <section className="py-12 bg-gray-50">
        <div className="w-full px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-3xl font-bold mb-4 md:mb-0">Today's Hot Picks</h2>
            <CountdownTimer targetDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {hotPicksProducts.map((product) => (
              <ProductCard key={product.id} product={product} showProgress />
            ))}
          </div>
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
                className={`px-6 py-3 font-semibold transition border-b-2 ${
                  activeTab === tab.id
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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

      {/* Hand Picked Section */}
      <section className="py-12 bg-gray-50">
        <div className="w-full px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Hand picked Just for You</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {/* Product Showcase 1 */}
            <div className="space-y-4">
              <div className="relative aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400"
                  alt="Product"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Bali Underware Bra</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500">(189)</span>
                </div>
                <div className="flex gap-1 mb-3">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button key={size} className="px-2 py-1 text-xs border border-gray-300 rounded hover:border-teal-600">
                      {size}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold">$27.46</span>
                  <span className="text-sm text-gray-400 line-through">$29.99</span>
                  <span className="text-xs text-green-600">10% OFF</span>
                </div>
                <button className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition">
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Carousel of small images */}
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-${1483985988355 + i * 100}-763728e1935b?w=200`}
                    alt={`Product ${i}`}
                    className="w-full h-full object-cover hover:scale-110 transition"
                  />
                </div>
              ))}
            </div>

            {/* Repeat for other columns */}
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-${1490481651871 + i * 100}-ab68de25d43d?w=200`}
                    alt={`Product ${i}`}
                    className="w-full h-full object-cover hover:scale-110 transition"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="relative aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400"
                  alt="Product"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Bali Underware Bra</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500">(189)</span>
                </div>
                <div className="flex gap-1 mb-3">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button key={size} className="px-2 py-1 text-xs border border-gray-300 rounded hover:border-teal-600">
                      {size}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold">$27.46</span>
                  <span className="text-sm text-gray-400 line-through">$29.99</span>
                  <span className="text-xs text-green-600">10% OFF</span>
                </div>
                <button className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition">
                  Add to Cart
                </button>
              </div>
            </div>
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
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
          Free Shipping
        </h3>
        <p className="text-[15px] leading-[1.45] text-[#4b5563] max-w-[360px]">
          Enjoy the Convenience of Free Shipping on Every Order
        </p>
      </div>

      <div className="rounded-[24px] bg-[#f3e466] px-8 py-6 text-center flex flex-col items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
        <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center mb-5">
          <svg className="w-9 h-9 text-[#2f3137]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18 10a6 6 0 10-12 0v4a2 2 0 002 2h1v-4H8m8 0v4h1a2 2 0 002-2v-4m-5 9h-4" />
          </svg>
        </div>
        <h3 className="text-[18px] leading-none font-extrabold text-[#1f2430] mb-2">
          24x7 Support
        </h3>
        <p className="text-[15px] leading-[1.45] text-[#4b5563] max-w-[360px]">
          Round-the-Clock Assistance, Anytime You Need It
        </p>
      </div>

      <div className="rounded-[24px] bg-[#f3b98f] px-8 py-6 text-center flex flex-col items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
        <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center mb-5">
          <svg className="w-9 h-9 text-[#2f3137]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h10M7 11h10M8 4h8a2 2 0 012 2v9a5 5 0 11-10 0V6a2 2 0 012-2z" />
          </svg>
        </div>
        <h3 className="text-[18px] leading-none font-extrabold text-[#1f2430] mb-2">
          30 Days Return
        </h3>
        <p className="text-[15px] leading-[1.45] text-[#4b5563] max-w-[390px]">
          Your Satisfaction is Our Priority: Return Any Product Within 30 Days
        </p>
      </div>

      <div className="rounded-[24px] bg-[#99dc6c] px-8 py-6 text-center flex flex-col items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
        <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center mb-5">
          <svg className="w-9 h-9 text-[#2f3137]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0zm-9 7a3 3 0 100-6 3 3 0 000 6z" />
          </svg>
        </div>
        <h3 className="text-[18px] leading-none font-extrabold text-[#1f2430] mb-2">
          Secure Payment
        </h3>
        <p className="text-[15px] leading-[1.45] text-[#4b5563] max-w-[380px]">
          Seamless Shopping Backed by Safe and Secure Payment Options
        </p>
      </div>

    </div>
  </div>
</section>
    </div>
  );
};

export default HomePage;
