import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { BackgroundFishItem } from "../../../types/aquarium";
import BackgroundFishSprite from "./BackgroundFishModels";

interface BackgroundFishLayerProps {
  fish: BackgroundFishItem[];
  onRemoveFish: (id: number) => void;
}

function SwimmingFish({
  fish,
  onRemoveFish,
}: {
  fish: BackgroundFishItem;
  onRemoveFish: (id: number) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const nextX =
      groupRef.current.position.x + fish.direction * fish.speed * delta;
    groupRef.current.position.x = nextX;
    groupRef.current.position.y =
      fish.position[1] + Math.sin(state.clock.elapsedTime * 1.2 + fish.id) * 0.08;

    if (nextX > 7.8 || nextX < -7.8) {
      onRemoveFish(fish.id);
    }
  });

  return (
    <group ref={groupRef} position={fish.position} scale={fish.scale}>
      <BackgroundFishSprite type={fish.type} direction={fish.direction} />
    </group>
  );
}

export default function BackgroundFishLayer({
  fish,
  onRemoveFish,
}: BackgroundFishLayerProps) {
  return (
    <group>
      {fish.map((item) => (
        <SwimmingFish key={item.id} fish={item} onRemoveFish={onRemoveFish} />
      ))}
    </group>
  );
}
