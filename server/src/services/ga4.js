// GA4 Analytics Service
// Fetches data from Google Analytics 4 using the Data API

import { BetaAnalyticsDataClient } from '@google-analytics/data';

const GA4_NOT_CONFIGURED = 'GA4 is not configured. Set GA4_PROPERTY_ID and GOOGLE_APPLICATION_CREDENTIALS environment variables.';

// Initialize the client (will use GOOGLE_APPLICATION_CREDENTIALS env var automatically)
let analyticsDataClient = null;

function getClient() {
  if (!analyticsDataClient) {
    const propertyId = process.env.GA4_PROPERTY_ID;
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const credentialsJson = process.env.GA4_CREDENTIALS_JSON;

    if (!propertyId) {
      throw new Error(GA4_NOT_CONFIGURED);
    }

    // Initialize client - uses GOOGLE_APPLICATION_CREDENTIALS automatically
    // or can parse JSON credentials for cloud deployments
    if (credentialsJson) {
      try {
        const credentials = JSON.parse(credentialsJson);
        analyticsDataClient = new BetaAnalyticsDataClient({ credentials });
      } catch (e) {
        throw new Error('Invalid GA4_CREDENTIALS_JSON format');
      }
    } else if (credentialsPath) {
      // Uses the GOOGLE_APPLICATION_CREDENTIALS environment variable
      analyticsDataClient = new BetaAnalyticsDataClient();
    } else {
      throw new Error(GA4_NOT_CONFIGURED);
    }
  }
  return analyticsDataClient;
}

function getPropertyId() {
  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId) {
    throw new Error(GA4_NOT_CONFIGURED);
  }
  return `properties/${propertyId}`;
}

// ============================================
// CHECK CONNECTION
// ============================================
export async function checkConnection() {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GA4_CREDENTIALS_JSON;

  if (!propertyId || !credentials) {
    return {
      connected: false,
      propertyId: null,
      message: GA4_NOT_CONFIGURED
    };
  }

  try {
    // Try a simple API call to verify connection
    const client = getClient();
    await client.runReport({
      property: getPropertyId(),
      dateRanges: [{ startDate: '1daysAgo', endDate: 'today' }],
      metrics: [{ name: 'activeUsers' }],
      limit: 1
    });

    return {
      connected: true,
      propertyId: propertyId,
      message: 'GA4 connected successfully'
    };
  } catch (error) {
    console.error('GA4 connection check failed:', error.message);
    return {
      connected: false,
      propertyId: propertyId,
      message: `GA4 connection failed: ${error.message}`
    };
  }
}

// ============================================
// REALTIME USERS
// ============================================
export async function getRealtimeUsers() {
  try {
    const client = getClient();
    const [response] = await client.runRealtimeReport({
      property: getPropertyId(),
      metrics: [{ name: 'activeUsers' }]
    });

    const activeUsers = response.rows?.[0]?.metricValues?.[0]?.value || 0;

    return {
      activeUsers: parseInt(activeUsers, 10)
    };
  } catch (error) {
    console.error('GA4 realtime error:', error.message);
    return { activeUsers: 0 };
  }
}

// ============================================
// OVERVIEW METRICS
// ============================================
export async function getOverviewMetrics(startDate, endDate) {
  try {
    const client = getClient();
    const [response] = await client.runReport({
      property: getPropertyId(),
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' }
      ]
    });

    const row = response.rows?.[0];
    const values = row?.metricValues || [];

    return {
      users: parseInt(values[0]?.value || 0, 10),
      newUsers: parseInt(values[1]?.value || 0, 10),
      sessions: parseInt(values[2]?.value || 0, 10),
      pageViews: parseInt(values[3]?.value || 0, 10),
      avgSessionDuration: parseFloat(values[4]?.value || 0).toFixed(1),
      bounceRate: (parseFloat(values[5]?.value || 0) * 100).toFixed(1)
    };
  } catch (error) {
    console.error('GA4 overview error:', error.message);
    return {
      users: 0,
      newUsers: 0,
      sessions: 0,
      pageViews: 0,
      avgSessionDuration: '0',
      bounceRate: '0'
    };
  }
}

// ============================================
// ECOMMERCE METRICS
// ============================================
export async function getEcommerceMetrics(startDate, endDate) {
  try {
    const client = getClient();
    const [response] = await client.runReport({
      property: getPropertyId(),
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: 'ecommercePurchases' },
        { name: 'purchaseRevenue' },
        { name: 'averagePurchaseRevenue' },
        { name: 'itemsViewed' },
        { name: 'itemsAddedToCart' },
        { name: 'itemsCheckedOut' }
      ]
    });

    const row = response.rows?.[0];
    const values = row?.metricValues || [];

    return {
      transactions: parseInt(values[0]?.value || 0, 10),
      revenue: parseFloat(values[1]?.value || 0).toFixed(2),
      avgOrderValue: parseFloat(values[2]?.value || 0).toFixed(2),
      itemsViewed: parseInt(values[3]?.value || 0, 10),
      addToCarts: parseInt(values[4]?.value || 0, 10),
      checkouts: parseInt(values[5]?.value || 0, 10)
    };
  } catch (error) {
    console.error('GA4 ecommerce error:', error.message);
    return {
      transactions: 0,
      revenue: '0.00',
      avgOrderValue: '0.00',
      itemsViewed: 0,
      addToCarts: 0,
      checkouts: 0
    };
  }
}

