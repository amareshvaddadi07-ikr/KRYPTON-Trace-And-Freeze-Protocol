"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  FileText,
  Download,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Zap,
  RefreshCw,
  AlertTriangle,
  Lock,
  Sparkles,
  Landmark,
  Clock,
  ChevronRight,
  Check,
  Copy,
  Mail,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import downloadKryptonPDF from "@/lib/krypton-pdf";
import BankLienCard from "@/components/bank-lien-card";
import ForensicReport from "@/components/forensic-report";
import VaspFreezeCard from "@/components/vasp-freeze-card";

// Dynamic import for React Flow TracingGraph with ssr: false
const TracingGraph = dynamic(() => import("@/components/TracingGraph"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-white font-mono text-xs text-[#6B7280]">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-[#FF6B1A] animate-ping" />
        <span>Loading Neural Graph Canvas...</span>
      </div>
    </div>
  ),
});

// Mock 4 transaction hops (together with source node = exactly 5 nodes popping in sequence)
const MOCK_TRANSACTIONS = [
  {
    hash: "0x92a019b8830fe4177d619cf8d123a45e9981290bbce",
    from: "TQa9s3...bE",
    to: "Transit_01",
    to_address: "Transit_01",
    value: "250000",
    feeTrx: 1.2,
  },
  {
    hash: "0x81b930cefe8910471b831920ac3910bbce921820491",
    from: "Transit_01",
    to: "SunSwap_LP",
    to_address: "SunSwap_LP",
    value: "250000",
    feeTrx: 1.2,
  },
  {
    hash: "0x72c199ae1280fc47182901abcf8910acb9201948",
    from: "SunSwap_LP",
    to: "Cluster_03",
    to_address: "Cluster_03",
    value: "250000",
    feeTrx: 1.2,
  },
  {
    hash: "0x3f5c921e102948bbce1092837482910bbce39182092",
    from: "Cluster_03",
    to: "Binance_Hot",
    to_address: "Binance_Hot",
    value: "250000",
    feeTrx: 1.2,
  },
];

const STATUTORY_STAGES = [
  {
    step: 0,
    timer: "0-30m",
    label: "91 CrPC Sent",
    statute: "Section 91 CrPC Production Requisition",
    status: "DISPATCHED",
    detail: "Emergency notice served directly to Binance Law Enforcement portal demanding immediate debit restriction on hot deposit.",
    logic: "Awaiting compliance officer confirmation; auto-escalates if SLA expires.",
  },
  {
    step: 1,
    timer: "30m",
    label: "94 BNSS Threat",
    statute: "Section 94 BNSS & Section 211 BNS Summons",
    status: "PENAL NOTICE",
    detail: "Statutory penal escalation warning issued under 211 BNS (obstruction) with immediate summons requisition.",
    logic: "Dispatched to registered Indian nodal compliance officers + CC to cyber cell.",
  },
  {
    step: 2,
    timer: "2h",
    label: "FIU-IND Alert",
    statute: "FIU-IND Suspicious Transaction Report (STR)",
    status: "SYNCED",
    detail: "Suspicious Activity Report transmitted across FIU-IND network and 42 connected NCRP cybercrime investigation units.",
    logic: "Automated freeze lock broadcast to all FIU-registered domestic exchanges.",
  },
  {
    step: 3,
    timer: "24h",
    label: "PMLA 17 Draft",
    statute: "Section 17 PMLA & Section 106 BNSS Seizure",
    status: "COURT DRAFTED",
    detail: "Official seizure petition finalized for Special Cyber Court Magistrate with Exhibit-A neural graph evidence.",
    logic: "Cryptographic chain-of-custody hash submitted for judicial freezing seal.",
  },
  {
    step: 4,
    timer: "12-24h",
    label: "Bank Lien",
    statute: "Section 107 BNSS Automated Bank Lien",
    status: "LIEN ENFORCED",
    detail: "Automated API debit freeze placed with beneficiary partner bank under Section 107 BNSS for final victim restitution.",
    logic: "Immediate debit lock on connected Indian fiat banking rails (₹4.70 Lakhs).",
  },
];

const FORENSIC_CARDS = [
  { label: "Amount Slab", value: "₹4.7L cluster (20%)", sub: "Syndicate threshold" },
  { label: "Time Gap", value: "29.2 min", sub: "Rapid hop velocity" },
  { label: "Gas / Fee", value: "1.2 TRX", sub: "Standard energy burst" },
  { label: "Chain Match", value: "TRON USDT", sub: "TRC-20 protocol" },
  { label: "DEX Route", value: "SunSwap LP", sub: "Liquidity mixer pool" },
];

