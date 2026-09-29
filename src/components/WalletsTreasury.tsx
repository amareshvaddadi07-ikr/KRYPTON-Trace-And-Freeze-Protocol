"use client";

import React, { useState } from "react";
import { Wallet, Copy, Check, ArrowUpRight, ArrowDownLeft, Shield, Plus, Key } from "lucide-react";
import { formatAddress } from "@/lib/utils";

interface Vault {
  id: string;
  name: string;
  address: string;
  chain: string;
  balanceUsd: string;
  tokens: { symbol: string; amount: string; icon: string }[];
  type: "Multisig" | "Hot Wallet" | "Cold Reserve";
}

const mockVaults: Vault[] = [
  {
    id: "v-1",
    name: "Primary Settlement Vault (3/5 Multisig)",
    address: "0x7F89C4B631D12E99A302251e048B57F32a973B9A",
    chain: "Solana Mainnet",
    balanceUsd: "$840,250.00",
    tokens: [
      { symbol: "USDC", amount: "650,000", icon: "$" },
      { symbol: "SOL", amount: "1,268.33", icon: "◎" },
    ],
    type: "Multisig",
  },
  {
    id: "v-2",
    name: "Automated Payout Hot Vault",
    address: "0x3A2190184B429184D819203859102837482910AA",
    chain: "Base / Ethereum L2",
    balanceUsd: "$290,400.00",
    tokens: [
      { symbol: "USDC", amount: "200,000", icon: "$" },
      { symbol: "ETH", amount: "33.8", icon: "Ξ" },
    ],
    type: "Hot Wallet",
  },
  {
    id: "v-3",
    name: "Strategic Escrow & Cold Reserve",
    address: "0x98b8c29018247190182749102b48192038471920",
    chain: "Arbitrum One",
    balanceUsd: "$110,240.00",
    tokens: [
      { symbol: "PYUSD", amount: "85,000", icon: "P" },
      { symbol: "USDC", amount: "25,240", icon: "$" },
    ],
    type: "Cold Reserve",
  },
];

interface WalletsTreasuryProps {
  onTransfer: () => void;
  onReceive: () => void;
}

export function WalletsTreasury({ onTransfer, onReceive }: WalletsTreasuryProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Treasury & Vault Infrastructure
          </h2>
          <p className="text-xs text-muted">
            Multi-chain asset vaults with hardware-enforced MPC and real-time reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReceive}
            className="rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-medium text-foreground shadow-soft transition-all hover:border-brand-300 hover:bg-brand-50/40"
          >
            Deposit Asset
          </button>
          <button
            onClick={onTransfer}
            className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-3.5 py-2 text-xs font-medium text-white shadow-soft transition-all hover:bg-brand-600 hover:shadow-soft-hover"
          >
            <span>Transfer Out</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Vault Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {mockVaults.map((vault) => (
          <div
            key={vault.id}
            className="group relative flex flex-col justify-between rounded-2xl border border-border bg-white p-6 shadow-soft transition-all hover:border-brand-200 hover:shadow-soft-hover"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between">
                <span className="rounded-md border border-brand-100 bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-600">
                  {vault.type}
                </span>
                <span className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted">
                  {vault.chain}
                </span>
              </div>

              {/* Title & Balance */}
              <h3 className="mt-4 text-sm font-semibold text-foreground">
                {vault.name}
              </h3>

              <div className="mt-2 font-mono text-2xl font-bold tracking-tight text-foreground">
                {vault.balanceUsd}
              </div>

              {/* Address with copy */}
              <div className="mt-3 flex items-center justify-between rounded-xl border border-border bg-background/50 px-2.5 py-1.5">
                <span className="font-mono text-xs text-muted-dark">
                  {formatAddress(vault.address, 6)}
                </span>
                <button
                  onClick={() => handleCopy(vault.id, vault.address)}
                  className="rounded p-1 text-muted transition-colors hover:text-brand-600"
                  title="Copy address"
                >
                  {copiedId === vault.id ? (
                    <Check className="h-3.5 w-3.5 text-brand-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              {/* Tokens breakdown */}
              <div className="mt-4 space-y-1.5">
                <div className="text-[11px] font-medium text-muted uppercase tracking-wider">
                  Holdings
                </div>
                <div className="flex flex-wrap gap-2">
                  {vault.tokens.map((t, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1 text-xs"
                    >
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-100 font-mono text-[10px] font-bold text-brand-700">
                        {t.icon}
                      </span>
                      <span className="font-mono font-medium text-foreground">
                        {t.amount}
                      </span>
                      <span className="text-[10px] text-muted">{t.symbol}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Action footer */}
            <div className="mt-6 flex items-center gap-2 border-t border-border pt-4">
              <button
                onClick={onTransfer}
                className="flex-1 rounded-xl border border-border bg-white py-1.5 text-xs font-medium text-foreground transition-colors hover:border-brand-300 hover:bg-brand-50/50"
              >
                Send
              </button>
              <button
                onClick={onReceive}
                className="flex-1 rounded-xl bg-brand-50 py-1.5 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-100"
              >
                Receive
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
