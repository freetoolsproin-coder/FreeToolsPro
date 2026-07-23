import fs from "fs";

const path = "src/index.css";
let s = fs.readFileSync(path, "utf8");
const start = s.indexOf("/* ── Premium SaaS hero · aurora ── */");
const end = s.indexOf(".noborder{border:0px solid #fff!important;}");

if (start < 0 || end < 0) {
  console.error("markers not found", { start, end });
  process.exit(1);
}

const flat = `/* ── Flat homepage hero ── */
.flat-hero {
  position: relative;
  border-bottom: 1px solid var(--ftp-line);
  background: #f8fafc;
  padding: clamp(3.25rem, 7vw, 5.25rem) 1rem clamp(2.75rem, 5vw, 4rem);
}

.flat-hero--page {
  padding: clamp(2.5rem, 5vw, 3.75rem) 1rem clamp(2rem, 4vw, 3rem);
  text-align: center;
}

.flat-hero__inner {
  margin-inline: auto;
  max-width: 36rem;
  text-align: center;
}

.flat-hero__brand {
  margin: 0;
  font-size: clamp(2.35rem, 5.5vw, 3.5rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
  color: var(--ftp-ink);
}

.flat-hero--page .flat-hero__brand {
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--ftp-teal-deep);
}

.flat-hero__title {
  margin: 1rem 0 0;
  font-size: clamp(1.35rem, 2.8vw, 1.75rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.3;
  color: var(--ftp-ink);
}

.flat-hero--page .flat-hero__title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
}

.flat-hero__text {
  margin: 0.85rem auto 0;
  max-width: 30rem;
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--ftp-ink-soft);
}

.flat-hero__actions {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin: 1.75rem auto 0;
  max-width: 28rem;
}

@media (min-width: 640px) {
  .flat-hero__actions {
    flex-direction: row;
    align-items: stretch;
  }
}

.flat-hero__search {
  position: relative;
  flex: 1;
  min-width: 0;
}

.flat-hero__search-icon {
  position: absolute;
  left: 0.9rem;
  top: 50%;
  width: 1.05rem;
  height: 1.05rem;
  transform: translateY(-50%);
  color: var(--ftp-ink-soft);
  pointer-events: none;
}

.flat-hero__search input {
  width: 100%;
  height: 3rem;
  padding: 0 0.95rem 0 2.65rem;
  border: 1px solid var(--ftp-line);
  border-radius: 0.65rem;
  background: #fff;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--ftp-ink);
  outline: none;
  transition: border-color 0.15s;
}

.flat-hero__search input::placeholder {
  color: rgba(42, 53, 72, 0.5);
}

.flat-hero__search input:focus {
  border-color: var(--ftp-teal);
}

.flat-hero__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  height: 3rem;
  padding: 0 1.15rem;
  border-radius: 0.65rem;
  background: var(--ftp-ink);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s;
}

.flat-hero__btn:hover {
  background: #0f1a2e;
}

.flat-hero__meta {
  margin: 1.35rem 0 0;
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--ftp-ink-soft);
}

.herobg {
  background: #f8fafc;
}

`;

fs.writeFileSync(path, s.slice(0, start) + flat + s.slice(end));
console.log("replaced saas-hero with flat-hero", { start, end });
