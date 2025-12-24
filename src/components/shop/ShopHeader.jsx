import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function ShopHeader() {
  const { t } = useLanguage();

  return (
    <div className="relative h-64 lg:h-80 overflow-hidden">
      {/* Background Image Collage */}
      <div className="absolute inset-0">
        <div className="grid grid-cols-4 h-full">
          <div className="relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-teal-dark/70" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-playfair text-4xl lg:text-6xl font-bold text-white mb-4 tracking-wide">
          {t('shop.collection')}
        </h1>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm">
          <Link
            to="/"
            className="text-white/70 hover:text-white transition-colors"
          >
            {t('shop.home')}
          </Link>
          <span className="text-white/50">/</span>
          <span className="text-primary font-medium">{t('shop.allProducts')}</span>
        </nav>
      </div>
    </div>
  );
}
