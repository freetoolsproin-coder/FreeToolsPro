import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-amber-50">
      {/* Background */}
      <div className="absolute inset-0 opacity-90" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-24 text-center text-gray-700">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-700">
          Free Developer Tools <br />
          <span className="text-gray-500 text-2xl">Fast · Accurate · Secure</span>
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-700">
          Meta Tag Generator, JSON Formatter, JWT Decoder, Base64 Encoder, Sitemap Generator and Robots.txt Generator and PDF Tools.
        </p>        
      </div>
    </section>
  );
}
