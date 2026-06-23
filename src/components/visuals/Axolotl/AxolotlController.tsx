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
  AccessoryType,
  AxolotlMood,
  AxolotlTrick,
  ColorPalette,
} from "../../../state/aquarium";

interface ControllerProps {
  isPetting: boolean;
  setIsPetting: (val: boolean) => void;
  isFeeding: boolean;
  snackCount: number;
  colorPalette: ColorPalette;
  mood: AxolotlMood;
  trick: AxolotlTrick;
  currentAccessory: AccessoryType | null;
  onTrickComplete: () => void;
}

export default function AxolotlController({
  isPetting,
  setIsPetting,
  isFeeding,
  snackCount,
  colorPalette,
  mood,
  trick,
  currentAccessory,
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

        {/* Enhanced Trick Logic: Now supports barrelRoll, backflip, spin, and toot */}
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
          snackCount={snackCount}
          currentAccessory={currentAccessory}
        />
      </group>
    </Float>
  );
}
