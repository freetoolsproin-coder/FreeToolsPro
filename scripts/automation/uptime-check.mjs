// Uptime monitor for freetoolspro.in (runs every 15 minutes in GitHub Actions; also works locally).
//
// Each run checks the home page, a popular tool page, /sitemap.xml and /robots.txt: HTTP 200, the
// right content (a <title> on HTML pages, <urlset>/<sitemapindex> on the sitemap) and response time.
// It also checks how many days the SSL certificate has left.
//
// Alerts go out only when the state changes, so you get one "DOWN" and one "RECOVERED" message, not
// one every 15 minutes:
//   • DOWN after 2 failed runs in a row (one network blip doesn't wake you up)
//   • RECOVERED on the first good run after that
//   • SSL warning once when the certificate has fewer than 14 days left
// Channels: email (EmailJS), SMS (Twilio) and the SEO_ALERT_WEBHOOK (Slack / Discord / Google Chat),
// whichever are configured. In GitHub Actions the workflow also opens and closes a "Site down" issue.
//
//   node scripts/automation/uptime-check.mjs
//   node scripts/automation/uptime-check.mjs --force-alert     send a test alert now
//
// Settings: UPTIME_URL, UPTIME_PATHS (comma-separated), ALERT_EMAIL, ALERT_PHONE, EMAILJS_SERVICE_ID,
// EMAILJS_TEMPLATE_ID (or EMAILJS_UPTIME_TEMPLATE_ID), EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY,
// TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, SEO_ALERT_WEBHOOK.
// State: automation/state/uptime.json
import { connect } from "node:tls";
import { appendFileSync } from "node:fs";
import { join } from "node:path";
import { STATE_DIR, env, flag, readJson, writeJson } from "./lib/env.mjs";

const SITE = env("UPTIME_URL", "https://freetoolspro.in").replace(/\/$/, "");
const PATHS = env("UPTIME_PATHS", "/,/calculators/emi-calculator,/sitemap.xml,/robots.txt").split(",").map((p) => p.trim()).filter(Boolean);
const TIMEOUT_MS = Number(env("UPTIME_TIMEOUT_MS", "15000"));
const SLOW_MS = Number(env("UPTIME_SLOW_MS", "5000"));
const FAILS_BEFORE_ALERT = Number(env("UPTIME_FAILS_BEFORE_ALERT", "2"));
const SSL_WARN_DAYS = Number(env("UPTIME_SSL_WARN_DAYS", "14"));
const STATE_FILE = join(STATE_DIR, "uptime.json");
const FORCE = flag("force-alert");

async function checkPath(path) {
  const url = SITE + path;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  const t0 = Date.now();
  try {
    const r = await fetch(url, { redirect: "follow", signal: ctl.signal, headers: { "user-agent": "FreeToolsPro-Uptime/2.0" } });
    const body = await r.text();
    const ms = Date.now() - t0;
    let problem = null;
    if (r.status !== 200) problem = `HTTP ${r.status}`;
    else if (path.endsWith(".xml") && !/<(urlset|sitemapindex)\b/.test(body)) problem = "sitemap content is not XML";
    else if (path.endsWith(".txt") && !/user-agent/i.test(body)) problem = "robots.txt content looks wrong";
    else if (!/\.(xml|txt)$/.test(path) && !/<title>[^<]{3,}/i.test(body)) problem = "page has no <title> (blank or error page?)";
    return { path, status: r.status, ms, ok: !problem, problem, slow: ms > SLOW_MS };
  } catch (e) {
    return { path, status: 0, ms: Date.now() - t0, ok: false, problem: e.name === "AbortError" ? `timeout after ${TIMEOUT_MS / 1000}s` : e.cause?.code || e.message };
  } finally {
    clearTimeout(timer);
  }
}

function sslDaysLeft() {
  return new Promise((resolve) => {
    const host = new URL(SITE).hostname;
    const s = connect({ host, port: 443, servername: host, timeout: TIMEOUT_MS }, () => {
      const cert = s.getPeerCertificate();
      s.end();
      resolve(cert?.valid_to ? Math.floor((Date.parse(cert.valid_to) - Date.now()) / 864e5) : null);
    });
    s.on("error", () => resolve(null));
    s.on("timeout", () => (s.destroy(), resolve(null)));
  });
}

// ------------------------------------------------------------------ alert channels

