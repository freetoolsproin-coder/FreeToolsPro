import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gray-300 pt-5 pb-5 text-center bg-white">
          <nav className="flex justify-center gap-6 mb-4">
            <Link to="/About">About</Link> |
            <Link to="/privacy-policy">Privacy Policy</Link>
          </nav>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} FreeToolsPro. All rights reserved.
          </p>
        </footer>
  );
}
