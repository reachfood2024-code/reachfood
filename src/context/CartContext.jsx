import { createContext, useContext, useState, useEffect } from 'react';
import analytics from '../services/analytics';

const CartContext = createContext();

const CURRENCIES = {
  USD: { symbol: '$', rate: 1, code: 'USD' },
  SAR: { symbol: 'SAR ', rate: 3.75, code: 'SAR' }
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('reachfood-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currency, setCurrency] = useState(() => {
    const savedCurrency = localStorage.getItem('reachfood-currency');
    return savedCurrency || 'USD';
  });

  useEffect(() => {
    localStorage.setItem('reachfood-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('reachfood-currency', currency);
  }, [currency]);

  const addToCart = (product) => {
    // Track add to cart event
    analytics.addToCart(product, 1);

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    // Track remove from cart event
    const item = cartItems.find(i => i.id === productId);
    if (item) {
      analytics.removeFromCart(item, item.quantity);
    }

    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  const formatPrice = (priceInUSD) => {
    const currencyData = CURRENCIES[currency];
    const convertedPrice = priceInUSD * currencyData.rate;
    return `${currencyData.symbol}${convertedPrice.toFixed(2)}`;
  };

  const currentCurrency = CURRENCIES[currency];

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
        currency,
        setCurrency,
        formatPrice,
        currentCurrency,
        currencies: CURRENCIES
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
