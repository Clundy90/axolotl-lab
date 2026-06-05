import type { BackgroundFishType } from "../../../types/aquarium";

export interface BackgroundFishOption {
  type: BackgroundFishType;
  label: string;
  colorClass: string;
  url: string;
}

export const BACKGROUND_FISH_OPTIONS: BackgroundFishOption[] = [
  {
    type: "blue",
    label: "Blue Fish",
    colorClass: "btn-blue",
    url: "/textures/fish_blue.svg",
  },
  {
    type: "green",
    label: "Green Fish",
    colorClass: "btn-green",
    url: "/textures/fish_green.svg",
  },
  {
    type: "brown",
    label: "Brown Fish",
    colorClass: "btn-indigo",
    url: "/textures/fish_brown.svg",
  },
  {
    type: "orange",
    label: "Orange Fish",
    colorClass: "btn-yellow",
    url: "/textures/fish_orange.svg",
  },
];

export function getBackgroundFishUrl(type: BackgroundFishType) {
  return (
    BACKGROUND_FISH_OPTIONS.find((option) => option.type === type)?.url ??
    BACKGROUND_FISH_OPTIONS[0].url
  );
}
