import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Lighting Component
 * Manages Day/Night cycles and water refraction (caustics).
 */

export type LightMode = "day" | "night";

interface LightingProps {
  mode: LightMode;
}

export default function Lighting({ mode }: LightingProps) {
  const causticRef = useRef<THREE.SpotLight>(null);

  // Constants for the two modes
  const isNight = mode === "night";
  const ambientIntensity = isNight ? 0.2 : 0.6;
  const waterColor = isNight ? "#023e8a" : "#caf0f8";
  const mainLightIntensity = isNight ? 0.4 : 1.2;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (causticRef.current) {
      // Create a subtle "shimmer" effect by moving the light slightly
      causticRef.current.position.x = Math.sin(t * 0.5) * 2;
      causticRef.current.position.z = Math.cos(t * 0.3) * 2;
      // Flickering intensity to mimic surface ripples
      causticRef.current.intensity = mainLightIntensity + Math.sin(t * 2) * 0.1;
    }
  });

  return (
    <>
      {/* Global soft light that fills the water volume */}
      <ambientLight intensity={ambientIntensity} color={waterColor} />

      {/* The main "Sun/Moon" light */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={isNight ? 0.1 : 0.5}
        color={isNight ? "#90e0ef" : "#ffffff"}
        castShadow
      />

      {/* Caustic Spotlight: Simulates light hitting the water surface */}
      <spotLight
        ref={causticRef}
        position={[0, 10, 0]}
        intensity={mainLightIntensity}
        angle={0.6}
        penumbra={1}
        distance={20}
        color={isNight ? "#48cae4" : "#ffffff"}
        castShadow
      />

      {/* Underwater "Atmospheric" Fog */}
      <fog attach="fog" args={[waterColor, 5, 20]} />
    </>
  );
}
