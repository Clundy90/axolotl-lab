import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Foliage Component
 * Generates procedural seagrass with math-based swaying.
 *
 * [2026-05-01]
 * - Uses Sine-wave displacement for realistic underwater motion.
 * - Optimized with useMemo for performance.
 */

interface FoliageProps {
  visible: boolean;
  count?: number;
}

export default function Foliage({ visible, count = 15 }: FoliageProps) {
  if (!visible) return null;

  // Generate random positions for the grass patches
  const grassData = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [
        (Math.random() - 0.5) * 10, // X range
        -2.4, // Ground Y
        (Math.random() - 0.5) * 4, // Z range
      ] as [number, number, number],
      scale: 0.5 + Math.random() * 0.8,
      rotation: Math.random() * Math.PI,
    }));
  }, [count]);

  return (
    <group>
      {grassData.map((data, i) => (
        <GrassBlade key={i} {...data} />
      ))}
    </group>
  );
}

function GrassBlade({ position, scale, rotation }: any) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    // Applying a swaying motion using a simple derivative of a sine wave
    // to simulate water resistance and current.
    meshRef.current.rotation.z = Math.sin(t * 1.5 + position[0]) * 0.1;
    meshRef.current.rotation.x = Math.cos(t * 1.2 + position[2]) * 0.05;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[0, rotation, 0]}
      scale={[1, scale, 1]}
    >
      <planeGeometry args={[0.2, 1, 1, 4]} />
      <meshStandardMaterial
        color="#2d6a4f"
        side={THREE.DoubleSide}
        transparent
        alphaTest={0.5}
      />
    </mesh>
  );
}
