import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { analytics } from './services/analytics'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CartDrawer from './components/cart/CartDrawer'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import Home from './pages/Home'
import Shop from './pages/Shop'
import About from './pages/About'
import Contact from './pages/Contact'
import Partner from './pages/Partner'
import FAQ from './pages/FAQ'
import Offers from './pages/Offers'
import ProductCheckout from './pages/ProductCheckout'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Dashboard from './pages/admin/Dashboard'
import AdminAuth from './components/admin/AdminAuth'

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isInitialized = useRef(false);

  // Initialize analytics session on app load
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      analytics.initSession();
    }
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (!isAdminRoute) {
      analytics.pageView(location.pathname);
    }
  }, [location.pathname, isAdminRoute]);

  // Admin routes render without main layout, protected by AdminAuth
  if (isAdminRoute) {
    return (
      <AdminAuth>
        <Routes>
          <Route path="/admin" element={<Dashboard />} />
        </Routes>
      </AdminAuth>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CartDrawer />
      <FloatingWhatsApp />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/product/:id" element={<ProductCheckout />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/partner" element={<Partner />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </div>

      <Footer />
    </div>
  )
}

export default App
