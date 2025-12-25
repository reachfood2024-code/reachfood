-- ReachFood Analytics Database Schema
-- PostgreSQL 14+

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- HELPER FUNCTION: Auto-update timestamps
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SESSIONS: Track unique visitor sessions
-- ============================================
CREATE TABLE sessions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  visitor_id UUID NOT NULL,  -- Persistent visitor ID from localStorage
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  landing_page TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  page_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_visitor ON sessions(visitor_id);
CREATE INDEX idx_sessions_started ON sessions(started_at DESC);
CREATE INDEX idx_sessions_date ON sessions(DATE(started_at));

-- ============================================
-- PAGE VIEWS: Individual page visits
-- ============================================
CREATE TABLE page_views (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
  page_path TEXT NOT NULL,
  page_title TEXT,
  duration_seconds INTEGER,  -- Time spent on page
  scroll_depth INTEGER CHECK (scroll_depth >= 0 AND scroll_depth <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_page_views_session ON page_views(session_id);
CREATE INDEX idx_page_views_path ON page_views(page_path);
CREATE INDEX idx_page_views_date ON page_views(DATE(created_at));

-- ============================================
-- EVENTS: Generic event tracking table
-- ============================================
CREATE TABLE events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id UUID REFERENCES sessions(session_id) ON DELETE SET NULL,
  visitor_id UUID NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'page_view',
    'add_to_cart',
    'remove_from_cart',
    'checkout_start',
    'order_complete',
    'email_signup',
    'product_view',
    'search',
    'filter_use'
  )),
  event_data JSONB DEFAULT '{}',  -- Flexible data storage
  page_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_visitor ON events(visitor_id);
CREATE INDEX idx_events_session ON events(session_id);
CREATE INDEX idx_events_date ON events(DATE(created_at));
CREATE INDEX idx_events_type_date ON events(event_type, DATE(created_at));
CREATE INDEX idx_events_data ON events USING GIN(event_data);

-- ============================================
-- EMAIL SUBSCRIPTIONS: Newsletter signups
-- ============================================
CREATE TABLE email_subscriptions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL,
  email_hash TEXT NOT NULL UNIQUE,  -- For privacy in dashboard display
  source TEXT NOT NULL CHECK (source IN ('homepage', 'footer', 'checkout', 'popup', 'other')),
  visitor_id UUID,
  session_id UUID REFERENCES sessions(session_id) ON DELETE SET NULL,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_email_subs_email ON email_subscriptions(email) WHERE is_active = TRUE;
CREATE INDEX idx_email_subs_date ON email_subscriptions(DATE(subscribed_at));

CREATE TRIGGER set_email_subs_updated
  BEFORE UPDATE ON email_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ORDERS: Completed purchases
-- ============================================
CREATE TABLE orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,  -- Human-readable: ORD-001234
  session_id UUID REFERENCES sessions(session_id) ON DELETE SET NULL,
  visitor_id UUID,

  -- Customer info
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,

  -- Shipping
  shipping_address JSONB NOT NULL,
  shipping_method TEXT,

  -- Financials
  subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  shipping_cost NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
  tax NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (tax >= 0),
  discount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  currency TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'SAR')),

  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
  )),

  -- Timestamps
  ordered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(DATE(ordered_at));
CREATE INDEX idx_orders_visitor ON orders(visitor_id);

CREATE TRIGGER set_orders_updated
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ORDER ITEMS: Products in each order
-- ============================================
CREATE TABLE order_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,  -- Matches frontend product ID
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- ============================================
-- CART EVENTS: Add/remove cart tracking
-- ============================================
CREATE TABLE cart_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id UUID REFERENCES sessions(session_id) ON DELETE SET NULL,
  visitor_id UUID NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('add', 'remove', 'update_quantity')),
  product_id TEXT NOT NULL,
  product_name TEXT,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cart_events_visitor ON cart_events(visitor_id);
CREATE INDEX idx_cart_events_product ON cart_events(product_id);
CREATE INDEX idx_cart_events_date ON cart_events(DATE(created_at));
CREATE INDEX idx_cart_events_type_date ON cart_events(event_type, DATE(created_at));

