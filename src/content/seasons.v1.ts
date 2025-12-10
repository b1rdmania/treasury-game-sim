import type { SeasonDef } from "../engine/seasons";

// Aligns with engine season fields for quick swapping/balancing.
export const SEASONS_V1: SeasonDef[] = [
  {
    id: "meme_summer",
    name: "Meme Coin Summer",
    description: "Rage decays faster; siphons feel easy.",
    rageDecayDelta: 1,
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
    heatDriftDelta: 3,
    crisisFactor: 1.3,
    eventWeightMods: {
      influencer_thread: 1.5,
      conference_backroom_rumour: 1.2,
    },
  },
  {
    id: "builder_winter",
    name: "Builder Winter",
    description: "Cred decays; community bored, rage lingers.",
    credDecayDelta: 2,
    rageDecayDelta: -2,
    techHypeDecayDelta: -1,
    crisisFactor: 1.1,
    eventWeightMods: {
      cofounder_ragequit: 1.4,
    },
  },
  {
    id: "conference_quarter",
    name: "Conference Quarter",
    description: "More influencer/afterparty chaos; stability at risk.",
    techHypeDecayDelta: 1,
    crisisFactor: 1.1,
    eventWeightMods: {
      influencer_thread: 1.3,
      influencer_livestream: 1.4,
      conference_backroom_rumour: 1.4,
      vc_tweetstorm: 1.2,
    },
  },
];

