import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { productTranslations } from '../data/translations';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart, formatPrice } = useCart();
  const { t, language, isRTL } = useLanguage();

  const orderData = location.state?.orderData;

  useEffect(() => {
    // If no order data, redirect to shop
    if (!orderData) {
      navigate('/shop');
      return;
    }

    // Clear cart after successful order
    clearCart();
  }, [orderData, navigate, clearCart]);

  if (!orderData) {
    return null;
  }

  const { orderNumber, items, total, customer } = orderData;

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 text-center mb-8">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-playfair font-bold text-heading mb-4">
            {t('orderConfirmation.title')}
          </h1>
          <p className="text-xl text-heading-light mb-2">
            {t('orderConfirmation.thankYou')}, {customer.fullName}
          </p>
          <p className="text-heading-light mb-6">
            {t('orderConfirmation.receivedMessage')}
          </p>

          <div className="inline-block bg-cream rounded-2xl px-6 py-4">
            <p className="text-sm text-heading-light mb-1">{t('orderConfirmation.orderNumber')}</p>
            <p className="text-3xl font-bold text-primary">#{orderNumber}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 mb-8">
          <h2 className={`text-2xl font-playfair font-bold text-heading mb-6 ${isRTL ? 'text-right' : ''}`}>
            {t('orderConfirmation.orderDetails')}
          </h2>

          {/* Items */}
          <div className="space-y-4 mb-6">
            {items.map((item) => {
              const productName = productTranslations[language]?.[item.id]?.name || item.name;

              return (
                <div
                  key={item.id}
                  className={`flex gap-4 p-4 rounded-2xl bg-cream ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <img
                    src={item.image}
                    alt={productName}
                    className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                    <h3 className="font-semibold text-heading mb-1">{productName}</h3>
                    <p className="text-heading-light text-sm">
                      {t('cart.quantity')}: {item.quantity}
                    </p>
                  </div>
                  <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
                    <p className="font-bold text-primary">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-6 space-y-3">
            <div className={`flex justify-between text-heading-light ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span>{t('cart.subtotal')}</span>
              <span className="font-semibold">{formatPrice(total)}</span>
            </div>
            <div className={`flex justify-between text-heading-light ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span>{t('checkout.deliveryFee')}</span>
              <span className="font-semibold text-green-600">{t('checkout.free')}</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className={`flex justify-between text-heading text-xl font-bold ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span>{t('checkout.total')}</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 mb-8">
          <h2 className={`text-2xl font-playfair font-bold text-heading mb-6 ${isRTL ? 'text-right' : ''}`}>
            {t('orderConfirmation.deliveryInfo')}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className={isRTL ? 'text-right' : ''}>
              <p className="text-heading-light text-sm mb-1">{t('orderConfirmation.name')}</p>
              <p className="text-heading font-semibold">{customer.fullName}</p>
            </div>
            <div className={isRTL ? 'text-right' : ''}>
              <p className="text-heading-light text-sm mb-1">{t('orderConfirmation.phone')}</p>
              <p className="text-heading font-semibold">{customer.phone}</p>
            </div>
            <div className={isRTL ? 'text-right' : ''}>
              <p className="text-heading-light text-sm mb-1">{t('orderConfirmation.email')}</p>
              <p className="text-heading font-semibold">{customer.email}</p>
            </div>
            <div className={isRTL ? 'text-right' : ''}>
              <p className="text-heading-light text-sm mb-1">{t('orderConfirmation.address')}</p>
              <p className="text-heading font-semibold">{customer.address}</p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-cream rounded-2xl">
            <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
              <span className="text-3xl">🚚</span>
              <div className="flex-1">
                <p className="font-semibold text-heading mb-2">{t('orderConfirmation.expectedDelivery')}</p>
                <p className="text-heading-light">
                  {t('orderConfirmation.deliveryMessage')} <span className="font-semibold text-heading">{t('checkout.businessDays')}</span>
                </p>
                <p className="text-heading-light mt-2">
                  {t('orderConfirmation.payment')}: <span className="font-semibold text-heading">{t('checkout.cashOnDelivery')}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 mb-8">
          <h2 className={`text-2xl font-playfair font-bold text-heading mb-6 ${isRTL ? 'text-right' : ''}`}>
            {t('orderConfirmation.whatHappensNext')}
          </h2>

          <div className="space-y-4">
            <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <p className="font-semibold text-heading mb-1">{t('orderConfirmation.step1Title')}</p>
                <p className="text-heading-light text-sm">
                  {t('orderConfirmation.step1Desc')}
                </p>
              </div>
            </div>

            <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <p className="font-semibold text-heading mb-1">{t('orderConfirmation.step2Title')}</p>
                <p className="text-heading-light text-sm">
                  {t('orderConfirmation.step2Desc')}
                </p>
              </div>
            </div>

            <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <p className="font-semibold text-heading mb-1">{t('orderConfirmation.step3Title')}</p>
                <p className="text-heading-light text-sm">
                  {t('orderConfirmation.step3Desc')}
                </p>
              </div>
            </div>

            <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <p className="font-semibold text-heading mb-1">{t('orderConfirmation.step4Title')}</p>
                <p className="text-heading-light text-sm">
                  {t('orderConfirmation.step4Desc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/shop"
            className="px-8 py-4 bg-primary text-white rounded-full hover:bg-primary-hover transition-all duration-300 hover:shadow-xl font-semibold text-center"
          >
            {t('cart.continueShopping')}
          </Link>
          <Link
            to="/"
            className="px-8 py-4 bg-white text-primary border-2 border-primary rounded-full hover:bg-primary hover:text-white transition-all duration-300 font-semibold text-center"
          >
            {t('orderConfirmation.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
