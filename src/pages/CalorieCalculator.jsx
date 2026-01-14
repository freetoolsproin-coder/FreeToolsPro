import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Seo from "../components/Seo";


export default function CalorieCalculator() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [method, setMethod] = useState("mifflin");
  const [goal, setGoal] = useState("maintain");
  const [calories, setCalories] = useState(null);
  const [error, setError] = useState("");
  const [dark, setDark] = useState(false);

  const calculate = () => {
    if (!age || !weight || !height) {
      setError("⚠️ Please fill all fields");
      setCalories(null);
      return;
    }

    setError("");

    let bmr = 0;

    if (method === "mifflin") {
      bmr =
        gender === "male"
          ? 10 * weight + 6.25 * height - 5 * age + 5
          : 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
      bmr =
        gender === "male"
          ? 88.36 + 13.4 * weight + 4.8 * height - 5.7 * age
          : 447.6 + 9.2 * weight + 3.1 * height - 4.3 * age;
    }

    let finalCalories = Math.round(bmr * 1.2);

    if (goal === "lose") finalCalories -= 500;
    if (goal === "gain") finalCalories += 500;

    setCalories(finalCalories);
  };

  const tip =
    calories < 1800
      ? "🥗 Focus on nutrient-dense foods & protein"
      : calories < 2500
      ? "⚡ Balanced diet with regular exercise"
      : "💪 High energy intake – strength training recommended";

  const getDietPlan = (calories, goal) => {
      if (!calories) return null;

      if (calories < 1800) {
        return {
          title: "Low-Calorie Balanced Diet",
          items: [
            "🥚 Eggs or tofu for breakfast",
            "🥗 Vegetable-rich meals",
            "🐟 Lean protein (fish/chicken)",
            "🥜 Nuts in moderation",
            "🚰 Plenty of water"
          ]
        };
      }

      if (calories < 2500) {
        return {
          title: "Maintenance Diet Plan",
          items: [
            "🍞 Whole grains",
            "🍗 Lean proteins",
            "🥦 Vegetables & fruits",
            "🥛 Dairy or alternatives",
            "🏃 Regular physical activity"
          ]
        };
      }

      return {
        title: "High-Calorie Muscle Gain Diet",
        items: [
          "🥩 High-protein meals",
          "🍚 Complex carbs (rice, oats)",
          "🥑 Healthy fats",
          "🥤 Protein shakes",
          "🏋️ Strength training"
        ]
      };
    };


  return (
    <>

      <Seo page="calorieCalculator" />

      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is a calorie calculator?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "A calorie calculator estimates how many calories your body needs daily based on age, gender, height, weight, and goals."
                }
              },
              {
                "@type": "Question",
                "name": "Which calorie formula is most accurate?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "The Mifflin-St Jeor equation is considered the most accurate formula for calculating daily calorie needs."
                }
              },
              {
                "@type": "Question",
                "name": "How many calories should I eat to lose weight?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "To lose weight, most people consume around 500 fewer calories than their maintenance calories."
                }
              },
              {
                "@type": "Question",
                "name": "Is this calorie calculator free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "Yes, this calorie calculator is completely free and requires no signup."
                }
              }
            ]
          })}
        </script>
      </Helmet>


      <main className={`relative min-h-screen items-center justify-center pb-10 pt-10 px-4 transition-all bg-green
      ${dark
          ? "bg-green"
          : ""
        }`}   >
      {/* Glow */}

      <section className="lg:w-2/5 mx-auto flex mx-auto p-[2px] rounded-3xl bg-gradient-to-r from-green-400 to-teal-400 shadow-2xl">
        <div className="rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8">

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              🔥 Calorie Calculator
            </h1>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <input type="number" placeholder="Age"
              onChange={(e) => setAge(e.target.value)}
              className="input" />

            <input type="number" placeholder="Weight (kg)"
              onChange={(e) => setWeight(e.target.value)}
              className="input" />

            <input type="number" placeholder="Height (cm)"
              onChange={(e) => setHeight(e.target.value)}
              className="input" />

            {/* Gender */}
            <select onChange={(e) => setGender(e.target.value)} className="input">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            {/* BMR Method */}
            <select onChange={(e) => setMethod(e.target.value)} className="input">
              <option value="mifflin">Mifflin-St Jeor (Recommended)</option>
              <option value="harris">Harris-Benedict</option>
            </select>

            {/* Goal */}
            <select onChange={(e) => setGoal(e.target.value)} className="input">
              <option value="lose">Lose Weight</option>
              <option value="maintain">Maintain</option>
              <option value="gain">Gain Weight</option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Button */}
          <button
            onClick={calculate}
            className="mt-6 w-full py-4 rounded-xl font-bold text-white
            bg-gradient-to-r from-green-600 to-teal-600
            hover:scale-[1.02] transition"
          >
            Calculate Calories
          </button>

          {/* Result */}
          {calories && (
            <div className="mt-6 text-center">
              {/* Gauge */}
              <div className="relative mx-auto w-40 h-10">
                <svg className="transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45"
                    className="stroke-gray-300"
                    strokeWidth="10" fill="none" />
                  <circle cx="50" cy="50" r="45"
                    className="stroke-green-500 transition-all duration-700"
                    strokeWidth="10" fill="none"
                    strokeDasharray={`${(calories / 3000) * 283} 283`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold">
                  {calories}
                </div>
              </div>

              <p className="mt-4 text-sm">{tip}</p>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-4xl mx-auto text-left mb-6 pt-10 pb-10">
        <h2 className="text-1xl font-bold mb-2">🔥 Calorie Calculator – Calculate Your Daily Calorie Needs</h2>
        <p className="text-1xl pb-5">Knowing how many calories your body needs each day is essential for managing weight, improving fitness, and maintaining overall health. Our free Calorie Calculator helps you estimate your daily calorie requirements based on age, gender, height, weight, and fitness goals.</p>
        <p className="text-1xl">Whether your goal is to lose weight, maintain your current weight, or gain muscle, this tool provides accurate results using scientifically proven formulas like Mifflin-St Jeor and Harris-Benedict.</p>
      </section>
    </main>



    </>
  );
}
