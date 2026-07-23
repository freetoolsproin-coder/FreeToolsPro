/**
 * Browser-safe SQL helper utilities (heuristic — not a full SQL parser).
 */

const MAJOR_CLAUSES = [
  "WITH",
  "SELECT",
  "INSERT",
  "UPDATE",
  "DELETE",
  "CREATE",
  "ALTER",
  "DROP",
  "FROM",
  "INTO",
  "VALUES",
  "SET",
  "WHERE",
  "GROUP BY",
  "HAVING",
  "ORDER BY",
  "LIMIT",
  "OFFSET",
  "JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "INNER JOIN",
  "OUTER JOIN",
  "FULL JOIN",
  "CROSS JOIN",
  "ON",
  "UNION",
  "UNION ALL",
  "RETURNING",
];

const KEYWORDS = [
  ...MAJOR_CLAUSES,
  "AND",
  "OR",
  "NOT",
  "NULL",
  "AS",
  "IN",
  "IS",
  "LIKE",
  "BETWEEN",
  "EXISTS",
  "DISTINCT",
  "ALL",
  "ASC",
  "DESC",
  "CASE",
  "WHEN",
  "THEN",
  "ELSE",
  "END",
  "TABLE",
  "INDEX",
  "VIEW",
  "DATABASE",
  "PRIMARY",
  "KEY",
  "FOREIGN",
  "REFERENCES",
  "DEFAULT",
  "CONSTRAINT",
  "UNIQUE",
  "CHECK",
  "IF",
];

/**
 * Split SQL into tokens while preserving string literals and comments.
 * @param {string} sql
 * @returns {string[]}
 */
function tokenizeSql(sql) {
  const source = String(sql ?? "");
  const tokens = [];
  let i = 0;

  while (i < source.length) {
    const ch = source[i];
    const next = source[i + 1];

    // Line comment
    if (ch === "-" && next === "-") {
      let end = source.indexOf("\n", i);
      if (end === -1) end = source.length;
      tokens.push(source.slice(i, end));
      i = end;
      continue;
    }

    // Block comment
    if (ch === "/" && next === "*") {
      let end = source.indexOf("*/", i + 2);
      if (end === -1) {
        tokens.push(source.slice(i));
        break;
      }
      tokens.push(source.slice(i, end + 2));
      i = end + 2;
      continue;
    }

    // Single-quoted string
    if (ch === "'") {
      let j = i + 1;
      let out = "'";
      while (j < source.length) {
        if (source[j] === "'" && source[j + 1] === "'") {
          out += "''";
          j += 2;
          continue;
        }
        out += source[j];
        if (source[j] === "'") {
          j += 1;
          break;
        }
        j += 1;
      }
      tokens.push(out);
      i = j;
      continue;
    }

    // Double-quoted identifier
    if (ch === '"') {
      let j = i + 1;
      let out = '"';
      while (j < source.length) {
        out += source[j];
        if (source[j] === '"') {
          j += 1;
          break;
        }
        j += 1;
      }
      tokens.push(out);
      i = j;
      continue;
    }

    // Whitespace
    if (/\s/.test(ch)) {
      let j = i + 1;
      while (j < source.length && /\s/.test(source[j])) j += 1;
      tokens.push(source.slice(i, j));
      i = j;
      continue;
    }

    // Punctuation / operators
    if (/[(),.;=<>!+\-*/%]/.test(ch)) {
      // multi-char operators
      if ((ch === "<" || ch === ">" || ch === "!" || ch === "=") && next === "=") {
        tokens.push(ch + next);
        i += 2;
        continue;
      }
      if (ch === "<" && next === ">") {
        tokens.push("<>");
        i += 2;
        continue;
      }
      tokens.push(ch);
      i += 1;
      continue;
    }

    // Word / number
    let j = i + 1;
    while (j < source.length && /[A-Za-z0-9_$@.]/.test(source[j])) j += 1;
    tokens.push(source.slice(i, j));
    i = j;
  }

  return tokens;
}

/**
 * Uppercase SQL keywords in a token stream (leaves literals/comments alone).
 * @param {string[]} tokens
 * @returns {string[]}
 */
