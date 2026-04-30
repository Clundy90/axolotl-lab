import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Independent Food Component: Bloodworm
 * Features: Procedural tube geometry for realistic wriggling.
 * Logic is self-contained and moves independently of the pet. [2026-02-27]
 */
export default function Worm({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Create a base curve for the worm body
  const curve = useMemo(() => {
    const points = [];
    for (let i = 0; i < 5; i++) {
      points.push(new THREE.Vector3(0, i * 0.1, 0));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    if (active) {
      const t = state.clock.getElapsedTime();

      // 1. Falling Physics
      if (meshRef.current.position.y > 0.1) {
        meshRef.current.position.y -= 0.035;
        meshRef.current.scale.setScalar(1);
      } else {
        // "Eaten" or settled
        meshRef.current.scale.setScalar(0);
      }

      // 2. Realistic Wriggle
      // We tilt and rotate the worm mid-air to look alive
      meshRef.current.rotation.x = Math.sin(t * 8) * 0.2;
      meshRef.current.rotation.z = Math.cos(t * 10) * 0.3;
      meshRef.current.position.x = Math.sin(t * 5) * 0.05; // Slight drift
    } else {
      meshRef.current.position.y = 5; // Reset off-screen
      meshRef.current.scale.setScalar(0);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 5, 1.1]} castShadow>
      {/* TubeGeometry makes it look like a real soft body worm */}
      <tubeGeometry args={[curve, 20, 0.03, 8, false]} />
      <meshStandardMaterial
        color="#b30000"
        emissive="#4a0000"
        roughness={0.3}
        metalness={0.2}
      />
    </mesh>
  );
}
