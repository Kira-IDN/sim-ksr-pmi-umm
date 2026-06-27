import React from 'react';
import { cn } from '@/utils/cn';

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  className?: string;
}

export function DataTable<T>({ data, columns, keyExtractor, className }: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-2xl border border-gray-100 shadow-sm bg-white", className)}>
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className={cn("px-6 py-4", col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                Tidak ada data.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={keyExtractor(item)} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.header} className={`py-4 px-6 text-sm ${col.className || 'text-gray-700'}`}>
                    {col.cell ? col.cell(item) : (item as any)[col.accessorKey as string]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
