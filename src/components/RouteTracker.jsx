import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageview } from "../utils/analytics";

export default function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    pageview(location.pathname + location.search);
  }, [location]);

  useEffect(() => {
    // Example: Google Analytics
    window.gtag?.("config", "G-XXXXXXX", {
      page_path: location.pathname,
    });
  }, [location]);

  return null;
}
