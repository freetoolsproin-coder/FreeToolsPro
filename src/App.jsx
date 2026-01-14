import { Routes, Route, Navigate } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { useState, useEffect } from "react";

// Layout
import Header from "./components/Header";
import AutoSeo from "./components/AutoSeo";
import RouteTracker from "./components/RouteTracker";
import ScrollTracker from "./components/ScrollTracker";
import CookieBanner from "./components/CookieBanner";
import SoftwareSchema from "./components/SoftwareSchema";
import Footer from "./components/Footer";

// Home
import Home from "./pages/Home";
import DevHome from "./pages/tools/DevHome";

/* Health / Utility */
import AgeCalculator from "./components/AgeCalculator";
import BmiCalculator from "./pages/BmiCalculator";
import DateDiff from "./pages/DateDiff";
import CalorieCalculator from "./pages/CalorieCalculator";
import GstCalculator from "./pages/GstCalculator";
import UseSpeedTest from "./pages/UseSpeedTest";

//Finance
import EmiCalculator from "./pages/EmiCalculator"
import EmiCalculatorAmm from "./pages/EmiCalculatorAmm"
import SipCalculator from "./pages/SipCalculator"
import SalaryCalculator from "./pages/SalaryCalculator"
import CurrencyConverter from "./pages/CurrencyConverter";

// Tools / SEO
import MetaTagGenerator from "./pages/tools/MetaTagGenerator"
import JsonFormatter from "./pages/tools/JsonFormatter";
import JwtDecoder from "./pages/tools/JwtDecoder";
import Base64Encoder from "./pages/tools/Base64Encoder";
import SitemapGenerator from "./pages/tools/SitemapGenerator";
import RobotsTxtGenerator from "./pages/tools/RobotsTxtGenerator";
import PythonFormatter from "./pages/PythonFormatter";

// pages
import AboutUs from "./pages/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";

/* PDF TOOLS (Combined App) */
import PdfTools from "./pages/tools/PdfTools";

export default function App() {
  return (
    <>
      <Header />
      <AutoSeo />
      <RouteTracker />
      <ScrollTracker />
      <CookieBanner />
      <SoftwareSchema />

      <Routes>        
        {/* Dev Home */}
        <Route path="/" element={<Home />} />
        <Route path="/tools/" element={<DevHome />} />

        {/* Health / Utility Tools */}
        <Route path="/age-calculator" element={<AgeCalculator />} />
        <Route path="/bmi-calculator" element={<BmiCalculator />} />
        <Route path="/date-difference" element={<DateDiff />} />
        <Route path="/calorie-calculator" element={<CalorieCalculator />} />
        <Route path="/gst-calculator" element={<GstCalculator />} />
        <Route path="/speed-test" element={<UseSpeedTest />} />
        <Route path="/python-formatter" element={<PythonFormatter />} />

        {/* Finance Tools */}
        <Route path="/emi-calculator" element={<EmiCalculator  />} />
        <Route path="/emi-calculator-amm" element={<EmiCalculatorAmm  />} />
        <Route path="/sip-calculator" element={<SipCalculator  />} />
        <Route path="/salary-calculator" element={<SalaryCalculator  />} />
        <Route path="/currency-converter" element={<CurrencyConverter />} />

        {/* Tools / SEO Tools */}
        <Route path="/tools/meta-tag-generator" element={<MetaTagGenerator  />} />
        <Route path="/tools/json-formatter" element={<JsonFormatter />} />
        <Route path="/tools/jwt-decoder" element={<JwtDecoder />} />
        <Route path="/tools/base64" element={<Base64Encoder />} />
        <Route path="/tools/sitemap" element={<SitemapGenerator />} />
        <Route path="/tools/robots" element={<RobotsTxtGenerator />} />

        {/* 🔥 PDF TOOLS (ALL 3 COMBINED) */}
        <Route path="/tools/pdf-tools" element={<PdfTools />} />

        {/* other pages */}
        <Route path="/about" element={<AboutUs />} /> 
        <Route path="/privacy-policy" element={<PrivacyPolicy />} /> 
      </Routes>

      <Footer />
    </>
  );
}
