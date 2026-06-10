import React, { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import type { AccessoryType } from "../../state/aquarium";
import { ACCESSORY_OPTIONS } from "./AccessoryCatalog";

const ACCESSORY_ROOT = "/Accessories";

function fitAccessoryModel(object: THREE.Group, targetScale: number) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const scale = targetScale / Math.max(size.x, size.y, size.z, 0.001);

  object.scale.setScalar(scale);
  object.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return object;
}

export default function AccessoryModel({ type }: { type: AccessoryType }) {
  const config = ACCESSORY_OPTIONS.find((option) => option.type === type);

  if (!config) return null;

  const gltf = useLoader(
    GLTFLoader,
    `${ACCESSORY_ROOT}/${encodeURIComponent(config.fileName)}`,
  );

  const object = useMemo(
    () => fitAccessoryModel(gltf.scene.clone(), config.scale),
    [config.scale, gltf.scene],
  );

  return (
    <group position={config.position} rotation={config.rotation}>
      <primitive object={object} />
    </group>
  );
}
