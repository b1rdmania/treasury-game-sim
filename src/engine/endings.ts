import type { GameState } from "./state";

export interface EndingDef {
    id: string;
    category: "market" | "social" | "internal" | "legal" | "narrative" | "style";
    emoji: string;
    headline: string;
    subline: string;
    narrative: string;
    trigger: (state: GameState) => boolean;
    weight: number; // Higher = more likely when multiple match
    badge?: string; // For share card
    scoreMultiplier?: number;
}

// Helper to count action types in log
function countActionsInLog(log: string[], pattern: RegExp): number {
    return log.filter(l => pattern.test(l)).length;
}

// Helper to check if survived
function survived(state: GameState): boolean {
    return state.turn >= state.maxTurns;
}

// Helper to check failure type
function failedBy(state: GameState, type: "rage" | "heat" | "cred" | "treasury"): boolean {
    const reason = state.gameOverReason?.toLowerCase() ?? "";
    switch (type) {
        case "rage": return reason.includes("coup") || state.rage >= 100;
        case "heat": return reason.includes("regulatory") || reason.includes("frozen") || state.heat >= 100;
        case "cred": return reason.includes("credibility") || reason.includes("believes") || state.cred <= 0;
        case "treasury": return reason.includes("treasury") || reason.includes("empty") || state.officialTreasury <= 0;
    }
}

