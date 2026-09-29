import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KRYPTON — Crypto Forensics & VASP Tracing",
  description: "Trace the untraceable. Freeze the unfreezable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#FFFBF7] text-[#111111] antialiased selection:bg-[#FFEAD5] selection:text-[#FF6B1A]"
      >
        {children}
      </body>
    </html>
  );
}
