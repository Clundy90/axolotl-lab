import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * ToyAxolotl Component (Model Only)
 * Purely visual component managing internal animations (tail, legs, gills).
 * Global movement has been extracted to a controller.
 *
 * Updates [2026-05-02]:
 * - Removed meshPhysicalMaterial and Clearcoat to eliminate excess gloss.
 * - Boosted emissiveIntensity to 5.0 for high-visibility "magical" sparkles.
 * - Restored full file structure and comprehensive project comments.
 */

export interface ColorPalette {
  name: string;
  main: string;
  light: string;
  dark: string;
  sparkleColor?: string;
  glowIntensity?: number;
}

interface AxolotlModelProps {
  isPetting: boolean;
  isFeeding: boolean;
  colorPalette: ColorPalette;
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

/**
 * Animated breathing bubbles that rise from the axolotl's head area.
 * Uses a fixed pool of bubbles to keep performance high.
 */
function BreathBubbles() {
  const groupRef = useRef<THREE.Group>(null);

  const bubbleData = useMemo(() => {
    return Array.from({ length: 5 }).map(() => ({
      x: (Math.random() - 0.5) * 0.6,
      y: Math.random() * 0.5,
      z: (Math.random() - 0.5) * 0.4,
      speed: 0.8 + Math.random() * 1.2,
      scale: 0.02 + Math.random() * 0.03,
    }));
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((bubble, i) => {
      const data = bubbleData[i];
      bubble.position.y += data.speed * delta;
      bubble.position.x += Math.sin(bubble.position.y * 5) * 0.005;
      if (bubble.position.y > 2.0) {
        bubble.position.y = 0;
        bubble.position.x = data.x;
      }
    });
  });

  return (
    <group position={[0, 0.2, 0.6]} ref={groupRef}>
      {bubbleData.map((data, i) => (
        <mesh key={i} position={[data.x, data.y, data.z]} scale={data.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.4}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Leg component responsible for the tucked swimming animation.
 */
function Leg({ position, phase, mirror, colors }: any) {
  const hipRef = useRef<THREE.Group>(null);
  const kneeRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const stroke = Math.sin(t * 4.0 + phase);

    if (hipRef.current) {
      hipRef.current.rotation.y = stroke * 0.1;
      hipRef.current.rotation.z = mirror ? -0.2 : 0.2;
      hipRef.current.rotation.x = -1.4 + stroke * 0.1;
    }
    if (kneeRef.current) {
      kneeRef.current.rotation.x = stroke * 0.2 + 0.1;
    }
  });

  return (
    <group position={position}>
      <group ref={hipRef}>
        <mesh position={[0, -0.1, 0]}>
          <capsuleGeometry args={[0.06, 0.2, 8, 8]} />
          <meshStandardMaterial color={colors.main} roughness={0.7} />
        </mesh>
        <group position={[0, -0.22, 0]} ref={kneeRef}>
          <mesh position={[0, -0.1, 0]}>
            <capsuleGeometry args={[0.05, 0.18, 8, 8]} />
            <meshStandardMaterial color={colors.main} roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.22, 0.04]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color={colors.main} roughness={0.7} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/**
 * Articulated tail utilizing a traveling sine wave and glowing dorsal fins.
 */
function Tail({ colors }: { colors: ColorPalette }) {
  const refs = [
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
  ];

  useFrame(({ clock }) => {
    const wave = clock.getElapsedTime() * 4.0;
    refs.forEach((ref, i) => {
      if (ref.current)
        ref.current.rotation.y = Math.sin(wave - i * 0.6) * (0.12 + i * 0.08);
    });
  });

  // Reusable fin material with sparkle logic
  const finMat = (
    <meshStandardMaterial
      color={colors.dark}
      transparent
      opacity={0.6}
      roughness={0.5}
      emissive={colors.sparkleColor || colors.light}
      emissiveIntensity={4.0}
    />
  );

  return (
    <group position={[0, 0, -0.55]}>
      {/* Segment 0 */}
      <group ref={refs[0]}>
        <mesh position={[0, 0, -0.28]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.28, 0.56, 16]} />
          <meshStandardMaterial color={colors.main} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.32, -0.28]} scale={[0.1, 1, 1.8]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          {finMat}
        </mesh>

        {/* Segment 1 */}
        <group position={[0, 0, -0.56]} ref={refs[1]}>
          <mesh position={[0, 0, -0.24]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.28, 0.18, 0.48, 16]} />
            <meshStandardMaterial color={colors.main} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.22, -0.24]} scale={[0.1, 1, 1.8]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            {finMat}
          </mesh>

          {/* Segment 2 */}
          <group position={[0, 0, -0.48]} ref={refs[2]}>
            <mesh position={[0, 0, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.18, 0.08, 0.4, 14]} />
              <meshStandardMaterial color={colors.main} roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.12, -0.2]} scale={[0.1, 1, 1.8]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              {finMat}
            </mesh>

            {/* Segment 3 - Paddle */}
            <group position={[0, 0, -0.4]} ref={refs[3]}>
              <mesh position={[0, 0, -0.15]} scale={[0.1, 1, 2]}>
                <sphereGeometry args={[0.22, 16, 16]} />
                <meshStandardMaterial
                  color={colors.dark}
                  transparent
                  opacity={0.7}
                  emissive={colors.sparkleColor || colors.light}
                  emissiveIntensity={5.0}
                />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

/**
 * Gills with high emissive intensity to simulate glowing sparkles.
 */
function GillSet({ side, colors }: { side: 1 | -1; colors: ColorPalette }) {
  const refs = [
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
  ];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    refs.forEach((ref, i) => {
      if (ref.current)
        ref.current.rotation.z =
          side * (0.28 + Math.sin(t * 1.1 + i * 1.3) * 0.14);
    });
  });

