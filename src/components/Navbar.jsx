import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="bg-slate-900 text-white shadow-md">
      <nav className="container mx-auto px-4 py-3">
        <Link to="/" className="text-2xl font-bold hover:text-sky-400 transition-colors">
          Free Online Tools
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;