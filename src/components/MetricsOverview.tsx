"use client";

import React from "react";
import { ArrowUpRight, TrendingUp, Zap, ShieldCheck, ArrowDownLeft } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtext: string;
  icon: React.ReactNode;
}

function MetricCard({ label, value, change, isPositive, subtext, icon }: MetricCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-soft transition-all duration-200 hover:border-brand-200 hover:shadow-soft-hover">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-muted">{label}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-white">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl font-mono">
          {value}
        </span>
      </div>
      <div className="mt-2.5 flex items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-0.5 rounded-md bg-brand-50 px-1.5 py-0.5 font-medium text-brand-600 border border-brand-100/60 font-mono">
          <TrendingUp className="h-3 w-3" />
          {change}
        </span>
        <span className="text-muted">{subtext}</span>
      </div>
    </div>
  );
}

export function MetricsOverview() {
  const metrics = [
    {
      label: "Total Settled Volume",
      value: "$4,829,310.45",
      change: "+18.4%",
      isPositive: true,
      subtext: "vs previous 30 days",
      icon: <ArrowUpRight className="h-4 w-4" />,
    },
    {
      label: "Treasury Reserves",
      value: "$1,240,890.00",
      change: "+6.2%",
      isPositive: true,
      subtext: "liquid across 4 chains",
      icon: <ShieldCheck className="h-4 w-4" />,
    },
    {
      label: "Avg Settlement Latency",
      value: "640ms",
      change: "-12.0%",
      isPositive: true,
      subtext: "instant finality",
      icon: <Zap className="h-4 w-4" />,
    },
    {
      label: "Pending Inflow",
      value: "$142,500.18",
      change: "+9.1%",
      isPositive: true,
      subtext: "8 batches queued",
      icon: <ArrowDownLeft className="h-4 w-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, i) => (
        <MetricCard key={i} {...metric} />
      ))}
    </div>
  );
}
