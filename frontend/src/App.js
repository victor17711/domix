import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import Preloader from './components/Preloader';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import DynamicPage from './pages/DynamicPage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ServicesPage from './pages/ServicesPage';
import AboutUsPage from './pages/AboutUsPage';
import CatalogPage from './pages/CatalogPage';
import MyAccountPage from './pages/MyAccountPage';
import CatalogCategoryPage from './pages/CatalogCategoryPage';
import FAQPage from './pages/FAQPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import SearchResultsPage from './pages/SearchResultsPage';
import ContactPage from './pages/ContactPage';
import BrandsPage from './pages/BrandsPage';
import AdminLogin from './pages/admin/AdminLogin';
import ContentManagement from './pages/admin/ContentManagement';
import Dashboard from './pages/admin/Dashboard';
import ProductsManagement from './pages/admin/ProductsManagement';
import CategoriesManagement from './pages/admin/CategoriesManagement';
import BrandsManagement from './pages/admin/BrandsManagement';
import UsersManagement from './pages/admin/UsersManagement';
import OrdersManagement from './pages/admin/OrdersManagement';
import RequestsManagement from './pages/admin/RequestsManagement';
import Settings from './pages/admin/Settings';
import Pages from './pages/admin/Pages';
import { Toaster } from './components/ui/toaster';
import './App.css';

// Wrapper component to handle route changes and preloader
const RouteChangeHandler = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds preloader

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (loading) {
    return <Preloader />;
  }

  return children;
};

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
              <ScrollToTop />
              <RouteChangeHandler>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={
                    <>
                      <Navbar />
                      <HomePage />
                      <Footer />
                    </>
                  } />

                {/* Contact Page Route - MUST be before /page/:slug */}
                <Route path="/contact" element={
                  <>
                    <Navbar />
                    <ContactPage />
                    <Footer />
                  </>
                } />

                {/* Brands Page Route */}
                <Route path="/brands" element={
                  <>
                    <Navbar />
                    <BrandsPage />
                    <Footer />
                  </>
                } />

                {/* Search Results Route */}
                <Route path="/search" element={
                  <>
                    <Navbar />
                    <SearchResultsPage />
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

                {/* Services Page Route */}
                <Route path="/servicii" element={
                  <>
                    <Navbar />
                    <ServicesPage />
                    <Footer />
                  </>
                } />

                {/* About Us Page Route */}
                <Route path="/despre-noi" element={
                  <>
                    <Navbar />
                    <AboutUsPage />
                    <Footer />
                  </>
                } />

                {/* Catalog Page Route */}
                <Route path="/catalog" element={
                  <>
                    <Navbar />
                    <CatalogPage />
                    <Footer />
                  </>
                } />

                {/* Catalog Page Detail Route */}
                <Route path="/catalog/:categoryId" element={
                  <>
                    <Navbar />
                    <CatalogCategoryPage />
                    <Footer />
                  </>
                } />

                {/* FAQ Page Route */}
                <Route path="/intrebari-frecvente" element={
                  <>
                    <Navbar />
                    <FAQPage />
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

                {/* My Account Page Route */}
                <Route path="/contul-meu" element={
                  <>
                    <Navbar />
                    <MyAccountPage />
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

                <Route path="/admin/requests" element={
                  <AdminProtectedRoute>
                    <RequestsManagement />
                  </AdminProtectedRoute>
                } />

                <Route path="/admin/content" element={
                  <AdminProtectedRoute>
                    <ContentManagement />
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
              </RouteChangeHandler>
              
              <Toaster />
            </div>
          </CartProvider>
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
