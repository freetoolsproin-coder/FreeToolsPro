import { useState } from "react";
import Seo from "../components/Seo";

export default function EmiCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [emi, setEmi] = useState(null);

  const calculate = () => {
    const r = rate / 12 / 100;
    const n = years * 12;
    const emiValue =
      (amount * r * Math.pow(1 + r, n)) /
      (Math.pow(1 + r, n) - 1);

    let balance = amount;
    const rows = [];

    for (let i = 1; i <= n; i++) {
      const interest = balance * r;
      const principal = emiValue - interest;
      balance -= principal;

      rows.push({
        month: i,
        principal: principal.toFixed(0),
        interest: interest.toFixed(0),
        balance: Math.max(balance, 0).toFixed(0),
      });
    }

    setEmi(Math.round(emiValue));
    setSchedule(rows);
  };

  return (
    <main className="bg-gray-50 min-h-screen px-4 py-6">
      <Seo title="EMI Calculator" description="Loan EMI with amortization table" />

      <section className="bg-white p-6 rounded-xl shadow max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4">EMI Calculator</h1>

        <input placeholder="Loan Amount" className="w-full border p-3 mb-2"
          onChange={(e) => setAmount(e.target.value)} />
        <input placeholder="Interest Rate (%)" className="w-full border p-3 mb-2"
          onChange={(e) => setRate(e.target.value)} />
        <input placeholder="Tenure (Years)" className="w-full border p-3 mb-4"
          onChange={(e) => setYears(e.target.value)} />

        <button onClick={calculate}
          className="w-full bg-green-600 text-white py-3 rounded">
          Calculate EMI
        </button>

        {emi && (
          <>
            <p className="mt-4 text-center text-lg">
              EMI: <strong>₹{emi}</strong>
            </p>

            <div className="overflow-x-auto mt-4 max-h-80">
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="border px-2">Month</th>
                    <th className="border px-2">Principal</th>
                    <th className="border px-2">Interest</th>
                    <th className="border px-2">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row) => (
                    <tr key={row.month}>
                      <td className="border px-2">{row.month}</td>
                      <td className="border px-2">{row.principal}</td>
                      <td className="border px-2">{row.interest}</td>
                      <td className="border px-2">{row.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
