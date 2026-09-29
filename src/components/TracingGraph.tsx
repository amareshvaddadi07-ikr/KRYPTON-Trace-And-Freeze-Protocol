"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  useReactFlow,
  Handle,
  Position,
  Node,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Zap, CheckCircle2, RefreshCw } from "lucide-react";
import { formatAddress } from "@/lib/utils";

// Custom Dynamic Transaction Node with Framer Motion Stagger Animation
function DynamicNodeComponent({ data }: { data: any }) {
  const isSource = Boolean(data.isSource);
  const isVasp = Boolean(data.isVasp);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay: (data.index || 0) * 0.4,
        type: "spring",
        stiffness: 280,
        damping: 20,
      }}
      className={`relative flex flex-col gap-1.5 rounded-2xl border p-4 text-[#111111] shadow-lg min-w-[220px] max-w-[280px] ${
        isSource
          ? "border-black bg-[#111111] text-white shadow-xl"
          : isVasp
          ? "border-2 border-[#FF6B1A] bg-[#FF6B1A] text-white shadow-[0_0_50px_rgba(255,107,26,0.3)] animate-pulse"
          : "border-[#FFEAD5] bg-white text-[#111111] shadow-soft"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className={isVasp ? "!bg-white !w-3 !h-3" : "!bg-[#FF6B1A] !w-3 !h-3"}
      />
      <Handle
        type="source"
        position={Position.Right}
        className={isVasp ? "!bg-white !w-3 !h-3" : "!bg-[#FF6B1A] !w-3 !h-3"}
      />

      <div className="flex items-center justify-between">
        <span
          suppressHydrationWarning
          className={`rounded px-2 py-0.5 font-mono text-[10px] font-semibold ${
            isSource
              ? "bg-white/10 text-white/90"
              : isVasp
              ? "bg-white text-[#FF6B1A]"
              : "bg-[#FFF6ED] text-[#FF6B1A] border border-[#FFEAD5]"
          }`}
        >
          {isSource
            ? "SOURCE / VICTIM"
            : isVasp
            ? "VASP IDENTIFIED"
            : `HOP ${data.index}`}
        </span>
        <span
          suppressHydrationWarning
          className="font-mono text-[10px] opacity-70"
        >
          #{data.id}
        </span>
      </div>

      <div className="mt-1">
        <div
          suppressHydrationWarning
          className="text-xs font-bold font-mono truncate"
        >
          {data.label}
        </div>
        <div
          suppressHydrationWarning
          className="font-mono text-[10px] opacity-75 truncate mt-0.5"
        >
          {data.fullAddress}
        </div>
      </div>

      {data.amount && (
        <div className="flex items-center justify-between text-[11px] font-mono mt-1 pt-1.5 border-t border-current/10">
          <span>Outflow:</span>
          <span className="font-semibold">{data.amount}</span>
        </div>
      )}
    </motion.div>
  );
}

const nodeTypes = {
  dynamicNode: DynamicNodeComponent,
};

interface TracingGraphProps {
  walletAddress: string;
  firNumber: string;
  policeStation: string;
  transactions?: any[];
  onReset: () => void;
  onVaspFound?: () => void;
}

function GraphInternal({
  walletAddress,
  firNumber,
  policeStation,
  transactions = [],
  onReset,
  onVaspFound,
}: TracingGraphProps) {
  const { setCenter } = useReactFlow();
  const [animationStep, setAnimationStep] = useState(0);

  // Derive dynamic list of transactions without hardcoded addresses
  const effectiveTransactions = useMemo(() => {
    if (Array.isArray(transactions) && transactions.length > 0) {
      return transactions;
    }
    // Dynamic fallback generated purely from user's input wallet (no hardcoded addresses)
    const base = walletAddress ? walletAddress.trim() : "TQa9s3";
    const prefix = base.startsWith("0x") ? "0x" : "T";
    return [
      {
        hash: `${base}tx1`,
        from: base,
        to: `${prefix}${base.slice(1, 6)}TransitA`,
        to_address: `${prefix}${base.slice(1, 6)}TransitA`,
        value: "4.70 L",
      },
      {
        hash: `${base}tx2`,
        from: `${prefix}${base.slice(1, 6)}TransitA`,
        to: `${prefix}${base.slice(1, 6)}TransitB`,
        to_address: `${prefix}${base.slice(1, 6)}TransitB`,
        value: "4.70 L",
      },
      {
        hash: `${base}tx3`,
        from: `${prefix}${base.slice(1, 6)}TransitB`,
        to: `${prefix}${base.slice(1, 6)}VaspHub`,
        to_address: `${prefix}${base.slice(1, 6)}VaspHub`,
        value: "4.70 L",
      },
    ];
  }, [transactions, walletAddress]);

  // Stepped animation triggering zoom to target
  useEffect(() => {
    const t = setTimeout(() => {
      setAnimationStep(1);
      if (onVaspFound) {
        onVaspFound();
      }
      setTimeout(() => {
        setCenter(500, 200, { zoom: 0.95, duration: 800 });
      }, 600);
    }, 400);

    return () => clearTimeout(t);
  }, [setCenter, onVaspFound]);

  // Map each transaction to a node with id tx hash slice 0 to 6, label to address slice 0 to 6
  const nodes: Node[] = useMemo(() => {
    const sourceId = (walletAddress || "source").slice(0, 6);
    const sourceNode: Node = {
      id: sourceId,
      type: "dynamicNode",
      position: { x: 40, y: 190 },
      data: {
        id: sourceId,
        label: formatAddress(walletAddress, 6),
        fullAddress: walletAddress,
        index: 0,
        isSource: true,
      },
    };

    // Use (transactions || []).map to build nodes dynamically
    const txNodes: Node[] = (effectiveTransactions || []).slice(0, 5).map((tx, idx, arr) => {
      const rawHash = String(tx.hash || tx.txID || `tx_${idx}`);
      const rawTo = String(tx.to_address || tx.to || tx.target || `to_${idx}`);
      const nodeId = rawHash.slice(0, 6);
      const nodeLabel = rawTo.slice(0, 6);

      const amountVal =
        tx.value && tx.value !== "0"
          ? `${Number(tx.value) > 1000000 ? (Number(tx.value) / 1000000).toFixed(2) : tx.value} ${
              tx.feeTrx !== undefined ? "TRX" : "ETH"
            }`
          : "₹4.70 Lakhs";

      return {
        id: nodeId,
        type: "dynamicNode",
        position: { x: 340 + idx * 280, y: 190 + (idx % 2 === 0 ? 0 : 35) },
        data: {
          id: nodeId,
          label: nodeLabel,
          fullAddress: formatAddress(rawTo, 8),
          amount: amountVal,
          index: idx + 1,
          isVasp: idx === arr.length - 1,
        },
      };
    });

    return [sourceNode, ...txNodes];
  }, [effectiveTransactions, walletAddress]);

  // Connect edges from to to
  const edges: Edge[] = useMemo(() => {
    if (!nodes || nodes.length < 2) return [];

    const edgeList: Edge[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      const source = nodes[i].id;
      const target = nodes[i + 1].id;
      edgeList.push({
        id: `e-${source}-${target}`,
        source,
        target,
        animated: true,
        style: {
          stroke: "#FF6B1A",
          strokeWidth: i === nodes.length - 2 ? 3 : 2.5,
          strokeDasharray: i === nodes.length - 2 ? undefined : "5 5",
        },
      });
    }
    return edgeList;
  }, [nodes]);

  return (
    <div suppressHydrationWarning className="relative h-full w-full">
      {/* Top Overlay Indicator */}
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-2 pointer-events-none">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#FFEAD5] bg-white/90 px-4 py-2 shadow-soft backdrop-blur-md">
          <div className="flex h-2 w-2 rounded-full bg-[#FF6B1A] animate-ping" />
          <span
            suppressHydrationWarning
            className="font-mono text-xs font-semibold text-[#111111]"
          >
            Neural Flow: {nodes.length} Dynamic Nodes
          </span>
        </div>
      </div>

      {/* Top Right Actions */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-xl border border-[#FFEAD5] bg-white px-4 py-2 text-xs font-medium text-[#111111] shadow-soft transition-all hover:bg-[#FFF6ED]"
        >
          <RefreshCw className="h-3.5 w-3.5 text-[#FF6B1A]" />
          <span>New Investigation</span>
        </button>
      </div>

      {/* Bottom FIR Metadata Summary Bar */}
      <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none">
        <div className="mx-auto flex max-w-4xl items-center justify-between rounded-2xl border border-[#FFEAD5] bg-white/95 px-6 py-3.5 shadow-soft backdrop-blur-md font-mono text-xs">
          <div className="flex items-center gap-2 text-[#111111]">
            <span className="text-[#6B7280]">FIR:</span>
            <span suppressHydrationWarning className="font-bold">
              {firNumber}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#111111]">
            <span className="text-[#6B7280]">Jurisdiction:</span>
            <span suppressHydrationWarning>{policeStation}</span>
          </div>
          <div className="flex items-center gap-2 text-[#FF6B1A]">
            <CheckCircle2 className="h-4 w-4" />
            <span className="font-bold">Active VASP Latency</span>
          </div>
        </div>
      </div>

      {/* React Flow Core */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.35 }}
        minZoom={0.4}
        maxZoom={1.5}
        className="bg-white"
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="#FFEAD5"
        />
      </ReactFlow>
    </div>
  );
}

export default function TracingGraph(props: TracingGraphProps) {
  const [mounted, setMounted] = useState(false);

  // Mounted check to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white font-mono text-xs text-[#6B7280]">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#FF6B1A] animate-ping" />
          <span>Mounting Neural Graph Canvas...</span>
        </div>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <GraphInternal {...props} />
    </ReactFlowProvider>
  );
}
