import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const {
    cartItems,
    cartTotal,
    cartCount,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    formatPrice,
  } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-heading/10">
            <div>
              <h2 className="font-playfair text-2xl font-bold text-heading">
                Your Cart
              </h2>
              <p className="text-heading-light text-sm">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </p>
            </div>
            <button
              onClick={closeCart}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-cream transition-colors text-heading-light hover:text-heading"
              aria-label="Close cart"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl">🛒</span>
                </div>
                <h3 className="font-playfair text-xl font-semibold text-heading mb-2">
                  Your cart is empty
                </h3>
                <p className="text-heading-light mb-6">
                  Looks like you haven't added any meals yet
                </p>
                <Link
                  to="/shop"
                  onClick={closeCart}
                  className="px-8 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-colors"
                >
                  Browse Meals
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-cream rounded-2xl p-4"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-playfair font-semibold text-heading truncate">
                        {item.name}
                      </h3>
                      <p className="text-primary font-bold">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-heading-light hover:text-heading transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-medium text-heading">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-heading-light hover:text-heading transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="self-start p-1 text-heading-light hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <span className="text-xl">×</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-heading/10 p-6 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-heading-light">Subtotal</span>
                <span className="font-playfair text-2xl font-bold text-heading">
                  {formatPrice(cartTotal)}
                </span>
              </div>

              <p className="text-sm text-heading-light text-center">
                Shipping calculated at checkout
              </p>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30">
                  Checkout
                </button>
                <Link
                  to="/shop"
                  onClick={closeCart}
                  className="block w-full py-4 text-center border-2 border-heading/20 text-heading font-semibold rounded-full hover:border-heading/40 hover:bg-heading/5 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Trust Badge */}
              <p className="text-center text-xs text-heading-light mt-4">
                Secure checkout with SSL encryption
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
