import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Generate random data for the past 30 days
async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    console.log('Seeding sample data...');

    const products = [
      { id: 'prod-1', name: 'Re-Protein', price: 32.00 },
      { id: 'prod-2', name: 'Re-Energy', price: 28.00 },
      { id: 'prod-3', name: 'Re-Vitality', price: 35.00 },
      { id: 'prod-4', name: 'Re-Balance', price: 30.00 },
    ];

    const names = [
      'Ahmed Al-Rashid', 'Sarah Johnson', 'Mohammed Hassan', 'Emily Chen',
      'Omar Khaled', 'Lisa Anderson', 'Yusuf Ibrahim', 'Maria Garcia',
      'Khalid Ahmed', 'Jennifer Smith', 'Ali Hassan', 'Rachel Brown'
    ];

    // Generate 30 days of data
    for (let day = 30; day >= 0; day--) {
      const date = new Date();
      date.setDate(date.getDate() - day);

      // Random number of sessions per day (20-80)
      const sessionCount = Math.floor(Math.random() * 60) + 20;

      for (let s = 0; s < sessionCount; s++) {
        const visitorId = uuidv4();
        const sessionId = uuidv4();

        // Create session
        await client.query(`
          INSERT INTO sessions (session_id, visitor_id, user_agent, landing_page, device_type, started_at)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          sessionId,
          visitorId,
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          ['/', '/shop', '/about'][Math.floor(Math.random() * 3)],
          ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
          date
        ]);

        // Page views (1-5 per session)
        const pageViewCount = Math.floor(Math.random() * 5) + 1;
        for (let p = 0; p < pageViewCount; p++) {
          await client.query(`
            INSERT INTO page_views (session_id, page_path, page_title, created_at)
            VALUES ($1, $2, $3, $4)
          `, [
            sessionId,
            ['/', '/shop', '/about', '/product/1', '/checkout'][Math.floor(Math.random() * 5)],
            'ReachFood',
            date
          ]);
        }

        // 30% chance of add to cart
        if (Math.random() < 0.3) {
          const product = products[Math.floor(Math.random() * products.length)];
          await client.query(`
            INSERT INTO cart_events (session_id, visitor_id, event_type, product_id, product_name, quantity, unit_price, created_at)
            VALUES ($1, $2, 'add', $3, $4, $5, $6, $7)
          `, [sessionId, visitorId, product.id, product.name, Math.floor(Math.random() * 3) + 1, product.price, date]);
        }

        // 10% chance of email signup
        if (Math.random() < 0.1) {
          const email = `user${Math.floor(Math.random() * 10000)}@example.com`;
          await client.query(`
            INSERT INTO email_subscriptions (email, email_hash, source, visitor_id, session_id, subscribed_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT DO NOTHING
          `, [
            email,
            email.substring(0, 3) + '***@' + email.split('@')[1],
            ['homepage', 'footer', 'checkout'][Math.floor(Math.random() * 3)],
            visitorId,
            sessionId,
            date
          ]);
        }

        // 8% chance of order
        if (Math.random() < 0.08) {
          const product = products[Math.floor(Math.random() * products.length)];
          const quantity = Math.floor(Math.random() * 4) + 1;
          const total = product.price * quantity;
          const customerName = names[Math.floor(Math.random() * names.length)];

          const orderResult = await client.query(`
            INSERT INTO orders (
              order_number, session_id, visitor_id,
              customer_name, customer_email, customer_phone,
              shipping_address, subtotal, total, ordered_at, status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING id
          `, [
            `ORD-${String(Date.now()).slice(-6)}${Math.floor(Math.random() * 100)}`,
            sessionId,
            visitorId,
            customerName,
            `${customerName.toLowerCase().replace(' ', '.')}@email.com`,
            '+1234567890',
            JSON.stringify({ city: 'Riyadh', country: 'SA' }),
            total,
            total,
            date,
            ['completed', 'processing', 'shipped'][Math.floor(Math.random() * 3)]
          ]);

          await client.query(`
            INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [orderResult.rows[0].id, product.id, product.name, quantity, product.price, total]);
        }
      }

      console.log(`Day ${30 - day}/30 seeded`);
    }

    // Aggregate daily metrics
    console.log('Aggregating daily metrics...');
    for (let day = 30; day >= 1; day--) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      await client.query('SELECT aggregate_daily_metrics($1)', [date.toISOString().split('T')[0]]);
    }

    console.log('Seed completed successfully!');
    client.release();
  } catch (error) {
    console.error('Seed failed:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

seed();
