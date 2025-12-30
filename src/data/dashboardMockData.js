// Dashboard Mock Data - Fresh start
// Orders will be populated from real checkout submissions

export const dashboardData = {
  // Summary Metrics - Starting fresh
  metrics: {
    totalUsers: {
      label: 'Total Users',
      value: 0,
      change: 0,
      trend: 'up',
      period: 'vs last month'
    },
    addToCartEvents: {
      label: 'Add to Cart',
      value: 0,
      change: 0,
      trend: 'up',
      period: 'vs last month'
    },
    emailSubmissions: {
      label: 'Email Signups',
      value: 0,
      change: 0,
      trend: 'up',
      period: 'vs last month'
    },
    completedOrders: {
      label: 'Orders',
      value: 0,
      change: 0,
      trend: 'up',
      period: 'vs last month'
    },
    revenue: {
      label: 'Revenue',
      value: 0,
      change: 0,
      trend: 'up',
      period: 'vs last month',
      prefix: '$'
    },
    conversionRate: {
      label: 'Conversion',
      value: 0,
      change: 0,
      trend: 'up',
      period: 'vs last month',
      suffix: '%'
    }
  },

  // Empty trend data
  userBehaviorTrend: [],
  addToCartTrend: [],
  ordersTrend: [],
  emailSubmissionsTrend: [],

  // Empty breakdown data
  ordersByProduct: [],
  trafficSources: [],

  // Empty orders - will be populated from real orders
  recentOrders: [],

  // Empty subscribers
  recentSubscribers: []
};

export default dashboardData;
