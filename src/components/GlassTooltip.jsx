
import { User } from "lucide-react";
import { Link } from "react-router-dom";

export default function GlassTooltip({ title, description }) {
  return (
    <div
      role="tooltip"
      className="
        absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64
        rounded-xl border border-white/30
        bg-white/70 backdrop-blur-xl
        shadow-[0_10px_30px_rgba(0,0,0,0.12)]
        px-4 py-3 text-xs text-gray-800
        opacity-0 scale-95
        group-hover:opacity-100 group-hover:scale-100
        transition-all duration-200 ease-out
        pointer-events-none z-50
      "
    >
      <div className="font-semibold text-gray-900">{title}</div>
      <div className="mt-1 text-gray-600">{description}</div>

      <div
        className="
          absolute -top-2 left-1/2 -translate-x-1/2
          w-4 h-4 bg-white/70 backdrop-blur-xl
          rotate-45 border-l border-t border-white/30
        "
      />
    </div>
  );
}

