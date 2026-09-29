"use client";

import React, { useState } from "react";
import { Key, Copy, Check, Eye, EyeOff, Shield, RefreshCw, Terminal, ExternalLink } from "lucide-react";

export function ApiKeysView() {
  const [showSecret, setShowSecret] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const publishableKey = "krypton_pub_demo_09f84ba2849e0192847a019b847";
  const secretKey = "krypton_sec_demo_99847102948192038471920384710293";

  const handleCopy = (keyName: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            API Keys & Developer Webhooks
          </h2>
          <p className="text-xs text-muted">
            Authenticate programmatic payouts, listen to real-time blockchain settlement webhooks.
          </p>
        </div>

        <button className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-3.5 py-2 text-xs font-medium text-white shadow-soft transition-all hover:bg-brand-600 hover:shadow-soft-hover">
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Roll Keys</span>
        </button>
      </div>

      {/* API Key Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Publishable Key */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted uppercase tracking-wider">
              Publishable Key
            </span>
            <span className="rounded bg-brand-50 px-2 py-0.5 font-mono text-[10px] text-brand-600 border border-brand-100">
              Client-side Safe
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-background/60 p-3 font-mono text-xs">
            <span className="truncate text-foreground">{publishableKey}</span>
            <button
              onClick={() => handleCopy("pk", publishableKey)}
              className="ml-2 rounded p-1 text-muted transition-colors hover:text-brand-600"
              title="Copy publishable key"
            >
              {copiedKey === "pk" ? (
                <Check className="h-4 w-4 text-brand-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="mt-2 text-[11px] text-muted">
            Used in client frontend integrations to initialize payment widgets.
          </p>
        </div>

        {/* Secret Key */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted uppercase tracking-wider">
              Secret Key
            </span>
            <span className="rounded bg-amber-50 px-2 py-0.5 font-mono text-[10px] text-amber-700 border border-amber-200">
              Confidential
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-background/60 p-3 font-mono text-xs">
            <span className="truncate text-foreground">
              {showSecret ? secretKey : "sk_live_••••••••••••••••••••••••••••"}
            </span>
            <div className="ml-2 flex items-center gap-1">
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="rounded p-1 text-muted transition-colors hover:text-brand-600"
                title={showSecret ? "Hide secret" : "Reveal secret"}
              >
                {showSecret ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => handleCopy("sk", secretKey)}
                className="rounded p-1 text-muted transition-colors hover:text-brand-600"
                title="Copy secret key"
              >
                {copiedKey === "sk" ? (
                  <Check className="h-4 w-4 text-brand-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-muted">
            Grants full administrative access. Never commit this to public repositories.
          </p>
        </div>
      </div>

      {/* Webhook Endpoints */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Active Webhook Endpoints
            </h3>
            <p className="text-xs text-muted">
              Events dispatched with HMAC-SHA256 signature verification.
            </p>
          </div>
          <button className="rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-brand-200 hover:bg-brand-50">
            + Add Endpoint
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {[
            {
              url: "https://api.linearprotocol.com/v1/webhooks/settlement",
              events: ["payment.settled", "transfer.initiated", "vault.rebalanced"],
              status: "Operational",
              rate: "100% (24,812 / 24,812)",
            },
            {
              url: "https://ops.apexfin.org/hooks/crypto-payout",
              events: ["stream.paused", "stream.threshold_reached"],
              status: "Operational",
              rate: "99.98% (4,102 / 4,103)",
            },
          ].map((endpoint, i) => (
            <div
              key={i}
              className="flex flex-col justify-between gap-3 rounded-xl border border-border bg-background/40 p-4 sm:flex-row sm:items-center"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold text-foreground">
                  <Terminal className="h-3.5 w-3.5 text-brand-500" />
                  <span>{endpoint.url}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {endpoint.events.map((ev) => (
                    <span
                      key={ev}
                      className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] text-muted-dark border border-border"
                    >
                      {ev}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-brand-600 font-medium">● {endpoint.status}</span>
                <span className="text-muted">{endpoint.rate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
