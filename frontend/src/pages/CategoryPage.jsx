import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CategoryPage = () => {
  const { language } = useLanguage();
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Filter states
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: 10000 });

  useEffect(() => {
    fetchCategoryAndProducts();
    fetchBrands();
  }, [slug]);

  useEffect(() => {
    if (category) {
      applyFilters();
    }
  }, [priceRange, selectedBrands, category]);

  const fetchCategoryAndProducts = async () => {
    try {
      const categoriesRes = await axios.get(`${API}/categories`);
      const foundCategory = categoriesRes.data.find(cat => cat.slug === slug);
      
      if (!foundCategory) {
        setError('Categoria nu a fost găsită');
        setLoading(false);
        return;
      }

      setCategory(foundCategory);
      setError(null);
    } catch (error) {
      console.error('Error fetching category:', error);
      setError('Categoria nu a fost găsită');
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${API}/brands`);
      setBrands(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const applyFilters = async () => {
    if (!category) return;
    
    try {
      let url = `${API}/products?category=${encodeURIComponent(category.name)}&minPrice=${priceRange.min}&maxPrice=${priceRange.max}`;

      // For multiple brands, we'll fetch all and filter client-side
      const response = await axios.get(url);
      let filteredProducts = response.data;

      // Client-side brand filtering if brands are selected
      if (selectedBrands.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          selectedBrands.includes(product.brandId)
        );
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching filtered products:', error);
    }
  };

  const handleBrandToggle = (brandId) => {
    setSelectedBrands(prev => 
      prev.includes(brandId) 
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    );
  };

  const handlePriceRangeApply = () => {
    setPriceRange(tempPriceRange);
  };

  const resetFilters = () => {
    setPriceRange({ min: 0, max: 10000 });
    setTempPriceRange({ min: 0, max: 10000 });
    setSelectedBrands([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('categoryPage.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">{error || t('categoryPage.notFound')}</p>
          <Link
            to="/"
            className="bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition font-semibold inline-block"
          >
            {t('categoryPage.backHome')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="w-full px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-teal-600">{t('categoryPage.breadcrumb.home')}</Link>
            <ChevronRight className="w-4 h-4" />
            <div className="flex items-center gap-2">
              {category.image && (
                <img src={category.image} alt={category.name} className="w-6 h-6 rounded object-cover" />
              )}
              <span className="text-gray-900 font-semibold">{category.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="w-full px-6 py-8">
          <div className="flex items-center gap-4">
            {category.image && (
  <div className="w-16 h-16 flex-shrink-0 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center overflow-hidden">
    <img 
      src={category.image} 
      alt={category.name} 
      className="w-full h-full object-contain" 
    />
  </div>
)}
            <div>
              <h1 className="text-3xl md:text-5xl font-bold">{category.name}</h1>
              <p className="text-teal-100 mt-2">{products.length} {t('categoryPage.productsAvailable')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filter - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-teal-600" />
                  {t('categoryPage.filters')}
                </h3>
                <button 
                  onClick={resetFilters}
                  className="text-sm text-teal-600 hover:text-teal-700 font-semibold"
                >
                  {t('categoryPage.reset')}
                </button>
              </div>

              {/* Price Filter */}
              <div className="mb-6 pb-6 border-b">
                <h4 className="font-bold text-gray-900 mb-4">{t('categoryPage.price')}</h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder={t('categoryPage.min')}
                      value={tempPriceRange.min}
                      onChange={(e) => setTempPriceRange({ ...tempPriceRange, min: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="number"
                      placeholder={t('categoryPage.max')}
                      value={tempPriceRange.max}
                      onChange={(e) => setTempPriceRange({ ...tempPriceRange, max: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <button
                    onClick={handlePriceRangeApply}
                    className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition font-semibold"
                  >
                    {t('categoryPage.apply')}
                  </button>
                </div>
              </div>

              {/* Brand Filter */}
              {brands.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">{t('categoryPage.brand')}</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {brands.map((brand) => (
                      <label key={brand.id} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand.id)}
                          onChange={() => handleBrandToggle(brand.id)}
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <div className="flex items-center gap-2 flex-1">
                          {brand.logo && (
                            <img src={brand.logo} alt={brand.name} className="w-6 h-6 object-contain" />
                          )}
                          <span className="text-gray-700 group-hover:text-teal-600 transition">{brand.name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setFilterOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 bg-teal-600 text-white p-4 rounded-full shadow-lg hover:bg-teal-700 transition z-40"
          >
            <SlidersHorizontal className="w-6 h-6" />
          </button>

          {/* Mobile Filter Drawer */}
          {filterOpen && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
              <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">{t('categoryPage.filters')}</h3>
                    <button onClick={() => setFilterOpen(false)}>
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Same filters as desktop */}
                  <div className="mb-6 pb-6 border-b">
                    <h4 className="font-bold text-gray-900 mb-4">Preț (MDL)</h4>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={tempPriceRange.min}
                          onChange={(e) => setTempPriceRange({ ...tempPriceRange, min: Number(e.target.value) })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={tempPriceRange.max}
                          onChange={(e) => setTempPriceRange({ ...tempPriceRange, max: Number(e.target.value) })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <button
                        onClick={() => {
                          handlePriceRangeApply();
                          setFilterOpen(false);
                        }}
                        className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition font-semibold"
                      >
                        Aplică
                      </button>
                    </div>
                  </div>

                  {brands.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-900 mb-4">Brand</h4>
                      <div className="space-y-2">
                        {brands.map((brand) => (
                          <label key={brand.id} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(brand.id)}
                              onChange={() => handleBrandToggle(brand.id)}
                              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                            />
                            <div className="flex items-center gap-2">
                              {brand.logo && (
                                <img src={brand.logo} alt={brand.name} className="w-6 h-6 object-contain" />
                              )}
                              <span className="text-gray-700">{brand.name}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={resetFilters}
                    className="w-full mt-6 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
                  >
                    {t('categoryPage.resetFilters')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <p className="text-xl text-gray-600">{t('categoryPage.empty')}</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 text-teal-600 hover:text-teal-700 font-semibold"
                >
                  {t('categoryPage.resetFilters')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
