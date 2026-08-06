/* Legacy stub: old builds injected this file. Do not register a PWA. */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (regs) {
    regs.forEach(function (reg) {
      reg.unregister();
    });
  });
  if (typeof caches !== "undefined") {
    caches.keys().then(function (keys) {
      keys.forEach(function (key) {
        caches.delete(key);
      });
    });
  }
}
