import { Calculator } from "lucide-react";
import React, { useState } from "react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";

const CurrencyConverter = () => {
  return (
    <>
      <Seo page="currencyCalculator" />
      <ToolHeroShell
        category="calculators"
        icon={Calculator}
        title="Free Online Currency Converter"
        subtitle="Convert currencies with real-time exchange rates"
        formLabel="Calculate"
      >

            <div className="p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-slate-900">
                Currency Converter
              </h2>
              <p className="text-slate-900">
                Tool implementation will go here
              </p>
            </div>
          
      </ToolHeroShell>
      <ToolContentLayout
        category="calculators"
        currentToolPath="/trending-tools/currency-converter" />
    </>
  );
};

export default CurrencyConverter;
