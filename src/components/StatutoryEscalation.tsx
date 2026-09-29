"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  FileCheck,
  AlertTriangle,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Search,
  Zap,
  Building,
  CreditCard,
  Layers,
  FileText,
  Lock,
  Landmark,
} from "lucide-react";
import { formatAddress } from "@/lib/utils";

interface StatutoryEscalationProps {
  firNumber: string;
  walletAddress: string;
  policeStation: string;
  isActive?: boolean;
  timer?: number;
  currentStage?: number;
}

export function StatutoryEscalation({
  firNumber,
  walletAddress,
  policeStation,
  isActive = true,
  timer = 0,
  currentStage = 0,
}: StatutoryEscalationProps) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [upiFreezeTriggered, setUpiFreezeTriggered] = useState(false);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const staticAuditTimestamp = "2026-03-19 11:22:00 UTC";
  const auditHash = "0x89f4b301c29e1d88194a2b6f120e8b21ca03947b9e013f99a7102e3b4a229c11";

  const handleCopyHash = () => {
    navigator.clipboard.writeText(auditHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const states = [
    {
      step: "State 0",
      time: "0-30m",
      title: "91 CrPC Notice Request",
      status: currentStage > 0 ? "DISPATCHED" : isActive ? "ACTIVE" : "QUEUED",
      summary:
        "Emergency production notice issued directly to Binance Law Enforcement portal demanding immediate withdrawal freeze.",
      logic:
        "IF VASP response == null within 30m THEN escalate to State 1 with statutory penal notice u/s 211 BNS.",
    },
    {
      step: "State 1",
      time: "30m",
      title: "94 BNSS + 211 BNS Threat",
      status: currentStage > 1 ? "DISPATCHED" : currentStage === 1 && isActive ? "ACTIVE" : "QUEUED",
      summary:
        "Statutory penal warning invoking Section 211 BNS (obstruction of public servant) and Section 94 BNSS search warrant summons.",
      logic:
        "Direct email dispatch to nodal compliance officer + CC to Interpol New Delhi NCB desk.",
    },
    {
      step: "State 2",
      time: "2h",
      title: "FIU-IND STR/CTR Alert + NCRP Syndication",
      status: currentStage > 2 ? "DISPATCHED" : currentStage === 2 && isActive ? "ACTIVE" : "QUEUED",
      summary:
        "Suspicious Transaction Report (STR) payload transmitted to Financial Intelligence Unit (FIU-IND) across all registered Indian exchanges.",
      logic:
        "Syncs with NCRP (National Cyber Crime Portal) cluster database to lock matching beneficiary accounts.",
    },
    {
      step: "State 3",
      time: "24h",
      title: "106 BNSS + PMLA 17 Draft (Annexure-A)",
      status: currentStage > 3 ? "DISPATCHED" : currentStage === 3 && isActive ? "ACTIVE" : "QUEUED",
      summary:
        "Formal court requisition application under Section 106 BNSS and Section 17 PMLA with Neural Graph visual evidence annexed as Exhibit-A.",
      logic:
        "Submits court certified forensic chain-of-custody hash to Special Cyber Court Magistrate.",
    },
    {
      step: "State 4",
      time: "7 days",
      title: "Bank Lien API + 107 BNSS Seizure",
      status: currentStage === 4 ? "LIEN PLACED • ASSET SECURED" : "QUEUED",
      summary:
        "Direct automated API lien placement with nodal partner banks (SBI/HDFC/ICICI) under Section 107 BNSS for final recovery.",
      logic:
        "Enforces judicial debit freeze on linked Indian banking rails until court compounding order.",
    },
  ];

  const forensicPatterns = [
    { label: "Amount Slab", value: "₹4.7L cluster 20%", sub: "Syndicate threshold" },
    { label: "Time Gap", value: "29.2 min", sub: "Rapid hop velocity" },
    { label: "Gas Fee", value: "1.2 TRX", sub: "Standard energy burst" },
    { label: "Chain Match", value: "TRON USDT", sub: "TRC-20 protocol" },
    { label: "DEX Route", value: "SunSwap LP", sub: "Liquidity mixer pool" },
  ];

  return (
    <section id="legal" className="w-full bg-white py-20 md:py-24 border-t border-[#FFEAD5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#FFEAD5] pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFEAD5] bg-[#FFF7ED] px-3 py-1 font-mono text-xs font-semibold text-[#FF6B1A]">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Automated Legal Escalation Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
              Statutory Escalation State Machine
            </h2>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Autonomous legal progression protocol complying with Bharatiya Nagarik Suraksha Sanhita (BNSS), CrPC, and FIU-IND anti-money laundering frameworks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`rounded-xl border px-4 py-2.5 font-mono text-xs shadow-soft ${
                currentStage === 4
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : "border-[#FFEAD5] bg-[#FFFBF7] text-[#111111]"
              }`}
            >
              <span className={currentStage === 4 ? "text-emerald-700" : "text-[#6B7280]"}>
                Current Protocol:{" "}
              </span>
              <strong className={currentStage === 4 ? "text-emerald-700" : "text-[#FF6B1A]"}>
                {currentStage === 4
                  ? `State 4 (Lien Placed - Asset Secured • Stopped at ${formatTimer(timer)})`
                  : isActive
                  ? `State ${currentStage} (Active • ${formatTimer(timer)})`
                  : "State 0 (Pending)"}
              </strong>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Left Vertical Timeline (5 States) | Right Audit Log Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: 5 States Vertical Timeline (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center justify-between pb-2 border-b border-[#FFEAD5]/60">
              <h3 className="text-base font-bold text-[#111111] uppercase tracking-wider font-mono">
                Statutory Execution Timeline
              </h3>
              <span className="font-mono text-xs text-[#6B7280]">
                5 States Programmed
              </span>
            </div>

            <div className="relative border-l-2 border-[#FFEAD5] ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
              {states.map((st, idx) => {
                const isStateActive = idx === currentStage && isActive;
                const isStateCompleted = idx < currentStage || (idx === 4 && currentStage === 4);
                return (
                  <div key={idx} className="relative group">
                    {/* Circle Node on Timeline */}
                    <div
                      className={`absolute -left-[35px] sm:-left-[43px] top-1 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 transition-all ${
                        isStateActive
                          ? "border-[#FF6B1A] bg-[#FF6B1A] text-white shadow-[0_0_20px_rgba(255,107,26,0.35)]"
                          : isStateCompleted
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-[#FFEAD5] bg-white text-[#6B7280] group-hover:border-[#FF6B1A]"
                      }`}
                    >
                      <span className="font-mono text-xs font-bold">
                        {isStateCompleted ? "✓" : idx}
                      </span>
                    </div>

                    {/* State Card */}
                    <div className="rounded-2xl border border-[#FFEAD5] bg-white p-6 shadow-soft transition-all hover:border-[#FFD4AB] space-y-4">
                      {/* State Title & Timing */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#FF6B1A] bg-[#FFF7ED] px-2 py-0.5 rounded border border-[#FFEAD5]">
                            {st.step} • {st.time}
                          </span>
                          <h4 className="text-base font-bold text-[#111111]">
                            {st.title}
                          </h4>
                        </div>
                        <span
                          className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isStateActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse"
                              : isStateCompleted
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-[#FFFBF7] text-[#6B7280] border border-[#FFEAD5]"
                          }`}
                        >
                          {isStateActive ? `ACTIVE (${formatTimer(timer)})` : st.status}
                        </span>
                      </div>

                      <p className="text-xs text-[#6B7280] leading-relaxed">
                        {st.summary}
                      </p>

                      {/* LOGIC SPECIFICATION box in #FFF7ED */}
                      <div className="rounded-xl border border-[#FFEAD5] bg-[#FFF7ED] p-3.5 space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#FF6B1A] uppercase tracking-wider">
                          <Zap className="h-3 w-3" />
                          <span>LOGIC SPECIFICATION</span>
                        </div>
                        <p className="font-mono text-xs text-[#111111]">
                          {st.logic}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Audit Log Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-28 rounded-2xl md:rounded-3xl border border-[#FFEAD5] bg-[#FFFBF7] p-7 shadow-soft space-y-6">
              {/* Audit Header */}
              <div className="border-b border-[#FFEAD5] pb-5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#FF6B1A] bg-white px-2 py-0.5 rounded border border-[#FFEAD5]">
                    IMMUTABLE AUDIT LOG
                  </span>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-[#111111] pt-1">
                  Stage 0 Preliminary 91 CrPC Issued to VASP Node
                </h3>
              </div>

              {/* Timestamp & Metadata (Static strings, NO new Date() to avoid hydration) */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-[#FFEAD5]">
                  <span className="text-[#6B7280]">Dispatch Timestamp:</span>
                  <span suppressHydrationWarning className="font-bold text-[#111111]">
                    {staticAuditTimestamp}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-[#FFEAD5]">
                  <span className="text-[#6B7280]">Target Legal Entity:</span>
                  <span className="font-bold text-[#111111]">Binance Holdings Ltd</span>
                </div>

                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-[#FFEAD5]">
                  <span className="text-[#6B7280]">Issuing Station:</span>
                  <span className="font-medium text-[#111111]">{policeStation}</span>
                </div>

                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-[#FFEAD5]">
                  <span className="text-[#6B7280]">FIR Case Reference:</span>
                  <span className="font-bold text-[#FF6B1A]">{firNumber}</span>
                </div>
              </div>

              {/* Cryptographic Hash with Copy */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#6B7280]">
                  Cryptographic Chain Hash
                </span>
                <div className="flex items-center justify-between rounded-xl border border-[#FFEAD5] bg-white p-3 font-mono text-xs">
                  <span suppressHydrationWarning className="truncate text-[#111111] mr-2">
                    {auditHash}
                  </span>
                  <button
                    onClick={handleCopyHash}
                    className="p-1 rounded text-[#6B7280] hover:text-[#FF6B1A] hover:bg-[#FFF7ED] transition-colors"
                    title="Copy audit hash"
                  >
                    {copiedHash ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* SLA Response Countdown */}
              <div className="rounded-2xl border border-[#FFEAD5] bg-white p-4 text-xs font-mono space-y-2">
                <div className="flex justify-between text-[#6B7280]">
                  <span>
                    {currentStage === 0
                      ? "Stage 0 (91 CrPC) SLA:"
                      : currentStage === 1
                      ? "Stage 1 (94 BNSS) SLA:"
                      : currentStage === 2
                      ? "Stage 2 (FIU-IND STR) SLA:"
                      : "Stage 3 (PMLA 17 Draft) SLA:"}
                  </span>
                  <span className="font-bold text-[#FF6B1A]">
                    {currentStage === 0
                      ? `${Math.max(0, 29 - Math.floor(timer / 60))}m ${Math.max(0, 59 - (timer % 60))}s remaining`
                      : currentStage === 1
                      ? "60m Statutory Summons Active"
                      : currentStage === 2
                      ? "2h Syndication Window Active"
                      : "24h Judicial Attachment Window"}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-[#6B7280]">
                  <span>Active Elapsed Timer:</span>
                  <span className="font-semibold text-emerald-600">
                    {formatTimer(timer)} {currentStage > 0 ? `(Stage ${currentStage} Active)` : "/ 30:00 SLA"}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#FFF7ED] border border-[#FFEAD5] overflow-hidden">
                  <div
                    className="h-full bg-[#FF6B1A] rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.max(6, ((timer % 1800) / 1800) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unique Section 1: Forensic Pattern Match (5 Minimal Cards + 100% Match Badge) */}
        <div className="space-y-6 pt-10 border-t border-[#FFEAD5]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-[#FF6B1A]" />
                <h3 className="text-xl font-bold text-[#111111] tracking-tight">
                  Forensic Pattern Match & Syndicate Clustering
                </h3>
              </div>
              <p className="text-xs text-[#6B7280]">
                Neural heuristics comparing on-chain transaction traits with 14,000+ investigated FIR ledgers.
              </p>
            </div>

            {/* 100% Match 42 similar NCRP cases badge */}
            <div className="inline-flex items-center gap-2 rounded-2xl border border-[#FFEAD5] bg-[#FFF7ED] px-4 py-2 shadow-soft">
              <Sparkles className="h-4 w-4 text-[#FF6B1A]" />
              <span className="font-mono text-xs font-bold text-[#111111]">
                100% Match • <span className="text-[#FF6B1A]">42 similar NCRP cases</span>
              </span>
            </div>
          </div>

          {/* 5 Minimal Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {forensicPatterns.map((pat, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-[#FFEAD5] bg-[#FFFBF7] p-5 shadow-soft transition-all hover:border-[#FFD4AB] hover:bg-white"
              >
                <div className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#6B7280]">
                  {pat.label}
                </div>
                <div className="mt-2 font-mono text-base sm:text-lg font-bold text-[#111111]">
                  {pat.value}
                </div>
                <div className="mt-1 text-[11px] font-mono text-[#6B7280] group-hover:text-[#FF6B1A]">
                  {pat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unique Section 2: UPI De-anonymization Card */}
        <div className="space-y-6 pt-10 border-t border-[#FFEAD5]">
          <div className="rounded-2xl md:rounded-3xl border border-[#FFEAD5] bg-[#FFFBF7] p-7 sm:p-9 shadow-soft space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FFEAD5] pb-5">
              <div className="space-y-1">
                <span className="font-mono text-[10px] font-bold text-[#FF6B1A] uppercase tracking-wider bg-white px-2.5 py-0.5 rounded border border-[#FFEAD5]">
                  P2P ON-RAMP RECONSTRUCTION
                </span>
                <h3 className="text-xl font-bold text-[#111111] tracking-tight">
                  Extract UPI from WazirX / Binance trade history &rarr; Bank Lien
                </h3>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 font-mono text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>NPCI Gateway Active</span>
              </span>
            </div>

            {/* Mapping Pipeline (WazirX Order -> UPI Handle -> Beneficiary Account -> Instant Bank Lien) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="rounded-xl border border-[#FFEAD5] bg-white p-4 space-y-1.5">
                <span className="text-[10px] text-[#6B7280] uppercase">1. P2P Order Reference</span>
                <div className="font-bold text-[#111111]">WZ-ORD-2026-9812A</div>
                <span className="text-[10px] text-[#6B7280]">WazirX / Binance P2P</span>
              </div>

              <div className="rounded-xl border border-[#FFEAD5] bg-white p-4 space-y-1.5">
                <span className="text-[10px] text-[#6B7280] uppercase">2. Extracted UPI VPA</span>
                <div className="font-bold text-[#FF6B1A]">apex-payouts@okhdfcbank</div>
                <span className="text-[10px] text-[#6B7280]">HDFC Bank Virtual ID</span>
              </div>

              <div className="rounded-xl border border-[#FFEAD5] bg-white p-4 space-y-1.5">
                <span className="text-[10px] text-[#6B7280] uppercase">3. Primary Bank Account</span>
                <div className="font-bold text-[#111111]">HDFC 50100492819201</div>
                <span className="text-[10px] text-[#6B7280]">IFSC: HDFC0000240</span>
              </div>

              <div className="rounded-xl border border-[#FFEAD5] bg-white p-4 space-y-1.5">
                <span className="text-[10px] text-[#6B7280] uppercase">4. Lien Status u/s 107 BNSS</span>
                <div className="font-bold text-emerald-600">Lien Ready (₹4,70,000)</div>
                <span className="text-[10px] text-[#6B7280]">Instant Debit Freeze</span>
              </div>
            </div>

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-[#6B7280]">
                Automated NPCI IMPS / UPI reverse trace maps blockchain off-ramp seller directly to Indian KYC account.
              </p>

              <button
                type="button"
                onClick={() => setUpiFreezeTriggered(true)}
                disabled={upiFreezeTriggered}
                className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B1A] px-6 py-3 text-xs font-semibold text-white shadow-soft hover:bg-[#E55F17] transition-all disabled:bg-emerald-600"
              >
                {upiFreezeTriggered ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Bank Lien Placed Successfully</span>
                  </>
                ) : (
                  <>
                    <Landmark className="h-4 w-4" />
                    <span>Place 107 BNSS Bank Lien (Instant)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
