import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { RefObject } from "react";

interface FeedingProps {
  rootRef: RefObject<THREE.Group>;
  isFeeding: boolean;
}

export function FeedingHandler({ rootRef, isFeeding }: FeedingProps) {
  useFrame(() => {
    if (!isFeeding || !rootRef.current) return;

    // Target Z matches the target location of the worm spawn (2.0)
    const targetPos = new THREE.Vector3(0, 0, 2.0);
    const distance = rootRef.current.position.distanceTo(targetPos);

    // Math logic: Increase speed as she gets closer for a "snap" effect
    const lerpSpeed = distance < 0.5 ? 0.2 : 0.12;
    rootRef.current.position.lerp(targetPos, lerpSpeed);

    // Nose points slightly up for the catch
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
  });

  return null; // This is a logic-only component
}
