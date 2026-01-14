import { Link } from "react-router-dom";
import { NavLink  } from "react-router-dom";
import FaqSchema from "./FaqSchema";


const getRecommendedTools = (tools) => {
  const hour = new Date().getHours();
  const isMobile = window.innerWidth < 768;

  // Morning → Health | Evening → Finance
  if (hour >= 5 && hour < 12) {
    return tools.filter(t =>
      ["BMI Calculator", "Calorie Calculator", "Age Calculator"].includes(t.name)
    );
  }

  if (hour >= 17 || isMobile) {
    return tools.filter(t =>
      ["EMI Calculator", "SIP Calculator", "Salary Calculator"].includes(t.name)
    );
  }

  return tools.slice(0, 3);
};


/* ------------------ DATA ------------------ */

const toolCategories = [
  {
    tools: [
      {
        id: 1,
        name: "Age Calculator",
        desc: "Calculate exact age, next birthday and total time lived.",
        path: "/age-calculator",
        icon: "🎂",
      },
      {
        id: 2,
        name: "BMI Calculator",
        desc: "Check your Body Mass Index instantly.",
        path: "/bmi-calculator",
        icon: "⚖️",
      },
      {
        id: 3,
        name: "Calorie Calculator",
        desc: "Calculate daily calorie needs.",
        path: "/calorie-calculator",
        icon: "🔥",
      },
      {
        id: 4,
        name: "EMI Calculator",
        desc: "Calculate loan EMI instantly.",
        path: "/emi-calculator",
        icon: "💰",
      },
      {
        id: 5,
        name: "SIP Calculator",
        desc: "Estimate SIP returns easily.",
        path: "/sip-calculator",
        icon: "📈",
      },
      {
        id: 6,
        name: "Salary Calculator",
        desc: "Calculate in-hand salary from CTC.",
        path: "/salary-calculator",
        icon: "💼",
      },
      {
        id: 7,
        name: "GST Calculator",
        desc: "Calculate GST amount quickly.",
        path: "/gst-calculator",
        icon: "🧾",
      },

      {
        id: 8,
        name: "Date Difference",
        desc: "Find difference between two dates.",
        path: "/date-difference",
        icon: "📅",
      },
      {
        id: 9,
        name: "Meta Tag Generator",
        desc: "Generate SEO-friendly meta tags.",
        path: "/tools/meta-tag-generator",
        icon: "🏷️",
      },
      {
        id: 10,
        name: "Net Speed Test",
        desc: "Test your internet speed instantly.",
        path: "/speed-test",
        icon: "🚀",
      },
      {
          id: 11,
        name: "Currency Converter",
        desc: "Test your internet speed instantly.",
        path: "/currency-converter",
        icon: "💲",
      },
      {
          id: 12,
        name: "Python Formatter",
        desc: "Convert your Pyhton unformatted to Formatted code.",
        path: "/python-formatter",
        icon: "🐍",
      },
      {
          id: 13,
        name: "JSON Formatter",
        desc: "Format, beautify & validate JSON instantly. Supports minify & error detection.",
        path: "/tools/json-formatter",
        icon: "{ }",
      },
      {
          id: 14,
        name: "JWT Decoder",
        desc: "Decode JWT tokens instantly. View header, payload & signature securely without verification.",
        path: "/tools/jwt-decoder",
        icon: "{ }",
      },
      {
          id: 14,
        name: "Base64 Encoder",
        desc: "Encode & decode Base64 strings instantly. Supports text & URL-safe Base64 encoding.",
        path: "/tools/base64",
        icon: "{ }",
      },
      {
          id: 14,
        name: "Sitemap Generator",
        desc: "Generate XML sitemap instantly for better Google indexing. Supports large websites.",
        path: "/tools/sitemap",
        icon: "🖧",
      },
      {
          id: 14,
        name: "Robots.txt Generator",
        desc: "Create robots.txt file easily to control search engine bots & improve SEO.",
        path: "/tools/robots",
        icon: "</>",
      },
      {
          id: 14,
        name: "PDF Tools Converters",
        desc: "Convert, Edit & Manage PDFs online. PDF to Word, PDF to JPG, Edit PDF & more.",
        path: "/tools/pdf-tools",
        icon: "🔗",
      }
    ],
  },
];

/* Flatten tools for Popular section */
const popularTools = toolCategories.flatMap((c) => c.tools).slice(0, 6);

function NavItem({ to, icon, label, title }) {
    return (
      <NavLink
        to={to}
        title={title}
        className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition"
      >
        {icon}
        {label}
      </NavLink>
    );
  }

function MobileNavItem({ to, icon, label, title, setOpen }) {
  return (
    <NavLink
      to={to}
      title={title}
      onClick={() => setOpen(false)}
      className="flex items-center gap-2 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  );
}

export default function Home() {
  return (
    <>
      
      <main className="min-h-screen">

        {/* ================= HERO ================= */}
        <section className="bg-white">
          <Link to="/tools">
            <img src="../../images/freetools-hero.jpg" className="mx-auto"/>
          </Link>
        </section>

        {/* <div className="max-w-6xl mx-auto my-10">
          <div className="bg-gray-100 h-[90px] flex items-center justify-center text-sm text-gray-500">
            Advertisement
          </div>
        </div> */}

        {/* ================= TOOLS ================= */}
        <section id="tools" className="max-w-6xl mx-auto px-4 pt-10">
          <h2 className="text-4xl font-bold text-center mb-4 subtitle">
            Free Online <span>Calculators & Developer Tools</span>
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Simple, fast and accurate tools — built for everyday life
          </p>

          {toolCategories.map((category) => (
            <div key={category.title} className="mb-16">
              <h3 className="text-2xl font-bold mb-1 subCategory">{category.title}</h3>
              <p className="text-gray-500 mb-6">{category.subtitle}</p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
                {category.tools.map((tool) => (
                  <Link
                    key={`${category.slug}-${tool.id}`}
                    to={tool.path}
                    className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
                  >
                    <div className="text-4xl mb-3">{tool.icon}</div>
                    <h4 className="font-semibold mb-1">{tool.name}</h4>
                    <p className="text-sm text-gray-600">{tool.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>

      </main>

      <FaqSchema
        faqs={[
          {
            q: "Are these calculators free to use?",
            a: "Yes, all calculators are 100% free with no signup required.",
          },
          {
            q: "Are results accurate?",
            a: "Yes, calculators use standard formulas and are tested for accuracy.",
          },
          {
            q: "Is my data stored?",
            a: "No, all calculations happen locally in your browser.",
          },
        ]}
      />
    </>
  );
}
