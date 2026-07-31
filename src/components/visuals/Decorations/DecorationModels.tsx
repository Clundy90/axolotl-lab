import React, { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { DecorationType } from "../../../state/aquarium";

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

const MODEL_FILES: Record<DecorationType, { glb: string }> = {
  castle: { glb: "castle.draco.glb" },
  log: { glb: "log.draco.glb" },
  treasureChest: { glb: "treasure.draco.glb" },
  brainCoral: { glb: "coral.draco.glb" },
  seaUrchin: { glb: "urchin.draco.glb" },
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

let preloadDecorationAssetsPromise: Promise<void> | null = null;
let gltfDecoderConfigured = false;

function configureDracoDecoder() {
  if (gltfDecoderConfigured) {
    return;
  }

  useGLTF.setDecoderPath("/draco/");
  gltfDecoderConfigured = true;
}

export function preloadDecorationAssets() {
  if (preloadDecorationAssetsPromise) {
    return preloadDecorationAssetsPromise;
  }

  configureDracoDecoder();

  preloadDecorationAssetsPromise = Promise.resolve().then(() => {
    (Object.keys(MODEL_FILES) as DecorationType[]).forEach((type) => {
      const root = ASSET_ROOTS[type];
      const files = MODEL_FILES[type];
      useGLTF.preload(`${root}/${files.glb}`);
    });
  });

  return preloadDecorationAssetsPromise;
}

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
  configureDracoDecoder();

  const root = ASSET_ROOTS[type];
  const files = MODEL_FILES[type];
  const source = useGLTF(`${root}/${files.glb}`);

  const object = useMemo(
    () => normalizeModel(source.scene.clone(), MODEL_HEIGHTS[type]),
    [source, type],
  );

  return (
    <group rotation={MODEL_ROTATIONS[type]}>
      <primitive object={object} />
    </group>
  );
}
