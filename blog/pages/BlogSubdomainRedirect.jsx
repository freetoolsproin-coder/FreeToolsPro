import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { blogAbsoluteUrl } from "../data/blogSite";

/**
 * Apex-site catch-all: /blog and /blog/* → https://blog.freetoolspro.in/...
 * Keeps SPA clients in sync with Apache 301 rules in public/.htaccess.
 */
export default function BlogSubdomainRedirect() {
  const { pathname, search, hash } = useLocation();
  const target = `${blogAbsoluteUrl(pathname)}${search || ""}${hash || ""}`;

  useEffect(() => {
    window.location.replace(target);
  }, [target]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4 text-center text-[var(--ftp-ink-soft)]">
      <p>Opening the FreeToolsPro blog…</p>
      <a href={target} className="font-semibold text-[var(--ftp-ink)] underline-offset-2 hover:underline">
        Continue to {target}
      </a>
    </div>
  );
}