async function sendEmail(subject, message) {
  const service = env("EMAILJS_SERVICE_ID", "");
  const template = env("EMAILJS_UPTIME_TEMPLATE_ID", env("EMAILJS_TEMPLATE_ID", ""));
  const pub = env("EMAILJS_PUBLIC_KEY", "");
  const to = env("ALERT_EMAIL", "support@freetoolspro.in");
  if (!service || !template || !pub) return "skipped (EmailJS not configured)";
  const body = {
    service_id: service,
    template_id: template,
    user_id: pub,
    template_params: { from_name: "FreeToolsPro Uptime", name: "Uptime Monitor", email: to, reply_to: to, subject, message, title: subject, user_email: to, user_name: "Uptime Monitor" },
  };
  if (env("EMAILJS_PRIVATE_KEY", "")) body.accessToken = env("EMAILJS_PRIVATE_KEY");
  const r = await fetch("https://api.emailjs.com/api/v1.0/email/send", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  return r.ok ? "sent" : `failed: EmailJS ${r.status} ${(await r.text()).slice(0, 120)}`;
}

async function sendSms(message) {
  const sid = env("TWILIO_ACCOUNT_SID", "");
  const token = env("TWILIO_AUTH_TOKEN", "");
  const from = env("TWILIO_FROM_NUMBER", "");
  const to = env("ALERT_PHONE", "");
  if (!sid || !token || !from || !to) return "skipped (Twilio not configured)";
  const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: { authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`, "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ To: to, From: from, Body: message.slice(0, 1500) }),
  });
  return r.ok ? "sent" : `failed: Twilio ${r.status}`;
}

async function sendWebhook(message) {
  const hook = env("SEO_ALERT_WEBHOOK", "");
  if (!hook) return "skipped (no webhook)";
  const r = await fetch(hook, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(/discord/.test(hook) ? { content: message.slice(0, 1900) } : { text: message }) });
  return r.ok || r.status === 204 ? "sent" : `failed: HTTP ${r.status}`;
}

async function notify(subject, message) {
  console.log(`\n${subject}\n${message}\n`);
  for (const [name, fn] of [["email", () => sendEmail(subject, message)], ["sms", () => sendSms(`${subject}\n${message}`)], ["webhook", () => sendWebhook(`${subject}\n${message}`)]]) {
    try {
      console.log(`  ${name}: ${await fn()}`);
    } catch (e) {
      console.log(`  ${name}: failed: ${e.message}`);
    }
  }
}

// ------------------------------------------------------------------ main

async function main() {
  const prev = readJson(STATE_FILE, { status: "up", fails: 0 });
  const results = await Promise.all(PATHS.map(checkPath));
  const days = await sslDaysLeft();
  const now = new Date().toISOString();
  for (const r of results) console.log(`${r.ok ? "ok  " : "FAIL"} ${r.path.padEnd(32)} ${String(r.status).padStart(3)} ${String(r.ms).padStart(6)} ms${r.problem ? `  ${r.problem}` : r.slow ? "  slow" : ""}`);
  console.log(`SSL certificate: ${days == null ? "could not read" : `${days} day(s) left`}`);

  const failed = results.filter((r) => !r.ok);
  const fails = failed.length ? (prev.fails || 0) + 1 : 0;
  let status = prev.status || "up";
  const lines = (rs) => rs.map((r) => `${r.path}: ${r.problem || `HTTP ${r.status}`} (${r.ms} ms)`).join("\n");

  if (FORCE) {
    await notify(`[FreeToolsPro] Test alert — ${SITE}`, `This is a test of the uptime alerts.\n${lines(results)}\nTime: ${now}`);
  } else if (failed.length && fails >= FAILS_BEFORE_ALERT && status !== "down") {
    status = "down";
    await notify(`[FreeToolsPro] Site DOWN — ${SITE}`, `${failed.length} of ${results.length} checks failed ${fails} times in a row.\n${lines(failed)}\nTime: ${now}`);
  } else if (!failed.length && status === "down") {
    status = "up";
    const downFor = prev.downSince ? Math.round((Date.now() - Date.parse(prev.downSince)) / 60000) : null;
    await notify(`[FreeToolsPro] Site recovered — ${SITE}`, `All ${results.length} checks pass again${downFor != null ? ` after about ${downFor} minutes` : ""}.\nTime: ${now}`);
  } else if (failed.length && status !== "down") console.log(`Failure ${fails} of ${FAILS_BEFORE_ALERT} before alerting.`);

  let sslWarnedFor = prev.sslWarnedFor || null;
  if (days != null && days < SSL_WARN_DAYS && sslWarnedFor !== String(days < 3 ? "urgent" : "soon")) {
    sslWarnedFor = days < 3 ? "urgent" : "soon";
    await notify(`[FreeToolsPro] SSL certificate expires in ${days} day(s)`, `The HTTPS certificate for ${new URL(SITE).hostname} expires in ${days} day(s). Renew it (e.g. sudo certbot renew) or the site will show a security warning and drop out of search.`);
  } else if (days != null && days >= SSL_WARN_DAYS) sslWarnedFor = null;

  writeJson(STATE_FILE, {
    status,
    fails,
    downSince: status === "down" ? prev.downSince || now : null,
    lastChecked: now,
    sslDaysLeft: days,
    sslWarnedFor,
    checks: results,
  });

  // For the GitHub workflow: open or close the "Site down" issue.
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `status=${status}\nchanged=${status !== (prev.status || "up")}\n`);
    appendFileSync(process.env.GITHUB_OUTPUT, `details<<EOF\n${failed.length ? lines(failed) : lines(results)}\nSSL: ${days ?? "?"} day(s) left\nEOF\n`);
  }
}

main().catch((e) => {
  console.error("uptime check crashed:", e.message);
  process.exit(2);
});
