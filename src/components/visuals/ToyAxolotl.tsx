import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import * as THREE from "three";

interface ColorPalette {
  main: string;
  light: string;
  dark: string;
}

interface Props {
  isPetting: boolean;
  setIsPetting: (val: boolean) => void;
  isFeeding: boolean;
  colorPalette: ColorPalette;
}

const EYE_WHITE = "#fff8f0";
// Darkened the pupil/iris for a more striking "Designer/Anime" look
const PUPIL = "#121212";

// ─── Petting Particle System ──────────────────────────────────────────────────
// Generates multiple floating hearts at random offsets when isPetting is true.
function HeartParticles({ active }: { active: boolean }) {
  const hearts = useMemo(() => {
    if (!active) return [];
    return Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 3, // Spread out horizontally
      delay: Math.random() * 0.3, // Stagger the animations
      scale: 1 + Math.random() * 0.5,
    }));
  }, [active]);

  if (!active) return null;

  return (
    <>
      {hearts.map((h) => (
        <Html key={h.id} position={[h.x, 1.2, 0]} center>
          <div
            style={{
              fontSize: `${h.scale * 2}rem`,
              animation: `floatUpAndFade 1.2s ease-out ${h.delay}s forwards`,
              pointerEvents: "none",
              opacity: 0, // Starts invisible until animation delay hits
            }}
          >
            💖
            <style>
              {`
                @keyframes floatUpAndFade {
                  0% { transform: translateY(0) scale(0.5); opacity: 1; }
                  100% { transform: translateY(-50px) scale(1.2); opacity: 0; }
                }
              `}
            </style>
          </div>
        </Html>
      ))}
    </>
  );
}

// ─── Leg ──────────────────────────────────────────────────────────────────────
interface LegProps {
  position: [number, number, number];
  phase: number;
  mirror: boolean;
  colors: ColorPalette;
}

function Leg({ position, phase, mirror, colors }: LegProps) {
  const hipRef = useRef<THREE.Group>(null);
  const kneeRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const swing = Math.sin(t * 2.4 + phase) * 0.4;

    if (hipRef.current) {
      hipRef.current.rotation.x = swing;
      hipRef.current.rotation.z = (mirror ? 0.5 : -0.5) + swing * 0.15;
    }
    if (kneeRef.current) {
      // Knee bends opposite the hip for cute paddle motion
      kneeRef.current.rotation.x = -Math.abs(swing) * 0.7;
    }
  });

  return (
    <group position={position}>
      <group ref={hipRef}>
        <mesh position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.07, 0.22, 8, 8]} />
          <meshStandardMaterial color={colors.main} roughness={0.8} />
        </mesh>

        <group position={[0, -0.29, 0]} ref={kneeRef}>
          <mesh position={[0, -0.12, 0]}>
            <capsuleGeometry args={[0.055, 0.18, 8, 8]} />
            <meshStandardMaterial color={colors.main} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.25, 0.04]}>
            <sphereGeometry args={[0.072, 8, 8]} />
            <meshStandardMaterial color={colors.main} roughness={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ─── Tail ─────────────────────────────────────────────────────────────────────
// Articulated tail segments for a smooth swimming wave pattern.
function Tail({
  swimPhase,
  colors,
}: {
  swimPhase: React.MutableRefObject<number>;
  colors: ColorPalette;
}) {
  const j0 = useRef<THREE.Group>(null);
  const j1 = useRef<THREE.Group>(null);
  const j2 = useRef<THREE.Group>(null);
  const j3 = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const wag = Math.sin(t * 3.2 + swimPhase.current);

    if (j0.current) j0.current.rotation.y = wag * 0.08;
    if (j1.current) j1.current.rotation.y = wag * 0.18;
    if (j2.current) j2.current.rotation.y = wag * 0.3;
    if (j3.current) j3.current.rotation.y = wag * 0.45;
  });

  return (
    <group position={[0, 0, -0.55]}>
      <group ref={j0}>
        <mesh position={[0, 0, -0.28]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.3, 0.56, 16]} />
          <meshStandardMaterial color={colors.main} roughness={0.72} />
        </mesh>
        <mesh position={[0, 0.25, -0.28]}>
          <boxGeometry args={[0.06, 0.18, 0.52]} />
          <meshStandardMaterial
            color={colors.dark}
            transparent
            opacity={0.8}
            roughness={0.5}
          />
        </mesh>

        <group position={[0, 0, -0.56]} ref={j1}>
          <mesh position={[0, 0, -0.24]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.28, 0.2, 0.48, 16]} />
            <meshStandardMaterial color={colors.main} roughness={0.72} />
          </mesh>
          <mesh position={[0, 0.2, -0.24]}>
            <boxGeometry args={[0.05, 0.15, 0.44]} />
            <meshStandardMaterial
              color={colors.dark}
              transparent
              opacity={0.78}
              roughness={0.5}
            />
          </mesh>

          <group position={[0, 0, -0.48]} ref={j2}>
            <mesh position={[0, 0, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.18, 0.1, 0.4, 14]} />
              <meshStandardMaterial color={colors.main} roughness={0.72} />
            </mesh>
            <mesh position={[0, 0.14, -0.2]}>
              <boxGeometry args={[0.04, 0.12, 0.36]} />
              <meshStandardMaterial
                color={colors.dark}
                transparent
                opacity={0.75}
                roughness={0.5}
              />
            </mesh>

            <group position={[0, 0, -0.4]} ref={j3}>
              <mesh position={[0, 0, -0.18]}>
                <boxGeometry args={[0.6, 0.07, 0.34]} />
                <meshStandardMaterial
                  color={colors.dark}
                  transparent
                  opacity={0.76}
                  roughness={0.4}
                />
              </mesh>
              <mesh position={[0, 0, -0.18]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.025, 0.01, 0.34, 8]} />
                <meshStandardMaterial color={colors.dark} roughness={0.5} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

