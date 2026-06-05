import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { BackgroundFishItem } from "../../../types/aquarium";
import BackgroundFishSprite from "./BackgroundFishModels";
import { wrapBackgroundFishX } from "../../../state/aquariumState";

interface BackgroundFishLayerProps {
  fish: BackgroundFishItem[];
}

function SwimmingFish({ fish }: { fish: BackgroundFishItem }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const nextX =
      groupRef.current.position.x + fish.direction * fish.speed * delta;
    groupRef.current.position.x = wrapBackgroundFishX(
      nextX,
      fish.direction,
    );
    groupRef.current.position.y =
      fish.position[1] + Math.sin(state.clock.elapsedTime * 1.2 + fish.id) * 0.08;
  });

  return (
    <group ref={groupRef} position={fish.position} scale={fish.scale}>
      <BackgroundFishSprite type={fish.type} direction={fish.direction} />
    </group>
  );
}

export default function BackgroundFishLayer({
  fish,
}: BackgroundFishLayerProps) {
  return (
    <group>
      {fish.map((item) => (
        <SwimmingFish key={item.id} fish={item} />
      ))}
    </group>
  );
}
