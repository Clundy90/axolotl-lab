import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function BreathBubbles() {
  const groupRef = useRef<THREE.Group>(null);

  const bubbles = useMemo(
    () =>
      Array.from({ length: 5 }).map(() => ({
        x: (Math.random() - 0.5) * 0.5,
        y: Math.random() * 0.35,
        z: (Math.random() - 0.5) * 0.25,
        speed: 0.65 + Math.random() * 1.1,
        scale: 0.018 + Math.random() * 0.025,
      })),
    [],
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((bubble, index) => {
      const data = bubbles[index];
      bubble.position.y += delta * data.speed;
      bubble.position.x += Math.sin(bubble.position.y * 7) * 0.003;
      if (bubble.position.y > 1.8) {
        bubble.position.y = 0;
        bubble.position.x = data.x;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0.14, 0.72]}>
      {bubbles.map((bubble, index) => (
        <mesh
          key={index}
          position={[bubble.x, bubble.y, bubble.z]}
          scale={bubble.scale}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.45}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}
