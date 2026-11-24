
function DataTable({ columns, data, getRowKey }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {columns.map((column) => (
              <th key={column.key} className="px-3 py-2.5">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {data.length ? (
            data.map((row) => (
              <tr
                key={getRowKey(row)}
                className="transition hover:bg-slate-50"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-3 py-2.5 text-slate-600">
                    {column.render
                      ? column.render(row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 py-10 text-center text-slate-400"
              >
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;