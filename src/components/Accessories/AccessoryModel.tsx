import React, { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import type { AccessoryType } from "../../state/aquarium";
import { ACCESSORY_OPTIONS, type AccessoryOption } from "./AccessoryCatalog";

const ACCESSORY_ROOT = "/Accessories";

function getFitDimension(size: THREE.Vector3, axis: AccessoryOption["fitAxis"]) {
  if (axis === "x") return size.x;
  if (axis === "y") return size.y;
  if (axis === "z") return size.z;
  return Math.max(size.x, size.y, size.z);
}

function fitAccessoryModel(object: THREE.Group, config: AccessoryOption) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const fitDimension = getFitDimension(size, config.fitAxis);
  const scale = config.fitSize / Math.max(fitDimension, 0.001);
  const anchorY = config.anchor === "bottom" ? box.min.y : center.y;

  object.scale.setScalar(scale);
  object.position.set(-center.x * scale, -anchorY * scale, -center.z * scale);
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
    () => fitAccessoryModel(gltf.scene.clone(), config),
    [config, gltf.scene],
  );

  return (
    <group position={config.position} rotation={config.rotation}>
      <primitive object={object} />
    </group>
  );
}
