import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { RefObject } from "react";
import type { AxolotlMood } from "../../../types/aquarium";

interface MovementProps {
  rootRef: RefObject<THREE.Group>;
  mood: AxolotlMood;
  // We keep these as flags to know when to PAUSE the idle swim
  isFeeding: boolean;
  isPetting: boolean;
  isDoingTrick: boolean;
}

export function useAxolotlMovement({
  rootRef,
  mood,
  isFeeding,
  isPetting,
  isDoingTrick,
}: MovementProps) {
  useFrame(({ clock }) => {
    if (!rootRef.current) return;

    // If any special interaction is happening, the interaction handlers
    // (FeedingHandler, PettingHandler) take over the ref.
    if (isFeeding || isPetting || isDoingTrick) return;

    const t = clock.getElapsedTime();

    // 1. Normal Pathing Logic
    // Speed and amplitude vary based on the axolotl's current mood.
    const speed = mood === "excited" ? 0.6 : mood === "lazy" ? 0.2 : 0.28;
    const timeFactor = t * speed;
    const ampX = mood === "excited" ? 3.3 : mood === "lazy" ? 1.7 : 2.6;
    const ampY = mood === "lazy" ? 0.22 : 0.45;
    const ampZ = mood === "lazy" ? 0.5 : 0.75;

    // Calculate position using sine/cosine for a natural "figure-8" or oval path
    rootRef.current.position.set(
      Math.sin(timeFactor) * ampX,
      Math.sin(timeFactor * 0.55) * ampY,
      Math.cos(timeFactor * 0.7) * ampZ,
    );

    // 2. Procedural Rotation
    // Calculates the heading based on the derivative of the position
    const dx = Math.cos(timeFactor) * ampX;
    const dz = -Math.sin(timeFactor * 0.7) * 0.9;
    rootRef.current.rotation.y = Math.atan2(dx, dz);

    // Add a slight banking/roll effect as she turns
    rootRef.current.rotation.z =
      -Math.sin(timeFactor) * 0.15 + Math.cos(timeFactor) * 0.25;
  });
}
