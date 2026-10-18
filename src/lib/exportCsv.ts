/**
 * Safely format a cell for CSV:
 * - Quotes every field and doubles internal quotes to strictly follow RFC 4180
 * - Handles newlines, special characters, commas, and nulls safely
 */
function formatCSVCell(value: unknown): string {
  if (value === null || value === undefined) {
    return '""';
  }
  const str = String(value);
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Universal CSV download helper.
 * - Adds UTF-8 BOM (\uFEFF) so Microsoft Excel opens it correctly with UTF-8 character encoding.
 * - Uses Blob and URL.createObjectURL instead of data: URI to support large datasets without browser URL limits.
 * - Automatically revokes the object URL to avoid memory leaks.
 */
export function downloadCSV(
  filename: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
): boolean {
  if (typeof window === "undefined") return false;

  const headerLine = headers.map(formatCSVCell).join(",");
  const rowLines = rows.map((row) => row.map(formatCSVCell).join(","));
  const csvContent = "\uFEFF" + [headerLine, ...rowLines].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const sanitizedFilename = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  link.setAttribute("href", url);
  link.setAttribute("download", sanitizedFilename);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 500);
  return true;
}
