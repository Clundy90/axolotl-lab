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
