"use client";

import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;
const HUB = { x: 128, y: 122 };
const NAVY = "#233A80";
const ORANGE = "#F47A2A";

/* The five modules around the hub, as in the logo. */
const nodes = [
  { x: 127, y: 47, shape: "circle" as const },
  { x: 190, y: 76, shape: "square" as const },
  { x: 174, y: 164, shape: "square" as const },
  { x: 80, y: 163, shape: "circle" as const },
  { x: 63, y: 68, shape: "square" as const },
];

/** The Business Brain 24 mark, brought to life: modules pop in, data flows to the hub, the hub pulses. */
export default function LogoHub({ className }: { className?: string }) {
  return (
    <svg viewBox="30 12 196 196" className={className} role="img" aria-label="Business Brain 24">
      {nodes.map((n, i) => {
        const d = `M${n.x} ${n.y} L${HUB.x} ${HUB.y}`;
        return (
          <g key={i}>
            <motion.path
              d={`M${HUB.x} ${HUB.y} L${n.x} ${n.y}`}
              stroke={NAVY}
              strokeWidth={11}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease, delay: 0.4 + i * 0.08 }}
            />
            <circle r={3.2} fill="#fff">
              <animateMotion dur="2.4s" begin={`${1.4 + i * 0.45}s`} repeatCount="indefinite" path={d} />
            </circle>
          </g>
        );
      })}

      {nodes.map((n, i) => (
        <motion.g
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, y: [0, i % 2 ? 2.5 : -2.5, 0] }}
          transition={{
            scale: { type: "spring", stiffness: 260, damping: 16, delay: 0.8 + i * 0.09 },
            opacity: { duration: 0.2, delay: 0.8 + i * 0.09 },
            y: { duration: 4 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: 1.6 },
          }}
          style={{ transformOrigin: `${n.x}px ${n.y}px`, transformBox: "view-box" }}
        >
          {n.shape === "circle" ? (
            <circle cx={n.x} cy={n.y} r={23} fill={ORANGE} />
          ) : (
            <rect x={n.x - 23.5} y={n.y - 23} width={47} height={46} rx={12} fill={ORANGE} />
          )}
        </motion.g>
      ))}

      {/* hub */}
      <motion.circle
        cx={HUB.x}
        cy={HUB.y}
        r={16}
        fill="none"
        stroke={ORANGE}
        strokeWidth={2}
        initial={{ opacity: 0, scale: 1 }}
        animate={{ scale: [1, 2.1], opacity: [0.5, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 1.4 }}
        style={{ transformOrigin: `${HUB.x}px ${HUB.y}px`, transformBox: "view-box" }}
      />
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.25 }}
        style={{ transformOrigin: `${HUB.x}px ${HUB.y}px`, transformBox: "view-box" }}
      >
        <circle cx={HUB.x} cy={HUB.y} r={16} fill={NAVY} />
        <circle cx={HUB.x} cy={HUB.y} r={7} fill="#fff" />
      </motion.g>
    </svg>
  );
}
