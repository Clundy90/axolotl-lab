import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Worm Component (Food)
 * Refined [2026-05-02]
 * - Lowered spawn height to ensure immediate visibility.
 * - Adjusted descent for better synchronization with Axolotl movement.
 */

interface WormProps {
  spawnX?: number;
}

export default function Worm({ spawnX = 0 }: WormProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const WORM_BROWN = "#5c4033";

  // Curved points to keep the "organic" shape
  const points = useMemo(
    () => [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.04, -0.05, 0.01),
      new THREE.Vector3(-0.04, -0.1, -0.01),
      new THREE.Vector3(0.02, -0.15, 0.01),
      new THREE.Vector3(0, -0.2, 0),
    ],
    [],
  );

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const randomOffset = useMemo(() => (Math.random() - 0.5) * 1.5, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Increased speed slightly (1.2) so it doesn't take forever to fall
    meshRef.current.position.y -= delta * 1.2;

    const time = state.clock.elapsedTime;
    // Faster wiggle for a more "alive" feel
    meshRef.current.rotation.z = Math.sin(time * 10) * 0.4;
    meshRef.current.rotation.x = Math.cos(time * 7) * 0.2;

    // Subtle drift
    meshRef.current.position.x =
      spawnX + randomOffset + Math.sin(time * 2) * 0.05;
  });

  // Inside Worm.tsx

  return (
    // Change Z from 0 to 2.0 to match the Axolotl's feeding position
    <mesh ref={meshRef} position={[spawnX + randomOffset, 2.5, 2.0]}>
      <tubeGeometry args={[curve, 20, 0.015, 8, false]} />
      <meshStandardMaterial
        color={"#5c4033"} // Brown
        roughness={0.9}
        emissive={"#5c4033"}
        emissiveIntensity={0.05}
      />
    </mesh>
  );
}