function uppercaseKeywords(tokens) {
  const keywordSet = new Set(KEYWORDS.map((k) => k.toUpperCase()));
  // Prefer longest multi-word matches: look ahead for "GROUP BY", etc.
  const multi = MAJOR_CLAUSES.filter((c) => c.includes(" "))
    .map((c) => c.split(" "))
    .sort((a, b) => b.length - a.length);

  const out = [];
  for (let i = 0; i < tokens.length; i += 1) {
    const tok = tokens[i];
    if (!/^[A-Za-z_]/.test(tok)) {
      out.push(tok);
      continue;
    }

    let matched = false;
    for (const parts of multi) {
      const collected = [tok];
      let idx = i;
      let ok = true;
      for (let p = 1; p < parts.length; p += 1) {
        // skip whitespace tokens
        let nextIdx = idx + 1;
        while (nextIdx < tokens.length && /^\s+$/.test(tokens[nextIdx])) nextIdx += 1;
        if (nextIdx >= tokens.length || tokens[nextIdx].toUpperCase() !== parts[p]) {
          ok = false;
          break;
        }
        collected.push(...tokens.slice(idx + 1, nextIdx + 1));
        idx = nextIdx;
      }
      if (ok && tok.toUpperCase() === parts[0]) {
        // rebuild with uppercase keyword words, preserve whitespace between
        const rebuilt = [];
        let partIdx = 0;
        for (const piece of collected) {
          if (/^\s+$/.test(piece)) {
            rebuilt.push(piece);
          } else {
            rebuilt.push(parts[partIdx].toUpperCase());
            partIdx += 1;
          }
        }
        out.push(...rebuilt);
        i = idx;
        matched = true;
        break;
      }
    }

    if (!matched) {
      out.push(keywordSet.has(tok.toUpperCase()) ? tok.toUpperCase() : tok);
    }
  }
  return out;
}

/**
 * Insert newlines before major clauses for readability.
 * @param {string} sql
 * @returns {string}
 */
export function formatSql(sql) {
  const raw = String(sql ?? "").trim();
  if (!raw) return "";

  const tokens = uppercaseKeywords(tokenizeSql(raw));
  let result = "";

  const clauseStarts = new Set(
    MAJOR_CLAUSES.map((c) => c.split(" ")[0].toUpperCase())
  );

  for (let i = 0; i < tokens.length; i += 1) {
    const tok = tokens[i];
    const upper = tok.toUpperCase();

    // Detect start of a major clause (including multi-word)
    let isClause = false;
    if (/^[A-Za-z_]/.test(tok) && clauseStarts.has(upper)) {
      // Check multi-word clauses that start with this word
      const multiMatch = MAJOR_CLAUSES.filter(
        (c) => c.startsWith(upper) && c.includes(" ")
      );
      if (multiMatch.length) {
        // peek next significant token
        let j = i + 1;
        while (j < tokens.length && /^\s+$/.test(tokens[j])) j += 1;
        const nextWord = tokens[j]?.toUpperCase();
        isClause = multiMatch.some((c) => {
          const second = c.split(" ")[1];
          return nextWord === second;
        }) || MAJOR_CLAUSES.includes(upper);
      } else {
        isClause = MAJOR_CLAUSES.includes(upper);
      }
    }

    if (isClause && result.trim().length > 0) {
      result = result.replace(/[ \t]+$/, "");
      if (!result.endsWith("\n")) result += "\n";
      result += tok;
    } else if (/^\s+$/.test(tok)) {
      // collapse runs of whitespace to a single space, preserve intentional newlines later
      if (!result.endsWith(" ") && !result.endsWith("\n") && result.length > 0) {
        result += " ";
      }
    } else {
      result += tok;
    }
  }

  // Clean spacing around punctuation
  return result
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/\s+,/g, ",")
    .replace(/,([^\s\n])/g, ", $1")
    .trim();
}

/**
 * Remove comments and collapse whitespace.
 * @param {string} sql
 * @returns {string}
 */
export function minifySql(sql) {
  const tokens = tokenizeSql(String(sql ?? ""));
  const kept = tokens.filter((t) => {
    if (t.startsWith("--") || t.startsWith("/*")) return false;
    return true;
  });

  let out = "";
  for (const tok of kept) {
    if (/^\s+$/.test(tok)) {
      if (out.length && !out.endsWith(" ") && !/[(),;]/.test(out.slice(-1))) {
        out += " ";
      }
      continue;
    }
    if (tok === "," || tok === ";" || tok === ")") {
      out = out.replace(/ $/, "");
    }
    if (tok === "(") {
      out = out.replace(/ $/, "");
    }
    out += tok;
    if (tok === ",") out += " ";
  }

  return out.trim();
}

