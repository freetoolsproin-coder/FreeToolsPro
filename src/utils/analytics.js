export const GA_ID = "G-XXXXXXXXXX";

export const pageview = (url) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("config", GA_ID, {
      page_path: url,
    });
  }
};

export const event = ({ action, category, label, value }) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};
