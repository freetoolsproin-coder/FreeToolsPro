// Home hero product window: sidebar tabs and the live EMI, GST and CGPA panels. Plain JS.
import { emi, yearlySplit, splitBars } from "../lib/emi-chart.js";

const root = document.querySelector("[data-hero-demo]");
if (root) {
  const fmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
  const inr = (n) => (Number.isFinite(n) ? "₹" + fmt.format(Math.round(n)) : "—");
  const num = (v) => Number(String(v).replace(/[^\d.]/g, ""));
  const pct = (n) => (Number.isFinite(n) ? `${Math.round(n * 10) / 10}%` : "—");

  const calc = {
    emi(f) {
      const P = num(f.P.value),
        r = num(f.r.value),
        y = Math.round(num(f.y.value));
      if (!(P > 0 && y > 0 && y <= 40 && r >= 0 && r < 50)) return null;
      const m = emi(P, r, y);
      const interest = m * y * 12 - P;
      return { main: inr(m), a: inr(P + interest), b: inr(interest), chart: splitBars(yearlySplit(P, r, y)), span: `Year 1 to ${y}` };
    },
    gst(f) {
      const a = num(f.a.value),
        g = num(f.g.value);
      if (!(a >= 0)) return null;
      const t = (a * g) / 100;
      return { main: inr(a + t), a: inr(t), b: `${inr(t / 2)} + ${inr(t / 2)}` };
    },
    cgpa(f) {
      const c = num(f.c.value);
      if (!(c >= 0 && c <= 10)) return null;
      return { main: pct(Math.min(100, c * 9.5)), a: pct(Math.min(100, c * 10)), b: pct(Math.max(0, (c - 0.75) * 10)) };
    },
  };

  root.querySelectorAll("[data-calc]").forEach((panel) => {
    const f = Object.fromEntries([...panel.querySelectorAll("input, select")].map((el) => [el.name, el]));
    const run = () => {
      const r = calc[panel.dataset.calc](f);
      panel.classList.toggle("is-invalid", !r);
      if (!r) return;
      for (const [k, v] of Object.entries(r)) {
        const el = panel.querySelector(`[data-out="${k}"]`);
        if (!el) continue;
        if (k === "chart") el.innerHTML = v;
        else el.textContent = v;
      }
    };
    panel.querySelectorAll("[data-money]").forEach((el) =>
      el.addEventListener("blur", () => {
        const v = num(el.value);
        if (v > 0) el.value = fmt.format(v);
      })
    );
    panel.addEventListener("input", run);
    panel.addEventListener("change", run);
  });

  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const url = root.querySelector("[data-url]");
  const select = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      panel.hidden = !on;
      if (on && url && panel.dataset.path) url.textContent = panel.dataset.path;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t));
    t.addEventListener("keydown", (e) => {
      const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      select(tabs[(i + d + tabs.length) % tabs.length], true);
    });
  });
}
