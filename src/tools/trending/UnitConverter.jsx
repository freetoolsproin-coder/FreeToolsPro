import { Zap } from "lucide-react";
import React, { useState, useEffect } from "react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";

// Comprehensive Advanced Unit Data Matrix
const unitData = {
  length: {
    base: "meter",
    units: {
      meter: 1,
      kilometer: 1000,
      centimeter: 0.01,
      millimeter: 0.001,
      inch: 0.0254,
      foot: 0.3048,
      yard: 0.9144,
      mile: 1609.34,
      nanometer: 1e-9,
      micrometer: 1e-6,
    },
  },
  weight: {
    base: "gram",
    units: {
      gram: 1,
      kilogram: 1000,
      milligram: 0.001,
      pound: 453.59237,
      ounce: 28.349523,
      ton: 1e6,
      stone: 6350.29,
    },
  },
  temperature: {
    units: {
      celsius: "°C",
      fahrenheit: "°F",
      kelvin: "K",
    },
    convert: (value, from, to) => {
      let celsiusValue;
      if (from === "celsius") celsiusValue = value;
      if (from === "fahrenheit") celsiusValue = ((value - 32) * 5) / 9;
      if (from === "kelvin") celsiusValue = value - 273.15;

      if (to === "celsius") return celsiusValue;
      if (to === "fahrenheit") return (celsiusValue * 9) / 5 + 32;
      if (to === "kelvin") return celsiusValue + 273.15;
    },
    getFormula: (from, to) => {
      if (from === to) return "No conversion needed";
      if (from === "celsius" && to === "fahrenheit") return "(°C × 9/5) + 32";
      if (from === "celsius" && to === "kelvin") return "°C + 273.15";
      if (from === "fahrenheit" && to === "celsius") return "(°F - 32) × 5/9";
      if (from === "fahrenheit" && to === "kelvin") return "(°F - 32) × 5/9 + 273.15";
      if (from === "kelvin" && to === "celsius") return "K - 273.15";
      if (from === "kelvin" && to === "fahrenheit") return "(K - 273.15) × 9/5 + 32";
      return "";
    },
  },
  volume: {
    base: "liter",
    units: {
      liter: 1,
      milliliter: 0.001,
      cubicMeter: 1000,
      gallon: 3.78541,
      pint: 0.473176,
      cup: 0.24,
      fluidOunce: 0.0295735,
    },
  },
  speed: {
    base: "meterPerSecond",
    units: {
      meterPerSecond: 1,
      kilometerPerHour: 0.277778,
      milePerHour: 0.44704,
      footPerSecond: 0.3048,
      knot: 0.514444,
    },
  },
  area: {
    base: "squareMeter",
    units: {
      squareMeter: 1,
      squareKilometer: 1e6,
      squareFoot: 0.092903,
      squareYard: 0.836127,
      acre: 4046.86,
      hectare: 10000,
    },
  },
  time: {
    base: "second",
    units: {
      second: 1,
      minute: 60,
      hour: 3600,
      day: 86400,
      week: 604800,
      month: 2629746,
      year: 31556952,
    },
  },
  pressure: {
    base: "pascal",
    units: {
      pascal: 1,
      bar: 1e5,
      atmosphere: 101325,
      psi: 6894.76,
      torr: 133.322,
    },
  },
  energy: {
    base: "joule",
    units: {
      joule: 1,
      kilojoule: 1000,
      calorie: 4.184,
      kilocalorie: 4184,
      wattHour: 3600,
      kilowattHour: 3.6e6,
    },
  },
  power: {
    base: "watt",
    units: {
      watt: 1,
      kilowatt: 1000,
      horsepower: 745.7,
      megawatt: 1e6,
    },
  },
  digitalStorage: {
    base: "byte",
    units: {
      bit: 0.125,
      byte: 1,
      kilobyte: 1024,
      megabyte: 1048576,
      gigabyte: 1073741824,
      terabyte: 1099511627776,
    },
  },
  dataTransferRate: {
    base: "bps",
    units: {
      bps: 1,
      kbps: 1000,
      mbps: 1e6,
      gbps: 1e9,
    },
  },
  frequency: {
    base: "hertz",
    units: {
      hertz: 1,
      kilohertz: 1000,
      megahertz: 1e6,
      gigahertz: 1e9,
    },
  },
  angle: {
    base: "degree",
    units: {
      degree: 1,
      radian: 57.2958,
      gradian: 0.9,
    },
  },
};

