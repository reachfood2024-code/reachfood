import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const { cartCount, toggleCart, currency, setCurrency } = useCart();
  const { t, language, toggleLanguage, isRTL } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.shop'), path: '/shop' },
    { name: t('nav.offers'), path: '/offers' },
  ];

  const pagesLinks = [
    { name: t('nav.aboutUs'), path: '/about' },
    { name: t('nav.partnerWithUs'), path: '/partner' },
    { name: t('nav.faq'), path: '/faq' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_30px_rgba(13,74,82,0.08)]'
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to="/"
              className="group flex items-center gap-2 relative"
            >
              <img
                src="/logo.jpg"
                alt="ReachFood"
                className="h-12 sm:h-14 w-12 sm:w-14 object-cover rounded-full transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-5 py-2 text-[15px] font-medium transition-colors duration-300 ${
                    location.pathname === link.path
                      ? 'text-primary'
                      : 'text-heading hover:text-primary'
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}

              {/* Pages Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsPagesOpen(true)}
                onMouseLeave={() => setIsPagesOpen(false)}
              >
                <button className="flex items-center gap-1 px-5 py-2 text-[15px] font-medium text-heading hover:text-primary transition-colors duration-300">
                  {t('nav.pages')}
                  <span
                    className={`text-xs transition-transform duration-300 ${
                      isPagesOpen ? 'rotate-180' : ''
                    }`}
                  >
                    ▾
                  </span>
                </button>

                <div
                  className={`absolute top-full left-0 mt-1 w-48 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-300 origin-top ${
                    isPagesOpen
                      ? 'opacity-100 scale-100 translate-y-0'
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}
                >
                  <div className="py-2">
                    {pagesLinks.map((link, index) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="block px-5 py-3 text-[14px] text-heading-light hover:text-primary hover:bg-cream transition-all duration-200"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                to="/contact"
                className="px-5 py-2 text-[15px] font-medium text-heading hover:text-primary transition-colors duration-300"
              >
                {t('nav.contact')}
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="relative w-10 h-10 flex items-center justify-center text-heading-light hover:text-primary transition-all duration-300 hover:bg-cream rounded-full group"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>

              {/* Cart Button */}
              <button
                onClick={toggleCart}
                className="relative w-10 h-10 flex items-center justify-center text-heading-light hover:text-primary transition-all duration-300 hover:bg-cream rounded-full group"
                aria-label="Cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full px-1 animate-[scaleIn_0.2s_ease-out]">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-sm text-heading-light hover:text-primary transition-colors cursor-pointer rounded-full hover:bg-cream font-medium"
                aria-label="Toggle language"
              >
                {language === 'en' ? 'العربية' : 'English'}
              </button>

              {/* Currency Selector */}
              <div
                className="hidden sm:block relative"
                onMouseEnter={() => setIsCurrencyOpen(true)}
                onMouseLeave={() => setIsCurrencyOpen(false)}
              >
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-heading-light hover:text-primary transition-colors cursor-pointer rounded-full hover:bg-cream">
                  <span className="font-medium">{currency}</span>
                  <span className={`text-xs transition-transform duration-300 ${isCurrencyOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>

                <div
                  className={`absolute top-full right-0 mt-1 w-32 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-300 origin-top ${
                    isCurrencyOpen
                      ? 'opacity-100 scale-100 translate-y-0'
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}
                >
                  <div className="py-2">
                    <button
                      onClick={() => { setCurrency('USD'); setIsCurrencyOpen(false); }}
                      className={`w-full px-4 py-2 text-left text-sm transition-all duration-200 ${
                        currency === 'USD' ? 'bg-cream text-primary font-medium' : 'text-heading-light hover:bg-cream hover:text-primary'
                      }`}
                    >
                      USD ($)
                    </button>
                    <button
                      onClick={() => { setCurrency('SAR'); setIsCurrencyOpen(false); }}
                      className={`w-full px-4 py-2 text-left text-sm transition-all duration-200 ${
                        currency === 'SAR' ? 'bg-cream text-primary font-medium' : 'text-heading-light hover:bg-cream hover:text-primary'
                      }`}
                    >
                      SAR (﷼)
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-full hover:bg-cream transition-colors"
                aria-label="Menu"
              >
                <span
                  className={`w-5 h-0.5 bg-heading rounded-full transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                  }`}
                />
                <span
                  className={`w-5 h-0.5 bg-heading rounded-full transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0 scale-0' : ''
                  }`}
                />
                <span
                  className={`w-5 h-0.5 bg-heading rounded-full transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Expanded */}
        <div
          className={`absolute top-full left-0 right-0 bg-white border-t border-heading/10 transition-all duration-300 overflow-hidden ${
            isSearchOpen ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="relative">
              <input
                type="text"
                placeholder={t('nav.searchPlaceholder')}
                className="w-full px-6 py-3 bg-cream rounded-full text-heading placeholder:text-heading-light/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-heading-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-20 left-4 right-4 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-500 ${
            isMobileMenuOpen
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 -translate-y-4 scale-95'
          }`}
        >
          <div className="p-6 space-y-2">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 text-lg font-medium rounded-xl transition-all duration-300 ${
                  location.pathname === link.path
                    ? 'bg-primary text-white'
                    : 'text-heading hover:bg-cream hover:text-primary'
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-2 border-t border-heading/10">
              <p className="px-4 py-2 text-xs font-semibold text-heading-light uppercase tracking-wider">
                {t('nav.pages')}
              </p>
              {pagesLinks.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block px-4 py-2.5 text-heading-light hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <Link
              to="/contact"
              className="block px-4 py-3 text-lg font-medium text-heading hover:bg-cream hover:text-primary rounded-xl transition-all"
            >
              {t('nav.contact')}
            </Link>

            {/* Mobile Language Toggle */}
            <div className="pt-4 border-t border-heading/10">
              <p className="px-4 py-2 text-xs font-semibold text-heading-light uppercase tracking-wider">
                {language === 'en' ? 'Language' : 'اللغة'}
              </p>
              <div className="flex gap-2 px-4">
                <button
                  onClick={() => { if (language !== 'en') toggleLanguage(); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    language === 'en'
                      ? 'bg-primary text-white'
                      : 'bg-cream text-heading-light hover:text-primary'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => { if (language !== 'ar') toggleLanguage(); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    language === 'ar'
                      ? 'bg-primary text-white'
                      : 'bg-cream text-heading-light hover:text-primary'
                  }`}
                >
                  العربية
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-heading/10">
              <p className="px-4 py-2 text-xs font-semibold text-heading-light uppercase tracking-wider">
                {t('nav.currency')}
              </p>
              <div className="flex gap-2 px-4">
                <button
                  onClick={() => setCurrency('USD')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    currency === 'USD'
                      ? 'bg-primary text-white'
                      : 'bg-cream text-heading-light hover:text-primary'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setCurrency('SAR')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    currency === 'SAR'
                      ? 'bg-primary text-white'
                      : 'bg-cream text-heading-light hover:text-primary'
                  }`}
                >
                  SAR (﷼)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-20" />

      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
