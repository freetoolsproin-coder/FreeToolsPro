import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ExternalLink, X } from "lucide-react";
import {
  PRODUCT_HUNT,
  isProductHuntReferral,
  productHuntCtaHref,
} from "../data/productHunt";

/**
 * Dismissible Home banner for Product Hunt launch week.
 * Shows when ?ref=producthunt or ?utm_source=producthunt (and not dismissed).
 */
export default function ProductHuntBanner() {
  const [params] = useSearchParams();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isProductHuntReferral(params)) {
      setVisible(false);
      return;
    }
    try {
      if (sessionStorage.getItem(PRODUCT_HUNT.sessionDismissKey) === "1") {
        setVisible(false);
        return;
      }
    } catch {
      /* private mode */
    }
    setVisible(true);
  }, [params]);

  function dismiss() {
    try {
      sessionStorage.setItem(PRODUCT_HUNT.sessionDismissKey, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  const href = productHuntCtaHref();
  const hasListing = Boolean(PRODUCT_HUNT.productUrl);

  return (
    <div
      className="border-b border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-rose-500/10"
      role="region"
      aria-label="Product Hunt launch"
    >
      <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-3 sm:items-center sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1 text-sm leading-snug text-zinc-800 dark:text-zinc-100">
          <p className="font-semibold tracking-tight">
            We&apos;re on Product Hunt
            <span className="font-normal text-zinc-600 dark:text-zinc-300">
              {" "}
              — {PRODUCT_HUNT.tagline}
            </span>
          </p>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Thanks for visiting from PH.{" "}
            {hasListing
              ? "Support the launch with an upvote if FreeToolsPro is useful to you."
              : "Explore the tools below — upvote link goes live with our listing."}
          </p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#da552f] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#c44a28]"
        >
          {hasListing ? "Upvote on Product Hunt" : "Product Hunt"}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-md p-1.5 text-zinc-500 transition hover:bg-black/5 hover:text-zinc-800 dark:hover:bg-white/10 dark:hover:text-zinc-100"
          aria-label="Dismiss Product Hunt banner"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
