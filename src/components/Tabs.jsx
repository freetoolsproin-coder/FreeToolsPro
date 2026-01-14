import { FileText, Image, Edit3 } from "lucide-react";

export default function Tabs({ active, setActive }) {
  const tabs = [
    { id: "word", label: "PDF to Word", icon: FileText },
    { id: "jpg", label: "PDF to JPG", icon: Image },
    { id: "edit", label: "PDF Editor", icon: Edit3 },
  ];

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="flex border-b border-gray-200">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;

          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition
                ${
                  isActive
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
