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
    type: "log",
    category: "furniture",
    label: "Log",
    colorClass: "btn-indigo",
  },
  {
    type: "treasureChest",
    category: "furniture",
    label: "Treasure",
    colorClass: "btn-yellow",
  },
  {
    type: "brainCoral",
    category: "furniture",
    label: "Coral",
    colorClass: "btn-pink",
  },
  {
    type: "seaUrchin",
    category: "furniture",
    label: "Urchin",
    colorClass: "btn-teal",
  },
];
