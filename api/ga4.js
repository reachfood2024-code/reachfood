// Vercel Serverless Function for GA4 Analytics
// This handles all GA4 API calls

import { BetaAnalyticsDataClient } from '@google-analytics/data';

const GA4_NOT_CONFIGURED = 'GA4 is not configured';

let analyticsDataClient = null;

function getClient() {
  if (!analyticsDataClient) {
    const propertyId = process.env.GA4_PROPERTY_ID;
    const credentialsJson = process.env.GA4_CREDENTIALS_JSON;

    if (!propertyId || !credentialsJson) {
      throw new Error(GA4_NOT_CONFIGURED);
    }

    try {
      const credentials = JSON.parse(credentialsJson);
      analyticsDataClient = new BetaAnalyticsDataClient({ credentials });
    } catch (e) {
      throw new Error(`Invalid GA4 credentials: ${e.message}`);
    }
  }
  return analyticsDataClient;
}

function getPropertyId() {
  return `properties/${process.env.GA4_PROPERTY_ID}`;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  const { endpoint, range = '30' } = req.query;
  const days = parseInt(range);
  const startDate = `${days}daysAgo`;
  const endDate = 'today';

  try {
    const client = getClient();
    const property = getPropertyId();
    let data;

    switch (endpoint) {
      case 'status':
        try {
          await client.runReport({
            property,
            dateRanges: [{ startDate: '1daysAgo', endDate: 'today' }],
            metrics: [{ name: 'activeUsers' }],
            limit: 1
          });
          data = { connected: true, propertyId: process.env.GA4_PROPERTY_ID };
        } catch (e) {
          data = { connected: false, error: e.message };
        }
        break;

      case 'realtime':
        const [realtimeResponse] = await client.runRealtimeReport({
          property,
          metrics: [{ name: 'activeUsers' }]
        });
        data = { activeUsers: parseInt(realtimeResponse.rows?.[0]?.metricValues?.[0]?.value || '0') };
        break;

      case 'overview':
        const [overviewResponse] = await client.runReport({
          property,
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
        const ov = overviewResponse.rows?.[0]?.metricValues || [];
        data = {
          users: parseInt(ov[0]?.value || '0'),
          newUsers: parseInt(ov[1]?.value || '0'),
          sessions: parseInt(ov[2]?.value || '0'),
          pageViews: parseInt(ov[3]?.value || '0'),
          avgSessionDuration: parseFloat(ov[4]?.value || '0').toFixed(1),
          bounceRate: (parseFloat(ov[5]?.value || '0') * 100).toFixed(1)
        };
        break;

      case 'traffic':
        const [trafficResponse] = await client.runReport({
          property,
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'sessionDefaultChannelGroup' }],
          metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit: 10
        });
        const totalSessions = trafficResponse.rows?.reduce((sum, row) =>
          sum + parseInt(row.metricValues?.[0]?.value || '0'), 0) || 1;
        data = {
          trafficSources: (trafficResponse.rows || []).map(row => ({
            source: row.dimensionValues?.[0]?.value,
            sessions: parseInt(row.metricValues?.[0]?.value || '0'),
            users: parseInt(row.metricValues?.[1]?.value || '0'),
            percentage: ((parseInt(row.metricValues?.[0]?.value || '0') / totalSessions) * 100).toFixed(1)
          }))
        };
        break;

      case 'pages':
        const [pagesResponse] = await client.runReport({
          property,
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'pagePath' }],
          metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }],
          orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
          limit: 10
        });
        data = {
          topPages: (pagesResponse.rows || []).map(row => ({
            page: row.dimensionValues?.[0]?.value,
            pageViews: parseInt(row.metricValues?.[0]?.value || '0'),
            users: parseInt(row.metricValues?.[1]?.value || '0')
          }))
        };
        break;

      case 'trends':
        const [trendsResponse] = await client.runReport({
          property,
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'date' }],
          metrics: [{ name: 'totalUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }],
          orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }]
        });
        data = {
          userTrends: (trendsResponse.rows || []).map(row => {
            const dateStr = row.dimensionValues?.[0]?.value || '';
            return {
              date: dateStr.length === 8 ? `${dateStr.slice(0,4)}-${dateStr.slice(4,6)}-${dateStr.slice(6,8)}` : dateStr,
              users: parseInt(row.metricValues?.[0]?.value || '0'),
              sessions: parseInt(row.metricValues?.[1]?.value || '0'),
              pageViews: parseInt(row.metricValues?.[2]?.value || '0')
            };
          })
        };
        break;

      case 'devices':
        const [devicesResponse] = await client.runReport({
          property,
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'deviceCategory' }],
          metrics: [{ name: 'totalUsers' }]
        });
        const totalUsers = devicesResponse.rows?.reduce((sum, row) =>
          sum + parseInt(row.metricValues?.[0]?.value || '0'), 0) || 1;
        data = {
          devices: (devicesResponse.rows || []).map(row => ({
            device: row.dimensionValues?.[0]?.value,
            users: parseInt(row.metricValues?.[0]?.value || '0'),
            percentage: ((parseInt(row.metricValues?.[0]?.value || '0') / totalUsers) * 100).toFixed(1)
          }))
        };
        break;

      case 'countries':
        const [countriesResponse] = await client.runReport({
          property,
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'country' }],
          metrics: [{ name: 'totalUsers' }],
          orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
          limit: 10
        });
        data = {
          countries: (countriesResponse.rows || []).map(row => ({
            country: row.dimensionValues?.[0]?.value,
            users: parseInt(row.metricValues?.[0]?.value || '0')
          }))
        };
        break;

      default:
        return res.status(400).json({ error: 'Invalid endpoint' });
    }

    return res.status(200).json({ data });
  } catch (error) {
    console.error('GA4 API Error:', error.message);
    if (error.message.includes('not configured')) {
      return res.status(503).json({ error: { code: 'GA4_NOT_CONFIGURED', message: error.message } });
    }
    return res.status(500).json({ error: { code: 'GA4_ERROR', message: error.message } });
  }
}
