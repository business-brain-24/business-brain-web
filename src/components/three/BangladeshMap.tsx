"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrameloop, useSceneReady } from "./LazyScene";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Html, Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { divisions } from "@/lib/bangladesh-geo";

export type RegionStat = { name: string; pct: number; orders: number; reps: number; top: string };

const DEPTH = 0.16;
const LIFT = 0.14;
const BASE = new THREE.Color("#D9DCE2");
const HOVER = new THREE.Color("#F4F5F7");
const ORANGE = new THREE.Color("#FF6B2C");
const GREEN = "#12B76A";
const RED = "#F04438";

/* Where the last press started, so releasing a rotate-drag over a division doesn't select it. */
const press = { x: 0, y: 0 };
const wasDrag = (e: MouseEvent) => Math.hypot(e.clientX - press.x, e.clientY - press.y) > 6;

type Shaped = { name: string; geometry: THREE.ExtrudeGeometry; center: THREE.Vector3; outlines: [number, number, number][][] };

function useDivisionShapes(): Shaped[] {
  return useMemo(
    () =>
      divisions.map((d) => {
        const shapes = d.rings.map((ring) => new THREE.Shape(ring.map(([x, y]) => new THREE.Vector2(x, y))));
        const geometry = new THREE.ExtrudeGeometry(shapes, { depth: DEPTH, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.012, bevelSegments: 1 });
        // label anchor: average of the largest ring, which is good enough for these compact shapes
        const main = d.rings.reduce((a, b) => (b.length > a.length ? b : a));
        const cx = main.reduce((s, p) => s + p[0], 0) / main.length;
        const cy = main.reduce((s, p) => s + p[1], 0) / main.length;
        // map plane is XY with Y = north; the group is rotated so this becomes X / -Z on screen
        const outlines = d.rings.map((r) => r.map(([x, y]) => [x, y, DEPTH + 0.017] as [number, number, number]));
        return { name: d.name, geometry, center: new THREE.Vector3(cx, cy, DEPTH), outlines };
      }),
    [],
  );
}

function Division({
  shape,
  stat,
  hovered,
  selected,
  onHover,
  onSelect,
  compact,
}: {
  shape: Shaped;
  stat?: RegionStat;
  hovered: boolean;
  selected: boolean;
  compact: boolean;
  onHover: (n: string | null) => void;
  onSelect: (n: string) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const cap = useRef<THREE.MeshStandardMaterial>(null);
  const ring = useRef<THREE.Mesh>(null);
  const behind = (stat?.pct ?? 100) < 90;

  useFrame((state, dt) => {
    const k = 1 - Math.pow(0.001, dt);
    if (group.current) group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, hovered || selected ? LIFT : 0, k);
    if (cap.current) cap.current.color.lerp(selected ? ORANGE : hovered ? HOVER : BASE, k);
    if (ring.current) {
      const p = (state.clock.elapsedTime * 0.6) % 1;
      ring.current.scale.setScalar(1 + p * 2.4);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.55 * (1 - p);
    }
  });

  return (
    <group ref={group}>
      <mesh
        geometry={shape.geometry}
        castShadow
        receiveShadow
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          onHover(shape.name);
        }}
        onPointerOut={() => onHover(null)}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          if (wasDrag(e.nativeEvent)) return;
          onSelect(shape.name);
        }}
      >
        <meshStandardMaterial ref={cap} attach="material-0" color={BASE} roughness={0.8} metalness={0.02} />
        <meshStandardMaterial attach="material-1" color="#8E95A3" roughness={0.9} />
      </mesh>
      {shape.outlines.map((pts, i) => (
        <Line key={i} points={pts} color={selected ? "#C2410C" : "#9AA1AE"} lineWidth={selected ? 1.6 : 1} />
      ))}

      {/* status beacon */}
      <group position={[shape.center.x, shape.center.y, DEPTH + 0.03]}>
        <mesh>
          <circleGeometry args={[0.055, 24]} />
          <meshBasicMaterial color={behind ? RED : GREEN} />
        </mesh>
        <mesh ref={ring} position={[0, 0, -0.001]}>
          <ringGeometry args={[0.06, 0.08, 32]} />
          <meshBasicMaterial color={behind ? RED : GREEN} transparent depthWrite={false} />
        </mesh>
      </group>

      {stat && (!compact || selected || hovered) && (
        <Html position={[shape.center.x + 0.1, shape.center.y, DEPTH + 0.05]} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <div className="-translate-y-1/2 whitespace-nowrap rounded-full bg-[#0B0D12]/80 px-2 py-1 text-[12px] leading-none text-white/85 backdrop-blur-sm">
            {stat.name} <span className={behind ? "text-[#F97066]" : "text-white/50"}>{stat.pct}%</span>
          </div>
        </Html>
      )}
    </group>
  );
}

