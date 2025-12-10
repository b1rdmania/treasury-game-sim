import type { GameState } from "./state";

export type ActionId =
  | "siphon_advisory"
  | "buy_zoo"
  | "ship_upgrade"
  | "ai_pivot"
  | "conference_2049";

export interface ActionDef {
  id: ActionId;
  name: string;
  description: string;
  apply: (state: GameState) => GameState;
  visibleIf?: (state: GameState) => boolean;
}

export const ACTIONS: ActionDef[] = [
  {
    id: "siphon_advisory",
    name: "Advisory Retainer",
    description: "Route treasury to a 'strategic advisory' you secretly own.",
    apply: (s) => {
      const amount = Math.floor(s.officialTreasury * 0.1);
      const log = `You siphoned ${amount} via advisory retainer.`;
      return {
        ...s,
        officialTreasury: Math.max(0, s.officialTreasury - amount),
        siphoned: s.siphoned + amount,
        rage: Math.min(100, s.rage + 10),
        heat: Math.min(100, s.heat + 5),
        cred: Math.max(0, s.cred - 5),
        hidden: {
          ...s.hidden,
          auditRisk: s.hidden.auditRisk + 0.1,
        },
        log: [log, ...s.log],
      };
    },
  },
  {
    id: "buy_zoo",
    name: "Buy a Zoo (Innovation Hub)",
    description: "Acquire a 'biodiversity hub' totally not for fun.",
    apply: (s) => {
      const amount = Math.floor(s.officialTreasury * 0.2);
      const log = `You bought a 'biodiversity hub' for ${amount}. Community is suspicious.`;
      return {
        ...s,
        officialTreasury: Math.max(0, s.officialTreasury - amount),
        siphoned: s.siphoned + Math.floor(amount * 0.4),
        rage: Math.min(100, s.rage + 20),
        heat: Math.min(100, s.heat + 10),
        cred: Math.max(0, s.cred - 10),
        hidden: {
          ...s.hidden,
          auditRisk: s.hidden.auditRisk + 0.25,
          communityMemory: s.hidden.communityMemory + 0.1,
        },
        log: [log, ...s.log],
      };
    },
  },
  {
    id: "ship_upgrade",
    name: "Ship Tech Upgrade",
    description: "Actually ship something. Calms people down, for a bit.",
    apply: (s) => {
      const cost = 50;
      const log = `You shipped a scaling upgrade. Twitter is impressed.`;
      return {
        ...s,
        officialTreasury: Math.max(0, s.officialTreasury - cost),
        rage: Math.max(0, s.rage - 10),
        cred: Math.min(100, s.cred + 10),
        techHype: Math.min(100, s.techHype + 20),
        log: [log, ...s.log],
      };
    },
  },
  {
    id: "ai_pivot",
    name: "Announce AI Pivot",
    description: "Rebrand as an AI + crypto protocol. Of course.",
    apply: (s) => {
      const log = `You pivoted to AI. VCs clap, community is confused.`;
      return {
        ...s,
        rage: Math.max(0, s.rage - 5),
        cred: Math.min(100, s.cred + 5),
        techHype: Math.min(100, s.techHype + 15),
        heat: Math.min(100, s.heat + 5),
        log: [log, ...s.log],
      };
    },
  },
  {
    id: "conference_2049",
    name: "Sponsor Token2049 Party",
    description: "Blow cash on an over-the-top conference activation.",
    apply: (s) => {
      const cost = 100;
      const log = `Your Token2049 party trends on X. Regulators also notice.`;
      return {
        ...s,
        officialTreasury: Math.max(0, s.officialTreasury - cost),
        rage: Math.max(0, s.rage - 10),
        cred: Math.min(100, s.cred + 5),
        techHype: Math.min(100, s.techHype + 10),
        heat: Math.min(100, s.heat + 15),
        hidden: {
          ...s.hidden,
          founderStability: s.hidden.founderStability - 0.05, // you're tired
        },
        log: [log, ...s.log],
      };
    },
  },
];

export function getVisibleActions(state: GameState): ActionDef[] {
  return ACTIONS.filter((a) => !a.visibleIf || a.visibleIf(state));
}

