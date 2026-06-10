// src/components/visuals/Axolotl/ToyAxolotl.tsx
import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AccessoryType, ColorPalette } from "../../../state/aquarium";
import AccessoryModel from "../../Accessories/AccessoryModel";
import BreathBubbles from "./parts/BreathBubbles";
import GillSet from "./parts/GillSet";
import Leg from "./parts/Leg";
import Tail from "./parts/Tail";

interface AxolotlModelProps {
  isPetting: boolean;
  isFeeding: boolean;
  colorPalette: ColorPalette;
  snackCount: number;
  currentAccessory: AccessoryType | null;
}

export default function ToyAxolotl({
  isPetting,
  isFeeding,
  colorPalette,
  snackCount,
  currentAccessory,
}: AxolotlModelProps) {
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const [chompUntil, setChompUntil] = useState(0);

  useEffect(() => {
    setChompUntil(performance.now() + 420);
  }, [snackCount]);

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime;
    if (bodyRef.current) {
      bodyRef.current.rotation.z = Math.sin(elapsed * 3.8) * 0.03;
      bodyRef.current.rotation.x = Math.cos(elapsed * 2.4) * 0.015;
    }
    if (headRef.current) {
      const isChomping = performance.now() < chompUntil;
      const feedingTilt = isFeeding ? -0.15 : 0;
      const chompTilt = isChomping ? -0.25 + Math.sin(elapsed * 26) * 0.05 : 0;
      headRef.current.rotation.x =
        feedingTilt + chompTilt + Math.sin(elapsed * 1.1) * 0.03;
    }
  });

  const isChomping = performance.now() < chompUntil;

  // Material helpers
  const glowMaterial = {
    emissive: new THREE.Color(colorPalette.body),
    emissiveIntensity: 0.14,
  };

  return (
    <group scale={0.58}>
      {/* TAIL: Split into muscle and fins */}
      <Tail tailColor={colorPalette.tail} finColor={colorPalette.fins} />

      <group ref={bodyRef} position={[0, -0.02, 0.06]}>
        {/* MAIN BODY */}
        <mesh castShadow scale={[0.82, 0.78, 1.58]}>
          <sphereGeometry args={[0.5, 28, 28]} />
          <meshStandardMaterial
            color={colorPalette.body}
            roughness={0.72}
            {...glowMaterial}
          />
        </mesh>
        {/* BELLY */}
        <mesh position={[0, -0.12, 0.1]} scale={[0.74, 0.5, 1.2]}>
          <sphereGeometry args={[0.36, 20, 20]} />
          <meshStandardMaterial color={colorPalette.body} roughness={0.76} />
        </mesh>
      </group>

      <group ref={headRef} position={[0, 0.02, 0.82]}>
        <BreathBubbles />

        {/* HEAD */}
        <mesh castShadow>
          <sphereGeometry args={[0.52, 24, 24]} />
          <meshStandardMaterial
            color={colorPalette.body}
            roughness={0.72}
            {...glowMaterial}
          />
        </mesh>

        {/* EYES */}
        {([-1, 1] as const).map((side) => (
          <group
            key={side}
            position={[side * 0.31, 0.16, 0.4]}
            rotation={[0, side * 0.35, 0]}
          >
            <mesh scale={[1, 1.2, 0.3]}>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial
                color={colorPalette.eyes}
                roughness={0.12}
              />
            </mesh>
            <mesh position={[0.04, 0.05, 0.04]} scale={[1, 1, 0.2]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color="#ffffff" roughness={0.15} />
            </mesh>
          </group>
        ))}

        {/* MOUTH */}
        {isFeeding || isPetting || isChomping ? (
          <mesh position={[0, -0.15, 0.5]} scale={[1, 1, 0.34]}>
            <sphereGeometry args={[0.09, 14, 14]} />
            <meshStandardMaterial color="#2a0f16" roughness={0.84} />
          </mesh>
        ) : (
          <mesh position={[0, -0.15, 0.51]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.04, 0.014, 10, 22, Math.PI]} />
            <meshStandardMaterial color={colorPalette.eyes} roughness={0.5} />
          </mesh>
        )}

        {/* GILLS */}
        <GillSet side={1} color={colorPalette.gills} />
        <GillSet side={-1} color={colorPalette.gills} />

        {currentAccessory ? <AccessoryModel type={currentAccessory} /> : null}
      </group>

      {/* LEGS & TOES */}
      <Leg
        position={[0.25, -0.22, 0.33]}
        phase={0}
        side={1}
        legColor={colorPalette.legs}
        toeColor={colorPalette.toes}
      />
      <Leg
        position={[-0.25, -0.22, 0.33]}
        phase={Math.PI}
        side={-1}
        legColor={colorPalette.legs}
        toeColor={colorPalette.toes}
      />
      <Leg
        position={[0.22, -0.22, -0.16]}
        phase={Math.PI}
        side={1}
        legColor={colorPalette.legs}
        toeColor={colorPalette.toes}
      />
      <Leg
        position={[-0.22, -0.22, -0.16]}
        phase={0}
        side={-1}
        legColor={colorPalette.legs}
        toeColor={colorPalette.toes}
      />
    </group>
  );
}
