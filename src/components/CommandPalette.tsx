"use client";

import React, { useState, useEffect } from "react";
import { Search, ArrowUpRight, ArrowDownLeft, Shield, Key, RefreshCw, X } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
}

export function CommandPalette({ isOpen, onClose, onAction }: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onAction("open_cmd");
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onAction]);

  if (!isOpen) return null;

  const actions = [
    { id: "transfer", title: "Initiate Instant Transfer", category: "Actions", icon: <ArrowUpRight className="h-4 w-4 text-brand-500" /> },
    { id: "deposit", title: "Generate Deposit Address (QR)", category: "Actions", icon: <ArrowDownLeft className="h-4 w-4 text-brand-500" /> },
    { id: "tab-vaults", title: "Jump to Treasury Vaults", category: "Navigation", icon: <Shield className="h-4 w-4 text-muted" /> },
    { id: "tab-streams", title: "Manage Continuous Payment Streams", category: "Navigation", icon: <RefreshCw className="h-4 w-4 text-muted" /> },
    { id: "tab-api", title: "View Secret Keys & Webhook Logs", category: "Developer", icon: <Key className="h-4 w-4 text-muted" /> },
  ];

  const filtered = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 backdrop-blur-xs pt-20 p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-white shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm text-foreground placeholder:text-muted focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded p-1 text-muted hover:bg-brand-50 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted">
              No matching commands or navigation items found.
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onAction(item.id);
                    onClose();
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-colors hover:bg-brand-50"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-background border border-border">
                      {item.icon}
                    </div>
                    <span className="font-medium text-foreground">{item.title}</span>
                  </div>
                  <span className="font-mono text-[10px] text-muted uppercase">
                    {item.category}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-background/50 px-4 py-2 text-[11px] text-muted">
          <span>Navigate with ⌘K</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