/**
 * Alias of formatSql with slightly more spacing between clauses.
 * @param {string} sql
 * @returns {string}
 */
export function beautifySql(sql) {
  const formatted = formatSql(sql);
  if (!formatted) return "";

  // Ensure blank line before top-level DML/DDL keywords for extra breathing room
  return formatted
    .replace(
      /\n(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|WITH)\b/g,
      "\n\n$1"
    )
    .replace(/^\n+/, "")
    .trim();
}

/**
 * Heuristic SQL validation.
 * @param {string} sql
 * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
 */
export function validateSql(sql) {
  const errors = [];
  const warnings = [];
  const text = String(sql ?? "").trim();

  if (!text) {
    return { valid: false, errors: ["SQL is empty"], warnings: [] };
  }

  // Balanced single quotes ('' is escape)
  let inSingle = false;
  let inDouble = false;
  let inLineComment = false;
  let inBlockComment = false;
  let parenDepth = 0;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (inLineComment) {
      if (ch === "\n") inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i += 1;
      }
      continue;
    }

    if (!inSingle && !inDouble) {
      if (ch === "-" && next === "-") {
        inLineComment = true;
        i += 1;
        continue;
      }
      if (ch === "/" && next === "*") {
        inBlockComment = true;
        i += 1;
        continue;
      }
    }

    if (!inDouble && ch === "'") {
      if (inSingle && next === "'") {
        i += 1;
        continue;
      }
      inSingle = !inSingle;
      continue;
    }

    if (!inSingle && ch === '"') {
      inDouble = !inDouble;
      continue;
    }

    if (!inSingle && !inDouble) {
      if (ch === "(") parenDepth += 1;
      if (ch === ")") {
        parenDepth -= 1;
        if (parenDepth < 0) {
          errors.push("Unbalanced parentheses: extra closing ')'");
          parenDepth = 0;
        }
      }
    }
  }

  if (inSingle) errors.push("Unbalanced single quotes");
  if (inDouble) errors.push("Unbalanced double quotes");
  if (inBlockComment) errors.push("Unclosed block comment");
  if (parenDepth > 0) errors.push("Unbalanced parentheses: missing closing ')'");

  const upper = text.toUpperCase();
  const hasStatement =
    /\bSELECT\b/.test(upper) ||
    /\bINSERT\b/.test(upper) ||
    /\bUPDATE\b/.test(upper) ||
    /\bDELETE\b/.test(upper) ||
    /\bCREATE\b/.test(upper) ||
    /\bALTER\b/.test(upper) ||
    /\bDROP\b/.test(upper);

  if (!hasStatement) {
    errors.push(
      "No recognized SQL statement keyword (SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP)"
    );
  }

  if (/\bSELECT\b/.test(upper) && !/\bFROM\b/.test(upper) && !/\bDUAL\b/.test(upper)) {
    warnings.push("SELECT without FROM clause");
  }
  if (/\bINSERT\b/.test(upper) && !/\bINTO\b/.test(upper)) {
    warnings.push("INSERT without INTO");
  }
  if (/\bUPDATE\b/.test(upper) && !/\bSET\b/.test(upper)) {
    warnings.push("UPDATE without SET");
  }
  if (/\bDELETE\b/.test(upper) && !/\bWHERE\b/.test(upper)) {
    warnings.push("DELETE without WHERE may affect all rows");
  }
  if (/\bUPDATE\b/.test(upper) && !/\bWHERE\b/.test(upper)) {
    warnings.push("UPDATE without WHERE may affect all rows");
  }
  if (!/;\s*$/.test(text) && !text.includes(";")) {
    warnings.push("Statement is missing a trailing semicolon");
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Escape a SQL string literal.
 * @param {unknown} value
 * @returns {string}
 */
function escapeSqlValue(value) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  return `'${String(value).replace(/'/g, "''")}'`;
}

/**
 * Sanitize SQL identifier.
 * @param {string} name
 * @param {string} fallback
 * @returns {string}
 */