function Truck({ from, to, speed, offset }: { from: THREE.Vector3; to: THREE.Vector3; speed: number; offset: number }) {
  const dot = useRef<THREE.Mesh>(null);
  const curve = useMemo(() => {
    const a = from.clone().setZ(DEPTH + 0.04);
    const b = to.clone().setZ(DEPTH + 0.04);
    const mid = a.clone().lerp(b, 0.5).setZ(DEPTH + 0.25 + a.distanceTo(b) * 0.18);
    return new THREE.QuadraticBezierCurve3(a, mid, b);
  }, [from, to]);
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 40, 0.006, 6, false), [curve]);

  useFrame((state) => {
    if (!dot.current) return;
    const t = (state.clock.elapsedTime * speed + offset) % 1;
    dot.current.position.copy(curve.getPoint(t));
  });

  return (
    <group>
      <mesh geometry={tube}>
        <meshBasicMaterial color="#FF6B2C" transparent opacity={0.4} />
      </mesh>
      <mesh ref={dot}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color="#FF6B2C" />
      </mesh>
    </group>
  );
}

function MapScene({
  stats,
  selected,
  onSelect,
  order,
}: {
  stats: RegionStat[];
  selected: string | null;
  onSelect: (n: string | null) => void;
  order: { region: string; text: string; who: string; key: number };
}) {
  const shapes = useDivisionShapes();
  const [hovered, setHovered] = useState<string | null>(null);
  const compact = useThree((st) => st.size.width) < 520;
  const byName = (n: string) => shapes.find((s) => s.name === n)!.center;
  const hub = byName("Dhaka");
  const at = byName(order.region);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.4]}>
      {shapes.map((s) => (
        <Division
          key={s.name}
          shape={s}
          stat={stats.find((x) => x.name === s.name)}
          hovered={hovered === s.name}
          selected={selected === s.name}
          onHover={setHovered}
          compact={compact}
          onSelect={(n) => onSelect(selected === n ? null : n)}
        />
      ))}
      {["Chattogram", "Rajshahi", "Sylhet", "Khulna"].map((n, i) => (
        <Truck key={n} from={hub} to={byName(n)} speed={0.16 + i * 0.03} offset={i * 0.27} />
      ))}
      <Html key={order.key} position={[at.x, at.y, DEPTH + 0.5]} center zIndexRange={[30, 0]} style={{ pointerEvents: "none" }}>
        <div className="animate-[bb-pop_0.35s_cubic-bezier(0.22,1,0.36,1)] whitespace-nowrap rounded-[10px] bg-white px-3 py-2 text-[12px] text-ink shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-orange align-middle" />
          <span className="font-medium">{order.text}</span>
          <span className="ml-2 text-muted">{order.who}</span>
        </div>
      </Html>
    </group>
  );
}

const CAMERA: [number, number, number] = [0.4, 5.5, 4.4];

/* Pull the camera back on tall, narrow frames so the whole country stays in view. */
function FitCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const k = Math.min(Math.max(1.25 / (size.width / size.height), 1), 2.2);
    camera.position.set(CAMERA[0] * k, CAMERA[1] * k, CAMERA[2] * k);
    camera.lookAt(0, 0, 0.4);
  }, [camera, size.width, size.height]);
  return null;
}

/** Tells LazyScene the canvas has drawn, so the static map can fade out. */
function FirstFrame() {
  const ready = useSceneReady();
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    ready();
  });
  return null;
}

export default function BangladeshMap(props: {
  stats: RegionStat[];
  selected: string | null;
  onSelect: (n: string | null) => void;
  order: { region: string; text: string; who: string; key: number };
}) {
  const frameloop = useFrameloop();
  // on touch screens a drag should scroll the page, so only tapping is interactive there
  const [coarse, setCoarse] = useState(false);
  useEffect(() => setCoarse(window.matchMedia("(pointer: coarse)").matches), []);

  return (
    <Canvas
      frameloop={frameloop}
      shadows
      dpr={[1, 1.75]}
      camera={{ position: CAMERA, fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      onPointerDown={(e) => {
        press.x = e.clientX;
        press.y = e.clientY;
      }}
      onPointerMissed={(e) => !wasDrag(e) && props.onSelect(null)}
      style={{ touchAction: coarse ? "pan-y" : "none" }}
    >
      <FirstFrame />
      <ambientLight intensity={0.55} />
      <directionalLight position={[-4, 8, 3]} intensity={1.4} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[5, 3, -4]} intensity={0.35} color="#FFB08A" />
      <FitCamera />
      <MapScene {...props} />
      <ContactShadows position={[0, -0.02, 0.4]} opacity={0.8} scale={12} blur={2.4} far={2} color="#000000" />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={!coarse}
        minPolarAngle={0.25}
        maxPolarAngle={1.05}
        minAzimuthAngle={-0.7}
        maxAzimuthAngle={0.7}
        rotateSpeed={0.6}
        target={[0, 0, 0.4]}
      />
    </Canvas>
  );
}
