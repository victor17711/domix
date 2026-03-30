import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import axios from 'axios';
import { Plus, Edit, Trash2, Search, Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from '../../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductsManagement = () => {
  const { getAuthHeaders } = useAdmin();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    storeName: '',
    image: '',
    available: 100,
    badge: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      toast({ title: 'Eroare', description: 'Nu s-au putut încărca produsele', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice || formData.price),
        discount: formData.originalPrice ? Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100) : 0,
        colors: ["#9b59b6", "#3498db", "#e74c3c", "#f1c40f"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        rating: 4.5,
        reviews: 100,
        sold: 0,
        inStock: true
      };

      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct.id}`, productData, getAuthHeaders());
        toast({ title: 'Succes', description: 'Produsul a fost actualizat!' });
      } else {
        await axios.post(`${API}/products`, productData, getAuthHeaders());
        toast({ title: 'Succes', description: 'Produsul a fost creat!' });
      }
      
      setShowModal(false);
      setEditingProduct(null);
      setImagePreview(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast({ title: 'Eroare', description: error.response?.data?.detail || 'Nu s-a putut salva produsul', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Sigur doriți să ștergeți acest produs?')) return;
    
    try {
      await axios.delete(`${API}/products/${id}`, getAuthHeaders());
      toast({ title: 'Succes', description: 'Produsul a fost șters!' });
      fetchProducts();
    } catch (error) {
      toast({ title: 'Eroare', description: 'Nu s-a putut șterge produsul', variant: 'destructive' });
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      storeName: product.storeName || '',
      image: product.image,
      available: product.available,
      badge: product.badge || ''
    });
    setImagePreview(product.image);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: '',
      storeName: '',
      image: '',
      available: 100,
      badge: ''
    });
    setImagePreview(null);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Gestionare Produse</h2>
            <p className="text-teal-100">Administrează inventarul magazinului</p>
          </div>
          <button
            onClick={() => { setShowModal(true); setEditingProduct(null); resetForm(); }}
            className="bg-white text-teal-700 px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-teal-50 transition shadow-md font-semibold"
          >
            <Plus className="w-5 h-5" />
            Adaugă Produs
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Caută produse după nume sau categorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="relative h-48 overflow-hidden bg-gray-100">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300" 
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-md"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-2xl font-bold text-teal-600">{product.price} MDL</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through ml-2">{product.originalPrice} MDL</span>
                  )}
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                product.available > 50 ? 'bg-green-100 text-green-800' :
                product.available > 10 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                Stoc: {product.available}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <h3 className="text-2xl font-bold">{editingProduct ? 'Editează Produs' : 'Adaugă Produs Nou'}</h3>
              <button onClick={() => { setShowModal(false); setEditingProduct(null); resetForm(); }} className="text-white hover:text-gray-200">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Imagine Produs *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-teal-500 transition">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                      <button
                        type="button"
                        onClick={() => { setImagePreview(null); setFormData({...formData, image: ''}); }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <label className="cursor-pointer">
                        <span className="bg-teal-600 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 hover:bg-teal-700 transition font-semibold">
                          <Upload className="w-5 h-5" />
                          Încarcă Imagine
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-sm text-gray-500 mt-2">PNG, JPG până la 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nume Produs *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Categorie *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Selectează Categoria</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Descriere</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Preț (MDL) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Preț Original (MDL)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Stoc *</label>
                  <input
                    type="number"
                    required
                    value={formData.available}
                    onChange={(e) => setFormData({...formData, available: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Magazin</label>
                  <input
                    type="text"
                    value={formData.storeName}
                    onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Badge</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({...formData, badge: e.target.value})}
                    placeholder="ex: SALES, 15% OFF"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 rounded-xl hover:from-teal-700 hover:to-teal-800 transition font-semibold shadow-md"
                >
                  {editingProduct ? 'Actualizează Produs' : 'Creează Produs'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingProduct(null); resetForm(); }}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-400 transition font-semibold"
                >
                  Anulează
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
