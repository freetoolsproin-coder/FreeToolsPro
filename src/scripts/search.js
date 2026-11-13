// Search boxes in page content ([data-search]).
// On /tools (the page has [data-cat] sections) typing switches to a flat, ranked list of matching
// tools; clearing it brings the grouped catalogue back. Elsewhere (404 page) it shows a dropdown.
// Matching is shared with the header palette and the home Command Center (src/lib/tool-search.js).
import { prepIndex, searchTools, terms } from "../lib/tool-search.js";

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

for (const form of document.querySelectorAll("[data-search]")) {
  const input = form.querySelector("input");
  const box = form.querySelector(".search__results");
  const sections = [...document.querySelectorAll("[data-cat]")];
  const inline = sections.length > 0;

  if (inline) {
    // ---------- /tools: ranked results in place of the grouped list ----------
    const results = document.querySelector("[data-results]");
    const list = document.querySelector("[data-results-list]");
    const title = document.querySelector("[data-results-title]");
    const empty = document.querySelector("[data-empty]");
    const jump = document.querySelector("[data-jumpnav]");
    const items = [...document.querySelectorAll("[data-cat] li[data-tool]")];
    const index = prepIndex(items.map((li, i) => ({ n: li.dataset.n, s: li.dataset.s, c: li.dataset.c, p: li.dataset.p, pop: li.dataset.pop ? 1 : 0, _i: i })));

    const apply = (q) => {
      const on = terms(q).length > 0;
      sections.forEach((s) => (s.hidden = on));
      if (jump) jump.hidden = on;
      if (!on) {
        results.hidden = true;
        empty.hidden = true;
        list.innerHTML = "";
        return;
      }
      const found = searchTools(index, q, items.length);
      list.replaceChildren(...found.map((t) => items[t._i].cloneNode(true)));
      title.textContent = found.length === 1 ? `1 tool matches “${q.trim()}”` : `${found.length} tools match “${q.trim()}”`;
      results.hidden = !found.length;
      empty.hidden = !!found.length;
    };
    input.addEventListener("input", () => apply(input.value));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const first = list.querySelector("a");
      if (first) location.href = first.href;
    });
    document.querySelector("[data-results-clear]")?.addEventListener("click", () => {
      input.value = "";
      apply("");
      input.focus();
    });
    const q = new URLSearchParams(location.search).get("search");
    if (q) {
      input.value = q;
      apply(q);
    }
    continue;
  }

  // ---------- dropdown (404 page) ----------
  const idxEl = document.getElementById("tool-index");
  let index = idxEl ? prepIndex(JSON.parse(idxEl.textContent)) : null;
  let loading = null;
  const ensure = () =>
    index
      ? Promise.resolve()
      : (loading ||= fetch("/search-index.json")
          .then((r) => r.json())
          .then((l) => (index = prepIndex(l)))
          .catch(() => (index = [])));
  let shown = [];
  let active = -1;
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-controls", box.id);
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-expanded", "false");

  const render = () => {
    const q = input.value;
    if (!terms(q).length) {
      box.hidden = true;
      input.setAttribute("aria-expanded", "false");
      shown = [];
      return;
    }
    shown = searchTools(index || [], q, 8);
    active = shown.length ? 0 : -1;
    box.innerHTML = shown.length
      ? shown.map((t, i) => `<li role="option" id="sr-${i}" aria-selected="${i === active}"><a href="${esc(t.p)}"><span>${esc(t.n)}</span><small>${esc(t.s)} · ${esc(t.c)}</small></a></li>`).join("")
      : `<li class="search__none">No tool matches. Press Enter to search the full list.</li>`;
    box.hidden = false;
    input.setAttribute("aria-expanded", "true");
  };
  const move = (d) => {
    if (!shown.length) return;
    active = (active + d + shown.length) % shown.length;
    box.querySelectorAll("[role=option]").forEach((li, i) => li.setAttribute("aria-selected", String(i === active)));
    input.setAttribute("aria-activedescendant", `sr-${active}`);
  };
  input.addEventListener("focus", () => ensure(), { once: true });
  input.addEventListener("input", () => ensure().then(render));
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") (e.preventDefault(), move(1));
    else if (e.key === "ArrowUp") (e.preventDefault(), move(-1));
    else if (e.key === "Escape") box.hidden = true;
  });
  form.addEventListener("submit", (e) => {
    if (shown[active]) {
      e.preventDefault();
      location.href = shown[active].p;
    }
  });
  document.addEventListener("click", (e) => {
    if (!form.contains(e.target)) box.hidden = true;
  });
}

// Press "/" anywhere (outside a text field) to jump to the page's search box.
document.addEventListener("keydown", (e) => {
  if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
  if (/^(input|textarea|select)$/i.test(e.target.tagName) || e.target.isContentEditable) return;
  const box = document.querySelector("[data-search] input");
  if (box) {
    e.preventDefault();
    box.focus();
    box.select();
  }
});
