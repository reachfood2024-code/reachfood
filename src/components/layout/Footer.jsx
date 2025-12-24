import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: 'All Meals', path: '/shop' },
      { name: 'Asian Cuisine', path: '/shop?category=asian' },
      { name: 'Indian Flavors', path: '/shop?category=indian' },
      { name: 'Mediterranean', path: '/shop?category=mediterranean' },
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Our Story', path: '/story' },
      { name: 'Sustainability', path: '/sustainability' },
      { name: 'Careers', path: '/careers' },
    ],
    support: [
      { name: 'FAQ', path: '/faq' },
      { name: 'Shipping', path: '/shipping' },
      { name: 'Returns', path: '/returns' },
      { name: 'Contact', path: '/contact' },
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
              Self-heating ready meals that bring authentic flavors from around the world to your table in just 3-5 minutes. Sustainable, delicious, convenient.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md text-heading-light hover:text-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                aria-label="Facebook"
              >
                <span className="text-sm font-bold">f</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md text-heading-light hover:text-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                aria-label="Twitter"
              >
                <span className="text-sm font-bold">𝕏</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md text-heading-light hover:text-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                aria-label="Instagram"
              >
                <span className="text-sm font-bold">in</span>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-playfair text-lg font-semibold text-heading mb-4">
              Shop
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
              Company
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
              Support
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
              Get Fresh Updates
            </h3>
            <p className="text-heading-light mb-6">
              Subscribe for exclusive offers and new meal releases
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3.5 bg-white rounded-full text-heading placeholder:text-heading-light/60 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm transition-all"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-heading-light">
          <p>© {currentYear} ReachFood. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
