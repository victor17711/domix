import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="pt-36 pb-36 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('cart.emptyTitle')}
          </h2>
          <p className="text-gray-600 mb-8">
            {t('cart.emptyDesc')}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-teal-600 text-white px-8 py-3 rounded-xl hover:bg-teal-700 transition font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('cart.continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {t('cart.title')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                className="bg-white rounded-2xl p-6 border-2 border-gray-100"
              >
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
                    <Link to={`/product/${item.id}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-teal-600 transition">
                        {item.name}
                      </h3>
                    </Link>

                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                      {item.specifications && item.specifications.length > 0 && (
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-4">
                          {item.specifications.slice(0, 3).map((spec, index) => (
                            <div key={index} className="whitespace-nowrap">
                              <span className="font-semibold">{spec.title}:</span> {spec.value}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex items-center border-2 border-gray-300 rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1),
                              item.selectedSize,
                              item.selectedColor
                            )
                          }
                          className="p-2 hover:bg-gray-100 transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="px-4 py-2 font-semibold">{item.quantity}</span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1,
                              item.selectedSize,
                              item.selectedColor
                            )
                          }
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
                    onClick={() =>
                      removeFromCart(item.id, item.selectedSize, item.selectedColor)
                    }
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )
          )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('cart.orderSummary')}
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>
                    {t('cart.subtotal')} ({cart.length} {t('cart.products')})
                  </span>
                  <span className="font-semibold">{getCartTotal()} MDL</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>{t('cart.shipping')}</span>
                  <span className="font-semibold text-green-600">
                    {t('cart.freeShipping')}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>{t('cart.total')}</span>
                    <span className="text-teal-600">{getCartTotal()} MDL</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-teal-600 text-white py-4 rounded-xl hover:bg-teal-700 transition font-bold text-lg mb-4"
              >
                {t('cart.checkout')}
              </button>

              <Link
                to="/"
                className="block text-center text-teal-600 hover:text-teal-700 font-semibold"
              >
                {t('cart.continueShopping')}
              </Link>

              {/* Features */}
              <div className="mt-6 pt-6 border-t space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                  {t('cart.freeShippingNote')}
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                  {t('cart.freeReturnNote')}
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                  {t('cart.securePaymentNote')}
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