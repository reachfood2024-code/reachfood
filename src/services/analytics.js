// Analytics Service - Tracks user events and sends to backend + GA4
import { v4 as uuidv4 } from 'uuid';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Track if analytics has been initialized
let isInitialized = false;
let initializationPromise = null;

// ============================================
// GA4 TRACKING HELPER
// ============================================

// Safely send events to Google Analytics 4
function trackGA4(eventName, eventParams = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventParams);
    }
  } catch (error) {
    console.warn('GA4 tracking failed:', error);
  }
}

// Get or create visitor ID (persists across sessions)
function getVisitorId() {
  let visitorId = localStorage.getItem('reachfood-visitor-id');
  if (!visitorId) {
    visitorId = uuidv4();
    localStorage.setItem('reachfood-visitor-id', visitorId);
  }
  return visitorId;
}

// Get or create session ID (expires after 30 mins of inactivity)
function getSessionId() {
  const stored = localStorage.getItem('reachfood-session');
  if (stored) {
    const { sessionId, lastActivity } = JSON.parse(stored);
    // Check if session is still valid (30 min timeout)
    if (Date.now() - lastActivity < 30 * 60 * 1000) {
      updateSessionActivity(sessionId);
      return sessionId;
    }
  }
  // Create new session
  const sessionId = uuidv4();
  localStorage.setItem('reachfood-session', JSON.stringify({
    sessionId,
    lastActivity: Date.now()
  }));
  return sessionId;
}

function updateSessionActivity(sessionId) {
  localStorage.setItem('reachfood-session', JSON.stringify({
    sessionId,
    lastActivity: Date.now()
  }));
}

// Detect device type
function getDeviceType() {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

// Send tracking request with retry logic
async function track(endpoint, data, retries = 2) {
  const payload = {
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    timestamp: new Date().toISOString(),
    ...data
  };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${API_URL}/track/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        return true;
      }

      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        console.warn(`Analytics tracking rejected (${response.status}):`, endpoint);
        return false;
      }
    } catch (error) {
      if (attempt === retries) {
        console.warn('Analytics tracking failed after retries:', endpoint, error.message);
        return false;
      }
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
  return false;
}

// ============================================
// PUBLIC TRACKING METHODS
// ============================================

export const analytics = {
  // Initialize session (call on app load) - ensures single initialization
  async initSession() {
    // Return existing promise if already initializing
    if (initializationPromise) {
      return initializationPromise;
    }

    // Skip if already initialized
    if (isInitialized) {
      return { sessionId: getSessionId(), visitorId: getVisitorId() };
    }

    initializationPromise = (async () => {
      const sessionId = getSessionId();
      const visitorId = getVisitorId();

      const success = await track('session', {
        sessionId,
        visitorId,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        landingPage: window.location.pathname,
        deviceType: getDeviceType()
      });

      if (success) {
        isInitialized = true;
      }

      return { sessionId, visitorId };
    })();

    return initializationPromise;
  },

  // Check if analytics API is reachable
  async healthCheck() {
    try {
      const response = await fetch(`${API_URL}/metrics/summary?range=1`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  // Check if analytics has been initialized
  isReady() {
    return isInitialized;
  },

  // Track page view
  pageView(pagePath, pageTitle) {
    track('pageview', {
      pagePath: pagePath || window.location.pathname,
      pageTitle: pageTitle || document.title
    });
  },

  // Track add to cart - sends to both backend and GA4
  addToCart(product, quantity = 1) {
    // Backend tracking
    track('cart', {
      eventType: 'add',
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice: product.price
    });

    // GA4 e-commerce tracking
    trackGA4('add_to_cart', {
      currency: 'USD',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: quantity
      }]
    });
  },

  // Track remove from cart - sends to both backend and GA4
  removeFromCart(product, quantity = 1) {
    // Backend tracking
    track('cart', {
      eventType: 'remove',
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice: product.price
    });

    // GA4 e-commerce tracking
    trackGA4('remove_from_cart', {
      currency: 'USD',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: quantity
      }]
    });
  },

  // Track email signup - sends to both backend and GA4
  emailSignup(email, source = 'footer') {
    // Backend tracking
    track('email', { email, source });

    // GA4 lead generation event
    trackGA4('generate_lead', {
      currency: 'USD',
      value: 0,
      lead_source: source
    });
  },

  // Track purchase/order completion - sends to GA4
  purchase(order) {
    const items = (order.items || []).map(item => ({
      item_id: item.id || item.productId,
      item_name: item.name || item.productName,
      price: item.price,
      quantity: item.quantity || 1
    }));

    trackGA4('purchase', {
      transaction_id: order.orderId || order.id,
      currency: 'USD',
      value: order.total || order.amount,
      items: items
    });
  },

  // Track begin checkout - sends to GA4
  beginCheckout(cartItems, cartTotal) {
    const items = cartItems.map(item => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity || 1
    }));

    trackGA4('begin_checkout', {
      currency: 'USD',
      value: cartTotal,
      items: items
    });
  },

  // Track product view - sends to GA4
  viewItem(product) {
    trackGA4('view_item', {
      currency: 'USD',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price
      }]
    });
  },

  // Track generic event
  event(eventType, eventData = {}) {
    track('event', {
      eventType,
      eventData,
      pagePath: window.location.pathname
    });
  },

  // Get IDs for order creation
  getIds() {
    return {
      visitorId: getVisitorId(),
      sessionId: getSessionId()
    };
  }
};

export default analytics;
