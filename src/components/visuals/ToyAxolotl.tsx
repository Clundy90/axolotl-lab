import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import * as THREE from "three";

interface Props {
  isPetting: boolean;
  setIsPetting: (val: boolean) => void;
}

export default function ToyAxolotl({ isPetting, setIsPetting }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    // Ultra-slow time for a peaceful aquarium vibe
    const t = state.clock.getElapsedTime() * 0.35;

    if (groupRef.current && tailRef.current) {
      // 1. HORIZONTAL SWIMMING (X-Axis)
      groupRef.current.position.x = Math.sin(t) * 3.5;

      // 2. DEPTH DRIFT (Z-Axis)
      groupRef.current.position.z = Math.cos(t * 0.7) * 1.2;

      // 3. YAW & BANKING: Facing the turn + slight tilt
      groupRef.current.rotation.y = Math.PI / 2 + Math.cos(t) * 0.5;
      groupRef.current.rotation.z = Math.sin(t) * 0.15;

      // 4. TAIL MOTION: Fast, small-arc wiggle to simulate propulsion
      // Using Math.sin on a higher frequency (4.0) makes it look active
      tailRef.current.rotation.y =
        Math.sin(state.clock.getElapsedTime() * 4) * 0.3;
    }
  });

  const pink = "#ffccd5";
  const darkPink = "#ff4d6d";

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.1}>
      <group
        ref={groupRef}
        onPointerDown={() => {
          setIsPetting(true);
          setTimeout(() => setIsPetting(false), 2000);
        }}
      >
        {isPetting && (
          <Html position={[0, 1.2, 0]} center>
            <div
              style={{
                fontSize: "4rem",
                filter: "drop-shadow(0 0 10px white)",
                animation: "floatUp 1s ease-out",
              }}
            >
              💖
            </div>
          </Html>
        )}

        {/* CHONKY BODY - Flattened horizontally */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <capsuleGeometry args={[0.55, 1.2, 32, 32]} />
          <meshStandardMaterial color={pink} roughness={0.7} />
        </mesh>

        {/* POINTY ELONGATED TAIL - Fixed position at the back */}
        <mesh
          ref={tailRef}
          position={[0, 0, -1]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          {/* Narrow radiusTop (0) creates the sharp point you wanted */}
          <coneGeometry args={[0.45, 2.8, 32]} />
          <meshStandardMaterial color={pink} roughness={0.7} />
        </mesh>

        {/* FACE DETAILS */}
        <group position={[0, 0, 0.8]}>
          <mesh position={[0.35, 0.2, 0.1]}>
            <sphereGeometry args={[0.09]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <mesh position={[-0.35, 0.2, 0.1]}>
            <sphereGeometry args={[0.09]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <mesh position={[0, -0.1, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.15, 0.02, 16, 32, Math.PI]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        </group>

        {/* GILLS (3 sets per side) */}
        {[0, 1, 2].map((i) => (
          <group key={i} position={[0, 0.2, 0.4 - i * 0.18]}>
            <mesh position={[0.65, 0.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
              <capsuleGeometry args={[0.04, 0.7]} />
              <meshStandardMaterial color={darkPink} />
            </mesh>
            <mesh position={[-0.65, 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
              <capsuleGeometry args={[0.04, 0.7]} />
              <meshStandardMaterial color={darkPink} />
            </mesh>
          </group>
        ))}

        {/* FOUR LEGS (Nubby style) */}
        <mesh position={[0.45, -0.4, 0.4]}>
          <sphereGeometry args={[0.14]} />
          <meshStandardMaterial color={pink} />
        </mesh>
        <mesh position={[-0.45, -0.4, 0.4]}>
          <sphereGeometry args={[0.14]} />
          <meshStandardMaterial color={pink} />
        </mesh>
        <mesh position={[0.45, -0.4, -0.4]}>
          <sphereGeometry args={[0.14]} />
          <meshStandardMaterial color={pink} />
        </mesh>
        <mesh position={[-0.45, -0.4, -0.4]}>
          <sphereGeometry args={[0.14]} />
          <meshStandardMaterial color={pink} />
        </mesh>
      </group>
    </Float>
  );
}
