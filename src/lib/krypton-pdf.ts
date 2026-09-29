"use client";

export function downloadKryptonPDF(...args: any[]) {
  if (typeof window === "undefined") return;
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(`<html><head><title>KRYPTON Report</title><style>body{font-family:Arial;padding:40px} .header{background:#ff6600;color:white;padding:15px;text-align:center} .box{border:1px solid #ccc;padding:20px;margin-top:20px} table{width:100%;border-collapse:collapse} td{border:1px solid #ccc;padding:8px}</style></head><body><div class="header"><h2>KRYPTON - Trace & Freeze Protocol - SIH26182</h2></div><div class="box"><h3>Forensic Report - FIR NCRP/2025/8847</h3><table><tr><td>FIR No</td><td>NCRP/2025/8847</td></tr><tr><td>Wallet</td><td>TQa9fC3aXk...9f2L</td></tr><tr><td>Amount</td><td>12.5L INR</td></tr><tr><td>Risk Score</td><td>92 Critical</td></tr><tr><td>Date</td><td>19 Mar 2026 11:22 UTC</td></tr><tr><td>VASP</td><td>Binance - Freeze Initiated</td></tr></table><p>This is system generated forensic report for law enforcement use only.</p><p>IO Signature: ____________________</p></div></body></html>`);
  w.document.close();
  w.print();
}

export const printKryptonPDF = downloadKryptonPDF;
export const shareKryptonPDF = downloadKryptonPDF;
export const saveToGoogleDrive = downloadKryptonPDF;

export default downloadKryptonPDF;
