import * as XLSX from 'xlsx';

export interface ExcelColumnMapping<T> {
  header: string;
  key: keyof T | ((item: T, index: number) => any);
  width?: number;
}

/**
 * Export data array to XLSX spreadsheet file
 */
export function exportToExcel<T>(
  data: T[],
  columns: ExcelColumnMapping<T>[],
  fileName: string,
  sheetName: string = 'Sheet1'
): void {
  if (!data || data.length === 0) return;

  const rows = data.map((item, idx) => {
    const rowObj: Record<string, any> = {};
    columns.forEach(col => {
      if (typeof col.key === 'function') {
        rowObj[col.header] = col.key(item, idx);
      } else {
        rowObj[col.header] = item[col.key];
      }
    });
    return rowObj;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths if specified
  const colWidths = columns.map(c => ({ wch: c.width || 15 }));
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const safeFileName = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;
  XLSX.writeFile(workbook, safeFileName);
}
