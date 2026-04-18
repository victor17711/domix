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
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({
    userName: '',
    userEmail: '',
    rating: 5,
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
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

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);

    try {
      await axios.post(`${API}/products/${id}/reviews`, {
        ...reviewForm,
        productId: id
      });
      
      toast({ title: 'Succes', description: 'Recenzia ta a fost adăugată!' });
      setReviewForm({ userName: '', userEmail: '', rating: 5, comment: '' });
      fetchReviews();
      fetchProduct(); // Refresh product to update rating
    } catch (error) {
      toast({ 
        title: 'Eroare', 
        description: error.response?.data?.detail || 'Nu s-a putut adăuga recenzia',
        variant: 'destructive' 
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity
    });
    toast({ title: 'Succes', description: `${product.name} adăugat în coș!` });
  };

  const handleBuyNow = () => {
    addToCart({
      ...product,
      quantity
    });
    window.location.href = '/checkout';
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

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

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
                className="w-full h-[300px] md:h-[600px] object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`bg-white rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === idx ? 'border-teal-600' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-[60px] md:h-[100px] object-cover" />
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
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
                <span className="text-2xl md:text-4xl font-bold text-teal-600">{product.price * quantity} MDL</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl md:text-2xl text-gray-400 line-through">{product.originalPrice * quantity} MDL</span>
                    <span className="text-l md:text-xl font-semibold text-green-600">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-3">Cantitate</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition"
                  >
                    <Minus className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <span className="px-2 md:px-6 py-2 font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition"
                  >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
                <span className="text-gray-600">
                  {product.available ? `${product.available} disponibile` : 'În stoc'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 mb-8">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="bg-white border-2 border-teal-600 text-teal-600 py-4 rounded-xl hover:bg-teal-50 transition font-bold text-l md:text-lg flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4 md:w-6 md:h-6" />
                  Adaugă în Coș
                </button>
                <button
                  onClick={handleBuyNow}
                  className="bg-teal-600 text-white py-4 rounded-xl hover:bg-teal-700 transition font-bold text-l md:text-lg"
                >
                  Cumpără Acum
                </button>
              </div>
              <button
                onClick={handleAddToWishlist}
                className="bg-white w-full py-2 md:py-4 border-2 border-teal-600 text-teal-600 rounded-xl hover:bg-teal-50 transition font-bold md:text-lg text-sm flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 md:w-6 md:h-6" />
                Adaugă la Favorite
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
              <div>
                {product.specifications && product.specifications.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="border-b pb-2">
                        <strong className="text-gray-900">{spec.title}:</strong>
                        <span className="ml-2 text-gray-700">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Nicio specificație disponibilă</p>
                )}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Review Form */}
                <div className="bg-gray-50 rounded-xl p-6 h-fit">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Scrie o Recenzie</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Numele tău *</label>
                        <input
                          type="text"
                          required
                          value={reviewForm.userName}
                          onChange={(e) => setReviewForm({...reviewForm, userName: e.target.value})}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Ion Popescu"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                        <input
                          type="email"
                          required
                          value={reviewForm.userEmail}
                          onChange={(e) => setReviewForm({...reviewForm, userEmail: e.target.value})}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="email@exemplu.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Rating *</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({...reviewForm, rating: star})}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                star <= reviewForm.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Comentariu *</label>
                      <textarea
                        required
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                        rows="4"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Spune-ne părerea ta despre produs..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingReview ? 'Se trimite...' : 'Trimite Recenzia'}
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Recenzii Clienți</h3>
                  {reviews.length > 0 ? (
                    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-6">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? 'text-yellow-400 fill-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {new Date(review.createdAt).toLocaleDateString('ro-RO')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-600 bg-gray-50 rounded-lg">
                      Nicio recenzie încă. Fii primul care evaluează acest produs!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Produse Similare</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
