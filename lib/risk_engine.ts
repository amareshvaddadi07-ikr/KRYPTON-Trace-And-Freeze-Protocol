export const MIXERS = ["Tornado", "SunSwap"];

export interface RiskBreakdownItem {
  name: string;
  points: number;
}

export interface RiskScoreResult {
  score: number;
  breakdown: RiskBreakdownItem[];
  label: "NORMAL" | "REVIEW" | "FRAUD";
  freezeAllowed: boolean;
  txCount?: number;
  [key: string]: unknown;
}

export function calculateRiskScore(transactions: any[] = []): RiskScoreResult {
  const txList = Array.isArray(transactions) ? transactions : [];
  const txCount = txList.length;

  let score = 10;
  const breakdown: RiskBreakdownItem[] = [
    { name: "Base Score", points: 10 },
  ];

  // 1) Velocity check: if more than 10 txs with same amount within 5 minutes (300,000 ms)
  let velocityTriggered = false;
  const sortedTxs = [...txList]
    .map((tx) => {
      const ts =
        typeof tx.timestamp === "number"
          ? tx.timestamp
          : typeof tx.timeStamp === "number"
          ? tx.timeStamp * 1000
          : typeof tx.timeStamp === "string"
          ? Number(tx.timeStamp) * 1000
          : 0;
      const amt = String(tx.value ?? tx.amount ?? (tx.raw?.value || ""));
      return { ts, amt };
    })
    .filter((tx) => tx.ts > 0)
    .sort((a, b) => a.ts - b.ts);

  if (sortedTxs.length > 10) {
    for (let i = 0; i < sortedTxs.length; i++) {
      const windowStart = sortedTxs[i].ts;
      const windowEnd = windowStart + 300000;
      const windowTxs = sortedTxs.filter((t) => t.ts >= windowStart && t.ts <= windowEnd);

      if (windowTxs.length > 10) {
        const counts: Record<string, number> = {};
        for (const t of windowTxs) {
          counts[t.amt] = (counts[t.amt] || 0) + 1;
        }
        if (Object.values(counts).some((count) => count > 10)) {
          velocityTriggered = true;
          break;
        }
      }
    }
  }

  if (velocityTriggered) {
    score += 25;
    breakdown.push({ name: "Velocity (10+ txs same amount <5m)", points: 25 });
  }

  // 2) Mixer contact check: if to_address includes known mixer list ["Tornado", "SunSwap"]
  let mixerTriggered = false;
  for (const tx of txList) {
    const toAddress = String(
      tx.to_address ||
      tx.to ||
      tx.target ||
      tx.contractAddress ||
      tx.toAddress ||
      ""
    ).toLowerCase();

    const matchedMixer = MIXERS.find((mixer) =>
      toAddress.includes(mixer.toLowerCase())
    );

    if (matchedMixer) {
      mixerTriggered = true;
      break;
    }
  }

  if (mixerTriggered) {
    score += 20;
    breakdown.push({ name: "Mixer Contact", points: 20 });
  }

  // 3) Gas pattern check: if gas fee equals 1.2 repeated 20 times
  let gas12Count = 0;
  for (const tx of txList) {
    const feeTrx =
      typeof tx.feeTrx === "number"
        ? tx.feeTrx
        : typeof tx.feeSun === "number"
        ? tx.feeSun / 1000000
        : typeof tx.gasUsed === "number"
        ? tx.gasUsed
        : typeof tx.gas === "number"
        ? tx.gas
        : Number(tx.feeTrx || tx.fee || tx.gasUsed || tx.gas || 0);

    if (feeTrx === 1.2 || Math.abs(feeTrx - 1.2) < 0.0001) {
      gas12Count++;
    }
  }

  if (gas12Count >= 20) {
    score += 15;
    breakdown.push({ name: "Gas Fee 1.2 Repeated 20x", points: 15 });
  }

  // Clamp score strictly between 0 and 100
  const clampedScore = Math.min(100, Math.max(0, score));

  const label: "NORMAL" | "REVIEW" | "FRAUD" =
    clampedScore < 25 ? "NORMAL" : clampedScore < 60 ? "REVIEW" : "FRAUD";

  const freezeAllowed = clampedScore >= 60;

  return {
    score: clampedScore,
    breakdown,
    label,
    freezeAllowed,
    txCount,
  };
}
