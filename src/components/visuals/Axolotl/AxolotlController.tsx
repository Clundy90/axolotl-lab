import React, { useRef } from "react";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import ToyAxolotl from "./ToyAxolotl";
import PettingHandler from "../Behavior/PettingHandler";
import { FeedingHandler } from "../Behavior/FeedingHandler";
import { TrickHandler } from "../Behavior/TrickHandler";
import { useAxolotlMovement } from "./useAxolotlMovement";
// Import the types from your centralized file
import type {
  AxolotlMood,
  AxolotlTrick,
  ColorPalette,
} from "../../../types/aquarium";

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
  const rootRef = useRef<THREE.Group>(null!);

  /**
   * useAxolotlMovement handles the base swimming logic.
   * isDoingTrick is passed to pause standard pathing during animations.
   */
  useAxolotlMovement({
    rootRef,
    isFeeding,
    isPetting,
    mood,
    isDoingTrick: trick !== "none",
  });

  return (
    <Float speed={0.5} rotationIntensity={0.0} floatIntensity={0.04}>
      <group ref={rootRef}>
        {/* Manages interaction zone and hand cursor states */}
        <PettingHandler
          rootRef={rootRef}
          isPetting={isPetting}
          onPet={setIsPetting}
        />

        {/* Feeding Logic */}
        <FeedingHandler rootRef={rootRef} isFeeding={isFeeding} />

        {/* Enhanced Trick Logic: Now supports barrelRoll, backflip, and spin */}
        <TrickHandler
          rootRef={rootRef}
          trick={trick}
          onTrickComplete={onTrickComplete}
        />

        {/* The Visual Model */}
        <ToyAxolotl
          isPetting={isPetting}
          isFeeding={isFeeding}
          colorPalette={colorPalette}
        />
      </group>
    </Float>
  );
}
