import React from "react";

interface ToeProps {
  position: [number, number, number];
  rotation?: [number, number, number]; // Added for fanning
  scale: [number, number, number];
  color: string;
}

export default function Toe({
  position,
  rotation = [0, 0, 0],
  scale,
  color,
}: ToeProps) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      {/* Capsule looks much more like a digit than a sphere */}
      <capsuleGeometry args={[0.02, 0.08, 4, 8]} />
      <meshStandardMaterial color={color} roughness={0.4} />
    </mesh>
  );
}
