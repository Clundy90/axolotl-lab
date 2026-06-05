import React, { useMemo, useRef } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { DecorationItem, DecorationType } from "../../../types/aquarium";

import {
  CastleDecoration,
  CaveHideoutDecoration,
} from "./DecorationModels";

interface DecorationLayerProps {
  items: DecorationItem[];
  deleteMode: boolean;
  onMoveDecoration: (id: number, position: [number, number, number]) => void;
  onRemoveDecoration: (id: number) => void;
}

/**
 * Technical Helper: Ensures decorations stay within the aquarium glass bounds.
 */
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Decides which 3D model to render based on the item type.
 */
function DecorationShape({ type }: { type: DecorationType }) {
  switch (type) {
    case "castle":
      return <CastleDecoration />;
    case "caveHideout":
      return <CaveHideoutDecoration />;
    default:
      return <CastleDecoration />;
  }
}

/**
 * Handles the 3D interaction logic: Dragging, Dropping, and Deleting.
 */
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

  // Corrected PointerDown: Casts target to HTMLElement to fix TS errors
  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (deleteMode) return;

    const target = event.target as unknown as HTMLElement;
    if (target.setPointerCapture) {
      target.setPointerCapture(event.pointerId);
    }

    draggingIdRef.current = item.id;
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (deleteMode || draggingIdRef.current !== item.id) return;
    event.stopPropagation();

    if (!event.ray.intersectPlane(dragPlane, dragPoint)) return;

    // Clamp values keep the items from being dragged outside the tank
    const nextX = clamp(dragPoint.x, -6.7, 6.7);
    const nextZ = clamp(dragPoint.z, -4.2, 4.2);

    // Y position is locked to -2.2 to keep items on the floor
    onMoveDecoration(item.id, [nextX, -2.2, nextZ]);
  };

  // Corrected PointerUp: Safely releases capture and handles deletion
  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();

    if (deleteMode) {
      onRemoveDecoration(item.id);
      return;
    }

    const target = event.target as unknown as HTMLElement;
    if (target.releasePointerCapture) {
      target.releasePointerCapture(event.pointerId);
    }

    if (draggingIdRef.current === item.id) {
      draggingIdRef.current = null;
    }
  };

  return (
    <group
      position={item.position}
      scale={item.scale}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Invisible hitbox: Makes it easier for the user to grab small items */}
      <mesh position={[0, 0.25, 0]} visible={false}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
      </mesh>

      {/* Visual indicator for Delete Mode */}
      {deleteMode && (
        <mesh position={[0, 0.8, 0]}>
          <torusGeometry args={[0.1, 0.02, 10, 20]} />
          <meshStandardMaterial
            color="#ff5f6d"
            emissive="#ff2f3f"
            emissiveIntensity={1}
          />
        </mesh>
      )}

      <DecorationShape type={item.type} />
    </group>
  );
}

/**
 * The primary layer responsible for managing all decorations in the scene.
 */
export default function DecorationLayer({
  items,
  deleteMode,
  onMoveDecoration,
  onRemoveDecoration,
}: DecorationLayerProps) {
  // The dragPlane represents the "floor" of the tank
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
