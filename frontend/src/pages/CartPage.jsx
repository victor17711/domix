import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Coșul tău este gol</h2>
          <p className="text-gray-600 mb-8">Adaugă produse pentru a continua cumpărăturile</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-teal-600 text-white px-8 py-3 rounded-xl hover:bg-teal-700 transition font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Continuă Cumpărăturile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Coșul Meu</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                      {item.selectedSize && <div>Mărime: <span className="font-semibold">{item.selectedSize}</span></div>}
                      {item.selectedColor && (
                        <div className="flex items-center gap-2">
                          Culoare: 
                          <div 
                            className="w-5 h-5 rounded-full border-2 border-gray-300"
                            style={{ backgroundColor: item.selectedColor }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex items-center border-2 border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.selectedSize, item.selectedColor)}
                          className="p-2 hover:bg-gray-100 transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                          className="p-2 hover:bg-gray-100 transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-teal-600">
                          {item.price * item.quantity} MDL
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.price} MDL x {item.quantity}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sumar Comandă</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.length} produse)</span>
                  <span className="font-semibold">{getCartTotal()} MDL</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livrare</span>
                  <span className="font-semibold text-green-600">Gratuită</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-teal-600">{getCartTotal()} MDL</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-teal-600 text-white py-4 rounded-xl hover:bg-teal-700 transition font-bold text-lg mb-4"
              >
                Finalizează Comanda
              </button>

              <Link
                to="/"
                className="block text-center text-teal-600 hover:text-teal-700 font-semibold"
              >
                Continuă Cumpărăturile
              </Link>

              {/* Features */}
              <div className="mt-6 pt-6 border-t space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                  Livrare gratuită pentru comenzi peste 500 MDL
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                  Retur gratuit în 30 de zile
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                  Plată securizată 100%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
