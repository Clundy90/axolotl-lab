import type { AccessoryType } from "../../state/aquarium";

export interface AccessoryOption {
  type: AccessoryType;
  label: string;
  fileName: string;
  buttonClass: string;
  placement: "head" | "face" | "neck";
  fitAxis: "max" | "x" | "y" | "z";
  fitSize: number;
  anchor: "bottom" | "center";
  position: [number, number, number];
  rotation: [number, number, number];
}

export const ACCESSORY_OPTIONS: AccessoryOption[] = [
  {
    type: "crown",
    label: "Crown",
    fileName: "Crown.glb",
    buttonClass: "btn-secondary",
    placement: "head",
    fitAxis: "x",
    fitSize: 0.56,
    anchor: "bottom",
    position: [0, 0.43, 0.08],
    rotation: [0, 0, 0],
  },
  {
    type: "crown2",
    label: "Tiny Crown",
    fileName: "Crown 2.glb",
    buttonClass: "btn-secondary",
    placement: "head",
    fitAxis: "x",
    fitSize: 0.5,
    anchor: "bottom",
    position: [0, 0.45, 0.06],
    rotation: [0, 0, 0],
  },
  {
    type: "glasses",
    label: "Glasses",
    fileName: "Glasses.glb",
    buttonClass: "btn-info",
    placement: "face",
    fitAxis: "x",
    // Detailed Comment: Increased size slightly to frame the face better,
    // and pulled Z back from 0.5 to 0.42 so they don't look like they are floating in mid-air.
    fitSize: 0.75,
    anchor: "center",
    position: [0, 0.1, 0.42],
    rotation: [0, 0, 0],
  },
  {
    type: "pixelGlasses",
    label: "Pixel Glasses",
    fileName: "Pixel Glasses.glb",
    buttonClass: "btn-info",
    placement: "face",
    fitAxis: "x",
    fitSize: 0.78,
    anchor: "center",
    position: [0, 0.1, 0.44],
    rotation: [0, 0, 0],
  },

  {
    type: "topHat",
    label: "Top Hat",
    fileName: "Top hat.glb",
    buttonClass: "btn-secondary",
    placement: "head",
    fitAxis: "x",
    fitSize: 0.68,
    anchor: "bottom",
    position: [0, 0.42, 0.04],
    rotation: [0, 0, 0],
  },
];
