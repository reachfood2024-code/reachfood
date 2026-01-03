import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../data/products';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { productTranslations } from '../data/translations';
import { analytics } from '../services/analytics';

export default function ProductCheckout() {
  const { id } = useParams();
  const product = getProductById(parseInt(id));
  const { addToCart, formatPrice } = useCart();
  const { t, language, isRTL } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const hasTrackedView = useRef(false);

  // Track product view in GA4
  useEffect(() => {
    if (product && !hasTrackedView.current) {
      hasTrackedView.current = true;
      analytics.viewItem(product);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-playfair font-bold text-heading mb-4">
            Product Not Found
          </h1>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const productName = productTranslations[language]?.[product.id]?.name || product.name;
  const productDescription = productTranslations[language]?.[product.id]?.description || product.description;
  const mealComponents = productTranslations[language]?.[product.id]?.mealComponents || [];
  const nutritionHighlights = productTranslations[language]?.[product.id]?.nutritionHighlights || [];
  const nutritionFacts = productTranslations[language]?.[product.id]?.nutritionFacts || null;

  // Nutrition facts labels
  const nutritionLabels = {
    en: {
      servingSize: 'Serving Size',
      calories: 'Calories',
      protein: 'Protein',
      carbs: 'Carbohydrates',
      fat: 'Total Fat',
      fiber: 'Dietary Fiber',
      sodium: 'Sodium',
      cholesterol: 'Cholesterol',
      vitaminA: 'Vitamin A',
      vitaminC: 'Vitamin C',
      iron: 'Iron',
      calcium: 'Calcium'
    },
    ar: {
      servingSize: 'حجم الحصة',
      calories: 'السعرات الحرارية',
      protein: 'البروتين',
      carbs: 'الكربوهيدرات',
      fat: 'الدهون الكلية',
      fiber: 'الألياف الغذائية',
      sodium: 'الصوديوم',
      cholesterol: 'الكوليسترول',
      vitaminA: 'فيتامين أ',
      vitaminC: 'فيتامين ج',
      iron: 'الحديد',
      calcium: 'الكالسيوم'
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in">
          {t('products.addToCart')} ✓
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className={`flex items-center gap-2 text-sm mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Link to="/" className="text-heading-light hover:text-primary transition-colors">
            {t('nav.home')}
          </Link>
          <span className="text-heading-light">/</span>
          <Link to="/shop" className="text-heading-light hover:text-primary transition-colors">
            {t('nav.shop')}
          </Link>
          <span className="text-heading-light">/</span>
          <span className="text-heading font-medium">{productName}</span>
        </nav>

        <div className={`grid lg:grid-cols-2 gap-12 ${isRTL ? 'direction-rtl' : ''}`}>
          {/* Product Images */}
          <div className="space-y-6">
            {/* Main Product Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-900">
              <img
                src={product.image}
                alt={productName}
                className="w-full h-full object-cover"
              />
              {product.originalPrice && (
                <span className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} bg-teal text-white text-sm font-bold px-4 py-2 rounded-full`}>
                  {t('products.save')} {Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Food Image - Only for product 9 */}
            {product.id === 9 && (
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-900">
                <img
                  src="/food/roozchickn.jpg"
                  alt="Food preparation"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className={`${isRTL ? 'text-right' : ''}`}>
            <div className="bg-white rounded-3xl p-8 lg:p-12">
              {/* Product Title */}
              <h1 className="font-playfair text-4xl font-bold text-heading mb-4">
                {productName}
              </h1>

              {/* Stock Status */}
              <div className={`flex items-center gap-2 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span
                  className={`w-3 h-3 rounded-full ${
                    product.inStock ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? t('shop.inStock') : t('shop.outOfStock')}
                </span>
              </div>

              {/* Price */}
              <div className={`flex items-center gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-2xl text-heading-light line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-heading-light text-lg mb-8 leading-relaxed">
                {productDescription}
              </p>

              {/* Nutrition Facts */}
              {nutritionFacts && (
                <div className="mb-8 p-6 bg-white border-2 border-gray-800 rounded-2xl">
                  <h3 className="font-bold text-xl text-heading mb-1 pb-2 border-b-8 border-gray-800">
                    {language === 'ar' ? 'القيمة الغذائية (تقريبية)' : 'Nutrition Facts (Approx.)'}
                  </h3>
                  <p className="text-sm text-heading-light mb-3 pb-2 border-b border-gray-300">
                    {nutritionLabels[language].servingSize}: {nutritionFacts.servingSize}
                  </p>
                  <div className="space-y-2">
                    {nutritionFacts.calories && (
                      <div className={`flex justify-between py-1 border-b border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="font-bold text-heading">{nutritionLabels[language].calories}</span>
                        <span className="font-bold text-heading">{nutritionFacts.calories}</span>
                      </div>
                    )}
                    {nutritionFacts.protein && (
                      <div className={`flex justify-between py-1 border-b border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-heading">{nutritionLabels[language].protein}</span>
                        <span className="font-semibold text-heading">{nutritionFacts.protein}</span>
                      </div>
                    )}
                    {nutritionFacts.carbs && (
                      <div className={`flex justify-between py-1 border-b border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-heading">{nutritionLabels[language].carbs}</span>
                        <span className="font-semibold text-heading">{nutritionFacts.carbs}</span>
                      </div>
                    )}
                    {nutritionFacts.fat && (
                      <div className={`flex justify-between py-1 border-b border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-heading">{nutritionLabels[language].fat}</span>
                        <span className="font-semibold text-heading">{nutritionFacts.fat}</span>
                      </div>
                    )}
                    {nutritionFacts.fiber && (
                      <div className={`flex justify-between py-1 border-b border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-heading">{nutritionLabels[language].fiber}</span>
                        <span className="font-semibold text-heading">{nutritionFacts.fiber}</span>
                      </div>
                    )}
                    {nutritionFacts.sodium && (
                      <div className={`flex justify-between py-1 border-b border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-heading">{nutritionLabels[language].sodium}</span>
                        <span className="font-semibold text-heading">{nutritionFacts.sodium}</span>
                      </div>
                    )}
                    {nutritionFacts.cholesterol && (
                      <div className={`flex justify-between py-1 border-b border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-heading">{nutritionLabels[language].cholesterol}</span>
                        <span className="font-semibold text-heading">{nutritionFacts.cholesterol}</span>
                      </div>
                    )}
                    {(nutritionFacts.vitaminA || nutritionFacts.vitaminC || nutritionFacts.iron || nutritionFacts.calcium) && (
                      <div className="pt-2 mt-2 border-t border-gray-300">
                        <p className="text-sm font-semibold text-heading mb-2">
                          {language === 'ar' ? 'الفيتامينات والمعادن' : 'Vitamins & Minerals'}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {nutritionFacts.vitaminA && (
                            <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className="text-heading-light">{nutritionLabels[language].vitaminA}</span>
                              <span className="font-semibold text-heading">{nutritionFacts.vitaminA}</span>
                            </div>
                          )}
                          {nutritionFacts.vitaminC && (
                            <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className="text-heading-light">{nutritionLabels[language].vitaminC}</span>
                              <span className="font-semibold text-heading">{nutritionFacts.vitaminC}</span>
                            </div>
                          )}
                          {nutritionFacts.iron && (
                            <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className="text-heading-light">{nutritionLabels[language].iron}</span>
                              <span className="font-semibold text-heading">{nutritionFacts.iron}</span>
                            </div>
                          )}
                          {nutritionFacts.calcium && (
                            <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className="text-heading-light">{nutritionLabels[language].calcium}</span>
                              <span className="font-semibold text-heading">{nutritionFacts.calcium}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Nutritional Highlights */}
              {nutritionHighlights.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-playfair text-xl font-bold text-heading mb-4">
                    {language === 'ar' ? 'المميزات الغذائية' : 'Nutritional Highlights'}
                  </h3>
                  <div className="space-y-2">
                    {nutritionHighlights.map((highlight, index) => (
                      <div key={index} className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-green-500 font-bold">✓</span>
                        <span className="text-heading-light">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Meal Components */}
              {mealComponents.length > 0 && (
                <div className="mb-8 p-6 bg-cream rounded-2xl">
                  <h3 className="font-playfair text-xl font-bold text-heading mb-4">
                    {language === 'ar' ? 'مكونات الوجبة' : 'Meal Components'}
                  </h3>
                  <div className="space-y-3">
                    {mealComponents.map((component, index) => (
                      <div key={index} className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-primary font-bold">•</span>
                        <span className="text-heading-light">{component}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-gray-200 my-8" />

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-heading font-medium mb-4">
                  {t('cart.quantity') || 'Quantity'}
                </label>
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-12 h-12 rounded-full bg-cream hover:bg-cream-dark text-heading font-bold text-xl transition-colors flex items-center justify-center"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="text-2xl font-bold text-heading w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-12 h-12 rounded-full bg-cream hover:bg-cream-dark text-heading font-bold text-xl transition-colors flex items-center justify-center"
                    disabled={quantity >= 10}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Price */}
              <div className={`flex items-center justify-between mb-8 p-6 bg-cream rounded-2xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-heading-light font-medium">
                  {t('cart.subtotal') || 'Subtotal'}
                </span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(product.price * quantity)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`w-full py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
                    product.inStock
                      ? 'bg-primary text-white hover:bg-primary-hover hover:shadow-xl'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {product.inStock ? t('products.addToCart') : t('products.outOfStock')}
                </button>

                <Link
                  to="/shop"
                  className="block w-full py-4 rounded-full font-semibold text-lg text-center border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                >
                  {t('cart.continueShopping') || 'Continue Shopping'}
                </Link>
              </div>

              {/* Additional Info */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="space-y-4 text-sm text-heading-light">
                  <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>✓</span>
                    <span>{t('features.readyInMinutes')}</span>
                  </div>
                  <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>✓</span>
                    <span>{t('features.qualityIngredients')}</span>
                  </div>
                  <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>✓</span>
                    <span>{t('aboutSection.sustainablePackaging')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
