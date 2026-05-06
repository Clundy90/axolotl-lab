import React from "react";
import type { DecorationType } from "../../../types/aquarium";

/**
 * Individual 3D models for the aquarium decorations.
 * Extracted to ensure visual logic is separated from interaction logic.
 */

export function Shell() {
  return (
    <group>
      <mesh position={[0, 0.1, 0]} rotation={[0, 0, Math.PI / 4]}>
        <sphereGeometry args={[0.24, 18, 18, 0, Math.PI]} />
        <meshStandardMaterial color="#ffd2a7" roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.01, 0]} scale={[1.08, 0.5, 1.08]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#ffad86" roughness={0.74} />
      </mesh>
    </group>
  );
}

export function Star() {
  return (
    <group>
      {[0, 1, 2, 3, 4].map((arm) => (
        <mesh
          key={arm}
          rotation={[Math.PI / 2, 0, (arm * Math.PI * 2) / 5]}
          position={[0, 0.05, 0]}
        >
          <coneGeometry args={[0.1, 0.45, 8]} />
          <meshStandardMaterial color="#ffb74f" roughness={0.62} />
        </mesh>
      ))}
      <mesh position={[0, 0.08, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#f9c74f" roughness={0.58} />
      </mesh>
    </group>
  );
}

export function Castle() {
  return (
    <group>
      <mesh position={[0, 0.27, 0]}>
        <boxGeometry args={[0.6, 0.54, 0.4]} />
        <meshStandardMaterial color="#b2adff" roughness={0.68} />
      </mesh>
      {[-0.22, 0.22].map((x) => (
        <group key={x} position={[x, 0.58, 0]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.1, 0.3, 10]} />
            <meshStandardMaterial color="#9188ff" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <coneGeometry args={[0.12, 0.2, 10]} />
            <meshStandardMaterial color="#7571e9" roughness={0.62} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function Cave() {
  return (
    <group>
      <mesh position={[0, 0.23, 0]}>
        <sphereGeometry args={[0.45, 18, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#8d78a6" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.25]} scale={[0.6, 0.5, 0.5]}>
        <sphereGeometry args={[0.3, 14, 14]} />
        <meshStandardMaterial color="#111" roughness={1} />
      </mesh>
    </group>
  );
}

export function Coral() {
  return (
    <group>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.06, 0.1, 0.4, 8]} />
        <meshStandardMaterial color="#ff967f" roughness={0.72} />
      </mesh>
      {[-0.15, 0, 0.15].map((x, i) => (
        <mesh
          key={x}
          position={[x, 0.4 + (i % 2) * 0.1, 0]}
          rotation={[0, 0, x * 2]}
        >
          <capsuleGeometry args={[0.04, 0.2, 8, 8]} />
          <meshStandardMaterial color="#ffb4a1" roughness={0.74} />
        </mesh>
      ))}
    </group>
  );
}

export function TreasureBox() {
  return (
    <group>
      {/* Base of the chest */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.5, 0.3, 0.35]} />
        <meshStandardMaterial color="#5d4037" roughness={0.8} />
      </mesh>
      {/* Gold lid */}
      <mesh position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.5, 12, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Lock detail */}
      <mesh position={[0, 0.28, 0.18]}>
        <boxGeometry args={[0.08, 0.1, 0.02]} />
        <meshStandardMaterial color="#ffeb3b" metalness={0.9} />
      </mesh>
    </group>
  );
}

export function BubbleRing() {
  return (
    <mesh position={[0, 0.22, 0]}>
      <torusGeometry args={[0.2, 0.04, 16, 32]} />
      <meshStandardMaterial
        color="#b1f3ff"
        emissive="#62e6ff"
        emissiveIntensity={0.5}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}
