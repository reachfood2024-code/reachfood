// Dashboard Mock Data - Static data for investor presentations
// Replace with API calls when backend is ready

// Generate 30 days of trend data
const generateTrendData = (baseValue, variance, days = 30) => {
  const data = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const randomFactor = 1 + (Math.random() - 0.5) * variance;
    const trendFactor = 1 + (days - i) * 0.01; // Slight upward trend
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(baseValue * randomFactor * trendFactor)
    });
  }
  return data;
};

export const dashboardData = {
  // Summary Metrics
  metrics: {
    totalUsers: {
      label: 'Total Users',
      value: 2847,
      change: 12.5,
      trend: 'up',
      period: 'vs last month'
    },
    addToCartEvents: {
      label: 'Add to Cart',
      value: 1523,
      change: 8.3,
      trend: 'up',
      period: 'vs last month'
    },
    emailSubmissions: {
      label: 'Email Signups',
      value: 847,
      change: 23.1,
      trend: 'up',
      period: 'vs last month'
    },
    completedOrders: {
      label: 'Orders',
      value: 412,
      change: 15.7,
      trend: 'up',
      period: 'vs last month'
    },
    revenue: {
      label: 'Revenue',
      value: 32960,
      change: 18.2,
      trend: 'up',
      period: 'vs last month',
      prefix: '$'
    },
    conversionRate: {
      label: 'Conversion',
      value: 4.8,
      change: 0.6,
      trend: 'up',
      period: 'vs last month',
      suffix: '%'
    }
  },

  // Time Series Data for Charts (30 days)
  userBehaviorTrend: [
    { date: '2024-11-26', pageViews: 1200, uniqueVisitors: 340 },
    { date: '2024-11-27', pageViews: 1350, uniqueVisitors: 380 },
    { date: '2024-11-28', pageViews: 1180, uniqueVisitors: 320 },
    { date: '2024-11-29', pageViews: 1420, uniqueVisitors: 410 },
    { date: '2024-11-30', pageViews: 1580, uniqueVisitors: 450 },
    { date: '2024-12-01', pageViews: 1320, uniqueVisitors: 370 },
    { date: '2024-12-02', pageViews: 1150, uniqueVisitors: 310 },
    { date: '2024-12-03', pageViews: 1280, uniqueVisitors: 360 },
    { date: '2024-12-04', pageViews: 1450, uniqueVisitors: 400 },
    { date: '2024-12-05', pageViews: 1520, uniqueVisitors: 430 },
    { date: '2024-12-06', pageViews: 1680, uniqueVisitors: 480 },
    { date: '2024-12-07', pageViews: 1420, uniqueVisitors: 390 },
    { date: '2024-12-08', pageViews: 1250, uniqueVisitors: 340 },
    { date: '2024-12-09', pageViews: 1380, uniqueVisitors: 380 },
    { date: '2024-12-10', pageViews: 1550, uniqueVisitors: 440 },
    { date: '2024-12-11', pageViews: 1720, uniqueVisitors: 490 },
    { date: '2024-12-12', pageViews: 1850, uniqueVisitors: 530 },
    { date: '2024-12-13', pageViews: 1620, uniqueVisitors: 460 },
    { date: '2024-12-14', pageViews: 1480, uniqueVisitors: 410 },
    { date: '2024-12-15', pageViews: 1590, uniqueVisitors: 450 },
    { date: '2024-12-16', pageViews: 1780, uniqueVisitors: 510 },
    { date: '2024-12-17', pageViews: 1920, uniqueVisitors: 550 },
    { date: '2024-12-18', pageViews: 2050, uniqueVisitors: 590 },
    { date: '2024-12-19', pageViews: 1880, uniqueVisitors: 540 },
    { date: '2024-12-20', pageViews: 1750, uniqueVisitors: 500 },
    { date: '2024-12-21', pageViews: 1650, uniqueVisitors: 470 },
    { date: '2024-12-22', pageViews: 1820, uniqueVisitors: 520 },
    { date: '2024-12-23', pageViews: 2100, uniqueVisitors: 600 },
    { date: '2024-12-24', pageViews: 2280, uniqueVisitors: 650 },
    { date: '2024-12-25', pageViews: 2450, uniqueVisitors: 700 }
  ],

  addToCartTrend: generateTrendData(50, 0.4),

  ordersTrend: [
    { date: '2024-11-26', orders: 12, revenue: 960 },
    { date: '2024-11-27', orders: 15, revenue: 1200 },
    { date: '2024-11-28', orders: 10, revenue: 800 },
    { date: '2024-11-29', orders: 18, revenue: 1440 },
    { date: '2024-11-30', orders: 22, revenue: 1760 },
    { date: '2024-12-01', orders: 14, revenue: 1120 },
    { date: '2024-12-02', orders: 11, revenue: 880 },
    { date: '2024-12-03', orders: 13, revenue: 1040 },
    { date: '2024-12-04', orders: 16, revenue: 1280 },
    { date: '2024-12-05', orders: 19, revenue: 1520 },
    { date: '2024-12-06', orders: 24, revenue: 1920 },
    { date: '2024-12-07', orders: 17, revenue: 1360 },
    { date: '2024-12-08', orders: 12, revenue: 960 },
    { date: '2024-12-09', orders: 14, revenue: 1120 },
    { date: '2024-12-10', orders: 18, revenue: 1440 },
    { date: '2024-12-11', orders: 21, revenue: 1680 },
    { date: '2024-12-12', orders: 26, revenue: 2080 },
    { date: '2024-12-13', orders: 20, revenue: 1600 },
    { date: '2024-12-14', orders: 15, revenue: 1200 },
    { date: '2024-12-15', orders: 17, revenue: 1360 },
    { date: '2024-12-16', orders: 23, revenue: 1840 },
    { date: '2024-12-17', orders: 28, revenue: 2240 },
    { date: '2024-12-18', orders: 32, revenue: 2560 },
    { date: '2024-12-19', orders: 25, revenue: 2000 },
    { date: '2024-12-20', orders: 22, revenue: 1760 },
    { date: '2024-12-21', orders: 19, revenue: 1520 },
    { date: '2024-12-22', orders: 27, revenue: 2160 },
    { date: '2024-12-23', orders: 35, revenue: 2800 },
    { date: '2024-12-24', orders: 42, revenue: 3360 },
    { date: '2024-12-25', orders: 48, revenue: 3840 }
  ],

  emailSubmissionsTrend: generateTrendData(28, 0.5),

  // Breakdown Data
  ordersByProduct: [
    { name: 'Re-Protein', orders: 156, revenue: 12480 },
    { name: 'Re-Energy', orders: 98, revenue: 7840 },
    { name: 'Re-Vitality', orders: 87, revenue: 6960 },
    { name: 'Re-Balance', orders: 71, revenue: 5680 }
  ],

  trafficSources: [
    { source: 'Direct', visits: 1240, percentage: 43.5 },
    { source: 'Organic Search', visits: 892, percentage: 31.3 },
    { source: 'Social Media', visits: 456, percentage: 16.0 },
    { source: 'Referral', visits: 259, percentage: 9.2 }
  ],

  recentOrders: [
    { id: 'ORD-001234', customer: 'Ahmed Al-Rashid', product: 'Re-Protein', amount: 96.00, phone: '+971 50 123 4567', location: 'Dubai Marina, Tower 5', country: 'UAE', status: 'completed', date: '2024-12-25' },
    { id: 'ORD-001233', customer: 'Sarah Johnson', product: 'Re-Energy', amount: 64.00, phone: '+971 55 987 6543', location: 'Abu Dhabi, Corniche Road', country: 'UAE', status: 'processing', date: '2024-12-25' },
    { id: 'ORD-001232', customer: 'Mohammed Hassan', product: 'Re-Vitality', amount: 128.00, phone: '+966 55 111 2222', location: 'Riyadh, Al Olaya District', country: 'Saudi Arabia', status: 'completed', date: '2024-12-24' },
    { id: 'ORD-001231', customer: 'Emily Chen', product: 'Re-Balance', amount: 80.00, phone: '+971 52 333 4444', location: 'Sharjah, Al Nahda', country: 'UAE', status: 'completed', date: '2024-12-24' },
    { id: 'ORD-001230', customer: 'Omar Khaled', product: 'Re-Protein', amount: 192.00, phone: '+965 99 555 6666', location: 'Kuwait City, Salmiya', country: 'Kuwait', status: 'completed', date: '2024-12-24' },
    { id: 'ORD-001229', customer: 'Lisa Anderson', product: 'Re-Energy', amount: 32.00, phone: '+971 56 777 8888', location: 'Dubai, JBR Walk', country: 'UAE', status: 'shipped', date: '2024-12-23' },
    { id: 'ORD-001228', customer: 'Yusuf Ibrahim', product: 'Re-Protein', amount: 64.00, phone: '+973 33 999 0000', location: 'Manama, Seef District', country: 'Bahrain', status: 'completed', date: '2024-12-23' },
    { id: 'ORD-001227', customer: 'Maria Garcia', product: 'Re-Vitality', amount: 96.00, phone: '+971 54 222 3333', location: 'Dubai, Downtown', country: 'UAE', status: 'completed', date: '2024-12-23' },
    { id: 'ORD-001226', customer: 'Fatima Al-Ali', product: 'Re-Balance', amount: 160.00, phone: '+968 92 444 5555', location: 'Muscat, Al Qurum', country: 'Oman', status: 'pending', date: '2024-12-22' },
    { id: 'ORD-001225', customer: 'James Wilson', product: 'Re-Protein', amount: 128.00, phone: '+971 50 666 7777', location: 'Abu Dhabi, Yas Island', country: 'UAE', status: 'shipped', date: '2024-12-22' },
    { id: 'ORD-001224', customer: 'Layla Hassan', product: 'Re-Energy', amount: 64.00, phone: '+966 50 888 9999', location: 'Jeddah, Al Hamra', country: 'Saudi Arabia', status: 'processing', date: '2024-12-22' },
    { id: 'ORD-001223', customer: 'Ali Mohammed', product: 'Re-Vitality', amount: 96.00, phone: '+971 58 111 0000', location: 'Dubai, Business Bay', country: 'UAE', status: 'completed', date: '2024-12-21' },
    { id: 'ORD-001222', customer: 'Sophie Brown', product: 'Re-Balance', amount: 80.00, phone: '+974 55 222 1111', location: 'Doha, West Bay', country: 'Qatar', status: 'completed', date: '2024-12-21' },
    { id: 'ORD-001221', customer: 'Khalid Al-Saud', product: 'Re-Protein', amount: 256.00, phone: '+966 54 333 2222', location: 'Riyadh, King Abdullah District', country: 'Saudi Arabia', status: 'shipped', date: '2024-12-21' },
    { id: 'ORD-001220', customer: 'Emma Taylor', product: 'Re-Energy', amount: 32.00, phone: '+971 52 444 3333', location: 'Dubai, Palm Jumeirah', country: 'UAE', status: 'cancelled', date: '2024-12-20' },
    { id: 'ORD-001219', customer: 'Hassan Ali', product: 'Re-Vitality', amount: 128.00, phone: '+965 66 555 4444', location: 'Kuwait City, Hawally', country: 'Kuwait', status: 'completed', date: '2024-12-20' },
    { id: 'ORD-001218', customer: 'Noor Ahmed', product: 'Re-Balance', amount: 160.00, phone: '+971 55 666 5555', location: 'Sharjah, Al Majaz', country: 'UAE', status: 'pending', date: '2024-12-20' },
    { id: 'ORD-001217', customer: 'David Miller', product: 'Re-Protein', amount: 64.00, phone: '+973 39 777 6666', location: 'Manama, Juffair', country: 'Bahrain', status: 'completed', date: '2024-12-19' },
    { id: 'ORD-001216', customer: 'Amira Saleh', product: 'Re-Energy', amount: 96.00, phone: '+968 99 888 7777', location: 'Muscat, Ruwi', country: 'Oman', status: 'processing', date: '2024-12-19' },
    { id: 'ORD-001215', customer: 'John Smith', product: 'Re-Vitality', amount: 128.00, phone: '+971 50 999 8888', location: 'Dubai, DIFC', country: 'UAE', status: 'completed', date: '2024-12-19' }
  ],

  recentSubscribers: [
    { email: 'a***d@email.com', date: '2024-12-25 14:32', source: 'Homepage' },
    { email: 's***h@gmail.com', date: '2024-12-25 13:15', source: 'Footer' },
    { email: 'm***d@outlook.com', date: '2024-12-25 11:48', source: 'Checkout' },
    { email: 'e***y@yahoo.com', date: '2024-12-24 22:30', source: 'Homepage' },
    { email: 'o***r@email.com', date: '2024-12-24 19:15', source: 'Footer' }
  ]
};

export default dashboardData;
