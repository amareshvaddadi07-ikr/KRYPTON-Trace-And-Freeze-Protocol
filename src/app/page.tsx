"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  ArrowRight,
  Building2,
  FileText,
  Download,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Send,
  Zap,
  RefreshCw,
  AlertTriangle,
  Mail,
  X,
  Clock,
  Copy,
  Check,
  Landmark,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { StatutoryEscalation } from "@/components/StatutoryEscalation";
import downloadKryptonPDF from "@/lib/krypton-pdf";
import BankLienCard from "@/components/bank-lien-card";
import ForensicReport from "@/components/forensic-report";

// Dynamic import with ssr: false to avoid hydration mismatch
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

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTraced, setIsTraced] = useState(false);
  const [vaspFound, setVaspFound] = useState(false);
  const [freezeSent, setFreezeSent] = useState(false);
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [modalStage, setModalStage] = useState<number>(0);
  const [stage1Triggered, setStage1Triggered] = useState(false);
  const [stage2Triggered, setStage2Triggered] = useState(false);
  const [stage3Triggered, setStage3Triggered] = useState(false);
  const [stage4Triggered, setStage4Triggered] = useState(false);
  const [copiedMailBody, setCopiedMailBody] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [apiResult, setApiResult] = useState<{
    risk?: string;
    label?: string;
    score?: number;
    freezeAllowed?: boolean;
    transactions?: any[];
    error?: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    firNumber: "NCRP/2025/8847",
    wallet: "TQa9s3q4o1k9xL8v9A2qZ5yP0W2m7jK4bE",
    policeStation: "Cyber Police Station, Delhi",
    firDate: "07-09-2026",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Timer starting from 0 when Stage 0 is marked as sent
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prevElapsed) => {
          const elapsed = prevElapsed + 1;

          // if isActive and elapsed is 1800s (30m) and currentStage is 0 -> stage 1 mail
          if (currentStage === 0 && elapsed >= 1800) {
            console.log("Stage 1 time limit reached opening mail");
            setCurrentStage(1);
            setModalStage(1);
            setToastMessage("Stage 1 Unlocked: 94 BNSS Enforcement Threat Ready");
            setShowToast(true);
            setIsMailModalOpen(true);
          } else if (currentStage === 1 && elapsed >= 3600) {
            console.log("Stage 2 time limit reached opening mail");
            setCurrentStage(2);
            setModalStage(2);
            setToastMessage("Stage 2 Unlocked: FIU-IND Escalation Ready");
            setShowToast(true);
            setIsMailModalOpen(true);
          } else if (currentStage === 2 && elapsed >= 5400) {
            console.log("Stage 3 time limit reached opening mail");
            setCurrentStage(3);
            setModalStage(3);
            setToastMessage("Stage 3 Unlocked: Section 17 PMLA Provisional Attachment Ready");
            setShowToast(true);
            setIsMailModalOpen(true);
          } else if (currentStage === 3 && elapsed >= 7200) {
            console.log("Stage 4 time limit reached opening mail");
            setCurrentStage(4);
            setIsActive(false);
            setModalStage(4);
            setToastMessage("Lien Placed - Asset Secured");
            setShowToast(true);
            setIsMailModalOpen(true);
          }

          return elapsed;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, currentStage]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!mounted) return null;

  const isWalletValid = formData.wallet.trim().length >= 26;

  const handleLinkAndTrace = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const inputValue = formData.wallet.trim();
    if (!inputValue || inputValue.length < 26) return;

    setIsLoading(true);
    setError(null);
    setIsTraced(false);
    setVaspFound(false);
    setFreezeSent(false);

    try {
      const res = await fetch("/api/trace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: inputValue,
          walletAddress: inputValue,
          chain: inputValue.startsWith("T") ? "TRON" : "ETH",
          firNumber: formData.firNumber,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setToastMessage("Invalid wallet, try sample");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
        setIsLoading(false);
        setIsTraced(false);
        return;
      }

      setApiResult(data);
      setIsLoading(false);

      if (data.risk === "LOW") {
        setIsTraced(false);
      } else if (data.risk === "HIGH" || data.risk === "MEDIUM") {
        setIsTraced(true);
        setTimeout(() => {
          const graphElement = document.getElementById("graph");
          if (graphElement) {
            graphElement.scrollIntoView({ behavior: "smooth" });
          }
        }, 150);
      }
    } catch {
      setError("Network or API rate limit error");
      setToastMessage("Invalid wallet, try sample");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
      setIsLoading(false);
      setIsTraced(false);
    }
  };

  const handleReset = () => {
    setIsTraced(false);
    setVaspFound(false);
    setFreezeSent(false);
    setIsActive(false);
    setTimer(0);
    setCurrentStage(0);
    setModalStage(0);
    setStage1Triggered(false);
    setStage2Triggered(false);
    setStage3Triggered(false);
    setStage4Triggered(false);
    setIsMailModalOpen(false);
    setApiResult(null);
    setError(null);
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
    if (currentStage === 0) {
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
      setCurrentStage(0);
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
      setCurrentStage(1);
      setToastMessage("Stage 1 94 BNSS Notice Marked as Sent • Statutory Timer Continuing");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } else if (modalStage === 2) {
      setCurrentStage(2);
      setToastMessage("Stage 2 FIU-IND STR Notice Marked as Sent • Syndication Active");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } else {
      setCurrentStage(3);
      setToastMessage("Stage 3 PMLA Attachment Draft Marked as Sent • Judicial Escalation Active");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  // Generate 106 BNSS + PMLA 17 PDF Requisition with downloadKryptonPDF
  const handleDownloadPdf = () => {
    downloadKryptonPDF("PMLA-Draft", "NCRP20258847", formData.wallet, "12.5L");
  };

  return (
    <div
      suppressHydrationWarning
      className="relative min-h-screen w-full bg-[#FFFBF7] text-[#111111] selection:bg-[#FFEAD5] selection:text-[#FF6B1A] scroll-smooth"
    >
      {/* Toast Notification (Orange Error / State Toast) */}
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
              {toastMessage || "Invalid wallet / API limit - try sample wallet TQa9s3q4..."}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 100vh Centered Minimal Hero Section */}
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
            {/* Left: KRYPTON logo black + orange dot & SPOC Demo button */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 cursor-pointer select-none">
                <span className="text-xl font-bold tracking-wider text-[#111111]">
                  KRYPTON
                </span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B1A] animate-pulse" />
              </div>

              <button
                type="button"
                id="spoc-demo-btn"
                onClick={() => window.open("/demo", "_blank")}
                className="rounded-full border border-white bg-white/95 px-3 py-1 font-mono text-xs font-semibold text-black shadow-xs transition-all hover:bg-white hover:scale-105 active:scale-95 cursor-pointer"
              >
                SPOC Demo
              </button>
            </div>

            {/* Right: CASE: FIR/2026/CY-8901 pill */}
            <div className="flex items-center gap-2 rounded-full border border-[#FFEAD5] bg-white/95 px-4 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xs">
              <span className="h-2 w-2 rounded-full bg-[#FF6B1A]" />
              <span
                suppressHydrationWarning
                className="font-mono text-xs font-semibold tracking-wide text-[#111111]"
              >
                CASE: FIR/2026/CY-8901
              </span>
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
              <form onSubmit={handleLinkAndTrace} className="space-y-6">
                {/* Title */}
                <div className="border-b border-[#FFEAD5]/60 pb-5 flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold text-[#111111] tracking-tight">
                    Start Investigation with FIR Number
                  </h2>
                  <span
                    suppressHydrationWarning
                    className="font-mono text-[11px] text-[#6B7280] bg-[#FFFBF7] px-2.5 py-1 rounded-md border border-[#FFEAD5]"
                  >
                    Min. 26 characters
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
                      required
                      value={formData.firNumber}
                      onChange={(e) => setFormData({ ...formData, firNumber: e.target.value })}
                      placeholder="NCRP/2025/8847"
                      className="w-full rounded-xl border border-[#FFEAD5] bg-[#FFFBF7]/80 px-4 py-3 font-mono text-xs sm:text-sm text-[#111111] placeholder:text-[#6B7280]/60 transition-all focus:border-[#FF6B1A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6B1A]"
                    />
                  </div>

                  {/* Field 2: WALLET ADDRESS (with validation & focus ring) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                        WALLET ADDRESS
                      </label>
                      <span
                        suppressHydrationWarning
                        className={`font-mono text-[10px] ${
                          formData.wallet.trim().length >= 26
                            ? "text-emerald-600 font-semibold"
                            : "text-[#6B7280]"
                        }`}
                      >
                        {formData.wallet.trim().length}/26+
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.wallet}
                      onChange={(e) => {
                        setFormData({ ...formData, wallet: e.target.value });
                        if (error) setError(null);
                      }}
                      placeholder="TQa9s3q4o1k..."
                      className={`w-full rounded-xl border px-4 py-3 font-mono text-xs sm:text-sm text-[#111111] placeholder:text-[#6B7280]/60 transition-all focus:bg-white focus:outline-none ${
                        !isWalletValid && formData.wallet.length > 0
                          ? "border-amber-300 bg-amber-50/40 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                          : "border-[#FFEAD5] bg-[#FFFBF7]/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
                      }`}
                    />
                  </div>

                  {/* Field 3: POLICE STATION */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                      POLICE STATION
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.policeStation}
                      onChange={(e) => setFormData({ ...formData, policeStation: e.target.value })}
                      placeholder="Cyber Police Station Delhi"
                      className="w-full rounded-xl border border-[#FFEAD5] bg-[#FFFBF7]/80 px-4 py-3 text-xs sm:text-sm text-[#111111] placeholder:text-[#6B7280]/60 transition-all focus:border-[#FF6B1A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6B1A]"
                    />
                  </div>

                  {/* Field 4: DATE OF FIR */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                      DATE OF FIR
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.firDate}
                      onChange={(e) => setFormData({ ...formData, firDate: e.target.value })}
                      className="w-full rounded-xl border border-[#FFEAD5] bg-[#FFFBF7]/80 px-4 py-3 font-mono text-xs sm:text-sm text-[#111111] placeholder:text-[#6B7280]/60 transition-all focus:border-[#FF6B1A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6B1A]"
                    />
                  </div>
                </div>

                {/* Bottom Right Big Orange Button (Disabled if wallet length < 26) */}
                <div className="flex items-center justify-between pt-3">
                  <span
                    suppressHydrationWarning
                    className="font-mono text-[11px] text-[#6B7280]"
                  >
                    {!isWalletValid ? "Enter valid address (min 26 chars) to enable trace" : "Ready to query on-chain API"}
                  </span>

                  <button
                    type="submit"
                    disabled={isLoading || !isWalletValid}
                    className="group relative inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#FF6B1A] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(255,107,26,0.22)] transition-all hover:bg-[#E55F17] hover:shadow-[0_12px_36px_rgba(255,107,26,0.3)] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="font-mono text-xs flex items-center gap-2">
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Tracing...</span>
                      </span>
                    ) : (
                      <>
                        <span>Link FIR & Trace</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Loading Skeleton */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded-2xl border border-[#FFEAD5] bg-[#FFFBF7] p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#FF6B1A] border-t-transparent" />
                    <div className="flex flex-col">
                      <span
                        suppressHydrationWarning
                        className="font-mono text-xs font-bold text-[#FF6B1A] animate-pulse"
                      >
                        Tracing...
                      </span>
                      <span
                        suppressHydrationWarning
                        className="font-mono text-[11px] text-[#6B7280]"
                      >
                        Contacting blockchain nodes and computing neural risk vectors...
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <div className="h-2 w-1/3 rounded-full bg-[#FFEAD5] animate-pulse" />
                    <div className="h-2 w-1/2 rounded-full bg-[#FFEAD5] animate-pulse" />
                    <div className="h-2 w-1/4 rounded-full bg-[#FFEAD5] animate-pulse" />
                  </div>
                </motion.div>
              )}

              {/* Error Box with Retry Button */}
              {error && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded-2xl border border-orange-200 bg-orange-50/80 p-4 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-orange-800">
                      <AlertTriangle className="h-4 w-4 text-orange-600 shrink-0" />
                      <div>
                        <span className="font-semibold">Notice: </span>
                        <span suppressHydrationWarning className="font-mono text-[11px]">
                          {error}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            wallet: "TQa9s3q4o1k9xL8v9A2qZ5yP0W2m7jK4bE",
                          });
                          setError(null);
                        }}
                        className="rounded-lg border border-orange-300 bg-white px-3 py-1.5 font-mono text-[11px] font-semibold text-orange-800 hover:bg-orange-50 transition-colors"
                      >
                        Use Sample Wallet
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLinkAndTrace()}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF6B1A] px-3.5 py-1.5 font-mono text-[11px] font-bold text-white hover:bg-[#E55F17] transition-colors"
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span>Retry</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* LOW RISK Green Card */}
              {apiResult?.risk === "LOW" && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 rounded-2xl border border-emerald-300 bg-emerald-50 p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shrink-0">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3
                        suppressHydrationWarning
                        className="font-bold text-sm text-emerald-900"
                      >
                        NORMAL USER - Risk {apiResult.score ?? 12} - No freeze needed
                      </h3>
                      <p
                        suppressHydrationWarning
                        className="text-xs text-emerald-700 font-mono mt-0.5"
                      >
                        No freeze required. Standard retail wallet behavior detected.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
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
              <span>INTERPOL & CERT-In Compliant Gateway</span>
            </div>
            <div>AES-256 GCM Immutable Audit Log</div>
          </div>
        </footer>
      </section>

      {/* Full Viewport Height Cinematic Graph Section (HIGH or MEDIUM Risk) */}
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
            {/* Graph Canvas with real transactions passed */}
            <div className="relative h-[70vh] sm:h-[75vh] w-full">
              <TracingGraph
                walletAddress={formData.wallet}
                firNumber={formData.firNumber}
                policeStation={formData.policeStation}
                transactions={apiResult?.transactions || []}
                onReset={handleReset}
                onVaspFound={() => setVaspFound(true)}
              />
            </div>

            {/* Below Graph: Centered VASP FOUND CARD */}
            <AnimatePresence>
              {vaspFound && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full bg-[#FFFBF7] border-t border-[#FFEAD5] py-12 px-4 sm:px-6 lg:px-8"
                >
                  <div className="mx-auto max-w-4xl rounded-2xl md:rounded-3xl border border-[#FFEAD5] bg-white p-6 sm:p-8 md:p-10 shadow-soft space-y-6">
                    {/* Header: VASP Identified Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FFEAD5]/80 pb-5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#FF6B1A]">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#FF6B1A]">
                            VASP IDENTIFIED • BINANCE GLOBAL
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-[#111111]">
                            Centralized Exchange Hot Deposit Hub
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 font-mono text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>KYC Subpoena Ready</span>
                      </div>
                    </div>

                    {/* Details Row: Wallet, Accuracy, Amount, Risk */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                      {/* Wallet */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280]">
                          Target VASP Wallet
                        </span>
                        <div
                          suppressHydrationWarning
                          className="font-mono text-xs font-bold text-[#111111] truncate"
                        >
                          {apiResult?.transactions && apiResult.transactions.length > 0
                            ? (apiResult.transactions[apiResult.transactions.length - 1].to_address || apiResult.transactions[apiResult.transactions.length - 1].to || formData.wallet).slice(0, 8) + "..."
                            : formData.wallet.slice(0, 8) + "..."}
                        </div>
                        <span className="text-[10px] text-[#6B7280] font-mono">
                          Exchange Settlement Hub
                        </span>
                      </div>

                      {/* Accuracy */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280]">
                          Accuracy Rate
                        </span>
                        <div className="font-mono text-xs font-bold text-emerald-600">
                          92% confidence
                        </div>
                        <span className="text-[10px] text-[#6B7280] font-mono">
                          2-Hop Verified Trail
                        </span>
                      </div>

                      {/* Amount */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280]">
                          Stolen Amount
                        </span>
                        <div className="font-mono text-xs font-bold text-[#FF6B1A]">
                          ₹4.70 Lakhs
                        </div>
                        <span className="text-[10px] text-[#6B7280] font-mono">
                          250,000 USDT Stolen
                        </span>
                      </div>

                      {/* Risk Score */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280]">
                          Risk Score
                        </span>
                        <div>
                          <span
                            suppressHydrationWarning
                            className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-bold ${
                              (apiResult?.score ?? 82) >= 60
                                ? "border-red-200 bg-red-50 text-red-600"
                                : "border-amber-200 bg-amber-50 text-amber-600"
                            }`}
                          >
                            {apiResult?.score ?? 82} {apiResult?.label ?? "High"}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#6B7280] font-mono">
                          Critical Siphoning Flow
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons Row (Do NOT show freeze button if risk === LOW) */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
                      <p className="text-xs text-[#6B7280] max-w-sm">
                        Pre-populated Section 91 CrPC notice with encrypted blockchain trail evidence attached.
                      </p>

                      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        {/* Secondary Buttons: PMLA Draft & Chain Analysis */}
                        <button
                          type="button"
                          id="download-pmla-draft-page-btn"
                          onClick={handleDownloadPdf}
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl border border-[#FFEAD5] bg-white px-5 py-3 text-xs font-semibold text-[#111111] shadow-soft transition-all hover:bg-[#FFF7ED] hover:border-[#FFD4AB]"
                        >
                          <Download className="h-4 w-4 text-[#FF6B1A]" />
                          <span>PMLA Draft</span>
                        </button>
                        <button
                          type="button"
                          id="download-chain-analysis-page-btn"
                          onClick={() =>
                            downloadKryptonPDF("Chain-Analysis", "NCRP20258847", formData.wallet, "12.5L")
                          }
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl border border-[#FFEAD5] bg-white px-5 py-3 text-xs font-semibold text-[#111111] shadow-soft transition-all hover:bg-[#FFF7ED] hover:border-[#FFD4AB]"
                        >
                          <Download className="h-4 w-4 text-[#FF6B1A]" />
                          <span>Chain Analysis Report</span>
                        </button>

                        {/* Primary Orange Button: Freeze Now / Stage Active / Stage 4 Lien Placed */}
                        {apiResult?.freezeAllowed !== false && (
                          currentStage === 4 ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 font-mono text-xs font-bold text-emerald-700 shadow-xs">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                <span>Lien Placed - Asset Secured</span>
                                <span className="ml-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-800">
                                  Timer Stopped • {formatTimer(timer)}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setModalStage(4);
                                  setIsMailModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3.5 py-2.5 font-mono text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                              >
                                <Mail className="h-3.5 w-3.5 text-emerald-600" />
                                <span>View Final Closure Report</span>
                              </button>
                            </div>
                          ) : isActive ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <div
                                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 font-mono text-xs font-bold shadow-xs ${
                                  currentStage === 3
                                    ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                                    : currentStage === 2
                                    ? "border-purple-300 bg-purple-50 text-purple-700"
                                    : currentStage === 1
                                    ? "border-red-300 bg-red-50 text-red-700"
                                    : "border-emerald-300 bg-emerald-50 text-emerald-700"
                                }`}
                              >
                                <span className="relative flex h-2 w-2">
                                  <span
                                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                      currentStage === 3
                                        ? "bg-indigo-400"
                                        : currentStage === 2
                                        ? "bg-purple-400"
                                        : currentStage === 1
                                        ? "bg-red-400"
                                        : "bg-emerald-400"
                                    }`}
                                  ></span>
                                  <span
                                    className={`relative inline-flex rounded-full h-2 w-2 ${
                                      currentStage === 3
                                        ? "bg-indigo-500"
                                        : currentStage === 2
                                        ? "bg-purple-500"
                                        : currentStage === 1
                                        ? "bg-red-500"
                                        : "bg-emerald-500"
                                    }`}
                                  ></span>
                                </span>
                                <span>
                                  {currentStage === 3
                                    ? `Stage 3 Active • PMLA 17 (${formatTimer(timer)})`
                                    : currentStage === 2
                                    ? `Stage 2 Active • FIU STR (${formatTimer(timer)})`
                                    : currentStage === 1
                                    ? `Stage 1 Active (${formatTimer(timer)})`
                                    : `Stage 0 Active (${formatTimer(timer)})`}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setModalStage(currentStage);
                                  setIsMailModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-[#FFEAD5] bg-white px-3.5 py-2.5 font-mono text-xs font-semibold text-[#111111] hover:bg-[#FFF7ED] transition-colors"
                              >
                                <Mail className="h-3.5 w-3.5 text-[#FF6B1A]" />
                                <span>
                                  {currentStage === 3
                                    ? "View PMLA Draft"
                                    : currentStage === 2
                                    ? "View FIU Escalation"
                                    : currentStage === 1
                                    ? "View 94 BNSS Notice"
                                    : "View Notice"}
                                </span>
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={handleFreezeNow}
                              className="flex-1 sm:flex-initial group inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B1A] px-6 py-3 text-xs font-semibold text-white shadow-[0_8px_30px_rgba(255,107,26,0.28)] transition-all hover:bg-[#E55F17] hover:shadow-[0_12px_36px_rgba(255,107,26,0.36)] active:scale-[0.99]"
                            >
                              <span>Freeze Now</span>
                              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Section id="legal": Revealed when freezeSent = true */}
      <AnimatePresence>
        {freezeSent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <StatutoryEscalation
              firNumber={formData.firNumber}
              walletAddress={formData.wallet}
              policeStation={formData.policeStation}
              isActive={isActive}
              timer={timer}
              currentStage={currentStage}
            />
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6 pt-6 pb-12">
              <BankLienCard
                bankName="HDFC Bank"
                accountNo="50100481920391"
                txHash="0x89f4b301c29e1d88194a2b6f120e8b21ca03947b9e013f99a7102e3b4a229c11"
                amount="₹4,70,000"
                firNumber={formData.firNumber || "NCRP/2025/8847"}
              />
              <ForensicReport
                caseData={{
                  firNo: formData.firNumber || "NCRP/2025/8847",
                  wallet: formData.wallet || "TQa9fC3a...",
                  riskScore: 92,
                  amount: "12.5L",
                  date: formData.firDate || "19 Mar 2026 11:22 UTC",
                  io: "Inspector Cyber Cell",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 0 & Stage 1 Mail Modal */}
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
