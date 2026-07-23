import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function GlassToolCard({ title, desc, to, icon }) {
  return (
    <Link
      to={to}
      className="group bg-white p-6 gap-6 rounded-2xl shadow hover:shadow-xl transition flex items-center"
    >
      <div className="text-3xl flex items-center">
        {typeof icon === "string" ? (
          <span className="text-5xl">{icon}</span>
        ) : (
          icon &&
          (() => {
            const Icon = icon;
            return <Icon size={40} />;
          })()
        )}
      </div>

      <div className="text-left">
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
      <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-sky-600" />
    </Link>
  );
}
