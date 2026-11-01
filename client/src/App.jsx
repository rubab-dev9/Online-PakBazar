import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import useHideNavbar from './hooks/useHideNavbar';

// common 
import NavigationBar from "./components/common/Navbar";
import Footer from './components/common/Footer';
import About from "./pages/About";
import Contact from './pages/Contact';
import FAQs from './pages/FAQs';
import Profile from './components/common/Profile';

// Auth Pages
import LoginForm from "./auth/components/LoginForm";
import RegisterForm from "./auth/components/RegisterForm";
import VerifyOtp from "./auth/components/verify-otp";
import ForgotPassword from "./auth/components/forgot-password";
import ResetPassword from "./auth/components/reset-password";
import UpdatePassword from './auth/components/update-password';

// Context Providers
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';

// Product Components
import ProductListing from './components/product/ProductListing';
import ProductDetails from './components/product/ProductDetails';
import Cart from './components/cart/Cart';
import AddProductForm from './components/supplier/AddProductForm';
import Wishlist from './components/product/ProductWishlist';

// Order Components
import OrderSuccess from './components/order/OrderSuccess';
import Checkout from './components/order/Checkout';
import MyOrders from './components/order/MyOrders';
import OrderDetails from './components/order/OrderDetails';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import AdminUsers from './components/admin/AdminUsers';
import AdminSuppliers from './components/admin/AdminSuppliers';
import AdminProducts from './components/admin/AdminProducts';
import AdminOrders from './components/admin/AdminOrders';
import AdminMessages from './components/admin/AdminMessages';

// Supplier Components
import SupplierDashboard from './components/supplier/SupplierDashboard';
import SupplierProducts from './components/supplier/SupplierProducts';
import EditProductForm from './components/supplier/EditProductForm';
import SupplierOrders from './components/supplier/SupplierOrders';
import SupplierReviews from './components/supplier/SupplierReviews';

import './App.css';


// Layout Wrapper Component
const LayoutWrapper = ({ children }) => {
  const hideNavbar = useHideNavbar();

  return (
    <>
      {!hideNavbar && <NavigationBar />}
      {children}
      {!hideNavbar && <Footer />}
    </>
  );
};

function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer />

        <CartProvider>
          <ProductProvider>
            <LayoutWrapper>

              <Routes>
                {/* Auth Routes */}

                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/profile" element={<Profile />} />

                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/update-password" element={<UpdatePassword />} />

                {/* Product Routes */}
                <Route path="/" element={<ProductListing />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />

                {/* Other routes */}
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                <Route path="/orders/my-orders" element={<MyOrders />} />
                <Route path="/orders/:id" element={<OrderDetails />} />

                {/* Admin routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/suppliers" element={<AdminSuppliers />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/messages" element={<AdminMessages />} />

                {/* Supplier routes */}
                <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
                <Route path="/supplier/products" element={<SupplierProducts />} />
                <Route path="/supplier/add-product" element={<AddProductForm />} />
                <Route path="/supplier/edit-product/:id" element={<EditProductForm />} />
                <Route path="/supplier/orders" element={<SupplierOrders />} />
                <Route path="/supplier/reviews" element={<SupplierReviews />} />

              </Routes>

            </LayoutWrapper>
          </ProductProvider>
        </CartProvider>
      </BrowserRouter>
    </>
  );
}

export default App;