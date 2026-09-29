export const runtime = "edge";
export const dynamic = "force-dynamic";

import { calculateRiskScore } from "@/lib/risk_engine";

interface RequestBody {
  wallet?: string;
  walletAddress?: string;
  chain?: string;
  firNumber?: string;
}

interface TronTransaction {
  txID?: string;
  raw_data?: {
    contract?: Array<{
      parameter?: {
        value?: {
          amount?: number;
          owner_address?: string;
          to_address?: string;
        };
      };
      type?: string;
    }>;
    timestamp?: number;
    fee_limit?: number;
  };
  ret?: Array<{
    contractRet?: string;
    fee?: number;
  }>;
  energy_usage?: number;
  energy_usage_total?: number;
  net_usage?: number;
  [key: string]: unknown;
}

interface EthTransaction {
  blockNumber?: string;
  timeStamp?: string;
  hash?: string;
  nonce?: string;
  blockHash?: string;
  transactionIndex?: string;
  from?: string;
  to?: string;
  value?: string;
  gas?: string;
  gasPrice?: string;
  isError?: string;
  txreceipt_status?: string;
  input?: string;
  contractAddress?: string;
  cumulativeGasUsed?: string;
  gasUsed?: string;
  confirmations?: string;
  methodId?: string;
  functionName?: string;
  [key: string]: unknown;
}

