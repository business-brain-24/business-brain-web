"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const ORANGE = new THREE.Color("#FF6B2C");
const INK = new THREE.Color("#3b404b");
const GREY = new THREE.Color("#b9bec8");

/** Procedural brain: two hemispheres of points with folded "gyri". */
function useBrainGeometry(count: number) {
  return useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const pts: THREE.Vector3[] = [];
    const c = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      let x = Math.sin(phi) * Math.cos(theta);
      let y = Math.cos(phi);
      let z = Math.sin(phi) * Math.sin(theta);

      // folds
      const fold = 1 + 0.07 * Math.sin(theta * 9 + phi * 3) * Math.sin(phi * 7) + 0.035 * Math.sin(theta * 23) * Math.cos(phi * 11);
      const shell = 0.82 + Math.random() * 0.18;
      x *= 1.3 * fold * shell;
      y *= 0.95 * fold * shell;
      z *= 1.05 * fold * shell;
      // flatten bottom, split hemispheres
      if (y < -0.35) y = -0.35 + (y + 0.35) * 0.45;
      x += Math.sign(x) * 0.07;
      // temporal lobe bulge
      if (y < 0 && Math.abs(z) < 0.6) x *= 1.05;

      positions.set([x, y, z], i * 3);
      pts.push(new THREE.Vector3(x, y, z));
      seeds[i] = Math.random();

      const glow = Math.max(0, Math.sin(theta * 6 + phi * 4)) ** 6;
      c.copy(GREY).lerp(INK, Math.random() * 0.35).lerp(ORANGE, glow * 0.9);
      colors.set([c.r, c.g, c.b], i * 3);
    }

    // neural links between near neighbours
    const linePos: number[] = [];
    const sample = Math.min(count, 900);
    for (let i = 0; i < sample; i++) {
      const a = pts[(i * 7) % count];
      for (let j = i + 1; j < sample; j += 3) {
        const b = pts[(j * 7) % count];
        if (a.distanceToSquared(b) < 0.018) linePos.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    return { positions, colors, seeds, lines: new Float32Array(linePos) };
  }, [count]);
}

function Brain({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);
  const { positions, colors, lines } = useBrainGeometry(count);
  const { pointer } = useThree();

  useFrame((state, dt) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y += dt * 0.12;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -0.15 + pointer.y * 0.18, 0.05);
    group.current.position.y = Math.sin(t * 0.8) * 0.04;
    const s = 1 + Math.sin(t * 1.6) * 0.008;
    group.current.scale.setScalar(s);
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.022} vertexColors transparent opacity={0.95} sizeAttenuation depthWrite={false} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#FF6B2C" transparent opacity={0.16} />
      </lineSegments>
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color="#FF6B2C" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

type NodeDef = { label: string; pos: [number, number, number] };

/** Module nodes connected to the brain by curves with travelling pulses. */
function Connections({ nodes, showLabels }: { nodes: NodeDef[]; showLabels: boolean }) {
  const curves = useMemo(
    () =>
      nodes.map((n) => {
        const end = new THREE.Vector3(...n.pos);
        const start = end.clone().normalize().multiplyScalar(1.05);
        const mid = start.clone().lerp(end, 0.5).add(new THREE.Vector3(0, 0.35, 0));
        return new THREE.QuadraticBezierCurve3(start, mid, end);
      }),
    [nodes],
  );
  const pulses = useRef<THREE.Mesh[]>([]);
  const tubes = useMemo(() => curves.map((c) => new THREE.TubeGeometry(c, 48, 0.006, 6, false)), [curves]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    curves.forEach((curve, i) => {
      const m = pulses.current[i];
      if (!m) return;
      const p = (t * 0.28 + i * 0.17) % 1;
      // alternate direction: inbound and outbound data
      const k = i % 2 === 0 ? p : 1 - p;
      m.position.copy(curve.getPoint(k));
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.sin(p * Math.PI);
    });
  });

  return (
    <group>
      {nodes.map((n, i) => (
        <group key={n.label}>
          <mesh geometry={tubes[i]}>
            <meshBasicMaterial color="#FF6B2C" transparent opacity={0.35} />
          </mesh>
          <mesh
            ref={(el) => {
              if (el) pulses.current[i] = el;
            }}
          >
            <sphereGeometry args={[0.028, 12, 12]} />
            <meshBasicMaterial color="#FF6B2C" transparent />
          </mesh>
          <mesh position={n.pos}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshBasicMaterial color="#0B0D12" />
          </mesh>
          {showLabels && (
            <Html position={n.pos} center zIndexRange={[10, 0]}>
              <div className="pointer-events-none mt-8 whitespace-nowrap rounded-full border border-line bg-white/95 px-2.5 py-1 text-[11px] font-medium text-ink shadow-[0_6px_18px_rgba(11,13,18,0.08)] sm:px-3 sm:text-[12px]">
                {n.label}
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}

function Rig() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.35, 0.04);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

const DESKTOP_NODES: NodeDef[] = [
  { label: "Accounting", pos: [-2.6, 0.9, 0.2] },
  { label: "Inventory", pos: [2.6, 1.0, -0.2] },
  { label: "Procurement", pos: [-2.9, -0.4, 0.4] },
  { label: "HRMS", pos: [2.9, -0.3, 0.3] },
  { label: "Payroll", pos: [-2.0, -1.4, 0.6] },
  { label: "Manufacturing", pos: [2.1, -1.4, 0.5] },
  { label: "Sales", pos: [-1.2, 1.9, -0.3] },
  { label: "POS", pos: [1.3, 1.9, -0.4] },
];

export default function BrainScene({ compact = false }: { compact?: boolean }) {
  const nodes = compact ? DESKTOP_NODES.slice(0, 6).map((n) => ({ ...n, pos: [n.pos[0] * 0.62, n.pos[1] * 0.9, n.pos[2]] as [number, number, number] })) : DESKTOP_NODES;
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, compact ? 5.6 : 6], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Brain count={compact ? 4200 : 7500} />
      <Connections nodes={nodes} showLabels />
      <Rig />
    </Canvas>
  );
}
