import React from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { BackgroundFishType } from "../../../types/aquarium";
import {
  BACKGROUND_FISH_OPTIONS,
  getBackgroundFishUrl,
} from "./BackgroundFishCatalog";

BACKGROUND_FISH_OPTIONS.forEach((option) => useTexture.preload(option.url));

interface FishSpriteProps {
  type: BackgroundFishType;
  direction: 1 | -1;
}

export default function BackgroundFishSprite({
  type,
  direction,
}: FishSpriteProps) {
  const texture = useTexture(getBackgroundFishUrl(type));
  texture.minFilter = THREE.LinearFilter;

  return (
    <mesh scale={[direction * 1.1, 0.82, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        map={texture}
        transparent
        side={THREE.DoubleSide}
        roughness={0.6}
        alphaTest={0.05}
        depthWrite={false}
      />
    </mesh>
  );
}
