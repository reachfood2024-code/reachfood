import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { products, categories } from '../../data/products';

export default function FeaturesSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { addToCart, formatPrice } = useCart();

  const features = [
    {
      title: 'Quality Ingredients',
      description:
        'Premium ingredients sourced from trusted suppliers, ensuring every meal is packed with nutrition and flavor.',
    },
    {
      title: 'Ready in 3-5 Minutes',
      description:
        'Our innovative self-heating technology delivers hot, delicious meals anywhere, no microwave needed.',
    },
    {
      title: 'Fast Delivery',
      description:
        'Free shipping on orders over $50. Get your favorite meals delivered fresh to your doorstep.',
    },
  ];

  const filteredProducts =
    activeCategory === 'all'
      ? products.slice(0, 4)
      : products.filter((p) => p.category === activeCategory).slice(0, 4);

  const displayCategories = categories.slice(0, 4);

  return (
    <section className="py-20 lg:py-28 overflow-hidden">
      {/* Features Banner */}
      <div className="bg-cream-dark py-16 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-heading mb-3">
              Our Promise
            </h2>
            <p className="text-heading-light">
              Get 40% off your first order{' '}
              <span className="text-primary font-medium underline cursor-pointer">
                Learn more
              </span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <span className="text-primary text-2xl font-bold">
                    {index === 0 ? '★' : index === 1 ? '◆' : '→'}
                  </span>
                </div>
                <h3 className="font-playfair text-xl font-semibold text-heading mb-3">
                  {feature.title}
                </h3>
                <p className="text-heading-light leading-relaxed max-w-sm mx-auto">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Famous Items Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left - Category Filter */}
          <div className="lg:col-span-4">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-heading mb-8">
              Famous Items
            </h2>

            <div className="space-y-3">
              {displayCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full text-left px-6 py-4 rounded-full font-medium transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-teal text-white shadow-lg'
                      : 'bg-white text-heading hover:bg-cream border border-heading/10'
                  }`}
                >
                  <span className="mr-2">
                    {activeCategory === category.id ? '●' : '○'}
                  </span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right - Product Grid */}
          <div className="lg:col-span-8">
            <div className="grid sm:grid-cols-2 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Product Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="font-playfair text-xl font-semibold text-white mb-1">
                          {product.name}
                        </h3>
                        <p className="text-primary font-bold text-lg">
                          {formatPrice(product.price)}
                        </p>
                      </div>

                      {/* Add to Cart - Hover */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product);
                        }}
                        className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-heading opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-white shadow-lg"
                      >
                        +
                      </button>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* View More */}
            <div className="mt-8 text-center lg:text-right">
              <Link
                to="/shop"
                className="inline-flex items-center text-heading font-semibold hover:text-primary transition-colors group"
              >
                View All {activeCategory !== 'all' ? categories.find(c => c.id === activeCategory)?.name : 'Meals'}
                <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
