"use client";

import React, { useState } from "react";
import {
  Search,
  Bell,
  Wallet,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { formatAddress } from "@/lib/utils";

interface HeaderProps {
  onOpenTransfer: () => void;
  onOpenReceive: () => void;
  onOpenCommand: () => void;
}

export function Header({
  onOpenTransfer,
  onOpenReceive,
  onOpenCommand,
}: HeaderProps) {
  const [copied, setCopied] = useState(false);
  const [walletConnected, setWalletConnected] = useState(true);
  const primaryAddress = "0x7F89C4B631D12E99A302251e048B57F32a973B9A";

  const handleCopy = () => {
    navigator.clipboard.writeText(primaryAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand + Workspace */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500 shadow-sm transition-transform hover:scale-105">
              <div className="h-3 w-3 rounded-sm bg-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-foreground">
                Aether
              </span>
              <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-600 border border-brand-100">
                Mainnet
              </span>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-lg border border-border bg-white px-2.5 py-1 text-xs text-muted transition-colors hover:border-brand-200 md:flex">
            <Layers className="h-3.5 w-3.5 text-brand-500" />
            <span className="font-medium text-foreground">Apex Protocol</span>
            <ChevronDown className="h-3 w-3 text-muted" />
          </div>
        </div>

        {/* Center: Command Bar trigger */}
        <div className="hidden max-w-sm flex-1 px-8 md:block">
          <button
            onClick={onOpenCommand}
            type="button"
            className="group flex w-full items-center justify-between rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-muted shadow-sm transition-all hover:border-brand-300 hover:shadow-soft"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-muted transition-colors group-hover:text-brand-500" />
              <span>Search transactions, wallets, API logs...</span>
            </div>
            <kbd className="rounded border border-border bg-brand-50 px-1.5 py-0.5 font-mono text-[10px] text-muted-dark">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={onOpenReceive}
              className="rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-medium text-foreground transition-all hover:border-brand-300 hover:bg-brand-50/50 shadow-soft"
            >
              Deposit
            </button>
            <button
              onClick={onOpenTransfer}
              className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-3.5 py-2 text-xs font-medium text-white shadow-soft transition-all hover:bg-brand-600 hover:shadow-soft-hover"
            >
              <span>Transfer</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* Wallet Address Chip */}
          {walletConnected ? (
            <div className="flex items-center gap-1.5 rounded-xl border border-border bg-white p-1 shadow-soft">
              <button
                onClick={handleCopy}
                className="group flex items-center gap-2 rounded-lg px-2.5 py-1 text-xs font-mono transition-colors hover:bg-brand-50"
                title="Click to copy address"
              >
                <div className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
                <span className="font-mono text-xs text-foreground">
                  {formatAddress(primaryAddress, 4)}
                </span>
                {copied ? (
                  <Check className="h-3 w-3 text-brand-600" />
                ) : (
                  <Copy className="h-3 w-3 text-muted group-hover:text-brand-500" />
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setWalletConnected(true)}
              className="flex items-center gap-1.5 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-100"
            >
              <Wallet className="h-3.5 w-3.5" />
              <span>Connect</span>
            </button>
          )}

          {/* Notification Button */}
          <button
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white text-muted shadow-soft transition-all hover:border-brand-200 hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
