import React, { useState } from "react";
import { NetworkData, NetworkNode } from "../types";
import { sound } from "../utils/audio";
import { ShieldCheck, AlertTriangle, AlertCircle, ArrowUpRight, Cpu, Layers } from "lucide-react";

interface Network2DViewProps {
  networkData: NetworkData;
  onSelectNode: (nodeKey: string) => void;
  selectedNodeKey?: string | null;
}

export const Network2DView: React.FC<Network2DViewProps> = ({
  networkData,
  onSelectNode,
  selectedNodeKey
}) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Center coordinate mapping for SVG canvas (1000 x 600)
  const width = 1000;
  const height = 550;
  const centerX = width / 2;
  const centerY = height / 2;

  const getNodeCoords = (node: NetworkNode) => {
    // Map 3D x, z coordinates into 2D SVG space
    const x = centerX + node.x * 2.8;
    const y = centerY + node.z * 2.2;
    return { x, y };
  };

  return (
    <div
      id="2d-topology-stage"
      className="relative w-full h-[620px] rounded-2xl overflow-hidden bg-slate-950 dark:bg-[#07070B] border border-slate-800 dark:border-cyan-500/20 shadow-2xl flex items-center justify-center p-4 select-none"
    >
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />

      {/* SVG Canvas */}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        <defs>
          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#0284c7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>

          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Concentric Tier Orbit Lines */}
        <circle cx={centerX} cy={centerY} r="130" fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="6,6" opacity="0.25" />
        <circle cx={centerX} cy={centerY} r="220" fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="6,6" opacity="0.2" />
        <circle cx={centerX} cy={centerY} r="310" fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="6,6" opacity="0.15" />

        {/* Edges / Connections */}
        {networkData.edges.map((edge, idx) => {
          const fromNode = networkData.nodes.find(n => n.id === edge.fromId);
          const toNode = networkData.nodes.find(n => n.id === edge.toId);
          if (!fromNode || !toNode) return null;

          const p1 = getNodeCoords(fromNode);
          const p2 = getNodeCoords(toNode);

          const isHighlighted = hoveredId === edge.fromId || hoveredId === edge.toId;
          const isCritical = edge.status === "critical";

          return (
            <g key={`edge-${idx}`}>
              <line
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={isCritical ? "#ef4444" : isHighlighted ? "#38bdf8" : "#0284c7"}
                strokeWidth={isCritical ? 2.5 : isHighlighted ? 2 : 1.2}
                strokeOpacity={isCritical ? 0.8 : isHighlighted ? 0.9 : 0.3}
                strokeDasharray={isCritical ? "4,4" : undefined}
                className="transition-all duration-300"
              />
            </g>
          );
        })}

        {/* Nodes */}
        {networkData.nodes.map(node => {
          const coords = getNodeCoords(node);
          const isHub = node.key === "HUB";
          const isSelected = selectedNodeKey === node.key;
          const isHovered = hoveredId === node.id;
          const radius = isHub ? 22 : Math.max(12, node.size);

          return (
            <g
              key={`node-${node.id}`}
              transform={`translate(${coords.x}, ${coords.y})`}
              className="cursor-pointer transition-transform duration-200"
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => {
                sound.playTargetLock();
                onSelectNode(node.key);
              }}
            >
              {/* Outer halo */}
              <circle
                r={radius + (isHovered || isSelected ? 10 : 5)}
                fill={node.color}
                opacity={isHovered || isSelected ? 0.35 : 0.15}
                className="transition-all duration-300"
              />

              {/* Main Node Body */}
              <circle
                r={radius}
                fill={isHub ? "url(#hubGlow)" : node.color}
                filter="url(#glowEffect)"
                stroke={isSelected ? "#ffffff" : isHub ? "#38bdf8" : "#0f172a"}
                strokeWidth={isSelected ? 2.5 : 1.5}
              />

              {/* Center icon or label */}
              {isHub ? (
                <text
                  textAnchor="middle"
                  dy=".3em"
                  fill="#ffffff"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  HQ
                </text>
              ) : (
                <text
                  textAnchor="middle"
                  dy=".3em"
                  fill="#ffffff"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {node.score}
                </text>
              )}

              {/* Floating label */}
              <text
                y={radius + 14}
                textAnchor="middle"
                fill={isHovered || isSelected ? "#38bdf8" : "#cbd5e1"}
                fontSize="11"
                fontFamily="'Plus Jakarta Sans', sans-serif"
                fontWeight={isHovered || isSelected ? "bold" : "normal"}
                className="pointer-events-none drop-shadow"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Top Left Status Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-slate-900/85 backdrop-blur-md border border-cyan-500/30 text-xs font-mono text-cyan-300">
        <span className="w-2 h-2 rounded-full bg-cyan-400" />
        <span>2D TOPOLOGICAL SCHEMATIC</span>
      </div>
    </div>
  );
};
