"use client";

import React, { useState } from "react";
import {
  Landmark,
  Building2,
  Mail,
  X,
  FileText,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Download,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import downloadKryptonPDF from "@/lib/krypton-pdf";

export const BANK_CONTACTS: Record<string, string> = {
  " SBI": "nodalofficer@sbi.co.in",
  " HDFC Bank": "nodal@hdfcbank.com",
  " ICICI Bank": "headservicequality@icicibank.com",
  " Axis Bank": "nodal.officer@axisbank.com",
  Kotak: "nodalofficer@kotak.com",
  " Yes Bank": "head.grievanceredressal@yesbank.in",
  PNB: "care@pnb.co.in",
  Canara: "hocss@canarabank.com",
  SBI: "nodalofficer@sbi.co.in",
  "HDFC Bank": "nodal@hdfcbank.com",
  "ICICI Bank": "headservicequality@icicibank.com",
  "Axis Bank": "nodal.officer@axisbank.com",
  "Yes Bank": "head.grievanceredressal@yesbank.in",
};

export const DEFAULT_BANK_EMAIL = "nodalofficer@sbi.co.in";

/**
 * Returns the nodal escalation email for the given bank name, or default if not matched.
 */
export function getBankEmail(
  bankName?: string,
  defaultEmail: string = DEFAULT_BANK_EMAIL
): string {
  if (!bankName) return defaultEmail;

  // Direct lookup
  if (BANK_CONTACTS[bankName]) {
    return BANK_CONTACTS[bankName].replace(/\s+/g, "");
  }

  // Trimmed key lookup
  const trimmed = bankName.trim();
  if (BANK_CONTACTS[trimmed]) {
    return BANK_CONTACTS[trimmed].replace(/\s+/g, "");
  }

  // Case-insensitive lookup
  const clean = trimmed.toLowerCase();
  for (const [key, email] of Object.entries(BANK_CONTACTS)) {
    if (key.trim().toLowerCase() === clean) {
      return email.replace(/\s+/g, "");
    }
  }

  // Substring match (e.g. "HDFC" matches "HDFC Bank")
  for (const [key, email] of Object.entries(BANK_CONTACTS)) {
    const k = key.trim().toLowerCase();
    if (clean.includes(k) || k.includes(clean)) {
      return email.replace(/\s+/g, "");
    }
  }

  return defaultEmail;
}

export interface BankLienCardProps {
  orderRef?: string;
  upiId?: string;
  bankName?: string;
  accountNumber?: string;
  accountNo?: string;
  txHash?: string;
  ifsc?: string;
  amount?: string;
  firNumber?: string;
  isLienPlaced?: boolean;
  onPlaceLien?: () => void;
  onGenerateLetter?: () => void;
}

export function BankLienCard({
  orderRef = "WZ-ORD-2026-9812A",
  upiId = "apex-payouts@okhdfc",
  bankName = "HDFC Bank",
  accountNumber = "50100481920391",
  accountNo,
  txHash = "0x89f4b301c29e1d88194a2b6f120e8b21ca03947b9e013f99a7102e3b4a229c11",
  ifsc = "HDFC0000240",
  amount = "₹4,70,000",
  firNumber = "NCRP/2025/8847",
  isLienPlaced = false,
  onPlaceLien,
  onGenerateLetter,
}: BankLienCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [letterGenerated, setLetterGenerated] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  // Normalize account number and txHash from props
  const effectiveAccountNo = accountNo || accountNumber || "50100481920391";
  const effectiveTxHash = txHash || "0x89f4b301c29e1d88194a2b6f120e8b21ca03947b9e013f99a7102e3b4a229c11";
  const nodalEmail = getBankEmail(bankName);
  const subjectText = `Lien Request Under 102 CrPC - FIR ${firNumber || "NCRP/2025/8847"} - Account ${effectiveAccountNo}`;

  // Letter Body as requested:
  // Dear Nodal Officer, Reference FIR NCRP/2025/8847 Date 19 Mar 2026, We have traced proceeds of crime 12.5L to account linked to wallet TQa9f via UPI. Under Section 102 CrPC and Section 17A PMLA you are requested to place lien/debit freeze on said account and preserve for 90 days. Transaction ID, Amount 12.5L, Date. Non-compliance will be reported to RBI Ombudsman. Yours faithfully, Cyber Crime IO.
  const letterBody = `Dear Nodal Officer, Reference FIR ${firNumber || "NCRP/2025/8847"} Date 19 Mar 2026, We have traced proceeds of crime 12.5L to account ${effectiveAccountNo} linked to wallet TQa9f via UPI. Under Section 102 CrPC and Section 17A PMLA you are requested to place lien/debit freeze on said account and preserve for 90 days. Transaction ID ${effectiveTxHash}, Amount 12.5L, Date 19 Mar 2026. Non-compliance will be reported to RBI Ombudsman. Yours faithfully, Cyber Crime IO.`;

  const handleOpenModal = () => {
    setIsModalOpen(true);
    if (onPlaceLien) {
      onPlaceLien();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleGenerateLetterClick = () => {
    setLetterGenerated(true);
    if (onGenerateLetter) {
      onGenerateLetter();
    }
  };

  // Send via Email: window.open mailto link with subject and body encoded
  const handleSendEmail = () => {
    const mailtoUrl = `mailto:${nodalEmail}?subject=${encodeURIComponent(
      subjectText
    )}&body=${encodeURIComponent(letterBody)}`;
    window.open(mailtoUrl, "_blank");
  };

  // Download Lien Letter as PDF: calls downloadKryptonPDF with title Bank-Lien-Letter and caseId NCRP20258847
  const downloadPDF = () => {
    downloadKryptonPDF(
      "Bank-Lien-Letter",
      "NCRP20258847",
      effectiveTxHash,
      amount || "12.5L"
    );
  };

  return (
    <>
      {/* Bank Lien Card Container */}
      <div className="rounded-2xl md:rounded-3xl border border-[#FFEAD5] bg-[#FFFBF7] p-6 sm:p-8 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FFEAD5] pb-4">
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold text-[#FF6B1A] uppercase tracking-wider bg-white px-2.5 py-0.5 rounded border border-[#FFEAD5]">
              P2P ON-RAMP RECONSTRUCTION • SECTION 107 BNSS / 102 CrPC
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#111111] tracking-tight">
              Extract UPI from Trade History &rarr; Bank Lien
            </h3>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 font-mono text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>NPCI Gateway Active</span>
          </span>
        </div>

        {/* Mapping Pipeline (4 Steps) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 text-xs font-mono">
          <div className="rounded-xl border border-[#FFEAD5] bg-white p-3.5 space-y-1">
            <span className="text-[10px] text-[#6B7280] uppercase">1. P2P Order Ref</span>
            <div className="font-bold text-[#111111] truncate">{orderRef}</div>
            <span className="text-[10px] text-[#6B7280]">Binance P2P Hot Trail</span>
          </div>

          <div className="rounded-xl border border-[#FFEAD5] bg-white p-3.5 space-y-1">
            <span className="text-[10px] text-[#6B7280] uppercase">2. Extracted UPI VPA</span>
            <div className="font-bold text-[#FF6B1A] truncate">{upiId}</div>
            <span className="text-[10px] text-[#6B7280]">{bankName} Virtual ID</span>
          </div>

          <div className="rounded-xl border border-[#FFEAD5] bg-white p-3.5 space-y-1">
            <span className="text-[10px] text-[#6B7280] uppercase">3. Primary Account</span>
            <div className="font-bold text-[#111111] truncate">{effectiveAccountNo}</div>
            <span className="text-[10px] text-[#6B7280]">
              {bankName} • IFSC: {ifsc}
            </span>
          </div>

          <div className="rounded-xl border border-[#FFEAD5] bg-white p-3.5 space-y-1">
            <span className="text-[10px] text-[#6B7280] uppercase">4. 107 BNSS Lien</span>
            <div className="font-bold text-emerald-600">Lien Ready ({amount})</div>
            <span className="text-[10px] text-[#6B7280]">Instant Debit Freeze</span>
          </div>
        </div>

        {/* Action Row with Place Lien Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-[#6B7280]">
            Automated NPCI IMPS / UPI reverse trace maps blockchain off-ramp seller directly to Indian KYC account.
          </p>

          <button
            type="button"
            id="place-lien-btn"
            onClick={handleOpenModal}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B1A] px-6 py-2.5 text-xs font-semibold text-white shadow-soft hover:bg-[#E55F17] transition-all active:scale-[0.98]"
          >
            <Landmark className="h-4 w-4" />
            <span>Place 107 BNSS Bank Lien (Instant)</span>
          </button>
        </div>
      </div>

      {/* Modal on Place Lien Click */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            id="bank-lien-modal-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
          >
            <motion.div
              id="bank-lien-modal"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl rounded-2xl md:rounded-3xl border border-[#FFEAD5] bg-white p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-[#FFEAD5] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#FF6B1A]">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold bg-[#FFF7ED] text-[#FF6B1A] border border-[#FFEAD5]">
                      <span>SECTION 102 CrPC / 107 BNSS REQUISITION</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#111111]">
                      Bank Account Lien Notice
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  id="close-lien-modal-x"
                  onClick={handleCloseModal}
                  className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#FFF7ED] hover:text-[#FF6B1A] transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Target Details Grid: Bank Name, Account Number, Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                {/* Bank Name */}
                <div className="rounded-xl border border-[#FFEAD5] bg-[#FFFBF7] p-3 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
                    Bank Name
                  </span>
                  <div
                    id="modal-bank-name"
                    className="font-bold text-[#111111] truncate"
                  >
                    {bankName}
                  </div>
                </div>

                {/* Account Number */}
                <div className="rounded-xl border border-[#FFEAD5] bg-[#FFFBF7] p-3 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
                    Account Number
                  </span>
                  <div
                    id="modal-account-no"
                    className="font-bold text-[#FF6B1A] truncate"
                  >
                    {effectiveAccountNo}
                  </div>
                </div>

                {/* Amount */}
                <div className="rounded-xl border border-[#FFEAD5] bg-[#FFFBF7] p-3 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
                    Amount
                  </span>
                  <div
                    id="modal-amount"
                    className="font-bold text-emerald-600 truncate"
                  >
                    {amount}
                  </div>
                </div>
              </div>

              {/* The 2 Fields: To & Subject */}
              <div className="space-y-4 font-mono text-xs">
                {/* 1. To Field (from BANK_CONTACTS) */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                    To
                  </label>
                  <div
                    id="modal-to-field"
                    className="flex items-center justify-between rounded-xl border border-[#FFEAD5] bg-[#FFFBF7] px-4 py-2.5 font-semibold text-[#111111]"
                  >
                    <span id="modal-to-email">{nodalEmail}</span>
                    <span className="rounded bg-white px-2 py-0.5 text-[10px] border border-[#FFEAD5] text-[#FF6B1A]">
                      {bankName} Nodal Desk
                    </span>
                  </div>
                </div>

                {/* 2. Subject Field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                    Subject
                  </label>
                  <div
                    id="modal-subject-field"
                    className="rounded-xl border border-[#FFEAD5] bg-[#FFFBF7] px-4 py-2.5 font-medium text-[#111111]"
                  >
                    {subjectText}
                  </div>
                </div>

                {/* 3. Filled Body on Generate Letter */}
                {letterGenerated && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                        Body
                      </label>
                      <button
                        type="button"
                        id="copy-body-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(letterBody);
                          setCopiedBody(true);
                          setTimeout(() => setCopiedBody(false), 2000);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] text-[#6B7280] hover:text-[#FF6B1A] transition-colors"
                      >
                        {copiedBody ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy Body</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div
                      id="modal-body-field"
                      className="rounded-xl border border-[#FFEAD5] bg-[#FFFBF7] p-4 text-xs leading-relaxed text-[#111111] whitespace-pre-wrap selection:bg-[#FFEAD5]"
                    >
                      {letterBody}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-3 border-t border-[#FFEAD5]">
                {/* Close Button */}
                <button
                  type="button"
                  id="close-lien-modal-btn"
                  onClick={handleCloseModal}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#FFEAD5] bg-white px-5 py-2.5 font-mono text-xs font-bold text-[#111111] hover:bg-[#FFF7ED] hover:border-[#FFD4AB] transition-all shadow-xs"
                >
                  <span>Close</span>
                </button>

                {!letterGenerated ? (
                  /* Initial Button: Generate Letter */
                  <button
                    type="button"
                    id="generate-letter-btn"
                    onClick={handleGenerateLetterClick}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B1A] px-6 py-2.5 font-mono text-xs font-bold text-white shadow-[0_4px_20px_rgba(255,107,26,0.3)] hover:bg-[#E55F17] hover:shadow-[0_6px_24px_rgba(255,107,26,0.4)] active:scale-[0.98] transition-all"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Generate Letter</span>
                  </button>
                ) : (
                  /* Buttons after Generate Letter: Download PDF & Send via Email */
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    {/* Button: Download Lien Letter as PDF */}
                    <button
                      type="button"
                      id="download-pdf-btn"
                      onClick={downloadPDF}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#FFEAD5] bg-white px-5 py-2.5 font-mono text-xs font-bold text-[#111111] hover:bg-[#FFF7ED] hover:border-[#FFD4AB] transition-all shadow-xs"
                    >
                      <Download className="h-4 w-4 text-[#FF6B1A]" />
                      <span>Download Lien Letter as PDF</span>
                    </button>

                    {/* Button: Send via Email */}
                    <button
                      type="button"
                      id="send-email-btn"
                      onClick={handleSendEmail}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B1A] px-6 py-2.5 font-mono text-xs font-bold text-white shadow-[0_4px_20px_rgba(255,107,26,0.3)] hover:bg-[#E55F17] hover:shadow-[0_6px_24px_rgba(255,107,26,0.4)] active:scale-[0.98] transition-all"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Send via Email</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default BankLienCard;
