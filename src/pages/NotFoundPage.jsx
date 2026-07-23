import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="ftp-page flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-800/80">404</p>
      <h1 className="ftp-display mt-3 text-4xl font-semibold tracking-tight text-[var(--ftp-ink)] sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-[var(--ftp-ink-soft)] leading-7">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <Link to="/" className="site-header__cta mt-8 inline-flex">
        Back to homepage
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </main>
  );
}
