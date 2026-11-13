// Shared setup for the automation scripts: project paths, .env loading and small file helpers.
import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
export const STATE_DIR = join(ROOT, "automation", "state");
export const REPORT_DIR = join(ROOT, "automation", "reports");

// Load ROOT/.env (KEY=value lines) without overwriting variables already set by the shell.
const envFile = join(ROOT, ".env");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!m || line.trim().startsWith("#")) continue;
    const v = m[2].replace(/^(['"])(.*)\1$/, "$2");
    if (process.env[m[1]] === undefined) process.env[m[1]] = v;
  }
}

export const env = (k, fallback) => {
  const v = process.env[k];
  return v === undefined || v === "" ? fallback : v;
};

export function readJson(file, fallback) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

/** Write via a temp file and rename, so a crash never leaves half a file. */
export function writeText(file, text) {
  mkdirSync(dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  writeFileSync(tmp, text);
  renameSync(tmp, file);
}

export const writeJson = (file, data) => writeText(file, JSON.stringify(data, null, 2) + "\n");

export const args = process.argv.slice(2);
export const flag = (name) => args.includes(`--${name}`);
export function option(name, fallback) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : fallback;
}

export const today = () => new Date().toISOString().slice(0, 10);
export const daysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