// ─── Gill Set ─────────────────────────────────────────────────────────────────
// Updated positioning to move them higher and slightly forward for a better profile.
function GillSet({ side, colors }: { side: 1 | -1; colors: ColorPalette }) {
  const refs = [
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
  ];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    refs.forEach((ref, i) => {
      if (!ref.current) return;
      // Gentle waving motion
      ref.current.rotation.z =
        side * (0.28 + Math.sin(t * 1.1 + i * 1.3) * 0.14);
      ref.current.rotation.x = Math.sin(t * 0.8 + i * 0.9) * 0.07;
    });
  });

  return (
    <group
      // side * 0.55 keeps them wide, 0.1 pushes them higher up the head
      position={[side * 0.55, 0.1, -0.05]}
      rotation={[0, side * 0.4, -side * 0.2]}
    >
      {[0.14, 0, -0.14].map((dz, i) => (
        <group key={i} ref={refs[i]} position={[0, 0, dz]}>
          {/* Main Gill Branch */}
          <mesh position={[side * 0.1, 0.28, 0]} rotation={[0, 0, side * -0.2]}>
            <capsuleGeometry args={[0.038, 0.42, 8, 8]} />
            <meshStandardMaterial color={colors.dark} roughness={0.55} />
          </mesh>
          {/* Decorative fluff/secondary branch */}
          <mesh position={[side * 0.2, 0.4, 0]} rotation={[0, 0, side * -0.5]}>
            <capsuleGeometry args={[0.022, 0.18, 6, 6]} />
            <meshStandardMaterial color={colors.dark} roughness={0.55} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Falling Worm Animation ───────────────────────────────────────────────────
function FallingWorm({ isFeeding }: { isFeeding: boolean }) {
  const wormRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!wormRef.current || !isFeeding) return;
    const fallSpeed = state.clock.getElapsedTime() * 2;
    wormRef.current.position.y = Math.max(0.1, 3 - (fallSpeed % 3));

    if (wormRef.current.position.y < 0.5) {
      wormRef.current.scale.setScalar(wormRef.current.position.y * 2);
    } else {
      wormRef.current.scale.setScalar(1);
    }
  });

  if (!isFeeding) return null;

  return (
    <mesh
      ref={wormRef}
      position={[0, 3, 1.2]}
      rotation={[Math.PI / 4, 0, Math.PI / 4]}
    >
      <capsuleGeometry args={[0.04, 0.15, 8, 8]} />
      <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
    </mesh>
  );
}

// ─── Main Axolotl ─────────────────────────────────────────────────────────────
export default function ToyAxolotl({
  isPetting,
  setIsPetting,
  isFeeding,
  colorPalette,
}: Props) {
  const rootRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Group>(null);
  const swimPhase = useRef(0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.28;
    if (!rootRef.current) return;

    const speedMult = isFeeding ? 0.3 : 1.0;
    const x = Math.sin(t) * 3.0 * speedMult;
    const y = Math.sin(t * 0.55) * 0.55 * speedMult;
    const z = Math.cos(t * 0.7) * 0.9 * speedMult;
    rootRef.current.position.set(x, y, z);

    const dx = Math.cos(t) * 3.0;
    const dz = -Math.sin(t * 0.7) * 0.9;

    if (isFeeding) {
      rootRef.current.rotation.y = THREE.MathUtils.lerp(
        rootRef.current.rotation.y,
        0,
        0.05,
      );
      rootRef.current.rotation.x = THREE.MathUtils.lerp(
        rootRef.current.rotation.x,
        0.2,
        0.05,
      );
    } else {
      rootRef.current.rotation.y = Math.atan2(dx, dz);
      rootRef.current.rotation.x = 0;
    }

    rootRef.current.rotation.z = -Math.sin(t) * 0.15 * speedMult;

    if (bodyRef.current) bodyRef.current.rotation.z = Math.sin(t * 3.8) * 0.034;
    if (headRef.current)
      headRef.current.rotation.x = isFeeding ? -0.2 : Math.sin(t * 1.3) * 0.05;

    swimPhase.current = t;
  });

  return (
    <Float speed={0.5} rotationIntensity={0.0} floatIntensity={0.04}>
      <group
        ref={rootRef}
        onPointerDown={() => {
          setIsPetting(true);
          setTimeout(() => setIsPetting(false), 2000);
        }}
      >
        <HeartParticles active={isPetting} />
        <FallingWorm isFeeding={isFeeding} />
        <Tail swimPhase={swimPhase} colors={colorPalette} />

        {/* ── Body ── */}
        <mesh ref={bodyRef} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <capsuleGeometry args={[0.52, 1.1, 28, 28]} />
          <meshStandardMaterial color={colorPalette.main} roughness={0.6} />
        </mesh>

        <mesh position={[0, -0.27, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.36, 0.72, 16, 16]} />
          <meshStandardMaterial color={colorPalette.light} roughness={0.75} />
        </mesh>

        {/* ── Head ── */}
        <group ref={headRef} position={[0, 0.04, 0.9]}>
          <mesh castShadow>
            <sphereGeometry args={[0.6, 28, 28]} />
            <meshStandardMaterial color={colorPalette.main} roughness={0.6} />
          </mesh>

          {/* ── Anime Eyes ── */}
          {/* Layered spheres to create depth and that "shining" anime effect */}
          {([-1, 1] as const).map((s) => (
            <group
              key={s}
              position={[s * 0.32, 0.25, 0.48]}
              rotation={[0, s * 0.2, 0]}
            >
              {/* White Sclera */}
              <mesh>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color={EYE_WHITE} roughness={0.1} />
              </mesh>
              {/* Large Dark Iris/Pupil - Oval scale for anime style */}
              <mesh position={[0, 0, 0.08]} scale={[1, 1.2, 1]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color={PUPIL} roughness={0.2} />
              </mesh>
              {/* Primary Glint (Large Sparkle) */}
              <mesh position={[0.04, 0.05, 0.13]}>
                <sphereGeometry args={[0.035, 8, 8]} />
                <meshStandardMaterial
                  color="white"
                  emissive="white"
                  emissiveIntensity={0.6}
                />
              </mesh>
              {/* Secondary Glint (Small soft sparkle) */}
              <mesh position={[-0.03, -0.04, 0.13]}>
                <sphereGeometry args={[0.015, 8, 8]} />
                <meshStandardMaterial color="white" transparent opacity={0.6} />
              </mesh>
            </group>
          ))}

          {/* ── Dynamic Mouth ── */}
          {isFeeding ? (
            <mesh position={[0, -0.15, 0.56]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#2a0a10" roughness={0.8} />
            </mesh>
          ) : (
            <mesh position={[0, -0.15, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.05, 0.015, 12, 24, Math.PI]} />
              <meshStandardMaterial
                color={colorPalette.dark}
                roughness={0.45}
              />
            </mesh>
          )}

          <GillSet side={1} colors={colorPalette} />
          <GillSet side={-1} colors={colorPalette} />
        </group>

        {/* ── Legs ── */}
        <Leg
          position={[0.52, -0.32, 0.3]}
          phase={0}
          mirror={false}
          colors={colorPalette}
        />
        <Leg
          position={[-0.52, -0.32, 0.3]}
          phase={Math.PI}
          mirror={true}
          colors={colorPalette}
        />
        <Leg
          position={[0.48, -0.32, -0.28]}
          phase={Math.PI}
          mirror={false}
          colors={colorPalette}
        />
        <Leg
          position={[-0.48, -0.32, -0.28]}
          phase={0}
          mirror={true}
          colors={colorPalette}
        />
      </group>
    </Float>
  );
}
