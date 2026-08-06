/**
 * Product Hunt launch config for FreeToolsPro.
 * Set `productUrl` to the live PH product URL after launch — enables
 * BRAND.sameAs, footer “As seen on”, and banner upvote CTA.
 */
export const PRODUCT_HUNT = {
  /** Final listing URL — leave empty until the PH page is live */
  productUrl: "",
  /** Soft landing used on the PH “Website” field and share links */
  siteUrl:
    "https://freetoolspro.in/?ref=producthunt&utm_source=producthunt&utm_medium=referral&utm_campaign=ph_launch",
  tagline: "100+ free online tools. No signup. Runs in your browser.",
  name: "FreeToolsPro",
  /** Query keys that show the launch-week banner on Home */
  referralParams: {
    ref: "producthunt",
    utm_source: "producthunt",
  },
  sessionDismissKey: "ftp_ph_banner_dismissed",
};

/** True when visitor arrived from Product Hunt (ref or utm_source). */
export function isProductHuntReferral(searchParams) {
  if (!searchParams) return false;
  const ref = (searchParams.get("ref") || "").toLowerCase();
  const utm = (searchParams.get("utm_source") || "").toLowerCase();
  return (
    ref === PRODUCT_HUNT.referralParams.ref ||
    utm === PRODUCT_HUNT.referralParams.utm_source
  );
}

/** Upvote / listing href — falls back to PH homepage search if URL not set yet. */
export function productHuntCtaHref() {
  if (PRODUCT_HUNT.productUrl) return PRODUCT_HUNT.productUrl;
  return "https://www.producthunt.com/";
}
