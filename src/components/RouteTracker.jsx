import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageview } from "../utils/analytics";

export default function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname + location.search;
    pageview(path);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location]);

  return null;
}
