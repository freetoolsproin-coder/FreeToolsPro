import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import Header from "./components/Header";
import RouteTracker from "./components/RouteTracker";
import ScrollTracker from "./components/ScrollTracker";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { isBlogHostname } from "../blog/data/blogSite";

const BlogRoutes = lazy(() => import("../blog/pages/BlogRoutes"));
const CookieBanner = lazy(() => import("./components/CookieBanner"));
const CommandPalette = lazy(() => import("./components/CommandPalette"));
const SoftwareSchema = lazy(() => import("./components/SoftwareSchema"));
const ToolRouteAtmosphere = lazy(() => import("./components/ToolRouteAtmosphere"));
const AutoSeo = lazy(() => import("./components/AutoSeo"));

const fallback = (
  <div className="flex min-h-[40vh] items-center justify-center text-[var(--ftp-ink-soft)]">
    Loading…
  </div>
);

function StripArticlesRedirect() {
  const { pathname, search, hash } = useLocation();
  const rest = pathname.replace(/^\/articles\/?/, "/") || "/";
  return <Navigate to={`${rest}${search || ""}${hash || ""}`} replace />;
}

function useIdleFlag(timeout = 2500) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setReady(true), { timeout });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(() => setReady(true), Math.min(timeout, 400));
    return () => window.clearTimeout(t);
  }, [timeout]);
  return ready;
}

/** Load the giant appRoutes table only when needed (not on first home paint). */
function ApexRoutes() {
  const { pathname } = useLocation();
  const [routes, setRoutes] = useState(null);
  const isHome = pathname === "/" || pathname === "";

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      import("./routes/appRoutes.jsx").then((m) => {
        if (!cancelled) setRoutes(m.appRoutes);
      });

    if (!isHome) {
      load();
      return () => {
        cancelled = true;
      };
    }

    // On homepage: wait until idle so mobile FCP/LCP aren't fighting route table parse.
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(load, { timeout: 6000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }
    const t = window.setTimeout(load, 2000);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [isHome]);

  // Keep a stable Home mount on "/" so idle route-table load doesn't remount the page.
  if (isHome) {
    return <Home />;
  }

  if (!routes) {
    return fallback;
  }

  return (
    <Suspense fallback={fallback}>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Suspense>
  );
}

export default function App() {
  const blogHost = isBlogHostname();
  const chromeReady = useIdleFlag(2800);
  const { pathname } = useLocation();
  const isHome = !blogHost && (pathname === "/" || pathname === "");

  if (blogHost) {
    return (
      <div className="site-app site-app--blog">
        <Header />
        {chromeReady ? (
          <Suspense fallback={null}>
            <AutoSeo />
            <CookieBanner />
          </Suspense>
        ) : null}
        <RouteTracker />
        <ScrollTracker />
        <Suspense fallback={fallback}>
          <Routes>
            <Route path="/articles" element={<Navigate to="/" replace />} />
            <Route path="/articles/*" element={<StripArticlesRedirect />} />
            <Route path="/*" element={<BlogRoutes />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    );
  }

  return (
    <div className="site-app">
      <Header />
      <RouteTracker />
      <ScrollTracker />
      {chromeReady ? (
        <Suspense fallback={null}>
          {!isHome ? <AutoSeo /> : null}
          <CommandPalette />
          <CookieBanner />
          <SoftwareSchema />
          <ToolRouteAtmosphere />
        </Suspense>
      ) : null}
      <ApexRoutes />
      <Footer />
    </div>
  );
}
