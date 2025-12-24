import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function Hero() {
  const { t, isRTL } = useLanguage();

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        backgroundImage: 'url("/hero image bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className={`text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'} max-w-2xl ${isRTL ? 'lg:mr-auto lg:ml-0' : ''}`}>
          {/* Tagline */}
          <span className="inline-block font-dancing text-2xl sm:text-3xl text-primary mb-4 mt-16 animate-[fadeInUp_0.6s_ease-out] drop-shadow-lg">
            {t('hero.tagline')}
          </span>

          {/* Main Headline */}
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-[fadeInUp_0.6s_ease-out_0.1s_both] drop-shadow-lg">
            {t('hero.headline')}{' '}
            <span className="text-primary">{t('hero.headlineHighlight')}</span>
          </h1>

          {/* Description */}
          <p className="text-white/90 text-lg sm:text-xl leading-relaxed mb-8 animate-[fadeInUp_0.6s_ease-out_0.2s_both] drop-shadow-md">
            {t('hero.description')}
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'lg:justify-end' : 'lg:justify-start'} animate-[fadeInUp_0.6s_ease-out_0.3s_both]`}>
            <Link
              to="/shop"
              className="btn-primary inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold text-lg rounded-full hover:bg-primary-hover shadow-lg shadow-primary/30"
            >
              {t('hero.shopNow')}
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-heading font-semibold text-lg rounded-full hover:bg-white/90 transition-all duration-300"
            >
              {t('hero.learnMore')}
            </Link>
          </div>

          {/* Trust Badges */}
          <div className={`mt-10 flex flex-wrap items-center justify-center ${isRTL ? 'lg:justify-end' : 'lg:justify-start'} gap-8 animate-[fadeInUp_0.6s_ease-out_0.4s_both]`}>
            <div className="text-center">
              <p className="font-playfair text-3xl font-bold text-white drop-shadow-lg">3-5</p>
              <p className="text-sm text-white/80">{t('hero.minutesReady')}</p>
            </div>
            <div className="w-px h-12 bg-white/30" />
            <div className="text-center">
              <p className="font-playfair text-3xl font-bold text-white drop-shadow-lg">100%</p>
              <p className="text-sm text-white/80">{t('hero.sustainable')}</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
