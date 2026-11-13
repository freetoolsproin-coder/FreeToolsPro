// Header search palette: Ctrl K (⌘ K on a Mac) or the "Search tools" button opens a dialog that
// searches every tool. The index (/search-index.json) is fetched the first time it opens.
import { prepIndex, searchTools, readRecent } from "../lib/tool-search.js";

const dlg = document.querySelector("[data-kpal]");
if (dlg && typeof dlg.showModal === "function") {
  const input = dlg.querySelector("#kpal-input");
  const list = dlg.querySelector("#kpal-list");
  const label = dlg.querySelector("[data-kpal-label]");
  const empty = dlg.querySelector("[data-kpal-empty]");
  const isMac = /Mac|iPhone|iPad/.test(navigator.userAgentData?.platform || navigator.platform || "");
  document.querySelectorAll("[data-kbd]").forEach((k) => (k.textContent = isMac ? "⌘ K" : "Ctrl K"));
  document.querySelectorAll("[data-kpal-open]").forEach((b) => b.setAttribute("aria-keyshortcuts", isMac ? "Meta+K" : "Control+K"));

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  let index = null;
  let loading = null;
  let shown = [];
  let active = 0;
  const load = () =>
    index
      ? Promise.resolve(index)
      : (loading ||= fetch("/search-index.json")
          .then((r) => r.json())
          .then((l) => (index = prepIndex(l)))
          .catch(() => (index = [])));

  function render() {
    const q = input.value.trim();
    if (!index) {
      label.textContent = "Loading tools…";
      list.innerHTML = "";
      return;
    }
    let items, title;
    if (!q) {
      const recent = readRecent().map((r) => index.find((t) => t.p === r.p)).filter(Boolean);
      items = [...recent, ...index.filter((t) => t.pop && !recent.includes(t))].slice(0, 7);
      title = recent.length ? "Recently used and popular" : "Popular tools";
    } else {
      items = searchTools(index, q, 8);
      title = items.length ? "Best matches" : "No matches";
    }
    shown = items;
    active = 0;
    label.textContent = title;
    list.innerHTML = items
      .map(
        (t, i) =>
          `<li role="option" id="kpal-opt-${i}" aria-selected="${i === 0}" class="kpal__opt cat-${esc(t.k)}"><a href="${esc(t.p)}" tabindex="-1"><span class="kpal__dot" aria-hidden="true"></span><span class="kpal__txt"><span class="kpal__name">${esc(t.n)}</span><span class="kpal__short">${esc(t.s)}</span></span><span class="kpal__cat">${esc(t.c)}</span></a></li>`
      )
      .join("");
    empty.hidden = !!items.length || !q;
    input.setAttribute("aria-activedescendant", items.length ? "kpal-opt-0" : "");
  }

  function move(d) {
    if (!shown.length) return;
    active = (active + d + shown.length) % shown.length;
    list.querySelectorAll('[role="option"]').forEach((li, i) => li.setAttribute("aria-selected", String(i === active)));
    input.setAttribute("aria-activedescendant", `kpal-opt-${active}`);
    list.querySelector(`#kpal-opt-${active}`)?.scrollIntoView({ block: "nearest" });
  }

  function open() {
    if (dlg.open) return;
    dlg.showModal();
    document.documentElement.classList.add("kpal-open");
    input.value = "";
    render();
    input.focus();
    load().then(render);
  }
  function close() {
    if (dlg.open) dlg.close();
  }
  dlg.addEventListener("close", () => document.documentElement.classList.remove("kpal-open"));

  document.querySelectorAll("[data-kpal-open]").forEach((b) =>
    b.addEventListener("click", (e) => {
      e.preventDefault();
      open();
    })
  );
  dlg.querySelector("[data-kpal-close]")?.addEventListener("click", close);
  // Clicking the dimmed backdrop (outside the box) closes it.
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) close();
  });
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === "k") {
      e.preventDefault();
      dlg.open ? close() : open();
    }
  });

  input.addEventListener("input", render);
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") (e.preventDefault(), move(1));
    else if (e.key === "ArrowUp") (e.preventDefault(), move(-1));
    else if (e.key === "Escape") {
      // A search box would swallow the first Escape to clear itself; close the palette instead.
      e.preventDefault();
      close();
    } else if (e.key === "Enter" && shown[active]) {
      e.preventDefault();
      location.href = shown[active].p;
    }
  });
  list.addEventListener("mousemove", (e) => {
    const li = e.target.closest('[role="option"]');
    const i = li ? [...list.children].indexOf(li) : -1;
    if (i >= 0 && i !== active) move(i - active);
  });
  // Warm the index on first hover/focus of the button so the palette opens with results.
  document.querySelectorAll("[data-kpal-open]").forEach((b) => ["pointerenter", "focus"].forEach((ev) => b.addEventListener(ev, () => load(), { once: true })));
}
