import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GillSetProps {
  side: 1 | -1;
  color: string;
}

export default function GillSet({ side, color }: GillSetProps) {
  // References for the 3 main gill stalks so we can animate them independently
  const refs = [
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
  ];

  // Fluid, organic swaying animation
  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    refs.forEach((ref, index) => {
      if (!ref.current) return;

      // Main up/down breathing motion (retained your original math structure, just smoothed out)
      ref.current.rotation.z =
        side * (0.2 + Math.sin(time * 1.2 + index * 1.0) * 0.12);

      // Added a slight forward/backward flutter for more organic life
      ref.current.rotation.x = Math.cos(time * 1.5 + index * 0.8) * 0.06;
    });
  });

  // Reverted to your exact original Z-axis offsets for perfect placement
  const zOffsets = [0.15, 0, -0.15];

  // Generate the extravagant frills (fimbriae) dynamically
  const filaments = useMemo(() => {
    const fils = [];
    const count = 16; // Dense array of 16 filaments per stalk for maximum frill

    for (let i = 0; i < count; i++) {
      // 't' represents the position along the stalk (0 to 1).
      // We start at 0.1 and end at 0.9 to avoid placing frills on the very base or extreme tip.
      const t = 0.1 + (i / (count - 1)) * 0.8;

      // Calculate Y position along the stalk.
      // The stalk is 0.32 tall, so its local Y coordinates range from -0.16 to 0.16
      const yPos = (t - 0.5) * 0.32;

      // Push the filaments slightly outward from the center of the stalk
      const xPos = side * 0.02;

      // Alternate placing filaments slightly to the front and back for a thick, bushy 3D look
      const zPos = i % 2 === 0 ? 0.015 : -0.015;

      // Angle the filaments outward from the stalk, increasing the angle toward the top
      const zRot = side * -(0.8 + t * 0.4);
      // Splay them open (front/back) based on their alternating position
      const xRot = i % 2 === 0 ? 0.4 : -0.4;

      // Taper the size: Math.sin(t * PI) creates an arc where the middle filaments are the longest
      // and they taper down beautifully at the base and tip to create a natural leaf shape.
      const scale = Math.sin(t * Math.PI) * 0.8 + 0.4;

      fils.push({ pos: [xPos, yPos, zPos], rot: [xRot, 0, zRot], scale });
    }
    return fils;
  }, [side]);

  return (
    <group
      // Reverted EXACTLY to your preferred original base coordinates
      position={[side * 0.46, 0.04, 0.01]}
      rotation={[0, side * 0.2, side * -0.15]}
    >
      {zOffsets.map((zOffset, index) => {
        // Naturally scale the gills so the back ones are slightly larger than the front ones
        const scale = 0.9 + index * 0.15;

        return (
          <group
            key={index}
            ref={refs[index]}
            position={[0, 0, zOffset]}
            scale={[scale, scale, scale]}
          >
            {/* Inner group shifts the geometry up so the pivot point remains at the base.
              This allows the gills to swing from the bottom connection point rather than spinning from the middle.
            */}
            <group
              position={[side * 0.1, 0.2, 0]}
              rotation={[0, 0, side * -0.1]}
            >
              {/* Main Stalk (Ramus) */}
              <mesh>
                <capsuleGeometry args={[0.028, 0.32, 8, 8]} />
                <meshStandardMaterial color={color} roughness={0.7} />
              </mesh>

              {/* The Extravagant Frilly Filaments */}
              {filaments.map((fil, fIdx) => (
                <mesh
                  key={fIdx}
                  position={fil.pos as [number, number, number]}
                  rotation={fil.rot as [number, number, number]}
                  scale={[fil.scale, fil.scale, fil.scale]}
                >
                  {/* Extremely thin, soft capsules for the delicate frills */}
                  <capsuleGeometry args={[0.01, 0.12, 4, 6]} />
                  <meshStandardMaterial
                    color={color}
                    roughness={0.5}
                    transparent
                    opacity={0.85} // Slightly translucent for that fleshy underwater look
                  />
                </mesh>
              ))}
            </group>
          </group>
        );
      })}
    </group>
  );
}