// ============================================
// TRAFFIC SOURCES
// ============================================
export async function getTrafficSources(startDate, endDate) {
  try {
    const client = getClient();
    const [response] = await client.runReport({
      property: getPropertyId(),
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 10
    });

    const totalSessions = response.rows?.reduce((sum, row) => {
      return sum + parseInt(row.metricValues[0]?.value || 0, 10);
    }, 0) || 1;

    return (response.rows || []).map(row => ({
      source: row.dimensionValues[0]?.value || 'Unknown',
      sessions: parseInt(row.metricValues[0]?.value || 0, 10),
      users: parseInt(row.metricValues[1]?.value || 0, 10),
      percentage: ((parseInt(row.metricValues[0]?.value || 0, 10) / totalSessions) * 100).toFixed(1)
    }));
  } catch (error) {
    console.error('GA4 traffic sources error:', error.message);
    return [];
  }
}

// ============================================
// TOP PAGES
// ============================================
export async function getTopPages(startDate, endDate) {
  try {
    const client = getClient();
    const [response] = await client.runReport({
      property: getPropertyId(),
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
        { name: 'averageSessionDuration' }
      ],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10
    });

    return (response.rows || []).map(row => ({
      page: row.dimensionValues[0]?.value || '/',
      pageViews: parseInt(row.metricValues[0]?.value || 0, 10),
      users: parseInt(row.metricValues[1]?.value || 0, 10),
      avgDuration: parseFloat(row.metricValues[2]?.value || 0).toFixed(1)
    }));
  } catch (error) {
    console.error('GA4 top pages error:', error.message);
    return [];
  }
}

// ============================================
// USER TRENDS (Daily breakdown)
// ============================================
export async function getUserTrends(startDate, endDate) {
  try {
    const client = getClient();
    const [response] = await client.runReport({
      property: getPropertyId(),
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' }
      ],
      orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }]
    });

    return (response.rows || []).map(row => {
      const dateStr = row.dimensionValues[0]?.value || '';
      // Convert YYYYMMDD to readable format
      const formattedDate = dateStr.length === 8
        ? `${dateStr.slice(4, 6)}/${dateStr.slice(6, 8)}`
        : dateStr;

      return {
        date: formattedDate,
        users: parseInt(row.metricValues[0]?.value || 0, 10),
        newUsers: parseInt(row.metricValues[1]?.value || 0, 10),
        sessions: parseInt(row.metricValues[2]?.value || 0, 10),
        pageViews: parseInt(row.metricValues[3]?.value || 0, 10)
      };
    });
  } catch (error) {
    console.error('GA4 user trends error:', error.message);
    return [];
  }
}

// ============================================
// DEVICE BREAKDOWN
// ============================================
export async function getDeviceBreakdown(startDate, endDate) {
  try {
    const client = getClient();
    const [response] = await client.runReport({
      property: getPropertyId(),
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'totalUsers' }, { name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }]
    });

    const totalUsers = response.rows?.reduce((sum, row) => {
      return sum + parseInt(row.metricValues[0]?.value || 0, 10);
    }, 0) || 1;

    return (response.rows || []).map(row => ({
      device: row.dimensionValues[0]?.value || 'Unknown',
      users: parseInt(row.metricValues[0]?.value || 0, 10),
      sessions: parseInt(row.metricValues[1]?.value || 0, 10),
      percentage: ((parseInt(row.metricValues[0]?.value || 0, 10) / totalUsers) * 100).toFixed(1)
    }));
  } catch (error) {
    console.error('GA4 device breakdown error:', error.message);
    return [];
  }
}

// ============================================
// COUNTRY BREAKDOWN
// ============================================
export async function getCountryBreakdown(startDate, endDate) {
  try {
    const client = getClient();
    const [response] = await client.runReport({
      property: getPropertyId(),
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'totalUsers' }, { name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
      limit: 10
    });

    const totalUsers = response.rows?.reduce((sum, row) => {
      return sum + parseInt(row.metricValues[0]?.value || 0, 10);
    }, 0) || 1;

    return (response.rows || []).map(row => ({
      country: row.dimensionValues[0]?.value || 'Unknown',
      users: parseInt(row.metricValues[0]?.value || 0, 10),
      sessions: parseInt(row.metricValues[1]?.value || 0, 10),
      percentage: ((parseInt(row.metricValues[0]?.value || 0, 10) / totalUsers) * 100).toFixed(1)
    }));
  } catch (error) {
    console.error('GA4 country breakdown error:', error.message);
    return [];
  }
}
