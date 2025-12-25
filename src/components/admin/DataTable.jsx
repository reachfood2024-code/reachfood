// DataTable - Reusable table component for dashboard

export default function DataTable({ title, columns, data, onViewAll }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-playfair text-lg font-semibold text-heading mb-4">{title}</h3>
        <p className="text-heading-light text-sm">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-playfair text-lg font-semibold text-heading">{title}</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-primary hover:text-primary-hover font-medium transition-colors"
          >
            View All
          </button>
        )}
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full min-w-[400px]">
          <thead>
            <tr className="border-b border-heading/10">
              {columns.map((col, i) => (
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
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-heading/5 hover:bg-cream/50 transition-colors"
              >
                {columns.map((col, colIndex) => {
                  const value = row[col.key];
                  const displayValue = col.render ? col.render(value, row) : value;

                  return (
                    <td
                      key={colIndex}
                      className={`py-3 px-2 text-sm text-heading first:pl-0 last:pr-0 ${col.align === 'right' ? 'text-right' : ''}`}
                    >
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Row count */}
      <div className="mt-4 pt-3 border-t border-heading/10">
        <p className="text-xs text-heading-light">
          Showing {data.length} {data.length === 1 ? 'item' : 'items'}
        </p>
      </div>
    </div>
  );
}

// Status badge helper component
export function StatusBadge({ status }) {
  const statusStyles = {
    completed: 'bg-green-100 text-green-700',
    processing: 'bg-yellow-100 text-yellow-700',
    shipped: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
    pending: 'bg-gray-100 text-gray-700'
  };

  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyles[status] || statusStyles.pending}`}>
      {status}
    </span>
  );
}