-- ============================================
-- DAILY METRICS: Pre-aggregated daily stats
-- ============================================
CREATE TABLE daily_metrics (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  date DATE NOT NULL UNIQUE,

  -- Traffic
  total_sessions INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  total_page_views INTEGER NOT NULL DEFAULT 0,

  -- Engagement
  add_to_cart_events INTEGER NOT NULL DEFAULT 0,
  email_signups INTEGER NOT NULL DEFAULT 0,

  -- Sales
  total_orders INTEGER NOT NULL DEFAULT 0,
  completed_orders INTEGER NOT NULL DEFAULT 0,
  total_revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
  average_order_value NUMERIC(10,2),

  -- Conversion
  cart_conversion_rate NUMERIC(5,2),  -- Carts that became orders
  visitor_conversion_rate NUMERIC(5,2),  -- Visitors that ordered

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_daily_metrics_date ON daily_metrics(date DESC);

CREATE TRIGGER set_daily_metrics_updated
  BEFORE UPDATE ON daily_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VIEWS: Useful query shortcuts
-- ============================================

-- Today's live metrics
CREATE OR REPLACE VIEW v_today_metrics AS
SELECT
  COUNT(DISTINCT s.session_id) as sessions,
  COUNT(DISTINCT s.visitor_id) as unique_visitors,
  (SELECT COUNT(*) FROM page_views WHERE DATE(created_at) = CURRENT_DATE) as page_views,
  (SELECT COUNT(*) FROM cart_events WHERE event_type = 'add' AND DATE(created_at) = CURRENT_DATE) as add_to_carts,
  (SELECT COUNT(*) FROM email_subscriptions WHERE DATE(subscribed_at) = CURRENT_DATE) as email_signups,
  (SELECT COUNT(*) FROM orders WHERE DATE(ordered_at) = CURRENT_DATE) as orders,
  (SELECT COALESCE(SUM(total), 0) FROM orders WHERE DATE(ordered_at) = CURRENT_DATE AND status != 'cancelled') as revenue
FROM sessions s
WHERE DATE(s.started_at) = CURRENT_DATE;

-- Last 30 days trend
CREATE OR REPLACE VIEW v_30day_trend AS
SELECT
  date,
  total_sessions,
  unique_visitors,
  total_page_views,
  add_to_cart_events,
  email_signups,
  completed_orders,
  total_revenue
FROM daily_metrics
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY date ASC;

-- ============================================
-- FUNCTION: Generate order number
-- ============================================
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  order_count INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO order_count FROM orders;
  new_number := 'ORD-' || LPAD(order_count::TEXT, 6, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION: Aggregate daily metrics (run via cron)
-- ============================================
CREATE OR REPLACE FUNCTION aggregate_daily_metrics(target_date DATE DEFAULT CURRENT_DATE - INTERVAL '1 day')
RETURNS VOID AS $$
BEGIN
  INSERT INTO daily_metrics (
    date,
    total_sessions,
    unique_visitors,
    total_page_views,
    add_to_cart_events,
    email_signups,
    total_orders,
    completed_orders,
    total_revenue,
    average_order_value
  )
  SELECT
    target_date,
    (SELECT COUNT(*) FROM sessions WHERE DATE(started_at) = target_date),
    (SELECT COUNT(DISTINCT visitor_id) FROM sessions WHERE DATE(started_at) = target_date),
    (SELECT COUNT(*) FROM page_views WHERE DATE(created_at) = target_date),
    (SELECT COUNT(*) FROM cart_events WHERE event_type = 'add' AND DATE(created_at) = target_date),
    (SELECT COUNT(*) FROM email_subscriptions WHERE DATE(subscribed_at) = target_date),
    (SELECT COUNT(*) FROM orders WHERE DATE(ordered_at) = target_date),
    (SELECT COUNT(*) FROM orders WHERE DATE(ordered_at) = target_date AND status NOT IN ('cancelled', 'refunded')),
    (SELECT COALESCE(SUM(total), 0) FROM orders WHERE DATE(ordered_at) = target_date AND status NOT IN ('cancelled', 'refunded')),
    (SELECT AVG(total) FROM orders WHERE DATE(ordered_at) = target_date AND status NOT IN ('cancelled', 'refunded'))
  ON CONFLICT (date) DO UPDATE SET
    total_sessions = EXCLUDED.total_sessions,
    unique_visitors = EXCLUDED.unique_visitors,
    total_page_views = EXCLUDED.total_page_views,
    add_to_cart_events = EXCLUDED.add_to_cart_events,
    email_signups = EXCLUDED.email_signups,
    total_orders = EXCLUDED.total_orders,
    completed_orders = EXCLUDED.completed_orders,
    total_revenue = EXCLUDED.total_revenue,
    average_order_value = EXCLUDED.average_order_value,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
