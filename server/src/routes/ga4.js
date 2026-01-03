// GA4 Analytics Routes
// Provides endpoints for fetching Google Analytics 4 data

import { Router } from 'express';
import {
  checkConnection,
  getRealtimeUsers,
  getOverviewMetrics,
  getEcommerceMetrics,
  getTrafficSources,
  getTopPages,
  getUserTrends,
  getDeviceBreakdown,
  getCountryBreakdown,
} from '../services/ga4.js';

const router = Router();

// Helper to convert range days to GA4 date format
const rangeToDateRange = (range) => {
  const days = parseInt(range) || 30;
  return {
    startDate: `${days}daysAgo`,
    endDate: 'today',
  };
};

// ============================================
// GET /api/v1/ga4/status - Check GA4 connection
// ============================================
router.get('/status', async (req, res, next) => {
  try {
    const status = await checkConnection();
    res.json({ data: status });
  } catch (error) {
    next(error);
  }
});

// ============================================
// GET /api/v1/ga4/realtime - Real-time active users
// ============================================
router.get('/realtime', async (req, res, next) => {
  try {
    const data = await getRealtimeUsers();
    res.json({ data });
  } catch (error) {
    if (error.message.includes('not configured')) {
      res.status(503).json({
        error: { code: 'GA4_NOT_CONFIGURED', message: error.message }
      });
    } else {
      next(error);
    }
  }
});

// ============================================
// GET /api/v1/ga4/overview - Overview metrics
// ============================================
router.get('/overview', async (req, res, next) => {
  try {
    const { range = '30' } = req.query;
    const { startDate, endDate } = rangeToDateRange(range);
    const data = await getOverviewMetrics(startDate, endDate);
    res.json({ data });
  } catch (error) {
    if (error.message.includes('not configured')) {
      res.status(503).json({
        error: { code: 'GA4_NOT_CONFIGURED', message: error.message }
      });
    } else {
      next(error);
    }
  }
});

// ============================================
// GET /api/v1/ga4/ecommerce - E-commerce metrics
// ============================================
router.get('/ecommerce', async (req, res, next) => {
  try {
    const { range = '30' } = req.query;
    const { startDate, endDate } = rangeToDateRange(range);
    const data = await getEcommerceMetrics(startDate, endDate);
    res.json({ data });
  } catch (error) {
    if (error.message.includes('not configured')) {
      res.status(503).json({
        error: { code: 'GA4_NOT_CONFIGURED', message: error.message }
      });
    } else {
      next(error);
    }
  }
});

// ============================================
// GET /api/v1/ga4/traffic - Traffic sources
// ============================================
router.get('/traffic', async (req, res, next) => {
  try {
    const { range = '30' } = req.query;
    const { startDate, endDate } = rangeToDateRange(range);
    const data = await getTrafficSources(startDate, endDate);
    res.json({ data: { trafficSources: data } });
  } catch (error) {
    if (error.message.includes('not configured')) {
      res.status(503).json({
        error: { code: 'GA4_NOT_CONFIGURED', message: error.message }
      });
    } else {
      next(error);
    }
  }
});

// ============================================
// GET /api/v1/ga4/pages - Top pages
// ============================================
router.get('/pages', async (req, res, next) => {
  try {
    const { range = '30' } = req.query;
    const { startDate, endDate } = rangeToDateRange(range);
    const data = await getTopPages(startDate, endDate);
    res.json({ data: { topPages: data } });
  } catch (error) {
    if (error.message.includes('not configured')) {
      res.status(503).json({
        error: { code: 'GA4_NOT_CONFIGURED', message: error.message }
      });
    } else {
      next(error);
    }
  }
});

// ============================================
// GET /api/v1/ga4/trends - User trends over time
// ============================================
router.get('/trends', async (req, res, next) => {
  try {
    const { range = '30' } = req.query;
    const { startDate, endDate } = rangeToDateRange(range);
    const data = await getUserTrends(startDate, endDate);
    res.json({ data: { userTrends: data } });
  } catch (error) {
    if (error.message.includes('not configured')) {
      res.status(503).json({
        error: { code: 'GA4_NOT_CONFIGURED', message: error.message }
      });
    } else {
      next(error);
    }
  }
});

// ============================================
// GET /api/v1/ga4/devices - Device breakdown
// ============================================
router.get('/devices', async (req, res, next) => {
  try {
    const { range = '30' } = req.query;
    const { startDate, endDate } = rangeToDateRange(range);
    const data = await getDeviceBreakdown(startDate, endDate);
    res.json({ data: { devices: data } });
  } catch (error) {
    if (error.message.includes('not configured')) {
      res.status(503).json({
        error: { code: 'GA4_NOT_CONFIGURED', message: error.message }
      });
    } else {
      next(error);
    }
  }
});

// ============================================
// GET /api/v1/ga4/countries - Country breakdown
// ============================================
router.get('/countries', async (req, res, next) => {
  try {
    const { range = '30' } = req.query;
    const { startDate, endDate } = rangeToDateRange(range);
    const data = await getCountryBreakdown(startDate, endDate);
    res.json({ data: { countries: data } });
  } catch (error) {
    if (error.message.includes('not configured')) {
      res.status(503).json({
        error: { code: 'GA4_NOT_CONFIGURED', message: error.message }
      });
    } else {
      next(error);
    }
  }
});

// ============================================
// GET /api/v1/ga4/summary - All GA4 data in one call
// ============================================
router.get('/summary', async (req, res, next) => {
  try {
    const { range = '30' } = req.query;
    const { startDate, endDate } = rangeToDateRange(range);

    // Fetch all data in parallel
    const [
      overview,
      ecommerce,
      trafficSources,
      topPages,
      userTrends,
      devices,
      countries,
      realtime,
    ] = await Promise.all([
      getOverviewMetrics(startDate, endDate),
      getEcommerceMetrics(startDate, endDate),
      getTrafficSources(startDate, endDate),
      getTopPages(startDate, endDate),
      getUserTrends(startDate, endDate),
      getDeviceBreakdown(startDate, endDate),
      getCountryBreakdown(startDate, endDate),
      getRealtimeUsers().catch(() => ({ activeUsers: 0 })),
    ]);

    res.json({
      data: {
        realtime,
        overview,
        ecommerce,
        trafficSources,
        topPages,
        userTrends,
        devices,
        countries,
      }
    });
  } catch (error) {
    if (error.message.includes('not configured')) {
      res.status(503).json({
        error: { code: 'GA4_NOT_CONFIGURED', message: error.message }
      });
    } else {
      next(error);
    }
  }
});

export default router;
