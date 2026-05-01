import React, { useMemo } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * PettingHandler Component
 * Manages the invisible interaction zone and heart particle effects.
 * Includes detailed comments as per project standards.
 */
interface PettingHandlerProps {
  isPetting: boolean;
  onPet: (val: boolean) => void; // Updated to match Aquarium.tsx
}

function HeartParticles({ active }: { active: boolean }) {
  const hearts = useMemo(() => {
    if (!active) return [];
    return Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 3,
      delay: Math.random() * 0.3,
      scale: 1 + Math.random() * 0.5,
    }));
  }, [active]);

  if (!active) return null;

  return (
    <>
      {hearts.map((h) => (
        <Html key={h.id} position={[h.x, 1.2, 0]} center>
          <div
            style={{
              fontSize: `${h.scale * 2}rem`,
              animation: `floatUpAndFade 1.2s ease-out ${h.delay}s forwards`,
              pointerEvents: "none",
              opacity: 0,
            }}
          >
            💖
            <style>
              {`
                @keyframes floatUpAndFade {
                  0% { transform: translateY(0) scale(0.5); opacity: 1; }
                  100% { transform: translateY(-50px) scale(1.2); opacity: 0; }
                }
              `}
            </style>
          </div>
        </Html>
      ))}
    </>
  );
}

export default function PettingHandler({
  isPetting,
  onPet,
}: PettingHandlerProps) {
  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    onPet(true);
    // Auto-reset the petting state after the animation duration
    setTimeout(() => onPet(false), 2000);
  };

  return (
    <group>
      {/* Invisible interaction mesh to capture clicks/taps */}
      <mesh
        onPointerDown={handlePointerDown}
        position={[0, 0, 0.8]}
        visible={false}
      >
        <sphereGeometry args={[1.2, 16, 16]} />
      </mesh>

      <HeartParticles active={isPetting} />
    </group>
  );
}
