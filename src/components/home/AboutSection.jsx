import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function AboutSection() {
  const { t, isRTL } = useLanguage();

  return (
    <section
      className="py-20 lg:py-32 relative overflow-hidden"
      style={{
        backgroundImage: 'url("/aboutus homepage bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Empty space for background image visibility */}
          <div className="relative hidden lg:block">
            {/* Space for background image */}
          </div>

          {/* Right - Content */}
          <div className={`text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'} bg-white/90 backdrop-blur-sm rounded-3xl p-8 lg:p-12`}>
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-heading mb-4">
              {t('aboutSection.title')}
            </h2>
            <p className="text-primary font-medium mb-6">{t('aboutSection.subtitle')}</p>

            <p className="text-heading-light text-lg leading-relaxed mb-8">
              {t('aboutSection.description')}
            </p>

            {/* Features */}
            <div className="space-y-6 mb-10">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <span className="text-primary text-xl font-bold">*</span>
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="font-playfair text-xl font-semibold text-heading mb-1">
                    {t('aboutSection.culturallyAuthentic')}
                  </h3>
                  <p className="text-heading-light">
                    {t('aboutSection.culturallyAuthenticDesc')}
                  </p>
                </div>
              </div>

              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0 w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center">
                  <span className="text-teal text-xl font-bold">*</span>
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="font-playfair text-xl font-semibold text-heading mb-1">
                    {t('aboutSection.sustainablePackaging')}
                  </h3>
                  <p className="text-heading-light">
                    {t('aboutSection.sustainablePackagingDesc')}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <Link
                to="/about"
                className="btn-primary inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover shadow-lg shadow-primary/30"
              >
                {t('hero.learnMore')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
