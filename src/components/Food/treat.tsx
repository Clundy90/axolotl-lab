import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Treat Component (Special Food)
 * Refined [2026-05-04]
 * - Renamed from Worm.tsx to Treat.tsx to fit the new feeding paradigm.
 * - Updated the material for a fleshier, more organic look.
 * - Intensified the wiggle to trigger excited Axolotl behavior.
 */

interface TreatProps {
  spawnX?: number;
}

export default function Treat({ spawnX = 0 }: TreatProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Improved organic curve points for a realistic segmented look
  const points = useMemo(
    () => [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.05, -0.08, 0.02),
      new THREE.Vector3(-0.05, -0.15, -0.02),
      new THREE.Vector3(0.04, -0.22, 0.03),
      new THREE.Vector3(-0.02, -0.3, 0),
    ],
    [],
  );

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const randomOffset = useMemo(() => (Math.random() - 0.5) * 1.5, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Sinks slightly faster than flakes due to being a heavier object
    meshRef.current.position.y -= delta * 1.0;

    const time = state.clock.elapsedTime;

    // Intense, erratic wiggle for a more "alive" feel
    meshRef.current.rotation.z = Math.sin(time * 12) * 0.5;
    meshRef.current.rotation.x = Math.cos(time * 8) * 0.3;

    // Subtle drift
    meshRef.current.position.x =
      spawnX + randomOffset + Math.sin(time * 3) * 0.08;
  });

  return (
    // Spawn exactly on the Axolotl's depth plane (Z: 2.0)
    <mesh ref={meshRef} position={[spawnX + randomOffset, 2.5, 2.0]}>
      {/* Slightly thicker tube geometry than the previous iteration */}
      <tubeGeometry args={[curve, 32, 0.025, 12, false]} />
      {/* Fleshy, realistic earthworm color profile */}
      <meshStandardMaterial
        color={"#d98585"} // Soft pinkish-brown
        roughness={0.6}
        emissive={"#5c2e2e"}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}
