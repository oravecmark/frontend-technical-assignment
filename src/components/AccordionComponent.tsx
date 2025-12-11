import type { ReactNode } from "react";

interface AccordionComponentProps {
  number: number;
  title: string;
  description: string;
  isOpen: boolean;
  isCompleted: boolean;
  onToggle: () => void;
  children: ReactNode;
}

function AccordionComponent({
  number,
  title,
  description,
  isOpen,
  isCompleted,
  onToggle,
  children,
}: AccordionComponentProps) {
  return (
    <div className="border border-gray-200 rounded-lg mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <div
            className={`
            w-10 h-10 rounded flex items-center justify-center text-white font-semibold
            ${isCompleted ? "bg-green-500" : "bg-blue-600"}
          `}
          >
            {isCompleted ? "✓" : number}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && <div className="p-6 border-t border-gray-200">{children}</div>}
    </div>
  );
}

export default AccordionComponent;
