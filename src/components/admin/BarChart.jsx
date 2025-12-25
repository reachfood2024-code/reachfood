// BarChart - Custom horizontal bar chart for comparisons

export default function BarChart({ data, nameKey = 'name', valueKey = 'value', label, color = '#E8862A', prefix = '', suffix = '' }) {
  if (!data || data.length === 0) return null;

  const values = data.map(d => d[valueKey] || 0);
  const max = Math.max(...values);
  const total = values.reduce((sum, v) => sum + v, 0);

  // Color variations for bars
  const colors = [
    '#E8862A', // Primary orange
    '#0D4A52', // Heading teal
    '#1A5F6A', // Teal light
    '#D4771F', // Primary hover
    '#2A7A8A', // Extra teal
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <h3 className="font-playfair text-lg font-semibold text-heading">{label}</h3>
        <div className="text-right">
          <p className="font-playfair text-xl font-bold text-heading">
            {prefix}{total.toLocaleString()}{suffix}
          </p>
          <p className="text-xs text-heading-light">Total</p>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item, i) => {
          const value = item[valueKey] || 0;
          const percentage = max > 0 ? (value / max) * 100 : 0;
          const sharePercentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          const barColor = colors[i % colors.length];

          return (
            <div key={i} className="group">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-medium text-heading truncate max-w-[60%]">
                  {item[nameKey]}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-heading">
                    {prefix}{value.toLocaleString()}{suffix}
                  </span>
                  <span className="text-xs text-heading-light w-12 text-right">
                    {sharePercentage}%
                  </span>
                </div>
              </div>
              <div className="h-3 bg-cream rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out group-hover:opacity-80"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: barColor
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary stats */}
      <div className="flex justify-between mt-6 pt-4 border-t border-heading/10 text-sm">
        <div>
          <p className="text-heading-light">Items</p>
          <p className="font-semibold text-heading">{data.length}</p>
        </div>
        <div>
          <p className="text-heading-light">Average</p>
          <p className="font-semibold text-heading">
            {prefix}{Math.round(total / data.length).toLocaleString()}{suffix}
          </p>
        </div>
        <div>
          <p className="text-heading-light">Top</p>
          <p className="font-semibold text-heading">{data[0]?.[nameKey]}</p>
        </div>
      </div>
    </div>
  );
}
