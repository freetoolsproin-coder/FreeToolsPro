import { Link } from "react-router-dom";
import { useState } from "react";
import Seo from "../components/Seo";

export default function About() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Seo
        title="About Us | Free Tools – Smart Online Calculators"
        description="Learn about Free Tools – a collection of fast, accurate, and privacy-friendly online calculators for health, finance, and daily utilities."
        canonical="https://freetoolspro.in/about"
      />

      {/* ================= HERO ================= */}
      <section>
        <Link to="/tools">
          <img src="../../images/freetools-hero.jpg" />
        </Link>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          About Free Tools
        </h1>

        <p className="text-gray-700 leading-relaxed mb-4">
          Free Tools is a simple and reliable platform designed to make everyday
          calculations fast, accurate, and accessible for everyone.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          We provide free, browser-based tools that help users make better
          decisions in health, finance, productivity, and daily life—without
          signups or data tracking.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">
          Our Mission
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Our mission is to simplify complex calculations and deliver clean,
          trustworthy tools that respect user privacy and work seamlessly
          across all devices.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">
          Privacy & Transparency
        </h2>
        <p className="text-gray-700 leading-relaxed">
          All calculations run directly in your browser. We do not store,
          track, or share any personal data.
        </p>
      </section>

    </main>
  );
}
