import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  OPEN_SETTINGS_EVENT,
  acceptAllConsent,
  getConsent,
  hasConsentDecision,
  rejectNonEssentialConsent,
  saveConsent,
} from "../utils/consent";

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [manage, setManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  useEffect(() => {
    if (!hasConsentDecision()) setShow(true);

    const onOpen = () => {
      const current = getConsent();
      setAnalytics(current?.analytics ?? false);
      setAdvertising(current?.advertising ?? false);
      setManage(true);
      setShow(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, onOpen);
  }, []);

  const hide = () => {
    setShow(false);
    setManage(false);
  };

  const onAcceptAll = () => {
    acceptAllConsent();
    hide();
  };

  const onReject = () => {
    rejectNonEssentialConsent();
    hide();
  };

  const onSavePreferences = () => {
    saveConsent({ analytics, advertising });
    hide();
  };

  if (!show) return null;

  return (
    <div
      className="cookiebg fixed inset-x-0 bottom-0 z-50 border-t border-white/10 px-4 py-4 text-white sm:px-6"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
    >
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p id="cookie-banner-title" className="text-sm font-semibold text-white">
              Cookie preferences
            </p>
            <p className="mt-1 text-sm leading-6 text-white/70">
              We use essential cookies to run FreeToolsPro. With your permission we also use
              analytics (Google Analytics) and advertising cookies (Google AdSense). See the{" "}
              <Link to="/cookie-policy" className="underline decoration-white/40 hover:decoration-white">
                Cookie Policy
              </Link>{" "}
              and{" "}
              <Link to="/privacy-policy" className="underline decoration-white/40 hover:decoration-white">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {!manage ? (
            <div className="flex flex-shrink-0 flex-wrap gap-2">
              <button
                type="button"
                onClick={onReject}
                className="inline-flex items-center rounded-xl border border-white/25 bg-transparent px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Reject non-essential
              </button>
              <button
                type="button"
                onClick={() => {
                  const current = getConsent();
                  setAnalytics(current?.analytics ?? false);
                  setAdvertising(current?.advertising ?? false);
                  setManage(true);
                }}
                className="inline-flex items-center rounded-xl border border-white/25 bg-transparent px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Manage
              </button>
              <button
                type="button"
                onClick={onAcceptAll}
                className="inline-flex items-center rounded-xl bg-teal-400 px-4 py-2 text-sm font-semibold text-[var(--ftp-ink)] transition hover:bg-teal-300"
              >
                Accept all
              </button>
            </div>
          ) : null}
        </div>

        {manage ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5">
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">Essential</p>
                  <p className="text-white/60">Required for consent storage and basic site function.</p>
                </div>
                <span className="shrink-0 rounded-lg bg-white/10 px-2 py-1 text-xs font-semibold text-white/80">
                  Always on
                </span>
              </li>
              <li className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">Analytics</p>
                  <p className="text-white/60">Google Analytics helps us understand which tools are useful.</p>
                </div>
                <label className="inline-flex shrink-0 items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="h-4 w-4 accent-teal-400"
                  />
                  <span className="text-xs font-semibold">Allow</span>
                </label>
              </li>
              <li className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">Advertising</p>
                  <p className="text-white/60">Google AdSense shows ads that help keep tools free.</p>
                </div>
                <label className="inline-flex shrink-0 items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={advertising}
                    onChange={(e) => setAdvertising(e.target.checked)}
                    className="h-4 w-4 accent-teal-400"
                  />
                  <span className="text-xs font-semibold">Allow</span>
                </label>
              </li>
            </ul>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setManage(false)}
                className="inline-flex items-center rounded-xl border border-white/25 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Back
              </button>
              <button
                type="button"
                onClick={onSavePreferences}
                className="inline-flex items-center rounded-xl bg-teal-400 px-4 py-2 text-sm font-semibold text-[var(--ftp-ink)] transition hover:bg-teal-300"
              >
                Save preferences
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
