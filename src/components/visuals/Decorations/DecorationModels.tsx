import React from "react";

/**
 * Handmade furniture models.
 * Fish-pack sprites live in the background layer so furniture stays separate.
 */

export function CastleDecoration() {
  return (
    <group>
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.56, 0.72]} />
        <meshStandardMaterial color="#80624c" roughness={0.8} />
      </mesh>
      <mesh position={[-0.5, 0.76, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.34, 0.64, 0.76]} />
        <meshStandardMaterial color="#725744" roughness={0.82} />
      </mesh>
      <mesh position={[0.5, 0.76, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.34, 0.64, 0.76]} />
        <meshStandardMaterial color="#725744" roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.62, 0.37]} castShadow>
        <boxGeometry args={[0.38, 0.42, 0.04]} />
        <meshStandardMaterial color="#33261f" roughness={1} />
      </mesh>
      <mesh position={[0, 1.12, 0]} castShadow>
        <coneGeometry args={[0.76, 0.52, 4]} />
        <meshStandardMaterial color="#5f7f8a" roughness={0.55} />
      </mesh>
    </group>
  );
}

export function CaveHideoutDecoration() {
  return (
    <group>
      <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.78, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#61554c" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.18, 0.42]} castShadow>
        <boxGeometry args={[0.58, 0.42, 0.08]} />
        <meshStandardMaterial color="#1f1b18" roughness={1} />
      </mesh>
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[0.78, 0.86, 0.12, 24]} />
        <meshStandardMaterial color="#4f463f" roughness={0.95} />
      </mesh>
    </group>
  );
}
