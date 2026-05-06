import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ColorPalette } from "../../../../types/aquarium";

interface LegProps {
  position: [number, number, number];
  phase: number;
  side: 1 | -1; // 1 for Right, -1 for Left
  colors: ColorPalette;
}

export default function Leg({ position, phase, side, colors }: LegProps) {
  const hipRef = useRef<THREE.Group>(null);
  const kneeRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 3.6 + phase;
    const stroke = Math.sin(t);
    const lateralShift = Math.cos(t);

    if (hipRef.current) {
      // Hip: Rotation.z creates the "sprawl" (pointing the leg OUT)
      // Rotation.y handles the forward/back swinging
      hipRef.current.rotation.x = -0.4 + stroke * 0.15;
      hipRef.current.rotation.y = side * 0.4 + lateralShift * side * 0.1;
      hipRef.current.rotation.z = side * -0.6; // Pushes the "elbow/knee" outward
    }

    if (kneeRef.current) {
      // Knee: Provides the vertical lift and ground contact
      const kneeStroke = Math.sin(t - 0.4);
      kneeRef.current.rotation.x = 0.5 + kneeStroke * 0.3;
      kneeRef.current.rotation.z = side * 0.4; // Corrects the angle to point the foot back DOWN
    }
  });

  return (
    <group position={position}>
      {/* Hip Joint - Attached to side of body */}
      <group ref={hipRef}>
        <mesh position={[side * 0.04, -0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.03, 0.1, 8, 8]} />
          <meshStandardMaterial color={colors.main} roughness={0.72} />
        </mesh>

        {/* Knee Joint - Pointing outward and downward */}
        <group ref={kneeRef} position={[side * 0.12, -0.05, 0]}>
          <mesh position={[0, -0.08, 0]}>
            <capsuleGeometry args={[0.028, 0.12, 8, 8]} />
            <meshStandardMaterial color={colors.main} roughness={0.72} />
          </mesh>

          {/* Foot - Flat on the substrate */}
          <mesh position={[0, -0.16, 0.03]} scale={[1.4, 0.4, 1.6]}>
            <sphereGeometry args={[0.04, 10, 10]} />
            <meshStandardMaterial
              color={colors.dark}
              roughness={0.6}
              metalness={0.1}
            />
          </mesh>

          {/* Fanned Toe Detail */}
          <mesh position={[0, -0.17, 0.05]} scale={[0.5, 0.1, 0.7]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color={colors.dark} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