export default function DemoPage() {
  const [isTraced, setIsTraced] = useState(false);
  const [vaspFound, setVaspFound] = useState(false);
  const [freezeSent, setFreezeSent] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [copiedHash, setCopiedHash] = useState(false);
  const [bankLienPlaced, setBankLienPlaced] = useState(false);
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [modalStage, setModalStage] = useState<number>(0);
  const [stage1Triggered, setStage1Triggered] = useState(false);
  const [stage2Triggered, setStage2Triggered] = useState(false);
  const [stage3Triggered, setStage3Triggered] = useState(false);
  const [stage4Triggered, setStage4Triggered] = useState(false);
  const [copiedMailBody, setCopiedMailBody] = useState(false);

  // Statutory state machine: stage 0 to 4
  const [stage, setStage] = useState<number>(0);

  // Prefilled mock data as specified
  const [formData, setFormData] = useState({
    firNumber: "NCRP/2025/8847",
    wallet: "TQa9s3...bE",
    policeStation: "Cyber Delhi",
    firDate: "2026-03-19",
  });

  const staticTimestamp = "2026-03-19 11:22:00 UTC";
  const auditHash = "0x89f4b3...29c11";

  // Auto set isTraced true after 1 sec (No API call)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTraced(true);
      setVaspFound(true);
      setToastMessage("On-chain trace resolved • 5 Hops Mapped • VASP Identified");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      setTimeout(() => {
        const graphElement = document.getElementById("graph");
        if (graphElement) {
          graphElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 350);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleManualTrace = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsTraced(true);
    setVaspFound(true);
    setTimeout(() => {
      const graphElement = document.getElementById("graph");
      if (graphElement) {
        graphElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 200);
  };

  const handleReset = () => {
    setIsTraced(false);
    setVaspFound(false);
    setFreezeSent(false);
    setIsActive(false);
    setTimer(0);
    setModalStage(0);
    setStage1Triggered(false);
    setStage2Triggered(false);
    setStage3Triggered(false);
    setStage4Triggered(false);
    setIsMailModalOpen(false);
    setStage(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stage0Email = "compliance@binance.com";
  const stage0Subject = `Initial Freeze Request Under 91 CrPC - FIR ${formData.firNumber || "NCRP/2025/8847"}`;
  const stage0Body = `To Nodal Officer Binance, Reference FIR ${formData.firNumber || "NCRP/2025/8847"} Dt 19 Mar 2026, wallet TQa9f... flagged in 12.5L fraud. Request you to freeze under 91 CrPC and preserve logs. Reply within 30 mins.`;

  const stage1Email = "compliance@binance.com, legal@binance.com";
  const stage1Subject = `Non-Compliance Notice Under 94 BNSS Section - FIR ${formData.firNumber || "NCRP/2025/8847"}`;
  const stage1Body = `Despite 91 CrPC notice sent at 11:22 UTC, no action. This is 94 BNSS threat notice, failure to comply will lead to reporting to FIU-IND and MEITY blocking. Give 60 mins.`;

  const stage2Email = "fiu@fiuindia.gov.in";
  const stage2Cc = "compliance@binance.com";
  const stage2Subject = `FIU-IND Escalation - Suspicious Transaction Report - VASP Non-Compliance - FIR ${formData.firNumber || "NCRP/2025/8847"}`;
  const stage2Body = `Dear FIU Officer, VASP Binance not responding to 91 and 94 notices for wallet TQa9 12.5L fraud. Request to issue STR and enforce PMLA compliance. Wallet details, Tx hash attached. This is statutory escalation.`;

  const stage3Email = "ed-delhi@enforcementdirectorate.gov.in";
  const stage3Subject = `Provisional Attachment Draft Under Section 17 PMLA - FIR ${formData.firNumber || "NCRP/2025/8847"}`;
  const stage3Body = `Draft order for Provisional Attachment of virtual asset TQa9 under PMLA Sec 17 read with Sec 5. Grounds: proceeds of crime 12.5L, VASP non-cooperation, FIU escalation done. Request approval to attach. Amount 12.5L USDT. Police letterhead format.`;

  const stage4Email = "io@cybercrime.gov.in";
  const stage4Cc = "victim@email.com";
  const stage4Subject = `Asset Secured - Lien Placed Successfully - FIR ${formData.firNumber || "NCRP/2025/8847"}`;
  const stage4Body = `Lien placed on wallet TQa9 amount 12.5L secured at 11:22 UTC. Chain secured. Victim restitution process initiated. Case closed.`;

  // Open mail modal ONLY for stage 0 on freeze button click
  const handleFreezeNow = () => {
    if (stage === 0) {
      setModalStage(0);
      setIsMailModalOpen(true);
    }
  };

  // On Mark as Sent:
  // Stage 0: close modal, set isActive=true, start timer from 0
  // Stage 1/2/3: on Mark as Sent, stage stays active but timer continues
  const handleMarkAsSent = () => {
    setIsMailModalOpen(false);
    if (modalStage === 0) {
      setIsActive(true);
      setTimer(0);
      setStage(0);
      setFreezeSent(true);
      setToastMessage("Stage 0 91 CrPC Notice Marked as Sent • 30-min SLA Timer Started");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);

      setTimeout(() => {
        const legalElement = document.getElementById("legal");
        if (legalElement) {
          legalElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);
    } else if (modalStage === 1) {
      setStage(1);
      setToastMessage("Stage 1 94 BNSS Notice Marked as Sent • Statutory Timer Continuing");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } else if (modalStage === 2) {
      setStage(2);
      setToastMessage("Stage 2 FIU-IND STR Notice Marked as Sent • Syndication Active");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } else {
      setStage(3);
      setToastMessage("Stage 3 PMLA Attachment Draft Marked as Sent • Judicial Escalation Active");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText("0x89f4b301c29e1d88194a2b6f120e8b21ca03947b9e013f99a7102e3b4a229c11");
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  // Official Law Enforcement Requisition PDF generator
  const handleDownloadPdf = () => {
    downloadKryptonPDF("PMLA-Draft", "NCRP20258847", formData.wallet, "12.5L");
  };

  const currentStage = STATUTORY_STAGES[stage] || STATUTORY_STAGES[0];
  const progressPercent = ((stage + 1) / 5) * 100;

  return (
    <div
      suppressHydrationWarning
      className="relative min-h-screen w-full bg-[#FFFBF7] text-[#111111] selection:bg-[#FFEAD5] selection:text-[#FF6B1A] scroll-smooth"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-2xl border border-[#FFEAD5] bg-white px-5 py-3 shadow-[0_16px_50px_rgba(255,107,26,0.22)]"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FFF7ED] text-[#FF6B1A]">
              <Zap className="h-3.5 w-3.5" />
            </div>
            <span suppressHydrationWarning className="font-mono text-xs font-bold text-[#FF6B1A]">
              {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section
        suppressHydrationWarning
        className="relative min-h-screen flex flex-col justify-between overflow-hidden"
      >
        {/* Visible Video Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover opacity-90"
          >
            <source src="/bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#FFFBF7]/30 backdrop-brightness-95" />
        </div>

        {/* Top Nav */}
        <header
          suppressHydrationWarning
          className="relative z-10 w-full border-b border-[#FFEAD5]/80 bg-[#FFFBF7]/70 backdrop-blur-md"
        >
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
            {/* Left: KRYPTON logo + Demo indicator */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-1.5 select-none">
                <span className="text-xl font-bold tracking-wider text-[#111111]">
                  KRYPTON
                </span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B1A] animate-pulse" />
              </Link>
              <span className="rounded-md border border-[#FFEAD5] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#FF6B1A]">
                SPOC DEMO
              </span>
            </div>

            {/* Right: Timestamp and Back Link */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#FFEAD5] bg-white/95 px-4 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xs font-mono text-xs text-[#6B7280]">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>{staticTimestamp}</span>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-full border border-white bg-white/90 px-3.5 py-1.5 font-mono text-xs font-semibold text-black shadow-xs hover:bg-white hover:shadow-sm transition-all"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Live Mode</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Center Content */}
        <div
          suppressHydrationWarning
          className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 md:py-16"
        >
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-10">
            {/* Headline */}
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl sm:text-5xl md:text-[64px] font-bold tracking-tight leading-[1.08]">
                <span className="text-[#111111] block">Trace the untraceable.</span>
                <span className="text-[#FF6B1A] block">Freeze the unfreezable.</span>
              </h1>
              <p
                suppressHydrationWarning
                className="text-base sm:text-lg text-[#6B7280] font-normal tracking-normal pt-1"
              >
                Paste wallet. Find nearest VASP in 0.8s.
              </p>
            </div>

            {/* ONE Premium Card */}
            <div className="w-full text-left rounded-2xl md:rounded-3xl border border-[#FFEAD5] bg-white/95 backdrop-blur-md p-7 sm:p-9 md:p-10 shadow-[0_16px_50px_rgba(0,0,0,0.08)] transition-all">
              <form onSubmit={handleManualTrace} className="space-y-6">
                {/* Title */}
                <div className="border-b border-[#FFEAD5]/60 pb-5 flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold text-[#111111] tracking-tight">
                    Start Investigation with FIR Number
                  </h2>
                  <span
                    suppressHydrationWarning
                    className="font-mono text-[11px] text-[#FF6B1A] bg-[#FFF7ED] px-2.5 py-1 rounded-md border border-[#FFEAD5]"
                  >
                    Demo Environment
                  </span>
                </div>

                {/* Grid 2 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  {/* Field 1: FIR NUMBER */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                      FIR NUMBER
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formData.firNumber}
                      className="w-full rounded-xl border border-[#FFEAD5] bg-[#FFFBF7]/80 px-4 py-3 font-mono text-xs sm:text-sm text-[#111111] focus:outline-none"
                    />
                  </div>

                  {/* Field 2: WALLET ADDRESS (no long wallet address) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                        WALLET ADDRESS
                      </label>
                      <span className="font-mono text-[10px] text-emerald-600 font-semibold">
                        Sample Slice Verified
                      </span>
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={formData.wallet}
                      className="w-full rounded-xl border border-[#FFEAD5] bg-[#FFFBF7]/80 px-4 py-3 font-mono text-xs sm:text-sm text-[#111111] focus:outline-none"
                    />
                  </div>

                  {/* Field 3: POLICE STATION */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                      POLICE STATION
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formData.policeStation}
                      className="w-full rounded-xl border border-[#FFEAD5] bg-[#FFFBF7]/80 px-4 py-3 text-xs sm:text-sm text-[#111111] focus:outline-none"
                    />
                  </div>

                  {/* Field 4: STATIC TIMESTAMP */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                      STATIC TIMESTAMP
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={staticTimestamp}
                      className="w-full rounded-xl border border-[#FFEAD5] bg-[#FFFBF7]/80 px-4 py-3 font-mono text-xs sm:text-sm text-[#111111] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Bottom Right Big Orange Button */}
                <div className="flex items-center justify-between pt-3">
                  <span
                    suppressHydrationWarning
                    className="font-mono text-[11px] text-[#6B7280]"
                  >
                    Auto-tracing in progress...
                  </span>

                  <button
                    type="submit"
                    className="group relative inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#FF6B1A] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(255,107,26,0.22)] transition-all hover:bg-[#E55F17] hover:shadow-[0_12px_36px_rgba(255,107,26,0.3)] active:scale-[0.99]"
                  >
                    <span>Link FIR & Trace</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer
          suppressHydrationWarning
          className="relative z-10 w-full border-t border-[#FFEAD5]/60 bg-[#FFFBF7]/80 backdrop-blur-xs py-4"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-8 text-[11px] text-[#6B7280] font-mono">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>SPOC Sandbox • Static Audit Trail Verified</span>
            </div>
            <div>{staticTimestamp}</div>
          </div>
        </footer>
      </section>

      {/* Neural Graph Section (5 nodes popping animation with React Flow) */}
      <AnimatePresence>
        {isTraced && (
          <motion.section
            id="graph"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative min-h-screen w-full bg-white border-t border-[#FFEAD5] flex flex-col"
          >
            {/* Header info bar */}
            <div className="w-full border-b border-[#FFEAD5] bg-[#FFFBF7]/90 px-6 py-3 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-3">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                <span className="font-bold text-[#111111]">
                  5-NODE NEURAL TRACE • 0.8s RESOLUTION
                </span>
                <span className="text-[#6B7280] hidden sm:inline">
                  | Case: {formData.firNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-red-100 border border-red-200 text-red-700 px-2.5 py-0.5 font-bold font-mono">
                  82 High
                </span>
              </div>
            </div>

            {/* Graph Canvas with 5 nodes popping */}
            <div className="relative h-[70vh] sm:h-[75vh] w-full">
              <TracingGraph
                walletAddress={formData.wallet}
                firNumber={formData.firNumber}
                policeStation={formData.policeStation}
                transactions={MOCK_TRANSACTIONS}
                onReset={handleReset}
                onVaspFound={() => setVaspFound(true)}
              />
            </div>

            {/* Centered VASP FOUND CARD */}
            <AnimatePresence>
              {vaspFound && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full bg-[#FFFBF7] border-t border-[#FFEAD5] py-12 px-4 sm:px-6 lg:px-8"
                >
                  <VaspFreezeCard
                    currentStage={stage}
                    setCurrentStage={setStage}
                    timer={timer}
                    setTimer={setTimer}
                    isActive={isActive}
                    setIsActive={setIsActive}
                    formatTimer={formatTimer}
                    onOpenMailModal={(s) => {
                      setModalStage(s);
                      setIsMailModalOpen(true);
                    }}
                    onFreezeNow={handleFreezeNow}
                    onDownloadPmla={handleDownloadPdf}
                    onDownloadChainAnalysis={() =>
                      downloadKryptonPDF("Chain-Analysis", "NCRP20258847", formData.wallet, "12.5L")
                    }
                    wallet="Binance_0x3f5c..."
                    amount="₹4.70 Lakhs"
                    staticTimestamp={staticTimestamp}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Statutory State Machine with Fast Timers (After VASP Card) */}
            <div id="legal" className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8 border-t border-[#FFEAD5]">
              <div className="mx-auto max-w-5xl space-y-12">
                {/* State Machine Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#FFEAD5] pb-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#FFEAD5] bg-[#FFF7ED] px-3 py-1 font-mono text-xs font-bold text-[#FF6B1A]">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      <span>AUTONOMOUS SPOC STATE MACHINE</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
                      Statutory Legal Progression Protocol
                    </h2>
                    <p className="text-xs sm:text-sm text-[#6B7280]">
                      Live automated progression through 5 statutory states with rapid 3-second SPOC timer intervals.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#6B7280]">Current Stage:</span>
                    <span className="rounded-lg border border-[#FFEAD5] bg-[#FFFBF7] px-3 py-1.5 font-mono text-xs font-bold text-[#FF6B1A]">
                      Stage {stage} / 4 • {currentStage.label}
                    </span>
                  </div>
                </div>

                {/* Orange Filling Progress Bar */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#6B7280]">Protocol Completion</span>
                    <span className="font-bold text-[#FF6B1A]">{progressPercent.toFixed(0)}% Dispatched</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-[#FFEAD5]/70 p-0.5 overflow-hidden">
                    <motion.div
                      className="h-full bg-[#FF6B1A] rounded-full shadow-[0_0_12px_rgba(255,107,26,0.5)]"
                      initial={{ width: "20%" }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* 5 Stages Interactive Visual Pipeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                  {STATUTORY_STAGES.map((st, i) => {
                    const isCurrent = stage === i;
                    const isPassed = stage > i;

                    return (
                      <div
                        key={st.step}
                        onClick={() => setStage(i)}
                        className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                          isCurrent
                            ? "border-[#FF6B1A] bg-[#FFFBF7] shadow-[0_8px_30px_rgba(255,107,26,0.18)] scale-[1.02]"
                            : isPassed
                            ? "border-emerald-300 bg-emerald-50/60"
                            : "border-[#FFEAD5] bg-white opacity-75 hover:opacity-100"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                              isCurrent
                                ? "bg-[#FF6B1A] text-white"
                                : isPassed
                                ? "bg-emerald-600 text-white"
                                : "bg-[#FFF7ED] text-[#FF6B1A] border border-[#FFEAD5]"
                            }`}
                          >
                            {st.timer}
                          </span>
                          {isPassed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : isCurrent ? (
                            <span className="h-2 w-2 rounded-full bg-[#FF6B1A] animate-ping" />
                          ) : (
                            <Clock className="h-3.5 w-3.5 text-[#6B7280]" />
                          )}
                        </div>

                        <div className="font-bold text-sm text-[#111111]">{st.label}</div>
                        <div className="text-[10px] font-mono text-[#6B7280] mt-1 truncate">
                          {st.statute}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Active State Detail Card */}
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl md:rounded-3xl border border-[#FFEAD5] bg-[#FFFBF7] p-6 sm:p-8 shadow-soft space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FFEAD5] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#FF6B1A]">
                        <Zap className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#FF6B1A]">
                          ACTIVE LEGAL DIRECTIVE • STAGE {stage}
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-[#111111]">
                          {currentStage.statute}
                        </h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#6B7280]">Status:</span>
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 font-mono text-xs font-bold text-emerald-700">
                        {currentStage.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                    {currentStage.detail}
                  </p>

                  <div className="rounded-xl border border-[#FFEAD5] bg-white p-3.5 font-mono text-xs text-[#111111] flex items-center justify-between">
                    <div>
                      <span className="text-[#6B7280]">Next Enforcement Step: </span>
                      <strong className="text-[#FF6B1A]">{currentStage.logic}</strong>
                    </div>
                    <div className="text-[11px] text-[#6B7280] hidden sm:block">
                      Ref: {formData.firNumber}
                    </div>
                  </div>
                </motion.div>

                {/* Unique Feature 1: Forensic 5 Cards with 100% Match 42 FIRs */}
                <div className="space-y-6 pt-6 border-t border-[#FFEAD5]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="h-2 w-2 rounded-full bg-[#FF6B1A]" />
                        <h3 className="text-lg sm:text-xl font-bold text-[#111111] tracking-tight">
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
                        100% Match • <span className="text-[#FF6B1A]">42 Linked FIRs</span>
                      </span>
                    </div>
                  </div>

                  {/* 5 Minimal Forensic Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                    {FORENSIC_CARDS.map((pat, i) => (
                      <div
                        key={i}
                        className="group rounded-2xl border border-[#FFEAD5] bg-[#FFFBF7] p-4 shadow-soft transition-all hover:border-[#FFD4AB] hover:bg-white"
                      >
                        <div className="text-[10px] font-mono font-medium uppercase tracking-wider text-[#6B7280]">
                          {pat.label}
                        </div>
                        <div className="mt-2 font-mono text-sm sm:text-base font-bold text-[#111111]">
                          {pat.value}
                        </div>
                        <div className="mt-1 text-[10px] font-mono text-[#6B7280] group-hover:text-[#FF6B1A]">
                          {pat.sub}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Unique Feature 2: UPI De-anonymization & Bank Lien Card */}
                <div className="space-y-6 pt-6 border-t border-[#FFEAD5]">
                  <BankLienCard
                    bankName="HDFC Bank"
                    accountNo="50100481920391"
                    txHash="0x89f4b301c29e1d88194a2b6f120e8b21ca03947b9e013f99a7102e3b4a229c11"
                    amount="₹4,70,000"
                    firNumber={formData.firNumber || "NCRP/2025/8847"}
                  />
                </div>

                {/* Unique Feature 3: Certified Forensic Dossier & VASP Statutory Notices */}
                <div className="space-y-6 pt-6 border-t border-[#FFEAD5]">
                  <ForensicReport
                    caseData={{
                      firNo: formData.firNumber || "NCRP/2025/8847",
                      wallet: formData.wallet || "TQa9fC3a...",
                      riskScore: 92,
                      amount: "12.5L",
                      date: "19 Mar 2026 11:22 UTC",
                      io: "Inspector Cyber Cell",
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Stage 0 Mail Modal */}
      <AnimatePresence>
        {isMailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl rounded-2xl md:rounded-3xl border border-[#FFEAD5] bg-white p-6 sm:p-8 shadow-2xl space-y-6"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-[#FFEAD5] pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      modalStage === 4
                        ? "bg-emerald-50 text-emerald-700"
                        : modalStage === 3
                        ? "bg-indigo-50 text-indigo-700"
                        : modalStage === 2
                        ? "bg-purple-50 text-purple-700"
                        : modalStage === 1
                        ? "bg-red-50 text-red-600"
                        : "bg-[#FFF7ED] text-[#FF6B1A]"
                    }`}
                  >
                    {modalStage === 4 ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : modalStage === 3 ? (
                      <Landmark className="h-5 w-5" />
                    ) : modalStage === 2 ? (
                      <ShieldAlert className="h-5 w-5" />
                    ) : modalStage === 1 ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : (
                      <Mail className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                        modalStage === 4
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : modalStage === 3
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          : modalStage === 2
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : modalStage === 1
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : "bg-[#FFF7ED] text-[#FF6B1A]"
                      }`}
                    >
                      <span>
                        {modalStage === 4
                          ? "STAGE 4 LIEN PLACED • ASSET SECURED"
                          : modalStage === 3
                          ? "STAGE 3 PMLA ATTACHMENT"
                          : modalStage === 2
                          ? "STAGE 2 FIU-IND SYNDICATION"
                          : modalStage === 1
                          ? "STAGE 1 ENFORCEMENT THREAT"
                          : "STAGE 0 REQUISITION"}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#111111]">
                      {modalStage === 4
                        ? "Asset Secured - Lien Placed Successfully"
                        : modalStage === 3
                        ? "Provisional Attachment Draft Under Section 17 PMLA"
                        : modalStage === 2
                        ? "FIU-IND Escalation - Suspicious Transaction Report"
                        : modalStage === 1
                        ? "Non-Compliance Notice Under 94 BNSS Section"
                        : "Initial Freeze Request Under 91 CrPC"}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMailModalOpen(false)}
                  className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#FFF7ED] hover:text-[#FF6B1A] transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Template Content */}
              <div className="space-y-4 font-mono text-xs">
                {/* To Field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                    To
                  </label>
                  <div className="flex items-center justify-between rounded-xl border border-[#FFEAD5] bg-[#FFFBF7] px-4 py-2.5 font-semibold text-[#111111]">
                    <span>
                      {modalStage === 4
                        ? stage4Email
                        : modalStage === 3
                        ? stage3Email
                        : modalStage === 2
                        ? stage2Email
                        : modalStage === 1
                        ? stage1Email
                        : stage0Email}
                    </span>
                    <span
                      className={`rounded bg-white px-2 py-0.5 text-[10px] border ${
                        modalStage === 4
                          ? "text-emerald-700 border-emerald-200"
                          : modalStage === 3
                          ? "text-indigo-700 border-indigo-200"
                          : modalStage === 2
                          ? "text-purple-700 border-purple-200"
                          : modalStage === 1
                          ? "text-red-600 border-red-200"
                          : "text-[#FF6B1A] border-[#FFEAD5]"
                      }`}
                    >
                      {modalStage === 4
                        ? "Investigating Officer (IO)"
                        : modalStage === 3
                        ? "ED Cyber Cell"
                        : modalStage === 2
                        ? "FIU-IND Gateway"
                        : modalStage === 1
                        ? "Compliance + Legal"
                        : "Nodal Desk"}
                    </span>
                  </div>
                </div>

                {/* CC Field for Stage 2 & Stage 4 */}
                {(modalStage === 2 || modalStage === 4) && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                      CC
                    </label>
                    <div className="flex items-center justify-between rounded-xl border border-[#FFEAD5] bg-[#FFFBF7] px-4 py-2.5 font-semibold text-[#111111]">
                      <span>{modalStage === 4 ? stage4Cc : stage2Cc}</span>
                      <span
                        className={`rounded bg-white px-2 py-0.5 text-[10px] border ${
                          modalStage === 4
                            ? "text-emerald-700 border-emerald-200"
                            : "text-purple-700 border-purple-200"
                        }`}
                      >
                        {modalStage === 4 ? "Victim Desk" : "Binance Compliance"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Subject Field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                    Subject
                  </label>
                  <div className="rounded-xl border border-[#FFEAD5] bg-[#FFFBF7] px-4 py-2.5 font-medium text-[#111111]">
                    {modalStage === 4
                      ? stage4Subject
                      : modalStage === 3
                      ? stage3Subject
                      : modalStage === 2
                      ? stage2Subject
                      : modalStage === 1
                      ? stage1Subject
                      : stage0Subject}
                  </div>
                </div>

                {/* Body Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                      Body
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          modalStage === 4
                            ? stage4Body
                            : modalStage === 3
                            ? stage3Body
                            : modalStage === 2
                            ? stage2Body
                            : modalStage === 1
                            ? stage1Body
                            : stage0Body
                        );
                        setCopiedMailBody(true);
                        setTimeout(() => setCopiedMailBody(false), 2000);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] text-[#6B7280] hover:text-[#FF6B1A] transition-colors"
                    >
                      {copiedMailBody ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="rounded-xl border border-[#FFEAD5] bg-[#FFFBF7] p-4 text-xs leading-relaxed text-[#111111] whitespace-pre-wrap selection:bg-[#FFEAD5]">
                    {modalStage === 4
                      ? stage4Body
                      : modalStage === 3
                      ? stage3Body
                      : modalStage === 2
                      ? stage2Body
                      : modalStage === 1
                      ? stage1Body
                      : stage0Body}
                  </div>
                </div>

                {/* SLA Notice */}
                <div
                  className={`flex items-center gap-2.5 rounded-xl border p-3 text-xs ${
                    modalStage === 4
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : modalStage === 3
                      ? "border-indigo-200 bg-indigo-50 text-indigo-800"
                      : modalStage === 2
                      ? "border-purple-200 bg-purple-50 text-purple-800"
                      : modalStage === 1
                      ? "border-red-200 bg-red-50 text-red-800"
                      : "border-amber-200 bg-amber-50/70 text-amber-800"
                  }`}
                >
                  <Clock
                    className={`h-4 w-4 shrink-0 ${
                      modalStage === 4
                        ? "text-emerald-600"
                        : modalStage === 3
                        ? "text-indigo-600"
                        : modalStage === 2
                        ? "text-purple-600"
                        : modalStage === 1
                        ? "text-red-600"
                        : "text-amber-600"
                    }`}
                  />
                  <span>
                    {modalStage === 4
                      ? `Timer stopped at ${formatTimer(timer)} • Judicial lien placed under Section 107 BNSS. Virtual asset recovery executed and restitution pipeline initiated.`
                      : modalStage === 3
                      ? "Section 17 PMLA read with Section 5 provisional judicial seizure requisition. Police letterhead format."
                      : modalStage === 2
                      ? "Statutory PMLA Section 17 & STR Alert transmission to FIU-IND and national exchange gateways."
                      : modalStage === 1
                      ? "Statutory 60-minute compliance notice under Section 94 BNSS & Section 211 BNS. Penal sanctions for obstruction."
                      : "Mandatory 30-minute response window under Section 91 CrPC. Marking as sent initiates the SLA timer."}
                  </span>
                </div>
              </div>

              {/* Action Buttons: For Stage 4, Send button only. For Stages 0-3, Send via Email & Mark as Sent */}
              {modalStage === 4 ? (
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#FFEAD5]">
                  <a
                    href={`mailto:${stage4Email}?cc=${encodeURIComponent(
                      stage4Cc
                    )}&subject=${encodeURIComponent(
                      stage4Subject
                    )}&body=${encodeURIComponent(stage4Body)}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-3 font-mono text-xs font-bold text-white shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:bg-emerald-700 active:scale-[0.98] transition-all"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Send via Email (mailto)</span>
                  </a>
                </div>
              ) : (
                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-3 border-t border-[#FFEAD5]">
                  {/* Button 1: Send via Email (mailto) */}
                  <a
                    href={
                      modalStage === 3
                        ? `mailto:${stage3Email}?subject=${encodeURIComponent(
                            stage3Subject
                          )}&body=${encodeURIComponent(stage3Body)}`
                        : modalStage === 2
                        ? `mailto:${stage2Email}?cc=${encodeURIComponent(
                            stage2Cc
                          )}&subject=${encodeURIComponent(
                            stage2Subject
                          )}&body=${encodeURIComponent(stage2Body)}`
                        : modalStage === 1
                        ? `mailto:${stage1Email.replace(/\s+/g, "")}?subject=${encodeURIComponent(
                            stage1Subject
                          )}&body=${encodeURIComponent(stage1Body)}`
                        : `mailto:${stage0Email}?subject=${encodeURIComponent(
                            stage0Subject
                          )}&body=${encodeURIComponent(stage0Body)}`
                    }
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#FFEAD5] bg-white px-5 py-3 font-mono text-xs font-bold text-[#111111] hover:bg-[#FFF7ED] hover:border-[#FFD4AB] transition-all shadow-xs"
                  >
                    <Mail className="h-4 w-4 text-[#FF6B1A]" />
                    <span>Send via Email (mailto)</span>
                  </a>

                  {/* Button 2: Mark as Sent */}
                  <button
                    type="button"
                    onClick={handleMarkAsSent}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B1A] px-6 py-3 font-mono text-xs font-bold text-white shadow-[0_4px_20px_rgba(255,107,26,0.3)] hover:bg-[#E55F17] hover:shadow-[0_6px_24px_rgba(255,107,26,0.4)] active:scale-[0.98] transition-all"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Mark as Sent</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
