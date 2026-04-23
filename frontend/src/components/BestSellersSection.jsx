import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useLanguage } from '../context/LanguageContext';

const BestSellersSection = ({ products = [] }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('tevi-fitinguri');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tabs = [
    { id: 'tevi-fitinguri', label: 'Tevi' },
    { id: 'womens', label: "Women's Fashion" },
    { id: 'kids', label: 'Kids Clothing' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'jewelry', label: 'Jewelry & Watches' }
  ];

  const bestSellerProducts = isMobile
    ? products.slice(6, 14)
    : products.slice(6, 16);

  if (!bestSellerProducts.length) {
    return null;
  }

  return (
    <section className="py-6">
      <div className="w-full px-6">
        <div className="mb-8 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <h2 className="text-2xl font-bold text-gray-900 text-center md:text-left">
              {language === 'ru' ? 'Самые продаваемые' : 'Cele mai vândute'}
            </h2>

            <div className="flex md:justify-end gap-4 overflow-x-auto md:overflow-visible no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-5 md:px-6 py-3 font-semibold transition border-b-2 whitespace-nowrap ${activeTab === tab.id
                      ? 'border-teal-600 text-teal-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {bestSellerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default BestSellersSection;