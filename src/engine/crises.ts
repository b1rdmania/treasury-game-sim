import type { GameState } from "./state";
import type { RNG } from "./rng";
import type { SeasonDef } from "./seasons";

export type CrisisId = "influencer_rug_call" | "bridge_exploit_rumour";

export interface CrisisOptionOutcome {
  narrative: string;
  apply: (s: GameState) => GameState;
}

export interface CrisisOption {
  id: string;
  label: string;
  resolve: (s: GameState, rng: RNG) => CrisisOptionOutcome;
}

export interface CrisisDef {
  id: CrisisId;
  name: string;
  description: string;
  severity: "low" | "medium" | "high" | "legendary";
  weight: (s: GameState) => number;
  options: CrisisOption[];
}

export const CRISES: CrisisDef[] = [
  {
    id: "influencer_rug_call",
    name: "Influencer Accuses You of Rugging Live",
    description: "A loud account is dragging your treasury flows in front of 5k listeners.",
    severity: "high",
    weight: (s) => (s.rage + s.heat) / 120,
    options: [
      {
        id: "statement",
        label: "Issue a formal statement",
        resolve: (s, rng) => {
          void s;
          const roll = rng();
          if (roll < 0.6) {
            return {
              narrative: "Statement lands OK. Community chills a bit.",
              apply: (st) => ({
                ...st,
                rage: Math.max(0, st.rage - 15),
                cred: Math.min(100, st.cred + 10),
              }),
            };
          }
          if (roll < 0.85) {
            return {
              narrative: "Regulator notices your statement footnote.",
              apply: (st) => ({
                ...st,
                heat: Math.min(100, st.heat + 15),
                cred: Math.max(0, st.cred - 5),
              }),
            };
          }
          return {
            narrative: "Statement backfires. Meme thread doubles the rage.",
            apply: (st) => ({
              ...st,
              rage: Math.min(100, st.rage + 20),
              cred: Math.max(0, st.cred - 10),
            }),
          };
        },
      },
      {
        id: "ignore",
        label: "Ignore",
        resolve: () => ({
          narrative: "You ignore. The mob simmers.",
          apply: (st) => ({
            ...st,
            rage: Math.min(100, st.rage + 10),
            hidden: { ...st.hidden, communityMemory: st.hidden.communityMemory + 0.1 },
          }),
        }),
      },
      {
        id: "join_space",
        label: "Join their Space",
        resolve: (s, rng) => {
          const success = rng() < s.cred / 120; // scales with cred
          if (success) {
            return {
              narrative: "You handle it calmly; chat respects the transparency.",
              apply: (st) => ({
                ...st,
                cred: Math.min(100, st.cred + 15),
                rage: Math.max(0, st.rage - 10),
              }),
            };
          }
          return {
            narrative: "You get flustered, clips go viral.",
            apply: (st) => ({
              ...st,
              cred: Math.max(0, st.cred - 20),
              rage: Math.min(100, st.rage + 25),
              hidden: { ...st.hidden, founderStability: st.hidden.founderStability - 0.2 },
            }),
          };
        },
      },
      {
        id: "blame_contractor",
        label: "Blame a contractor",
        resolve: (s, rng) => {
          void s;
          const roll = rng();
          if (roll < 0.5) {
            return {
              narrative: "Community buys it (for now).",
              apply: (st) => ({
                ...st,
                rage: Math.max(0, st.rage - 5),
                cred: Math.max(0, st.cred - 5),
                hidden: { ...st.hidden, auditRisk: st.hidden.auditRisk + 0.05 },
              }),
            };
          }
          if (roll < 0.75) {
            return {
              narrative: "Contractor leaks DMs. Heat spikes.",
              apply: (st) => ({
                ...st,
                heat: Math.min(100, st.heat + 20),
                cred: Math.max(0, st.cred - 10),
              }),
            };
          }
          return {
            narrative: "Legendary leak: screenshots everywhere.",
            apply: (st) => ({
              ...st,
              heat: Math.min(100, st.heat + 30),
              rage: Math.min(100, st.rage + 20),
              hidden: { ...st.hidden, communityMemory: st.hidden.communityMemory + 0.2 },
            }),
          };
        },
      },
      {
        id: "pivot_ai",
        label: "Pivot to AI mid-Space",
        resolve: (s, rng) => {
          void s;
          const roll = rng();
          if (roll < 0.4) {
            return {
              narrative: "AI hype distracts everyone briefly.",
              apply: (st) => ({
                ...st,
                techHype: Math.min(100, st.techHype + 20),
                rage: Math.max(0, st.rage - 5),
                heat: Math.min(100, st.heat + 5),
              }),
            };
          }
          return {
            narrative: "People laugh at the pivot. Rage builds.",
            apply: (st) => ({
              ...st,
              rage: Math.min(100, st.rage + 15),
              cred: Math.max(0, st.cred - 5),
            }),
          };
        },
      },
    ],
  },
  {
    id: "bridge_exploit_rumour",
    name: "Bridge Exploit Rumour",
    description: "Rumours of a bridge exploit spread. Funds look shaky.",
    severity: "medium",
    weight: (s) => (s.hidden.auditRisk > 0.3 ? 1.2 : 0.3),
    options: [
      {
        id: "pause_bridge",
        label: "Pause the bridge",
        resolve: () => ({
          narrative: "Bridge paused. Users angry but funds safe (maybe).",
          apply: (st) => ({
            ...st,
            heat: Math.min(100, st.heat + 10),
            rage: Math.min(100, st.rage + 5),
            cred: Math.max(0, st.cred - 5),
            hidden: { ...st.hidden, auditRisk: st.hidden.auditRisk - 0.1 },
          }),
        }),
      },
      {
        id: "deny",
        label: "Deny and cope",
        resolve: (s, rng) => {
          void s;
          const roll = rng();
          if (roll < 0.4) {
            return {
              narrative: "Rumour dies down. Crisis averted.",
              apply: (st) => ({
                ...st,
                cred: Math.min(100, st.cred + 5),
              }),
            };
          }
          return {
            narrative: "Exploit confirmed. Rage erupts.",
            apply: (st) => ({
              ...st,
              rage: Math.min(100, st.rage + 25),
              heat: Math.min(100, st.heat + 15),
              cred: Math.max(0, st.cred - 15),
            }),
          };
        },
      },
      {
        id: "bounty",
        label: "Post a bounty",
        resolve: () => ({
          narrative: "Whitehats engage. Costs treasury but buys time.",
          apply: (st) => ({
            ...st,
            officialTreasury: Math.max(0, st.officialTreasury - 80),
            cred: Math.min(100, st.cred + 5),
            heat: Math.min(100, st.heat + 5),
          }),
        }),
      },
    ],
  },
];

export function maybePickCrisis(state: GameState, rng: RNG, season: SeasonDef): CrisisDef | null {
  const base =
    0.05 +
    state.rage * 0.001 +
    state.heat * 0.001 +
    (100 - state.cred) * 0.0005 +
    state.hidden.auditRisk * 0.2;
  const seasonFactor = season.crisisFactor ?? 1;
  const adjusted = base * seasonFactor;
  if (rng() > adjusted) return null;

  const candidates = CRISES.filter((c) => c.weight(state) > 0);
  if (!candidates.length) return null;
  const weights = candidates.map((c) => c.weight(state));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < candidates.length; i++) {
    r -= weights[i];
    if (r <= 0) return candidates[i];
  }
  return candidates[candidates.length - 1];
}

export function resolveCrisisOption(state: GameState, optionId: string, rng: RNG): GameState {
  if (!state.pendingCrisis) return state;
  const option = state.pendingCrisis.options.find((o) => o.id === optionId);
  if (!option) return state;
  const outcome = option.resolve(state, rng);
  const updated = outcome.apply(state);
  return {
    ...updated,
    pendingCrisis: undefined,
    log: [`[CRISIS] ${outcome.narrative}`, ...updated.log],
  };
}

