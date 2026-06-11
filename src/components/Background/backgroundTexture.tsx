import React from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { AQUARIUM_BACKGROUNDS } from "./backgroundTypes";

AQUARIUM_BACKGROUNDS.forEach((background) => {
  if (background.url) {
    useTexture.preload(background.url);
  }
});

// Define the interface for the component props
interface AquariumBackgroundProps {
  currentBgUrl: string;
}

export const AquariumBackground: React.FC<AquariumBackgroundProps> = ({
  currentBgUrl,
}) => {
  const texture = useTexture(currentBgUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;

  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  return (
    <mesh position={[0, 0, -5]}>
      <planeGeometry args={[16, 9]} />

      <meshBasicMaterial
        map={texture}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