  return (
    <group
      position={[side * 0.5, 0.05, -0.05]}
      rotation={[0, side * 0.3, -side * 0.2]}
    >
      {[0.14, 0, -0.14].map((dz, i) => (
        <group key={i} ref={refs[i]} position={[0, 0, dz]}>
          <mesh position={[side * 0.1, 0.28, 0]} rotation={[0, 0, side * -0.2]}>
            <capsuleGeometry args={[0.038, 0.42, 8, 8]} />
            <meshStandardMaterial
              color={colors.dark}
              emissive={colors.sparkleColor || colors.light}
              emissiveIntensity={colors.glowIntensity || 5.0}
            />
          </mesh>
          <mesh position={[side * 0.2, 0.4, 0]} rotation={[0, 0, side * -0.5]}>
            <capsuleGeometry args={[0.022, 0.18, 6, 6]} />
            <meshStandardMaterial color={colors.dark} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Main Model ──────────────────────────────────────────────────────────────

export default function ToyAxolotl({
  isPetting,
  isFeeding,
  colorPalette,
}: AxolotlModelProps) {
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (bodyRef.current) bodyRef.current.rotation.z = Math.sin(t * 4.0) * 0.04;
    if (headRef.current)
      headRef.current.rotation.x = isFeeding ? -0.2 : Math.sin(t * 1.3) * 0.05;
  });

  return (
    <group scale={0.65}>
      <Tail colors={colorPalette} />

      {/* Body: Stripped of Physical Material for a soft matte look */}
      <mesh
        ref={bodyRef}
        position={[0, 0, 0.1]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <capsuleGeometry args={[0.42, 1.1, 28, 28]} />
        <meshStandardMaterial color={colorPalette.main} roughness={0.7} />
      </mesh>

      <group ref={headRef} position={[0, 0.04, 0.9]}>
        <BreathBubbles />
        <mesh castShadow>
          <sphereGeometry args={[0.55, 28, 28]} />
          <meshStandardMaterial color={colorPalette.main} roughness={0.7} />
        </mesh>

        {/* Eyes (Preserved from original code) */}
        {([-1, 1] as const).map((s) => (
          <group
            key={s}
            position={[s * 0.32, 0.2, 0.42]}
            rotation={[0, s * 0.4, 0]}
          >
            <mesh scale={[1, 1.2, 0.3]}>
              <sphereGeometry args={[0.14, 16, 16]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.1} />
            </mesh>
            <mesh position={[0.04, 0.06, 0.04]} scale={[1, 1, 0.2]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial
                color="white"
                emissive="white"
                emissiveIntensity={0.8}
              />
            </mesh>
          </group>
        ))}

        {/* Mouth */}
        {isFeeding || isPetting ? (
          <mesh position={[0, -0.15, 0.52]} scale={[1, 1, 0.3]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#2a0a10" roughness={0.8} />
          </mesh>
        ) : (
          <mesh position={[0, -0.15, 0.53]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.04, 0.015, 12, 24, Math.PI]} />
            <meshStandardMaterial color={colorPalette.dark} roughness={0.45} />
          </mesh>
        )}

        <GillSet side={1} colors={colorPalette} />
        <GillSet side={-1} colors={colorPalette} />
      </group>

      {/* Legs */}
      <Leg
        position={[0.38, -0.15, 0.45]}
        phase={0}
        mirror={false}
        colors={colorPalette}
      />
      <Leg
        position={[-0.38, -0.15, 0.45]}
        phase={Math.PI}
        mirror={true}
        colors={colorPalette}
      />
      <Leg
        position={[0.35, -0.15, -0.15]}
        phase={Math.PI}
        mirror={false}
        colors={colorPalette}
      />
      <Leg
        position={[-0.35, -0.15, -0.15]}
        phase={0}
        mirror={true}
        colors={colorPalette}
      />
    </group>
  );
}
