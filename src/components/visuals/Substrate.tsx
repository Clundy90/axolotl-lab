import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

/**
 * Substrate Component
 * Renders the aquarium floor with physical displacement and instanced debris.
 *
 * Updates [2026-05-01]:
 * - Refactored pebbles to InstancedMesh for high-performance rendering.
 * - Added vertex displacement to the floor geometry for organic unevenness.
 * - Refined color palettes for more natural Earth-tones. [2026-02-27]
 */

export const SUBSTRATE_TYPES = {
  gravel: {
    floor: "#3d4043",
    pebbleColors: ["#7f8c8d", "#95a5a6", "#34495e", "#2c3e50"],
    rough: 0.7,
    count: 120, // High density for gravel
    dispersion: 0.15, // Height variation for floor
  },
  sand: {
    floor: "#e3c9a1",
    pebbleColors: ["#d2b48c", "#c2a278"],
    rough: 0.9,
    count: 40,
    dispersion: 0.05, // Subtle ripples for sand
  },
  mud: {
    floor: "#2a1d15",
    pebbleColors: ["#3d2b1f", "#1a110a"],
    rough: 1.0,
    count: 25,
    dispersion: 0.25, // Deep "gloopy" divots for mud
  },
};

export default function Substrate({
  type,
}: {
  type: keyof typeof SUBSTRATE_TYPES;
}) {
  const config = SUBSTRATE_TYPES[type];
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Generate floor geometry with displacement
  const floorGeom = useMemo(() => {
    const geom = new THREE.PlaneGeometry(16, 10, 64, 64);
    const pos = geom.attributes.position;

    // Apply "noise" to the Z-axis (which becomes Y when rotated)
    for (let i = 0; i < pos.count; i++) {
      const z = pos.getZ(i);
      // Create organic bumps based on the substrate type's dispersion
      const noise = (Math.random() - 0.5) * config.dispersion;
      pos.setZ(i, z + noise);
    }
    geom.computeVertexNormals();
    return geom;
  }, [type, config.dispersion]);

  // Handle InstancedMesh transformations for the pebbles
  useEffect(() => {
    if (!meshRef.current) return;

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    for (let i = 0; i < config.count; i++) {
      // Position rocks on the floor with slight random height to match displacement
      const x = (Math.random() - 0.5) * 14;
      const z = (Math.random() - 0.5) * 8;
      const y = -2.48 + Math.random() * 0.05;

      dummy.position.set(x, y, z);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      // Scale variation: Gravel is small/varied, Sand is tiny specks
      const s =
        type === "sand"
          ? 0.02 + Math.random() * 0.04
          : 0.06 + Math.random() * 0.12;
      dummy.scale.set(s, s, s);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Set individual instance colors
      const hex =
        config.pebbleColors[
          Math.floor(Math.random() * config.pebbleColors.length)
        ];
      meshRef.current.setColorAt(i, color.set(hex));
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor)
      meshRef.current.instanceColor.needsUpdate = true;
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
          metalness={0.05}
        />
      </mesh>

      {/* ── Volumetric Pebbles/Debris ── */}
      {/* 
          Using InstancedMesh here is much more efficient than mapping 100+ meshes.
          It allows the GPU to draw all pebbles in a single call.
      */}
      <instancedMesh
        ref={meshRef}
        args={[null as any, null as any, config.count]}
        castShadow
        receiveShadow
      >
        {/* Dodecahedrons look like natural jagged stones */}
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={0.8} />
      </instancedMesh>
    </group>
  );
}
