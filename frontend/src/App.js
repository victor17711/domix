import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import HomePage from './pages/HomePage';
import DynamicPage from './pages/DynamicPage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ProductsManagement from './pages/admin/ProductsManagement';
import CategoriesManagement from './pages/admin/CategoriesManagement';
import BrandsManagement from './pages/admin/BrandsManagement';
import UsersManagement from './pages/admin/UsersManagement';
import OrdersManagement from './pages/admin/OrdersManagement';
import Settings from './pages/admin/Settings';
import Pages from './pages/admin/Pages';
import { Toaster } from './components/ui/toaster';
import './App.css';

// Protected Route Component for Admin
const AdminProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated, loading } = useAdmin();
  
  // Wait for loading to complete before redirecting
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Se încarcă...</p>
        </div>
      </div>
    );
  }
  
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <AdminLayout>{children}</AdminLayout>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <CartProvider>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={
                  <>
                    <Navbar />
                    <HomePage />
                    <Footer />
                  </>
                } />

                {/* Dynamic Page Route */}
                <Route path="/page/:slug" element={
                  <>
                    <Navbar />
                    <DynamicPage />
                    <Footer />
                  </>
                } />

                {/* Category Page Route */}
                <Route path="/category/:slug" element={
                  <>
                    <Navbar />
                    <CategoryPage />
                    <Footer />
                  </>
                } />

                {/* Product Detail Page Route */}
                <Route path="/product/:id" element={
                  <>
                    <Navbar />
                    <ProductDetailPage />
                    <Footer />
                  </>
                } />

                {/* Cart Page Route */}
                <Route path="/cart" element={
                  <>
                    <Navbar />
                    <CartPage />
                    <Footer />
                  </>
                } />

                {/* Checkout Page Route */}
                <Route path="/checkout" element={
                  <>
                    <Navbar />
                    <CheckoutPage />
                    <Footer />
                  </>
                } />

                {/* Order Success Page Route */}
                <Route path="/order-success" element={
                  <>
                    <Navbar />
                    <OrderSuccessPage />
                    <Footer />
                  </>
                } />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                
                <Route path="/admin/dashboard" element={
                  <AdminProtectedRoute>
                    <Dashboard />
                  </AdminProtectedRoute>
                } />
                
                <Route path="/admin/products" element={
                  <AdminProtectedRoute>
                    <ProductsManagement />
                  </AdminProtectedRoute>
                } />
                
                <Route path="/admin/categories" element={
                  <AdminProtectedRoute>
                    <CategoriesManagement />
                  </AdminProtectedRoute>
                } />
                
                <Route path="/admin/brands" element={
                  <AdminProtectedRoute>
                    <BrandsManagement />
                  </AdminProtectedRoute>
                } />
                
                <Route path="/admin/users" element={
                  <AdminProtectedRoute>
                    <UsersManagement />
                  </AdminProtectedRoute>
                } />
                
                <Route path="/admin/orders" element={
                  <AdminProtectedRoute>
                    <OrdersManagement />
                  </AdminProtectedRoute>
                } />

                <Route path="/admin/settings" element={
                  <AdminProtectedRoute>
                    <Settings />
                  </AdminProtectedRoute>
                } />

                <Route path="/admin/pages" element={
                  <AdminProtectedRoute>
                    <Pages />
                  </AdminProtectedRoute>
                } />

                {/* Redirect /admin to /admin/dashboard */}
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
              
              <Toaster />
            </div>
          </CartProvider>
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
