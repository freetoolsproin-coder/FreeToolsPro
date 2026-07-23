/**
 * Browser-safe CSV utilities with RFC 4180-style quoted-field support.
 */

/**
 * Parse a CSV string into headers and data rows.
 * Supports quoted fields, escaped quotes (""), and multiline values inside quotes.
 * @param {string} text
 * @returns {{ headers: string[], rows: string[][] }}
 */
export function parseCsv(text) {
  if (text == null || String(text).trim() === "") {
    return { headers: [], rows: [] };
  }

  const source = String(text).replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    const next = source[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (next === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (char === "\r") {
      if (next === "\n") i += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  // Flush final field / row when the file does not end on a record terminator
  const endedWithNewline = /[\r\n]$/.test(source);
  if (!endedWithNewline || field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  if (rows.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = rows[0].map((h) => String(h).trim());
  const dataRows = rows.slice(1).map((r) => {
    // Normalize row width to header length
    const normalized = headers.map((_, idx) => (r[idx] != null ? String(r[idx]) : ""));
    return normalized;
  });

  return { headers, rows: dataRows };
}

/**
 * Convert CSV text into an array of objects keyed by header names.
 * @param {string} text
 * @returns {Record<string, string>[]}
 */
export function csvToObjects(text) {
  const { headers, rows } = parseCsv(text);
  if (headers.length === 0) return [];

  return rows.map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      const key = header || `column_${index + 1}`;
      obj[key] = row[index] ?? "";
    });
    return obj;
  });
}

/**
 * Escape a single CSV field (quotes when needed).
 * @param {unknown} value
 * @returns {string}
 */
function escapeCsvField(value) {
  const str = value == null ? "" : String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Convert an array of objects into a CSV string.
 * @param {Record<string, unknown>[]} objects
 * @returns {string}
 */
export function objectsToCsv(objects) {
  if (!Array.isArray(objects) || objects.length === 0) {
    return "";
  }

  const headerSet = new Set();
  objects.forEach((obj) => {
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      Object.keys(obj).forEach((key) => headerSet.add(key));
    }
  });

  const headers = Array.from(headerSet);
  if (headers.length === 0) return "";

  const lines = [headers.map(escapeCsvField).join(",")];
  objects.forEach((obj) => {
    const row = headers.map((header) => escapeCsvField(obj?.[header]));
    lines.push(row.join(","));
  });

  return lines.join("\n");
}

/**
 * Escape text for use inside XML element content.
 * @param {unknown} value
 * @returns {string}
 */
function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Sanitize a string for use as an XML element name.
 * @param {string} name
 * @param {string} fallback
 * @returns {string}
 */
function toXmlName(name, fallback = "field") {
  let cleaned = String(name ?? "")
    .trim()
    .replace(/[^A-Za-z0-9_.-]/g, "_");
  if (!cleaned || !/^[A-Za-z_]/.test(cleaned)) {
    cleaned = `${fallback}_${cleaned || "col"}`;
  }
  return cleaned;
}

/**
 * Convert CSV text to a simple XML document.
 * @param {string} text
 * @param {string} [rootName='rows']
 * @param {string} [rowName='row']
 * @returns {string}
 */
export function csvToXml(text, rootName = "rows", rowName = "row") {
  const objects = csvToObjects(text);
  const root = toXmlName(rootName, "rows");
  const rowTag = toXmlName(rowName, "row");

  const parts = [`<?xml version="1.0" encoding="UTF-8"?>`, `<${root}>`];

  objects.forEach((obj) => {
    parts.push(`  <${rowTag}>`);
    Object.entries(obj).forEach(([key, value]) => {
      const tag = toXmlName(key, "field");
      parts.push(`    <${tag}>${escapeXml(value)}</${tag}>`);
    });
    parts.push(`  </${rowTag}>`);
  });

  parts.push(`</${root}>`);
  return parts.join("\n");
}

/**
 * Escape a SQL string literal (single quotes doubled).
 * @param {unknown} value
 * @returns {string}
 */
function escapeSqlLiteral(value) {
  if (value == null || value === "") return "NULL";
  const str = String(value);
  if (/^-?\d+(\.\d+)?$/.test(str)) return str;
  return `'${str.replace(/'/g, "''")}'`;
}

/**
 * Sanitize an identifier for SQL (table / column names).
 * @param {string} name
 * @param {string} fallback
 * @returns {string}
 */
function toSqlIdent(name, fallback = "col") {
  const cleaned = String(name ?? "")
    .trim()
    .replace(/[^A-Za-z0-9_]/g, "_");
  if (!cleaned) return fallback;
  if (/^\d/.test(cleaned)) return `${fallback}_${cleaned}`;
  return cleaned;
}

/**
 * Convert CSV text into INSERT SQL statements.
 * @param {string} text
 * @param {string} [tableName='data']
 * @returns {string}
 */
export function csvToSql(text, tableName = "data") {
  const { headers, rows } = parseCsv(text);
  if (headers.length === 0 || rows.length === 0) return "";

  const table = toSqlIdent(tableName, "data");
  const cols = headers.map((h, i) => toSqlIdent(h || `column_${i + 1}`, `column_${i + 1}`));
  const colList = cols.join(", ");

  return rows
    .map((row) => {
      const values = cols.map((_, i) => escapeSqlLiteral(row[i]));
      return `INSERT INTO ${table} (${colList}) VALUES (${values.join(", ")});`;
    })
    .join("\n");
}

/**
 * Merge two CSV strings by union of headers. Rows from A then B.
 * Missing values become empty strings.
 * @param {string} csvA
 * @param {string} csvB
 * @returns {string}
 */
export function mergeCsv(csvA, csvB) {
  const a = csvToObjects(csvA);
  const b = csvToObjects(csvB);
  const headerSet = new Set();

  [...a, ...b].forEach((obj) => {
    Object.keys(obj).forEach((key) => headerSet.add(key));
  });

  const headers = Array.from(headerSet);
  if (headers.length === 0) return "";

  const merged = [...a, ...b].map((obj) => {
    const next = {};
    headers.forEach((h) => {
      next[h] = obj[h] ?? "";
    });
    return next;
  });

  return objectsToCsv(merged);
}

/**
 * Split a CSV into multiple CSV strings, each with the same header
 * and up to `chunkSize` data rows.
 * @param {string} text
 * @param {number} chunkSize
 * @returns {string[]}
 */
export function splitCsv(text, chunkSize) {
  const size = Number(chunkSize);
  if (!Number.isFinite(size) || size < 1) {
    throw new Error("chunkSize must be a positive number");
  }

  const { headers, rows } = parseCsv(text);
  if (headers.length === 0) return [];

  const headerLine = headers.map(escapeCsvField).join(",");
  if (rows.length === 0) return [headerLine];

  const chunks = [];
  for (let i = 0; i < rows.length; i += size) {
    const slice = rows.slice(i, i + size);
    const body = slice.map((row) => row.map(escapeCsvField).join(","));
    chunks.push([headerLine, ...body].join("\n"));
  }

  return chunks;
}
