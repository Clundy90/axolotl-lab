import React, { useRef } from "react";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import ToyAxolotl from "./ToyAxolotl";
import PettingHandler from "./PettingHandler";
import { useAxolotlMovement } from "./useAxolotlMovement";
import type { AxolotlMood, AxolotlTrick } from "./useAxolotlMovement";
import type { ColorPalette } from "./AxolotlStyles";

interface ControllerProps {
  isPetting: boolean;
  setIsPetting: (val: boolean) => void;
  isFeeding: boolean;
  colorPalette: ColorPalette;
  mood: AxolotlMood;
  trick: AxolotlTrick;
  onTrickComplete: () => void;
}

export default function AxolotlController({
  isPetting,
  setIsPetting,
  isFeeding,
  colorPalette,
  mood,
  trick,
  onTrickComplete,
}: ControllerProps) {
  // CRITICAL FIX: The "!" ensures this matches the RefObject type expected by the hook
  const rootRef = useRef<THREE.Group>(null!);

  useAxolotlMovement({
    rootRef,
    isFeeding,
    isPetting,
    mood,
    trick,
    onTrickComplete,
  });

  return (
    <Float speed={0.5} rotationIntensity={0.0} floatIntensity={0.04}>
      <group ref={rootRef}>
        <PettingHandler isPetting={isPetting} onPet={setIsPetting} />
        <ToyAxolotl
          isPetting={isPetting}
          isFeeding={isFeeding}
          colorPalette={colorPalette}
        />
      </group>
    </Float>
  );
}
