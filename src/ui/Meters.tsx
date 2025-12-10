import React from "react";
import type { GameState } from "../engine/state";

interface Props {
  state: GameState;
}

export const Meters: React.FC<Props> = ({ state }) => {
  const items: Array<[string, number, string]> = [
    ["Treasury", state.officialTreasury, "Official protocol treasury. If 0, collapse."],
    ["Siphoned", state.siphoned, "Off-chain funds you've taken. Score metric."],
    ["Rage", state.rage, "Community anger. 100 = DAO coup."],
    ["Heat", state.heat, "Regulatory pressure. 100 = shutdown."],
    ["Cred", state.cred, "Soft power buffer. Low cred makes crises brutal."],
    ["Tech", state.techHype, "Narrative hype. Covers scandals; decays each turn."],
  ];

  const normalize = (label: string, value: number) => {
    if (label === "Treasury") return Math.min(100, (value / 1_000_000) * 100);
    if (label === "Siphoned") return Math.min(100, (value / 1_000_000) * 100);
    return Math.min(100, value);
  };

  return (
    <div className="grid grid-cols-3 gap-2 mb-3">
      {items.map(([label, value, tip]) => (
        <div
          key={label}
          className="rounded-[4px] p-2 text-[11px] transition-colors duration-200 border border-[#1c1f27] bg-[#12151c]"
          title={tip}
        >
          <div className="flex justify-between mb-1 leading-none">
            <span className="font-semibold">{label}</span>
            <span>{value}</span>
          </div>
          <div className="h-2 bg-[#1c1f27] rounded-[2px] overflow-hidden">
            <div
              className="h-2 rounded-[2px] bg-[#3bd7ff]"
              style={{
                width: `${normalize(label, Number(value)).toFixed(2)}%`,
                transition: "width 150ms linear",
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

