import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import Header from "./components/Header";
import AutoSeo from "./components/AutoSeo";
import RouteTracker from "./components/RouteTracker";
import ScrollTracker from "./components/ScrollTracker";
import CookieBanner from "./components/CookieBanner";
import SoftwareSchema from "./components/SoftwareSchema";
import Footer from "./components/Footer";
import ToolRouteAtmosphere from "./components/ToolRouteAtmosphere";
import CommandPalette from "./components/CommandPalette";
import { appRoutes } from "./routes/appRoutes.jsx";

const fallback = (
  <div className="flex min-h-[50vh] items-center justify-center text-[var(--ftp-ink-soft)]">
    Loading…
  </div>
);

export default function App() {
  return (
    <div className="site-app">
      <Header />
      <CommandPalette />
      <AutoSeo />
      <RouteTracker />
      <ScrollTracker />
      <CookieBanner />
      <SoftwareSchema />

      <Suspense fallback={fallback}>
        <ToolRouteAtmosphere>
          <Routes>
            {appRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
        </ToolRouteAtmosphere>
      </Suspense>

      <Footer />
    </div>
  );
}
