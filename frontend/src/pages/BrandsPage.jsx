import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Tag, ChevronRight, Store } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${API}/brands`);
      setBrands(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-16">
        <div className="w-full px-6">
          <div className="flex items-center gap-3 mb-4">
            <Store className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Branduri</h1>
          </div>
          <p className="text-xl text-teal-100">
            Descoperă toate brandurile noastre de încredere
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="w-full px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-teal-600">Acasă</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-semibold">Branduri</span>
          </div>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="w-full px-6 py-12">
        {brands.length === 0 ? (
          <div className="text-center py-20">
            <Store className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Niciun brand disponibil</h2>
            <p className="text-gray-600">Brandurile vor apărea aici când vor fi adăugate în admin panel.</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Toate Brandurile
              </h2>
              <p className="text-gray-600">
                {brands.length} {brands.length === 1 ? 'brand disponibil' : 'branduri disponibile'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/category/${encodeURIComponent('All')}?brand=${brand.id}`}
                  className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-teal-500"
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Brand Icon */}
                    <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-teal-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border-4 border-teal-200">
                      <Tag className="w-12 h-12 text-teal-600" />
                    </div>

                    {/* Brand Name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition">
                      {brand.name}
                    </h3>

                    {/* Brand Description */}
                    {brand.description && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                        {brand.description}
                      </p>
                    )}

                    {/* CTA Button */}
                    <div className="mt-auto pt-4">
                      <div className="inline-flex items-center gap-2 text-teal-600 font-semibold text-sm group-hover:gap-3 transition-all">
                        Vezi Produse
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Stats Section */}
      {brands.length > 0 && (
        <div className="bg-white border-t py-12">
          <div className="w-full px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-teal-600 mb-2">
                  {brands.length}+
                </div>
                <div className="text-gray-600 font-semibold">Branduri Premium</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-teal-600 mb-2">100%</div>
                <div className="text-gray-600 font-semibold">Produse Autentice</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-teal-600 mb-2">24/7</div>
                <div className="text-gray-600 font-semibold">Suport Clienți</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandsPage;
