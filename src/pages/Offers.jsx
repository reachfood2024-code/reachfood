import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

const subscriptionPlans = [
  {
    id: 'oneMeal',
    mealsPerDay: 1,
    totalMeals: 26,
    priceUSD: 175,
    priceSAR: 656,
    pricePerMealUSD: 6.73,
    pricePerMealSAR: 25.23,
    popular: false,
    badge: null,
  },
  {
    id: 'twoMeals',
    mealsPerDay: 2,
    totalMeals: 52,
    priceUSD: 330,
    priceSAR: 1238,
    pricePerMealUSD: 6.35,
    pricePerMealSAR: 23.81,
    popular: false,
    badge: null,
  },
  {
    id: 'threeMeals',
    mealsPerDay: 3,
    totalMeals: 78,
    priceUSD: 480,
    priceSAR: 1800,
    pricePerMealUSD: 6.15,
    pricePerMealSAR: 23.08,
    popular: true,
    badge: null,
  },
  {
    id: 'twoMealsSalad',
    mealsPerDay: 2,
    totalMeals: 52,
    includesSalad: true,
    priceUSD: 390,
    priceSAR: 1463,
    pricePerMealUSD: 7.50,
    pricePerMealSAR: 28.13,
    popular: false,
    badge: 'bundleValue',
  },
  {
    id: 'twoMealsSaladPudding',
    mealsPerDay: 2,
    totalMeals: 52,
    includesSalad: true,
    includesPudding: true,
    priceUSD: 430,
    priceSAR: 1613,
    popular: false,
    badge: 'premium',
  },
];

const SUBSCRIPTION_DAYS = 26;

