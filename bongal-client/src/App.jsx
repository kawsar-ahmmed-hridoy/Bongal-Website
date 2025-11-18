import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/common/Layout';
import HomePage from './components/home/HomePage';
import ProductsPage from './components/products/ProductsPage';
import ProductDetail from './components/products/ProductDetail';
import CartPage from './components/cart/CartPage';
import CheckOut from './components/cart/CheckOut';
import OrdersPage from './components/orders/OrdersPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import AdminDashboard from './components/admin/AdminDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import NotFound from './components/common/NotFound';
import VerifyCodePage from './components/auth/VerifyCodePage';
import ProfilePage from './components/auth/ProfilePage';
import ForgotPassword from './components/auth/ForgotPassword';
import ContactPage from './components/common/ContactPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>

        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckOut />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="/verify-code" element={<VerifyCodePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="products" element={<ProductsPage />} />
            <Route
              path="orders"
              element={

                <OrdersPage />

              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/*"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="register" element={<RegisterPage />} />
            <Route path="verify-code" element={<VerifyCodePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="forgot-password" element={<ForgotPassword />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;