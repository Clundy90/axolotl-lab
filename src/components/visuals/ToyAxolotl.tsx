import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * ToyAxolotl Component (Model Only)
 * Purely visual component managing internal animations (tail, legs, gills).
 * Global movement has been extracted to a controller.
 *
 * Updates [2026-05-01]:
 * - Replaced blocky dorsal fins with organic flattened spheres.
 * - Adjusted leg rotation axes so limbs tuck backwards organically while swimming.
 * - Added a BreathBubbles component for ambient breathing effects from the gills.
 * - Maintained all valid structural and animation comments per project standards.
 */

export interface ColorPalette {
  main: string;
  light: string;
  dark: string;
}

interface AxolotlModelProps {
  isPetting: boolean;
  isFeeding: boolean;
  colorPalette: ColorPalette;
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

/**
 * Animated breathing bubbles that rise from the axolotl's head area.
 * Uses a fixed pool of bubbles to keep performance high, recycling them
 * back to the bottom when they reach a certain height.
 */
function BreathBubbles() {
  const groupRef = useRef<THREE.Group>(null);

  // Memoize the initial random states of our bubbles so they don't re-roll on every render.
  const bubbleData = useMemo(() => {
    return Array.from({ length: 5 }).map(() => ({
      x: (Math.random() - 0.5) * 0.6, // Spread out across the width of the head
      y: Math.random() * 0.5, // Staggered starting heights
      z: (Math.random() - 0.5) * 0.4, // Slight depth variation
      speed: 0.8 + Math.random() * 1.2, // Random rising speeds
      scale: 0.02 + Math.random() * 0.03, // Tiny bubble sizes
    }));
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Animate each bubble independently
    groupRef.current.children.forEach((bubble, i) => {
      const data = bubbleData[i];
      // Move bubble up based on its individual speed
      bubble.position.y += data.speed * delta;
      // Add a tiny bit of horizontal drift for a realistic underwater wobble
      bubble.position.x += Math.sin(bubble.position.y * 5) * 0.005;

      // Recycle the bubble back to the source when it floats too high
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
          {/* Transparent, shiny white material for a soapy/glass bubble look */}
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.4}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Leg component responsible for the tucked swimming animation.
 * The hierarchy has been rotated so the default resting pose points backward,
 * mimicking how amphibians tuck their limbs to reduce drag while swimming.
 */
function Leg({ position, phase, mirror, colors }: any) {
  const hipRef = useRef<THREE.Group>(null);
  const kneeRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Subtle flutter stroke while tucked in
    const stroke = Math.sin(t * 4.0 + phase);

    if (hipRef.current) {
      // Small lateral flutter
      hipRef.current.rotation.y = stroke * 0.1;
      // Tuck limbs tightly to the side of the body
      hipRef.current.rotation.z = mirror ? -0.2 : 0.2;
      // BASE POSE CHANGE: Rotate -1.4 radians on X so the legs point horizontally backward
      hipRef.current.rotation.x = -1.4 + stroke * 0.1;
    }
    if (kneeRef.current) {
      // Slight inward bend at the knee during the flutter
      kneeRef.current.rotation.x = stroke * 0.2 + 0.1;
    }
  });

  return (
    <group position={position}>
      <group ref={hipRef}>
        {/* Upper Leg / Thigh */}
        <mesh position={[0, -0.1, 0]}>
          <capsuleGeometry args={[0.06, 0.2, 8, 8]} />
          <meshStandardMaterial color={colors.main} roughness={0.7} />
        </mesh>

        {/* Lower Leg / Calf & Foot */}
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
 * Articulated tail utilizing a traveling sine wave for a smooth s-curve.
 * Incorporates a translucent dorsal/tail fin made of flattened spheres
 * to create an organic, continuous, webbed appearance.
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
    // Traveling wave logic for smooth s-curve swimming motion.
    // Each segment's rotation is delayed slightly from the previous one.
    if (refs[0].current) refs[0].current.rotation.y = Math.sin(wave) * 0.12;
    if (refs[1].current)
      refs[1].current.rotation.y = Math.sin(wave - 0.6) * 0.18;
    if (refs[2].current)
      refs[2].current.rotation.y = Math.sin(wave - 1.2) * 0.25;
    if (refs[3].current)
      refs[3].current.rotation.y = Math.sin(wave - 1.8) * 0.35;
  });

  return (
    <group position={[0, 0, -0.55]}>
      {/* Segment 0 */}
      <group ref={refs[0]}>
        <mesh position={[0, 0, -0.28]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.28, 0.56, 16]} />
          <meshStandardMaterial color={colors.main} roughness={0.6} />
        </mesh>
        {/* Dorsal Fin Base: Flattened sphere for organic webbed curve */}
        <mesh position={[0, 0.32, -0.28]} scale={[0.1, 1, 1.8]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial
            color={colors.dark}
            transparent
            opacity={0.6}
            roughness={0.3}
          />
        </mesh>

        {/* Segment 1 */}
        <group position={[0, 0, -0.56]} ref={refs[1]}>
          <mesh position={[0, 0, -0.24]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.28, 0.18, 0.48, 16]} />
            <meshStandardMaterial color={colors.main} roughness={0.6} />
          </mesh>
          {/* Dorsal Fin Mid */}
          <mesh position={[0, 0.22, -0.24]} scale={[0.1, 1, 1.8]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
              color={colors.dark}
              transparent
              opacity={0.6}
              roughness={0.3}
            />
          </mesh>

          {/* Segment 2 */}
          <group position={[0, 0, -0.48]} ref={refs[2]}>
            <mesh position={[0, 0, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.18, 0.08, 0.4, 14]} />
              <meshStandardMaterial color={colors.main} roughness={0.6} />
            </mesh>
            {/* Dorsal Fin Tip */}
            <mesh position={[0, 0.12, -0.2]} scale={[0.1, 1, 1.8]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial
                color={colors.dark}
                transparent
                opacity={0.6}
                roughness={0.3}
              />
            </mesh>

            {/* Segment 3 - Primary Tail Paddle */}
            <group position={[0, 0, -0.4]} ref={refs[3]}>
              <mesh position={[0, 0, -0.15]} scale={[0.1, 1, 2]}>
                <sphereGeometry args={[0.22, 16, 16]} />
                <meshStandardMaterial
                  color={colors.dark}
                  transparent
                  opacity={0.7}
                  roughness={0.2}
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
 * Animated gills that subtly wave in the water to simulate breathing and current.
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
      if (!ref.current) return;
      // Staggered sine waves so the frills move sequentially
      ref.current.rotation.z =
        side * (0.28 + Math.sin(t * 1.1 + i * 1.3) * 0.14);
      ref.current.rotation.x = Math.sin(t * 0.8 + i * 0.9) * 0.07;
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
            <meshStandardMaterial color={colors.dark} roughness={0.55} />
          </mesh>
          <mesh position={[side * 0.2, 0.4, 0]} rotation={[0, 0, side * -0.5]}>
            <capsuleGeometry args={[0.022, 0.18, 6, 6]} />
            <meshStandardMaterial color={colors.dark} roughness={0.55} />
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
    // Internal wiggle syncing for realistic swimming feel.
    // Body slightly twists in opposition to the tail forces.
    if (bodyRef.current) bodyRef.current.rotation.z = Math.sin(t * 4.0) * 0.04;
    // Head bobs up slightly unless feeding, where it locks downward.
    if (headRef.current)
      headRef.current.rotation.x = isFeeding ? -0.2 : Math.sin(t * 1.3) * 0.05;
  });

  return (
    <group scale={0.65}>
      <Tail colors={colorPalette} />

      {/* ── Sleek Body ── */}
      <mesh
        ref={bodyRef}
        position={[0, 0, 0.1]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <capsuleGeometry args={[0.42, 1.1, 28, 28]} />
        <meshStandardMaterial color={colorPalette.main} roughness={0.5} />
      </mesh>

      {/* ── Head & Bubbles ── */}
      <group ref={headRef} position={[0, 0.04, 0.9]}>
        {/* Breathing Bubble System */}
        <BreathBubbles />

        <mesh castShadow>
          <sphereGeometry args={[0.55, 28, 28]} />
          <meshStandardMaterial color={colorPalette.main} roughness={0.5} />
        </mesh>

        {/* ── Cute Beady Anime Eyes (Preserved from previous iteration) ── */}
        {([-1, 1] as const).map((s) => (
          <group
            key={s}
            // Placed precisely on the surface of the head radius
            position={[s * 0.32, 0.2, 0.42]}
            rotation={[0, s * 0.4, 0]}
          >
            {/* Main Dark Eye - Flattened slightly on Z to hug face */}
            <mesh scale={[1, 1.2, 0.3]}>
              <sphereGeometry args={[0.14, 16, 16]} />
              <meshStandardMaterial
                color="#1a1a1a"
                roughness={0.1}
                metalness={0.2}
              />
            </mesh>

            {/* Primary Catchlight (Glint) */}
            <mesh position={[0.04, 0.06, 0.04]} scale={[1, 1, 0.2]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial
                color="white"
                emissive="white"
                emissiveIntensity={0.8}
              />
            </mesh>

            {/* Secondary tiny Catchlight */}
            <mesh position={[-0.04, -0.05, 0.04]} scale={[1, 1, 0.2]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshStandardMaterial
                color="white"
                emissive="white"
                emissiveIntensity={0.4}
              />
            </mesh>
          </group>
        ))}

        {/* ── Dynamic Mouth ── */}
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

      {/* ── Swimming Legs (Tucked securely against the sleek body) ── */}
      <Leg
        position={[0.38, -0.15, 0.45]}
        phase={0}
        mirror={false}
        colors={colorPalette}
      />
      <Leg
        position={[-0.38, -0.15, 0.45]}
        phase={Math.PI} // Alternating strokes
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
