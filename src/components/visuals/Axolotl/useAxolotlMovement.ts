import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import type { AxolotlMood } from "../../../state/aquarium";

interface MovementProps {
  rootRef: RefObject<THREE.Group>;
  mood: AxolotlMood;
  // We keep these as flags to know when to PAUSE the idle swim
  isFeeding: boolean;
  isPetting: boolean;
  isDoingTrick: boolean;
}

const MOOD_MOTION = {
  chill: {
    speed: 0.34,
    ampX: 2.5,
    ampY: 0.38,
    ampZ: 0.72,
    yOffset: 0,
    pitch: 0,
    bank: 0.2,
    bob: 0.02,
  },
  excited: {
    speed: 0.72,
    ampX: 3.15,
    ampY: 0.5,
    ampZ: 0.92,
    yOffset: 0.12,
    pitch: 0.08,
    bank: 0.34,
    bob: 0.12,
  },
  lazy: {
    speed: 0.16,
    ampX: 1.45,
    ampY: 0.12,
    ampZ: 0.38,
    yOffset: -0.34,
    pitch: -0.16,
    bank: 0.08,
    bob: 0.015,
  },
} satisfies Record<AxolotlMood, Record<string, number>>;

export function useAxolotlMovement({
  rootRef,
  mood,
  isFeeding,
  isPetting,
  isDoingTrick,
}: MovementProps) {
  const swimPhase = useRef(0);
  const motion = useRef({ ...MOOD_MOTION.chill });

  useFrame(({ clock }, delta) => {
    if (!rootRef.current) return;

    // If any special interaction is happening, the interaction handlers
    // (FeedingHandler, PettingHandler) take over the ref.
    if (isFeeding || isPetting || isDoingTrick) return;

    const t = clock.getElapsedTime();
    const target = MOOD_MOTION[mood];

    Object.keys(target).forEach((key) => {
      const motionKey = key as keyof typeof target;
      motion.current[motionKey] = THREE.MathUtils.lerp(
        motion.current[motionKey],
        target[motionKey],
        1 - Math.pow(0.001, delta),
      );
    });

    // Keep a continuous path phase so mood changes adjust motion without teleporting.
    swimPhase.current += delta * motion.current.speed;

    const timeFactor = swimPhase.current;
    const energeticBob =
      Math.sin(t * 3.2) * motion.current.bob +
      Math.sin(timeFactor * 1.7) * motion.current.bob * 0.45;

    // Calculate position using sine/cosine for a natural "figure-8" or oval path
    rootRef.current.position.set(
      Math.sin(timeFactor) * motion.current.ampX,
      Math.sin(timeFactor * 0.55) * motion.current.ampY +
        motion.current.yOffset +
        energeticBob,
      Math.cos(timeFactor * 0.7) * motion.current.ampZ,
    );

    // 2. Procedural Rotation
    // Calculates the heading based on the derivative of the position
    const dx = Math.cos(timeFactor) * motion.current.ampX;
    const dz = -Math.sin(timeFactor * 0.7) * 0.7 * motion.current.ampZ;
    rootRef.current.rotation.y = Math.atan2(dx, dz);

    // Add a slight banking/roll effect as she turns
    const turnRoll =
      -Math.sin(timeFactor) * motion.current.bank +
      Math.cos(timeFactor * 0.8) * motion.current.bank * 0.65;
    const noseTilt =
      motion.current.pitch + Math.sin(timeFactor * 1.4) * motion.current.bob;

    rootRef.current.rotation.x = noseTilt;
    rootRef.current.rotation.z = turnRoll;
  });
}
