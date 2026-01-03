import { Router } from 'express';
import { query } from '../database/db.js';

const router = Router();

// ============================================
// GET /api/v1/subscriptions - List all subscriptions
// ============================================
router.get('/', async (req, res, next) => {
  try {
    const { limit = 50, offset = 0, status } = req.query;

    let whereClause = '';
    const params = [parseInt(limit), parseInt(offset)];

    if (status && status !== 'all') {
      whereClause = 'WHERE status = $3';
      params.push(status);
    }

    const subscriptions = await query(`
      SELECT
        subscription_number as id,
        customer_name as name,
        customer_phone as phone,
        customer_email as email,
        plan_id,
        plan_name,
        meals_per_day,
        total_meals,
        subscription_days,
        price_usd,
        price_sar,
        currency,
        status,
        admin_notes,
        DATE(submitted_at) as date,
        submitted_at
      FROM subscriptions
      ${whereClause}
      ORDER BY submitted_at DESC
      LIMIT $1 OFFSET $2
    `, params);

    // Get count by status
    const stats = await query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'contacted') as contacted,
        COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed,
        COUNT(*) FILTER (WHERE status = 'active') as active,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
        COUNT(*) as total
      FROM subscriptions
    `);

    res.json({
      data: {
        subscriptions: subscriptions.rows.map(sub => ({
          ...sub,
          price_usd: parseFloat(sub.price_usd),
          price_sar: parseFloat(sub.price_sar)
        })),
        stats: stats.rows[0]
      }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// POST /api/v1/subscriptions - Create new subscription
// ============================================
router.post('/', async (req, res, next) => {
  try {
    const {
      name,
      phone,
      email,
      planId,
      planName,
      mealsPerDay,
      totalMeals,
      priceUSD,
      priceSAR,
      currency = 'USD',
      subscriptionDays = 26
    } = req.body;

    // Validate required fields
    if (!name || !phone || !email || !planId) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name, phone, email, and planId are required'
        }
      });
    }

    // Generate subscription number
    const subNumResult = await query('SELECT generate_subscription_number() as subscription_number');
    const subscriptionNumber = subNumResult.rows[0].subscription_number;

    // Insert subscription
    const result = await query(`
      INSERT INTO subscriptions (
        subscription_number,
        customer_name, customer_phone, customer_email,
        plan_id, plan_name, meals_per_day, total_meals, subscription_days,
        price_usd, price_sar, currency
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING subscription_number, status
    `, [
      subscriptionNumber,
      name, phone, email,
      planId, planName || planId, mealsPerDay || 1, totalMeals || 26, subscriptionDays,
      priceUSD || 0, priceSAR || 0, currency
    ]);

    res.status(201).json({
      data: {
        subscriptionNumber: result.rows[0].subscription_number,
        status: 'created'
      }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// GET /api/v1/subscriptions/:subscriptionNumber - Get subscription details
// ============================================
router.get('/:subscriptionNumber', async (req, res, next) => {
  try {
    const { subscriptionNumber } = req.params;

    const subscription = await query(`
      SELECT * FROM subscriptions WHERE subscription_number = $1
    `, [subscriptionNumber]);

    if (subscription.rows.length === 0) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Subscription not found' }
      });
    }

    res.json({ data: { subscription: subscription.rows[0] } });
  } catch (error) {
    next(error);
  }
});

// ============================================
// PATCH /api/v1/subscriptions/:subscriptionNumber/status - Update subscription status
// ============================================
router.patch('/:subscriptionNumber/status', async (req, res, next) => {
  try {
    const { subscriptionNumber } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = ['pending', 'contacted', 'confirmed', 'active', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: { code: 'INVALID_STATUS', message: 'Invalid subscription status' }
      });
    }

    // Build update query dynamically
    let updateFields = ['status = $1', 'updated_at = NOW()'];
    let params = [status];
    let paramIndex = 2;

    // Set timestamp based on status
    if (status === 'contacted') {
      updateFields.push('contacted_at = NOW()');
    } else if (status === 'confirmed') {
      updateFields.push('confirmed_at = NOW()');
    }

    // Add admin notes if provided
    if (adminNotes !== undefined) {
      updateFields.push(`admin_notes = $${paramIndex}`);
      params.push(adminNotes);
      paramIndex++;
    }

    params.push(subscriptionNumber);

    const result = await query(`
      UPDATE subscriptions SET ${updateFields.join(', ')}
      WHERE subscription_number = $${paramIndex}
      RETURNING subscription_number, status, admin_notes
    `, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Subscription not found' }
      });
    }

    res.json({ data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
