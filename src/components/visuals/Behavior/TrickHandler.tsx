import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useState, type RefObject, useEffect } from "react";

// Exported the type so we can use it in our UI and state files
export type TrickType = "none" | "barrelRoll" | "backflip" | "spin";

interface TrickProps {
  rootRef: RefObject<THREE.Group>;
  trick: TrickType;
  onTrickComplete: () => void;
}

/**
 * TrickHandler Component
 * Manages complex, multi-axis animations for pet tricks.
 * Uses time-based easing and base-transform caching to ensure
 * the 3D model always returns to a stable state without drifting.
 */
export function TrickHandler({ rootRef, trick, onTrickComplete }: TrickProps) {
  const [trickProgress, setTrickProgress] = useState(0);

  // We must capture the base position and rotation exactly when a trick starts.
  // This gives us a safe anchor point to animate relative to, and a safe
  // point to return to, preventing cumulative math errors from breaking the model.
  const [baseTransform, setBaseTransform] = useState<{
    y: number;
    rotX: number;
    rotY: number;
    rotZ: number;
  } | null>(null);

  // Reset progress and capture base transform every time a new trick begins
  useEffect(() => {
    if (trick !== "none" && rootRef.current) {
      setTrickProgress(0);
      setBaseTransform({
        y: rootRef.current.position.y,
        rotX: rootRef.current.rotation.x,
        rotY: rootRef.current.rotation.y,
        rotZ: rootRef.current.rotation.z,
      });
    } else {
      // Clear the transform cache when no trick is running
      setBaseTransform(null);
    }
  }, [trick, rootRef]);

  useFrame((_, delta) => {
    // Abort if the ref isn't ready, no trick is active, or we haven't captured the base state
    if (!rootRef.current || trick === "none" || !baseTransform) return;

    // Progress goes from 0 to 1. The multiplier controls the trick duration.
    // 1.2 means the trick takes about 0.83 seconds (1 / 1.2).
    const speedMultiplier = 1.2;
    const newProgress = Math.min(trickProgress + delta * speedMultiplier, 1.0);

    // Ease In/Out Sine function. This makes the animation start slowly,
    // speed up in the middle, and slow down at the end (organic momentum).
    const ease = -(Math.cos(Math.PI * newProgress) - 1) / 2;

    // Execute the specific math for the active trick
    if (trick === "barrelRoll") {
      // Z-axis 360 degree rotation.
      rootRef.current.rotation.z = baseTransform.rotZ + ease * Math.PI * 2;

      // Temporary pitch (X-axis) using a sine wave.
      // This tilts the axolotl forward mid-roll so the user can see its
      // 3D volume, solving the issue of the roll looking flat/2D.
      rootRef.current.rotation.x =
        baseTransform.rotX - Math.sin(newProgress * Math.PI) * 0.4;
    } else if (trick === "backflip") {
      // X-axis 360 degree reverse rotation.
      rootRef.current.rotation.x = baseTransform.rotX - ease * Math.PI * 2;

      // A flip requires a jump! We use a sine wave on the Y position to
      // create a parabolic arc peaking at 0.6 units high so it doesn't clip the floor.
      rootRef.current.position.y =
        baseTransform.y + Math.sin(newProgress * Math.PI) * 0.6;
    } else if (trick === "spin") {
      // Y-axis 360 horizontal spin (like a dog chasing its tail).
      rootRef.current.rotation.y = baseTransform.rotY + ease * Math.PI * 2;

      // Add a tiny energetic hop during the spin.
      rootRef.current.position.y =
        baseTransform.y + Math.sin(newProgress * Math.PI) * 0.2;
    }

    // Check if the animation cycle is complete
    if (newProgress >= 1.0) {
      // STRICT SNAP: Forcibly reset to the cached base transform to clear
      // any tiny floating-point decimals that could cause long-term model drift.
      rootRef.current.position.y = baseTransform.y;
      rootRef.current.rotation.x = baseTransform.rotX;
      rootRef.current.rotation.y = baseTransform.rotY;
      rootRef.current.rotation.z = baseTransform.rotZ;

      setTrickProgress(0);
      onTrickComplete();
    } else {
      setTrickProgress(newProgress);
    }
  });

  return null;
}
