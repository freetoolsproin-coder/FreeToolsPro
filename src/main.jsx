import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";
import { initConsentOnBoot } from "./utils/consent";

function unregisterLegacyServiceWorkers() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => {
      reg.unregister().catch(() => {});
    });
  });
  if (typeof caches !== "undefined") {
    caches.keys().then((keys) => {
      keys.forEach((key) => {
        caches.delete(key).catch(() => {});
      });
    });
  }
}

function dismissBootShell() {
  const boot = document.getElementById("ftp-boot");
  if (!boot) return;
  // Keep boot visible through first React paint so mobile LCP can use it.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      boot.classList.add("is-done");
      boot.setAttribute("aria-hidden", "true");
    });
  });
}

if (typeof window !== "undefined" && "requestIdleCallback" in window) {
  window.requestIdleCallback(
    () => {
      initConsentOnBoot();
      unregisterLegacyServiceWorkers();
    },
    { timeout: 4000 }
  );
} else {
  setTimeout(() => {
    initConsentOnBoot();
    unregisterLegacyServiceWorkers();
  }, 50);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

dismissBootShell();
