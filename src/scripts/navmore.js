// Header menus ("More" on desktop, the menu panel on phones) are <details> elements, so they work
// without JavaScript. This only closes them on an outside click, on Escape, or when focus leaves.
const menus = () => document.querySelectorAll("details.navmore__d[open], details.mnav[open]");
document.addEventListener("click", (e) => {
  for (const d of menus()) if (!d.contains(e.target)) d.removeAttribute("open");
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  for (const d of menus()) {
    d.removeAttribute("open");
    d.querySelector("summary")?.focus();
  }
});
document.addEventListener("focusin", (e) => {
  for (const d of menus()) if (!d.contains(e.target)) d.removeAttribute("open");
});
