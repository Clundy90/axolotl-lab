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
  castle: "/castle",
  log: "/log",
  treasureChest: "/treasure-chest",
  brainCoral: "/coral",
  seaUrchin: "/urchin",
};

const MODEL_FILES: Record<DecorationType, { obj: string; mtl: string }> = {
  castle: {
    obj: "castle.obj",
    mtl: "castle.mtl",
  },
  log: {
    obj: "log.obj",
    mtl: "log.mtl",
  },
  treasureChest: {
    obj: "treasure.obj",
    mtl: "treasure.mtl",
  },
  brainCoral: {
    obj: "coral.obj",
    mtl: "coral.mtl",
  },
  seaUrchin: {
    obj: "urchin.obj",
    mtl: "urchin.mtl",
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
  const materials = useLoader(MTLLoader, `${root}/${files.mtl}`, (loader) => {
    loader.setResourcePath(`${root}/`);
  });
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
