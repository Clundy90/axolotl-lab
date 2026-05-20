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
  // --- DECOR CATEGORY (Blue & Green Fish) ---
  {
    type: "fishBlue",
    category: "decor",
    label: "Blue Fish",
    colorClass: "btn-blue",
  },
  {
    type: "fishGreen",
    category: "decor",
    label: "Green Fish",
    colorClass: "btn-green",
  },

  // --- FURNITURE CATEGORY (Brown & Orange Fish) ---
  {
    type: "fishBrown",
    category: "furniture",
    label: "Brown Fish",
    colorClass: "btn-indigo",
  },
  {
    type: "fishOrange",
    category: "furniture",
    label: "Orange Fish",
    colorClass: "btn-yellow",
  },
];
