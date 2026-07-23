/**
 * Browser-safe YAML utilities powered by js-yaml.
 */
import yaml from "js-yaml";

/**
 * Parse YAML text into a JavaScript value.
 * @param {string} text
 * @returns {unknown}
 */
export function parseYaml(text) {
  return yaml.load(String(text ?? ""), { schema: yaml.DEFAULT_SCHEMA });
}

/**
 * Serialize a JavaScript value to YAML.
 * @param {unknown} obj
 * @returns {string}
 */
export function stringifyYaml(obj) {
  if (obj === undefined) return "";
  return yaml.dump(obj, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
    sortKeys: false,
  });
}

/**
 * Validate YAML text.
 * @param {string} text
 * @returns {{ valid: boolean, error: string | null, data: unknown }}
 */
export function validateYaml(text) {
  try {
    const data = parseYaml(text);
    return { valid: true, error: null, data };
  } catch (err) {
    return {
      valid: false,
      error: err?.message || String(err),
      data: null,
    };
  }
}

/**
 * Parse and re-stringify YAML for consistent formatting.
 * @param {string} text
 * @returns {string}
 */
export function formatYaml(text) {
  const data = parseYaml(text);
  return stringifyYaml(data);
}

/**
 * Convert YAML text to a JSON string.
 * @param {string} text
 * @param {boolean} [pretty=true]
 * @returns {string}
 */
export function yamlToJson(text, pretty = true) {
  const data = parseYaml(text);
  return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
}

/**
 * Convert a JSON string to YAML.
 * @param {string} text
 * @returns {string}
 */
export function jsonToYaml(text) {
  const raw = String(text ?? "").trim();
  if (!raw) return "";
  const data = JSON.parse(raw);
  return stringifyYaml(data);
}

/**
 * Build a simple human-readable line diff between two text blocks.
 * @param {string} left
 * @param {string} right
 * @returns {string}
 */
function lineDiff(left, right) {
  const a = String(left ?? "").replace(/\r\n/g, "\n").split("\n");
  const b = String(right ?? "").replace(/\r\n/g, "\n").split("\n");
  const max = Math.max(a.length, b.length);
  const lines = [];

  for (let i = 0; i < max; i += 1) {
    const leftLine = a[i];
    const rightLine = b[i];
    const num = String(i + 1).padStart(4, " ");

    if (leftLine === undefined) {
      lines.push(`${num} + ${rightLine}`);
    } else if (rightLine === undefined) {
      lines.push(`${num} - ${leftLine}`);
    } else if (leftLine !== rightLine) {
      lines.push(`${num} - ${leftLine}`);
      lines.push(`${num} + ${rightLine}`);
    } else {
      lines.push(`${num}   ${leftLine}`);
    }
  }

  return lines.join("\n");
}

/**
 * Diff two YAML documents as stringified YAML (human-readable line diff).
 * Accepts YAML strings or already-parsed objects.
 * @param {unknown} a
 * @param {unknown} b
 * @returns {string}
 */
export function diffYaml(a, b) {
  const left =
    typeof a === "string" ? stringifyYaml(parseYaml(a)) : stringifyYaml(a);
  const right =
    typeof b === "string" ? stringifyYaml(parseYaml(b)) : stringifyYaml(b);
  return lineDiff(left.trimEnd(), right.trimEnd());
}
