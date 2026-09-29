"use client";

import React, { useState } from "react";
import { X, ArrowUpRight, CheckCircle2, ChevronDown, AlertCircle } from "lucide-react";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TransferModal({ isOpen, onClose }: TransferModalProps) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("USDC");
  const [chain, setChain] = useState("Solana");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setRecipient("");
        setAmount("");
      }, 1600);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-dropdown">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-lg p-1 text-muted transition-colors hover:bg-brand-50 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 border border-brand-100">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Transfer Dispatched
            </h3>
            <p className="font-mono text-xs text-muted">
              {amount} {token} sent with sub-second finality.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                <ArrowUpRight className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Transfer Assets
                </h3>
                <p className="text-xs text-muted">
                  Instant settlement across verified liquidity bridges.
                </p>
              </div>
            </div>

            <form onSubmit={handleTransfer} className="space-y-4">
              {/* Recipient Address */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Recipient Address or ENS / SNS
                </label>
                <input
                  type="text"
                  required
                  placeholder="0x... or alice.sol"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/50 px-3.5 py-2.5 font-mono text-xs text-foreground placeholder:text-muted focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              {/* Amount and Token Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      step="any"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background/50 px-3.5 py-2.5 font-mono text-xs text-foreground placeholder:text-muted focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                    <button
                      type="button"
                      onClick={() => setAmount("50000")}
                      className="absolute right-2.5 top-2.5 rounded bg-brand-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-brand-600 border border-brand-100"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Asset
                  </label>
                  <select
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background/50 px-3 py-2.5 font-mono text-xs text-foreground focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  >
                    <option value="USDC">USDC</option>
                    <option value="SOL">SOL</option>
                    <option value="ETH">ETH</option>
                    <option value="PYUSD">PYUSD</option>
                  </select>
                </div>
              </div>

              {/* Destination Chain */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Route Network
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Solana", "Base", "Arbitrum"].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setChain(n)}
                      className={`rounded-xl border py-2 text-center font-mono text-xs font-medium transition-all ${
                        chain === n
                          ? "border-brand-500 bg-brand-50 text-brand-600"
                          : "border-border bg-white text-muted hover:border-brand-200"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fee Estimate */}
              <div className="rounded-xl border border-border bg-background/60 p-3 text-xs space-y-1">
                <div className="flex justify-between text-muted">
                  <span>Network Gas Fee</span>
                  <span className="font-mono text-foreground">~$0.0014</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Settlement Time</span>
                  <span className="font-mono text-brand-600 font-medium">&lt; 800ms</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-brand-50/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-5 py-2.5 text-xs font-medium text-white shadow-soft transition-all hover:bg-brand-600 hover:shadow-soft-hover disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Signing Transaction...</span>
                  ) : (
                    <>
                      <span>Confirm & Send</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
