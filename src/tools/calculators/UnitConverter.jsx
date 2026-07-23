import { Calculator } from "lucide-react";
import React, { useState } from "react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";

const UnitConverter = () => {
  return (
    <>
      <Seo page="unitConverter" />
      <ToolHeroShell
        category="calculators"
        icon={Calculator}
        title="Free Online Unit Converter"
        subtitle="Convert between different units of measurement"
        formLabel="Calculate"
      >

            <div className="p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-slate-900">
                Unit Converter
              </h2>
              <p className="text-slate-900">
                Tool implementation will go here
              </p>
            </div>
          
      </ToolHeroShell>
      <ToolContentLayout
        category="calculators"
        currentToolPath="/trending-tools/unit-converter" />
    </>
  );
};

export default UnitConverter;
