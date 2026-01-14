import { Link } from "react-router-dom";
import { useState } from "react";
// import { NAV_ITEMS } from "./config/navConfig";
// import GlassTooltip from "./GlassTooltip";
// import { trackNavClick } from "../utils/analytics";
import { Menu, X, User, Gauge, Droplet, Brain, Percent, IndianRupee, Settings, CircleDollarSign, ReceiptIndianRupee, CircleGauge, Cake, Scale } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);

  const isDev =
    import.meta.env.DEV ||
    window.location.hostname === "localhost";

  return (
    <>

      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

          {/* Logo */}
          <NavLink to="/" className="text-xl font-bold text-blue-600">
            <img src="./images/free-tools-logo.jpg" className="h-14" title='Free Tools - Tools Built for Everyday Life'/>
          </NavLink>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle Menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 text-sm font-medium desktopNav">
            <NavItem className="userIcon" to="/age-calculator" icon={<User />} label="Age" title="Age Calculator – Calculate your exact age instantly" />
            <NavItem className="userIcon" to="/bmi-calculator" icon={<Gauge />} label="BMI" title="BMI Calculator – Check Body Mass Index online" />
            <NavItem className="userIcon" to="/calorie-calculator" icon={<Droplet />} label="Calories" title="Calorie Calculator – Daily calorie needs" />
            <NavItem className="userIcon" to="/sip-calculator" icon={<Brain />} label="SIP" title="SIP Calculator – Mutual fund investment returns" />
            <NavItem className="userIcon" to="/emi-calculator" icon={<Percent />} label="EMI" title="EMI Calculator – Loan EMI calculation" />
            <NavItem className="userIcon" to="/salary-calculator" icon={<IndianRupee />} label="Salary" title="Salary Calculator – In-hand salary from CTC" />
            <NavItem className="userIcon" to="/gst-calculator" icon={<ReceiptIndianRupee />} label="GST" title="GST Calculator – Goods and Services Tax" />
            <NavItem className="userIcon" to="/speed-test" icon={<CircleGauge />} label="Speed Test" title="Internet Speed Test – Check download & upload speed" />
            <NavItem className="userIcon" to="/currency-converter" icon={<CircleDollarSign />} label="Currency" title="Currency Converter – Convert currencies online" />

            {isDev && (
              <NavItem to="/tools" icon={<Settings />} label="Tools" />
            )}
            </nav> 
        </div>

        {/* Mobile Navigation */}
        {open && (
          <nav className="md:hidden border-t bg-white">
            <div className="flex flex-col px-4 py-3 space-y-3 mobNav">
              <MobileNavItem className="userIcon" to="/age-calculator" icon={<User />} label="Age Calculator" setOpen={setOpen} title="Age Calculator – Find exact age" />
              <MobileNavItem className="userIcon" to="/bmi-calculator" icon={<Gauge />} label="BMI Calculator" setOpen={setOpen} title="BMI Calculator – Check Body Mass Index online" />
              <MobileNavItem className="userIcon" to="/calorie-calculator" icon={<Droplet />} label="Calorie Calculator" setOpen={setOpen} title="Calorie Calculator – Daily calorie needs" />
              <MobileNavItem className="userIcon" to="/sip-calculator" icon={<Brain />} label="SIP Calculator" setOpen={setOpen} title="SIP Calculator – Mutual fund investment returns" />
              <MobileNavItem className="userIcon" to="/emi-calculator" icon={<Percent />} label="EMI Calculator" setOpen={setOpen} title="EMI Calculator – Loan EMI calculation" />
              <MobileNavItem className="userIcon" to="/salary-calculator" icon={<IndianRupee />} label="Salary Calculator" setOpen={setOpen} title="Salary Calculator – In-hand salary from CTC" />
              <MobileNavItem className="userIcon" to="/meta-tag-generator" icon={<Percent />} label="Meta Tag" setOpen={setOpen} />
              <MobileNavItem className="userIcon" to="/gst-calculator" icon={<ReceiptIndianRupee />} label="GST" setOpen={setOpen} title="GST Calculator – Goods and Services Tax" />
              <MobileNavItem className="userIcon" to="/speed-test" icon={<CircleGauge />} label="Speed Test" setOpen={setOpen} title="Internet Speed Test – Check download & upload speed" />
              <MobileNavItem className="userIcon" to="/currency-converter" icon={<CircleGauge />} label="Currency" setOpen={setOpen} title="Currency Converter – Convert currencies online" />

              {isDev && (
                <MobileNavItem
                  to="/tools"
                  icon={<Percent />}
                  label="Dev Tools"
                  setOpen={setOpen}
                />
              )}
            </div>
          </nav>
        )}
        
      </header>

    </>
  );

  
  function NavItem({ to, icon, label, title = "" }) {
    return (
      <NavLink
        to={to}
        title={title}
        className={({ isActive }) =>
          `flex items-center gap-1 transition font-medium
          ${isActive
            ? "text-blue-600 border-b-2 border-blue-600 pb-1"
            : "text-gray-700 hover:text-blue-600"}`
          }
        >
        {icon}
        <span>{label}</span>
      </NavLink>
    );
  }

  function MobileNavItem({ to, icon, label, title = "", setOpen }) {
    return (
      <NavLink
        to={to}
        title={title}
         onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-2 p-3 rounded-lg transition
            ${isActive
            ? "bg-blue-50 text-blue-600 font-semibold"
            : "text-gray-700 hover:bg-gray-100"}`
          }
        >
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </NavLink>
    );
  }
}

