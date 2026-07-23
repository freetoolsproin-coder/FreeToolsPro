import { useId } from "react";
import ToolCard from "./ToolCard";

export default function ToolSection({ title, subtitle, tools }) {
  const headingId = useId();

  return (
    <section className="mb-16" aria-labelledby={headingId}>
      <div className="mb-6 text-center">
        <h2 id={headingId} className="toolsTitle">
          {title}
        </h2>
        {subtitle ? <p className="mt-2 text-sm text-slate-600">{subtitle}</p> : null}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
