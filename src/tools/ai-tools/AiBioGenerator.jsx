import { Sparkles } from "lucide-react";
import React, { useState } from "react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";

const AiBioGenerator = () => {
  return (
    <>
      <Seo page="aiBioGenerator" />
      <ToolHeroShell
        category="ai-tools"
        icon={Sparkles}
        title="Free Online AI Bio Generator"
        subtitle="Create a professional bio in seconds with our AI-powered tool"
        formLabel="Calculate"
      >

            <div className="p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-slate-900">
                AI Bio Generator
              </h2>
              <p className="text-slate-900">
                Tool implementation will go here
              </p>
            </div>
          
      </ToolHeroShell>
      <ToolContentLayout
        category="ai-tools"
        currentToolPath="/tools/ai-bio-generator" />
    </>
  );
};

export default AiBioGenerator;
