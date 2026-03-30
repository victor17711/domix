import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated, getAuthHeaders } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart and wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    } else {
      // Load from localStorage for non-authenticated users
      const savedCart = localStorage.getItem('cart');
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    }
  }, [isAuthenticated]);

  // Save to localStorage for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(cart));
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [cart, wishlist, isAuthenticated]);

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await axios.get(`${API}/cart`, getAuthHeaders());
      setCart(response.data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const fetchWishlist = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await axios.get(`${API}/wishlist`, getAuthHeaders());
      setWishlist(response.data.products || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const addToCart = async (product, quantity = 1, selectedSize = null, selectedColor = null) => {
    if (isAuthenticated) {
      try {
        await axios.post(`${API}/cart/add`, {
          productId: product.id,
          quantity,
          selectedSize,
          selectedColor
        }, getAuthHeaders());
        
        await fetchCart();
      } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
      }
    } else {
      // Local storage fallback for non-authenticated users
      setCart(prevCart => {
        const existingItem = prevCart.find(
          item => item.id === product.id && 
                  item.selectedSize === selectedSize && 
                  item.selectedColor === selectedColor
        );

        if (existingItem) {
          return prevCart.map(item =>
            item.id === product.id && 
            item.selectedSize === selectedSize && 
            item.selectedColor === selectedColor
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }

        return [...prevCart, { ...product, quantity, selectedSize, selectedColor }];
      });
    }
  };

  const removeFromCart = async (productId, selectedSize = null, selectedColor = null) => {
    if (isAuthenticated) {
      try {
        await axios.delete(
          `${API}/cart/remove/${productId}?selectedSize=${selectedSize || ''}&selectedColor=${selectedColor || ''}`, 
          getAuthHeaders()
        );
        
        await fetchCart();
      } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
      }
    } else {
      setCart(prevCart => 
        prevCart.filter(item => 
          !(item.id === productId && 
            item.selectedSize === selectedSize && 
            item.selectedColor === selectedColor)
        )
      );
    }
  };

  const updateQuantity = async (productId, quantity, selectedSize = null, selectedColor = null) => {
    if (isAuthenticated) {
      try {
        await axios.put(
          `${API}/cart/update?productId=${productId}&quantity=${quantity}&selectedSize=${selectedSize || ''}&selectedColor=${selectedColor || ''}`,
          {},
          getAuthHeaders()
        );
        
        await fetchCart();
      } catch (error) {
        console.error('Error updating cart:', error);
        throw error;
      }
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await axios.delete(`${API}/cart/clear`, getAuthHeaders());
        await fetchCart();
      } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
      }
    } else {
      setCart([]);
    }
  };

  const addToWishlist = async (product) => {
    if (isAuthenticated) {
      try {
        await axios.post(`${API}/wishlist/add/${product.id}`, {}, getAuthHeaders());
        await fetchWishlist();
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        throw error;
      }
    } else {
      setWishlist(prevWishlist => {
        const exists = prevWishlist.find(item => item === product.id || item.id === product.id);
        if (exists) return prevWishlist;
        return [...prevWishlist, product.id];
      });
    }
  };

  const removeFromWishlist = async (productId) => {
    if (isAuthenticated) {
      try {
        await axios.delete(`${API}/wishlist/remove/${productId}`, getAuthHeaders());
        await fetchWishlist();
      } catch (error) {
        console.error('Error removing from wishlist:', error);
        throw error;
      }
    } else {
      setWishlist(prevWishlist => prevWishlist.filter(item => item !== productId && item.id !== productId));
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item === productId || item.id === productId);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getCartTotal,
        cartTotal,
        cartCount,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
