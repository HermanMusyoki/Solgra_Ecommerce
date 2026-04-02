import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider }  from "./context/AuthProvider";
import { CartProvider }  from "./context/CartProvider";
import { ProtectedRoute, AdminRoute, GuestRoute } from "./components/RouteGuards";

import Navbar     from "./components/Navbar";
import Footer     from "./components/Footer";
import CartDrawer from "./components/CartDrawer";

import HomePage          from "./pages/HomePage";
import ProductListPage   from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage          from "./pages/CartPage";
import CheckoutPage      from "./pages/Checkout";
import ProfilePage       from "./pages/ProfilePage";
import LoginPage         from "./pages/auth/Login";
import RegisterPage      from "./pages/auth/Register";
import AdminDashboard    from "./pages/admin/Dashboard";

import {
  WishlistPage,
  OrderDetailPage,
  NotFoundPage,
} from "./pages/MiscPages";

// Pages that use their own full-page layout (no Navbar/Footer)
const FULL_PAGE_ROUTES = ["/login", "/register", "/forgot-password"];

function AppLayout() {
  const { pathname } = useLocation();
  const isFullPage   = FULL_PAGE_ROUTES.some(r => pathname.startsWith(r));

  return (
    <div className="flex flex-col min-h-screen">
      {!isFullPage && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* ── PUBLIC ── */}
          <Route path="/"               element={<HomePage />} />
          <Route path="/products"       element={<ProductListPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/cart"           element={<CartPage />} />

          {/* ── AUTH (guests only) ── */}
          <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

          {/* ── PROTECTED (login required) ── */}
          <Route path="/checkout"      element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/profile"       element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/orders"        element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/orders/:id"    element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
          <Route path="/wishlist"      element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />

          {/* ── ADMIN (staff only) ── */}
          <Route path="/admin/dashboard"       element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products"        element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/orders"          element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products/new"    element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products/:id/edit" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/orders/:id"      element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* ── 404 ── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!isFullPage && <Footer />}

      {/* Global cart drawer — rendered outside main so it overlays everything */}
      {!isFullPage && <CartDrawer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* CartProvider is inside AuthProvider so it can use useAuth */}
        <CartProvider>
          <AppLayout />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
