import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const THEMES = {
  biolume: {
    ambient: "#000814",
    point: "#00f2ff",
    accent: "#7000ff",
    intensity: 1.5,
  },
  sunset: {
    ambient: "#2b1000",
    point: "#ff4500",
    accent: "#ffcc00",
    intensity: 1.2,
  },
  forest: {
    ambient: "#051a05",
    point: "#a3ffac",
    accent: "#228b22",
    intensity: 1.0,
  },
};

export function BubbleStream() {
  const count = 40;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * 0.5 + 4, // Clustered on the right side
      z: (Math.random() - 0.5) * 0.5 - 1,
      y: Math.random() * 8,
      speed: 0.2 + Math.random() * 0.4,
    }));
  }, []);

  useFrame((state) => {
    particles.forEach((p, i) => {
      const t = state.clock.getElapsedTime();
      p.y = ((p.y + t * p.speed) % 8) - 4;
      dummy.position.set(p.x + Math.sin(t + i) * 0.1, p.y, p.z);
      dummy.scale.setScalar(0.02 + Math.sin(t * 0.5 + i) * 0.01);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });
    if (meshRef.current) meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.15} />
    </instancedMesh>
  );
}
