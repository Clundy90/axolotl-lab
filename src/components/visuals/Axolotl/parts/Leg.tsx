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
    const t = clock.elapsedTime * 2.8 + phase;
    const stroke = Math.sin(t);
    const lateralShift = Math.cos(t * 0.8) * 0.08;

    if (hipRef.current) {
      // More natural hip rotation - less extreme angles
      hipRef.current.rotation.x = -0.3 + stroke * 0.2;
      hipRef.current.rotation.y = side * 0.35;
      hipRef.current.rotation.z = side * -0.5 + lateralShift * side * 0.15;
    }

    if (kneeRef.current) {
      // Knee follows hip motion with smooth bend
      const kneeStroke = Math.sin(t - 0.3);
      kneeRef.current.rotation.x = 0.4 + kneeStroke * 0.35;
      kneeRef.current.rotation.z = side * 0.3;
    }
  });

  return (
    <group position={position}>
      <group ref={hipRef}>
        {/* Upper Leg - extends from body naturally */}
        <mesh position={[side * 0.05, -0.08, 0]}>
          <capsuleGeometry args={[0.038, 0.16, 10, 10]} />
          <meshStandardMaterial color={legColor} roughness={0.72} />
        </mesh>

        <group ref={kneeRef} position={[side * 0.05, -0.16, 0]}>
          {/* Lower Leg - slightly tapered */}
          <mesh position={[0, -0.09, 0]}>
            <capsuleGeometry args={[0.032, 0.14, 10, 10]} />
            <meshStandardMaterial color={legColor} roughness={0.72} />
          </mesh>

          {/* Knee joint connector */}
          <mesh position={[0, -0.16, 0]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color={legColor} roughness={0.72} />
          </mesh>

          {/* Fanned Toes - Now modular! */}
          <Toe
            position={[0, -0.19, 0.03]}
            scale={[1.4, 0.4, 1.6]}
            color={toeColor}
          />
          <Toe
            position={[0.045, -0.2, 0.05]}
            scale={[0.5, 0.1, 0.7]}
            color={toeColor}
          />
          <Toe
            position={[-0.045, -0.2, 0.05]}
            scale={[0.5, 0.1, 0.7]}
            color={toeColor}
          />
        </group>
      </group>
    </group>
  );
}
