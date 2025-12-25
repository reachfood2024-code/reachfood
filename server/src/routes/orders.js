import { Router } from 'express';
import { query } from '../database/db.js';

const router = Router();

// ============================================
// GET /api/v1/orders - List recent orders
// ============================================
router.get('/', async (req, res, next) => {
  try {
    const { limit = 10, offset = 0, status } = req.query;

    let whereClause = '';
    const params = [parseInt(limit), parseInt(offset)];

    if (status) {
      whereClause = 'WHERE status = $3';
      params.push(status);
    }

    const orders = await query(`
      SELECT
        order_number as id,
        customer_name as customer,
        total as amount,
        status,
        DATE(ordered_at) as date,
        currency
      FROM orders
      ${whereClause}
      ORDER BY ordered_at DESC
      LIMIT $1 OFFSET $2
    `, params);

    // Get product for each order
    const ordersWithProducts = await Promise.all(
      orders.rows.map(async (order) => {
        const items = await query(
          'SELECT product_name FROM order_items WHERE order_id = (SELECT id FROM orders WHERE order_number = $1) LIMIT 1',
          [order.id]
        );
        return {
          ...order,
          product: items.rows[0]?.product_name || 'Multiple items',
          amount: parseFloat(order.amount)
        };
      })
    );

    res.json({ data: { recentOrders: ordersWithProducts } });
  } catch (error) {
    next(error);
  }
});

// ============================================
// POST /api/v1/orders - Create new order
// ============================================
router.post('/', async (req, res, next) => {
  try {
    const {
      sessionId,
      visitorId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      shippingCost = 0,
      tax = 0,
      discount = 0,
      total,
      currency = 'USD'
    } = req.body;

    // Generate order number
    const orderNumResult = await query('SELECT generate_order_number() as order_number');
    const orderNumber = orderNumResult.rows[0].order_number;

    // Insert order
    const orderResult = await query(`
      INSERT INTO orders (
        order_number, session_id, visitor_id,
        customer_name, customer_email, customer_phone,
        shipping_address, subtotal, shipping_cost, tax, discount, total, currency
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id, order_number
    `, [
      orderNumber, sessionId, visitorId,
      customerName, customerEmail, customerPhone,
      JSON.stringify(shippingAddress), subtotal, shippingCost, tax, discount, total, currency
    ]);

    const orderId = orderResult.rows[0].id;

    // Insert order items
    for (const item of items) {
      await query(`
        INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [orderId, item.productId, item.productName, item.quantity, item.unitPrice, item.totalPrice]);
    }

    // Track order complete event
    await query(`
      INSERT INTO events (session_id, visitor_id, event_type, event_data, page_path)
      VALUES ($1, $2, 'order_complete', $3, '/checkout')
    `, [sessionId, visitorId, JSON.stringify({ orderNumber, total, itemCount: items.length })]);

    res.status(201).json({
      data: {
        orderNumber,
        status: 'created'
      }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// GET /api/v1/orders/:orderNumber - Get order details
// ============================================
router.get('/:orderNumber', async (req, res, next) => {
  try {
    const { orderNumber } = req.params;

    const order = await query(`
      SELECT * FROM orders WHERE order_number = $1
    `, [orderNumber]);

    if (order.rows.length === 0) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Order not found' } });
    }

    const items = await query(`
      SELECT * FROM order_items WHERE order_id = $1
    `, [order.rows[0].id]);

    res.json({
      data: {
        order: order.rows[0],
        items: items.rows
      }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// PATCH /api/v1/orders/:orderNumber/status - Update order status
// ============================================
router.patch('/:orderNumber/status', async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: { code: 'INVALID_STATUS', message: 'Invalid order status' } });
    }

    const result = await query(`
      UPDATE orders SET status = $1, updated_at = NOW()
      WHERE order_number = $2
      RETURNING order_number, status
    `, [status, orderNumber]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Order not found' } });
    }

    res.json({ data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
