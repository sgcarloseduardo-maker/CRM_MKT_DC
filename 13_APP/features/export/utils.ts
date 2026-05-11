export function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const headers = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(","))
  ].join("\n");
}

export function exportFilename(base: string, format: "csv" | "json") {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return `${base}_${stamp}.${format}`;
}

export function asExportResponse(rows: Record<string, unknown>[], base: string, format: "csv" | "json") {
  const filename = exportFilename(base, format);
  if (format === "json") {
    return new Response(JSON.stringify(rows, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`
      }
    });
  }
  return new Response(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`
    }
  });
}
