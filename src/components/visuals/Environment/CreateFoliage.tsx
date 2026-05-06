import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Foliage Component
 * Generates lush, procedural underwater flora with clump-based distribution.
 *
 * [2026-05-02]
 * - Added FoliageType selection (Seagrass, Kelp, Vines).
 * - Implemented "Clumping" logic for high-density visual appeal.
 * - Fixed TS7053 indexing error by explicitly typing PlantBlade props.
 */

export type FoliageType = "grass" | "kelp" | "vines";

interface FoliageProps {
  visible: boolean;
  count?: number;
  type?: FoliageType;
}

interface PlantBladeProps {
  position: [number, number, number];
  scale: number;
  rotation: number;
  type: FoliageType;
  speed: number;
}

export default function Foliage({
  visible,
  count = 12,
  type = "grass",
}: FoliageProps) {
  if (!visible) return null;

  const clumpData = useMemo(() => {
    return Array.from({ length: count }).map(() => {
      const centerX = (Math.random() - 0.5) * 12;
      const centerZ = (Math.random() - 0.5) * 5;

      const blades = Array.from({
        length: 5 + Math.floor(Math.random() * 3),
      }).map(() => ({
        offsetX: (Math.random() - 0.5) * 0.4,
        offsetZ: (Math.random() - 0.5) * 0.4,
        scale: 0.8 + Math.random() * 1.2,
        rotation: Math.random() * Math.PI,
        speed: 1 + Math.random() * 0.5,
      }));

      return { centerX, centerZ, blades };
    });
  }, [count]); // Removed 'type' from dependencies to keep layout stable when toggling styles

  return (
    <group>
      {clumpData.map((clump, i) => (
        <group key={i} position={[clump.centerX, -2.4, clump.centerZ]}>
          {clump.blades.map((blade, j) => (
            <PlantBlade
              key={j}
              type={type}
              position={[blade.offsetX, 0, blade.offsetZ]}
              scale={blade.scale}
              rotation={blade.rotation}
              speed={blade.speed}
            />
          ))}
        </group>
      ))}
    </group>
  );
}

function PlantBlade({
  position,
  scale,
  rotation,
  type,
  speed,
}: PlantBladeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    const mainSway = Math.sin(t * speed + position[0]) * 0.15;
    const microSway = Math.sin(t * (speed * 2.1) + position[2]) * 0.05;

    meshRef.current.rotation.z = mainSway + microSway;

    const xIntensity = type === "kelp" ? 0.02 : 0.08;
    meshRef.current.rotation.x = Math.cos(t * 0.8 + position[2]) * xIntensity;
  });

  const config = {
    grass: { color: "#2d6a4f", width: 0.08, height: 1.5, opacity: 0.9 },
    kelp: { color: "#1b4332", width: 0.2, height: 2.5, opacity: 0.8 },
    vines: { color: "#7b2cbf", width: 0.12, height: 2.2, opacity: 0.7 },
  }[type];

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[0, rotation, 0]}
      scale={[1, scale, 1]}
    >
      <planeGeometry args={[config.width, config.height, 1, 8]} />
      <meshStandardMaterial
        color={config.color}
        side={THREE.DoubleSide}
        transparent
        alphaTest={0.4}
        emissive={type === "vines" ? "#3c096c" : "#000000"}
        emissiveIntensity={type === "vines" ? 0.5 : 0}
      />
    </mesh>
  );
}
