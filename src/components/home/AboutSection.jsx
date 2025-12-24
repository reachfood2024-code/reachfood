import { Link } from 'react-router-dom';

export default function AboutSection() {
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
          <div className="text-center lg:text-left bg-white/90 backdrop-blur-sm rounded-3xl p-8 lg:p-12">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-heading mb-4">
              About Us
            </h2>
            <p className="text-primary font-medium mb-6">Why choose us</p>

            <p className="text-heading-light text-lg leading-relaxed mb-8">
              At ReachFood, we believe everyone deserves access to delicious, authentic meals
              regardless of where they are. Our innovative self-heating technology brings
              restaurant-quality dishes to your table in minutes, without the need for
              microwaves, stoves, or electricity.
            </p>

            {/* Features */}
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <span className="text-primary text-xl font-bold">*</span>
                </div>
                <div className="text-left">
                  <h3 className="font-playfair text-xl font-semibold text-heading mb-1">
                    Culturally Authentic
                  </h3>
                  <p className="text-heading-light">
                    Recipes developed with chefs from around the world to bring you
                    genuine flavors and traditional cooking methods.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center">
                  <span className="text-teal text-xl font-bold">*</span>
                </div>
                <div className="text-left">
                  <h3 className="font-playfair text-xl font-semibold text-heading mb-1">
                    Sustainable Packaging
                  </h3>
                  <p className="text-heading-light">
                    Our eco-friendly packaging is 100% recyclable, reducing environmental
                    impact while keeping your meal perfectly heated.
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
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
