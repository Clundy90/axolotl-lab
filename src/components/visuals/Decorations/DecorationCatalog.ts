import type { DecorationCategory, DecorationType } from "../../../types/aquarium";

export interface DecorationOption {
  type: DecorationType;
  category: DecorationCategory;
  label: string;
  colorClass: string;
}

export const DECORATION_OPTIONS: DecorationOption[] = [
  { type: "shell", category: "decor", label: "Shell", colorClass: "btn-orange" },
  { type: "star", category: "decor", label: "Star", colorClass: "btn-yellow" },
  { type: "coral", category: "decor", label: "Coral", colorClass: "btn-pink" },
  {
    type: "bubbleRing",
    category: "decor",
    label: "Bubble Ring",
    colorClass: "btn-blue",
  },
  {
    type: "castle",
    category: "furniture",
    label: "Castle",
    colorClass: "btn-indigo",
  },
  {
    type: "caveHideout",
    category: "furniture",
    label: "Cave",
    colorClass: "btn-purple",
  },
];
