import type { AccessoryType } from "../../state/aquarium";

export interface AccessoryOption {
  type: AccessoryType;
  label: string;
  fileName: string;
  buttonClass: string;
  scale: number;
  position: [number, number, number];
  rotation: [number, number, number];
}

export const ACCESSORY_OPTIONS: AccessoryOption[] = [
  {
    type: "crown",
    label: "Crown",
    fileName: "Crown.glb",
    buttonClass: "btn-secondary",
    scale: 0.42,
    position: [0, 0.46, 0.22],
    rotation: [0, 0, 0],
  },
  {
    type: "crown2",
    label: "Tiny Crown",
    fileName: "Crown 2.glb",
    buttonClass: "btn-secondary",
    scale: 0.39,
    position: [0, 0.44, 0.22],
    rotation: [0, 0, 0],
  },
  {
    type: "glasses",
    label: "Glasses",
    fileName: "Glasses.glb",
    buttonClass: "btn-info",
    scale: 0.42,
    position: [0, 0.04, 0.54],
    rotation: [0, 0, 0],
  },
  {
    type: "pixelGlasses",
    label: "Pixel Glasses",
    fileName: "Pixel Glasses.glb",
    buttonClass: "btn-info",
    scale: 0.41,
    position: [0, 0.04, 0.54],
    rotation: [0, 0, 0],
  },
  {
    type: "headphones",
    label: "Headphones",
    fileName: "Headphones.glb",
    buttonClass: "btn-success",
    scale: 0.46,
    position: [0, 0.2, 0.16],
    rotation: [0, 0, 0],
  },
  {
    type: "pearlNecklace",
    label: "Pearl Necklace",
    fileName: "Pearl necklace.glb",
    buttonClass: "btn-success",
    scale: 0.45,
    position: [0, -0.08, 0.46],
    rotation: [0, 0, 0],
  },
  {
    type: "topHat",
    label: "Top Hat",
    fileName: "Top hat.glb",
    buttonClass: "btn-secondary",
    scale: 0.45,
    position: [0, 0.57, 0.18],
    rotation: [0, 0, 0],
  },
];
