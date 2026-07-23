/**
 * Uptime check for FreeToolsPro.
 *
 * Checks SITE_URL (default https://freetoolspro.in). On failure (or recovery),
 * sends email via EmailJS and optional SMS via Twilio.
 *
 * Usage:
 *   node scripts/uptime-check.mjs
 *   node scripts/uptime-check.mjs --force-alert   # test notifications
 *
 * Env: see .env.uptime.example (load with dotenv from .env.uptime or .env)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

dotenv.config({ path: path.join(root, ".env.uptime") });
dotenv.config({ path: path.join(root, ".env") });

const SITE_URL = (process.env.UPTIME_URL || "https://freetoolspro.in").replace(/\/$/, "");
const TIMEOUT_MS = Number(process.env.UPTIME_TIMEOUT_MS || 15000);
const STATE_PATH =
  process.env.UPTIME_STATE_FILE || path.join(root, "scripts", ".uptime-state.json");
const FORCE_ALERT = process.argv.includes("--force-alert");

const ALERT_EMAIL = process.env.ALERT_EMAIL || "support@freetoolspro.in";
const ALERT_PHONE = process.env.ALERT_PHONE || ""; // E.164 e.g. +9198xxxxxxxx

const EMAILJS_SERVICE = process.env.EMAILJS_SERVICE_ID || "service_uvfqag8";
const EMAILJS_TEMPLATE = process.env.EMAILJS_UPTIME_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID || "template_2zk68ln";
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || "BER8gUFpCxPGuMrsh";
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || "";

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_FROM = process.env.TWILIO_FROM_NUMBER || "";

function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
  } catch {
    return { ok: true, lastChecked: null, lastAlertAt: null };
  }
}

function writeState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n", "utf8");
}

async function checkSite() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const started = Date.now();
  try {
    const res = await fetch(SITE_URL, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "FreeToolsPro-UptimeCheck/1.0" },
    });
    const ms = Date.now() - started;
    const ok = res.ok; // 2xx
    return {
      ok,
      status: res.status,
      ms,
      error: ok ? null : `HTTP ${res.status}`,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      ms: Date.now() - started,
      error: err.name === "AbortError" ? `Timeout after ${TIMEOUT_MS}ms` : String(err.message || err),
    };
  } finally {
    clearTimeout(timer);
  }
}

function buildMessage(kind, result) {
  const when = new Date().toISOString();
  if (kind === "down") {
    return [
      `ALERT: ${SITE_URL} appears DOWN`,
      `Time: ${when}`,
      `Error: ${result.error || "unknown"}`,
      `Status: ${result.status}`,
      `Latency: ${result.ms}ms`,
    ].join("\n");
  }
  return [
    `RECOVERY: ${SITE_URL} is UP again`,
    `Time: ${when}`,
    `Status: ${result.status}`,
    `Latency: ${result.ms}ms`,
  ].join("\n");
}

async function sendEmail(subject, message) {
  if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE || !EMAILJS_TEMPLATE) {
    console.warn("[uptime] Email skipped — EmailJS not configured");
    return { sent: false, reason: "not_configured" };
  }

  const body = {
    service_id: EMAILJS_SERVICE,
    template_id: EMAILJS_TEMPLATE,
    user_id: EMAILJS_PUBLIC_KEY,
    template_params: {
      from_name: "FreeToolsPro Uptime",
      name: "Uptime Monitor",
      email: ALERT_EMAIL,
      reply_to: ALERT_EMAIL,
      subject,
      message,
      title: subject,
      user_email: ALERT_EMAIL,
      user_name: "Uptime Monitor",
    },
  };
  if (EMAILJS_PRIVATE_KEY) {
    body.accessToken = EMAILJS_PRIVATE_KEY;
  }

  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`EmailJS ${res.status}: ${text}`);
  }
  return { sent: true };
}

async function sendSms(message) {
  if (!ALERT_PHONE) {
    console.warn("[uptime] SMS skipped — set ALERT_PHONE in .env.uptime");
    return { sent: false, reason: "no_phone" };
  }
  if (!TWILIO_SID || !TWILIO_TOKEN || !TWILIO_FROM) {
    console.warn("[uptime] SMS skipped — set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER");
    return { sent: false, reason: "no_twilio" };
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`;
  const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString("base64");
  const params = new URLSearchParams({
    To: ALERT_PHONE,
    From: TWILIO_FROM,
    Body: message.slice(0, 1500),
  });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Twilio ${res.status}: ${text}`);
  }
  return { sent: true };
}

async function notify(kind, result) {
  const subject =
    kind === "down"
      ? `[FreeToolsPro] Site DOWN — ${SITE_URL}`
      : `[FreeToolsPro] Site recovered — ${SITE_URL}`;
  const message = buildMessage(kind, result);

  console.log(message);

  const results = { email: null, sms: null };
  try {
    results.email = await sendEmail(subject, message);
    console.log("[uptime] email:", results.email);
  } catch (err) {
    console.error("[uptime] email failed:", err.message);
    results.email = { sent: false, error: err.message };
  }

  try {
    results.sms = await sendSms(message);
    console.log("[uptime] sms:", results.sms);
  } catch (err) {
    console.error("[uptime] sms failed:", err.message);
    results.sms = { sent: false, error: err.message };
  }

  return results;
}

async function main() {
  const prev = readState();
  const result = await checkSite();
  const now = new Date().toISOString();

  console.log(
    `[uptime] ${SITE_URL} → ${result.ok ? "OK" : "FAIL"} status=${result.status} ${result.ms}ms` +
      (result.error ? ` (${result.error})` : "")
  );

  let kind = null;
  if (FORCE_ALERT) {
    kind = result.ok ? "up" : "down";
    console.log("[uptime] --force-alert: sending notification regardless of prior state");
  } else if (!result.ok && prev.ok !== false) {
    kind = "down";
  } else if (result.ok && prev.ok === false) {
    kind = "up";
  }

  if (kind) {
    await notify(kind === "up" ? "up" : "down", result);
  } else {
    console.log("[uptime] no state change — no alert");
  }

  writeState({
    ok: result.ok,
    lastChecked: now,
    lastAlertAt: kind ? now : prev.lastAlertAt || null,
    lastStatus: result.status,
    lastError: result.error || null,
  });

  // Non-zero exit when down (useful for CI)
  if (!result.ok) process.exitCode = 1;
}

main().catch((err) => {
  console.error("[uptime] fatal:", err);
  process.exit(2);
});
