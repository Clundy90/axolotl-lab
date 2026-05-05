import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FoodProps {
  id: number;
  spawnX: number;
  spawnY: number;
  spawnZ: number;
  onConsumed: (id: number) => void;
  onMissed: (id: number) => void;
}

const CATCH_TARGET = new THREE.Vector3(0, 0.05, 2);

export default function Food({
  id,
  spawnX,
  spawnY,
  spawnZ,
  onConsumed,
  onMissed,
}: FoodProps) {
  const groupRef = useRef<THREE.Group>(null);
  const handledRef = useRef(false);

  const baseColor = useMemo(() => {
    const colors = ["#ffd166", "#7bd88f", "#ff8fab", "#8ec5ff"];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);
  const drift = useMemo(() => (Math.random() - 0.5) * 0.06, []);
  const spin = useMemo(() => 1.5 + Math.random() * 2, []);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current || handledRef.current) return;

    const elapsed = clock.elapsedTime;
    const mesh = groupRef.current;
    mesh.position.y -= delta * 0.72;
    mesh.position.x = spawnX + drift + Math.sin(elapsed * 1.3 + id) * 0.025;
    mesh.rotation.x += delta * spin;
    mesh.rotation.y += delta * spin * 0.6;

    const distanceToMouth = mesh.position.distanceTo(CATCH_TARGET);
    if (distanceToMouth < 0.35) {
      handledRef.current = true;
      onConsumed(id);
      return;
    }

    if (mesh.position.y < -2.45) {
      handledRef.current = true;
      onMissed(id);
    }
  });

  return (
    <group ref={groupRef} position={[spawnX, spawnY, spawnZ]}>
      <mesh rotation={[0.45, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.045, 0.02, 8]} />
        <meshStandardMaterial color={baseColor} roughness={0.65} />
      </mesh>
      <mesh position={[0.02, 0.009, 0.01]} scale={0.45}>
        <sphereGeometry args={[0.038, 8, 8]} />
        <meshStandardMaterial color="#fff4dc" roughness={0.5} />
      </mesh>
    </group>
  );
}
