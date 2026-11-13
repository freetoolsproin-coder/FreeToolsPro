// "Continue where you left off": tool pages remember themselves; the home page lists the last few.
// Stored only in this browser (localStorage). Nothing is sent anywhere.
const KEY = "ftp-recent-tools";
const read = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};
const here = document.querySelector("[data-recent-tool]");
if (here) {
  try {
    const t = JSON.parse(here.dataset.recentTool);
    const list = [t, ...read().filter((x) => x.p !== t.p)].slice(0, 6);
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}
const box = document.querySelector("[data-recent]");
if (box) {
  const list = read();
  const ul = box.querySelector("ul");
  if (list.length && ul) {
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
    ul.innerHTML = list.map((t) => `<li><a class="cat-${esc(t.c)}" href="${esc(t.p)}">${esc(t.n)}</a></li>`).join("");
    box.hidden = false;
    box.querySelector("[data-recent-clear]")?.addEventListener("click", () => {
      try {
        localStorage.removeItem(KEY);
      } catch {}
      box.hidden = true;
    });
  }
}
