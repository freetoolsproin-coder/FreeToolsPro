"use client";
import { useState } from "react";

export default function AIWriter() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("300");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic) return alert("Enter topic");

    setLoading(true);

    const res = await fetch("/api/generate-content", {
      method: "POST",
      body: JSON.stringify({ topic, tone, length }),
    });

    const data = await res.json();
    setResult(data.content);
    setLoading(false);
  };

  return (
    <div className="tool-box">
      <input
        placeholder="Enter topic (e.g. React SEO Tips)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <div className="flex">
        <select onChange={(e) => setTone(e.target.value)}>
          <option>Professional</option>
          <option>Casual</option>
          <option>Friendly</option>
          <option>Persuasive</option>
        </select>

        <select onChange={(e) => setLength(e.target.value)}>
          <option value="150">150 words</option>
          <option value="300">300 words</option>
          <option value="600">600 words</option>
        </select>
      </div>

      <button onClick={generate}>{loading ? "Generating..." : "Generate Content"}</button>

      {result && (
        <div className="result">
          <textarea value={result} readOnly />
          <button onClick={() => navigator.clipboard.writeText(result)}>Copy</button>
        </div>
      )}
    </div>
  );
}
