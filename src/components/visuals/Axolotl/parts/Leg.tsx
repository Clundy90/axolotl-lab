import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Toe from "./Toe"; // Import your new component

interface LegProps {
  position: [number, number, number];
  phase: number;
  side: 1 | -1;
  legColor: string;
  toeColor: string;
}

export default function Leg({
  position,
  phase,
  side,
  legColor,
  toeColor,
}: LegProps) {
  const hipRef = useRef<THREE.Group>(null);
  const kneeRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 3.6 + phase;
    const stroke = Math.sin(t);
    const lateralShift = Math.cos(t);

    if (hipRef.current) {
      hipRef.current.rotation.x = -0.4 + stroke * 0.15;
      hipRef.current.rotation.y = side * 0.4 + lateralShift * side * 0.1;
      hipRef.current.rotation.z = side * -0.6;
    }

    if (kneeRef.current) {
      const kneeStroke = Math.sin(t - 0.4);
      kneeRef.current.rotation.x = 0.5 + kneeStroke * 0.3;
      kneeRef.current.rotation.z = side * 0.4;
    }
  });

  return (
    <group position={position}>
      <group ref={hipRef}>
        {/* Upper Leg */}
        <mesh position={[side * 0.04, -0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.03, 0.1, 8, 8]} />
          <meshStandardMaterial color={legColor} roughness={0.72} />
        </mesh>

        <group ref={kneeRef} position={[side * 0.12, -0.05, 0]}>
          {/* Lower Leg */}
          <mesh position={[0, -0.08, 0]}>
            <capsuleGeometry args={[0.028, 0.12, 8, 8]} />
            <meshStandardMaterial color={legColor} roughness={0.72} />
          </mesh>

          {/* Fanned Toes - Now modular! */}
          <Toe
            position={[0, -0.16, 0.03]}
            scale={[1.4, 0.4, 1.6]}
            color={toeColor}
          />
          <Toe
            position={[0.04, -0.17, 0.05]}
            scale={[0.5, 0.1, 0.7]}
            color={toeColor}
          />
          <Toe
            position={[-0.04, -0.17, 0.05]}
            scale={[0.5, 0.1, 0.7]}
            color={toeColor}
          />
        </group>
      </group>
    </group>
  );
}
