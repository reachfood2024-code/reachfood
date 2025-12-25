// Analytics Service - Tracks user events and sends to backend
import { v4 as uuidv4 } from 'uuid';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

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

// Send tracking request (fire and forget)
async function track(endpoint, data) {
  try {
    await fetch(`${API_URL}/track/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId: getVisitorId(),
        sessionId: getSessionId(),
        ...data
      })
    });
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
}

// ============================================
// PUBLIC TRACKING METHODS
// ============================================

export const analytics = {
  // Initialize session (call on app load)
  async initSession() {
    const sessionId = getSessionId();
    const visitorId = getVisitorId();

    await track('session', {
      sessionId,
      visitorId,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      landingPage: window.location.pathname,
      deviceType: getDeviceType()
    });

    return { sessionId, visitorId };
  },

  // Track page view
  pageView(pagePath, pageTitle) {
    track('pageview', {
      pagePath: pagePath || window.location.pathname,
      pageTitle: pageTitle || document.title
    });
  },

  // Track add to cart
  addToCart(product, quantity = 1) {
    track('cart', {
      eventType: 'add',
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice: product.price
    });
  },

  // Track remove from cart
  removeFromCart(product, quantity = 1) {
    track('cart', {
      eventType: 'remove',
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice: product.price
    });
  },

  // Track email signup
  emailSignup(email, source = 'footer') {
    track('email', { email, source });
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
