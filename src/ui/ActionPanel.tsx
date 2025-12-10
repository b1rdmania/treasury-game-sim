import React from "react";
import type { GameState } from "../engine/state";
import { getVisibleActions } from "../engine/actions";
import type { ActionId } from "../engine/actions";

interface Props {
  state: GameState;
  onSelect: (id: ActionId) => void;
  disabled?: boolean;
}

export const ActionPanel: React.FC<Props> = ({ state, onSelect, disabled }) => {
  const actions = getVisibleActions(state);
  return (
    <div className="space-y-2">
      {actions.map((a) => (
        <button
          key={a.id}
          onClick={() => onSelect(a.id)}
          disabled={disabled}
          className={`w-full text-left rounded-[6px] px-3 py-2 text-[13px] font-mono ${
            disabled
              ? "bg-slate-800/60 text-slate-500 cursor-not-allowed border border-slate-800"
              : "bg-[#12151c] hover:bg-[#171b24] border border-[#1c1f27]"
          }`}
        >
          <div className="font-semibold">{a.name}</div>
          <div className="text-xs text-slate-300">{a.description}</div>
        </button>
      ))}
    </div>
  );
};

