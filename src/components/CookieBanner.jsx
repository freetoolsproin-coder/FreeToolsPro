import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookieAccepted")) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookieAccepted", "true");
    setShow(false);
    window.location.reload(); // enables GA + ads
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 cookiebg text-white p-2 flex justify-between items-center z-50">
      <p className="text-sm">
        We use cookies to improve experience and show relevant ads.
      </p>
      <button
        onClick={accept}
        className="bg-organe-500 px-4 py-2 rounded"
      >
        Accept
      </button>
    </div>
  );
}
