// Cookie consent bar. Uses the same storage key as the previous site so returning
// visitors are not asked again. Google Consent Mode defaults are set inline in <head>.
const KEY = "ftp_cookie_consent";
const bar = document.getElementById("consent");

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}
function save(all) {
  const v = { necessary: true, analytics: all, ts: Date.now() };
  try {
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch {}
  const g = all ? "granted" : "denied";
  window.gtag?.("consent", "update", { analytics_storage: g });
  if (bar) bar.hidden = true;
}

if (bar) {
  if (!read()) bar.hidden = false;
  bar.addEventListener("click", (e) => {
    const b = e.target.closest("[data-consent]");
    if (b) save(b.dataset.consent === "all");
  });
}
document.querySelectorAll("[data-consent-open]").forEach((b) =>
  b.addEventListener("click", () => {
    if (bar) bar.hidden = false;
  })
);
