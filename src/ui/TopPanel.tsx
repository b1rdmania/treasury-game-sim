import React from "react";
import type { GameState } from "../engine/state";
import { formatMoney } from "./format";

interface Props {
  state: GameState;
  maxTurns: number;
}

export const TopPanel: React.FC<Props> = ({ state, maxTurns }) => {
  const { chainName, ticker, tokenPrice, tvl, officialTreasury, siphoned, rage, heat, cred, techHype, seasonId } =
    state;

  const totalFunds = officialTreasury + siphoned || 1;
  const treasuryPct = (officialTreasury / totalFunds) * 100;
  const siphonedPct = (siphoned / totalFunds) * 100;

  let status: string;
  if (heat > 80) status = "Status: Regulators circling.";
  else if (rage > 80) status = "Status: DAO sharpening pitchforks.";
  else if (cred > 80) status = "Status: Cult leader.";
  else if (techHype > 80) status = "Status: Shipping cope.";
  else status = "Status: Business as usual (for now).";

  const prettySeason = seasonId.replace(/_/g, " ");

  return (
    <div className="space-y-3 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold font-mono">The Treasury Game</h1>
          <p className="text-[11px] text-slate-400">
            Drain as much of the official treasury into off-chain founder funds as you can in {maxTurns} turns without
            triggering a DAO coup or a regulatory shutdown.
          </p>
        </div>
        <div className="text-right text-xs text-slate-300 font-mono">
          <div>
            Turn <span className="font-semibold">{state.turn}</span> / {maxTurns}
          </div>
          <div>
            Chain: <span className="font-semibold">{chainName}</span> ({ticker})
          </div>
          <div>Season: {prettySeason}</div>
        </div>
      </div>

      <div className="bg-[#12151c] border border-[#1c1f27] rounded-[10px] p-3 text-xs">
        <div className="flex justify-between mb-1">
          <div>
            <div className="uppercase text-[10px] text-slate-400">Official Treasury</div>
            <div className="font-semibold">{formatMoney(officialTreasury)}</div>
          </div>
          <div className="text-right">
            <div className="uppercase text-[10px] text-slate-400">Siphoned (Off-Chain)</div>
            <div className="font-semibold text-sky-400">{formatMoney(siphoned)}</div>
          </div>
        </div>
        <div className="h-2 bg-slate-800 rounded relative overflow-hidden">
          <div className="h-2 bg-slate-600 rounded-l" style={{ width: `${treasuryPct}%` }} />
          <div
            className="h-2 bg-sky-400 rounded-r absolute top-0 left-0"
            style={{ width: `${siphonedPct}%`, marginLeft: `${treasuryPct}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-[#12151c] border border-[#1c1f27] rounded-[10px] p-3">
          <div className="uppercase text-[10px] text-slate-400 mb-1">Market</div>
          <div className="flex justify-between mb-1">
            <span>Price</span>
            <span className="font-semibold">${tokenPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>TVL</span>
            <span className="font-semibold">{formatMoney(tvl)}</span>
          </div>
        </div>
        <div className="bg-[#12151c] border border-[#1c1f27] rounded-[10px] p-3">
          <div className="uppercase text-[10px] text-slate-400 mb-1">Reputation & Risk</div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {[
              ["Rage", rage],
              ["Heat", heat],
              ["Cred", cred],
              ["Tech", techHype],
            ].map(([label, value]) => (
              <div key={label as string}>
                <div className="flex justify-between mb-0.5">
                  <span>{label}</span>
                  <span>{value as number}</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded">
                  <div
                    className={`h-1.5 rounded ${
                      label === "Rage"
                        ? "bg-red-500"
                        : label === "Heat"
                        ? "bg-orange-400"
                        : label === "Cred"
                        ? "bg-blue-400"
                        : "bg-sky-400"
                    }`}
                    style={{ width: `${Math.min(100, Number(value))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="text-[10px] text-slate-400">{status}</div>
        </div>
      </div>
    </div>
  );
};

