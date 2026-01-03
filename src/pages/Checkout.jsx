import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { productTranslations } from '../data/translations';
import { analytics } from '../services/analytics';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export default function Checkout() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, formatPrice } = useCart();
  const { t, language, isRTL } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasTrackedCheckout = useRef(false);

  // Track begin_checkout event when page loads with items
  useEffect(() => {
    if (cartItems.length > 0 && !hasTrackedCheckout.current) {
      hasTrackedCheckout.current = true;
      analytics.beginCheckout(cartItems, cartTotal);
    }
  }, [cartItems, cartTotal]);

  // If cart is empty, show empty state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-3xl font-playfair font-bold text-heading mb-4">
            {t('checkout.emptyCartTitle')}
          </h1>
          <p className="text-heading-light mb-8">
            {t('checkout.emptyCartMessage')}
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-4 bg-primary text-white rounded-full hover:bg-primary-hover transition-all duration-300 hover:shadow-xl font-semibold"
          >
            {t('checkout.browseProducts')}
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('checkout.fullNameRequired');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('checkout.phoneRequired');
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone.trim())) {
      newErrors.phone = t('checkout.phoneInvalid');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('checkout.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = t('checkout.emailInvalid');
    }

    if (!formData.address.trim()) {
      newErrors.address = t('checkout.addressRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Get analytics IDs for tracking
    const { visitorId, sessionId } = analytics.getIds();

    // Prepare order items for API
    const apiItems = cartItems.map(item => ({
      productId: item.id,
      productName: productTranslations['en']?.[item.id]?.name || item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      totalPrice: item.price * item.quantity
    }));

    let orderNumber;

    try {
      // Create order in database for analytics tracking
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          visitorId,
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress: { address: formData.address },
          items: apiItems,
          subtotal: cartTotal,
          shippingCost: 0,
          tax: 0,
          discount: 0,
          total: cartTotal,
          currency: 'USD'
        })
      });

      if (response.ok) {
        const data = await response.json();
        orderNumber = data.data.orderNumber;

        // Track purchase in GA4
        analytics.purchase({
          orderId: orderNumber,
          total: cartTotal,
          items: cartItems.map(item => ({
            id: item.id,
            name: productTranslations['en']?.[item.id]?.name || item.name,
            price: item.price,
            quantity: item.quantity
          }))
        });
      } else {
        // Fallback to random order number if API fails
        orderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      }
    } catch (error) {
      console.warn('Failed to create order in database:', error);
      orderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    }

    // Prepare order data for Google Apps Script
    const orderData = {
      orderNumber: orderNumber,
      items: cartItems.map(item => ({
        id: item.id,
        name: productTranslations['en']?.[item.id]?.name || item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: cartTotal,
      customer: formData,
      source: 'shop.reachfood.co'
    };

    try {
      // Send order to Google Apps Script
      const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

      if (GOOGLE_SCRIPT_URL) {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData)
        });
      }

      // Navigate to order confirmation
      navigate('/order-confirmation', {
        state: {
          orderData: {
            items: cartItems,
            total: cartTotal,
            customer: formData,
            orderNumber: orderNumber
          }
        }
      });
    } catch (error) {
      console.error('Order submission error:', error);
      // Still navigate to confirmation even if email fails
      navigate('/order-confirmation', {
        state: {
          orderData: {
            items: cartItems,
            total: cartTotal,
            customer: formData,
            orderNumber: orderNumber
          }
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deliveryFee = 0; // Free delivery
  const finalTotal = cartTotal + deliveryFee;

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-8 ${isRTL ? 'text-right' : ''}`}>
          <h1 className="text-4xl font-playfair font-bold text-heading mb-2">
            {t('checkout.title')}
          </h1>
          <nav className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link to="/" className="text-heading-light hover:text-primary transition-colors">
              {t('nav.home')}
            </Link>
            <span className="text-heading-light">/</span>
            <Link to="/shop" className="text-heading-light hover:text-primary transition-colors">
              {t('nav.shop')}
            </Link>
            <span className="text-heading-light">/</span>
            <span className="text-heading font-medium">{t('checkout.title')}</span>
          </nav>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Cart Items & Customer Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Cart Items Section */}
              <div className="bg-white rounded-3xl p-6 lg:p-8">
                <h2 className={`text-2xl font-playfair font-bold text-heading mb-6 ${isRTL ? 'text-right' : ''}`}>
                  {t('checkout.yourOrder')} ({cartItems.reduce((total, item) => total + item.quantity, 0)} {t('cart.items')})
                </h2>

                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const productName = productTranslations[language]?.[item.id]?.name || item.name;
                    const mealComponents = productTranslations[language]?.[item.id]?.mealComponents || [];

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl bg-cream hover:bg-cream-dark transition-colors`}
                      >
                        <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={item.image}
                              alt={productName}
                              className="w-24 h-24 object-cover rounded-xl"
                            />
                          </div>

                          {/* Product Details */}
                          <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                            <h3 className="font-semibold text-heading text-lg mb-1">
                              {productName}
                            </h3>
                            <p className="text-primary font-bold text-xl">
                              {formatPrice(item.price)}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className={`flex flex-col items-center justify-between ${isRTL ? 'items-start' : 'items-end'}`}>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-heading-light hover:text-red-500 transition-colors text-sm font-medium mb-2"
                            >
                              {t('checkout.remove')}
                            </button>

                            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 text-heading font-bold transition-colors flex items-center justify-center border border-gray-200"
                              >
                                −
                              </button>
                              <span className="text-lg font-bold text-heading w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 text-heading font-bold transition-colors flex items-center justify-center border border-gray-200"
                              >
                                +
                              </button>
                            </div>

                            <p className="text-heading-light text-sm mt-2">
                              {t('cart.subtotal')}: <span className="font-semibold text-heading">{formatPrice(item.price * item.quantity)}</span>
                            </p>
                          </div>
                        </div>

                        {/* Meal Components */}
                        {mealComponents.length > 0 && (
                          <div className={`mt-4 pt-4 border-t border-gray-200 ${isRTL ? 'text-right' : ''}`}>
                            <p className="text-sm font-semibold text-heading mb-2">
                              {language === 'ar' ? 'مكونات الوجبة:' : 'Meal Components:'}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {mealComponents.map((component, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-white text-heading-light px-3 py-1 rounded-full border border-gray-200"
                                >
                                  {component}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Customer Details Form */}
              <div className="bg-white rounded-3xl p-6 lg:p-8">
                <h2 className={`text-2xl font-playfair font-bold text-heading mb-6 ${isRTL ? 'text-right' : ''}`}>
                  {t('checkout.deliveryInformation')}
                </h2>

                <div className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className={`block text-heading font-medium mb-2 ${isRTL ? 'text-right' : ''}`}>
                      {t('checkout.fullName')} *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:border-primary transition-colors ${isRTL ? 'text-right' : ''}`}
                      placeholder={t('checkout.fullNamePlaceholder')}
                    />
                    {errors.fullName && (
                      <p className={`text-red-500 text-sm mt-1 ${isRTL ? 'text-right' : ''}`}>{errors.fullName}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phone" className={`block text-heading font-medium mb-2 ${isRTL ? 'text-right' : ''}`}>
                      {t('checkout.phoneNumber')} *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:border-primary transition-colors ${isRTL ? 'text-right' : ''}`}
                      placeholder={t('checkout.phonePlaceholder')}
                    />
                    {errors.phone && (
                      <p className={`text-red-500 text-sm mt-1 ${isRTL ? 'text-right' : ''}`}>{errors.phone}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className={`block text-heading font-medium mb-2 ${isRTL ? 'text-right' : ''}`}>
                      {t('checkout.emailAddress')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:border-primary transition-colors ${isRTL ? 'text-right' : ''}`}
                      placeholder={t('checkout.emailPlaceholder')}
                    />
                    {errors.email && (
                      <p className={`text-red-500 text-sm mt-1 ${isRTL ? 'text-right' : ''}`}>{errors.email}</p>
                    )}
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <label htmlFor="address" className={`block text-heading font-medium mb-2 ${isRTL ? 'text-right' : ''}`}>
                      {t('checkout.deliveryAddress')} *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="4"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:border-primary transition-colors resize-none ${isRTL ? 'text-right' : ''}`}
                      placeholder={t('checkout.addressPlaceholder')}
                    />
                    {errors.address && (
                      <p className={`text-red-500 text-sm mt-1 ${isRTL ? 'text-right' : ''}`}>{errors.address}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary (Sticky) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-6 lg:p-8 sticky top-24">
                <h2 className={`text-2xl font-playfair font-bold text-heading mb-6 ${isRTL ? 'text-right' : ''}`}>
                  {t('checkout.orderSummary')}
                </h2>

                <div className="space-y-4 mb-6">
                  <div className={`flex justify-between text-heading-light ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>{t('cart.subtotal')}</span>
                    <span className="font-semibold">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className={`flex justify-between text-heading-light ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>{t('checkout.deliveryFee')}</span>
                    <span className="font-semibold text-green-600">{t('checkout.free')}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className={`flex justify-between text-heading text-xl font-bold ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span>{t('checkout.total')}</span>
                      <span className="text-primary">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-cream rounded-2xl p-4 mb-6">
                  <div className={`flex items-start gap-3 mb-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="text-2xl">💵</span>
                    <div className="flex-1">
                      <p className="font-semibold text-heading mb-1">{t('checkout.paymentMethod')}</p>
                      <p className="text-sm text-heading-light">{t('checkout.cashOnDelivery')}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="text-2xl">🚚</span>
                    <div className="flex-1">
                      <p className="font-semibold text-heading mb-1">{t('checkout.estimatedDelivery')}</p>
                      <p className="text-sm text-heading-light">{t('checkout.businessDays')}</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-hover hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? t('checkout.processing') : t('checkout.placeOrder')}
                </button>

                <Link
                  to="/shop"
                  className={`block w-full py-3 text-center text-primary hover:text-primary-hover transition-colors mt-4 font-medium ${isRTL ? 'text-right' : ''}`}
                >
                  {t('cart.continueShopping')}
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
