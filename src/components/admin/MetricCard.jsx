// MetricCard - KPI card with trend indicator

import StatBadge from './StatBadge';

export default function MetricCard({ label, value, change, trend, period, prefix = '', suffix = '' }) {
  // Format large numbers with commas
  const formatValue = (val) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <p className="text-heading-light text-sm font-medium">{label}</p>
        <StatBadge value={change} trend={trend} />
      </div>
      <p className="font-playfair text-2xl lg:text-3xl font-bold text-heading">
        {prefix}{formatValue(value)}{suffix}
      </p>
      <p className="text-xs text-heading-light mt-2">{period}</p>
    </div>
  );
}
