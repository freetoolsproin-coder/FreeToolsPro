/** Tiny helper — keep out of toolDefinitions / homeSections import graph. */
export function openCommandPalette() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("ftp:open-command-palette"));
}
