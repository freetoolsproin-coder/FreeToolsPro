import { prepIndex, terms, searchTools, readRecent } from "../lib/tool-search.js";

// Home hero Command Center: search the real tool catalogue by name or task, filter by category,
// move with the arrow keys and open the tool with Enter. Also drives the pointer-aware glow.
const root = document.querySelector("[data-cc]");
const hero = document.querySelector("[data-hx]");
const idxEl = document.getElementById("cc-index");

if (root && idxEl) {
  const tools = prepIndex(JSON.parse(idxEl.textContent));

  const input = root.querySelector("#cc-input");
  const list = root.querySelector("#cc-list");
  const label = root.querySelector("[data-cc-label]");
  const empty = root.querySelector("[data-cc-empty]");
  const chips = [...root.querySelectorAll("[data-filter]")];
  const icons = Object.fromEntries([...document.querySelectorAll("template[data-cc-icon]")].map((t) => [t.dataset.ccIcon, t.innerHTML]));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  let filter = "all";
  let shown = [];
  let active = 0;

  function results() {
    const q = input.value.trim();
    let pool = tools;
    if (filter === "popular") pool = pool.filter((t) => t.pop);
    else if (filter !== "all") pool = pool.filter((t) => t.k === filter);
    if (!q) {
      if (filter === "all") {
        // Tools this visitor opened before (saved in this browser by recent.js), then popular ones.
        const recent = readRecent().map((r) => tools.find((t) => t.p === r.p)).filter(Boolean);
        const items = [...recent, ...pool.filter((t) => t.pop && !recent.includes(t))].slice(0, 5);
        return { items, title: recent.length ? "Recently used and popular" : "Popular tools" };
      }
      return { items: pool.slice(0, 5), title: filter === "popular" ? "Popular tools" : `${chips.find((c) => c.dataset.filter === filter)?.textContent.trim()} tools` };
    }
    const items = searchTools(pool, q, 5);
    if (!terms(q).length) return { items: pool.filter((t) => t.pop).slice(0, 5), title: "Popular tools" };
    return { items, title: items.length ? `Best matches for “${q}”` : "No matches" };
  }

  function render() {
    const { items, title } = results();
    shown = items;
    active = 0;
    label.textContent = title;
    list.innerHTML = items
      .map(
        (t, i) =>
          `<li role="option" id="cc-opt-${i}" aria-selected="${i === 0}" class="cc__opt cat-${esc(t.k)}"><a href="${esc(t.p)}" tabindex="-1"><span class="cc__opt-icon">${icons[t.k] || ""}</span><span class="cc__opt-txt"><span class="cc__opt-name">${esc(t.n)}</span><span class="cc__opt-short">${esc(t.s)}</span></span><span class="cc__opt-cat">${esc(t.c)}</span></a></li>`
      )
      .join("");
    empty.hidden = items.length > 0;
    list.hidden = !items.length;
    input.setAttribute("aria-activedescendant", items.length ? "cc-opt-0" : "");
    list.classList.remove("is-in");
    void list.offsetWidth; // restart the short fade-in
    list.classList.add("is-in");
  }

  function move(d) {
    if (!shown.length) return;
    active = (active + d + shown.length) % shown.length;
    list.querySelectorAll('[role="option"]').forEach((li, i) => li.setAttribute("aria-selected", String(i === active)));
    input.setAttribute("aria-activedescendant", `cc-opt-${active}`);
    list.querySelector(`#cc-opt-${active}`)?.scrollIntoView({ block: "nearest" });
  }

  function setFilter(f) {
    filter = f;
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.filter === f)));
    render();
  }

  if (readRecent().length) render();

  // The big search box on the left drives the Command Center: same query, same results, same keys.
  const left = document.querySelector("[data-hx-search]");
  const leftIn = left?.querySelector("input");
  if (left && leftIn) {
    leftIn.setAttribute("role", "combobox");
    leftIn.setAttribute("aria-autocomplete", "list");
    leftIn.setAttribute("aria-expanded", "true");
    const sync = () => {
      input.value = leftIn.value;
      if (filter !== "all" && leftIn.value.trim()) setFilter("all");
      else render();
      leftIn.setAttribute("aria-activedescendant", input.getAttribute("aria-activedescendant") || "");
      root.classList.toggle("is-driven", !!leftIn.value.trim());
    };
    leftIn.addEventListener("input", sync);
    leftIn.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        move(e.key === "ArrowDown" ? 1 : -1);
        leftIn.setAttribute("aria-activedescendant", input.getAttribute("aria-activedescendant") || "");
      } else if (e.key === "Escape") {
        leftIn.value = "";
        sync();
      }
    });
    left.addEventListener("submit", (e) => {
      // Open the highlighted tool; with no match, fall through to the /tools search page.
      if (leftIn.value.trim() && shown[active]) {
        e.preventDefault();
        location.href = shown[active].p;
      }
    });
    // Typing in the palette mirrors back to the left box.
    input.addEventListener("input", () => {
      leftIn.value = input.value;
    });
  }
  input.addEventListener("input", render);
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") (e.preventDefault(), move(1));
    else if (e.key === "ArrowUp") (e.preventDefault(), move(-1));
    else if (e.key === "Enter") {
      if (shown[active]) {
        e.preventDefault();
        location.href = shown[active].p;
      }
    } else if (e.key === "Escape") {
      input.value = "";
      render();
    }
  });
  list.addEventListener("mousemove", (e) => {
    const li = e.target.closest('[role="option"]');
    if (!li) return;
    const i = [...list.children].indexOf(li);
    if (i !== active && i >= 0) move(i - active);
  });
  chips.forEach((c) => c.addEventListener("click", () => setFilter(c.dataset.filter)));
  root.querySelectorAll("[data-q]").forEach((b) =>
    b.addEventListener("click", () => {
      input.value = b.dataset.q;
      if (filter !== "all") setFilter("all");
      else render();
      input.focus();
    })
  );
  document.querySelectorAll("[data-cc-popular]").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      input.value = "";
      setFilter("popular");
      root.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
      input.focus({ preventScroll: true });
    })
  );
  // "/" focuses the Command Center on the home page (search.js does the same for other pages).
  document.addEventListener("keydown", (e) => {
    if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
    if (/^(input|textarea|select)$/i.test(e.target.tagName) || e.target.isContentEditable) return;
    e.preventDefault();
    (document.querySelector("#hx-q") || input).focus();
  });
}

// Ambient light follows the pointer gently, only on desktop pointers and when motion is welcome.
if (hero && matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) {
  let raf = 0;
  hero.addEventListener("pointermove", (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
      hero.style.setProperty("--my", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
    });
  });
}

// Spotlight cards (.spot): a soft light follows the pointer over the card. Desktop only.
if (matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) {
  document.addEventListener("pointermove", (e) => {
    const card = e.target.closest?.(".spot");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--sx", `${e.clientX - r.left}px`);
    card.style.setProperty("--sy", `${e.clientY - r.top}px`);
  });
}
