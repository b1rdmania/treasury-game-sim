export type SeasonId = "meme_summer" | "regulator_season" | "builder_winter" | "conference_quarter";

export interface SeasonDef {
  id: SeasonId;
  name: string;
  description: string;
  // modifiers that influence drift/probabilities
  rageDecayDelta?: number;
  heatDriftDelta?: number;
  credDecayDelta?: number;
  techHypeDecayDelta?: number;
  crisisFactor?: number;
  eventWeightMods?: Record<string, number>;
}

export const SEASONS: SeasonDef[] = [
  {
    id: "meme_summer",
    name: "Meme Coin Summer",
    description: "Rage decays faster; siphons feel easy.",
    rageDecayDelta: 1, // cools faster
    crisisFactor: 0.9,
    eventWeightMods: {
      meme_coin_summer: 3,
      founder_meltdown: 0.6,
      solana_outage: 1.2,
    },
  },
  {
    id: "regulator_season",
    name: "Regulator Season",
    description: "Heat rises passively; crises more likely.",
    heatDriftDelta: 3, // turns baseline -1 into +2 heat
    crisisFactor: 1.3,
    eventWeightMods: {
      influencer_thread: 1.5,
      conference_backroom_rumour: 1.2,
    },
  },
  {
    id: "builder_winter",
    name: "Builder Winter",
    description: "Credibility decays; community bored, Rage drifts up.",
    credDecayDelta: 2,
    rageDecayDelta: -2, // baseline -2 becomes +0 (no decay)
    techHypeDecayDelta: -1, // decay slower
    crisisFactor: 1.1,
    eventWeightMods: {
      cofounder_ragequit: 1.4,
    },
  },
  {
    id: "conference_quarter",
    name: "Conference Quarter",
    description: "More influencer/afterparty events; stability at risk.",
    techHypeDecayDelta: 1, // hype sticks a bit
    crisisFactor: 1.1,
    eventWeightMods: {
      influencer_thread: 1.3,
      influencer_livestream: 1.4,
      conference_backroom_rumour: 1.4,
      vc_tweetstorm: 1.2,
    },
  },
];

export function getSeason(id: SeasonId | string | undefined): SeasonDef {
  const season = SEASONS.find((s) => s.id === id);
  return season ?? SEASONS[0];
}

