import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { apexAbsoluteUrl } from "../data/blogSite";

/**
 * Blog-host catch-all: unknown / tool / legal paths → https://freetoolspro.in/...
 * Keeps SPA nav from trapping users on the blog host for tool/legal paths.
 */
export default function ApexRedirect({ path }) {
  const { pathname, search, hash } = useLocation();
  const target = apexAbsoluteUrl(path ?? `${pathname}${search || ""}${hash || ""}`);

  useEffect(() => {
    window.location.replace(target);
  }, [target]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4 text-center text-[var(--ftp-ink-soft)]">
      <p>Opening FreeToolsPro…</p>
      <a href={target} className="font-semibold text-[var(--ftp-ink)] underline-offset-2 hover:underline">
        Continue to {target}
      </a>
    </div>
  );
}
