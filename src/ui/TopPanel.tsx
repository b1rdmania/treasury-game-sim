import React from "react";
import type { GameState } from "../engine/state";
import { formatMoney, formatTokenPrice } from "./format";

interface Props {
  state: GameState;
  maxTurns: number;
  showDescription?: boolean;
}

export const TopPanel: React.FC<Props> = ({ state, maxTurns, showDescription = true }) => {
  const { tokenPrice, tvl, officialTreasury, siphoned, rage, heat, cred, techHype, seasonId } =
    state;

  const prettySeason = seasonId.replace(/_/g, " ");

  return (
    <div className="space-y-1 mb-3">
      <div>
        <h1 className="text-2xl font-bold font-mono leading-tight">Treasury Wars v1.0</h1>
        {showDescription && (
          <p className="text-[11px] text-slate-400 leading-snug">
            Drain as much treasury into off-chain founder funds as you can in {maxTurns} turns without triggering a DAO
            coup or regulatory shutdown.
          </p>
        )}
      </div>

      <div className="text-[11px] text-slate-200 space-y-1 font-mono bg-[#12151c] border border-[#1c1f27] rounded-[8px] p-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold">Turn</span>
          <span>
            {state.turn}/{maxTurns}
          </span>
          <span className="text-slate-500">•</span>
          <span className="font-semibold">Season</span>
          <span className="capitalize">{prettySeason}</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Price</span>
            <span className="font-semibold">{formatTokenPrice(tokenPrice)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-400">TVL</span>
            <span className="font-semibold">{formatMoney(tvl)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Treasury</span>
            <span className="font-semibold">{formatMoney(officialTreasury)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Siphoned</span>
            <span className="font-semibold">{formatMoney(siphoned)}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Cluster label="Community Rage" value={rage} color="bg-red-500" />
          <Cluster label="Regulatory Heat" value={heat} color="bg-orange-400" />
          <Cluster label="Cred" value={cred} color="bg-blue-400" />
          <Cluster label="Tech" value={techHype} color="bg-sky-400" />
        </div>
      </div>
    </div>
  );
};

const Cluster: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <span className="flex items-center gap-1">
    {label}
    <span className="h-1.5 w-12 bg-slate-700 rounded overflow-hidden">
      <span className={`block h-1.5 ${color}`} style={{ width: `${Math.min(100, value)}%` }} />
    </span>
    {value}
  </span>
);

