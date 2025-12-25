# ReachFood Analytics API - Deployment Guide

## Quick Start (Local Development)

```bash
# 1. Navigate to server folder
cd server

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Update .env with your PostgreSQL connection string
# DATABASE_URL=postgresql://user:password@localhost:5432/reachfood

# 5. Run database migrations
npm run db:migrate

# 6. (Optional) Seed sample data
npm run db:seed

# 7. Start the server
npm run dev
```

---

## Deploy to Render

### Step 1: Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **PostgreSQL**
3. Configure:
   - Name: `reachfood-db`
   - Database: `reachfood`
   - User: `reachfood`
   - Region: Choose closest to your users
   - Plan: **Free** (for testing) or **Starter** ($7/mo for production)
4. Click **Create Database**
5. Copy the **Internal Database URL** (looks like `postgres://...`)

### Step 2: Deploy API

1. Push your code to GitHub
2. Go to Render Dashboard → **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - Name: `reachfood-api`
   - Root Directory: `server`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: **Free** or **Starter**

5. Add Environment Variables:
   ```
   DATABASE_URL = [paste Internal Database URL from Step 1]
   NODE_ENV = production
   FRONTEND_URL = https://your-frontend-url.com
   PORT = 10000
   ```

6. Click **Create Web Service**

### Step 3: Run Migrations

After deployment, open the **Shell** tab in your Render service:

```bash
npm run db:migrate
npm run db:seed  # Optional: add sample data
```

### Step 4: Update Frontend

Add to your frontend `.env`:
```
VITE_API_URL=https://reachfood-api.onrender.com/api/v1
```

---

## Deploy to Railway

### Step 1: Create Project

1. Go to [Railway](https://railway.app)
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository

### Step 2: Add PostgreSQL

1. In your project, click **New** → **Database** → **PostgreSQL**
2. Railway auto-generates `DATABASE_URL`

### Step 3: Configure Service

1. Click on your service
2. Go to **Settings**:
   - Root Directory: `/server`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. Go to **Variables** → Add:
   ```
   NODE_ENV = production
   FRONTEND_URL = https://your-frontend-url.com
   ```
   (DATABASE_URL is auto-added)

### Step 4: Run Migrations

Click **Shell** in your service:
```bash
npm run db:migrate
```

### Step 5: Get API URL

Go to **Settings** → **Networking** → **Generate Domain**

Update frontend `.env`:
```
VITE_API_URL=https://your-app.railway.app/api/v1
```

---

## API Endpoints

### Tracking (POST)
- `POST /api/v1/track/session` - Start/update session
- `POST /api/v1/track/pageview` - Track page view
- `POST /api/v1/track/cart` - Track cart events
- `POST /api/v1/track/email` - Track email signup
- `POST /api/v1/track/event` - Track generic event

### Metrics (GET)
- `GET /api/v1/metrics/summary?range=30` - Dashboard KPIs
- `GET /api/v1/metrics/trends?range=30` - Time series data
- `GET /api/v1/metrics/products?range=30` - Product performance
- `GET /api/v1/metrics/traffic?range=30` - Traffic sources

### Orders
- `GET /api/v1/orders` - List recent orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/:orderNumber` - Get order details
- `PATCH /api/v1/orders/:orderNumber/status` - Update status

---

## Frontend Integration

Add to your main `App.jsx` or `main.jsx`:

```jsx
import analytics from './services/analytics';

// Initialize session on app load
useEffect(() => {
  analytics.initSession();
}, []);
```

The CartContext already tracks add/remove cart events automatically.

---

## Costs

### Render
- Free tier: Spins down after 15 mins inactivity (cold starts)
- Starter ($7/mo): Always on, faster
- PostgreSQL Free: 1GB, expires after 90 days
- PostgreSQL Starter: $7/mo, 1GB

### Railway
- Free tier: $5/month credits
- Usage-based pricing after
- PostgreSQL: ~$5/mo for small usage

**Recommendation**: Start with free tiers for testing, upgrade to Starter plans (~$14/mo total) for production.
