import React, { useEffect, useMemo, useState } from "react";
import { initialState, step } from "./engine/engine";
import { mulberry32 } from "./engine/rng";
import type { ActionId } from "./engine/actions";
import { ActionPanel } from "./ui/ActionPanel";
import { EventLog } from "./ui/EventLog";
import { EndOfRunCard } from "./ui/EndOfRunCard";
import { CrisisModal } from "./ui/CrisisModal";
import { resolveCrisisOption } from "./engine/crises";
import type { GameState } from "./engine/state";
import { SEASONS } from "./engine/seasons";
import type { SeasonId } from "./engine/seasons";
import { TopPanel } from "./ui/TopPanel";

const App: React.FC = () => {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const rng = useMemo(() => mulberry32(seed), [seed]);

  const [chainName, setChainName] = useState("ZooChain");
  const [ticker, setTicker] = useState("ZOO");
  const [founderName, setFounderName] = useState("You");
  const [seasonId, setSeasonId] = useState<SeasonId>("meme_summer");
  const [state, setState] = useState<GameState | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  const started = !!state;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "~") setShowDebug((v) => !v);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleAction = (id: ActionId) => {
    setState((s) => (s ? step(s, id, rng) : s));
  };

  const handleStart = () => {
    setState(
      initialState({
        chainName: chainName || "ZooChain",
        founderName: founderName || "You",
        ticker: ticker || "ZOO",
        seasonId,
      }),
    );
  };

  const handleRestart = () => {
    const newSeed = Math.floor(Math.random() * 1e9);
    setSeed(newSeed);
    setState(
      initialState({
        chainName: chainName || "ZooChain",
        founderName: founderName || "You",
        ticker: ticker || "ZOO",
        seasonId,
      }),
    );
  };

  const handleResolveCrisis = (optionId: string) => {
    setState((s) => (s ? resolveCrisisOption(s, optionId, rng) : s));
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-[#0d0f14] text-slate-100 flex items-center justify-center">
        <div className="max-w-md w-full p-6 space-y-4 bg-[#12151c] rounded-[10px] border border-[#1c1f27]">
          <h1 className="text-2xl font-bold font-mono">The Treasury Game</h1>
          <p className="text-sm text-slate-300 font-mono">
            Objective: Over 50 governance cycles, convert as much of the chain&apos;s official treasury into off-chain
            founder funds as possible — without triggering a DAO coup or a regulatory shutdown.
          </p>
          <div className="space-y-3">
            <label className="text-sm space-y-1 block">
              <span className="text-slate-300 font-mono">Chain name</span>
              <input
                className="w-full rounded-[8px] bg-[#171b24] border border-[#1c1f27] px-3 py-2 text-sm font-mono"
                value={chainName}
                onChange={(e) => setChainName(e.target.value)}
                placeholder="FrogFi"
              />
            </label>
            <label className="text-sm space-y-1 block">
              <span className="text-slate-300 font-mono">Token ticker</span>
              <input
                className="w-full rounded-[8px] bg-[#171b24] border border-[#1c1f27] px-3 py-2 text-sm font-mono uppercase"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="ZOO"
                maxLength={4}
              />
            </label>
            <label className="text-sm space-y-1 block">
              <span className="text-slate-300 font-mono">Founder name</span>
              <input
                className="w-full rounded-[8px] bg-[#171b24] border border-[#1c1f27] px-3 py-2 text-sm font-mono"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                placeholder="0xAndy"
              />
            </label>
            <label className="text-sm space-y-1 block">
              <span className="text-slate-300 font-mono">Season</span>
              <select
                className="w-full rounded-[8px] bg-[#171b24] border border-[#1c1f27] px-3 py-2 text-sm font-mono"
                value={seasonId}
                onChange={(e) => setSeasonId(e.target.value as SeasonId)}
              >
                {SEASONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            onClick={handleStart}
            className="w-full rounded-xl bg-sky-500 hover:bg-sky-400 text-sm font-semibold py-2"
          >
            Start run
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0f14] text-slate-100 flex items-center justify-center">
      <div className="max-w-3xl w-full p-4 sm:p-5 relative bg-[#0d0f14]">
        <TopPanel state={state} maxTurns={50} />

        <div className="bg-[#12151c] border border-[#1c1f27] rounded-[8px] p-4">
          <p className="text-[10px] text-slate-500 mb-3 font-mono">Press ~ to toggle debug panel</p>

          <div className="grid grid-cols-1 md:grid-cols-[2fr,1.5fr] gap-3">
            <div className={`${state?.pendingCrisis ? "opacity-50 pointer-events-none" : ""}`}>
              <h2 className="text-sm font-semibold mb-1 font-mono">Actions</h2>
              {state && <ActionPanel state={state} onSelect={handleAction} disabled={!!state.pendingCrisis} />}
            </div>
            <div>
              <h2 className="text-sm font-semibold mb-1 font-mono">Log</h2>
              {state && <EventLog log={state.log} />}
            </div>
          </div>
        </div>

        {state && <CrisisModal crisis={state.pendingCrisis ?? null} onResolve={handleResolveCrisis} />}

        {state && (
          <EndOfRunCard
            state={state}
            onRestart={handleRestart}
            onChangeNames={() => setState(null)}
          />
        )}

        {showDebug && state && (
          <div className="fixed bottom-4 left-4 bg-[#12151c]/95 border border-[#1c1f27] rounded-[8px] p-3 text-[11px] space-y-1 z-10 font-mono">
            <div className="font-semibold text-slate-200">Debug</div>
            <div>Seed: {seed}</div>
            <div>Ticker: {state.ticker}</div>
            <div>Price: ${state.tokenPrice.toFixed(2)}</div>
            <div>TVL: {state.tvl.toFixed(0)}</div>
            <div>Official treasury: {state.officialTreasury.toFixed(0)}</div>
            <div>Siphoned: {state.siphoned.toFixed(0)}</div>
            <div>Audit risk: {state.hidden.auditRisk.toFixed(2)}</div>
            <div>Founder stability: {state.hidden.founderStability.toFixed(2)}</div>
            <div>Community memory: {state.hidden.communityMemory.toFixed(2)}</div>
            <div>Recent events: {state.recentEvents.join(", ") || "None"}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
