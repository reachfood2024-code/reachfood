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

// LocalStorage key for order status persistence
const ORDER_STATUS_KEY = 'reachfood_order_statuses';

// Load saved order statuses from localStorage
const loadSavedStatuses = () => {
  try {
    const saved = localStorage.getItem(ORDER_STATUS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
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

export default function Dashboard() {
  const { handleLogout } = useAdminAuth();
  const [dateRange, setDateRange] = useState('30');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [orderStatuses, setOrderStatuses] = useState(loadSavedStatuses);

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        // Fetch all data in parallel
        const [metricsRes, trendsRes, productsRes, trafficRes, ordersRes] = await Promise.all([
          fetch(`${API_URL}/metrics/summary?range=${dateRange}`),
          fetch(`${API_URL}/metrics/trends?range=${dateRange}`),
          fetch(`${API_URL}/metrics/products?range=${dateRange}`),
          fetch(`${API_URL}/metrics/traffic?range=${dateRange}`),
          fetch(`${API_URL}/orders?limit=8`)
        ]);

        // Check if all responses are OK
        if (!metricsRes.ok || !trendsRes.ok || !productsRes.ok || !trafficRes.ok || !ordersRes.ok) {
          throw new Error('API request failed');
        }

        const [metrics, trends, products, traffic, orders] = await Promise.all([
          metricsRes.json(),
          trendsRes.json(),
          productsRes.json(),
          trafficRes.json(),
          ordersRes.json()
        ]);

        setData({
          metrics: metrics.data.metrics,
          ...trends.data,
          ...products.data,
          ...traffic.data,
          ...orders.data
        });
      } catch (err) {
        console.warn('API unavailable, using mock data:', err.message);
        setError('Using demo data - API not connected');
        // Use mock data as fallback
        setData(mockData);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [dateRange]);

  // Handle order status change
  const handleStatusChange = async (orderId, newStatus) => {
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

  // Use mock data while loading or if no data
  const displayData = data || mockData;
  const { metrics, userBehaviorTrend, ordersTrend, addToCartTrend, emailSubmissionsTrend, ordersByProduct, trafficSources } = displayData;

  // Apply saved statuses to orders
  const recentOrders = (displayData.recentOrders || []).map(order => ({
    ...order,
    status: orderStatuses[order.id] || order.status
  }));

  // Table column configurations
  const orderColumns = [
    { key: 'id', label: 'Order ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'product', label: 'Product' },
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
              {error && (
                <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                  {error}
                </span>
              )}
              {loading && (
                <span className="text-xs text-heading-light">Loading...</span>
              )}
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
            value={metrics.completedOrders.value}
            change={metrics.completedOrders.change}
            trend={metrics.completedOrders.trend}
            period={metrics.completedOrders.period}
          />
          <MetricCard
            label={metrics.revenue.label}
            value={metrics.revenue.value}
            change={metrics.revenue.change}
            trend={metrics.revenue.trend}
            period={metrics.revenue.period}
            prefix={metrics.revenue.prefix}
          />
          <MetricCard
            label={metrics.conversionRate.label}
            value={metrics.conversionRate.value}
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

        {/* Tables Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          <DataTable
            title="Recent Orders"
            columns={orderColumns}
            data={recentOrders}
          />
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
            {data === mockData ? 'Demo mode - Connect API for live data' : 'Live data from API'}
          </p>
        </div>
      </main>
    </div>
  );
}
