"use client";

import React, { useState } from "react";
import { X, ExternalLink, Copy, Check, ShieldCheck, ArrowDownLeft, ArrowUpRight, Clock } from "lucide-react";
import { Transaction } from "./TransactionsTable";
import { formatAddress } from "@/lib/utils";

interface TransactionDrawerProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export function TransactionDrawer({ transaction, onClose }: TransactionDrawerProps) {
  const [copied, setCopied] = useState<string | null>(null);

  if (!transaction) return null;

  const handleCopy = (field: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/20 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white border-l border-border shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
                  {transaction.type === "inflow" ? (
                    <ArrowDownLeft className="h-4 w-4" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Transaction Details
                  </h3>
                  <p className="font-mono text-xs text-muted">
                    {transaction.timestamp}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted transition-colors hover:bg-brand-50 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Amount Banner */}
            <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50/50 p-5 text-center">
              <div className="font-mono text-3xl font-bold tracking-tight text-foreground">
                {transaction.type === "inflow" ? "+" : "-"}
                {transaction.amount.toLocaleString()} {transaction.token}
              </div>
              <div className="font-mono text-xs text-muted mt-1">
                {transaction.amountUsd}
              </div>
            </div>

            {/* Details List */}
            <div className="mt-6 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="text-muted">Status</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 font-medium text-brand-600 border border-brand-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                  {transaction.status.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="text-muted">Network</span>
                <span className="font-mono text-foreground font-medium">
                  {transaction.chain}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="text-muted">Network Gas Fee</span>
                <span className="font-mono text-foreground">{transaction.fee}</span>
              </div>

              {/* Tx Hash */}
              <div className="space-y-1.5 border-b border-border/60 pb-3">
                <span className="text-muted">Transaction Hash</span>
                <div className="flex items-center justify-between rounded-xl border border-border bg-background/70 p-2 font-mono text-[11px]">
                  <span className="truncate mr-2 text-foreground">
                    {transaction.hash}
                  </span>
                  <button
                    onClick={() => handleCopy("hash", transaction.hash)}
                    className="p-1 text-muted hover:text-brand-600"
                  >
                    {copied === "hash" ? (
                      <Check className="h-3.5 w-3.5 text-brand-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Counterparty */}
              <div className="space-y-1.5">
                <span className="text-muted">Counterparty / Pool</span>
                <div className="rounded-xl border border-border bg-background/70 p-2 font-mono text-xs text-foreground">
                  {transaction.counterparty}
                </div>
              </div>
            </div>
          </div>

          {/* Explorer CTA */}
          <div className="pt-6 border-t border-border">
            <a
              href={`https://solscan.io/tx/${transaction.hash}`}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-white py-2.5 text-xs font-medium text-foreground transition-all hover:border-brand-300 hover:bg-brand-50/50 shadow-soft"
            >
              <span>View On Chain Explorer</span>
              <ExternalLink className="h-3.5 w-3.5 text-brand-500" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
