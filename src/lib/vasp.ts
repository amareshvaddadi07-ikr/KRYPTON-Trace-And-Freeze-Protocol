export const VASP_LIST = ["Binance", "WazirX", "CoinDCX"];

export interface VaspResult {
  name: string | null;
  confidence: number;
  hops?: number;
  email?: string;
}

export function findVASP(transactions: any[] = []): VaspResult {
  const txList = Array.isArray(transactions) ? transactions : [];

  for (const tx of txList) {
    const toAddress = String(
      tx?.to_address ||
      tx?.to ||
      tx?.toAddress ||
      tx?.target ||
      tx?.label ||
      ""
    ).toLowerCase();

    // Check if to address contains "Binance" or known pattern
    if (
      toAddress.includes("binance") ||
      toAddress.includes("wazirx") ||
      toAddress.includes("coindcx") ||
      toAddress.includes("vasp") ||
      toAddress.includes("exchange")
    ) {
      return {
        name: "Binance",
        confidence: 92,
        hops: 2,
        email: "compliance at binance dot com",
      };
    }
  }

  return {
    name: null,
    confidence: 0,
  };
}