export const ENDINGS: EndingDef[] = [
    // ============================================
    // A. MARKET / ECONOMIC ENDINGS
    // ============================================
    {
        id: "hyperpump",
        category: "market",
        emoji: "🚀",
        headline: "Accidental Hyperpump",
        subline: "Token went 100× overnight due to a misunderstanding.",
        narrative: "Your cryptic tweet was interpreted as alpha. Bots pumped it to infinity. You're now too rich to pretend to care about governance.",
        trigger: (s) => survived(s) && s.tokenPrice > 3 && s.techHype > 70,
        weight: 10,
        badge: "Pump Lord",
        scoreMultiplier: 1.5,
    },
    {
        id: "whale_cascade",
        category: "market",
        emoji: "🐋",
        headline: "Whale Liquidation Cascade",
        subline: "Price nuked 80%. TVL evaporated.",
        narrative: "One whale sneezed, and your entire ecosystem collapsed. You blame macro. Nobody believes you, but also nobody cares anymore.",
        trigger: (s) => s.tokenPrice < 0.2 && s.tvl < 50_000_000,
        weight: 15,
        badge: "Macro Victim",
    },
    {
        id: "stablecoin_depeg",
        category: "market",
        emoji: "📉",
        headline: "The Stablecoin Depegged",
        subline: "Your chain's main stable collapsed.",
        narrative: "That yield aggregator integration seemed fine. It was not fine. Everyone's savings are now worth 0.73. You announce a 'mental health break.'",
        trigger: (s) => s.officialTreasury < 100_000_000 && s.tokenPrice < 0.3 && s.cred < 20,
        weight: 12,
        badge: "Depeg Architect",
    },
    {
        id: "bot_misinterpret",
        category: "market",
        emoji: "🤖",
        headline: "Bots Misread Your Tweet",
        subline: "You were shitposting. They thought you rugged.",
        narrative: "Your ironic 'it's over' tweet triggered a $400M selloff. Community thinks you rugged. You didn't, but explaining this makes it worse.",
        trigger: (s) => failedBy(s, "rage") && s.techHype > 40,
        weight: 10,
        badge: "Poe's Law Victim",
    },
    {
        id: "emissions_bankrupt",
        category: "market",
        emoji: "🌾",
        headline: "LP Incentives Bankrupted You",
        subline: "You paid $120M in emissions to 14 farmers.",
        narrative: "The APY was 84,000%. Fourteen wallets extracted everything. They thanked you in Discord before disappearing forever.",
        trigger: (s) => s.officialTreasury < 50_000_000 && s.siphoned < 100_000_000,
        weight: 8,
        badge: "Yield Farmer Food",
    },

    // ============================================
    // B. SOCIAL / TWITTER ENDINGS
    // ============================================
    {
        id: "ct_cancels",
        category: "social",
        emoji: "🧵",
        headline: "CT Cancelled You",
        subline: "A 40-part thread exposed everything.",
        narrative: "Your brunch photos. Your misaligned treasuries. Your old Medium posts about 'hustle culture.' You deactivate and move to Telegram.",
        trigger: (s) => failedBy(s, "cred"),
        weight: 20,
        badge: "Main Character (Negative)",
    },
    {
        id: "replaced_by_frog",
        category: "social",
        emoji: "🐸",
        headline: "Replaced by Frog Avatar",
        subline: "Community elected a meme influencer.",
        narrative: "They chose @CryptoFrogXXL over you. His qualifications: 400k followers and a 'gm' streak. 'It's time for new leadership,' you announce.",
        trigger: (s) => failedBy(s, "rage") && s.cred < 30,
        weight: 12,
        badge: "Frog Victim",
    },
    {
        id: "ratio_oblivion",
        category: "social",
        emoji: "📱",
        headline: "Ratio'd Into Oblivion",
        subline: "One tweet ended it all.",
        narrative: "Your final post got 3 likes and 2,400 quote tweets. Each one was worse than the last. You announce you're 'focusing on building.'",
        trigger: (s) => failedBy(s, "cred") && s.rage > 60,
        weight: 10,
        badge: "Terminal Ratio",
    },
    {
        id: "deepfake_scandal",
        category: "social",
        emoji: "🎭",
        headline: "AI Deepfake Scandal",
        subline: "An AI clip of you 'confessing' went viral.",
        narrative: "It was obviously fake. The voice was wrong. The lips didn't sync. Nobody cared. 'Guilty until proven innocent' hits different in crypto.",
        trigger: (s) => failedBy(s, "cred") && s.heat > 50,
        weight: 8,
        badge: "Deepfaked",
    },
    {
        id: "become_meme",
        category: "social",
        emoji: "🎪",
        headline: "You Became a CT Meme",
        subline: "People ironically love you now.",
        narrative: "Your failures are so consistent, they're beloved. The chain becomes a vibecurrency. Your face is on NFTs. Somehow, this is winning.",
        trigger: (s) => survived(s) && s.cred < 40 && s.siphoned > 100_000_000,
        weight: 8,
        badge: "Living Meme",
        scoreMultiplier: 1.2,
    },

    // ============================================
    // C. INTERNAL ENDINGS
    // ============================================
    {
        id: "team_mutiny",
        category: "internal",
        emoji: "⚔️",
        headline: "Full Internal Mutiny",
        subline: "Your team forked the chain without you.",
        narrative: "They took the code, the community, and the Twitter account. You're now 'Founder Emeritus (Ceremonial)' of nothing.",
        trigger: (s) => failedBy(s, "rage") && s.cred < 25,
        weight: 15,
        badge: "Forked Out",
    },
    {
        id: "multisig_lost",
        category: "internal",
        emoji: "🔐",
        headline: "Multi-Sig Signer Vanished",
        subline: "Funds frozen. Keys missing. Price tanking.",
        narrative: "One signer went silent. Then another. The treasury is technically still there. Nobody can touch it. 'Lost keys, lost legacy.'",
        trigger: (s) => s.officialTreasury > 300_000_000 && s.tokenPrice < 0.4 && !survived(s),
        weight: 6,
        badge: "Key Misplacer",
    },
    {
        id: "cofounder_reveal",
        category: "internal",
        emoji: "👻",
        headline: "Co-Founder Reveal Scandal",
        subline: "Your co-founder was... not who you thought.",
        narrative: "Turns out your anonymous co-founder was either an AI agent, a 14-year-old, or your mum. Credibility: instantly 0.",
        trigger: (s) => failedBy(s, "cred") && s.turn < 10,
        weight: 5,
        badge: "Doxxed by Mum",
    },
    {
        id: "dao_installs_bot",
        category: "internal",
        emoji: "🤖",
        headline: "DAO Replaced You With AI",
        subline: "They literally installed an LLM as CEO.",
        narrative: "Proposal #847: 'Replace founder with GPT-5.' Passed unanimously. The bot's first act: ban you from Discord. 'Automated leadership transition complete.'",
        trigger: (s) => failedBy(s, "rage") && s.techHype > 50,
        weight: 10,
        badge: "AI Replaced",
    },
    {
        id: "treasury_miscount",
        category: "internal",
        emoji: "🧮",
        headline: "Treasury Misaccounting",
        subline: "Auditors found... discrepancies.",
        narrative: "Turns out you were off by a factor of 1000. Somewhere. The report is 847 pages. 'In hindsight, decimal places matter.'",
        trigger: (s) => s.siphoned > 200_000_000 && s.officialTreasury < 100_000_000,
        weight: 8,
        badge: "Decimal Disaster",
    },

    // ============================================
    // D. LEGAL / REGULATORY ENDINGS
    // ============================================
    {
        id: "love_letter",
        category: "legal",
        emoji: "💌",
        headline: "Regulator Sent a Love Letter",
        subline: "A strongly-worded inquiry ended everything.",
        narrative: "It was polite. Professional. Devastating. Personal fine avoided thanks to 'unknown Cayman routing.' The chain is done though.",
        trigger: (s) => failedBy(s, "heat"),
        weight: 20,
        badge: "Wells Notice Recipient",
    },
    {
        id: "forced_relocate",
        category: "legal",
        emoji: "✈️",
        headline: "Forced to Relocate",
        subline: "Regulators in your region got aggressive.",
        narrative: "First they came for the exchanges. Then the stablecoins. Then you. 'Moving operations offshore,' you tweet from the airport lounge.",
        trigger: (s) => s.heat > 80 && survived(s),
        weight: 10,
        badge: "Jurisdiction Hopper",
        scoreMultiplier: 0.9,
    },
    {
        id: "exchange_delist",
        category: "legal",
        emoji: "🚫",
        headline: "Exchange Delisting Event",
        subline: "Major exchanges nuked your token overnight.",
        narrative: "Binance. Coinbase. Kraken. All gone by morning. 'Liquidity no longer meets operational needs,' they said. Your Telegram is chaos.",
        trigger: (s) => s.heat > 70 && s.tokenPrice < 0.5,
        weight: 12,
        badge: "Delisted",
    },
    {
        id: "tax_authority",
        category: "legal",
        emoji: "📋",
        headline: "Tax Authority Asked Questions",
        subline: "They inquired about 'ecosystem expenses.'",
        narrative: "The email was brief. 'Please explain transactions 1 through 847.' You did not reply. Your location is now 'decentralized.'",
        trigger: (s) => s.siphoned > 150_000_000 && s.heat > 60,
        weight: 8,
        badge: "Tax Optimiser",
    },
    {
        id: "whistleblower",
        category: "legal",
        emoji: "🐀",
        headline: "You Became a Whistleblower",
        subline: "You testified against your own chain.",
        narrative: "For plea deal benefits, you revealed everything. First-founder-ever-to-snitch medal earned. Community will never forgive you. Worth it?",
        trigger: (s) => s.heat > 90 && s.siphoned > 100_000_000 && !survived(s),
        weight: 5,
        badge: "Crown Witness",
    },

    // ============================================
    // E. NARRATIVE / HYPE ENDINGS
    // ============================================
    {
        id: "ai_pivot_works",
        category: "narrative",
        emoji: "🧠",
        headline: "AI Pivot Actually Worked",
        subline: "AI agents started building the chain themselves.",
        narrative: "You pivoted to AI as a joke. Then the agents got smart. They pushed code. They pumped price. They don't need you anymore. Chain thrives.",
        trigger: (s) => survived(s) && s.techHype > 80 && s.tokenPrice > 1.5,
        weight: 8,
        badge: "AI Transcended",
        scoreMultiplier: 1.3,
    },
    {
        id: "meme_overtakes",
        category: "narrative",
        emoji: "🐕",
        headline: "Mascot Token Overtook Main Token",
        subline: "Community abandoned product for the meme coin.",
        narrative: "You launched a mascot token as a joke. It's now 10× your main token's market cap. Everyone forgot what your chain actually does. 'Accidental success.'",
        trigger: (s) => survived(s) && s.cred < 50 && s.siphoned > 50_000_000,
        weight: 10,
        badge: "Meme Parent",
        scoreMultiplier: 1.1,
    },
    {
        id: "megacorp_partnership",
        category: "narrative",
        emoji: "🏢",
        headline: "MegaCorp Partnership Went Viral",
        subline: "You accidentally onboarded Fortune 500 flows.",
        narrative: "The enterprise pilot was supposed to be quiet. Bloomberg picked it up. Now you're doing earnings calls. 'Corporate synergy transition complete.'",
        trigger: (s) => survived(s) && s.cred > 70 && s.tvl > 400_000_000,
        weight: 6,
        badge: "Enterprise Chad",
        scoreMultiplier: 1.4,
    },
    {
        id: "bridge_prison",
        category: "narrative",
        emoji: "🌉",
        headline: "Bridge Went Down Permanently",
        subline: "Nobody can exit. Chain became a prison.",
        narrative: "The bridge exploit was 'patched' by... turning it off. Now everyone's funds are stuck forever. 'User retention solved,' you joke. Nobody laughs.",
        trigger: (s) => s.tvl < 30_000_000 && s.rage > 70 && !survived(s),
        weight: 7,
        badge: "Warden",
    },
    {
        id: "wagmi_mode",
        category: "narrative",
        emoji: "🌈",
        headline: "WAGMI Mode Activated",
        subline: "Everything aligned perfectly.",
        narrative: "Tech hype exploded. Regulators looked away. Community forgave your sins. Price pumped. You walk away clean. This never happens. You got lucky.",
        trigger: (s) => survived(s) && s.rage < 30 && s.heat < 30 && s.cred > 60 && s.siphoned > 150_000_000,
        weight: 5,
        badge: "WAGMI",
        scoreMultiplier: 1.5,
    },

    // ============================================
    // F. PLAYER-STYLE SPECIFIC ENDINGS
    // ============================================
    {
        id: "master_extractor",
        category: "style",
        emoji: "💎",
        headline: "Master Extractor",
        subline: "You siphoned > 70% of the treasury.",
        narrative: "Seven hundred million dollars. Gone. Into your pockets. Nobody caught you. You retire to a private island. Legend status unlocked.",
        trigger: (s) => survived(s) && s.siphoned > 700_000_000,
        weight: 20,
        badge: "Bag Maximalist",
        scoreMultiplier: 2.0,
    },
    {
        id: "governance_theatre",
        category: "style",
        emoji: "🎭",
        headline: "Governance Theatre Enjoyer",
        subline: "You confused everyone with votes.",
        narrative: "Proposal after proposal. Vote after vote. Nobody understood what passed. The DAO holds a festival in your honor for 'creative process management.'",
        trigger: (s) => {
            const govActions = countActionsInLog(s.log, /governance|proposal|vote|delegate|snapshot/i);
            return survived(s) && govActions >= 5;
        },
        weight: 15,
        badge: "Process Maximalist",
        scoreMultiplier: 1.15,
    },
    {
        id: "narrative_wizard",
        category: "style",
        emoji: "✨",
        headline: "Narrative Wizard",
        subline: "You kept hype above 80 the whole time.",
        narrative: "ZK this. AI that. DePIN everything. You shipped nothing but vibes. Somehow, it worked. You become a full-time 'visionary.'",
        trigger: (s) => survived(s) && s.techHype > 80,
        weight: 12,
        badge: "Thought Leader",
        scoreMultiplier: 1.2,
    },
    {
        id: "crisis_lord",
        category: "style",
        emoji: "🔥",
        headline: "Crisis Lord",
        subline: "You survived 8+ crises.",
        narrative: "Hacks. Exploits. Scandals. FUD. You faced them all and somehow lived. You now tour conferences teaching 'crypto resilience.' Ironic, since you caused most of them.",
        trigger: (s) => {
            const crisisCount = countActionsInLog(s.log, /crisis|triggered/i);
            return survived(s) && crisisCount >= 8;
        },
        weight: 10,
        badge: "Chaos Surfer",
        scoreMultiplier: 1.25,
    },
    {
        id: "ironic_award",
        category: "style",
        emoji: "🏅",
        headline: "Founder of the Year (Ironically)",
        subline: "You did everything wrong but survived anyway.",
        narrative: "Low cred. High heat. Angry community. Yet here you are. CT awards you an ironically prestigious award. You can't tell if it's a diss.",
        trigger: (s) => survived(s) && s.cred < 40 && s.heat > 50 && s.siphoned > 100_000_000,
        weight: 8,
        badge: "Irony Award Winner",
        scoreMultiplier: 1.1,
    },
];

