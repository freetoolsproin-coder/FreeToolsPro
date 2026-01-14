import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Seo from "../components/Seo";
import FaqSchema from "../components/FaqSchema";
import { event } from "../utils/analytics";


export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calculateAge = () => {
    if (!dob) {
      setError("Please select your date of birth");
      setResult(null);
      return;
    }

    setError("");

    const birth = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((today - birth) / 86400000);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;

    const nextBirthday = new Date(
      today.getFullYear(),
      birth.getMonth(),
      birth.getDate()
    );

    if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);

    const daysToBirthday = Math.ceil(
      (nextBirthday - today) / 86400000
    );

    setResult({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      daysToBirthday,
    });
    trackToolUse("Age Calculator");
    // ✅ GOOGLE ANALYTICS EVENT (HERE)
    event({
      action: "calculate",
      category: "Age Calculator",
      label: "Age calculated",
    });
  };

  return (
    <>
      
      <Seo page="ageCalculator" />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50  px-4">
        <div className="max-w-2xl mx-auto flex mx-auto items-center justify-center pt-10">
          
          <section className="relative w-full max-w-md p-8 rounded-[2rem] bg-white/80 backdrop-blur-xl
            shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]">

            {/* Neon glow */}
            <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 blur opacity-25" />

            <div className="relative">
              {/* Header */}
              <h1 className="text-3xl font-black text-center text-gray-900">
                🎉 Age Calculator
              </h1>
              <p className="text-center text-sm text-gray-500 mt-2 mb-8">
                Know your exact age in seconds
              </p>

              {/* Floating Input */}
              <div className="relative mb-6">
                <input
                  type="date"
                  value={dob}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDob(e.target.value)}
                  className="peer w-full rounded-xl border border-gray-300 bg-white px-4 pt-6 pb-3
                  text-gray-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-400/40
                  outline-none transition"
                />
                <label className="absolute left-4 top-2 text-xs text-gray-500
                  peer-focus:text-blue-600">
                  Date of Birth
                </label>
              </div>

              {/* Button */}
              <button
                onClick={calculateAge}
                disabled={!dob}
                className={`w-full py-3 rounded-xl font-semibold text-white
                  transition-all duration-300
                  ${dob
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.03] hover:shadow-xl"
                    : "bg-gray-300 cursor-not-allowed"}
                `}
              >
                Calculate Age
              </button>

              {/* Error */}
              {error && (
                <p className="mt-4 text-center text-sm font-semibold text-red-600 animate-shake">
                  ⚠️ {error}
                </p>
              )}

              {/* Result */}
              {result && (
                <div className="mt-8 text-center space-y-4 animate-fadeIn">
                  <p className="text-2xl font-extrabold text-gray-900">
                    {result.years}y · {result.months}m · {result.days}d
                  </p>

                  <p className="text-sm text-gray-600">
                    🎂 Next birthday in <b>{result.daysToBirthday}</b> days
                  </p>

                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {[
                      { label: "Days", value: result.totalDays },
                      { label: "Weeks", value: result.totalWeeks },
                      { label: "Hours", value: result.totalHours },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="rounded-xl bg-white p-4 shadow-md hover:shadow-xl
                        hover:-translate-y-1 transition-all"
                      >
                        <p className="text-xl font-extrabold text-indigo-600">
                          {item.value}
                        </p>
                        <p className="text-xs text-gray-500">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="max-w-4xl mx-auto text-left mb-6 pt-10 pb-4">
          <p className="text-gray-600 text-1xl leading-relaxed text-left">
            Use our <strong>free Age Calculator</strong> to find your exact age in 
            <strong> years, months, and days</strong>. Simply enter your date of birth 
            and get instant results including your next birthday countdown.  
            This tool works accurately for leap years and all date formats.
          </p>
        </section>

        <section className="max-w-4xl mx-auto mt-2 pb-10">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>

          <div className="space-y-4 text-1xl text-gray-700">
            <ul className="list-disc list-outside space-y-5 pl-6 text-gray-700">
              <li className="marker:text-blue-600">
                <h3 className="font-semibold text-gray-900">
                  Is this age calculator accurate?
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  Yes, the calculator uses precise date calculations and correctly handles
                  leap years and different month lengths.
                </p>
              </li>

              <li className="marker:text-blue-600">
                <h3 className="font-semibold text-gray-900">
                  Does this age calculator store my data?
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  No. All calculations happen directly in your browser and no data is saved
                  or sent to any server.
                </p>
              </li>

              <li className="marker:text-blue-600">
                <h3 className="font-semibold text-gray-900">
                  Can I calculate age for any date?
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  Yes, you can calculate age for any past date using this tool.
                </p>
              </li>
            </ul>

          </div>
        </section>
        
        {/* 📌 FAQ Schema (ADD HERE) */}
        <FaqSchema
          faqs={[
            {
              q: "How does the Age Calculator work?",
              a: "It calculates your exact age using your date of birth in years, months, and days."
            },
            {
              q: "Is this age calculator free to use?",
              a: "Yes, this tool is completely free and requires no signup."
            },
            {
              q: "Can I calculate my age in days?",
              a: "Yes, the calculator shows your total days lived."
            }
          ]}
        />
      </div>

    </>
  );
}