function sqlIdent(name, fallback = "col") {
  const cleaned = String(name ?? "")
    .trim()
    .replace(/[^A-Za-z0-9_]/g, "_");
  if (!cleaned) return fallback;
  if (/^\d/.test(cleaned)) return `${fallback}_${cleaned}`;
  return cleaned;
}

/**
 * Try to parse simple SELECT * FROM / INSERT VALUES into JSON; otherwise return tokens.
 * @param {string} sql
 * @returns {unknown}
 */
export function sqlToJson(sql) {
  const text = String(sql ?? "").trim();
  if (!text) return [];

  // INSERT INTO table (cols) VALUES (...), (...);
  const insertMatch = text.match(
    /^\s*INSERT\s+INTO\s+([A-Za-z0-9_."`]+)\s*(?:\(([^)]*)\))?\s*VALUES\s*([\s\S]+)$/i
  );
  if (insertMatch) {
    const table = insertMatch[1].replace(/["`]/g, "");
    const colPart = insertMatch[2];
    const valuesPart = insertMatch[3].replace(/;+\s*$/, "").trim();
    const columns = colPart
      ? colPart.split(",").map((c) => c.trim().replace(/["`]/g, ""))
      : null;

    const tuples = [];
    let depth = 0;
    let current = "";
    let inStr = false;

    for (let i = 0; i < valuesPart.length; i += 1) {
      const ch = valuesPart[i];
      const next = valuesPart[i + 1];

      if (ch === "'" && !inStr) {
        inStr = true;
        current += ch;
        continue;
      }
      if (inStr) {
        current += ch;
        if (ch === "'" && next === "'") {
          current += next;
          i += 1;
        } else if (ch === "'") {
          inStr = false;
        }
        continue;
      }

      if (ch === "(") {
        depth += 1;
        if (depth === 1) {
          current = "";
          continue;
        }
      }
      if (ch === ")") {
        depth -= 1;
        if (depth === 0) {
          tuples.push(current);
          current = "";
          continue;
        }
      }
      if (depth >= 1) current += ch;
    }

    const rows = tuples.map((tuple) => {
      const vals = splitSqlList(tuple);
      if (columns && columns.length) {
        const obj = { _table: table };
        columns.forEach((col, idx) => {
          obj[col] = coerceSqlLiteral(vals[idx]);
        });
        return obj;
      }
      return { _table: table, values: vals.map(coerceSqlLiteral) };
    });

    return rows;
  }

  // SELECT cols FROM table [WHERE ...] — produce a structured description
  const selectMatch = text.match(
    /^\s*SELECT\s+([\s\S]+?)\s+FROM\s+([A-Za-z0-9_."`]+)([\s\S]*)$/i
  );
  if (selectMatch) {
    const colsRaw = selectMatch[1].trim();
    const table = selectMatch[2].replace(/["`]/g, "");
    const rest = selectMatch[3] || "";
    const columns =
      colsRaw === "*"
        ? ["*"]
        : colsRaw.split(",").map((c) => c.trim());

    const whereMatch = rest.match(/\bWHERE\s+([\s\S]+?)(?=\bORDER\b|\bGROUP\b|\bLIMIT\b|$)/i);
    const orderMatch = rest.match(/\bORDER\s+BY\s+([\s\S]+?)(?=\bLIMIT\b|$)/i);
    const limitMatch = rest.match(/\bLIMIT\s+(\d+)/i);

    return [
      {
        type: "select",
        table,
        columns,
        where: whereMatch ? whereMatch[1].trim().replace(/;+\s*$/, "") : null,
        orderBy: orderMatch ? orderMatch[1].trim().replace(/;+\s*$/, "") : null,
        limit: limitMatch ? Number(limitMatch[1]) : null,
      },
    ];
  }

  // Fallback: structured tokens
  return {
    type: "tokens",
    tokens: tokenizeSql(text).filter((t) => !/^\s+$/.test(t)),
  };
}

/**
 * Split a comma-separated SQL value list respecting quotes and nesting.
 * @param {string} list
 * @returns {string[]}
 */
function splitSqlList(list) {
  const items = [];
  let current = "";
  let depth = 0;
  let inStr = false;

  for (let i = 0; i < list.length; i += 1) {
    const ch = list[i];
    const next = list[i + 1];

    if (ch === "'" && !inStr) {
      inStr = true;
      current += ch;
      continue;
    }
    if (inStr) {
      current += ch;
      if (ch === "'" && next === "'") {
        current += next;
        i += 1;
      } else if (ch === "'") {
        inStr = false;
      }
      continue;
    }

    if (ch === "(") depth += 1;
    if (ch === ")") depth -= 1;

    if (ch === "," && depth === 0) {
      items.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.trim()) items.push(current.trim());
  return items;
}

/**
 * Coerce a SQL literal string into a JS value.
 * @param {string} lit
 * @returns {unknown}
 */
function coerceSqlLiteral(lit) {
  if (lit == null) return null;
  const v = String(lit).trim();
  if (/^NULL$/i.test(v)) return null;
  if (/^TRUE$/i.test(v)) return true;
  if (/^FALSE$/i.test(v)) return false;
  if (/^'.*'$/s.test(v)) {
    return v.slice(1, -1).replace(/''/g, "'");
  }
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  return v;
}

/**
 * Convert a JSON array (or object) into INSERT statements.
 * @param {string} jsonText
 * @param {string} [tableName='data']
 * @returns {string}
 */
export function jsonToSqlInsert(jsonText, tableName = "data") {
  const raw = String(jsonText ?? "").trim();
  if (!raw) return "";

  let data = JSON.parse(raw);
  if (!Array.isArray(data)) {
    data = [data];
  }
  if (data.length === 0) return "";

  const table = sqlIdent(tableName, "data");
  const headerSet = new Set();
  data.forEach((row) => {
    if (row && typeof row === "object" && !Array.isArray(row)) {
      Object.keys(row).forEach((k) => {
        if (k !== "_table") headerSet.add(k);
      });
    }
  });

  const columns = Array.from(headerSet);
  if (columns.length === 0) {
    // Array of primitives / arrays
    return data
      .map((row) => {
        const vals = Array.isArray(row)
          ? row.map(escapeSqlValue)
          : [escapeSqlValue(row)];
        return `INSERT INTO ${table} VALUES (${vals.join(", ")});`;
      })
      .join("\n");
  }

  const colList = columns.map((c) => sqlIdent(c)).join(", ");
  return data
    .map((row) => {
      const vals = columns.map((c) => escapeSqlValue(row?.[c]));
      return `INSERT INTO ${table} (${colList}) VALUES (${vals.join(", ")});`;
    })
    .join("\n");
}

/**
 * Human-readable line diff for two SQL strings.
 * @param {string} a
 * @param {string} b
 * @returns {string}
 */
export function diffSql(a, b) {
  const left = formatSql(a).split("\n");
  const right = formatSql(b).split("\n");
  const max = Math.max(left.length, right.length);
  const lines = [];

  for (let i = 0; i < max; i += 1) {
    const L = left[i];
    const R = right[i];
    const num = String(i + 1).padStart(4, " ");

    if (L === undefined) {
      lines.push(`${num} + ${R}`);
    } else if (R === undefined) {
      lines.push(`${num} - ${L}`);
    } else if (L !== R) {
      lines.push(`${num} - ${L}`);
      lines.push(`${num} + ${R}`);
    } else {
      lines.push(`${num}   ${L}`);
    }
  }

  return lines.join("\n");
}

/**
 * Plain-language explanation of detected SQL clauses.
 * @param {string} sql
 * @returns {string}
 */
export function explainSql(sql) {
  const text = String(sql ?? "").trim();
  if (!text) return "No SQL provided.";

  const upper = text.toUpperCase();
  const parts = [];

  if (/\bWITH\b/.test(upper)) {
    parts.push("Defines common table expressions (WITH / CTEs) used by the main query.");
  }
  if (/\bSELECT\b/.test(upper)) {
    const colMatch = text.match(/\bSELECT\s+([\s\S]+?)\s+FROM\b/i);
    if (colMatch) {
      const cols = colMatch[1].trim();
      parts.push(
        cols === "*"
          ? "Selects all columns."
          : `Selects columns: ${cols.replace(/\s+/g, " ")}.`
      );
    } else {
      parts.push("Contains a SELECT clause.");
    }
  }
  if (/\bINSERT\b/.test(upper)) {
    const m = text.match(/\bINSERT\s+INTO\s+([A-Za-z0-9_."`]+)/i);
    parts.push(m ? `Inserts rows into table "${m[1].replace(/["`]/g, "")}".` : "Inserts rows.");
  }
  if (/\bUPDATE\b/.test(upper)) {
    const m = text.match(/\bUPDATE\s+([A-Za-z0-9_."`]+)/i);
    parts.push(m ? `Updates rows in table "${m[1].replace(/["`]/g, "")}".` : "Updates rows.");
  }
  if (/\bDELETE\b/.test(upper)) {
    const m = text.match(/\bDELETE\s+FROM\s+([A-Za-z0-9_."`]+)/i);
    parts.push(m ? `Deletes rows from table "${m[1].replace(/["`]/g, "")}".` : "Deletes rows.");
  }
  if (/\bCREATE\b/.test(upper)) parts.push("Creates a database object (table, index, view, etc.).");
  if (/\bALTER\b/.test(upper)) parts.push("Alters an existing database object.");
  if (/\bDROP\b/.test(upper)) parts.push("Drops (removes) a database object.");

  const fromMatch = text.match(/\bFROM\s+([A-Za-z0-9_."`]+)/i);
  if (fromMatch && /\bSELECT\b/.test(upper)) {
    parts.push(`Reads from table "${fromMatch[1].replace(/["`]/g, "")}".`);
  }

  if (/\bJOIN\b/.test(upper)) {
    parts.push("Joins one or more tables together.");
  }
  if (/\bWHERE\b/.test(upper)) {
    const m = text.match(/\bWHERE\s+([\s\S]+?)(?=\bGROUP\b|\bORDER\b|\bHAVING\b|\bLIMIT\b|\bUNION\b|$)/i);
    parts.push(
      m
        ? `Filters rows with: ${m[1].trim().replace(/;+\s*$/, "").replace(/\s+/g, " ")}.`
        : "Filters rows with a WHERE clause."
    );
  }
  if (/\bGROUP\s+BY\b/.test(upper)) parts.push("Groups rows (GROUP BY) for aggregation.");
  if (/\bHAVING\b/.test(upper)) parts.push("Filters grouped results with HAVING.");
  if (/\bORDER\s+BY\b/.test(upper)) {
    const m = text.match(/\bORDER\s+BY\s+([\s\S]+?)(?=\bLIMIT\b|\bOFFSET\b|$)/i);
    parts.push(
      m
        ? `Sorts results by: ${m[1].trim().replace(/;+\s*$/, "").replace(/\s+/g, " ")}.`
        : "Sorts results (ORDER BY)."
    );
  }
  if (/\bLIMIT\b/.test(upper)) {
    const m = text.match(/\bLIMIT\s+(\d+)/i);
    parts.push(m ? `Limits the result to ${m[1]} row(s).` : "Limits the number of rows returned.");
  }
  if (/\bOFFSET\b/.test(upper)) parts.push("Skips a number of rows (OFFSET).");
  if (/\bUNION\b/.test(upper)) parts.push("Combines result sets with UNION.");

  if (parts.length === 0) {
    return "Could not detect recognizable SQL clauses.";
  }

  return parts.join(" ");
}

/**
 * Build a SELECT query from structured options.
 * @param {{ table: string, columns?: string[]|string, where?: string, orderBy?: string, limit?: number|string }} options
 * @returns {string}
 */
export function buildSelectQuery({ table, columns, where, orderBy, limit } = {}) {
  if (!table || !String(table).trim()) {
    throw new Error("table is required");
  }

  const tableName = sqlIdent(String(table).trim(), "data");
  let colList = "*";
  if (Array.isArray(columns) && columns.length > 0) {
    colList = columns.map((c) => (c === "*" ? "*" : sqlIdent(String(c)))).join(", ");
  } else if (typeof columns === "string" && columns.trim()) {
    colList = columns.trim();
  }

  let sql = `SELECT ${colList}\nFROM ${tableName}`;

  if (where && String(where).trim()) {
    sql += `\nWHERE ${String(where).trim()}`;
  }
  if (orderBy && String(orderBy).trim()) {
    sql += `\nORDER BY ${String(orderBy).trim()}`;
  }
  if (limit != null && String(limit).trim() !== "") {
    const n = Number(limit);
    if (!Number.isFinite(n) || n < 0) {
      throw new Error("limit must be a non-negative number");
    }
    sql += `\nLIMIT ${Math.floor(n)}`;
  }

  return `${sql};`;
}
