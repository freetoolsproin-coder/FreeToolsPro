import { GA_MEASUREMENT_ID, getConsent } from "./consent";

export const GA_ID = GA_MEASUREMENT_ID;

function canTrack() {
  return typeof window !== "undefined" && getConsent()?.analytics === true && typeof window.gtag === "function";
}

export const pageview = (url) => {
  if (!canTrack()) return;
  window.gtag("config", GA_ID, {
    page_path: url,
  });
};

export const event = ({ action, category, label, value }) => {
  if (!canTrack()) return;
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
};
