"use client";

import React, { useState } from "react";
import { Play, Pause, Plus, Clock, ArrowUpRight, Zap, CheckCircle } from "lucide-react";
import { formatAddress } from "@/lib/utils";

interface StreamItem {
  id: string;
  recipient: string;
  recipientAddress: string;
  streamRate: string;
  streamedAmount: string;
  totalCap: string;
  progress: number;
  status: "active" | "paused" | "completed";
  token: string;
}

const mockStreams: StreamItem[] = [
  {
    id: "s-1",
    recipient: "Lead Infrastructure Engineers",
    recipientAddress: "0x892a019481920381029481029481029481029481",
    streamRate: "0.0048 USDC/sec",
    streamedAmount: "$14,820.00",
    totalCap: "$25,000.00",
    progress: 59.2,
    status: "active",
    token: "USDC",
  },
  {
    id: "s-2",
    recipient: "Frontend & Design Retainer",
    recipientAddress: "0x44c1029481029481029481029481029481029481",
    streamRate: "0.0019 USDC/sec",
    streamedAmount: "$8,190.00",
    totalCap: "$12,000.00",
    progress: 68.2,
    status: "active",
    token: "USDC",
  },
  {
    id: "s-3",
    recipient: "Validator Node Staking Subsidy",
    recipientAddress: "0x12a0194810294810294810294810294810294810",
    streamRate: "0.00012 SOL/sec",
    streamedAmount: "45.20 SOL",
    totalCap: "50.00 SOL",
    progress: 90.4,
    status: "paused",
    token: "SOL",
  },
];

export function StreamsPayouts() {
  const [streams, setStreams] = useState<StreamItem[]>(mockStreams);

  const toggleStream = (id: string) => {
    setStreams((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            status: s.status === "active" ? "paused" : "active",
          };
        }
        return s;
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Continuous Payment Streams
          </h2>
          <p className="text-xs text-muted">
            By-the-second automated salary and contractor settlements via smart contracts.
          </p>
        </div>

        <button className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-3.5 py-2 text-xs font-medium text-white shadow-soft transition-all hover:bg-brand-600 hover:shadow-soft-hover">
          <Plus className="h-3.5 w-3.5" />
          <span>New Stream Contract</span>
        </button>
      </div>

      <div className="space-y-3">
        {streams.map((stream) => (
          <div
            key={stream.id}
            className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-white p-5 shadow-soft transition-all hover:border-brand-200 md:flex-row md:items-center"
          >
            {/* Left Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground">
                  {stream.recipient}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    stream.status === "active"
                      ? "bg-brand-50 text-brand-600 border border-brand-100"
                      : "bg-background text-muted border border-border"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      stream.status === "active" ? "bg-brand-500 animate-pulse" : "bg-muted"
                    }`}
                  />
                  {stream.status.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted">
                <span className="font-mono">{formatAddress(stream.recipientAddress, 6)}</span>
                <span>•</span>
                <span className="font-mono font-medium text-brand-600">
                  {stream.streamRate}
                </span>
              </div>
            </div>

            {/* Middle Progress Bar */}
            <div className="w-full md:max-w-xs space-y-1.5">
              <div className="flex justify-between font-mono text-[11px] text-muted">
                <span>
                  Streamed: <strong className="text-foreground">{stream.streamedAmount}</strong>
                </span>
                <span>Cap: {stream.totalCap}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-brand-50 border border-brand-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-500 transition-all duration-500"
                  style={{ width: `${stream.progress}%` }}
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleStream(stream.id)}
                className="flex items-center gap-1 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-brand-200 hover:bg-brand-50"
              >
                {stream.status === "active" ? (
                  <>
                    <Pause className="h-3 w-3 text-muted" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 text-brand-500" />
                    <span>Resume</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
