import React from "react";
import type { CrisisDef } from "../engine/crises";

interface Props {
  crisis: CrisisDef | null;
  onResolve: (optionId: string) => void;
}

export const CrisisModal: React.FC<Props> = ({ crisis, onResolve }) => {
  if (!crisis) return null;
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20">
      <div className="bg-[#12151c] rounded-[8px] p-6 max-w-lg w-full space-y-3 shadow-2xl border border-[#1c1f27]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-mono">{crisis.name}</h2>
          <span className="text-[10px] uppercase tracking-wide text-amber-300">{crisis.severity}</span>
        </div>
        <p className="text-sm text-slate-200 font-mono">{crisis.description}</p>
        <div className="space-y-2">
          {crisis.options.map((opt) => (
            <button
              key={opt.id}
              className="w-full text-left rounded-[6px] px-3 py-2 bg-[#171b24] hover:bg-[#1f2532] text-sm transition-colors font-mono"
              onClick={() => onResolve(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

