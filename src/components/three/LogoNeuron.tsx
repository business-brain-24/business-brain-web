"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const ORANGE = "#F47A2A";
const NAVY = "#233A80";

/* The logo's five modules, in logo space (hub at the origin, y up), scaled to scene units. */
const S = 1 / 42;
const MODULES = [
  { p: [-1, 75], shape: "sphere" },
  { p: [62, 46], shape: "box" },
  { p: [46, -42], shape: "box" },
  { p: [-48, -41], shape: "sphere" },
  { p: [-65, 54], shape: "box" },
].map((m, i) => ({ ...m, pos: new THREE.Vector3(m.p[0] * S, m.p[1] * S, (i % 2 ? 0.35 : -0.35)) }));

/* A soft shell of small "neurons" around the mark. */
function useNeurons(count: number) {
  return useMemo(() => {
    const pts: THREE.Vector3[] = [];
    let seed = 7;
    const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    while (pts.length < count) {
      const v = new THREE.Vector3(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1);
      const l = v.length();
      if (l < 0.2 || l > 1) continue;
      v.normalize().multiplyScalar(2.3 + r() * 1.1);
      v.z *= 0.7;
      pts.push(v);
    }
    return { positions: new Float32Array(pts.flatMap((p) => [p.x, p.y, p.z])) };
  }, [count]);
}

function Spoke({ to, delay }: { to: THREE.Vector3; delay: number }) {
  const pulse = useRef<THREE.Mesh>(null);
  const { geom, curve } = useMemo(() => {
    const c = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), to);
    return { curve: c, geom: new THREE.TubeGeometry(c, 1, 0.13, 20, false) };
  }, [to]);
  useFrame(({ clock }) => {
    if (!pulse.current) return;
    const t = ((clock.elapsedTime * 0.55 + delay) % 1 + 1) % 1;
    pulse.current.position.copy(curve.getPoint(1 - t)); // signals travel into the hub
    pulse.current.scale.setScalar(0.6 + Math.sin(t * Math.PI) * 0.6);
  });
  return (
    <group>
      <mesh geometry={geom}>
        <meshPhysicalMaterial color={NAVY} roughness={0.25} metalness={0.4} clearcoat={1} clearcoatRoughness={0.15} />
      </mesh>
      <mesh ref={pulse}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color="#FFE1CC" toneMapped={false} />
      </mesh>
    </group>
  );
}

function Mark() {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const neurons = useNeurons(110);

  useFrame(({ clock, pointer }, dt) => {
    const t = clock.elapsedTime;
    if (group.current) {
      // lean towards the cursor
      const k = 1 - Math.pow(0.02, dt);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.25, k);
      // a slow sway, never far enough to lose the logo's face
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, Math.sin(t * 0.35) * 0.45 + pointer.x * 0.25, k);
    }
    if (ring.current) {
      const p = (t * 0.45) % 1;
      ring.current.scale.setScalar(1 + p * 2.6);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - p);
    }
  });

  return (
    <group ref={group}>
      {/* neuron field */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[neurons.positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={ORANGE} size={0.07} sizeAttenuation transparent opacity={0.85} depthWrite={false} />
      </points>

      {/* spokes */}
      {MODULES.map((m, i) => (
        <Spoke key={i} to={m.pos} delay={i * 0.21} />
      ))}

      {/* modules */}
      {MODULES.map((m, i) => (
        <Float key={i} speed={1.6} rotationIntensity={0.35} floatIntensity={0.35} floatingRange={[-0.08, 0.08]}>
          <group position={m.pos}>
            {m.shape === "sphere" ? (
              <mesh castShadow>
                <sphereGeometry args={[0.56, 48, 48]} />
                <meshPhysicalMaterial color={ORANGE} roughness={0.22} clearcoat={1} clearcoatRoughness={0.12} sheen={0.4} />
              </mesh>
            ) : (
              <RoundedBox args={[1.12, 1.1, 0.7]} radius={0.24} smoothness={6} castShadow>
                <meshPhysicalMaterial color={ORANGE} roughness={0.22} clearcoat={1} clearcoatRoughness={0.12} sheen={0.4} />
              </RoundedBox>
            )}
          </group>
        </Float>
      ))}

      {/* hub */}
      <mesh>
        <torusGeometry args={[0.3, 0.13, 32, 64]} />
        <meshPhysicalMaterial color={NAVY} roughness={0.2} metalness={0.5} clearcoat={1} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.17, 32, 32]} />
        <meshStandardMaterial color="#ffffff" emissive="#FFD2B3" emissiveIntensity={0.6} />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.44, 0.48, 64]} />
        <meshBasicMaterial color={ORANGE} transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function LogoNeuron() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => setCoarse(window.matchMedia("(pointer: coarse)").matches), []);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 7.6], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: coarse ? "pan-y" : "none", cursor: coarse ? undefined : "grab" }}
      aria-label="Business Brain 24 — drag to rotate"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <directionalLight position={[-4, -2, 2]} intensity={0.5} color="#FFB08A" />
      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 4, 4]} scale={[8, 2, 1]} />
        <Lightformer intensity={1.2} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer intensity={0.8} color="#FFB08A" position={[5, -2, 1]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} />
      </Environment>
      <Mark />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={!coarse}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.7}
        minPolarAngle={Math.PI / 2 - 0.7}
        maxPolarAngle={Math.PI / 2 + 0.7}
        minAzimuthAngle={-0.9}
        maxAzimuthAngle={0.9}
      />
    </Canvas>
  );
}
