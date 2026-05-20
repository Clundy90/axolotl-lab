import React from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

/**
 * 2D BILLBOARD DECORATION MODELS
 * Loads 2D vector/png fish assets from Kenney's fish pack as textures
 * and applies them to flat 3D planes inside the aquarium canvas.
 */

// Preload the images to prevent flickering when dropping them into the scene
useTexture.preload("/textures/fish_blue.svg");
useTexture.preload("/textures/fish_green.svg");
useTexture.preload("/textures/fish_brown.svg");
useTexture.preload("/textures/fish_orange.svg");

interface FishSpriteProps {
  url: string;
  scale?: [number, number, number];
}

/**
 * Shared reusable wrapper component for rendering a 2D asset in 3D space.
 */
function FishSprite({ url, scale = [1, 1, 1] }: FishSpriteProps) {
  const texture = useTexture(url);

  // Ensures crisp pixel boundaries if using PNGs, or smooth rendering for SVGs
  texture.minFilter = THREE.LinearFilter;

  return (
    <mesh scale={scale}>
      {/* A flat plane to display our 2D texture */}
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        map={texture}
        transparent={true}
        side={THREE.DoubleSide} // Visible from front and back
        roughness={0.6}
        alphaTest={0.05} // Cleans up fuzzy pixel borders on transparent gaps
      />
    </mesh>
  );
}

export function FishBlue() {
  return <FishSprite url="/textures/fish_blue.svg" scale={[1.2, 0.9, 1]} />;
}

export function FishGreen() {
  return <FishSprite url="/textures/fish_green.svg" scale={[1.2, 0.9, 1]} />;
}

export function FishBrown() {
  return <FishSprite url="/textures/fish_brown.svg" scale={[1.3, 1.0, 1]} />;
}

export function FishOrange() {
  return <FishSprite url="/textures/fish_orange.svg" scale={[1.1, 0.8, 1]} />;
}
