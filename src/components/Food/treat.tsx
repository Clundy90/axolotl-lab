import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TreatProps {
  id: number;
  spawnX: number;
  spawnY: number;
  spawnZ: number;
  onConsumed: (id: number) => void;
  onMissed: (id: number) => void;
}

const CATCH_TARGET = new THREE.Vector3(0, 0.05, 2);

export default function Treat({
  id,
  spawnX,
  spawnY,
  spawnZ,
  onConsumed,
  onMissed,
}: TreatProps) {
  const rootRef = useRef<THREE.Group>(null);
  const wormRef = useRef<THREE.Mesh>(null);
  const handledRef = useRef(false);
  const drift = useMemo(() => (Math.random() - 0.5) * 0.08, []);
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.04, -0.1, 0.03),
        new THREE.Vector3(-0.05, -0.2, -0.02),
        new THREE.Vector3(0.04, -0.31, 0.03),
        new THREE.Vector3(-0.03, -0.42, 0),
      ]),
    [],
  );

  useFrame(({ clock }, delta) => {
    if (!rootRef.current || handledRef.current) return;
    const elapsed = clock.elapsedTime;
    rootRef.current.position.y -= delta * 0.83;
    rootRef.current.position.x = spawnX + drift + Math.sin(elapsed * 1.4 + id) * 0.04;
    rootRef.current.rotation.z = Math.sin(elapsed * 10 + id) * 0.22;
    rootRef.current.rotation.x = Math.cos(elapsed * 7 + id) * 0.12;

    if (wormRef.current) {
      wormRef.current.rotation.y = Math.sin(elapsed * 8.5 + id) * 0.22;
      wormRef.current.rotation.x = Math.cos(elapsed * 6.8 + id) * 0.12;
    }

    const distanceToMouth = rootRef.current.position.distanceTo(CATCH_TARGET);
    if (distanceToMouth < 0.4) {
      handledRef.current = true;
      onConsumed(id);
      return;
    }

    if (rootRef.current.position.y < -2.45) {
      handledRef.current = true;
      onMissed(id);
    }
  });

  return (
    <group ref={rootRef} position={[spawnX, spawnY, spawnZ]}>
      <mesh ref={wormRef}>
        <tubeGeometry args={[curve, 36, 0.028, 12, false]} />
        <meshStandardMaterial
          color="#d88e8b"
          roughness={0.7}
          emissive="#7a3a3f"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh position={[0.005, 0.02, 0]} scale={0.35}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshStandardMaterial color="#f7c2b8" roughness={0.55} />
      </mesh>
    </group>
  );
}
