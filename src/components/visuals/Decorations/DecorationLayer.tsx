import React, { useMemo, useRef } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { DecorationItem, DecorationType } from "../../../types/aquarium";

interface DecorationLayerProps {
  items: DecorationItem[];
  deleteMode: boolean;
  onMoveDecoration: (id: number, position: [number, number, number]) => void;
  onRemoveDecoration: (id: number) => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function Eyes() {
  return (
    <>
      <mesh position={[-0.04, 0.11, 0.16]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshStandardMaterial color="#1d2240" />
      </mesh>
      <mesh position={[0.04, 0.11, 0.16]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshStandardMaterial color="#1d2240" />
      </mesh>
    </>
  );
}

function DecorationShape({ type }: { type: DecorationType }) {
  if (type === "shell") {
    return (
      <group>
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.24, 18, 18]} />
          <meshStandardMaterial color="#ffd2a7" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.01, 0]} scale={[1.08, 0.5, 1.08]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#ffad86" roughness={0.74} />
        </mesh>
        <Eyes />
      </group>
    );
  }

  if (type === "star") {
    return (
      <group>
        {[0, 1, 2, 3, 4].map((arm) => (
          <mesh key={arm} rotation={[0, (arm * Math.PI * 2) / 5, 0]} position={[0, 0.08, 0]}>
            <coneGeometry args={[0.1, 0.34, 8]} />
            <meshStandardMaterial color="#ff8fcb" roughness={0.62} />
          </mesh>
        ))}
        <mesh position={[0, 0.13, 0]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#ff5ca8" roughness={0.58} />
        </mesh>
        <Eyes />
      </group>
    );
  }

  if (type === "castle") {
    return (
      <group>
        <mesh position={[0, 0.27, 0]}>
          <boxGeometry args={[0.52, 0.54, 0.38]} />
          <meshStandardMaterial color="#b2adff" roughness={0.68} />
        </mesh>
        {[-0.18, 0.18].map((x) => (
          <group key={x} position={[x, 0.58, 0]}>
            <mesh>
              <cylinderGeometry args={[0.08, 0.08, 0.26, 10]} />
              <meshStandardMaterial color="#9188ff" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
              <coneGeometry args={[0.09, 0.16, 10]} />
              <meshStandardMaterial color="#7571e9" roughness={0.62} />
            </mesh>
          </group>
        ))}
        <Eyes />
      </group>
    );
  }

  if (type === "caveHideout") {
    return (
      <group>
        <mesh position={[0, 0.23, 0]}>
          <sphereGeometry args={[0.42, 18, 18]} />
          <meshStandardMaterial color="#8d78a6" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.16, 0.19]} scale={[0.52, 0.45, 0.42]}>
          <sphereGeometry args={[0.32, 14, 14]} />
          <meshStandardMaterial color="#202338" roughness={0.9} />
        </mesh>
        <mesh position={[0.2, 0.32, -0.04]} scale={0.55}>
          <sphereGeometry args={[0.12, 10, 10]} />
          <meshStandardMaterial color="#a78fbe" roughness={0.78} />
        </mesh>
        <Eyes />
      </group>
    );
  }

  if (type === "coral") {
    return (
      <group>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.1, 0.14, 0.4, 8]} />
          <meshStandardMaterial color="#ff967f" roughness={0.72} />
        </mesh>
        {[-0.17, 0.17].map((x) => (
          <mesh key={x} position={[x, 0.44, 0]} rotation={[0, 0, x * 1.4]}>
            <capsuleGeometry args={[0.045, 0.22, 8, 8]} />
            <meshStandardMaterial color="#ffb4a1" roughness={0.74} />
          </mesh>
        ))}
        <Eyes />
      </group>
    );
  }

  return (
    <group>
      <mesh position={[0, 0.22, 0]}>
        <torusGeometry args={[0.2, 0.06, 18, 28]} />
        <meshStandardMaterial
          color="#b1f3ff"
          emissive="#62e6ff"
          emissiveIntensity={0.35}
          transparent
          opacity={0.82}
          roughness={0.2}
          metalness={0.22}
        />
      </mesh>
      <mesh position={[0, 0.22, 0]} scale={0.58}>
        <torusGeometry args={[0.2, 0.05, 14, 22]} />
        <meshStandardMaterial color="#eefbff" transparent opacity={0.38} roughness={0.1} />
      </mesh>
      <Eyes />
    </group>
  );
}

function DraggableDecoration({
  item,
  dragPlane,
  deleteMode,
  onMoveDecoration,
  onRemoveDecoration,
  draggingIdRef,
}: {
  item: DecorationItem;
  dragPlane: THREE.Plane;
  deleteMode: boolean;
  onMoveDecoration: (id: number, position: [number, number, number]) => void;
  onRemoveDecoration: (id: number) => void;
  draggingIdRef: React.MutableRefObject<number | null>;
}) {
  const dragPoint = useMemo(() => new THREE.Vector3(), []);

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (deleteMode) return;
    event.target.setPointerCapture?.(event.pointerId);
    draggingIdRef.current = item.id;
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (deleteMode || draggingIdRef.current !== item.id) return;
    event.stopPropagation();
    if (!event.ray.intersectPlane(dragPlane, dragPoint)) return;
    const nextX = clamp(dragPoint.x, -6.7, 6.7);
    const nextZ = clamp(dragPoint.z, -4.2, 4.2);
    onMoveDecoration(item.id, [nextX, -2.2, nextZ]);
  };

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (deleteMode) {
      onRemoveDecoration(item.id);
      return;
    }
    event.target.releasePointerCapture?.(event.pointerId);
    if (draggingIdRef.current === item.id) draggingIdRef.current = null;
  };

  return (
    <group
      position={item.position}
      scale={item.scale}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <mesh position={[0, 0.06, 0]} visible={false}>
        <boxGeometry args={[0.95, 1.1, 0.95]} />
      </mesh>
      {deleteMode && (
        <mesh position={[0, 0.68, 0]}>
          <torusGeometry args={[0.13, 0.03, 10, 20]} />
          <meshStandardMaterial color="#ff5f6d" emissive="#ff2f3f" emissiveIntensity={0.6} />
        </mesh>
      )}
      <DecorationShape type={item.type} />
    </group>
  );
}

export default function DecorationLayer({
  items,
  deleteMode,
  onMoveDecoration,
  onRemoveDecoration,
}: DecorationLayerProps) {
  const dragPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), 2.2),
    [],
  );
  const draggingIdRef = useRef<number | null>(null);

  return (
    <group>
      {items.map((item) => (
        <DraggableDecoration
          key={item.id}
          item={item}
          dragPlane={dragPlane}
          deleteMode={deleteMode}
          onMoveDecoration={onMoveDecoration}
          onRemoveDecoration={onRemoveDecoration}
          draggingIdRef={draggingIdRef}
        />
      ))}
    </group>
  );
}
