import { useState, ReactNode } from "react";

type TabItem = {
  label: string;
  value: string;
  content: ReactNode;
};

export function Tabs({ tabs }: { tabs: TabItem[] }) {
  const [active, setActive] = useState(tabs[0].value);

  return (
    <div className="max-w-[680px] mx-auto p-6">
      <div className="flex border-b border-white/15 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActive(tab.value)}
            className={`
              py-2 px-4 text-base font-medium transition-colors
              ${
                active === tab.value
                  ? "border-b-2 border-white/95 text-white/95"
                  : "text-white/60 hover:text-white/95"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {tabs.map((tab) =>
          tab.value === active ? <div key={tab.value}>{tab.content}</div> : null
        )}
      </div>
    </div>
  );
}
