import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-white to-orange-50 overflow-hidden pb-10 pt-10">
      {/* Decorative Background Blob */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-amber-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-28 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-amber-200 border-yellow-500 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
          🚀 100% Free Developer Utilities
        </div>

        {/* Heading */}
        <h1 className="mt-8 text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight glassHero devhometitle">
          Complete Guide to <br />
          <span className="">Free Online Developer Tools</span> <br />
          for Productivity and Efficiency
        </h1>

        {/* Subtext */}

        {/* Trust Indicators */}
        <div className="mt-12 text-sm text-white-500">
          No Signup Required · Instant Results · Privacy First
        </div>
      </div>
    </section>
  );
}
