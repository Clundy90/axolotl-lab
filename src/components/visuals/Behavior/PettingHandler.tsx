import React, { useMemo, type RefObject, useEffect } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * PettingHandler Component
 * Manages interaction zones, grab cursor states, and organic reactions.
 * Includes detailed comments as per project standards.
 */
interface PettingHandlerProps {
  rootRef: RefObject<THREE.Group>;
  isPetting: boolean;
  onPet: (val: boolean) => void;
}

const HEART_COLORS = ["#ff6b81", "#ff4757", "#ff7f50", "#ff9ff3", "#f368e0"];

function HeartParticles({ active }: { active: boolean }) {
  const hearts = useMemo(() => {
    if (!active) return [];
    return Array.from({ length: 7 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 2.5,
      delay: Math.random() * 0.15,
      scale: 0.7 + Math.random() * 0.5,
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
      sway: Math.random() > 0.5 ? 1 : -1,
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
              color: h.color,
              // @ts-ignore - custom CSS variable for sway direction
              "--sway-dir": h.sway,
              animation: `flutterUp 1.2s ease-out ${h.delay}s forwards`,
              pointerEvents: "none",
              opacity: 0,
              textShadow: "0px 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            💖
            <style>
              {`
                @keyframes flutterUp {
                  0% { transform: translate(0, 0) scale(0.5) rotate(-10deg); opacity: 0; }
                  20% { opacity: 1; transform: translate(calc(15px * var(--sway-dir)), -15px) scale(1.1) rotate(10deg); }
                  60% { transform: translate(calc(-10px * var(--sway-dir)), -35px) scale(1) rotate(-5deg); }
                  100% { transform: translate(calc(5px * var(--sway-dir)), -60px) scale(1.2) rotate(15deg); opacity: 0; }
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
  rootRef,
  isPetting,
  onPet,
}: PettingHandlerProps) {
  // Cleanup cursor on unmount
  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  useFrame(({ clock }) => {
    if (!rootRef.current) return;

    const t = clock.getElapsedTime();

    if (isPetting) {
      // ORGANIC WIGGLE: Multi-frequency sine for a lifelike shimmy
      const wiggle = Math.sin(t * 15) * 0.08 + Math.sin(t * 6) * 0.04;
      rootRef.current.rotation.y = wiggle;

      // HEAD TILT: Tilt slightly up toward the camera/hand
      rootRef.current.rotation.x = THREE.MathUtils.lerp(
        rootRef.current.rotation.x,
        -0.15,
        0.1,
      );

      // SQUISH PHYSICS: Subtle volume-preserving pulse
      const pulse = 1 + Math.sin(t * 18) * 0.02;
      rootRef.current.scale.set(pulse, 1 / pulse, pulse);

      // LIFT: Move up toward the user interaction point
      rootRef.current.position.y = THREE.MathUtils.lerp(
        rootRef.current.position.y,
        0.35,
        0.06,
      );
    } else {
      // Smoothly return to rest values when not petting
      rootRef.current.rotation.y = THREE.MathUtils.lerp(
        rootRef.current.rotation.y,
        0,
        0.08,
      );
      rootRef.current.rotation.x = THREE.MathUtils.lerp(
        rootRef.current.rotation.x,
        0,
        0.08,
      );
      rootRef.current.scale.x = THREE.MathUtils.lerp(
        rootRef.current.scale.x,
        1,
        0.1,
      );
      rootRef.current.scale.y = THREE.MathUtils.lerp(
        rootRef.current.scale.y,
        1,
        0.1,
      );
      rootRef.current.scale.z = THREE.MathUtils.lerp(
        rootRef.current.scale.z,
        1,
        0.1,
      );
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    onPet(true);
    document.body.style.cursor = "grabbing";

    // Auto-reset state after interaction duration
    setTimeout(() => {
      onPet(false);
      if (document.body.style.cursor === "grabbing") {
        document.body.style.cursor = "grab";
      }
    }, 1200);
  };

  return (
    <group>
      <mesh
        onPointerDown={handlePointerDown}
        onPointerOver={() => {
          document.body.style.cursor = "grab";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
        position={[0, 0, 0.8]}
        visible={false}
      >
        <sphereGeometry args={[1.5, 16, 16]} />
      </mesh>

      <HeartParticles active={isPetting} />
    </group>
  );
}
