// StatBadge - Displays percentage change with color coding

export default function StatBadge({ value, trend }) {
  const isPositive = trend === 'up';

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
        isPositive
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
      }`}
    >
      {isPositive ? '+' : ''}{value}%
    </span>
  );
}
