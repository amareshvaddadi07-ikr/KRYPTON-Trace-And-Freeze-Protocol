"use client";

import React, { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Filter,
  Search,
} from "lucide-react";
import { formatAddress } from "@/lib/utils";

export interface Transaction {
  id: string;
  hash: string;
  type: "inflow" | "outflow" | "swap" | "stream";
  counterparty: string;
  token: string;
  amount: number;
  amountUsd: string;
  status: "settled" | "processing" | "escrowed";
  timestamp: string;
  fee: string;
  chain: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    hash: "0x89f4b301c29e1d88194a2b6f120e8b21ca03947b9e013f99a7102e3b4a229c11",
    type: "inflow",
    counterparty: "0x3e18...4f9a (Stripe Settlement Pool)",
    token: "USDC",
    amount: 145000.0,
    amountUsd: "$145,000.00",
    status: "settled",
    timestamp: "2 mins ago",
    fee: "$0.002",
    chain: "Solana",
  },
  {
    id: "tx-2",
    hash: "0x12a9c402d187b551029e81b674820a1ef10372691bca440938e210495f2a41dc",
    type: "outflow",
    counterparty: "0x91d3...88b2 (Linear Core Contributors)",
    token: "SOL",
    amount: 320.5,
    amountUsd: "$48,075.00",
    status: "settled",
    timestamp: "14 mins ago",
    fee: "$0.001",
    chain: "Solana",
  },
  {
    id: "tx-3",
    hash: "0x77c2e01b349f8261901a6b4e019385d82910fae108264850192e401b2a95c891",
    type: "stream",
    counterparty: "0xa841...912f (Continuous Payroll Batch #14)",
    token: "USDC",
    amount: 18200.0,
    amountUsd: "$18,200.00",
    status: "processing",
    timestamp: "32 mins ago",
    fee: "$0.004",
    chain: "Base",
  },
  {
    id: "tx-4",
    hash: "0x43b8d9102ca192738190184b29381048e910283719018247190182749102b481",
    type: "inflow",
    counterparty: "0x742d...44e" ,
    token: "ETH",
    amount: 14.8,
    amountUsd: "$39,220.00",
    status: "settled",
    timestamp: "1 hr ago",
    fee: "$1.40",
    chain: "Ethereum",
  },
  {
    id: "tx-5",
    hash: "0x9810283748291038274610293847102938471920384719203847192038471920",
    type: "swap",
    counterparty: "Apex Liquidity Router v3",
    token: "PYUSD",
    amount: 85000.0,
    amountUsd: "$85,000.00",
    status: "settled",
    timestamp: "2 hrs ago",
    fee: "$0.003",
    chain: "Solana",
  },
  {
    id: "tx-6",
    hash: "0x2849102847192038471920384719203847192038471920384719203847192038",
    type: "outflow",
    counterparty: "0x51b2...390a (AWS Cloud Reserves)",
    token: "USDC",
    amount: 12400.0,
    amountUsd: "$12,400.00",
    status: "settled",
    timestamp: "3 hrs ago",
    fee: "$0.002",
    chain: "Arbitrum",
  },
];

interface TransactionsTableProps {
  onSelectTx: (tx: Transaction) => void;
}

