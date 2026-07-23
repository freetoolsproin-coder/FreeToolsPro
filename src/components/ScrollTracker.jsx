import { useEffect } from "react";
import { event } from "../utils/analytics";

export default function ScrollTracker() {
  useEffect(() => {
    const onScroll = () => {
      const scrolled =
        (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;

      if (scrolled > 0.75) {
        event({
          action: "scroll",
          category: "Engagement",
          label: "75% Scroll",
        });
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
