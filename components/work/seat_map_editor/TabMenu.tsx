"use client";

import { tabContext } from "@/app/work/page";
import { useContext } from "react";

export default function TabMenu() {
  const { tabIndex, setTabIndex, names } = useContext(tabContext);

  return (
    <div className="flex justify-center items-end">
      {names.map((name, index) => (
        <button
          key={index}
          onClick={() => setTabIndex(index)}
          className={`
            rounded-tl-lg rounded-tr-lg
            relative px-5 py-3 text-sm font-medium
            transition-colors
            bg-white
            border border-t border-r border-l
            ${
              tabIndex === index
                ? "text-blue-600 h-12"
                : "text-slate-500 hover:text-slate-800 h-10"
            }
          `}
        >
          {name}

          {tabIndex === index && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600" />
          )}
        </button>
      ))}
    </div>
  );
}