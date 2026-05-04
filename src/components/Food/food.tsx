import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Food Component (Standard Diet)
 * [2026-05-04] Reverted to original flutter logic and standard material.
 * Adjusted geometry to be smaller for a more realistic fish food flake size.[cite: 3]
 */

interface FoodProps {
  spawnX?: number;
}

export default function Food({ spawnX = 0 }: FoodProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Randomize food color to mimic standard multi-colored fish flakes
  // Kept inside useMemo so it only calculates once per flake on spawn[cite: 3]
  const color = useMemo(() => {
    const colors = ["#ff7f50", "#3cb371", "#ffd700"]; // Coral, MediumSeaGreen, Gold
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  // Slight random offset so flakes don't drop in a perfectly straight line[cite: 3]
  const randomOffset = useMemo(() => (Math.random() - 0.5) * 2, []);

  // Give each flake a unique rotation speed for a more natural flutter[cite: 3]
  const rotationSpeed = useMemo(() => Math.random() * 2 + 1, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Float down slowly (slower descent than the heavy worm)[cite: 3]
    meshRef.current.position.y -= delta * 0.8;

    // Flutter effect applied to the X and Y axes[cite: 3]
    meshRef.current.rotation.x += delta * rotationSpeed;
    meshRef.current.rotation.y += delta * rotationSpeed * 0.5;

    // Gentle sway back and forth on the X axis as it sinks[cite: 3]
    meshRef.current.position.x =
      spawnX + randomOffset + Math.sin(state.clock.elapsedTime * 2) * 0.1;
  });

  return (
    // Z is set to 2.0 to match the Axolotl's feeding depth plane[cite: 3]
    <mesh ref={meshRef} position={[spawnX + randomOffset, 3.0, 2.0]}>
      {/* 
          Flat cylinder to represent a fish flake. 
          Reduced size from 0.08 to 0.04 for a "smaller" look.[cite: 3]
      */}
      <cylinderGeometry args={[0.04, 0.04, 0.005, 8]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}
