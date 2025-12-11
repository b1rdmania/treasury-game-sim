import type { EventDef } from "../engine/events";

// Placeholder content pack for Web3-flavoured random events.
// Extend this list to add new events without touching engine code.
export const WEB3_EVENTS: EventDef[] = [];

// Scandal fragments for narrative generators (dark + sarcastic tone)
export interface ScandalFragment {
  key: string;
  narrative: string;
  severity?: "low" | "medium" | "high" | "very high" | "extreme";
}

export const SCANDAL_FRAGMENTS: ScandalFragment[] = [
  {
    key: "tokenomics_powerpoint_leak",
    severity: "medium",
    narrative:
      "A leaked tokenomics PowerPoint revealed you had no idea how emissions worked. The community realised the coin was doomed long before you did.",
  },
  {
    key: "hr_investigation_opened",
    severity: "high",
    narrative:
      "An HR investigation was opened into your 'leadership style,' which your team described as 'burnout but make it crypto.' The DAO saw the report before you did.",
  },
  {
    key: "founder_wallet_doxxed",
    severity: "very high",
    narrative:
      "Your founder wallet was doxxed, exposing several transfers you labelled as 'marketing experiments.' The chain called them what they were: siphons.",
  },
  {
    key: "stablecoin_depeg_rumour",
    severity: "medium",
    narrative:
      "A rumour spread that your stablecoin partner was depegging again. You tried to calm everyone down, but your silence only made the panic louder.",
  },
  {
    key: "treasury_multisig_conflict",
    severity: "high",
    narrative:
      "A treasury multisig signer went rogue on Twitter and implied you were cooking the books. You denied it, which only made everyone assume it was true.",
  },
  {
    key: "governance_voter_revolt",
    severity: "high",
    narrative:
      "A faction of disgruntled voters launched a coordinated 'vote no on everything' movement. It gained momentum faster than any product you shipped.",
  },
  {
    key: "legal_cease_and_desist",
    severity: "extreme",
    narrative:
      "A cease-and-desist letter leaked, confirming that regulators had finally noticed you. The DAO concluded you were now a liability.",
  },
  {
    key: "bridge_exploit_false_alarm",
    severity: "medium",
    narrative:
      "A false alarm about a bridge exploit tanked confidence. Even after clarifying it wasn’t real, the community said 'vibes were off' and never recovered.",
  },
  {
    key: "team_mass_exit",
    severity: "extreme",
    narrative:
      "Half your team rage-quit in a group post titled 'We Weren’t Paid for Months.' It got more engagement than your entire product launch.",
  },
  {
    key: "botched_ama",
    severity: "low",
    narrative:
      "Your AMA derailed when someone asked a simple question you couldn’t answer. The clip went viral and became a reaction gif used against you daily.",
  },
  // Bonus ultra-dark
  {
    key: "insider_dump_exposed",
    severity: "extreme",
    narrative:
      "Wallet sleuths caught you dumping tokens an hour before bad news. You called it coincidence. No one else did.",
  },
  {
    key: "cult_leader_accusation",
    severity: "high",
    narrative:
      "Someone accused you of running a cult. The sad part was how many people agreed instantly.",
  },
  {
    key: "roadmap_2027_leaked",
    severity: "medium",
    narrative:
      "A leaked roadmap showed you had no plans past Q1. The DAO concluded you were improvising the entire time.",
  },
  {
    key: "founder_tinder_dates_revealed",
    severity: "medium",
    narrative:
      "A Tinder match leaked screenshots of you pitching your token mid-date. The scandal wasn’t the behaviour — it was how poorly the pitch landed.",
  },
  {
    key: "ai_generated_press_release",
    severity: "low",
    narrative:
      "Your press release was exposed as AI-generated. The community said it had more personality than you.",
  },
];


