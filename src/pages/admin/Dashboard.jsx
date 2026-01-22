// Admin Dashboard - Analytics Overview for Investors
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import MetricCard from '../../components/admin/MetricCard';
import LineChart from '../../components/admin/LineChart';
import AreaChart from '../../components/admin/AreaChart';
import BarChart from '../../components/admin/BarChart';
import DataTable, { StatusSelect } from '../../components/admin/DataTable';
import { useAdminAuth } from '../../components/admin/AdminAuth';
// Fallback mock data for when API is unavailable
import { dashboardData as mockData } from '../../data/dashboardMockData';

// GA4 API URL (Vercel serverless function)
const GA4_API_URL = '/api/ga4';

// LocalStorage keys for persistence
const ORDER_STATUS_KEY = 'reachfood_order_statuses';
const REVENUE_ADJUSTMENT_KEY = 'reachfood_revenue_adjustment';

// Load saved order statuses from localStorage
const loadSavedStatuses = () => {
  try {
    const saved = localStorage.getItem(ORDER_STATUS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

// Load saved revenue adjustment from localStorage
const loadRevenueAdjustment = () => {
  try {
    const saved = localStorage.getItem(REVENUE_ADJUSTMENT_KEY);
    return saved ? JSON.parse(saved) : 0;
  } catch {
    return 0;
  }
};

// Save revenue adjustment to localStorage
const saveRevenueAdjustment = (adjustment) => {
  try {
    localStorage.setItem(REVENUE_ADJUSTMENT_KEY, JSON.stringify(adjustment));
  } catch (e) {
    console.warn('Failed to save revenue adjustment:', e);
  }
};

// Save order statuses to localStorage
const saveStatuses = (statuses) => {
  try {
    localStorage.setItem(ORDER_STATUS_KEY, JSON.stringify(statuses));
  } catch (e) {
    console.warn('Failed to save order statuses:', e);
  }
};

// Clear all saved data from localStorage
const clearAllData = () => {
  try {
    localStorage.removeItem(ORDER_STATUS_KEY);
    localStorage.removeItem(REVENUE_ADJUSTMENT_KEY);
  } catch (e) {
    console.warn('Failed to clear data:', e);
  }
};

export default function Dashboard() {
  const { handleLogout } = useAdminAuth();
  const [dateRange, setDateRange] = useState(30);
  const [orderStatuses, setOrderStatuses] = useState(loadSavedStatuses);
  const [revenueAdjustment, setRevenueAdjustment] = useState(loadRevenueAdjustment);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Subscriptions State
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');
  const [subscriptionSearch, setSubscriptionSearch] = useState('');

  // GA4 Data State
  const [ga4Data, setGa4Data] = useState(null);
  const [ga4Status, setGa4Status] = useState('checking');
  const [ga4Loading, setGa4Loading] = useState(true);
  const [ga4Error, setGa4Error] = useState(null);

  // Convex queries
  const metricsData = useQuery(api.metrics.summary, { range: dateRange });
  const trendsData = useQuery(api.metrics.trends, { range: dateRange });
  const productsData = useQuery(api.metrics.products, { range: dateRange });
  const trafficData = useQuery(api.metrics.traffic, { range: dateRange });
  const ordersData = useQuery(api.orders.list, { limit: 50 });
  const emailsData = useQuery(api.metrics.emails, { limit: 100 });
  const subscriptionsData = useQuery(api.subscriptions.list, { limit: 50 });
  const b2bLeadsData = useQuery(api.b2bLeads.list, { limit: 50 });

  // Convex mutations
  const updateOrderStatus = useMutation(api.orders.updateStatus);
  const updateSubscriptionStatus = useMutation(api.subscriptions.updateStatus);
  const deleteOrderMutation = useMutation(api.orders.deleteOrder);
  const updateB2BStatus = useMutation(api.b2bLeads.updateStatus);
  const deleteB2BLead = useMutation(api.b2bLeads.deleteLead);

  // Check if data is loading
  const loading = metricsData === undefined || ordersData === undefined;
  const apiStatus = metricsData ? 'live' : 'mock';

  // Fetch GA4 data
  useEffect(() => {
    async function fetchGA4Data() {
      setGa4Loading(true);
      setGa4Error(null);

      try {
        // Check GA4 connection status
        const statusRes = await fetch(`${GA4_API_URL}?endpoint=status`);
        const statusData = await statusRes.json();

        if (!statusData.data?.connected) {
          setGa4Status('disconnected');
          setGa4Error(statusData.data?.message || statusData.error?.message || 'GA4 not configured');
          setGa4Loading(false);
          return;
        }

        // Fetch all GA4 data in parallel
        const [realtimeRes, overviewRes, trafficRes, pagesRes, devicesRes, countriesRes] = await Promise.all([
          fetch(`${GA4_API_URL}?endpoint=realtime`),
          fetch(`${GA4_API_URL}?endpoint=overview&range=${dateRange}`),
          fetch(`${GA4_API_URL}?endpoint=traffic&range=${dateRange}`),
          fetch(`${GA4_API_URL}?endpoint=pages&range=${dateRange}`),
          fetch(`${GA4_API_URL}?endpoint=devices&range=${dateRange}`),
          fetch(`${GA4_API_URL}?endpoint=countries&range=${dateRange}`)
        ]);

        const [realtime, overview, traffic, pages, devices, countries] = await Promise.all([
          realtimeRes.json(),
          overviewRes.json(),
          trafficRes.json(),
          pagesRes.json(),
          devicesRes.json(),
          countriesRes.json()
        ]);

        setGa4Data({
          realtime: realtime.data,
          overview: overview.data,
          trafficSources: traffic.data?.trafficSources || [],
          topPages: pages.data?.topPages || [],
          devices: devices.data?.devices || [],
          countries: countries.data?.countries || []
        });
        setGa4Status('connected');
      } catch (err) {
        console.warn('GA4 data fetch failed:', err.message);
        setGa4Status('disconnected');
        setGa4Error(err.message);
      } finally {
        setGa4Loading(false);
      }
    }

    fetchGA4Data();
  }, [dateRange]);

  // Handle order status change
  const handleStatusChange = async (orderId, newStatus) => {
    // Find the order to get its amount
    const currentOrders = ordersData?.recentOrders || [];
    const order = currentOrders.find(o => o.id === orderId);
    const orderAmount = order ? Number(order.amount) : 0;

    // Get the current status
    const currentStatus = orderStatuses[orderId] || (order ? order.status : null);

    // Calculate revenue adjustment
    let adjustment = 0;
    if (newStatus === 'completed' && currentStatus !== 'completed') {
      adjustment = orderAmount;
    } else if (currentStatus === 'completed' && newStatus !== 'completed') {
      adjustment = -orderAmount;
    }

    // Update revenue adjustment
    if (adjustment !== 0) {
      const newRevenueAdjustment = revenueAdjustment + adjustment;
      setRevenueAdjustment(newRevenueAdjustment);
      saveRevenueAdjustment(newRevenueAdjustment);
    }

    // Update local state
    const updatedStatuses = { ...orderStatuses, [orderId]: newStatus };
    setOrderStatuses(updatedStatuses);
    saveStatuses(updatedStatuses);

    // Update via Convex
    try {
      await updateOrderStatus({ orderNumber: orderId, status: newStatus });
    } catch (err) {
      console.warn('Status update failed:', err.message);
    }
  };

  // Handle order deletion
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete order ${orderId}? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteOrderMutation({ orderNumber: orderId });
      // Remove from local status cache
      const updatedStatuses = { ...orderStatuses };
      delete updatedStatuses[orderId];
      setOrderStatuses(updatedStatuses);
      saveStatuses(updatedStatuses);
    } catch (err) {
      console.error('Failed to delete order:', err.message);
      alert('Failed to delete order: ' + err.message);
    }
  };

  // Handle subscription status change
  const handleSubscriptionStatusChange = async (subscriptionId, newStatus) => {
    try {
      await updateSubscriptionStatus({ subscriptionNumber: subscriptionId, status: newStatus });
    } catch (err) {
      console.warn('Failed to update subscription status:', err.message);
    }
  };

  // Get subscriptions from Convex
  const subscriptions = subscriptionsData?.subscriptions || [];
  const subscriptionStats = {
    total: subscriptions.length,
    pending: subscriptions.filter(s => s.status === 'pending').length,
    contacted: subscriptions.filter(s => s.status === 'contacted').length,
    confirmed: subscriptions.filter(s => s.status === 'confirmed').length,
    active: subscriptions.filter(s => s.status === 'active').length,
    cancelled: subscriptions.filter(s => s.status === 'cancelled').length,
  };

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesStatus = subscriptionFilter === 'all' || sub.status === subscriptionFilter;
    const matchesSearch = subscriptionSearch === '' ||
      sub.id.toLowerCase().includes(subscriptionSearch.toLowerCase()) ||
      sub.name.toLowerCase().includes(subscriptionSearch.toLowerCase()) ||
      sub.phone.includes(subscriptionSearch) ||
      sub.email.toLowerCase().includes(subscriptionSearch.toLowerCase()) ||
      sub.plan_name.toLowerCase().includes(subscriptionSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Reset all order data
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all order data? This will clear all status changes and revenue adjustments.')) {
      clearAllData();
      setOrderStatuses({});
      setRevenueAdjustment(0);
    }
  };

  // Build display data from Convex queries
  const metrics = metricsData?.metrics || mockData.metrics;
  const userBehaviorTrend = trendsData?.userBehaviorTrend || mockData.userBehaviorTrend;
  const ordersTrend = trendsData?.ordersTrend || mockData.ordersTrend;
  const addToCartTrend = trendsData?.addToCartTrend || mockData.addToCartTrend;
  const emailSubmissionsTrend = trendsData?.emailSubmissionsTrend || mockData.emailSubmissionsTrend;
  const ordersByProduct = productsData?.ordersByProduct || mockData.ordersByProduct;
  const trafficSources = trafficData?.trafficSources || mockData.trafficSources;
  const emailSubscriptions = emailsData?.emailSubscriptions || mockData.emailSubscriptions || [];

  // Apply saved statuses to orders
  const recentOrders = (ordersData?.recentOrders || []).map(order => ({
    ...order,
    status: orderStatuses[order.id] || order.status
  }));

  // Filter orders
  const filteredOrders = recentOrders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = searchQuery === '' ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.phone || '').includes(searchQuery) ||
      (order.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.country || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Order statistics
  const orderStats = {
    total: recentOrders.length,
    pending: recentOrders.filter(o => o.status === 'pending').length,
    processing: recentOrders.filter(o => o.status === 'processing').length,
    shipped: recentOrders.filter(o => o.status === 'shipped').length,
    completed: recentOrders.filter(o => o.status === 'completed' || o.status === 'delivered').length,
    cancelled: recentOrders.filter(o => o.status === 'cancelled').length,
  };

  // Calculate adjusted metrics
  const adjustedRevenue = (metrics.revenue?.value || 0) + revenueAdjustment;
  const completedOrders = orderStats.completed;
  const totalUsers = metrics.totalUsers?.value || 0;
  const adjustedConversionRate = totalUsers > 0
    ? ((completedOrders / totalUsers) * 100).toFixed(1)
    : metrics.conversionRate?.value || 0;

  // Table column configurations
  const orderColumns = [
    { key: 'id', label: 'Order ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'product', label: 'Product' },
    {
      key: 'amount',
      label: 'Amount',
      align: 'right',
      render: (value, row) => `${row.currency === 'SAR' ? 'SAR ' : '$'}${Number(value).toFixed(2)}`
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, row) => (
        <StatusSelect
          status={value}
          orderId={row.id}
          onStatusChange={handleStatusChange}
        />
      )
    },
    { key: 'date', label: 'Date' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <button
          onClick={() => handleDeleteOrder(row.id)}
          className="px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
        >
          Delete
        </button>
      )
    }
  ];

  const trafficColumns = [
    { key: 'source', label: 'Source' },
    {
      key: 'visits',
      label: 'Visits',
      align: 'right',
      render: (value) => Number(value).toLocaleString()
    },
    {
      key: 'percentage',
      label: 'Share',
      align: 'right',
      render: (value) => `${value}%`
    }
  ];

  const emailColumns = [
    { key: 'email', label: 'Email Address' },
    { key: 'source', label: 'Source' },
    {
      key: 'subscribedAt',
      label: 'Subscribed Date',
      render: (value) => new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-heading/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + Title */}
            <div className="flex items-center gap-4">
              <img
                src="/logo.jpg"
                alt="ReachFood"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <h1 className="font-playfair text-xl font-bold text-heading">Dashboard</h1>
                <p className="text-xs text-heading-light">Analytics Overview</p>
              </div>
            </div>

            {/* Right: Status + Date Range + Back to Site */}
            <div className="flex items-center gap-4">
              {/* API Connection Status */}
              <div className="flex items-center gap-2">
                {loading ? (
                  <span className="text-xs text-heading-light">Loading...</span>
                ) : apiStatus === 'live' ? (
                  <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Live Data
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Demo Mode
                  </span>
                )}
              </div>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(Number(e.target.value))}
                className="px-4 py-2 bg-cream rounded-lg text-sm text-heading border-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
              >
                <option value={7}>Last 7 Days</option>
                <option value={30}>Last 30 Days</option>
                <option value={90}>Last 90 Days</option>
                <option value={365}>This Year</option>
              </select>
              <Link
                to="/"
                className="px-4 py-2 text-sm text-heading-light hover:text-primary transition-colors"
              >
                Back to Site
              </Link>
              <button
                onClick={handleResetData}
                className="px-4 py-2 text-sm text-white bg-gray-500 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Reset Data
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="font-playfair text-3xl font-bold text-heading">Business Overview</h2>
          <p className="text-heading-light mt-1">Key metrics and performance indicators</p>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <MetricCard
            label={metrics.totalUsers?.label || "Total Users"}
            value={metrics.totalUsers?.value || 0}
            change={metrics.totalUsers?.change || 0}
            trend={metrics.totalUsers?.trend || "up"}
            period={metrics.totalUsers?.period || `vs previous ${dateRange} days`}
          />
          <MetricCard
            label={metrics.addToCartEvents?.label || "Add to Cart"}
            value={metrics.addToCartEvents?.value || 0}
            change={metrics.addToCartEvents?.change || 0}
            trend={metrics.addToCartEvents?.trend || "up"}
            period={metrics.addToCartEvents?.period || `vs previous ${dateRange} days`}
          />
          <MetricCard
            label={metrics.emailSubmissions?.label || "Email Signups"}
            value={metrics.emailSubmissions?.value || 0}
            change={metrics.emailSubmissions?.change || 0}
            trend={metrics.emailSubmissions?.trend || "up"}
            period={metrics.emailSubmissions?.period || `vs previous ${dateRange} days`}
          />
          <MetricCard
            label={metrics.completedOrders?.label || "Orders"}
            value={completedOrders}
            change={metrics.completedOrders?.change || 0}
            trend={metrics.completedOrders?.trend || "up"}
            period={metrics.completedOrders?.period || `vs previous ${dateRange} days`}
          />
          <MetricCard
            label={metrics.revenue?.label || "Revenue"}
            value={adjustedRevenue}
            change={metrics.revenue?.change || 0}
            trend={revenueAdjustment >= 0 ? 'up' : 'down'}
            period={metrics.revenue?.period || `vs previous ${dateRange} days`}
            prefix={metrics.revenue?.prefix || "$"}
          />
          <MetricCard
            label={metrics.conversionRate?.label || "Conversion"}
            value={parseFloat(adjustedConversionRate)}
            change={metrics.conversionRate?.change || 0}
            trend={metrics.conversionRate?.trend || "up"}
            period={metrics.conversionRate?.period || `vs previous ${dateRange} days`}
            suffix={metrics.conversionRate?.suffix || "%"}
          />
        </div>

        {/* GA4 Analytics Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-playfair text-xl font-semibold text-heading">Google Analytics 4</h3>
              <p className="text-sm text-heading-light mt-1">Real-time and historical data from GA4</p>
            </div>
            <div className="flex items-center gap-2">
              {ga4Loading ? (
                <span className="text-xs text-heading-light">Loading GA4...</span>
              ) : ga4Status === 'connected' ? (
                <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  GA4 Connected
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  GA4 Disconnected
                </span>
              )}
            </div>
          </div>

          {ga4Status === 'connected' && ga4Data ? (
            <>
              {/* GA4 Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
                {/* Real-time Users */}
                <div className="bg-gradient-to-br from-primary to-primary-hover rounded-2xl p-4 text-white">
                  <p className="text-xs opacity-80 mb-1">Live Now</p>
                  <p className="text-3xl font-bold">{ga4Data.realtime?.activeUsers || 0}</p>
                  <p className="text-xs opacity-80 mt-1">active users</p>
                </div>

                {/* Overview Metrics */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-heading/10">
                  <p className="text-xs text-heading-light mb-1">Total Users</p>
                  <p className="text-2xl font-bold text-heading">{(ga4Data.overview?.users || 0).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-heading/10">
                  <p className="text-xs text-heading-light mb-1">New Users</p>
                  <p className="text-2xl font-bold text-heading">{(ga4Data.overview?.newUsers || 0).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-heading/10">
                  <p className="text-xs text-heading-light mb-1">Sessions</p>
                  <p className="text-2xl font-bold text-heading">{(ga4Data.overview?.sessions || 0).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-heading/10">
                  <p className="text-xs text-heading-light mb-1">Page Views</p>
                  <p className="text-2xl font-bold text-heading">{(ga4Data.overview?.pageViews || 0).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-heading/10">
                  <p className="text-xs text-heading-light mb-1">Avg. Duration</p>
                  <p className="text-2xl font-bold text-heading">{ga4Data.overview?.avgSessionDuration || '0'}s</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-heading/10">
                  <p className="text-xs text-heading-light mb-1">Bounce Rate</p>
                  <p className="text-2xl font-bold text-heading">{ga4Data.overview?.bounceRate || '0'}%</p>
                </div>
              </div>

              {/* GA4 Details Grid */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Top Pages */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-heading/10">
                  <h4 className="font-semibold text-heading mb-4">Top Pages</h4>
                  <div className="space-y-3">
                    {(ga4Data.topPages || []).slice(0, 5).map((page, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-heading truncate max-w-[180px]" title={page.page}>
                          {page.page}
                        </span>
                        <span className="text-sm font-medium text-heading-light">
                          {page.pageViews.toLocaleString()}
                        </span>
                      </div>
                    ))}
                    {(!ga4Data.topPages || ga4Data.topPages.length === 0) && (
                      <p className="text-sm text-heading-light">No page data yet</p>
                    )}
                  </div>
                </div>

                {/* Traffic Sources */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-heading/10">
                  <h4 className="font-semibold text-heading mb-4">Traffic Sources</h4>
                  <div className="space-y-3">
                    {(ga4Data.trafficSources || []).slice(0, 5).map((source, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-heading">{source.source}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-heading-light">
                            {source.sessions.toLocaleString()}
                          </span>
                          <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                            {source.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                    {(!ga4Data.trafficSources || ga4Data.trafficSources.length === 0) && (
                      <p className="text-sm text-heading-light">No traffic data yet</p>
                    )}
                  </div>
                </div>

                {/* Devices & Countries */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-heading/10">
                  <h4 className="font-semibold text-heading mb-4">Devices</h4>
                  <div className="space-y-2 mb-6">
                    {(ga4Data.devices || []).map((device, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-heading capitalize">{device.device}</span>
                            <span className="text-xs text-heading-light">{device.percentage}%</span>
                          </div>
                          <div className="h-2 bg-cream rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${device.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!ga4Data.devices || ga4Data.devices.length === 0) && (
                      <p className="text-sm text-heading-light">No device data yet</p>
                    )}
                  </div>

                  <h4 className="font-semibold text-heading mb-4">Top Countries</h4>
                  <div className="space-y-2">
                    {(ga4Data.countries || []).slice(0, 4).map((country, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-heading">{country.country}</span>
                        <span className="text-sm font-medium text-heading-light">
                          {country.users.toLocaleString()} users
                        </span>
                      </div>
                    ))}
                    {(!ga4Data.countries || ga4Data.countries.length === 0) && (
                      <p className="text-sm text-heading-light">No country data yet</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-heading/10 text-center">
              {ga4Loading ? (
                <div className="animate-pulse">
                  <div className="h-8 w-48 bg-cream rounded mx-auto mb-2"></div>
                  <div className="h-4 w-64 bg-cream rounded mx-auto"></div>
                </div>
              ) : (
                <>
                  <p className="text-heading-light mb-2">GA4 is not connected</p>
                  <p className="text-sm text-heading-light">
                    {ga4Error || 'Configure GA4_PROPERTY_ID and credentials in your Vercel environment'}
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Charts Section - Row 1 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <LineChart
            data={userBehaviorTrend}
            dataKey="pageViews"
            secondaryData={userBehaviorTrend}
            secondaryKey="uniqueVisitors"
            label="User Behavior Trend"
            color="#E8862A"
            secondaryColor="#0D4A52"
          />
          <AreaChart
            data={ordersTrend}
            dataKey="revenue"
            label="Revenue Trend"
            color="#0D4A52"
            prefix="$"
          />
        </div>

        {/* Charts Section - Row 2 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <BarChart
            data={ordersByProduct}
            nameKey="name"
            valueKey="orders"
            label="Orders by Product"
            color="#E8862A"
          />
          <LineChart
            data={emailSubmissionsTrend}
            dataKey="value"
            label="Email Signups Trend"
            color="#1A5F6A"
          />
        </div>

        {/* Order Management Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h3 className="font-playfair text-xl font-semibold text-heading">Order Management</h3>
                <p className="text-sm text-heading-light mt-1">Track and manage all customer orders</p>
              </div>

              {/* Order Stats */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === 'all' ? 'bg-heading text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  All ({orderStats.total})
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === 'pending' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Pending ({orderStats.pending})
                </button>
                <button
                  onClick={() => setStatusFilter('processing')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === 'processing' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                >
                  Processing ({orderStats.processing})
                </button>
                <button
                  onClick={() => setStatusFilter('shipped')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === 'shipped' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                >
                  Shipped ({orderStats.shipped})
                </button>
                <button
                  onClick={() => setStatusFilter('completed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === 'completed' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                >
                  Completed ({orderStats.completed})
                </button>
                <button
                  onClick={() => setStatusFilter('cancelled')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === 'cancelled' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                >
                  Cancelled ({orderStats.cancelled})
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by Order ID, Customer, Phone, Location, or Country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-cream rounded-lg text-sm text-heading border-none focus:ring-2 focus:ring-primary/30 placeholder:text-heading-light"
              />
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-heading/10">
                    {orderColumns.map((col, i) => (
                      <th
                        key={i}
                        className={`text-left text-xs font-semibold text-heading-light uppercase tracking-wider py-3 px-2 first:pl-0 last:pr-0 ${col.align === 'right' ? 'text-right' : ''}`}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={orderColumns.length} className="py-8 text-center text-heading-light">
                        No orders found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="border-b border-heading/5 hover:bg-cream/50 transition-colors"
                      >
                        {orderColumns.map((col, colIndex) => {
                          const value = order[col.key];
                          const displayValue = col.render ? col.render(value, order) : value;
                          return (
                            <td
                              key={colIndex}
                              className={`py-3 px-2 text-sm text-heading first:pl-0 last:pr-0 whitespace-nowrap ${col.align === 'right' ? 'text-right' : ''}`}
                            >
                              {displayValue}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Results count */}
            <div className="mt-4 pt-3 border-t border-heading/10 flex justify-between items-center">
              <p className="text-xs text-heading-light">
                Showing {filteredOrders.length} of {recentOrders.length} orders
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-primary hover:text-primary-hover"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Meal Plan Subscriptions */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h3 className="font-playfair text-xl font-semibold text-heading">Meal Plan Subscriptions</h3>
                <p className="text-sm text-heading-light mt-1">Manage subscription requests from the Offers page</p>
              </div>

              {/* Subscription Stats */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSubscriptionFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${subscriptionFilter === 'all' ? 'bg-heading text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  All ({subscriptionStats.total || 0})
                </button>
                <button
                  onClick={() => setSubscriptionFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${subscriptionFilter === 'pending' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Pending ({subscriptionStats.pending || 0})
                </button>
                <button
                  onClick={() => setSubscriptionFilter('contacted')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${subscriptionFilter === 'contacted' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                >
                  Contacted ({subscriptionStats.contacted || 0})
                </button>
                <button
                  onClick={() => setSubscriptionFilter('confirmed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${subscriptionFilter === 'confirmed' ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
                >
                  Confirmed ({subscriptionStats.confirmed || 0})
                </button>
                <button
                  onClick={() => setSubscriptionFilter('active')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${subscriptionFilter === 'active' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                >
                  Active ({subscriptionStats.active || 0})
                </button>
                <button
                  onClick={() => setSubscriptionFilter('cancelled')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${subscriptionFilter === 'cancelled' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                >
                  Cancelled ({subscriptionStats.cancelled || 0})
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by ID, Name, Phone, Email, or Plan..."
                value={subscriptionSearch}
                onChange={(e) => setSubscriptionSearch(e.target.value)}
                className="w-full px-4 py-2.5 bg-cream rounded-lg text-sm text-heading border-none focus:ring-2 focus:ring-primary/30 placeholder:text-heading-light"
              />
            </div>

            {/* Subscriptions Table */}
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-heading/10">
                    <th className="text-left text-xs font-semibold text-heading-light uppercase tracking-wider py-3 px-2">ID</th>
                    <th className="text-left text-xs font-semibold text-heading-light uppercase tracking-wider py-3 px-2">Customer</th>
                    <th className="text-left text-xs font-semibold text-heading-light uppercase tracking-wider py-3 px-2">Phone</th>
                    <th className="text-left text-xs font-semibold text-heading-light uppercase tracking-wider py-3 px-2">Email</th>
                    <th className="text-left text-xs font-semibold text-heading-light uppercase tracking-wider py-3 px-2">Plan</th>
                    <th className="text-right text-xs font-semibold text-heading-light uppercase tracking-wider py-3 px-2">Price</th>
                    <th className="text-left text-xs font-semibold text-heading-light uppercase tracking-wider py-3 px-2">Status</th>
                    <th className="text-left text-xs font-semibold text-heading-light uppercase tracking-wider py-3 px-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-heading-light">
                        {subscriptions.length === 0 ? 'No subscription requests yet' : 'No subscriptions match your criteria'}
                      </td>
                    </tr>
                  ) : (
                    filteredSubscriptions.map((sub) => (
                      <tr key={sub.id} className="border-b border-heading/5 hover:bg-cream/50 transition-colors">
                        <td className="py-3 px-2 text-sm text-heading font-mono">{sub.id}</td>
                        <td className="py-3 px-2 text-sm text-heading font-medium">{sub.name}</td>
                        <td className="py-3 px-2 text-sm text-heading">{sub.phone}</td>
                        <td className="py-3 px-2 text-sm text-heading">{sub.email}</td>
                        <td className="py-3 px-2 text-sm text-heading">
                          <div>
                            <span className="font-medium">{sub.plan_name}</span>
                            <span className="text-heading-light text-xs block">{sub.meals_per_day} meals/day - {sub.total_meals} total</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-sm text-heading text-right font-medium">
                          {sub.currency === 'SAR' ? `${sub.price_sar} SAR` : `$${sub.price_usd}`}
                        </td>
                        <td className="py-3 px-2">
                          <select
                            value={sub.status}
                            onChange={(e) => handleSubscriptionStatusChange(sub.id, e.target.value)}
                            className={`px-2 py-1 rounded-lg text-xs font-medium border-none cursor-pointer focus:ring-2 focus:ring-primary/30 ${
                              sub.status === 'pending' ? 'bg-gray-100 text-gray-700' :
                              sub.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                              sub.status === 'confirmed' ? 'bg-purple-100 text-purple-700' :
                              sub.status === 'active' ? 'bg-green-100 text-green-700' :
                              sub.status === 'completed' ? 'bg-teal-100 text-teal-700' :
                              'bg-red-100 text-red-700'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-2 text-sm text-heading-light">{sub.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Results count */}
            <div className="mt-4 pt-3 border-t border-heading/10 flex justify-between items-center">
              <p className="text-xs text-heading-light">
                Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions
              </p>
              {subscriptionSearch && (
                <button
                  onClick={() => setSubscriptionSearch('')}
                  className="text-xs text-primary hover:text-primary-hover"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Email Subscriptions */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-heading/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-playfair text-xl font-semibold text-heading">Email Subscriptions</h3>
                <p className="text-sm text-heading-light mt-1">
                  Newsletter subscribers ({emailSubscriptions.length || 0} total)
                </p>
              </div>
            </div>

            <DataTable
              columns={emailColumns}
              data={emailSubscriptions}
            />
          </div>
        </div>

        {/* B2B Leads */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-heading/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-playfair text-xl font-semibold text-heading">B2B Leads</h3>
                <p className="text-sm text-heading-light mt-1">
                  Restaurant & business partner inquiries ({b2bLeadsData?.total || 0} total)
                </p>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                  New: {b2bLeadsData?.leads?.filter(l => l.status === 'new').length || 0}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                  Converted: {b2bLeadsData?.leads?.filter(l => l.status === 'converted').length || 0}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-heading/10">
                    <th className="text-left text-xs font-semibold text-heading-light uppercase tracking-wider py-3 px-2">Email</th>
                    <th className="text-left text-xs font-semibold text-heading-light uppercase tracking-wider py-3 px-2">Business</th>
                    <th className="text-left text-xs font-semibold text-heading-light uppercase tracking-wider py-3 px-2">Source</th>
                    <th className="text-left text-xs font-semibold text-heading-light uppercase tracking-wider py-3 px-2">Status</th>
                    <th className="text-left text-xs font-semibold text-heading-light uppercase tracking-wider py-3 px-2">Date</th>
                    <th className="text-left text-xs font-semibold text-heading-light uppercase tracking-wider py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(!b2bLeadsData?.leads || b2bLeadsData.leads.length === 0) ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-heading-light">
                        No B2B leads yet
                      </td>
                    </tr>
                  ) : (
                    b2bLeadsData.leads.map((lead) => (
                      <tr key={lead.id} className="border-b border-heading/5 hover:bg-cream/50 transition-colors">
                        <td className="py-3 px-2 text-sm text-heading">{lead.email}</td>
                        <td className="py-3 px-2 text-sm text-heading">{lead.businessName}</td>
                        <td className="py-3 px-2 text-sm text-heading-light">{lead.source}</td>
                        <td className="py-3 px-2">
                          <select
                            value={lead.status}
                            onChange={(e) => updateB2BStatus({ id: lead.id, status: e.target.value })}
                            className={`px-2 py-1 rounded-lg text-xs font-medium border-none cursor-pointer focus:ring-2 focus:ring-primary/30 ${
                              lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                              lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                              lead.status === 'qualified' ? 'bg-purple-100 text-purple-700' :
                              lead.status === 'converted' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="converted">Converted</option>
                            <option value="not_interested">Not Interested</option>
                          </select>
                        </td>
                        <td className="py-3 px-2 text-sm text-heading-light">{lead.date}</td>
                        <td className="py-3 px-2">
                          <button
                            onClick={() => {
                              if (window.confirm('Delete this lead?')) {
                                deleteB2BLead({ id: lead.id });
                              }
                            }}
                            className="px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="grid lg:grid-cols-2 gap-6">
          <DataTable
            title="Traffic Sources"
            columns={trafficColumns}
            data={trafficSources}
          />
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-heading/10 text-center">
          <p className="text-sm text-heading-light">
            ReachFood Analytics Dashboard
          </p>
          <p className="text-xs text-heading-light mt-1">
            {apiStatus === 'live'
              ? 'Live data from Convex'
              : 'Demo mode - Check Convex connection'}
          </p>
        </div>
      </main>
    </div>
  );
}
