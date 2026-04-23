import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useLanguage } from '../context/LanguageContext';

const FreshFindsSection = ({ products = [] }) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('fresh');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // limit produse: 8 mobile / 10 desktop
  const visibleProducts = isMobile
    ? products.slice(11, 19) // 8 produse
    : products.slice(11, 21); // 10 produse

  return (
    <section className="py-4">
      <div className="w-full px-6">

        {/* Header */}
        <div className="mb-8 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 text-center md:text-left">
              {language === 'ru' ? 'Новые товары' : 'Produse noi'}
            </h2>

            {/* Tabs */}
            <div className="flex md:justify-end gap-4 overflow-x-auto md:overflow-visible no-scrollbar">
              <button
                onClick={() => setActiveTab('fresh')}
                className={`flex-shrink-0 px-6 py-3 font-semibold border-b-2 whitespace-nowrap ${activeTab === 'fresh'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                Fresh Finds
              </button>

              <button
                onClick={() => setActiveTab('top')}
                className={`flex-shrink-0 px-6 py-3 font-semibold border-b-2 whitespace-nowrap ${activeTab === 'top'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                Top Sellers
              </button>

              <button
                onClick={() => setActiveTab('wanted')}
                className={`flex-shrink-0 px-6 py-3 font-semibold border-b-2 whitespace-nowrap ${activeTab === 'wanted'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                Most Wanted
              </button>
            </div>

          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default FreshFindsSection;