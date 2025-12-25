import { Router } from 'express';
import { query } from '../database/db.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Helper: Ensure session exists in database
async function ensureSession(sessionId, visitorId, req) {
  if (!sessionId) return null;

  const existing = await query(
    'SELECT session_id FROM sessions WHERE session_id = $1',
    [sessionId]
  );

  if (existing.rows.length > 0) {
    return sessionId;
  }

  // Auto-create session - get first IP from x-forwarded-for (may contain multiple)
  const forwardedFor = req.headers['x-forwarded-for'];
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : req.socket?.remoteAddress;
  await query(
    `INSERT INTO sessions (session_id, visitor_id, ip_address, landing_page)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (session_id) DO NOTHING`,
    [sessionId, visitorId, ip || null, '/']
  );

  return sessionId;
}

// ============================================
// POST /api/v1/track/session - Start/update session
// ============================================
router.post('/session', async (req, res, next) => {
  try {
    const {
      visitorId,
      sessionId,
      userAgent,
      referrer,
      landingPage,
      deviceType
    } = req.body;

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const newSessionId = sessionId || uuidv4();

    // Check if session exists
    const existing = await query(
      'SELECT id FROM sessions WHERE session_id = $1',
      [sessionId]
    );

    if (existing.rows.length > 0) {
      // Update existing session
      await query(
        'UPDATE sessions SET page_count = page_count + 1 WHERE session_id = $1',
        [sessionId]
      );
      return res.json({ data: { sessionId, status: 'updated' } });
    }

    // Create new session
    await query(
      `INSERT INTO sessions (session_id, visitor_id, user_agent, ip_address, referrer, landing_page, device_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [newSessionId, visitorId, userAgent, ip, referrer, landingPage, deviceType]
    );

    res.status(201).json({ data: { sessionId: newSessionId, status: 'created' } });
  } catch (error) {
    next(error);
  }
});

// ============================================
// POST /api/v1/track/pageview - Track page view
// ============================================
router.post('/pageview', async (req, res, next) => {
  try {
    const { sessionId, visitorId, pagePath, pageTitle, duration, scrollDepth } = req.body;

    // Ensure session exists before inserting page view
    const validSessionId = await ensureSession(sessionId, visitorId, req);

    await query(
      `INSERT INTO page_views (session_id, page_path, page_title, duration_seconds, scroll_depth)
       VALUES ($1, $2, $3, $4, $5)`,
      [validSessionId, pagePath, pageTitle, duration, scrollDepth]
    );

    res.status(201).json({ data: { status: 'tracked' } });
  } catch (error) {
    next(error);
  }
});

// ============================================
// POST /api/v1/track/event - Track generic event
// ============================================
router.post('/event', async (req, res, next) => {
  try {
    const { sessionId, visitorId, eventType, eventData, pagePath } = req.body;

    // Ensure session exists before inserting event
    const validSessionId = await ensureSession(sessionId, visitorId, req);

    await query(
      `INSERT INTO events (session_id, visitor_id, event_type, event_data, page_path)
       VALUES ($1, $2, $3, $4, $5)`,
      [validSessionId, visitorId, eventType, JSON.stringify(eventData || {}), pagePath]
    );

    res.status(201).json({ data: { status: 'tracked' } });
  } catch (error) {
    next(error);
  }
});

// ============================================
// POST /api/v1/track/cart - Track cart events
// ============================================
router.post('/cart', async (req, res, next) => {
  try {
    const {
      sessionId,
      visitorId,
      eventType, // 'add', 'remove', 'update_quantity'
      productId,
      productName,
      quantity,
      unitPrice
    } = req.body;

    // Ensure session exists before inserting cart event
    const validSessionId = await ensureSession(sessionId, visitorId, req);

    await query(
      `INSERT INTO cart_events (session_id, visitor_id, event_type, product_id, product_name, quantity, unit_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [validSessionId, visitorId, eventType, productId, productName, quantity, unitPrice]
    );

    res.status(201).json({ data: { status: 'tracked' } });
  } catch (error) {
    next(error);
  }
});

// ============================================
// POST /api/v1/track/email - Track email signup
// ============================================
router.post('/email', async (req, res, next) => {
  try {
    const { email, source, visitorId, sessionId } = req.body;

    // Ensure session exists before inserting email subscription
    const validSessionId = await ensureSession(sessionId, visitorId, req);

    // Create hash for privacy
    const emailHash = email.substring(0, 1) + '***' + email.substring(email.indexOf('@') - 1);

    await query(
      `INSERT INTO email_subscriptions (email, email_hash, source, visitor_id, session_id)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) WHERE is_active = TRUE DO NOTHING`,
      [email, emailHash, source || 'other', visitorId, validSessionId]
    );

    res.status(201).json({ data: { status: 'subscribed' } });
  } catch (error) {
    next(error);
  }
});

export default router;
