// Admin Dashboard - Analytics Overview for Investors
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MetricCard from '../../components/admin/MetricCard';
import LineChart from '../../components/admin/LineChart';
import AreaChart from '../../components/admin/AreaChart';
import BarChart from '../../components/admin/BarChart';
import DataTable, { StatusSelect } from '../../components/admin/DataTable';
import { useAdminAuth } from '../../components/admin/AdminAuth';
// Fallback mock data for when API is unavailable
import { dashboardData as mockData } from '../../data/dashboardMockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

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
  const [dateRange, setDateRange] = useState('30');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking'); // 'live', 'mock', 'checking'
  const [data, setData] = useState(null);
  const [orderStatuses, setOrderStatuses] = useState(loadSavedStatuses);
  const [revenueAdjustment, setRevenueAdjustment] = useState(loadRevenueAdjustment);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Subscriptions State
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionStats, setSubscriptionStats] = useState({});
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');
  const [subscriptionSearch, setSubscriptionSearch] = useState('');

  // GA4 Data State
  const [ga4Data, setGa4Data] = useState(null);
  const [ga4Status, setGa4Status] = useState('checking'); // 'connected', 'disconnected', 'checking'
  const [ga4Loading, setGa4Loading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        // Fetch all data in parallel
        const [metricsRes, trendsRes, productsRes, trafficRes, ordersRes, emailsRes, subscriptionsRes] = await Promise.all([
          fetch(`${API_URL}/metrics/summary?range=${dateRange}`),
          fetch(`${API_URL}/metrics/trends?range=${dateRange}`),
          fetch(`${API_URL}/metrics/products?range=${dateRange}`),
          fetch(`${API_URL}/metrics/traffic?range=${dateRange}`),
          fetch(`${API_URL}/orders?limit=8`),
          fetch(`${API_URL}/metrics/emails?limit=100`),
          fetch(`${API_URL}/subscriptions?limit=50`)
        ]);

        // Check if all responses are OK
        if (!metricsRes.ok || !trendsRes.ok || !productsRes.ok || !trafficRes.ok || !ordersRes.ok || !emailsRes.ok) {
          throw new Error('API request failed');
        }

        const [metrics, trends, products, traffic, orders, emails, subscriptionsData] = await Promise.all([
          metricsRes.json(),
          trendsRes.json(),
          productsRes.json(),
          trafficRes.json(),
          ordersRes.json(),
          emailsRes.json(),
          subscriptionsRes.ok ? subscriptionsRes.json() : { data: { subscriptions: [], stats: {} } }
        ]);

        // Set subscriptions data
        if (subscriptionsData.data) {
          setSubscriptions(subscriptionsData.data.subscriptions || []);
          setSubscriptionStats(subscriptionsData.data.stats || {});
        }

        setData({
          metrics: metrics.data.metrics,
          ...trends.data,
          ...products.data,
          ...traffic.data,
          ...orders.data,
          ...emails.data
        });
        setApiStatus('live');
        setError(null);
      } catch (err) {
        console.warn('API unavailable, using mock data:', err.message);
        setError('Using demo data - API not connected');
        setApiStatus('mock');
        // Use mock data as fallback
        setData(mockData);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [dateRange]);

  // Handle order status change with revenue sync
  const handleStatusChange = async (orderId, newStatus) => {
    // Find the order to get its amount
    const currentData = data || mockData;
    const order = (currentData.recentOrders || []).find(o => o.id === orderId);
    const orderAmount = order ? Number(order.amount) : 0;

    // Get the current status (from saved statuses or original order status)
    const currentStatus = orderStatuses[orderId] || (order ? order.status : null);

    // Calculate revenue adjustment based on status transition
    let adjustment = 0;

    // If changing TO completed from any non-completed status, add revenue
    if (newStatus === 'completed' && currentStatus !== 'completed') {
      adjustment = orderAmount;
    }
    // If changing FROM completed to any other status (especially cancelled), remove revenue
    else if (currentStatus === 'completed' && newStatus !== 'completed') {
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

    // Try to update via API
    try {
      await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.warn('API update failed, status saved locally:', err.message);
    }
  };

  // Handle subscription status change
  const handleSubscriptionStatusChange = async (subscriptionId, newStatus) => {
    try {
      await fetch(`${API_URL}/subscriptions/${subscriptionId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      // Update local state
      setSubscriptions(prev =>
        prev.map(sub =>
          sub.id === subscriptionId ? { ...sub, status: newStatus } : sub
        )
      );

      // Update stats
      setSubscriptionStats(prev => {
        const oldStatus = subscriptions.find(s => s.id === subscriptionId)?.status;
        if (oldStatus && oldStatus !== newStatus) {
          return {
            ...prev,
            [oldStatus]: Math.max(0, (parseInt(prev[oldStatus]) || 0) - 1),
            [newStatus]: (parseInt(prev[newStatus]) || 0) + 1
          };
        }
        return prev;
      });
    } catch (err) {
      console.warn('Failed to update subscription status:', err.message);
    }
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

  // Reset all order data to fresh state
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all order data? This will clear all status changes and revenue adjustments.')) {
      clearAllData();
      setOrderStatuses({});
      setRevenueAdjustment(0);
    }
  };

  // Use mock data while loading or if no data
  const displayData = data || mockData;
  const { metrics, userBehaviorTrend, ordersTrend, addToCartTrend, emailSubmissionsTrend, ordersByProduct, trafficSources } = displayData;

  // Apply saved statuses to orders
  const recentOrders = (displayData.recentOrders || []).map(order => ({
    ...order,
    status: orderStatuses[order.id] || order.status
  }));

  // Filter orders based on status and search
  const filteredOrders = recentOrders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = searchQuery === '' ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery) ||
      order.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Order statistics
  const orderStats = {
    total: recentOrders.length,
    pending: recentOrders.filter(o => o.status === 'pending').length,
    processing: recentOrders.filter(o => o.status === 'processing').length,
    shipped: recentOrders.filter(o => o.status === 'shipped').length,
    completed: recentOrders.filter(o => o.status === 'completed').length,
    cancelled: recentOrders.filter(o => o.status === 'cancelled').length,
  };

  // Calculate dynamic metrics based on order statuses
  const adjustedRevenue = (metrics.revenue.value || 0) + revenueAdjustment;
  const totalOrders = recentOrders.length;
  const completedOrders = orderStats.completed;
  // Conversion rate = (completed orders / total users) * 100
  const baseConversionRate = metrics.conversionRate.value || 0;
  const adjustedConversionRate = totalOrders > 0
    ? ((completedOrders / metrics.totalUsers.value) * 100).toFixed(1)
    : baseConversionRate;

  // Table column configurations
  const orderColumns = [
    { key: 'id', label: 'Order ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'product', label: 'Product' },
    { key: 'phone', label: 'Phone' },
    { key: 'location', label: 'Location' },
    { key: 'country', label: 'Country' },
    {
      key: 'amount',
      label: 'Amount',
      align: 'right',
      render: (value) => `$${Number(value).toFixed(2)}`
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
    { key: 'date', label: 'Date' }
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
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 bg-cream rounded-lg text-sm text-heading border-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="365">This Year</option>
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
            label={metrics.totalUsers.label}
            value={metrics.totalUsers.value}
            change={metrics.totalUsers.change}
            trend={metrics.totalUsers.trend}
            period={metrics.totalUsers.period}
          />
          <MetricCard
            label={metrics.addToCartEvents.label}
            value={metrics.addToCartEvents.value}
            change={metrics.addToCartEvents.change}
            trend={metrics.addToCartEvents.trend}
            period={metrics.addToCartEvents.period}
          />
          <MetricCard
            label={metrics.emailSubmissions.label}
            value={metrics.emailSubmissions.value}
            change={metrics.emailSubmissions.change}
            trend={metrics.emailSubmissions.trend}
            period={metrics.emailSubmissions.period}
          />
          <MetricCard
            label={metrics.completedOrders.label}
            value={completedOrders}
            change={metrics.completedOrders.change}
            trend={metrics.completedOrders.trend}
            period={metrics.completedOrders.period}
          />
          <MetricCard
            label={metrics.revenue.label}
            value={adjustedRevenue}
            change={metrics.revenue.change}
            trend={revenueAdjustment >= 0 ? 'up' : 'down'}
            period={metrics.revenue.period}
            prefix={metrics.revenue.prefix}
          />
          <MetricCard
            label={metrics.conversionRate.label}
            value={parseFloat(adjustedConversionRate)}
            change={metrics.conversionRate.change}
            trend={metrics.conversionRate.trend}
            period={metrics.conversionRate.period}
            suffix={metrics.conversionRate.suffix}
          />
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
                  Newsletter subscribers ({displayData.emailSubscriptions?.length || 0} total)
                </p>
              </div>
            </div>

            <DataTable
              columns={emailColumns}
              data={displayData.emailSubscriptions || []}
            />
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
              ? `Live data from ${API_URL.replace('/api/v1', '')}`
              : 'Demo mode - Check API connection'}
          </p>
        </div>
      </main>
    </div>
  );
}
