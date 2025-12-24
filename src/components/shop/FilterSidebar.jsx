import { useState } from 'react';
import { products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { productTranslations } from '../../data/translations';

export default function FilterSidebar({ filters, setFilters, onClear }) {
  const { formatPrice, currency } = useCart();
  const { t, language, isRTL } = useLanguage();
  const maxPrice = Math.max(...products.map((p) => p.price));
  const [localPriceRange, setLocalPriceRange] = useState(filters.priceRange);

  const handleAvailabilityChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [type]: !prev.availability[type],
      },
    }));
  };

  const handleApplyPrice = () => {
    setFilters((prev) => ({
      ...prev,
      priceRange: localPriceRange,
    }));
  };

  const featuredProduct = products.find((p) => p.featured);

  return (
    <aside className="space-y-8">
      {/* Availability Filter */}
      <div className="bg-white rounded-2xl p-6">
        <h3 className="font-playfair text-xl font-semibold text-heading mb-4">
          {t('shop.availability')}
        </h3>
        <div className="space-y-3">
          <label className={`flex items-center gap-3 cursor-pointer group ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="relative">
              <input
                type="checkbox"
                checked={filters.availability.inStock}
                onChange={() => handleAvailabilityChange('inStock')}
                className="peer sr-only"
              />
              <div className="w-5 h-5 border-2 border-heading/30 rounded-md peer-checked:border-primary peer-checked:bg-primary transition-all" />
              <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 text-xs font-bold">
                ✓
              </span>
            </div>
            <span className="text-heading-light group-hover:text-heading transition-colors">
              {t('shop.inStock')} ({products.filter((p) => p.inStock).length})
            </span>
          </label>

          <label className={`flex items-center gap-3 cursor-pointer group ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="relative">
              <input
                type="checkbox"
                checked={filters.availability.outOfStock}
                onChange={() => handleAvailabilityChange('outOfStock')}
                className="peer sr-only"
              />
              <div className="w-5 h-5 border-2 border-heading/30 rounded-md peer-checked:border-primary peer-checked:bg-primary transition-all" />
              <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 text-xs font-bold">
                ✓
              </span>
            </div>
            <span className="text-heading-light group-hover:text-heading transition-colors">
              {t('shop.outOfStock')} ({products.filter((p) => !p.inStock).length})
            </span>
          </label>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={onClear}
            className="flex-1 px-4 py-2 border border-primary text-primary font-medium rounded-full hover:bg-primary/10 transition-colors text-sm"
          >
            {t('shop.clear')}
          </button>
          <button
            onClick={handleApplyPrice}
            className="flex-1 px-4 py-2 bg-primary text-white font-medium rounded-full hover:bg-primary-hover transition-colors text-sm"
          >
            {t('shop.apply')}
          </button>
        </div>
      </div>

      {/* Price Filter */}
      <div className="bg-white rounded-2xl p-6">
        <h3 className="font-playfair text-xl font-semibold text-heading mb-4">
          {t('shop.price')}
        </h3>
        <p className="text-sm text-heading-light mb-4">
          {t('shop.highestPrice')} {formatPrice(maxPrice)}
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-heading-light mb-1 block">{t('shop.from')} ({currency === 'USD' ? '$' : 'SAR'})</label>
            <input
              type="number"
              min="0"
              max={localPriceRange.max}
              value={localPriceRange.min}
              onChange={(e) =>
                setLocalPriceRange((prev) => ({
                  ...prev,
                  min: Number(e.target.value),
                }))
              }
              className="w-full px-4 py-3 bg-cream rounded-xl text-heading focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-sm text-heading-light mb-1 block">{t('shop.to')} ({currency === 'USD' ? '$' : 'SAR'})</label>
            <input
              type="number"
              min={localPriceRange.min}
              value={localPriceRange.max}
              onChange={(e) =>
                setLocalPriceRange((prev) => ({
                  ...prev,
                  max: Number(e.target.value),
                }))
              }
              className="w-full px-4 py-3 bg-cream rounded-xl text-heading focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={onClear}
            className="flex-1 px-4 py-2 border border-primary text-primary font-medium rounded-full hover:bg-primary/10 transition-colors text-sm"
          >
            {t('shop.clear')}
          </button>
          <button
            onClick={handleApplyPrice}
            className="flex-1 px-4 py-2 bg-primary text-white font-medium rounded-full hover:bg-primary-hover transition-colors text-sm"
          >
            {t('shop.apply')}
          </button>
        </div>
      </div>

      {/* Clear All Button */}
      <button
        onClick={onClear}
        className="w-full py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-colors"
      >
        {t('shop.clearAll')}
      </button>

      {/* Featured Dish */}
      {featuredProduct && (
        <div className="bg-white rounded-2xl p-6">
          <h3 className="font-playfair text-xl font-semibold text-heading mb-4">
            {t('shop.ourSpecialDish')}
          </h3>
          <div className="rounded-xl overflow-hidden">
            <img
              src={featuredProduct.image}
              alt={productTranslations[language]?.[featuredProduct.id]?.name || featuredProduct.name}
              className="w-full aspect-square object-cover"
            />
          </div>
          <div className="mt-4 text-center">
            <h4 className="font-playfair font-semibold text-heading">
              {productTranslations[language]?.[featuredProduct.id]?.name || featuredProduct.name}
            </h4>
            <p className="text-primary font-bold mt-1">
              {formatPrice(featuredProduct.price)}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
