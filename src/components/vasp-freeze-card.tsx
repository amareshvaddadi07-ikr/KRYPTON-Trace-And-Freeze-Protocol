"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  CheckCircle2,
  Download,
  Mail,
  Zap,
} from "lucide-react";
import { downloadKryptonPDF } from "@/lib/krypton-pdf";

export interface VaspFreezeCardProps {
  currentStage: number;
  setCurrentStage: (stage: number) => void;
  timer: number;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  formatTimer: (seconds: number) => string;
  onOpenMailModal?: (stage: number) => void;
  onFreezeNow?: () => void;
  onDownloadPmla?: () => void;
  onDownloadChainAnalysis?: () => void;
  wallet?: string;
  amount?: string;
  staticTimestamp?: string;
  isLiveMode?: boolean;
}

export function VaspFreezeCard({
  currentStage,
  setCurrentStage,
  timer,
  setTimer,
  isActive,
  setIsActive,
  formatTimer,
  onOpenMailModal,
  onFreezeNow,
  onDownloadPmla,
  onDownloadChainAnalysis,
  wallet = "Binance_0x3f5c...9f2L",
  amount = "₹12.5 Lakhs",
  staticTimestamp = "19 Mar 2026 11:22 UTC",
  isLiveMode,
}: VaspFreezeCardProps) {
  const [selectedJumpStage, setSelectedJumpStage] = useState<number>(currentStage);

  // Time thresholds:
  // Live mode: 1800s (30 mins), 3600s, 5400s, 7200s (lien)
  // Demo mode: 180s, 360s, 540s, 720s
  const isLive = isLiveMode ?? (typeof window !== "undefined" && window.location.pathname === "/");
  const LIMIT_STAGE_1 = isLive ? 1800 : 180;
  const LIMIT_STAGE_2 = isLive ? 3600 : 360;
  const LIMIT_STAGE_3 = isLive ? 5400 : 540;
  const LIMIT_STAGE_4 = isLive ? 7200 : 720;

  // Mail modal should ONLY open inside the timer setInterval when elapsed crosses threshold.
  // No useEffect that opens mail modal on mount or on freeze click for stage 1, 2, 3, 4.
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prevElapsed) => {
          const elapsed = prevElapsed + 1;

          // if isActive and elapsed is 1800s (30m) [demo: 180s] and currentStage is 0 -> stage 1 mail
          if (currentStage === 0 && elapsed >= LIMIT_STAGE_1) {
            console.log("Stage 1 time limit reached opening mail");
            setCurrentStage(1);
            if (onOpenMailModal) onOpenMailModal(1);
          }
          // Similarly if elapsed is 3600s [demo: 360s] and stage 1 -> stage 2 mail
          else if (currentStage === 1 && elapsed >= LIMIT_STAGE_2) {
            console.log("Stage 2 time limit reached opening mail");
            setCurrentStage(2);
            if (onOpenMailModal) onOpenMailModal(2);
          }
          // If 5400s [demo: 540s] and stage 2 -> stage 3 mail
          else if (currentStage === 2 && elapsed >= LIMIT_STAGE_3) {
            console.log("Stage 3 time limit reached opening mail");
            setCurrentStage(3);
            if (onOpenMailModal) onOpenMailModal(3);
          }
          // If 7200s [demo: 720s] and stage 3 -> stage 4 lien
          else if (currentStage === 3 && elapsed >= LIMIT_STAGE_4) {
            console.log("Stage 4 time limit reached opening mail");
            setCurrentStage(4);
            setIsActive(false);
            if (onOpenMailModal) onOpenMailModal(4);
          }

          return elapsed;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isActive,
    currentStage,
    LIMIT_STAGE_1,
    LIMIT_STAGE_2,
    LIMIT_STAGE_3,
    LIMIT_STAGE_4,
    setCurrentStage,
    setIsActive,
    onOpenMailModal,
    setTimer,
  ]);

  // Do NOT auto open any mail when freeze button clicked except stage 0.
  // Stage 0 mail only once on freeze. After that all next stage mails only after time limit hits.
  const handleFreezeClick = () => {
    if (currentStage === 0 && !isActive) {
      if (onFreezeNow) {
        onFreezeNow();
      } else if (onOpenMailModal) {
        onOpenMailModal(0);
      }
    }
  };

  // "⚡️ Skip Timer - Complete Stage (Demo Only)"
  // Sets elapsed to next stage limit (180, 360, 540, 720 in demo; 1800, 3600, 5400, 7200 in live)
  const handleSkipTimer = () => {
    setIsActive(true);
    if (currentStage === 0) {
      setTimer(LIMIT_STAGE_1);
      setCurrentStage(1);
      console.log("Stage 1 time limit reached opening mail");
      if (onOpenMailModal) onOpenMailModal(1);
    } else if (currentStage === 1) {
      setTimer(LIMIT_STAGE_2);
      setCurrentStage(2);
      console.log("Stage 2 time limit reached opening mail");
      if (onOpenMailModal) onOpenMailModal(2);
    } else if (currentStage === 2) {
      setTimer(LIMIT_STAGE_3);
      setCurrentStage(3);
      console.log("Stage 3 time limit reached opening mail");
      if (onOpenMailModal) onOpenMailModal(3);
    } else if (currentStage >= 3) {
      setTimer(LIMIT_STAGE_4);
      setCurrentStage(4);
      setIsActive(false);
      console.log("Stage 4 time limit reached opening mail");
      if (onOpenMailModal) onOpenMailModal(4);
    }
  };

  // "Jump to Any Stage" on select:
  // set currentStage to selected value and open that stage mail modal instantly
  const handleJumpStage = (stageNum: number) => {
    setSelectedJumpStage(stageNum);
    setCurrentStage(stageNum);

    if (stageNum === 0) {
      setTimer(0);
      setIsActive(true);
      if (onOpenMailModal) onOpenMailModal(0);
    } else if (stageNum === 1) {
      setTimer(LIMIT_STAGE_1);
      setIsActive(true);
      console.log("Stage 1 time limit reached opening mail");
      if (onOpenMailModal) onOpenMailModal(1);
    } else if (stageNum === 2) {
      setTimer(LIMIT_STAGE_2);
      setIsActive(true);
      console.log("Stage 2 time limit reached opening mail");
      if (onOpenMailModal) onOpenMailModal(2);
    } else if (stageNum === 3) {
      setTimer(LIMIT_STAGE_3);
      setIsActive(true);
      console.log("Stage 3 time limit reached opening mail");
      if (onOpenMailModal) onOpenMailModal(3);
    } else if (stageNum === 4) {
      setTimer(LIMIT_STAGE_4);
      setIsActive(false);
      console.log("Stage 4 time limit reached opening mail");
      if (onOpenMailModal) onOpenMailModal(4);
    }
  };

  // Show yellow demo panel in development or always visible for demo
  const isDemoVisible = process.env.NODE_ENV === "development" || true;

  return (
    <div
      id="vasp-freeze-card"
      className="mx-auto max-w-4xl rounded-2xl md:rounded-3xl border border-[#FFEAD5] bg-white p-6 sm:p-8 md:p-10 shadow-soft space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FFEAD5]/80 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#FF6B1A]">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#FF6B1A]">
              VASP IDENTIFIED • BINANCE
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

      {/* Details Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
        <div className="space-y-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280]">
            Target VASP Wallet
          </span>
          <div className="font-mono text-xs font-bold text-[#111111] truncate">
            {wallet}
          </div>
          <span className="text-[10px] text-[#6B7280] font-mono">
            Exchange Settlement Hub
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280]">
            Binance Confidence
          </span>
          <div className="font-mono text-xs font-bold text-emerald-600">
            92% confidence
          </div>
          <span className="text-[10px] text-[#6B7280] font-mono">
            Verified Nodal Cluster
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280]">
            Stolen Amount
          </span>
          <div className="font-mono text-xs font-bold text-[#FF6B1A]">
            {amount}
          </div>
          <span className="text-[10px] text-[#6B7280] font-mono">
            12.5L INR Attached
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280]">
            Risk Score
          </span>
          <div>
            <span className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 font-mono">
              82 High
            </span>
          </div>
          <span className="text-[10px] text-[#6B7280] font-mono">
            Critical Fraud Syndicate
          </span>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#FFEAD5]/60">
        <p className="text-xs text-[#6B7280] max-w-sm">
          Pre-populated Section 91 CrPC notice with encrypted blockchain trail evidence attached. Timestamp: {staticTimestamp}.
        </p>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            id="download-pmla-draft-vasp-btn"
            onClick={onDownloadPmla || downloadKryptonPDF}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl border border-[#FFEAD5] bg-white px-5 py-3 text-xs font-semibold text-[#111111] shadow-soft transition-all hover:bg-[#FFF7ED] hover:border-[#FFD4AB]"
          >
            <Download className="h-4 w-4 text-[#FF6B1A]" />
            <span>PMLA Draft</span>
          </button>
          <button
            type="button"
            id="download-chain-analysis-vasp-btn"
            onClick={onDownloadChainAnalysis || downloadKryptonPDF}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl border border-[#FFEAD5] bg-white px-5 py-3 text-xs font-semibold text-[#111111] shadow-soft transition-all hover:bg-[#FFF7ED] hover:border-[#FFD4AB]"
          >
            <Download className="h-4 w-4 text-[#FF6B1A]" />
            <span>Chain Analysis Report</span>
          </button>

          {/* Primary Timer / Freeze Display */}
          {currentStage === 4 ? (
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
                onClick={() => onOpenMailModal && onOpenMailModal(4)}
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
                onClick={() => onOpenMailModal && onOpenMailModal(currentStage)}
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
              id="freeze-now-demo"
              onClick={handleFreezeClick}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B1A] px-7 py-3 text-xs font-bold text-white shadow-[0_8px_30px_rgba(255,107,26,0.22)] transition-all hover:bg-[#E55F17] hover:shadow-[0_12px_36px_rgba(255,107,26,0.3)] active:scale-[0.98]"
            >
              <Zap className="h-4 w-4" />
              <span>Freeze Now</span>
            </button>
          )}
        </div>
      </div>

      {/* YELLOW DEMO CONTROLS PANEL: Placed below the timer display */}
      {isDemoVisible && (
        <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-gradient-to-r from-amber-50/95 via-yellow-50/90 to-amber-50/95 p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/80 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-400 px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-amber-950 shadow-xs">
                ⚡ DEMO CONTROLS
              </span>
              <span className="text-xs font-semibold text-amber-900">
                SPOC State Machine Accelerator
              </span>
            </div>
            <span className="font-mono text-[11px] font-medium text-amber-800">
              Current: <strong className="text-amber-950 font-bold">Stage {currentStage}</strong> (Elapsed: {timer}s)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* 1. Yellow button: "⚡️ Skip Timer - Complete Stage (Demo Only)" */}
            <button
              type="button"
              id="skip-timer-btn"
              onClick={handleSkipTimer}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 font-mono text-xs font-bold text-amber-950 shadow-sm border border-amber-500/40 hover:bg-amber-300 hover:shadow-md active:scale-[0.98] transition-all"
            >
              <span>⚡️ Skip Timer - Complete Stage (Demo Only)</span>
            </button>

            {/* 2. Second button / select: "Jump to Any Stage" with dropdown select 0 to 4 */}
            <div className="inline-flex items-center gap-2 rounded-xl bg-white/80 border border-amber-300 px-3 py-1.5 shadow-xs">
              <span className="font-mono text-xs font-bold text-amber-900">
                Jump to Any Stage:
              </span>
              <select
                id="jump-to-stage-select"
                value={currentStage}
                onChange={(e) => handleJumpStage(Number(e.target.value))}
                className="rounded-lg border border-amber-300 bg-amber-100/60 px-2.5 py-1 font-mono text-xs font-bold text-amber-950 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
              >
                <option value={0}>Stage 0 • 91 CrPC Freezing Notice</option>
                <option value={1}>Stage 1 • 94 BNSS Summons Threat</option>
                <option value={2}>Stage 2 • FIU-IND Escalation</option>
                <option value={3}>Stage 3 • PMLA 17 Attachment</option>
                <option value={4}>Stage 4 • Lien Placed &amp; Secured</option>
              </select>
            </div>
          </div>

          <p className="text-[10px] font-mono text-amber-800/80">
            * Note: Skipping sets elapsed time to next threshold ({LIMIT_STAGE_1}s, {LIMIT_STAGE_2}s, {LIMIT_STAGE_3}s, {LIMIT_STAGE_4}s).
            Stage mails only open once the time limit hits.
          </p>
        </div>
      )}
    </div>
  );
}

export default VaspFreezeCard;
