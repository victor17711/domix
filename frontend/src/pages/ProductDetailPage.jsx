import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight, Minus, Plus, ShoppingCart, Heart, Star, Truck, RefreshCw, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from '../hooks/use-toast';
import ProductCard from '../components/ProductCard';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart, addToWishlist } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
      
      // Fetch related products from same category
      const relatedRes = await axios.get(`${API}/products?category=${encodeURIComponent(response.data.category)}`);
      setRelatedProducts(relatedRes.data.filter(p => p.id !== id).slice(0, 8));
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({ title: 'Atenție', description: 'Selectează o mărime', variant: 'destructive' });
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast({ title: 'Atenție', description: 'Selectează o culoare', variant: 'destructive' });
      return;
    }

    addToCart({
      ...product,
      quantity,
      selectedSize,
      selectedColor
    });
    toast({ title: 'Succes', description: `${product.name} adăugat în coș!` });
  };

  const handleAddToWishlist = () => {
    addToWishlist(product);
    toast({ title: 'Succes', description: 'Produs adăugat la favorite!' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Produs negăsit</h2>
          <Link to="/" className="text-teal-600 hover:text-teal-700">Înapoi la Acasă</Link>
        </div>
      </div>
    );
  }

  const images = [product.image]; // În viitor, produsele pot avea multiple imagini

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="w-full px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-teal-600">Acasă</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/category/${product.category}`} className="hover:text-teal-600">{product.category}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-semibold">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Images */}
          <div>
            <div className="bg-white rounded-2xl overflow-hidden mb-4 border-2 border-gray-100">
              <img 
                src={images[selectedImage]} 
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`bg-white rounded-xl overflow-hidden border-2 transition ${
                      selectedImage === idx ? 'border-teal-600' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-24 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.badge && (
              <span className="inline-block bg-red-500 text-white text-sm px-3 py-1 rounded-full mb-3">
                {product.badge}
              </span>
            )}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating || 0)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">({product.reviews || 0} recenzii)</span>
              {product.sold && (
                <span className="text-teal-600 font-semibold">{product.sold} vândute</span>
              )}
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-teal-600">{product.price * quantity} MDL</span>
                {product.originalPrice && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">{product.originalPrice * quantity} MDL</span>
                    <span className="text-xl font-semibold text-green-600">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-3">Culoare</label>
                <div className="flex gap-3">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition ${
                        selectedColor === color ? 'border-teal-600 scale-110' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-3">Mărime</label>
                <div className="flex gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-2 rounded-lg border-2 font-semibold transition ${
                        selectedSize === size
                          ? 'border-teal-600 bg-teal-50 text-teal-600'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-3">Cantitate</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 py-2 font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-gray-600">
                  {product.available ? `${product.available} disponibile` : 'În stoc'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-teal-600 text-white py-4 rounded-xl hover:bg-teal-700 transition font-bold text-lg flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-6 h-6" />
                Adaugă în Coș
              </button>
              <button
                onClick={handleAddToWishlist}
                className="px-6 py-4 border-2 border-teal-600 text-teal-600 rounded-xl hover:bg-teal-50 transition"
              >
                <Heart className="w-6 h-6" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Livrare Gratuită</div>
                  <div className="text-sm text-gray-600">Pentru comenzi peste 500 MDL</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Retur 30 zile</div>
                  <div className="text-sm text-gray-600">Garanție returnare</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Plată Securizată</div>
                  <div className="text-sm text-gray-600">100% protejat</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl p-8 mb-12">
          <div className="flex gap-8 border-b mb-6">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 font-semibold transition border-b-2 ${
                  activeTab === tab
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'description' && 'Descriere'}
                {tab === 'specifications' && 'Specificații'}
                {tab === 'reviews' && 'Recenzii'}
              </button>
            ))}
          </div>

          <div className="prose max-w-none">
            {activeTab === 'description' && (
              <div>
                <p className="text-gray-700 leading-relaxed">{product.description || 'Descriere disponibilă în curând.'}</p>
              </div>
            )}
            {activeTab === 'specifications' && (
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Categorie:</strong> {product.category}</div>
                <div><strong>Brand:</strong> {product.storeName || 'N/A'}</div>
                {product.colors && <div><strong>Culori disponibile:</strong> {product.colors.length}</div>}
                {product.sizes && <div><strong>Mărimi disponibile:</strong> {product.sizes.join(', ')}</div>}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="text-center py-8 text-gray-600">
                Nicio recenzie încă. Fii primul care evaluează acest produs!
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Produse Similare</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
