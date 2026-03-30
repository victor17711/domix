import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from '../hooks/use-toast';
import { Package, MapPin, CreditCard, Check } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        userId: user?.id || 'guest',
        customerEmail: formData.email,
        customerName: formData.fullName,
        customerPhone: formData.phone,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          selectedSize: item.selectedSize || '',
          selectedColor: item.selectedColor || ''
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          notes: formData.notes
        },
        totalAmount: getCartTotal(),
        status: 'pending',
        paymentMethod: 'cash_on_delivery'
      };

      console.log('Sending order:', orderData);
      const response = await axios.post(`${API}/orders`, orderData);
      console.log('Order response:', response.data);
      
      // Clear cart BEFORE navigation
      clearCart();
      
      toast({ 
        title: 'Succes', 
        description: 'Comanda ta a fost plasată cu succes!' 
      });
      
      // Small delay to ensure cart is cleared
      setTimeout(() => {
        navigate('/order-success');
      }, 100);
    } catch (error) {
      console.error('Error placing order:', error.response?.data || error.message);
      toast({ 
        title: 'Eroare', 
        description: error.response?.data?.detail || 'Nu s-a putut plasa comanda. Te rog încearcă din nou.',
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Finalizare Comandă</h1>
          <p className="text-gray-600 mb-8">Completează detaliile pentru livrare</p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Shipping Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Information */}
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-teal-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Informații Contact</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nume Complet *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Ion Popescu"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="+373 69 123 456"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="email@exemplu.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-teal-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Adresă Livrare</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Adresă Completă *
                      </label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Strada, Nr., Bloc, Apartament"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Oraș *
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Chișinău"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Cod Poștal
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="MD-2001"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Notițe Suplimentare (Opțional)
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Instrucțiuni speciale pentru livrare..."
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-teal-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Metodă Plată</h2>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-4 p-4 border-2 border-teal-600 rounded-xl bg-teal-50 cursor-pointer">
                      <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-teal-600" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">Cash la curier</div>
                        <div className="text-sm text-gray-600">Plătește când primești comanda</div>
                      </div>
                      <Check className="w-6 h-6 text-teal-600" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 sticky top-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Sumar Comandă</h2>

                  {/* Products */}
                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-gray-900 truncate">{item.name}</div>
                          <div className="text-xs text-gray-600">
                            {item.selectedSize && `Mărime: ${item.selectedSize}`}
                          </div>
                          <div className="text-sm font-semibold text-teal-600">
                            {item.price} MDL x {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 pt-6 border-t">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold">{getCartTotal()} MDL</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Livrare</span>
                      <span className="font-semibold text-green-600">Gratuită</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t">
                      <span>Total</span>
                      <span className="text-teal-600">{getCartTotal()} MDL</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-600 text-white py-4 rounded-xl hover:bg-teal-700 transition font-bold text-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Se procesează...' : 'Plasează Comanda'}
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Prin plasarea comenzii, accepți <a href="#" className="text-teal-600 hover:underline">Termenii și Condițiile</a> noastre
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
