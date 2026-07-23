import { useLocation, Link } from "react-router-dom";
import { tools } from "../data/toolDefinitions";

export default function ToolsPage() {
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const searchQuery = params.get("search")?.toLowerCase() || "";

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery) ||
      tool.keywords.some((k) => k.toLowerCase().includes(searchQuery)) ||
      tool.desc.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">
      {filteredTools.map((tool) => (
        <Link key={tool.id} to={tool.path} className="p-6 border rounded-lg hover:shadow-lg">
          <h3 className="text-xl font-semibold">{tool.name}</h3>
          <p className="text-gray-600 text-sm mt-2">{tool.desc}</p>
        </Link>
      ))}
    </div>
  );
}