import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ColorPalette } from "../../../../types/aquarium";

interface GillSetProps {
  side: 1 | -1;
  color: string; // Changed from 'colors: ColorPalette' to just 'color: string'
}
export default function GillSet({ side, color }: GillSetProps) {
  const refs = [
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
  ];

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    refs.forEach((ref, index) => {
      if (!ref.current) return;
      ref.current.rotation.z =
        side * (0.2 + Math.sin(time * 1.1 + index * 1.2) * 0.14);
    });
  });

  return (
    <group
      position={[side * 0.46, 0.04, 0.01]}
      rotation={[0, side * 0.2, side * -0.15]}
    >
      {[0.15, 0, -0.15].map((zOffset, index) => (
        <group key={index} ref={refs[index]} position={[0, 0, zOffset]}>
          <mesh position={[side * 0.1, 0.2, 0]}>
            <capsuleGeometry args={[0.034, 0.32, 8, 8]} />
            <meshStandardMaterial
              color={color} // Use the specific gills color
              roughness={0.76}
            />
          </mesh>
          <mesh position={[side * 0.18, 0.32, 0]}>
            <capsuleGeometry args={[0.02, 0.16, 6, 6]} />
            <meshStandardMaterial color={color} roughness={0.65} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
