import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Grid, List } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchCategoryAndProducts();
  }, [slug]);

  const fetchCategoryAndProducts = async () => {
    try {
      // Fetch all categories to find the one with this slug
      const categoriesRes = await axios.get(`${API}/categories`);
      const foundCategory = categoriesRes.data.find(cat => cat.slug === slug);
      
      if (!foundCategory) {
        setError('Categoria nu a fost găsită');
        setLoading(false);
        return;
      }

      setCategory(foundCategory);

      // Fetch products for this category
      const productsRes = await axios.get(`${API}/products?category=${foundCategory.name}`);
      setProducts(productsRes.data);
      
      setError(null);
    } catch (error) {
      console.error('Error fetching category:', error);
      setError('Categoria nu a fost găsită');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Se încarcă...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">{error || 'Categoria nu a fost găsită'}</p>
          <a
            href="/"
            className="bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition font-semibold inline-block"
          >
            Înapoi la Acasă
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-4">
            {category.icon && (
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-4xl">
                {category.icon}
              </div>
            )}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">{category.name}</h1>
              <p className="text-teal-100 mt-2">{products.length} produse disponibile</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Produse</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-xl text-gray-600">Nu există produse în această categorie</p>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            {products.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className={
                    viewMode === 'list'
                      ? 'w-48 h-48 object-cover'
                      : 'w-full h-64 object-cover'
                  }
                />
                <div className="p-4 flex-1">
                  {product.badge && (
                    <span className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded-full mb-2">
                      {product.badge}
                    </span>
                  )}
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-teal-600">
                        {product.price} MDL
                      </div>
                      {product.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          {product.originalPrice} MDL
                        </div>
                      )}
                    </div>
                    <button className="bg-teal-600 text-white px-4 py-2 rounded-xl hover:bg-teal-700 transition font-semibold">
                      Adaugă
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
