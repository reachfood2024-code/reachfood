// AreaChart - Custom SVG area chart with gradient fill for revenue trends

export default function AreaChart({ data, dataKey, label, color = '#E8862A', prefix = '', suffix = '' }) {
  if (!data || data.length === 0) return null;

  const width = 400;
  const height = 220;
  const paddingX = 8;
  const paddingY = 16;

  // Get values from data
  const values = data.map(d => d[dataKey] || d.value || 0);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  // Calculate total
  const total = values.reduce((sum, v) => sum + v, 0);
  const average = Math.round(total / values.length);

  // Generate smooth bezier curve path using Catmull-Rom spline
  const generateSmoothPath = (vals) => {
    const points = vals.map((value, i) => ({
      x: paddingX + (i / (vals.length - 1)) * (width - paddingX * 2),
      y: paddingY + (1 - (value - min) / range) * (height - paddingY * 2)
    }));

    if (points.length < 2) return '';

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      // Catmull-Rom to Cubic Bezier conversion
      const tension = 0.3;
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return path;
  };

  const linePath = generateSmoothPath(values);

  // Generate area path
  const areaPath = `${linePath} L ${width - paddingX} ${height - paddingY} L ${paddingX} ${height - paddingY} Z`;

  // Unique gradient ID
  const gradientId = `areaGradient-${label?.replace(/\s+/g, '-') || 'default'}`;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-playfair text-lg font-semibold text-heading">{label}</h3>
        <div className="text-right">
          <p className="font-playfair text-2xl font-bold text-heading">
            {prefix}{total.toLocaleString()}{suffix}
          </p>
          <p className="text-xs text-heading-light">Total (30 days)</p>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="60%" stopColor={color} stopOpacity="0.08" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <line
            key={i}
            x1={paddingX}
            y1={paddingY + ratio * (height - paddingY * 2)}
            x2={width - paddingX}
            y2={paddingY + ratio * (height - paddingY * 2)}
            stroke="#E5E7EB"
            strokeWidth="1"
          />
        ))}

        {/* Area fill */}
        <path d={areaPath} fill={`url(#${gradientId})`} />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* End point dot */}
        {values.length > 0 && (
          <circle
            cx={width - paddingX}
            cy={paddingY + (1 - (values[values.length - 1] - min) / range) * (height - paddingY * 2)}
            r="5"
            fill="white"
            stroke={color}
            strokeWidth="2"
          />
        )}
      </svg>

      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-heading-light mt-2">
        <span>30 days ago</span>
        <span>15 days ago</span>
        <span>Today</span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-heading/10">
        <div>
          <p className="text-xs text-heading-light">Daily Avg</p>
          <p className="font-semibold text-heading">{prefix}{average.toLocaleString()}{suffix}</p>
        </div>
        <div>
          <p className="text-xs text-heading-light">Peak</p>
          <p className="font-semibold text-heading">{prefix}{max.toLocaleString()}{suffix}</p>
        </div>
        <div>
          <p className="text-xs text-heading-light">Latest</p>
          <p className="font-semibold text-heading">{prefix}{values[values.length - 1]?.toLocaleString()}{suffix}</p>
        </div>
      </div>
    </div>
  );
}
