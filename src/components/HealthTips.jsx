export default function HealthTips({ bmi, calories }) {
  let tips = [];

  if (bmi) {
    if (bmi < 18.5) tips.push("Increase calorie intake with healthy carbs.");
    else if (bmi < 25) tips.push("Maintain balanced diet & daily activity.");
    else tips.push("Focus on cardio, portion control & hydration.");
  }

  if (calories) {
    if (calories < 1800) tips.push("Include protein-rich meals.");
    else tips.push("Avoid excess sugar & late-night eating.");
  }

  if (!tips.length) return null;

  return (
    <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4 text-sm">
      🧠 <strong>AI Health Tips:</strong>
      <ul className="list-disc ml-4 mt-2">
        {tips.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  );
}
