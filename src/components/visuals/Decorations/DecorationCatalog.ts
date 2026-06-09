import type {
  DecorationCategory,
  DecorationType,
} from "../../../state/aquarium";

export interface DecorationOption {
  type: DecorationType;
  category: DecorationCategory;
  label: string;
  buttonClass: string;
}

export const DECORATION_OPTIONS: DecorationOption[] = [
  {
    type: "castle",
    category: "furniture",
    label: "Castle",
    buttonClass: "btn-primary",
  },
  {
    type: "log",
    category: "furniture",
    label: "Log",
    buttonClass: "btn-primary",
  },
  {
    type: "treasureChest",
    category: "furniture",
    label: "Treasure",
    buttonClass: "btn-primary",
  },
  {
    type: "brainCoral",
    category: "furniture",
    label: "Coral",
    buttonClass: "btn-primary",
  },
  {
    type: "seaUrchin",
    category: "furniture",
    label: "Urchin",
    buttonClass: "btn-primary",
  },
];
