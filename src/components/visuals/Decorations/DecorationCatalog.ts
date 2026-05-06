import type {
  DecorationCategory,
  DecorationType,
} from "../../../types/aquarium";

export interface DecorationOption {
  type: DecorationType;
  category: DecorationCategory;
  label: string;
  colorClass: string;
}

export const DECORATION_OPTIONS: DecorationOption[] = [
  // --- DECOR CATEGORY ---
  { type: "shell", category: "decor", label: "Shell", colorClass: "btn-teal" },
  { type: "star", category: "decor", label: "Star", colorClass: "btn-green" },
  { type: "coral", category: "decor", label: "Coral", colorClass: "btn-teal" },
  {
    type: "bubbleRing",
    category: "decor",
    label: "Bubble Ring",
    colorClass: "btn-green",
  },

  // New Treasure Box Addition
  {
    type: "treasureBox",
    category: "furniture",
    label: "Treasure",
    colorClass: "btn-yellow",
  },

  // --- FURNITURE CATEGORY ---
  {
    type: "castle",
    category: "furniture",
    label: "Castle",
    colorClass: "btn-blue",
  },
  {
    type: "caveHideout",
    category: "furniture",
    label: "Cave",
    colorClass: "btn-indigo",
  },
];