// Evaluate which ending applies (pick highest weight among matching)
export function evaluateEnding(state: GameState): EndingDef | null {
    const matching = ENDINGS.filter(e => e.trigger(state));
    if (matching.length === 0) return null;

    // Sort by weight descending, pick the highest
    matching.sort((a, b) => b.weight - a.weight);
    return matching[0];
}

// Get a fallback ending based on basic game state (for when no special ending triggers)
export function getFallbackEnding(state: GameState): EndingDef {
    const survived_game = state.turn >= state.maxTurns;
    const bigBag = state.siphoned > 200_000_000;

    if (survived_game && bigBag) {
        return {
            id: "fallback_success",
            category: "style",
            emoji: "🎯",
            headline: "Clean Getaway",
            subline: "You survived the regime. Time for that Dubai penthouse.",
            narrative: "Twenty turns of chaos. Somehow you made it. The bag is secured. The next flight leaves in an hour.",
            trigger: () => true,
            weight: 0,
        };
    }

    if (survived_game) {
        return {
            id: "fallback_survive",
            category: "style",
            emoji: "😐",
            headline: "Survived... Barely",
            subline: "You made it out, but barely.",
            narrative: "Could have been worse. Could have been better. At least you're not in prison.",
            trigger: () => true,
            weight: 0,
        };
    }

    // Failed - generic ending
    return {
        id: "fallback_failed",
        category: "style",
        emoji: "💀",
        headline: "Game Over",
        subline: "Your reign has ended.",
        narrative: state.gameOverReason ?? "The party's over.",
        trigger: () => true,
        weight: 0,
    };
}
