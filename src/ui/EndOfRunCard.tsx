import React from "react";
import type { GameState } from "../engine/state";
import { ShareCard } from "./ShareCard";
import { evaluateEnding, getFallbackEnding, type EndingDef } from "../engine/endings";

interface Props {
  state: GameState;
  onRestart: () => void;
  onChangeNames?: () => void;
}

function getVibeColors(ending: EndingDef): string {
  // Success vibes (survived with good outcome)
  const successIds = ["hyperpump", "wagmi_mode", "master_extractor", "ai_pivot_works", "megacorp_partnership", "become_meme", "narrative_wizard", "governance_theatre", "crisis_lord", "meme_overtakes", "fallback_success"];
  // Neutral/escape vibes (survived but messy)
  const escapeIds = ["forced_relocate", "ironic_award", "fallback_survive"];

  if (successIds.includes(ending.id)) {
    return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
  }
  if (escapeIds.includes(ending.id)) {
    return "bg-amber-500/10 border-amber-500/30 text-amber-400";
  }
  // Everything else is failure
  return "bg-red-500/10 border-red-500/30 text-red-400";
}

export const EndOfRunCard: React.FC<Props> = ({ state, onRestart, onChangeNames }) => {
  if (!state.gameOver) return null;

  // Evaluate which ending applies
  const ending = evaluateEnding(state) ?? getFallbackEnding(state);
  const vibeColors = getVibeColors(ending);

  return (
    <div className="modal-backdrop">
      <div className="modal-content max-w-lg">
        {/* Dramatic Header */}
        <div className={`text-center mb-6 py-6 -mx-6 -mt-6 rounded-t-2xl border-b ${vibeColors}`}>
          <div className="text-5xl mb-3">{ending.emoji}</div>
          <h2 className="text-3xl font-bold tracking-tight">{ending.headline}</h2>
          <p className="text-sm opacity-80 mt-2 max-w-xs mx-auto">{ending.subline}</p>
          {ending.badge && (
            <div className="mt-3 inline-block px-3 py-1 rounded-full bg-black/20 text-xs uppercase tracking-wide">
              🏷️ {ending.badge}
            </div>
          )}
        </div>

        {/* Narrative Story */}
        <div className="bg-slate-800/50 rounded-xl p-4 mb-5 border border-slate-700/50">
          <p className="text-sm text-slate-300 leading-relaxed italic">
            "{ending.narrative}"
          </p>
        </div>

        {/* Turn Counter */}
        <div className="text-center text-xs text-slate-500 mb-4">
          Turn {state.turn} of {state.maxTurns}
          {ending.category !== "style" && (
            <span className="ml-2 text-slate-600">• {ending.category.toUpperCase()} ending</span>
          )}
        </div>

        {/* Share Card */}
        <ShareCard state={state} ending={ending} />

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-2 mt-5">
          <button
            onClick={onRestart}
            className="w-full py-3.5 px-4 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl transition-colors"
          >
            Try Again
          </button>
          {onChangeNames && (
            <button
              onClick={onChangeNames}
              className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-xl transition-colors text-sm"
            >
              New Chain / Founder
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
