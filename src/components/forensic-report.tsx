"use client";

import React, { useState } from "react";
import {
  Download,
  FileText,
  CheckCircle2,
  Send,
  Printer,
  Share2,
  Cloud,
  ExternalLink,
} from "lucide-react";
import { downloadKryptonPDF } from "@/lib/krypton-pdf";

export interface CaseData {
  firNo?: string;
  wallet?: string;
  riskScore?: number | string;
  amount?: string;
  date?: string;
  io?: string;
  transactions?: any[];
  [key: string]: any;
}

export interface ForensicReportProps {
  caseData?: CaseData;
}

export function ForensicReport({
  caseData = {
    firNo: "NCRP/2025/8847",
    wallet: "TQa9fC3aXk...9f2L",
    riskScore: 92,
    amount: "12.5L INR",
    date: "19 Mar 2026 11:22 UTC",
    io: "Inspector Cyber Cell",
  },
}: ForensicReportProps) {
  const caseId = "NCRP20258847";
  const wallet = caseData?.wallet || "TQa9fC3aXk...9f2L";
  const amount = caseData?.amount
    ? caseData.amount.includes("INR")
      ? caseData.amount
      : `${caseData.amount} INR`
    : "12.5L INR";

  const handleSendReportToSpDgp = () => {
    const to = "sp.cyber@ap.gov.in,dgp@ap.police.gov.in";
    const cc = "io@cybercrime.gov.in";
    const subject = "Forensic Report Submission - FIR NCRP/2025/8847 - KRYPTON SIH26182";
    const body =
      "Respected Sir, Please find forensic trace details: Wallet TQa9f flagged for 12.5L fraud, Risk Score 92, VASP Binance freeze initiated, Bank lien placed, Chain analysis completed, Detailed PDF report attached with this mail chain, Request further action, Regards Cyber Crime IO.";
    const mailtoUrl = `mailto:${to}?cc=${encodeURIComponent(
      cc
    )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, "_blank");
  };

  return (
    <div
      id="forensic-report-section"
      className="rounded-2xl md:rounded-3xl border border-[#FFEAD5] bg-white p-6 sm:p-8 shadow-soft space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FFEAD5] pb-4">
        <div className="space-y-1">
          <span className="font-mono text-[10px] font-bold text-[#FF6B1A] uppercase tracking-wider bg-[#FFF7ED] px-2.5 py-0.5 rounded border border-[#FFEAD5]">
            OFFICIAL POLICE FORENSIC DOSSIER
          </span>
          <h3 className="text-base sm:text-lg font-bold text-[#111111] tracking-tight">
            Certified Forensic Dossier &amp; VASP Statutory Notices
          </h3>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 font-mono text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Section 65B Indian Evidence Act Certified</span>
        </div>
      </div>

      {/* Case Details Summary Box */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 font-mono text-xs">
        <div className="rounded-xl border border-[#FFEAD5] bg-[#FFFBF7] p-3 space-y-1">
          <span className="text-[10px] text-[#6B7280] uppercase">Case / FIR</span>
          <div className="font-bold text-[#111111]">
            {caseData?.firNo || "NCRP/2025/8847"}
          </div>
          <span className="text-[10px] text-[#6B7280]">Cyber Delhi</span>
        </div>

        <div className="rounded-xl border border-[#FFEAD5] bg-[#FFFBF7] p-3 space-y-1">
          <span className="text-[10px] text-[#6B7280] uppercase">Target Wallet</span>
          <div className="font-bold text-[#FF6B1A] truncate">
            {wallet}
          </div>
          <span className="text-[10px] text-[#6B7280]">TRC-20 USDT</span>
        </div>

        <div className="rounded-xl border border-[#FFEAD5] bg-[#FFFBF7] p-3 space-y-1">
          <span className="text-[10px] text-[#6B7280] uppercase">Amount Attached</span>
          <div className="font-bold text-emerald-600">
            {amount}
          </div>
          <span className="text-[10px] text-[#6B7280]">Proceeds of Crime</span>
        </div>

        <div className="rounded-xl border border-[#FFEAD5] bg-[#FFFBF7] p-3 space-y-1">
          <span className="text-[10px] text-[#6B7280] uppercase">Risk Assessment</span>
          <div className="font-bold text-red-600">
            {caseData?.riskScore ?? 92} / 100 Critical
          </div>
          <span className="text-[10px] text-[#6B7280]">Fraud Syndicate</span>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-[#6B7280]">
            Export tamper-proof court-admissible cryptographic audit logs and formal
            statutory requisition letters for exchange and banking compliance.
          </p>
          <span className="font-mono text-[10px] text-[#FF6B1A] font-bold uppercase">
            All Letters Pre-Populated • Case NCRP/2025/8847
          </span>
        </div>

        {/* Google Drive & Print Notification Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 py-2.5 rounded-xl bg-orange-50/70 border border-orange-200/80 text-xs font-mono text-[#C2410C]">
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-[#FF6B1A] shrink-0" />
            <span>
              <strong>Google Drive &amp; Print Ready:</strong> High-resolution A4 ISO 32000-1 certified forensic dossiers for instant cloud archiving, multi-agency sharing, and court printing.
            </span>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              id="header-print-pdf-btn"
              onClick={downloadKryptonPDF}
              className="inline-flex items-center gap-1 font-bold text-[#FF6B1A] hover:text-[#9A3412] hover:underline"
              title="Print A4 or Save to Google Drive via system print"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print A4</span>
            </button>
            <span className="text-orange-300">•</span>
            <button
              type="button"
              id="header-share-drive-btn"
              onClick={downloadKryptonPDF}
              className="inline-flex items-center gap-1 font-bold text-[#FF6B1A] hover:text-[#9A3412] hover:underline"
              title="Native share sheet (Google Drive, WhatsApp, Email)"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share to Drive</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pt-2">
          {/* Button 1: Download Forensic Report */}
          <button
            type="button"
            id="download-forensic-report-btn"
            onClick={downloadKryptonPDF}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B1A] px-4 py-2.5 font-mono text-xs font-bold text-white shadow-[0_4px_20px_rgba(255,107,26,0.28)] hover:bg-[#E55F17] transition-all active:scale-[0.98]"
          >
            <Download className="h-4 w-4" />
            <span>Download Forensic Report</span>
          </button>

          {/* Button 2: Print Report (A4) */}
          <button
            type="button"
            id="print-forensic-report-btn"
            onClick={downloadKryptonPDF}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-300 bg-orange-50/50 px-4 py-2.5 font-mono text-xs font-bold text-[#C2410C] hover:bg-orange-100 transition-all active:scale-[0.98]"
          >
            <Printer className="h-4 w-4 text-[#FF6B1A]" />
            <span>Print Report (A4)</span>
          </button>

          {/* Button 3: Share / Google Drive */}
          <button
            type="button"
            id="share-google-drive-btn"
            onClick={downloadKryptonPDF}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50/50 px-4 py-2.5 font-mono text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-all active:scale-[0.98]"
          >
            <Share2 className="h-4 w-4 text-emerald-600" />
            <span>Share to Drive / Cloud</span>
          </button>

          {/* New Blue Button: Send Report to SP/DGP */}
          <button
            type="button"
            id="send-report-sp-dgp-btn"
            onClick={handleSendReportToSpDgp}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-mono text-xs font-bold text-white shadow-[0_4px_20px_rgba(37,99,235,0.28)] hover:bg-blue-700 transition-all active:scale-[0.98]"
          >
            <Send className="h-4 w-4" />
            <span>Send Report to SP/DGP</span>
          </button>

          {/* Button: Trace Report button */}
          <button
            type="button"
            id="download-trace-report-btn"
            onClick={downloadKryptonPDF}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#FFEAD5] bg-white px-4 py-2.5 font-mono text-xs font-bold text-[#111111] hover:bg-[#FFF7ED] hover:border-[#FFD4AB] transition-all active:scale-[0.98]"
          >
            <Download className="h-4 w-4 text-[#FF6B1A]" />
            <span>Trace Report</span>
          </button>

          {/* Button 3: VASP Freeze Letter */}
          <button
            type="button"
            id="download-vasp-freeze-letter-btn"
            onClick={downloadKryptonPDF}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#FFEAD5] bg-white px-4 py-2.5 font-mono text-xs font-bold text-[#111111] hover:bg-[#FFF7ED] hover:border-[#FFD4AB] transition-all active:scale-[0.98]"
          >
            <FileText className="h-4 w-4 text-[#FF6B1A]" />
            <span>VASP Freeze Letter</span>
          </button>

          {/* Button 4: 91 CrPC Notice */}
          <button
            type="button"
            id="download-91crpc-notice-btn"
            onClick={downloadKryptonPDF}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#FFEAD5] bg-white px-4 py-2.5 font-mono text-xs font-bold text-[#111111] hover:bg-[#FFF7ED] hover:border-[#FFD4AB] transition-all active:scale-[0.98]"
          >
            <FileText className="h-4 w-4 text-[#FF6B1A]" />
            <span>91 CrPC Notice</span>
          </button>

          {/* Button 5: 94 BNSS Notice */}
          <button
            type="button"
            id="download-94bnss-notice-btn"
            onClick={downloadKryptonPDF}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#FFEAD5] bg-white px-4 py-2.5 font-mono text-xs font-bold text-[#111111] hover:bg-[#FFF7ED] hover:border-[#FFD4AB] transition-all active:scale-[0.98]"
          >
            <FileText className="h-4 w-4 text-[#FF6B1A]" />
            <span>94 BNSS Notice</span>
          </button>

          {/* Button 6: PMLA Draft */}
          <button
            type="button"
            id="download-pmla-draft-btn"
            onClick={downloadKryptonPDF}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#FFEAD5] bg-white px-4 py-2.5 font-mono text-xs font-bold text-[#111111] hover:bg-[#FFF7ED] hover:border-[#FFD4AB] transition-all active:scale-[0.98]"
          >
            <FileText className="h-4 w-4 text-[#FF6B1A]" />
            <span>PMLA Draft</span>
          </button>

          {/* Button 7: Bank Lien Letter */}
          <button
            type="button"
            id="download-bank-lien-letter-btn"
            onClick={downloadKryptonPDF}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#FFEAD5] bg-white px-4 py-2.5 font-mono text-xs font-bold text-[#111111] hover:bg-[#FFF7ED] hover:border-[#FFD4AB] transition-all active:scale-[0.98]"
          >
            <Download className="h-4 w-4 text-[#FF6B1A]" />
            <span>Bank Lien Letter</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForensicReport;
