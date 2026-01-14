import { useState } from "react";
import Seo from "../components/Seo";

export default function BmiCalculator() {
 const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const calculateBMI = () => {
    setError("");
    setBmi(null);
    setCategory("");

    if (!height || !weight) {
      setError("⚠️ Please enter both height and weight");
      return;
    }

    if (height <= 0 || weight <= 0) {
      setError("⚠️ Values must be greater than zero");
      return;
    }

    const heightInMeters = height / 100;
    const bmiValue = Number(
      (weight / (heightInMeters ** 2)).toFixed(1)
    );

    setBmi(bmiValue);

    if (bmiValue < 18.5) setCategory("Underweight");
    else if (bmiValue < 25) setCategory("Normal");
    else if (bmiValue < 30) setCategory("Overweight");
    else setCategory("Obese");
  };

  return (
    <div>
      
      <Seo page="bmiCalculator" />

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-4 pt-10 pb-10">

        <section className="max-w-2xl mx-auto flex items-center justify-center relative rounded-3xl bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)] p-4 pb-10">

          {/* Glow ring */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-green-500 to-emerald-500 blur opacity-20"></div>

          <div className="relative">
            <h1 className="text-3xl font-extrabold text-center mb-2">
              🧮 BMI Calculator
            </h1>
            <p className="text-center text-sm text-gray-500 mb-6">
              Calculate your Body Mass Index instantly
            </p>

            {/* Height */}
            <input
              type="number"
              placeholder="Height (cm)"
              className="w-full border border-gray-300 rounded-xl p-4 mb-3
                        focus:outline-none focus:ring-4 focus:ring-green-200 inputbg"
              value={height} 
              onChange={(e) => setHeight(e.target.value)}
            />

            {/* Weight */}
            <input
              type="number"
              placeholder="Weight (kg)"
              className="w-full border border-gray-300 rounded-xl p-4 mb-4
                        focus:outline-none focus:ring-4 focus:ring-green-200 inputbg"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />

            {/* Error */}
            {error && (
              <p className="mb-4 text-sm text-red-600 text-center font-medium">
                {error}
              </p>
            )}

            {/* Button */}
            <button
              onClick={calculateBMI}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600
                        text-white py-4 rounded-xl font-semibold
                        hover:scale-[1.02] transition-transform
                        shadow-lg shadow-green-200"
            >
              Calculate BMI
            </button>

            {/* Result */}
            {bmi && (
              <div className="mt-6 text-center space-y-2 animate-fadeIn">
                <section aria-live="polite">
                  <p>
                    BMI: <strong>{bmi}</strong>
                  </p>
                </section>
                <p className="text-sm text-gray-600">
                  Category: <strong>{category}</strong>
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="max-w-4xl mx-auto text-left mb-6 pt-10 pb-10">
          <h2 className="text-1xl font-bold mb-2">What is BMI?</h2>
          <p className="text-1xl">
            Body Mass Index (BMI) is a simple calculation using height and weight
            to determine whether a person has a healthy body weight.
          </p>

          <h3 className="font-semibold mt-4 text-1xl font-bold mb-2">BMI Categories</h3>
          <ul className="list-disc pl-10 text-1xl pb-3 leading-10">
            <li>Underweight: Below 18.5</li>
            <li>Normal weight: 18.5 – 24.9</li>
            <li>Overweight: 25 – 29.9</li>
            <li>Obese: 30 and above</li>
          </ul>
        </section>

    </div>

  </div>
  );
}
