import { Link } from "react-router-dom";

export default function GlassToolCard({
  title,
  desc,
  to,
  icon: Icon,
}) {
  return (
    <Link
      to={to}
      className="group relative block bg-white p-6 rounded-2xl shadow hover:shadow-xl transition text-center"
    >
      {Icon && (
        <div className="text-4xl mb-6 flex justify-center">
          <Icon size={40} />
        </div>
      )}

      <h3 className="text-black font-semibold text-lg mb-1">
        {title}
      </h3>

      <p className="text-sm text-gray-800 leading-relaxed">
        {desc}
      </p>

      <span className="
        pointer-events-none absolute inset-x-0 bottom-0 h-px
        bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent
        opacity-0 group-hover:opacity-100 transition
      " />
    </Link>
  );
}
