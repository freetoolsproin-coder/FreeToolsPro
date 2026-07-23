/** Cookie / tracking consent for FreeToolsPro (localStorage). */

export const CONSENT_STORAGE_KEY = "ftp_cookie_consent";
export const LEGACY_ACCEPT_KEY = "cookieAccepted";

export const GA_MEASUREMENT_ID = "G-K3BPNTKNHS";
export const ADSENSE_CLIENT_ID = "ca-pub-8047633846274756";

export const CONSENT_EVENT = "ftp:consent-changed";
export const OPEN_SETTINGS_EVENT = "ftp:open-cookie-settings";

/**
 * @typedef {{ version: number, essential: true, analytics: boolean, advertising: boolean, updatedAt: string }} ConsentState
 */

/** @returns {ConsentState | null} */
export function getConsent() {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.analytics === "boolean" && typeof parsed.advertising === "boolean") {
        return {
          version: 1,
          essential: true,
          analytics: parsed.analytics,
          advertising: parsed.advertising,
          updatedAt: parsed.updatedAt || new Date().toISOString(),
        };
      }
    }

    // Migrate legacy Accept-only flag → accept all non-essential
    if (localStorage.getItem(LEGACY_ACCEPT_KEY) === "true") {
      const migrated = {
        version: 1,
        essential: true,
        analytics: true,
        advertising: true,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
  } catch {
    /* ignore corrupt storage */
  }

  return null;
}

/** @param {Partial<Pick<ConsentState, "analytics" | "advertising">>} partial */
export function saveConsent(partial) {
  const next = {
    version: 1,
    essential: true,
    analytics: Boolean(partial.analytics),
    advertising: Boolean(partial.advertising),
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
  localStorage.removeItem(LEGACY_ACCEPT_KEY);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: next }));
  applyConsentScripts(next);
  return next;
}

export function acceptAllConsent() {
  return saveConsent({ analytics: true, advertising: true });
}

export function rejectNonEssentialConsent() {
  return saveConsent({ analytics: false, advertising: false });
}

export function hasConsentDecision() {
  return getConsent() !== null;
}

export function openCookieSettings() {
  window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT));
}

function ensureGtagStub() {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }
}

function loadScriptOnce(src, attrs = {}) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const s = document.createElement("script");
  s.src = src;
  s.async = true;
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.appendChild(s);
}

/** Load or skip GA / AdSense based on stored consent. Safe to call repeatedly. */
export function applyConsentScripts(consent = getConsent()) {
  if (typeof window === "undefined" || !consent) return;

  if (consent.analytics) {
    ensureGtagStub();
    loadScriptOnce(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });
  }

  if (consent.advertising) {
    loadScriptOnce(
      `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`,
      { crossorigin: "anonymous" }
    );
  }
}

/** Call once on app boot after DOM is ready. */
export function initConsentOnBoot() {
  const consent = getConsent();
  if (consent) applyConsentScripts(consent);
}
