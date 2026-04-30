import React, { useMemo } from "react";
import * as THREE from "three";

export const SUBSTRATE_TYPES = {
  gravel: {
    floor: "#2c3e50",
    pebbleColors: ["#4a7c99", "#5a8fa8", "#3d6b8a"],
    rough: 0.8,
  },
  sand: { floor: "#d2b48c", pebbleColors: ["#c2a278", "#e3c9a1"], rough: 1.0 },
  mud: { floor: "#3d2b1f", pebbleColors: ["#2a1d15", "#4d3a2b"], rough: 0.9 },
};

export default function Substrate({
  type,
}: {
  type: keyof typeof SUBSTRATE_TYPES;
}) {
  const config = SUBSTRATE_TYPES[type];

  const pebbles = useMemo(() => {
    return Array.from({ length: type === "gravel" ? 60 : 20 }).map(() => ({
      pos: [(Math.random() - 0.5) * 12, -2.4, (Math.random() - 0.5) * 5],
      scale: 0.05 + Math.random() * 0.1,
      color:
        config.pebbleColors[
          Math.floor(Math.random() * config.pebbleColors.length)
        ],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
    }));
  }, [type, config]);

  return (
    <group>
      {/* Main Floor with slight "bumpiness" */}
      <mesh
        position={[0, -2.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[16, 8, 32, 32]} />
        <meshStandardMaterial
          color={config.floor}
          roughness={config.rough}
          metalness={0.1}
        />
      </mesh>

      {/* Volumetric Pebbles */}
      {pebbles.map((p, i) => (
        <mesh
          key={i}
          position={p.pos as [number, number, number]}
          rotation={p.rotation as [number, number, number]}
          castShadow
        >
          <dodecahedronGeometry args={[p.scale, 0]} />
          <meshStandardMaterial color={p.color} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}
