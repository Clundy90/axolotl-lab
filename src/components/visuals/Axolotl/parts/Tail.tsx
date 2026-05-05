import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ColorPalette } from "../../../../types/aquarium";

interface TailProps {
  colors: ColorPalette;
}

const SEGMENTS = [
  { radiusA: 0.26, radiusB: 0.22, length: 0.34, amp: 0.1, yFin: 0.2 },
  { radiusA: 0.22, radiusB: 0.17, length: 0.32, amp: 0.16, yFin: 0.18 },
  { radiusA: 0.17, radiusB: 0.12, length: 0.3, amp: 0.24, yFin: 0.15 },
  { radiusA: 0.12, radiusB: 0.07, length: 0.28, amp: 0.34, yFin: 0.12 },
];

export default function Tail({ colors }: TailProps) {
  const segment0Ref = useRef<THREE.Group>(null);
  const segment1Ref = useRef<THREE.Group>(null);
  const segment2Ref = useRef<THREE.Group>(null);
  const segment3Ref = useRef<THREE.Group>(null);
  const refs = [segment0Ref, segment1Ref, segment2Ref, segment3Ref];

  useFrame(({ clock }) => {
    const wave = clock.elapsedTime * 3.4;
    refs.forEach((ref, index) => {
      if (!ref.current) return;
      ref.current.rotation.y = Math.sin(wave - index * 0.52) * SEGMENTS[index].amp;
      ref.current.rotation.x = Math.cos(wave * 0.7 - index * 0.4) * 0.02;
    });
  });

  return (
    <group position={[0, -0.01, -0.5]}>
      <group ref={refs[0]}>
        <mesh position={[0, 0, -SEGMENTS[0].length * 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry
            args={[SEGMENTS[0].radiusA, SEGMENTS[0].radiusB, SEGMENTS[0].length, 16]}
          />
          <meshStandardMaterial color={colors.main} roughness={0.66} />
        </mesh>
        <mesh position={[0, SEGMENTS[0].yFin, -SEGMENTS[0].length * 0.5]} scale={[0.13, 1, 1.3]}>
          <sphereGeometry args={[0.16, 14, 14]} />
          <meshStandardMaterial
            color={colors.dark}
            transparent
            opacity={0.72}
            emissive={colors.sparkleColor ?? colors.light}
            emissiveIntensity={0.45}
          />
        </mesh>

        <group position={[0, 0, -SEGMENTS[0].length + 0.035]} ref={refs[1]}>
          <mesh position={[0, 0, -SEGMENTS[1].length * 0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry
              args={[SEGMENTS[1].radiusA, SEGMENTS[1].radiusB, SEGMENTS[1].length, 16]}
            />
            <meshStandardMaterial color={colors.main} roughness={0.66} />
          </mesh>
          <mesh
            position={[0, SEGMENTS[1].yFin, -SEGMENTS[1].length * 0.5]}
            scale={[0.12, 1, 1.4]}
          >
            <sphereGeometry args={[0.14, 14, 14]} />
            <meshStandardMaterial
              color={colors.dark}
              transparent
              opacity={0.7}
              emissive={colors.sparkleColor ?? colors.light}
              emissiveIntensity={0.45}
            />
          </mesh>

          <group position={[0, 0, -SEGMENTS[1].length + 0.03]} ref={refs[2]}>
            <mesh
              position={[0, 0, -SEGMENTS[2].length * 0.5]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry
                args={[SEGMENTS[2].radiusA, SEGMENTS[2].radiusB, SEGMENTS[2].length, 14]}
              />
              <meshStandardMaterial color={colors.main} roughness={0.66} />
            </mesh>
            <mesh
              position={[0, SEGMENTS[2].yFin, -SEGMENTS[2].length * 0.5]}
              scale={[0.1, 1, 1.45]}
            >
              <sphereGeometry args={[0.12, 14, 14]} />
              <meshStandardMaterial
                color={colors.dark}
                transparent
                opacity={0.72}
                emissive={colors.sparkleColor ?? colors.light}
                emissiveIntensity={0.45}
              />
            </mesh>

            <group position={[0, 0, -SEGMENTS[2].length + 0.03]} ref={refs[3]}>
              <mesh
                position={[0, 0, -SEGMENTS[3].length * 0.5]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <cylinderGeometry
                  args={[SEGMENTS[3].radiusA, SEGMENTS[3].radiusB, SEGMENTS[3].length, 12]}
                />
                <meshStandardMaterial color={colors.main} roughness={0.66} />
              </mesh>
              <mesh position={[0, 0, -SEGMENTS[3].length - 0.1]} scale={[0.1, 0.95, 2.2]}>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshStandardMaterial
                  color={colors.dark}
                  transparent
                  opacity={0.76}
                  roughness={0.62}
                  emissive={colors.sparkleColor ?? colors.light}
                  emissiveIntensity={0.55}
                />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
