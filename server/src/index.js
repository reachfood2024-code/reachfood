import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { pool, testConnection } from './database/db.js';
import trackingRoutes from './routes/tracking.js';
import metricsRoutes from './routes/metrics.js';
import ordersRoutes from './routes/orders.js';
import subscriptionsRoutes from './routes/subscriptions.js';
import ga4Routes from './routes/ga4.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS - Allow all ReachFood domains
const allowedOrigins = [
  'https://reachfood.co',
  'https://www.reachfood.co',
  'https://shop.reachfood.co',
  'https://www.shop.reachfood.co',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

// API Routes
app.use('/api/v1/track', trackingRoutes);
app.use('/api/v1/metrics', metricsRoutes);
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/subscriptions', subscriptionsRoutes);
app.use('/api/v1/ga4', ga4Routes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Something went wrong'
    }
  });
});

// Start server
async function start() {
  try {
    await testConnection();
  } catch (error) {
    console.warn('Database not available, running in limited mode (GA4 still works)');
  }

  app.listen(PORT, () => {
    console.log(`Analytics API running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

start();
