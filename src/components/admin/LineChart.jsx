// LineChart - Custom SVG line chart for trends

export default function LineChart({ data, dataKey, label, color = '#E8862A', secondaryData, secondaryKey, secondaryColor = '#0D4A52' }) {
  if (!data || data.length === 0) return null;

  const width = 400;
  const height = 200;
  const paddingX = 8;
  const paddingY = 16;

  // Get values from data
  const values = data.map(d => d[dataKey] || d.value || 0);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  // Generate smooth bezier curve path
  const generateSmoothPath = (vals, valMin, valRange) => {
    const points = vals.map((value, i) => ({
      x: paddingX + (i / (vals.length - 1)) * (width - paddingX * 2),
      y: paddingY + (1 - (value - valMin) / valRange) * (height - paddingY * 2)
    }));

    if (points.length < 2) return '';

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const tension = 0.3;
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return path;
  };

  const linePath = generateSmoothPath(values, min, range);

  // Secondary line
  let secondaryPath = '';
  let secondaryValues = [];
  if (secondaryData && secondaryKey) {
    secondaryValues = secondaryData.map(d => d[secondaryKey] || 0);
    const secMax = Math.max(...secondaryValues);
    const secMin = Math.min(...secondaryValues);
    const secRange = secMax - secMin || 1;
    secondaryPath = generateSmoothPath(secondaryValues, secMin, secRange);
  }

  // Generate area path
  const areaPath = linePath ? `${linePath} L ${width - paddingX} ${height - paddingY} L ${paddingX} ${height - paddingY} Z` : '';

  // Unique gradient ID
  const gradientId = `lineGradient-${label?.replace(/\s+/g, '-') || 'default'}`;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-playfair text-lg font-semibold text-heading mb-4">{label}</h3>

      {/* Legend */}
      <div className="flex gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></div>
          <span className="text-heading-light text-xs">{dataKey || 'Value'}</span>
        </div>
        {secondaryKey && (
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: secondaryColor }}></div>
            <span className="text-heading-light text-xs">{secondaryKey}</span>
          </div>
        )}
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.12" />
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
        {areaPath && (
          <path d={areaPath} fill={`url(#${gradientId})`} />
        )}

        {/* Main line */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Secondary line */}
        {secondaryPath && (
          <path
            d={secondaryPath}
            fill="none"
            stroke={secondaryColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="6 4"
            opacity="0.8"
          />
        )}

        {/* End point dot */}
        {values.length > 0 && (
          <circle
            cx={width - paddingX}
            cy={paddingY + (1 - (values[values.length - 1] - min) / range) * (height - paddingY * 2)}
            r="4"
            fill="white"
            stroke={color}
            strokeWidth="2"
          />
        )}
      </svg>

      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-heading-light mt-2">
        <span>30 days ago</span>
        <span>Today</span>
      </div>

      {/* Stats */}
      <div className="flex justify-between mt-4 pt-4 border-t border-heading/10">
        <div>
          <p className="text-xs text-heading-light">Min</p>
          <p className="font-semibold text-heading">{min.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-heading-light">Max</p>
          <p className="font-semibold text-heading">{max.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-heading-light">Current</p>
          <p className="font-semibold text-heading">{values[values.length - 1]?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