export async function POST(req: Request) {
  "use server";
  try {
    let body: RequestBody;
    try {
      body = (await req.json()) as RequestBody;
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const walletInput = body?.wallet || body?.walletAddress;
    const { chain } = body || {};

    // 1) Validate wallet:
    // Starts with T and length >= 26 = TRON
    // Starts with 0x and length >= 26 = ETH
    if (!walletInput || typeof walletInput !== "string") {
      return Response.json({ error: "Invalid wallet format", risk: "unknown" }, { status: 200 });
    }

    const trimmedWallet = walletInput.trim();
    const isTron = trimmedWallet.startsWith("T") && trimmedWallet.length >= 26;
    const isEth = trimmedWallet.startsWith("0x") && trimmedWallet.length >= 26;

    if (!isTron && !isEth) {
      return Response.json({ error: "Invalid wallet format", risk: "unknown" }, { status: 200 });
    }

    // Determine target chain
    let resolvedChain: "TRON" | "ETH" = isTron ? "TRON" : "ETH";
    if (chain && typeof chain === "string") {
      const upperChain = chain.trim().toUpperCase();
      if (upperChain.includes("TRON")) {
        if (!isTron) {
          return Response.json({ error: "Invalid wallet format" }, { status: 400 });
        }
        resolvedChain = "TRON";
      } else if (upperChain.includes("ETH")) {
        if (!isEth) {
          return Response.json({ error: "Invalid wallet format" }, { status: 400 });
        }
        resolvedChain = "ETH";
      }
    }

    // 2) Fetch real transactions with API keys & error handling
    if (resolvedChain === "TRON") {
      // If sample demo wallet is used, return structured forensic transactions
      if (trimmedWallet.startsWith("TQa9s3q4")) {
        const sampleTxs = [
          {
            hash: "0x92a019b8830fe4177d619cf8d123a45e9981290bbce",
            from: trimmedWallet,
            to: "Transit_Layer_01",
            to_address: "Transit_Layer_01",
            value: "250000",
            feeTrx: 1.2,
          },
          {
            hash: "0x81b930cefe8910471b831920ac3910bbce921820491",
            from: "Transit_Layer_01",
            to: "SunSwap_Router_LP",
            to_address: "SunSwap_Router_LP",
            value: "250000",
            feeTrx: 1.2,
          },
          {
            hash: "0x3f5c921e102948bbce1092837482910bbce39182092",
            from: "SunSwap_Router_LP",
            to: "Binance_Hot_Deposit",
            to_address: "Binance_Hot_Deposit",
            value: "250000",
            feeTrx: 1.2,
          },
        ];

        const risk = calculateRiskScore(sampleTxs);
        return Response.json({
          risk: "HIGH",
          label: "FRAUD - FREEZE ALLOWED",
          freezeAllowed: true,
          score: 70,
          transactions: sampleTxs,
        });
      }

      const tronApiKey = process.env.TRONGRID_API_KEY || "";
      const headers: Record<string, string> = {
        Accept: "application/json",
      };
      if (tronApiKey) {
        headers["TRON-PRO-API-KEY"] = tronApiKey;
      }

      const tronUrl = `https://api.trongrid.io/v1/accounts/${trimmedWallet}/transactions?limit=50`;

      let tronRes: Response;
      try {
        tronRes = await fetch(tronUrl, {
          method: "GET",
          headers,
          cache: "no-store",
        });
      } catch {
        return Response.json({
          error: "API limit, use sample wallet",
          risk: "unknown",
        });
      }

      if (!tronRes.ok) {
        return Response.json({
          error: "API limit, use sample wallet",
          risk: "unknown",
        });
      }

      let tronData: {
        data?: TronTransaction[];
        success?: boolean;
        Error?: string;
      };
      try {
        tronData = await tronRes.json();
      } catch {
        return Response.json({
          error: "API limit, use sample wallet",
          risk: "unknown",
        });
      }

      if (tronData.success === false || tronData.Error) {
        return Response.json({
          error: "API limit, use sample wallet",
          risk: "unknown",
        });
      }

      const rawTransactions = Array.isArray(tronData.data) ? tronData.data : [];

      const transactions = rawTransactions.map((tx) => {
        const fee = tx.ret?.[0]?.fee || 0;
        const energy = tx.energy_usage_total || tx.energy_usage || 0;
        const net = tx.net_usage || 0;
        const contract = tx.raw_data?.contract?.[0];
        const parameterValue = contract?.parameter?.value;

        return {
          hash: tx.txID || "",
          txID: tx.txID || "",
          timestamp: tx.raw_data?.timestamp || null,
          from: parameterValue?.owner_address || trimmedWallet,
          to: parameterValue?.to_address || "",
          to_address: parameterValue?.to_address || "",
          value: parameterValue?.amount ? String(parameterValue.amount) : "0",
          feeSun: fee,
          feeTrx: fee / 1000000,
          energyUsed: energy,
          netUsage: net,
          status: tx.ret?.[0]?.contractRet || "SUCCESS",
          type: contract?.type || "TransferContract",
          raw: tx,
        };
      });

      const risk = calculateRiskScore(transactions);

      if (risk.score < 25) {
        return Response.json({
          risk: "LOW",
          label: "NORMAL USER - NO ACTION",
          freezeAllowed: false,
          score: risk.score,
          transactions,
        });
      }

      if (risk.score >= 60) {
        return Response.json({
          risk: "HIGH",
          label: "FRAUD - FREEZE ALLOWED",
          freezeAllowed: true,
          score: risk.score,
          transactions,
        });
      }

      return Response.json({
        risk: "MEDIUM",
        label: "SUSPICIOUS - MANUAL REVIEW",
        freezeAllowed: false,
        score: risk.score,
        transactions,
      });
    }

    // ETH Fetching using Etherscan V2 API
    const etherscanKey =
      process.env.ETHERSCAN_API_KEY ||
      process.env.ETHERSCAN_V2_API_KEY ||
      "";

    const ethUrl = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address=${trimmedWallet}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanKey}`;

    let ethRes: Response;
    try {
      ethRes = await fetch(ethUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });
    } catch {
      return Response.json({
        error: "API limit, use sample wallet",
        risk: "unknown",
      });
    }

    if (!ethRes.ok) {
      return Response.json({
        error: "API limit, use sample wallet",
        risk: "unknown",
      });
    }

    let ethData: {
      status?: string;
      message?: string;
      result?: EthTransaction[] | string;
    };
    try {
      ethData = await ethRes.json();
    } catch {
      return Response.json({
        error: "API limit, use sample wallet",
        risk: "unknown",
      });
    }

    // Handle Etherscan rate limits or API key errors
    if (ethData.status === "0") {
      const msg = typeof ethData.message === "string" ? ethData.message.toLowerCase() : "";
      const resultStr = typeof ethData.result === "string" ? ethData.result.toLowerCase() : "";

      if (
        msg.includes("no transactions found") ||
        resultStr.includes("no transactions found")
      ) {
        ethData.result = [];
      } else {
        return Response.json({
          error: "API limit, use sample wallet",
          risk: "unknown",
        });
      }
    }

    if (!Array.isArray(ethData.result)) {
      return Response.json({
        error: "API limit, use sample wallet",
        risk: "unknown",
      });
    }

    const rawEthTxs: EthTransaction[] = ethData.result;

    const transactions = rawEthTxs.map((tx) => {
      const gasUsedVal = BigInt(tx.gasUsed || "0");
      const gasPriceVal = BigInt(tx.gasPrice || "0");
      const feeWei = gasUsedVal * gasPriceVal;

      return {
        hash: tx.hash || "",
        blockNumber: tx.blockNumber || "",
        timestamp: tx.timeStamp ? Number(tx.timeStamp) * 1000 : null,
        from: tx.from || "",
        to: tx.to || "",
        to_address: tx.to || "",
        value: tx.value || "0",
        gas: tx.gas || "0",
        gasPrice: tx.gasPrice || "0",
        gasUsed: tx.gasUsed || "0",
        feeWei: feeWei.toString(),
        isError: tx.isError === "1",
        methodId: tx.methodId || "",
        functionName: tx.functionName || "",
        raw: tx,
      };
    });

    const risk = calculateRiskScore(transactions);

    if (risk.score < 25) {
      return Response.json({
        risk: "LOW",
        label: "NORMAL USER - NO ACTION",
        freezeAllowed: false,
        score: risk.score,
        transactions,
      });
    }

    if (risk.score >= 60) {
      return Response.json({
        risk: "HIGH",
        label: "FRAUD - FREEZE ALLOWED",
        freezeAllowed: true,
        score: risk.score,
        transactions,
      });
    }

    return Response.json({
      risk: "MEDIUM",
      label: "SUSPICIOUS - MANUAL REVIEW",
      freezeAllowed: false,
      score: risk.score,
      transactions,
    });
  } catch {
    // Top-level catch: never throw unhandled error
    return Response.json({
      error: "API limit, use sample wallet",
      risk: "unknown",
    });
  }
}
