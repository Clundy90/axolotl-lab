import React from "react";

interface ToeProps {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
}

export default function Toe({ position, scale, color }: ToeProps) {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  );
}
