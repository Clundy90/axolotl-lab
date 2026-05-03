import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

/**
 * Substrate Component
 * Renders the aquarium floor with physical displacement and instanced debris.
 *
 * Updates [2026-05-02]:
 * - Enhanced 'gravel' preset to mimic store-bought fish tank pebbles.
 * - Increased pebble count and adjusted scaling for smaller, uniform rounded shapes.
 * - Samples the layered sine-wave terrain to ensure pebbles sit on the surface.
 * - Maintained detailed comments and Earth-tone palettes per project standards.
 */

export const SUBSTRATE_TYPES = {
  gravel: {
    floor: "#2c2e30", // Slightly darker floor to let colorful pebbles pop
    pebbleColors: ["#4a5568", "#718096", "#a0aec0", "#2d3748", "#4fd1c5"], // Added a "water" blue-grey hint
    rough: 0.5,
    count: 350, // High density for that "bag of gravel" look
    freq: 2.0,
    amp: 0.1,
  },
  sand: {
    floor: "#e3c9a1",
    pebbleColors: ["#d2b48c", "#c2a278", "#e3c9a1"],
    rough: 0.9,
    count: 60,
    freq: 4.0,
    amp: 0.03,
  },
  mud: {
    floor: "#2a1d15",
    pebbleColors: ["#3d2b1f", "#1a110a", "#2a1d15"],
    rough: 1.0,
    count: 35,
    freq: 0.8,
    amp: 0.25,
  },
};

const getTerrainOffset = (x: number, y: number, freq: number, amp: number) => {
  const layer1 = Math.sin(x * freq) * Math.cos(y * freq) * amp;
  const layer2 =
    Math.sin(x * freq * 2.3 + 1) * Math.cos(y * freq * 2.1 - 1) * (amp * 0.4);
  return layer1 + layer2;
};

export default function Substrate({
  type,
}: {
  type: keyof typeof SUBSTRATE_TYPES;
}) {
  const config = SUBSTRATE_TYPES[type];
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const floorGeom = useMemo(() => {
    const geom = new THREE.PlaneGeometry(16, 10, 64, 64);
    const pos = geom.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const offset = getTerrainOffset(x, y, config.freq, config.amp);
      pos.setZ(i, z + offset);
    }

    geom.computeVertexNormals();
    return geom;
  }, [type, config.freq, config.amp]);

  useEffect(() => {
    if (!meshRef.current) return;

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    for (let i = 0; i < config.count; i++) {
      const x = (Math.random() - 0.5) * 15; // Slightly wider spread
      const z = (Math.random() - 0.5) * 9;

      const surfaceHeight = getTerrainOffset(x, -z, config.freq, config.amp);
      const y = -2.5 + surfaceHeight;

      dummy.position.set(x, y, z);
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      );

      // Gravel Specific Scaling: Smaller and rounder
      let s = 0.06 + Math.random() * 0.08;
      if (type === "gravel") {
        s = 0.04 + Math.random() * 0.05; // Smaller uniform size for gravel
      } else if (type === "sand") {
        s = 0.01 + Math.random() * 0.02;
      }

      // Non-uniform scaling to make them look like smooth, flattened pebbles
      dummy.scale.set(
        s * (0.9 + Math.random() * 0.2),
        s * (0.6 + Math.random() * 0.2), // Flattened Y
        s * (0.9 + Math.random() * 0.2),
      );

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      const hex =
        config.pebbleColors[
          Math.floor(Math.random() * config.pebbleColors.length)
        ];
      meshRef.current.setColorAt(i, color.set(hex));
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [type, config]);

  return (
    <group>
      {/* ── Enhanced Floor ── */}
      <mesh
        geometry={floorGeom}
        position={[0, -2.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          color={config.floor}
          roughness={config.rough}
          metalness={0.1}
        />
      </mesh>

      {/* ── Volumetric Pebbles ── */}
      <instancedMesh
        ref={meshRef}
        args={[null as any, null as any, config.count]}
        castShadow
        receiveShadow
      >
        {/* Icosahedron with detail 1 creates a smoother, pebble-like sphere than Dodecahedron */}
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial roughness={0.4} metalness={0.2} />
      </instancedMesh>
    </group>
  );
}