// Helper utility to turn camelCase strings into human readable text (e.g. cubicMeter -> Cubic Meter)
const formatUnitLabel = (str) => {
  const result = str.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

function ConverterBox({ type }) {
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [copied, setCopied] = useState(false);

  // Synchronize unit selections on category change
  useEffect(() => {
    const units = Object.keys(unitData[type].units);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
    setInputValue("");
    setOutputValue("");
  }, [type]);

  // Compute conversion live loop
  useEffect(() => {
    if (inputValue === "" || isNaN(inputValue)) {
      setOutputValue("");
      return;
    }

    let result;
    const numericInput = parseFloat(inputValue);

    if (type === "temperature") {
      result = unitData.temperature.convert(numericInput, fromUnit, toUnit);
    } else {
      const fromFactor = unitData[type].units[fromUnit];
      const toFactor = unitData[type].units[toUnit];
      result = (numericInput * fromFactor) / toFactor;
    }

    setOutputValue(result);
  }, [inputValue, fromUnit, toUnit, type]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    if (outputValue !== "") {
      setInputValue(parseFloat(outputValue).toString());
    }
  };

  const copyToClipboard = () => {
    if (!outputValue) return;
    const textToCopy = `${inputValue} ${formatUnitLabel(fromUnit)} = ${parseFloat(outputValue.toFixed(6))} ${formatUnitLabel(toUnit)}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const unitsList = Object.keys(unitData[type].units);

  // Dynamic formula processing UI display
  const renderFormula = () => {
    if (fromUnit === toUnit) return "Values are identical.";
    if (type === "temperature") {
      return unitData.temperature.getFormula(fromUnit, toUnit);
    }
    const fromFactor = unitData[type].units[fromUnit];
    const toFactor = unitData[type].units[toUnit];
    return `Multiply the value by ${(fromFactor / toFactor).toExponential(4).replace("e+0", "e").replace("e-0", "e-")}`;
  };

  return (
    <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <Seo page="unitConverter" />

      <div className="space-y-5">
        {/* Input Block */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="w-full sm:w-2/3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              From
            </label>
            <input
              type="number"
              className="border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl p-3 w-full text-gray-800 font-medium"
              placeholder="Enter value"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-1/3 self-end">
            <select
              className="border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl p-3 w-full text-gray-700 font-medium cursor-pointer"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
            >
              {unitsList.map((unit) => (
                <option key={unit} value={unit}>
                  {formatUnitLabel(unit)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Interchange Units Button */}
        <div className="flex justify-center -my-2">
          <button
            type="button"
            onClick={handleSwap}
            className="p-2.5 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:text-teal-700 transition-colors"
            title="Swap Units"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 transform rotate-90 sm:rotate-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
              />
            </svg>
          </button>
        </div>

        {/* Output Block */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="w-full sm:w-2/3 relative">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              To
            </label>
            <input
              type="text"
              className="border border-gray-200 bg-gray-50 rounded-xl p-3 w-full text-gray-800 font-semibold"
              value={outputValue === "" ? "" : parseFloat(Number(outputValue).toFixed(6))}
              readOnly
              placeholder="Result"
            />
            {outputValue && (
              <button
                onClick={copyToClipboard}
                className="absolute right-3 top-[38px] text-xs font-medium bg-white text-teal-700 hover:bg-indigo-50 px-2 py-1 border border-indigo-200 rounded-md transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          <div className="w-full sm:w-1/3 self-end">
            <select
              className="border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl p-3 w-full text-gray-700 font-medium cursor-pointer"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
            >
              {unitsList.map((unit) => (
                <option key={unit} value={unit}>
                  {formatUnitLabel(unit)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Formula Display panel */}
        {inputValue && (
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center text-1xl text-slate-500 font-medium">
            <span className="font-semibold text-slate-600">Formula:</span> {renderFormula()}
          </div>
        )}
      </div>
    </div>
  );
}

function UnitConverter() {
  const [type, setType] = useState("length");

  const unitTypes = [
    { value: "length", label: "📏 Length" },
    { value: "weight", label: "⚖️ Weight & Mass" },
    { value: "temperature", label: "🌡️ Temperature" },
    { value: "volume", label: "🧪 Volume" },
    { value: "speed", label: "⚡ Speed" },
    { value: "area", label: "🗺️ Area" },
    { value: "time", label: "⏱️ Time" },
    { value: "pressure", label: "🎈 Pressure" },
    { value: "energy", label: "🔋 Energy" },
    { value: "power", label: "🔌 Power" },
    { value: "digitalStorage", label: "💾 Digital Storage" },
    { value: "dataTransferRate", label: "🌐 Data Rate" },
    { value: "frequency", label: "📡 Frequency" },
    { value: "angle", label: "📐 Angle" },
  ];

  return (
    <>
      <Seo page="unitConverter" />

      <ToolHeroShell
        category="trending-tools"
        icon={Zap}
        title="Advanced Unit Converter"
        subtitle="Convert units instantly across 14 scientific and digital categories with exact formulas."
        formLabel="Start here"
        layout="stack"
      >
{/* Core App Wrapper */}
          <div className="grid grid-cols-1 md:grid-cols-3 mt-4 gap-4 items-start">
            {/* Left Column: Category Selector */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 md:col-span-1">
              <label className="block text-sm font-normal text-gray-900 tracking-wider mb-3 ml-1">
                Select Category
              </label>
              <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1">
                {unitTypes.map((unit) => (
                  <button
                    key={unit.value}
                    onClick={() => setType(unit.value)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                      type === unit.value
                        ? "catBlockActive text-white shadow-md shadow-indigo-100"
                        : "catBlock text-white hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {unit.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Interaction Workbox */}
            <div className="md:col-span-2">
              <ConverterBox type={type} />
            </div>
          </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="trending-tools"
        currentToolPath="/trending-tools/unit-converter" />
    </>
  );
}

export default UnitConverter;
