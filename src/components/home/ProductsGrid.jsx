import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { products } from '../../data/products';

export default function ProductsGrid() {
  const { addToCart, formatPrice } = useCart();
  const displayProducts = products.slice(0, 8);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <section className="py-20 lg:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-heading mb-4">
            Our Ready Meals
          </h2>
          <p className="text-heading-light text-lg max-w-2xl mx-auto">
            Discover our selection of authentic, self-heating meals ready in minutes.
            <span className="text-primary font-medium"> Get 20% off your first order!</span>
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {displayProducts.map((product, index) => (
            <div
              key={product.id}
              className="product-card group bg-white rounded-3xl p-4 relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Sale Badge */}
              {product.originalPrice && (
                <div className="absolute top-6 right-6 z-10">
                  <span className="bg-teal text-white text-xs font-bold px-3 py-1 rounded-full">
                    Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </div>
              )}

              {/* Stock Indicator */}
              <div className="absolute top-6 left-6 z-10">
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
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="px-6 py-3 bg-white text-heading font-semibold rounded-full transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>

              {/* Product Info */}
              <div className="text-center">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-playfair text-lg font-semibold text-heading hover:text-primary transition-colors mb-2">
                    {product.name}
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
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="btn-primary inline-flex items-center justify-center px-10 py-4 bg-primary text-white font-semibold text-lg rounded-full hover:bg-primary-hover shadow-lg shadow-primary/30"
          >
            View All Meals
          </Link>
        </div>
      </div>
    </section>
  );
}
