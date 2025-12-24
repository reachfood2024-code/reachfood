import { useState, useMemo } from 'react';
import ShopHeader from '../components/shop/ShopHeader';
import FilterSidebar from '../components/shop/FilterSidebar';
import ProductCard from '../components/shop/ProductCard';
import { products } from '../data/products';
import { useLanguage } from '../context/LanguageContext';

export default function Shop() {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    availability: {
      inStock: true,
      outOfStock: true,
    },
    priceRange: {
      min: 0,
      max: 100,
    },
  });
  const { t, isRTL } = useLanguage();

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by availability
    result = result.filter((product) => {
      if (product.inStock && filters.availability.inStock) return true;
      if (!product.inStock && filters.availability.outOfStock) return true;
      return false;
    });

    // Filter by price range
    result = result.filter(
      (product) =>
        product.price >= filters.priceRange.min &&
        product.price <= filters.priceRange.max
    );

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [filters, sortBy]);

  const handleClearFilters = () => {
    setFilters({
      availability: {
        inStock: true,
        outOfStock: true,
      },
      priceRange: {
        min: 0,
        max: 100,
      },
    });
  };

  return (
    <main className="bg-cream min-h-screen">
      <ShopHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`lg:grid lg:grid-cols-12 lg:gap-8 ${isRTL ? 'direction-rtl' : ''}`}>
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="w-full py-3 bg-white rounded-xl font-medium text-heading flex items-center justify-center gap-2"
            >
              <span>{t('shop.filters')}</span>
              <span className={`transition-transform ${isMobileFilterOpen ? 'rotate-180' : ''}`}>
                ▾
              </span>
            </button>

            {/* Mobile Filter Panel */}
            <div
              className={`mt-4 transition-all duration-300 overflow-hidden ${
                isMobileFilterOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                onClear={handleClearFilters}
              />
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className={`hidden lg:block lg:col-span-3 ${isRTL ? 'lg:order-2' : ''}`}>
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              onClear={handleClearFilters}
            />
          </div>

          {/* Products Area */}
          <div className={`lg:col-span-9 ${isRTL ? 'lg:order-1' : ''}`}>
            {/* Toolbar */}
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white rounded-xl p-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              {/* View Mode Toggle */}
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary text-white'
                      : 'bg-cream text-heading-light hover:bg-cream-dark'
                  }`}
                  aria-label="Grid view"
                >
                  <span className="text-lg">▦</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary text-white'
                      : 'bg-cream text-heading-light hover:bg-cream-dark'
                  }`}
                  aria-label="List view"
                >
                  <span className="text-lg">☰</span>
                </button>
                <span className={`text-heading-light text-sm ${isRTL ? 'mr-4' : 'ml-4'}`}>
                  {filteredAndSortedProducts.length} {t('shop.products')}
                </span>
              </div>

              {/* Sort Dropdown */}
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-heading-light text-sm">{t('shop.sortBy')}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium cursor-pointer focus:outline-none"
                >
                  <option value="featured">{t('shop.featured')}</option>
                  <option value="price-low">{t('shop.priceLowToHigh')}</option>
                  <option value="price-high">{t('shop.priceHighToLow')}</option>
                  <option value="name">{t('shop.name')}</option>
                </select>
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-heading-light text-lg mb-4">
                  {t('shop.noProducts')}
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-hover transition-colors"
                >
                  {t('shop.clearFilters')}
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}

            {/* Pagination Placeholder */}
            {filteredAndSortedProducts.length > 0 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-full bg-primary text-white font-medium">
                    1
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white text-heading-light font-medium hover:bg-cream transition-colors">
                    2
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white text-heading-light font-medium hover:bg-cream transition-colors">
                    3
                  </button>
                  <span className="px-2 text-heading-light">...</span>
                  <button className={`w-10 h-10 rounded-full bg-white text-heading-light font-medium hover:bg-cream transition-colors ${isRTL ? 'rotate-180' : ''}`}>
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
