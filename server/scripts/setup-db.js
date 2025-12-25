#!/usr/bin/env node
/**
 * Database Setup Script for ReachFood Analytics
 *
 * Run this script to initialize the database schema on Render PostgreSQL
 *
 * Usage:
 *   node scripts/setup-db.js
 *
 * Or with a custom DATABASE_URL:
 *   DATABASE_URL="postgresql://..." node scripts/setup-db.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { Pool } = pg;

// Database URL - can be overridden via environment variable
const DATABASE_URL = process.env.DATABASE_URL ||
  'postgresql://reachfood:6DC8mAFNYnuSwlzhT8ASjtyKD5FvX2P2@dpg-d56plf1r0fns73ecl1bg-a.singapore-postgres.render.com/reachfood_j8ch';

async function setupDatabase() {
  console.log('\n========================================');
  console.log('  ReachFood Database Setup');
  console.log('========================================\n');

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // Step 1: Test connection
    console.log('1. Testing database connection...');
    const client = await pool.connect();
    console.log('   Connected successfully!\n');

    // Step 2: Check if tables already exist
    console.log('2. Checking existing tables...');
    const existingTables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    if (existingTables.rows.length > 0) {
      console.log('   Found existing tables:');
      existingTables.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
      console.log('\n   Dropping existing tables to recreate schema...');

      // Drop all tables in correct order (respecting foreign keys)
      await client.query(`
        DROP TABLE IF EXISTS order_items CASCADE;
        DROP TABLE IF EXISTS orders CASCADE;
        DROP TABLE IF EXISTS cart_events CASCADE;
        DROP TABLE IF EXISTS email_subscriptions CASCADE;
        DROP TABLE IF EXISTS events CASCADE;
        DROP TABLE IF EXISTS page_views CASCADE;
        DROP TABLE IF EXISTS sessions CASCADE;
        DROP TABLE IF EXISTS daily_metrics CASCADE;
        DROP VIEW IF EXISTS v_today_metrics CASCADE;
        DROP VIEW IF EXISTS v_30day_trend CASCADE;
        DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
        DROP FUNCTION IF EXISTS generate_order_number CASCADE;
        DROP FUNCTION IF EXISTS aggregate_daily_metrics CASCADE;
      `);
      console.log('   Tables dropped.\n');
    } else {
      console.log('   No existing tables found.\n');
    }

    // Step 3: Run schema
    console.log('3. Creating database schema...');
    const schemaPath = join(__dirname, '../database/schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');

    await client.query(schema);
    console.log('   Schema created successfully!\n');

    // Step 4: Verify tables
    console.log('4. Verifying created tables...');
    const newTables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    const expectedTables = [
      'cart_events',
      'daily_metrics',
      'email_subscriptions',
      'events',
      'order_items',
      'orders',
      'page_views',
      'sessions'
    ];

    const createdTables = newTables.rows.map(r => r.table_name);
    const allTablesCreated = expectedTables.every(t => createdTables.includes(t));

    if (allTablesCreated) {
      console.log('   All tables created:');
      createdTables.forEach(table => {
        console.log(`   [OK] ${table}`);
      });
    } else {
      console.log('   WARNING: Some tables may be missing');
      expectedTables.forEach(table => {
        const status = createdTables.includes(table) ? '[OK]' : '[MISSING]';
        console.log(`   ${status} ${table}`);
      });
    }

    // Step 5: Verify views
    console.log('\n5. Verifying views...');
    const views = await client.query(`
      SELECT table_name
      FROM information_schema.views
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    views.rows.forEach(row => {
      console.log(`   [OK] ${row.table_name}`);
    });

    // Step 6: Verify functions
    console.log('\n6. Verifying functions...');
    const functions = await client.query(`
      SELECT routine_name
      FROM information_schema.routines
      WHERE routine_schema = 'public'
      AND routine_type = 'FUNCTION'
      ORDER BY routine_name;
    `);

    functions.rows.forEach(row => {
      console.log(`   [OK] ${row.routine_name}`);
    });

    client.release();

    console.log('\n========================================');
    console.log('  Database setup completed successfully!');
    console.log('========================================\n');

    // Step 7: Test API endpoint (optional)
    console.log('7. Testing API connection...');
    try {
      const apiUrl = process.env.API_URL || 'https://reachfood-api-frhk.onrender.com';
      const response = await fetch(`${apiUrl}/api/health`);
      const data = await response.json();

      if (data.status === 'ok' && data.database === 'connected') {
        console.log(`   [OK] API Health: ${data.status}`);
        console.log(`   [OK] Database: ${data.database}`);
      } else {
        console.log(`   API responded but with issues:`, data);
      }
    } catch (error) {
      console.log(`   Could not reach API (this is OK if running locally)`);
    }

    console.log('\n Next steps:');
    console.log(' 1. Redeploy your Render backend to pick up the new schema');
    console.log(' 2. Visit https://reachfood.co/admin to see real data');
    console.log(' 3. Make some test orders to populate the dashboard\n');

  } catch (error) {
    console.error('\n ERROR:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