export function TransactionsTable({ onSelectTx }: TransactionsTableProps) {
  const [filterToken, setFilterToken] = useState<string>("ALL");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCopy = (e: React.MouseEvent, hash: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filtered = mockTransactions.filter((tx) => {
    const matchesToken = filterToken === "ALL" || tx.token === filterToken;
    const matchesSearch =
      tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.counterparty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.token.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesToken && matchesSearch;
  });

  return (
    <div className="rounded-2xl border border-border bg-white shadow-soft">
      {/* Table Header / Filters */}
      <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Activity Ledger
          </h2>
          <span className="rounded-full bg-brand-50 px-2 py-0.5 font-mono text-[11px] font-medium text-brand-600 border border-brand-100">
            {filtered.length} Live Records
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted" />
            <input
              type="text"
              placeholder="Filter by hash or wallet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 rounded-xl border border-border bg-background/50 pl-8 pr-3 text-xs text-foreground placeholder:text-muted focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Token Pills */}
          <div className="flex rounded-xl border border-border bg-brand-50/40 p-0.5">
            {["ALL", "USDC", "SOL", "ETH"].map((token) => (
              <button
                key={token}
                onClick={() => setFilterToken(token)}
                className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-medium transition-all ${
                  filterToken === token
                    ? "bg-white text-brand-600 shadow-sm border border-border/80"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {token}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border/60 bg-brand-50/20 text-[11px] font-medium uppercase tracking-wider text-muted">
              <th className="py-3.5 pl-6 pr-3">Type</th>
              <th className="px-3 py-3.5 font-mono">Transaction Hash</th>
              <th className="px-3 py-3.5">Counterparty</th>
              <th className="px-3 py-3.5 text-right font-mono">Amount</th>
              <th className="px-3 py-3.5">Network</th>
              <th className="px-3 py-3.5">Status</th>
              <th className="py-3.5 pl-3 pr-6 text-right">Age</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filtered.map((tx) => (
              <tr
                key={tx.id}
                onClick={() => onSelectTx(tx)}
                className="group cursor-pointer transition-colors hover:bg-brand-50/30"
              >
                {/* Type Icon */}
                <td className="py-4 pl-6 pr-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg border ${
                        tx.type === "inflow"
                          ? "border-brand-200 bg-brand-50 text-brand-600"
                          : tx.type === "stream"
                          ? "border-amber-200 bg-amber-50 text-amber-600"
                          : "border-border bg-white text-muted-dark"
                      }`}
                    >
                      {tx.type === "inflow" ? (
                        <ArrowDownLeft className="h-3.5 w-3.5" />
                      ) : tx.type === "stream" ? (
                        <RefreshCw className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <span className="font-medium capitalize text-foreground">
                      {tx.type}
                    </span>
                  </div>
                </td>

                {/* Hash with copy button */}
                <td className="px-3 py-4 font-mono text-muted-dark">
                  <div className="flex items-center gap-1.5">
                    <span>{formatAddress(tx.hash, 6)}</span>
                    <button
                      onClick={(e) => handleCopy(e, tx.hash)}
                      className="rounded p-1 text-muted transition-colors hover:bg-brand-100 hover:text-brand-600"
                      title="Copy transaction hash"
                    >
                      {copiedHash === tx.hash ? (
                        <Check className="h-3 w-3 text-brand-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </td>

                {/* Counterparty */}
                <td className="px-3 py-4 text-muted-dark font-medium">
                  {tx.counterparty}
                </td>

                {/* Amount */}
                <td className="px-3 py-4 text-right">
                  <div className="font-mono font-semibold text-foreground">
                    {tx.type === "inflow" ? "+" : "-"}
                    {tx.amount.toLocaleString()}{" "}
                    <span className="text-[11px] font-normal text-muted">
                      {tx.token}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-muted">
                    {tx.amountUsd}
                  </div>
                </td>

                {/* Chain badge */}
                <td className="px-3 py-4">
                  <span className="inline-flex items-center rounded-md border border-border bg-white px-2 py-0.5 font-mono text-[10px] text-muted-dark shadow-xs">
                    {tx.chain}
                  </span>
                </td>

                {/* Status */}
                <td className="px-3 py-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      tx.status === "settled"
                        ? "bg-brand-50 text-brand-600 border border-brand-100"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        tx.status === "settled" ? "bg-brand-500" : "bg-amber-500"
                      }`}
                    />
                    <span className="capitalize">{tx.status}</span>
                  </span>
                </td>

                {/* Age */}
                <td className="py-4 pl-3 pr-6 text-right font-mono text-muted">
                  {tx.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="flex items-center justify-between border-t border-border px-6 py-3.5 text-xs text-muted">
        <span>Showing 6 of 1,280 settled batches</span>
        <button className="flex items-center gap-1 font-medium text-brand-600 transition-colors hover:text-brand-700">
          <span>View Full Explorer</span>
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
