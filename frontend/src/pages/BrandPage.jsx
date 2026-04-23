import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BrandPage = () => {
  const { t, language } = useLanguage();
  const { slug } = useParams();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrandAndProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch all brands to find the one with this slug
        const brandsRes = await axios.get(`${API}/brands`);
        const foundBrand = brandsRes.data.find(b => 
          b.name.toLowerCase().replace(/\s+/g, '-') === slug
        );
        
        if (!foundBrand) {
          setError('Brand-ul nu a fost găsit');
          setLoading(false);
          return;
        }
        
        setBrand(foundBrand);
        
        // Fetch products for this brand
        const productsRes = await axios.get(`${API}/products`);
        const brandProducts = productsRes.data.filter(
          p => p.brandId === foundBrand.id
        );
        
        setProducts(brandProducts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching brand data:', err);
        setError('Eroare la încărcarea datelor');
        setLoading(false);
      }
    };

    fetchBrandAndProducts();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error || !brand) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">{error || 'Brand-ul nu a fost găsit'}</p>
          <Link
            to="/brands"
            className="bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition font-semibold inline-block"
          >
            Înapoi la Branduri
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
            <Link to="/" className="hover:text-teal-600">Acasă</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/brands" className="hover:text-teal-600">Branduri</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-semibold">{brand.name}</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="w-full px-6 py-12">
          <div className="flex items-center gap-6">
            {brand.logo && (
              <div className="w-24 h-24 bg-white rounded-2xl p-4 flex items-center justify-center">
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="w-full h-full object-contain" 
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{brand.name}</h1>
              <p className="text-teal-100">{products.length} {products.length === 1 ? 'produs' : 'produse'} disponibil{products.length === 1 ? '' : 'e'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="w-full px-6 py-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">Nu există produse disponibile pentru acest brand</p>
            <Link
              to="/brands"
              className="inline-block bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition font-semibold"
            >
              Înapoi la Branduri
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandPage;
