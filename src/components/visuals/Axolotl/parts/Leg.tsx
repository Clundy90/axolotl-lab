import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ColorPalette } from "../../../../types/aquarium";

interface LegProps {
  position: [number, number, number];
  phase: number;
  side: 1 | -1;
  colors: ColorPalette;
}

export default function Leg({ position, phase, side, colors }: LegProps) {
  const hipRef = useRef<THREE.Group>(null);
  const kneeRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const stroke = Math.sin(clock.elapsedTime * 3.6 + phase);
    if (hipRef.current) {
      hipRef.current.rotation.x = -0.85 + stroke * 0.2;
      hipRef.current.rotation.y = side * 0.34 + stroke * side * 0.05;
      hipRef.current.rotation.z = side * -0.2;
    }
    if (kneeRef.current) {
      kneeRef.current.rotation.x = 0.22 + stroke * 0.2;
      kneeRef.current.rotation.z = side * 0.1;
    }
  });

  return (
    <group position={position}>
      <group ref={hipRef}>
        <mesh position={[side * 0.06, -0.08, 0]}>
          <capsuleGeometry args={[0.05, 0.15, 8, 8]} />
          <meshStandardMaterial color={colors.main} roughness={0.72} />
        </mesh>

        <group ref={kneeRef} position={[side * 0.1, -0.2, 0]}>
          <mesh position={[side * 0.04, -0.08, 0.01]}>
            <capsuleGeometry args={[0.04, 0.12, 8, 8]} />
            <meshStandardMaterial color={colors.main} roughness={0.72} />
          </mesh>
          <mesh position={[side * 0.06, -0.2, 0.04]} scale={[1.1, 0.8, 1.3]}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshStandardMaterial color={colors.dark} roughness={0.66} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
