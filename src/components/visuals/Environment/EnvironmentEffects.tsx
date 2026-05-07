import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * BubbleStream Component
 * Refined [2026-05-07]
 * - Removed unused THEMES ghost code.
 * - Manages an instanced mesh of rising bubbles on the right side of the tank.
 */
export function BubbleStream() {
  const count = 40;
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // A single dummy object used to update the matrix of each instance
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initialize particle positions and speeds
  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * 0.5 + 4, // Clustered near the filter/right side
      z: (Math.random() - 0.5) * 0.5 - 1,
      y: Math.random() * 8,
      speed: 0.2 + Math.random() * 0.4,
    }));
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    particles.forEach((p, i) => {
      // Use the delta argument directly here
      p.y = ((p.y + delta * p.speed * 20) % 8) - 4;

      // Add a little "wobble" to the x-position for realism
      dummy.position.set(p.x + Math.sin(t + i) * 0.1, p.y, p.z);

      // Pulsate the scale slightly
      dummy.scale.setScalar(0.02 + Math.sin(t * 0.5 + i) * 0.01);

      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[new THREE.SphereGeometry(1, 8, 8), undefined, count]}
    >
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.15}
        roughness={0}
      />
    </instancedMesh>
  );
}
