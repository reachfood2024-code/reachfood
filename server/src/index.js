import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { pool, testConnection } from './database/db.js';
import trackingRoutes from './routes/tracking.js';
import metricsRoutes from './routes/metrics.js';
import ordersRoutes from './routes/orders.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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
  await testConnection();
  app.listen(PORT, () => {
    console.log(`Analytics API running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

start();
