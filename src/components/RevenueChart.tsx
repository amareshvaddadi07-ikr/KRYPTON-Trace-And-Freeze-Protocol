"use client";

import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface DataPoint {
  date: string;
  volume: number;
  transactions: number;
}

const timeframes = ["24H", "7D", "30D", "90D", "1Y"] as const;
type Timeframe = (typeof timeframes)[number];

const datasets: Record<Timeframe, DataPoint[]> = {
  "24H": [
    { date: "00:00", volume: 42000, transactions: 120 },
    { date: "04:00", volume: 28000, transactions: 85 },
    { date: "08:00", volume: 89000, transactions: 240 },
    { date: "12:00", volume: 154000, transactions: 410 },
    { date: "16:00", volume: 198000, transactions: 530 },
    { date: "20:00", volume: 165000, transactions: 440 },
    { date: "23:59", volume: 132000, transactions: 380 },
  ],
  "7D": [
    { date: "Mon", volume: 340000, transactions: 1120 },
    { date: "Tue", volume: 420000, transactions: 1340 },
    { date: "Wed", volume: 510000, transactions: 1600 },
    { date: "Thu", volume: 480000, transactions: 1490 },
    { date: "Fri", volume: 620000, transactions: 1890 },
    { date: "Sat", volume: 540000, transactions: 1720 },
    { date: "Sun", volume: 680000, transactions: 2100 },
  ],
  "30D": [
    { date: "Day 1", volume: 120000, transactions: 420 },
    { date: "Day 6", volume: 165000, transactions: 510 },
    { date: "Day 12", volume: 240000, transactions: 780 },
    { date: "Day 18", volume: 290000, transactions: 920 },
    { date: "Day 24", volume: 380000, transactions: 1200 },
    { date: "Day 30", volume: 490000, transactions: 1580 },
  ],
  "90D": [
    { date: "Month 1", volume: 1200000, transactions: 4200 },
    { date: "Month 2", volume: 1850000, transactions: 5800 },
    { date: "Month 3", volume: 2450000, transactions: 7900 },
  ],
  "1Y": [
    { date: "Q1", volume: 3200000, transactions: 11200 },
    { date: "Q2", volume: 4800000, transactions: 15400 },
    { date: "Q3", volume: 6900000, transactions: 21800 },
    { date: "Q4", volume: 9200000, transactions: 29400 },
  ],
};

export function RevenueChart() {
  const [activeRange, setActiveRange] = useState<Timeframe>("7D");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = datasets[activeRange];
  const maxVolume = Math.max(...data.map((d) => d.volume));
  const minVolume = Math.min(...data.map((d) => d.volume)) * 0.8;
  const currentTotal = data.reduce((acc, curr) => acc + curr.volume, 0);

  // SVG dimensions
  const width = 800;
  const height = 240;
  const paddingX = 20;
  const paddingY = 30;

  const getCoordinates = () => {
    return data.map((d, index) => {
      const x = paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
      const y =
        height -
        paddingY -
        ((d.volume - minVolume) / (maxVolume - minVolume)) *
          (height - paddingY * 2);
      return { x, y, ...d };
    });
  };

  const points = getCoordinates();
  const pathD = points.reduce((acc, curr, index) => {
    if (index === 0) return `M ${curr.x} ${curr.y}`;
    const prev = points[index - 1];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
      {/* Top Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted uppercase tracking-wider">
              Settlement Volume
            </span>
            <span className="inline-flex items-center gap-0.5 rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-mono font-medium text-brand-600 border border-brand-100">
              <ArrowUpRight className="h-2.5 w-2.5" />
              +24.8%
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="font-mono text-3xl font-semibold tracking-tight text-foreground">
              ${activePoint.volume.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            <span className="font-mono text-xs text-muted">
              {activePoint.transactions.toLocaleString()} txs
            </span>
          </div>
        </div>

        {/* Timeframe pill selector */}
        <div className="flex items-center rounded-xl border border-border bg-brand-50/40 p-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => {
                setActiveRange(tf);
                setHoveredIndex(null);
              }}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                activeRange === tf
                  ? "bg-white text-foreground shadow-sm border border-border/80"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Interactive Chart */}
      <div className="mt-8 relative h-60 w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-full w-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF6B1A" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#FF6B1A" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF8C42" />
              <stop offset="100%" stopColor="#FF6B1A" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1="0"
            y1={height * 0.25}
            x2={width}
            y2={height * 0.25}
            stroke="#FFEAD5"
            strokeDasharray="4 4"
            strokeWidth="0.8"
          />
          <line
            x1="0"
            y1={height * 0.5}
            x2={width}
            y2={height * 0.5}
            stroke="#FFEAD5"
            strokeDasharray="4 4"
            strokeWidth="0.8"
          />
          <line
            x1="0"
            y1={height * 0.75}
            x2={width}
            y2={height * 0.75}
            stroke="#FFEAD5"
            strokeDasharray="4 4"
            strokeWidth="0.8"
          />

          {/* Filled Area */}
          <path d={areaD} fill="url(#orangeGradient)" />

          {/* Line Path */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#strokeGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Points */}
          {points.map((p, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g key={i} className="cursor-pointer">
                {isHovered && (
                  <line
                    x1={p.x}
                    y1={0}
                    x2={p.x}
                    y2={height}
                    stroke="#FF6B1A"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                    opacity="0.6"
                  />
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 4}
                  className="fill-white stroke-brand-500 transition-all duration-150"
                  strokeWidth={isHovered ? 3 : 2}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom X-Axis Labels */}
      <div className="mt-3 flex justify-between px-2 font-mono text-[11px] text-muted">
        {points.map((p, i) => (
          <span key={i} className={hoveredIndex === i ? "text-brand-600 font-semibold" : ""}>
            {p.date}
          </span>
        ))}
      </div>
    </div>
  );
}
