import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { productTranslations } from '../../data/translations';

export default function ProductCard({ product, viewMode = 'grid' }) {
  const { addToCart, formatPrice } = useCart();
  const { t, language, isRTL } = useLanguage();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  const productName = productTranslations[language]?.[product.id]?.name || product.name;
  const productDescription = productTranslations[language]?.[product.id]?.description || product.description;

  if (viewMode === 'list') {
    return (
      <div className={`product-card group bg-white rounded-2xl p-4 flex gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Image */}
        <Link to={`/product/${product.id}`} className="relative flex-shrink-0">
          <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-900">
            <img
              src={product.image}
              alt={productName}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* Sale Badge */}
          {product.originalPrice && (
            <span className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} bg-teal text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
              {t('products.save')} {Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}
        </Link>

        {/* Content */}
        <div className={`flex-1 flex flex-col justify-between ${isRTL ? 'text-right' : ''}`}>
          <div>
            <div className={`flex items-start justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link to={`/product/${product.id}`}>
                <h3 className="font-playfair text-lg font-semibold text-heading hover:text-primary transition-colors">
                  {productName}
                </h3>
              </Link>
              <span
                className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  product.inStock ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
            </div>
            <p className="text-heading-light text-sm line-clamp-2">
              {productDescription}
            </p>
          </div>

          <div className={`flex items-center justify-between mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold text-lg">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-heading-light line-through text-sm">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                product.inStock
                  ? 'bg-primary text-white hover:bg-primary-hover'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {product.inStock ? t('products.addToCart') : t('products.outOfStock')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-card group bg-white rounded-3xl p-4 relative">
      {/* Sale Badge */}
      {product.originalPrice && (
        <div className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} z-10`}>
          <span className="bg-teal text-white text-xs font-bold px-3 py-1 rounded-full">
            {t('products.save')} {Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        </div>
      )}

      {/* Stock Indicator */}
      <div className={`absolute top-6 ${isRTL ? 'right-6' : 'left-6'} z-10`}>
        <span
          className={`w-3 h-3 rounded-full inline-block ${
            product.inStock ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
      </div>

      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="block relative mb-4">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-900">
          <img
            src={product.image}
            alt={productName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`px-6 py-3 font-semibold rounded-full transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                product.inStock
                  ? 'bg-white text-heading hover:bg-primary hover:text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {product.inStock ? t('products.addToCart') : t('products.outOfStock')}
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="text-center">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-playfair text-lg font-semibold text-heading hover:text-primary transition-colors mb-2">
            {productName}
          </h3>
        </Link>
        <div className="flex items-center justify-center gap-2">
          <span className="text-primary font-bold text-lg">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-heading-light line-through text-sm">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
