import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useState, type RefObject } from "react";

export type AxolotlMood = "chill" | "excited";
export type AxolotlTrick = "none" | "barrelRoll";

interface MovementProps {
  rootRef: RefObject<THREE.Group>;
  isFeeding: boolean;
  isPetting: boolean;
  mood: AxolotlMood;
  trick: AxolotlTrick;
  onTrickComplete: () => void;
}

// Ensure the word 'export' is right here before 'function'
export function useAxolotlMovement({
  rootRef,
  isFeeding,
  isPetting,
  mood,
  trick,
  onTrickComplete,
}: MovementProps) {
  const [trickProgress, setTrickProgress] = useState(0);

  useFrame(({ clock }, delta) => {
    if (!rootRef.current) return;
    const t = clock.getElapsedTime();

    // 1. Petting Logic
    if (isPetting) {
      rootRef.current.position.lerp(new THREE.Vector3(0, 0, 2), 0.05);
      const wiggle = Math.sin(t * 12) * 0.1;
      rootRef.current.rotation.set(0, wiggle, 0);
      return;
    }

    if (isFeeding) {
      // Ensure this Z matches the Worm.tsx (2.0)
      const targetPos = new THREE.Vector3(0, 0, 2.0);

      // If she is very close, snap her exactly to the spot
      const distance = rootRef.current.position.distanceTo(targetPos);
      const lerpSpeed = distance < 0.5 ? 0.2 : 0.12;

      rootRef.current.position.lerp(targetPos, lerpSpeed);

      // Keep her nose pointed slightly up for the catch
      rootRef.current.rotation.x = THREE.MathUtils.lerp(
        rootRef.current.rotation.x,
        -0.3,
        0.1,
      );
      rootRef.current.rotation.y = THREE.MathUtils.lerp(
        rootRef.current.rotation.y,
        0,
        0.1,
      );
      rootRef.current.rotation.z = THREE.MathUtils.lerp(
        rootRef.current.rotation.z,
        0,
        0.1,
      );
      return;
    }

    // 3. Normal Pathing
    const speed = mood === "excited" ? 0.6 : 0.28;
    const timeFactor = t * speed;
    const ampX = mood === "excited" ? 4.0 : 3.0;

    rootRef.current.position.set(
      Math.sin(timeFactor) * ampX,
      Math.sin(timeFactor * 0.55) * 0.55,
      Math.cos(timeFactor * 0.7) * 0.9,
    );

    const dx = Math.cos(timeFactor) * ampX;
    const dz = -Math.sin(timeFactor * 0.7) * 0.9;
    rootRef.current.rotation.y = Math.atan2(dx, dz);

    let targetRotZ = -Math.sin(timeFactor) * 0.15 + Math.cos(timeFactor) * 0.25;

    // 4. Trick Logic
    if (trick === "barrelRoll") {
      const newProgress = trickProgress + delta * 1.5;
      if (newProgress >= 1.0) {
        setTrickProgress(0);
        onTrickComplete();
      } else {
        setTrickProgress(newProgress);
        targetRotZ += newProgress * Math.PI * 2;
      }
    }

    rootRef.current.rotation.z = targetRotZ;
  });
}
