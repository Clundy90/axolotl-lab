import React, { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import * as THREE from "three";
import type { DecorationType } from "../../../types/aquarium";

/**
 * Loaded aquarium furniture models.
 * Fish-pack sprites live in the background layer so furniture stays separate.
 */

const ASSET_ROOTS: Record<DecorationType, string> = {
  castle: "/Aquarium_Castle_v1_L1.123c68c7e8e7-0239-4852-a01d-384b6747c08d",
  log: "/Aquarium_Log_v1_L3.123c948711d4-4661-4612-9de0-2f84b67e5d21",
  treasureChest:
    "/aquarium_treasure_chest_v1_L2.123c20c98872-e08b-4c2e-bc02-5b3efe215604",
  brainCoral: "/Brain_Coral_v1_L1.123c952dcd3e-dc3a-41a5-b56e-548475a0de97",
  seaUrchin:
    "/Pencil_sea_urchin_V1_L1.123cbeb8e568-4553-4b0a-b574-b4bf263bb74d",
};

const MODEL_FILES: Record<DecorationType, { obj: string; mtl: string }> = {
  castle: {
    obj: "13020_Aquarium_Castle_v1_L1.obj",
    mtl: "13020_Aquarium_Castle_v1_L1.mtl",
  },
  log: {
    obj: "13021_Aquarium_Log_v1_L3.obj",
    mtl: "13021_Aquarium_Log_v1_L3.mtl",
  },
  treasureChest: {
    obj: "13019_aquarium_treasure_chest_v1_L2.obj",
    mtl: "13019_aquarium_treasure_chest_v1_L2.mtl",
  },
  brainCoral: {
    obj: "20941_Brain_Coral_v1_NEW1.obj",
    mtl: "20941_Brain_Coral_v1_NEW1.mtl",
  },
  seaUrchin: {
    obj: "18765_Pencil_sea_urchin_V1.obj",
    mtl: "Blank.mtl",
  },
};

const MODEL_HEIGHTS: Record<DecorationType, number> = {
  castle: 2.0,
  log: 0.72,
  treasureChest: 0.99,
  brainCoral: 0.74,
  seaUrchin: 0.58,
};

const MODEL_ROTATIONS: Record<DecorationType, [number, number, number]> = {
  castle: [Math.PI / 2, Math.PI, 0],
  log: [0, 0, 0],
  treasureChest: [-Math.PI / 2, 0, 0],
  brainCoral: [0, 0, 0],
  seaUrchin: [0, 0, 0],
};

function normalizeModel(object: THREE.Group, targetHeight: number) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const scale = targetHeight / Math.max(size.y, 0.001);

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

export default function DecorationModel({ type }: { type: DecorationType }) {
  const root = ASSET_ROOTS[type];
  const files = MODEL_FILES[type];
  const materials = useLoader(MTLLoader, `${root}/${files.mtl}`);
  materials.preload();

  const source = useLoader(OBJLoader, `${root}/${files.obj}`, (loader) => {
    loader.setMaterials(materials);
  });

  const object = useMemo(
    () => normalizeModel(source.clone(), MODEL_HEIGHTS[type]),
    [source, type],
  );

  return (
    <group rotation={MODEL_ROTATIONS[type]}>
      <primitive object={object} />
    </group>
  );
}
