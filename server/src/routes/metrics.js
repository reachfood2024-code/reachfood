import { Router } from 'express';
import { query } from '../database/db.js';

const router = Router();

// ============================================
// GET /api/v1/metrics/summary - Dashboard KPIs
// ============================================
router.get('/summary', async (req, res, next) => {
  try {
    const { range = '30' } = req.query;
    const days = parseInt(range);

    // Current period metrics
    const currentPeriod = await query(`
      SELECT
        (SELECT COUNT(DISTINCT visitor_id) FROM sessions WHERE started_at >= NOW() - INTERVAL '${days} days') as total_users,
        (SELECT COUNT(*) FROM cart_events WHERE event_type = 'add' AND created_at >= NOW() - INTERVAL '${days} days') as add_to_cart_events,
        (SELECT COUNT(*) FROM email_subscriptions WHERE subscribed_at >= NOW() - INTERVAL '${days} days') as email_submissions,
        (SELECT COUNT(*) FROM orders WHERE ordered_at >= NOW() - INTERVAL '${days} days' AND status NOT IN ('cancelled', 'refunded')) as completed_orders,
        (SELECT COALESCE(SUM(total), 0) FROM orders WHERE ordered_at >= NOW() - INTERVAL '${days} days' AND status NOT IN ('cancelled', 'refunded')) as revenue
    `);

    // Previous period for comparison
    const previousPeriod = await query(`
      SELECT
        (SELECT COUNT(DISTINCT visitor_id) FROM sessions WHERE started_at >= NOW() - INTERVAL '${days * 2} days' AND started_at < NOW() - INTERVAL '${days} days') as total_users,
        (SELECT COUNT(*) FROM cart_events WHERE event_type = 'add' AND created_at >= NOW() - INTERVAL '${days * 2} days' AND created_at < NOW() - INTERVAL '${days} days') as add_to_cart_events,
        (SELECT COUNT(*) FROM email_subscriptions WHERE subscribed_at >= NOW() - INTERVAL '${days * 2} days' AND subscribed_at < NOW() - INTERVAL '${days} days') as email_submissions,
        (SELECT COUNT(*) FROM orders WHERE ordered_at >= NOW() - INTERVAL '${days * 2} days' AND ordered_at < NOW() - INTERVAL '${days} days' AND status NOT IN ('cancelled', 'refunded')) as completed_orders,
        (SELECT COALESCE(SUM(total), 0) FROM orders WHERE ordered_at >= NOW() - INTERVAL '${days * 2} days' AND ordered_at < NOW() - INTERVAL '${days} days' AND status NOT IN ('cancelled', 'refunded')) as revenue
    `);

    const current = currentPeriod.rows[0];
    const previous = previousPeriod.rows[0];

    // Calculate percentage changes
    const calcChange = (curr, prev) => {
      if (prev == 0) return curr > 0 ? 100 : 0;
      return Number((((curr - prev) / prev) * 100).toFixed(1));
    };

    // Conversion rate
    const totalVisitors = parseInt(current.total_users) || 1;
    const conversionRate = ((parseInt(current.completed_orders) / totalVisitors) * 100).toFixed(1);

    const prevVisitors = parseInt(previous.total_users) || 1;
    const prevConversionRate = ((parseInt(previous.completed_orders) / prevVisitors) * 100).toFixed(1);

    res.json({
      data: {
        metrics: {
          totalUsers: {
            label: 'Total Users',
            value: parseInt(current.total_users),
            change: calcChange(current.total_users, previous.total_users),
            trend: current.total_users >= previous.total_users ? 'up' : 'down',
            period: `vs previous ${days} days`
          },
          addToCartEvents: {
            label: 'Add to Cart',
            value: parseInt(current.add_to_cart_events),
            change: calcChange(current.add_to_cart_events, previous.add_to_cart_events),
            trend: current.add_to_cart_events >= previous.add_to_cart_events ? 'up' : 'down',
            period: `vs previous ${days} days`
          },
          emailSubmissions: {
            label: 'Email Signups',
            value: parseInt(current.email_submissions),
            change: calcChange(current.email_submissions, previous.email_submissions),
            trend: current.email_submissions >= previous.email_submissions ? 'up' : 'down',
            period: `vs previous ${days} days`
          },
          completedOrders: {
            label: 'Orders',
            value: parseInt(current.completed_orders),
            change: calcChange(current.completed_orders, previous.completed_orders),
            trend: current.completed_orders >= previous.completed_orders ? 'up' : 'down',
            period: `vs previous ${days} days`
          },
          revenue: {
            label: 'Revenue',
            value: parseFloat(current.revenue),
            change: calcChange(current.revenue, previous.revenue),
            trend: current.revenue >= previous.revenue ? 'up' : 'down',
            period: `vs previous ${days} days`,
            prefix: '$'
          },
          conversionRate: {
            label: 'Conversion',
            value: parseFloat(conversionRate),
            change: (conversionRate - prevConversionRate).toFixed(1),
            trend: conversionRate >= prevConversionRate ? 'up' : 'down',
            period: `vs previous ${days} days`,
            suffix: '%'
          }
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// GET /api/v1/metrics/trends - Time series data
// ============================================
router.get('/trends', async (req, res, next) => {
  try {
    const { range = '30' } = req.query;
    const days = parseInt(range);

    // User behavior trend
    const userBehavior = await query(`
      SELECT
        DATE(started_at) as date,
        COUNT(*) as page_views,
        COUNT(DISTINCT visitor_id) as unique_visitors
      FROM sessions
      WHERE started_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(started_at)
      ORDER BY date ASC
    `);

    // Orders trend
    const ordersTrend = await query(`
      SELECT
        DATE(ordered_at) as date,
        COUNT(*) as orders,
        COALESCE(SUM(total), 0) as revenue
      FROM orders
      WHERE ordered_at >= NOW() - INTERVAL '${days} days'
        AND status NOT IN ('cancelled', 'refunded')
      GROUP BY DATE(ordered_at)
      ORDER BY date ASC
    `);

    // Add to cart trend
    const cartTrend = await query(`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as value
      FROM cart_events
      WHERE event_type = 'add'
        AND created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // Email signups trend
    const emailTrend = await query(`
      SELECT
        DATE(subscribed_at) as date,
        COUNT(*) as value
      FROM email_subscriptions
      WHERE subscribed_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(subscribed_at)
      ORDER BY date ASC
    `);

    res.json({
      data: {
        userBehaviorTrend: userBehavior.rows.map(r => ({
          date: r.date,
          pageViews: parseInt(r.page_views),
          uniqueVisitors: parseInt(r.unique_visitors)
        })),
        ordersTrend: ordersTrend.rows.map(r => ({
          date: r.date,
          orders: parseInt(r.orders),
          revenue: parseFloat(r.revenue)
        })),
        addToCartTrend: cartTrend.rows.map(r => ({
          date: r.date,
          value: parseInt(r.value)
        })),
        emailSubmissionsTrend: emailTrend.rows.map(r => ({
          date: r.date,
          value: parseInt(r.value)
        }))
      }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// GET /api/v1/metrics/products - Product performance
// ============================================
router.get('/products', async (req, res, next) => {
  try {
    const { range = '30' } = req.query;
    const days = parseInt(range);

    const products = await query(`
      SELECT
        oi.product_name as name,
        SUM(oi.quantity) as orders,
        SUM(oi.total_price) as revenue
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE o.ordered_at >= NOW() - INTERVAL '${days} days'
        AND o.status NOT IN ('cancelled', 'refunded')
      GROUP BY oi.product_name
      ORDER BY orders DESC
      LIMIT 10
    `);

    res.json({
      data: {
        ordersByProduct: products.rows.map(r => ({
          name: r.name,
          orders: parseInt(r.orders),
          revenue: parseFloat(r.revenue)
        }))
      }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// GET /api/v1/metrics/traffic - Traffic sources
// ============================================
router.get('/traffic', async (req, res, next) => {
  try {
    const { range = '30' } = req.query;
    const days = parseInt(range);

    const traffic = await query(`
      SELECT
        CASE
          WHEN referrer IS NULL OR referrer = '' THEN 'Direct'
          WHEN referrer LIKE '%google%' THEN 'Organic Search'
          WHEN referrer LIKE '%facebook%' OR referrer LIKE '%instagram%' OR referrer LIKE '%twitter%' THEN 'Social Media'
          ELSE 'Referral'
        END as source,
        COUNT(*) as visits
      FROM sessions
      WHERE started_at >= NOW() - INTERVAL '${days} days'
      GROUP BY source
      ORDER BY visits DESC
    `);

    const total = traffic.rows.reduce((sum, r) => sum + parseInt(r.visits), 0);

    res.json({
      data: {
        trafficSources: traffic.rows.map(r => ({
          source: r.source,
          visits: parseInt(r.visits),
          percentage: ((parseInt(r.visits) / total) * 100).toFixed(1)
        }))
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
