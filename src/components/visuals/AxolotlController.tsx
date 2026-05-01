import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import ToyAxolotl from "./ToyAxolotl";
import type { ColorPalette } from "./ToyAxolotl";
import PettingHandler from "./PettingHandler"; // Assuming you kept this separate
import Food from "./Food"; // Or FallingWorm if you kept it inline

/**
 * AxolotlController Component
 * Handles the pathing, banking, and global movement logic for the Axolotl.
 * Keeps the model logic clean and separate. [2026-02-27]
 */

interface ControllerProps {
  isPetting: boolean;
  setIsPetting: (val: boolean) => void;
  isFeeding: boolean;
  colorPalette: ColorPalette;
}

export default function AxolotlController({
  isPetting,
  setIsPetting,
  isFeeding,
  colorPalette,
}: ControllerProps) {
  const rootRef = useRef<THREE.Group>(null);

  // Global Movement / Pathing Logic
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.28;
    if (!rootRef.current) return;

    const speedMult = isFeeding ? 0.3 : 1.0;

    // Core Pathing - Defines the swimming circle
    const x = Math.sin(t) * 3.0 * speedMult;
    const y = Math.sin(t * 0.55) * 0.55 * speedMult;
    const z = Math.cos(t * 0.7) * 0.9 * speedMult;
    rootRef.current.position.set(x, y, z);

    // Direction the model is facing
    const dx = Math.cos(t) * 3.0;
    const dz = -Math.sin(t * 0.7) * 0.9;

    if (isFeeding) {
      // Level out to eat
      rootRef.current.rotation.y = THREE.MathUtils.lerp(
        rootRef.current.rotation.y,
        0,
        0.05,
      );
      rootRef.current.rotation.x = THREE.MathUtils.lerp(
        rootRef.current.rotation.x,
        0.2,
        0.05,
      );
      rootRef.current.rotation.z = THREE.MathUtils.lerp(
        rootRef.current.rotation.z,
        0,
        0.05,
      );
    } else {
      // Look towards where it's swimming
      rootRef.current.rotation.y = Math.atan2(dx, dz);
      rootRef.current.rotation.x = 0;

      // Dynamic Banking - Leans into the turn
      const bankAngle = Math.cos(t) * 0.25;
      rootRef.current.rotation.z = -Math.sin(t) * 0.15 * speedMult + bankAngle;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.0} floatIntensity={0.04}>
      <group ref={rootRef}>
        {/* Interaction Wrapper */}
        <PettingHandler isPetting={isPetting} onPet={setIsPetting} />

        {/* If your falling worm logic is in Food.tsx, render it here */}
        {isFeeding && <Food active={isFeeding} />}

        {/* The Clean Model */}
        <ToyAxolotl
          isPetting={isPetting}
          isFeeding={isFeeding}
          colorPalette={colorPalette}
        />
      </group>
    </Float>
  );
}