export default function Offers() {
  const { t, isRTL } = useLanguage();
  const { currency } = useCart();
  const [selectedPlan, setSelectedPlan] = useState('threeMeals');
  const [activeSlide, setActiveSlide] = useState(2); // Start at 3 Meals (most popular)
  const carouselRef = useRef(null);

  // Modal and form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [errors, setErrors] = useState({});

  const scrollToSlide = (index) => {
    setActiveSlide(index);
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.offsetWidth * 0.85;
      carouselRef.current.scrollTo({
        left: index * slideWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.offsetWidth * 0.85;
      const newIndex = Math.round(carouselRef.current.scrollLeft / slideWidth);
      if (newIndex !== activeSlide && newIndex >= 0 && newIndex < subscriptionPlans.length) {
        setActiveSlide(newIndex);
      }
    }
  };

  // Scroll to most popular plan on mobile mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (carouselRef.current && window.innerWidth < 768) {
        const popularIndex = subscriptionPlans.findIndex(p => p.popular);
        if (popularIndex !== -1) {
          const slideWidth = carouselRef.current.offsetWidth * 0.85;
          carouselRef.current.scrollTo({
            left: popularIndex * slideWidth,
            behavior: 'smooth'
          });
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const formatPrice = (plan) => {
    if (currency === 'SAR') {
      return `${plan.priceSAR.toLocaleString()} SAR`;
    }
    return `$${plan.priceUSD}`;
  };

  const getPricePerMeal = (plan) => {
    if (plan.badge === 'bundleValue') {
      return currency === 'SAR' ? `${plan.pricePerMealSAR.toFixed(2)} SAR ${t('offers.bundleValue')}` : `$${plan.pricePerMealUSD.toFixed(2)} ${t('offers.bundleValue')}`;
    }
    if (plan.badge === 'premium') {
      return t('offers.premium');
    }
    if (currency === 'SAR') {
      return `${plan.pricePerMealSAR.toFixed(2)} SAR / ${t('offers.meal')}`;
    }
    return `$${plan.pricePerMealUSD.toFixed(2)} / ${t('offers.meal')}`;
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    setIsModalOpen(true);
    setShowSuccess(false);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = t('offers.requiredField');
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t('offers.requiredField');
    }
    if (!formData.email.trim()) {
      newErrors.email = t('offers.requiredField');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('offers.invalidEmail');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const plan = subscriptionPlans.find(p => p.id === selectedPlan);

    try {
      // Submit to backend API
      const response = await fetch(`${API_URL}/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          planId: selectedPlan,
          planName: t(`offers.${selectedPlan}Plan`),
          mealsPerDay: plan?.mealsPerDay,
          totalMeals: plan?.totalMeals,
          priceUSD: plan?.priceUSD,
          priceSAR: plan?.priceSAR,
          currency: currency,
          subscriptionDays: SUBSCRIPTION_DAYS
        })
      });

      if (!response.ok) {
        throw new Error('API submission failed');
      }

      // Also submit to Google Apps Script as backup (optional)
      if (GOOGLE_SCRIPT_URL) {
        fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'subscription',
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            planId: selectedPlan,
            planName: t(`offers.${selectedPlan}Plan`),
            mealsPerDay: plan?.mealsPerDay,
            totalMeals: plan?.totalMeals,
            priceUSD: plan?.priceUSD,
            priceSAR: plan?.priceSAR,
            currency: currency,
            subscriptionDays: SUBSCRIPTION_DAYS,
            source: 'shop.reachfood.co',
            timestamp: new Date().toISOString()
          })
        }).catch(() => {}); // Ignore errors from backup
      }

      setShowSuccess(true);
      setFormData({ name: '', phone: '', email: '' });
    } catch (error) {
      console.error('Subscription form submission error:', error);
      // Still show success if API fails but try Google Script
      if (GOOGLE_SCRIPT_URL) {
        try {
          await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'subscription',
              name: formData.name,
              phone: formData.phone,
              email: formData.email,
              planId: selectedPlan,
              planName: t(`offers.${selectedPlan}Plan`),
              mealsPerDay: plan?.mealsPerDay,
              totalMeals: plan?.totalMeals,
              priceUSD: plan?.priceUSD,
              priceSAR: plan?.priceSAR,
              currency: currency,
              subscriptionDays: SUBSCRIPTION_DAYS,
              source: 'shop.reachfood.co',
              timestamp: new Date().toISOString()
            })
          });
        } catch {}
      }
      setShowSuccess(true);
      setFormData({ name: '', phone: '', email: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowSuccess(false);
    setFormData({ name: '', phone: '', email: '' });
    setErrors({});
  };

  return (
    <main className={`bg-cream min-h-screen ${isRTL ? 'direction-rtl' : ''}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-cream to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className={`space-y-6 ${isRTL ? 'lg:order-2 text-right' : ''}`}>
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
                <span className="text-primary font-medium text-sm">
                  {t('offers.tagline')}
                </span>
              </div>
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-heading leading-tight">
                {t('offers.title')}
                <span className="block text-primary mt-2">{t('offers.titleHighlight')}</span>
              </h1>
              <p className="text-lg text-heading-light max-w-xl">
                {t('offers.description')}
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#plans"
                  className="px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary-hover transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {t('offers.viewPlans')}
                </a>
                <Link
                  to="/shop"
                  className="px-8 py-4 bg-white text-heading rounded-full font-semibold hover:bg-cream transition-all duration-300 shadow-md"
                >
                  {t('offers.browseMenu')}
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className={`relative ${isRTL ? 'lg:order-1' : ''}`}>
              <div className="relative">
                <img
                  src="/offers-pack.jpg"
                  alt="ReachFood Meal Pack"
                  className="w-full rounded-3xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-primary">{SUBSCRIPTION_DAYS}</span>
                    <p className="text-sm text-heading-light">{t('offers.daysSubscription')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-heading mb-4">
              {t('offers.whySubscribe')}
            </h2>
            <p className="text-heading-light max-w-2xl mx-auto">
              {t('offers.whySubscribeDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-cream rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">$</span>
              </div>
              <h3 className="font-semibold text-xl text-heading mb-3">
                {t('offers.benefit1Title')}
              </h3>
              <p className="text-heading-light">
                {t('offers.benefit1Desc')}
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-cream rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">~</span>
              </div>
              <h3 className="font-semibold text-xl text-heading mb-3">
                {t('offers.benefit2Title')}
              </h3>
              <p className="text-heading-light">
                {t('offers.benefit2Desc')}
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-cream rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">*</span>
              </div>
              <h3 className="font-semibold text-xl text-heading mb-3">
                {t('offers.benefit3Title')}
              </h3>
              <p className="text-heading-light">
                {t('offers.benefit3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section id="plans" className="py-16 lg:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Promotional Banner */}
          <div className="bg-primary text-white text-center py-3 px-4 rounded-full mb-8 max-w-2xl mx-auto">
            <span className="font-medium">
              {t('offers.limitedOffer')} • {SUBSCRIPTION_DAYS} {t('offers.daysSubscription')} {t('offers.withFreeDelivery')}
            </span>
          </div>

          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-heading mb-4">
              {t('offers.choosePlan')}
            </h2>
            <p className="text-heading-light max-w-2xl mx-auto">
              {t('offers.choosePlanDesc')}
            </p>
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden">
            <div
              ref={carouselRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pt-8 pb-4 -mx-4 px-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              {subscriptionPlans.map((plan, index) => (
                <div
                  key={plan.id}
                  className={`relative flex-shrink-0 w-[85%] snap-center ${plan.popular ? 'pt-0' : 'pt-4'}`}
                >
                  {plan.popular && (
                    <div className="text-center mb-2">
                      <span className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shadow-md inline-block">
                        {t('offers.mostPopular')}
                      </span>
                    </div>
                  )}
                  <div
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`bg-white rounded-3xl p-6 cursor-pointer transition-all duration-300 ${
                      selectedPlan === plan.id
                        ? 'ring-2 ring-primary shadow-xl'
                        : 'shadow-lg'
                    }`}
                  >

                  <div className="text-center">
                    <h3 className="font-semibold text-xl text-heading mb-3">
                      {t(`offers.${plan.id}Plan`)}
                    </h3>

                    <div className="mb-3">
                      <span className="text-heading-light text-sm">{t('offers.mealsPerDayLabel')}</span>
                      <div className="text-2xl font-bold text-heading">{plan.mealsPerDay}</div>
                    </div>

                    <div className="mb-4">
                      <span className="text-heading-light text-sm">{t('offers.totalMealsLabel')}</span>
                      <div className="text-lg font-semibold text-heading">{plan.totalMeals}</div>
                    </div>

                    <div className="mb-2">
                      <div className="text-3xl font-bold text-primary">
                        {formatPrice(plan)}
                      </div>
                    </div>

                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-6 ${
                      plan.badge === 'premium'
                        ? 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {getPricePerMeal(plan)}
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleSelectPlan(plan.id); }}
                      className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${
                        selectedPlan === plan.id
                          ? 'bg-primary text-white hover:bg-primary-hover'
                          : 'bg-cream text-heading hover:bg-primary hover:text-white'
                      }`}
                    >
                      {t('offers.selectPlan')}
                    </button>
                  </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {subscriptionPlans.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    activeSlide === index
                      ? 'bg-primary w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 pt-4">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative bg-white rounded-3xl p-6 cursor-pointer transition-all duration-300 overflow-visible ${
                  selectedPlan === plan.id
                    ? 'ring-2 ring-primary shadow-xl scale-105'
                    : 'hover:shadow-lg'
                } ${plan.popular ? 'md:mt-2' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shadow-md">
                      {t('offers.mostPopular')}
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="font-semibold text-xl text-heading mb-3">
                    {t(`offers.${plan.id}Plan`)}
                  </h3>

                  <div className="mb-3">
                    <span className="text-heading-light text-sm">{t('offers.mealsPerDayLabel')}</span>
                    <div className="text-2xl font-bold text-heading">{plan.mealsPerDay}</div>
                  </div>

                  <div className="mb-4">
                    <span className="text-heading-light text-sm">{t('offers.totalMealsLabel')}</span>
                    <div className="text-lg font-semibold text-heading">{plan.totalMeals}</div>
                  </div>

                  <div className="mb-2">
                    <div className="text-3xl font-bold text-primary">
                      {formatPrice(plan)}
                    </div>
                  </div>

                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-6 ${
                    plan.badge === 'premium'
                      ? 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {getPricePerMeal(plan)}
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleSelectPlan(plan.id); }}
                    className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${
                      selectedPlan === plan.id
                        ? 'bg-primary text-white hover:bg-primary-hover'
                        : 'bg-cream text-heading hover:bg-primary hover:text-white'
                    }`}
                  >
                    {t('offers.selectPlan')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-heading mb-4">
              {t('offers.howItWorks')}
            </h2>
            <p className="text-heading-light max-w-2xl mx-auto">
              {t('offers.howItWorksDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-lg text-heading mb-2">
                {t('offers.step1Title')}
              </h3>
              <p className="text-heading-light text-sm">
                {t('offers.step1Desc')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-lg text-heading mb-2">
                {t('offers.step2Title')}
              </h3>
              <p className="text-heading-light text-sm">
                {t('offers.step2Desc')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-lg text-heading mb-2">
                {t('offers.step3Title')}
              </h3>
              <p className="text-heading-light text-sm">
                {t('offers.step3Desc')}
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold text-lg text-heading mb-2">
                {t('offers.step4Title')}
              </h3>
              <p className="text-heading-light text-sm">
                {t('offers.step4Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">
            {t('offers.ctaTitle')}
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            {t('offers.ctaDesc')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#plans"
              className="px-8 py-4 bg-white text-primary rounded-full font-semibold hover:bg-cream transition-all duration-300"
            >
              {t('offers.getStarted')}
            </a>
            <Link
              to="/contact"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300"
            >
              {t('offers.contactUs')}
            </Link>
          </div>
        </div>
      </section>

      {/* Subscription Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 transform transition-all ${isRTL ? 'text-right' : ''}`}>
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-heading-light hover:text-heading hover:bg-cream rounded-full transition-all"
              aria-label={t('offers.closeModal')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {showSuccess ? (
              /* Success Message */
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-playfair text-2xl font-bold text-heading mb-3">
                  {t('offers.successTitle')}
                </h3>
                <p className="text-heading-light mb-6">
                  {t('offers.successMessage')}
                </p>
                <button
                  onClick={closeModal}
                  className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-hover transition-all"
                >
                  {t('offers.closeModal')}
                </button>
              </div>
            ) : (
              /* Subscription Form */
              <>
                <h3 className="font-playfair text-2xl font-bold text-heading mb-2">
                  {t('offers.subscriptionForm')}
                </h3>

                {/* Selected Plan Info */}
                <div className="bg-cream rounded-xl p-4 mb-6">
                  <p className="text-sm text-heading-light mb-1">{t('offers.selectedPlanLabel')}</p>
                  <p className="font-semibold text-heading">
                    {t(`offers.${selectedPlan}Plan`)} - {formatPrice(subscriptionPlans.find(p => p.id === selectedPlan))}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className={`block text-heading font-medium mb-2 ${isRTL ? 'text-right' : ''}`}>
                      {t('offers.formName')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t('offers.formNamePlaceholder')}
                      className={`w-full px-5 py-3 bg-cream border-2 ${errors.name ? 'border-red-400' : 'border-transparent'} rounded-xl text-heading placeholder-heading-light/50 focus:outline-none focus:border-primary transition-colors ${isRTL ? 'text-right' : ''}`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label htmlFor="phone" className={`block text-heading font-medium mb-2 ${isRTL ? 'text-right' : ''}`}>
                      {t('offers.formPhone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={t('offers.formPhonePlaceholder')}
                      className={`w-full px-5 py-3 bg-cream border-2 ${errors.phone ? 'border-red-400' : 'border-transparent'} rounded-xl text-heading placeholder-heading-light/50 focus:outline-none focus:border-primary transition-colors ${isRTL ? 'text-right' : ''}`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className={`block text-heading font-medium mb-2 ${isRTL ? 'text-right' : ''}`}>
                      {t('offers.formEmail')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t('offers.formEmailPlaceholder')}
                      className={`w-full px-5 py-3 bg-cream border-2 ${errors.email ? 'border-red-400' : 'border-transparent'} rounded-xl text-heading placeholder-heading-light/50 focus:outline-none focus:border-primary transition-colors ${isRTL ? 'text-right' : ''}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-primary text-white font-semibold text-lg rounded-xl hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                  >
                    {isSubmitting ? t('offers.submitting') : t('offers.submitSubscription')}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
