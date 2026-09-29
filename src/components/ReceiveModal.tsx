"use client";

import React, { useState } from "react";
import { X, Copy, Check, QrCode, ShieldCheck } from "lucide-react";
import { formatAddress } from "@/lib/utils";

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReceiveModal({ isOpen, onClose }: ReceiveModalProps) {
  const [copied, setCopied] = useState(false);
  const [selectedChain, setSelectedChain] = useState("Solana");
  const depositAddress = "0x7F89C4B631D12E99A302251e048B57F32a973B9A";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-dropdown">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-lg p-1 text-muted transition-colors hover:bg-brand-50 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 border border-brand-100">
            <QrCode className="h-6 w-6" />
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground">
              Deposit to Vault
            </h3>
            <p className="text-xs text-muted">
              Select network and send tokens to your dedicated multi-chain deposit address.
            </p>
          </div>

          {/* Chain Selector */}
          <div className="flex justify-center gap-1.5 rounded-xl border border-border bg-brand-50/50 p-1">
            {["Solana", "Base", "Ethereum", "Arbitrum"].map((chain) => (
              <button
                key={chain}
                onClick={() => setSelectedChain(chain)}
                className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-medium transition-all ${
                  selectedChain === chain
                    ? "bg-white text-brand-600 shadow-sm border border-border"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {chain}
              </button>
            ))}
          </div>

          {/* Clean Stylized QR Code Frame */}
          <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl border-2 border-dashed border-brand-200 bg-background p-4">
            <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-white p-2 shadow-xs border border-border">
              {/* Minimal SVG QR Pattern */}
              <svg className="h-32 w-32 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h-2v2h2v-2zm-4 0h2v2h-2v-2zm0 4h2v2h-2v-2zm4 0h2v2h-2v-2zm2-2h2v2h-2v-2zm-6-4h2v2h-2v-2zm6-4h2v2h-2v-2z" />
              </svg>
            </div>
          </div>

          {/* Address Box */}
          <div className="space-y-1.5 text-left">
            <label className="block text-[11px] font-medium text-muted uppercase tracking-wider">
              {selectedChain} Vault Address
            </label>
            <div className="flex items-center justify-between rounded-xl border border-border bg-background p-2.5">
              <span className="font-mono text-xs text-foreground truncate mr-2">
                {depositAddress}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-600"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-brand-50/60 p-3 text-left border border-brand-100/60">
            <ShieldCheck className="h-4 w-4 text-brand-600 shrink-0" />
            <span className="text-[11px] text-muted-dark">
              Automated smart-contract routing instantly allocates incoming balance.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
