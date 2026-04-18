import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Search, X, Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (query) {
      searchProducts();
    }
  }, [query]);

  const searchProducts = async () => {
    setLoading(true);
    try {
      // Search in products by name, category
      const response = await axios.get(`${API}/products`);
      const allProducts = response.data;

      // Filter products
      const filtered = allProducts.filter(product => {
        const searchLower = query.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(searchLower);
        const matchesCategory = product.category.toLowerCase().includes(searchLower);
        const matchesId = product.id.toLowerCase().includes(searchLower);
        const matchesDescription = product.description?.toLowerCase().includes(searchLower);

        return matchesName || matchesCategory || matchesId || matchesDescription;
      });

      setProducts(filtered);

      // Extract unique categories from results
      const uniqueCategories = [...new Set(filtered.map(p => p.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="w-full px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-6 h-6 text-teal-600" />
            <h1 className="text-3xl font-bold text-gray-900">Rezultate Căutare</h1>
          </div>
          <p className="text-gray-600">
            {loading ? (
              'Se caută...'
            ) : (
              <>
                Găsite <span className="font-bold text-teal-600">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'rezultat' : 'rezultate'} pentru "{query}"
              </>
            )}
          </p>
        </div>
      </div>

      <div className="w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          {categories.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-gray-900">Filtrează</h3>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      selectedCategory === '' 
                        ? 'bg-teal-50 text-teal-600 font-semibold' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Toate Categoriile ({products.length})
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition ${
                        selectedCategory === category 
                          ? 'bg-teal-50 text-teal-600 font-semibold' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {category} ({products.filter(p => p.category === category).length})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className={categories.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Search className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Niciun rezultat găsit</h2>
                <p className="text-gray-600 mb-6">
                  Nu am găsit produse care să corespundă căutării tale pentru "{query}"
                </p>
                <Link
                  to="/"
                  className="inline-block bg-teal-600 text-white px-8 py-3 rounded-xl hover:bg-teal-700 transition font-semibold"
                >
                  Înapoi la Homepage
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
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

export default SearchResultsPage;
