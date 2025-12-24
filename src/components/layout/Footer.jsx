import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t, isRTL } = useLanguage();

  const footerLinks = {
    shop: [
      { name: t('footer.allMeals'), path: '/shop' },
      { name: t('footer.asianCuisine'), path: '/shop?category=asian' },
      { name: t('footer.indianFlavors'), path: '/shop?category=indian' },
      { name: t('footer.mediterranean'), path: '/shop?category=mediterranean' },
    ],
    company: [
      { name: t('footer.aboutUs'), path: '/about' },
      { name: t('footer.ourStory'), path: '/story' },
      { name: t('footer.sustainability'), path: '/sustainability' },
      { name: t('footer.careers'), path: '/careers' },
    ],
    support: [
      { name: t('footer.faq'), path: '/faq' },
      { name: t('footer.shipping'), path: '/shipping' },
      { name: t('footer.returns'), path: '/returns' },
      { name: t('footer.contact'), path: '/contact' },
    ],
  };

  return (
    <footer className="bg-gradient-to-b from-cream to-cream-dark relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-heading/10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block group">
              <img
                src="/logo.jpg"
                alt="ReachFood"
                className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="mt-4 text-heading-light leading-relaxed max-w-sm">
              {t('footer.description')}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://www.facebook.com/reachfood"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md text-heading-light hover:text-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                aria-label="Facebook"
              >
                <span className="text-sm font-bold">f</span>
              </a>
              <a
                href="https://x.com/reachfood"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md text-heading-light hover:text-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                aria-label="X"
              >
                <span className="text-sm font-bold">𝕏</span>
              </a>
              <a
                href="https://www.instagram.com/reachfood2025"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md text-heading-light hover:text-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                aria-label="Instagram"
              >
                <span className="text-sm font-bold">IG</span>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-playfair text-lg font-semibold text-heading mb-4">
              {t('footer.shop')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-heading-light hover:text-primary transition-colors duration-200 text-[15px]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-playfair text-lg font-semibold text-heading mb-4">
              {t('footer.company')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-heading-light hover:text-primary transition-colors duration-200 text-[15px]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-playfair text-lg font-semibold text-heading mb-4">
              {t('footer.support')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-heading-light hover:text-primary transition-colors duration-200 text-[15px]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="py-10 border-b border-heading/10">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-playfair text-2xl font-semibold text-heading mb-2">
              {t('footer.newsletter')}
            </h3>
            <p className="text-heading-light mb-6">
              {t('footer.newsletterDesc')}
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="flex-1 px-6 py-3.5 bg-white rounded-full text-heading placeholder:text-heading-light/60 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm transition-all"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                {t('footer.subscribe')}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-heading-light">
          <p>© {currentYear} {t('footer.copyright')}</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              {t('footer.privacyPolicy')}
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              {t('footer.termsOfService')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
