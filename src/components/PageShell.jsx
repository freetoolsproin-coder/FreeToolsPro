import { useId } from "react";

export default function PageShell({ title, subtitle, children }) {
  const headingId = useId();

  return (
    <main
      className="ftp-page relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8"
      aria-labelledby={headingId}
    >
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-800/80">
          FreeToolsPro
        </p>
        <h1
          id={headingId}
          className="ftp-display mt-3 text-3xl font-semibold tracking-tight text-[var(--ftp-ink)] sm:text-4xl"
        >
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 max-w-2xl text-[1.02rem] leading-7 text-[var(--ftp-ink-soft)]">
            {subtitle}
          </p>
        ) : null}
      </header>
      {children}
    </main>
  );
}
