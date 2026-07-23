import React, { useState } from "react";

function ConverterBox({ type }) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");

  const convert = (val) => {
    let res = 0;

    if (type === "length") {
      res = val * 1000; // km to meters
      setResult(res + " meters");
    }

    if (type === "weight") {
      res = val * 1000; // kg to grams
      setResult(res + " grams");
    }

    if (type === "temperature") {
      res = (val * 9) / 5 + 32; // Celsius to Fahrenheit
      setResult(res.toFixed(2) + " °F");
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    convert(val);
  };

  return (
    <div className="converter-box ">
      <input
        className="border rounded-xl p-4"
        type="number"
        placeholder="Enter value"
        value={value}
        onChange={handleChange}
      />

      <div class="maturity-bg mt-6 mb-6 font-extrabold">{result}</div>
    </div>
  );
}

export default ConverterBox;
