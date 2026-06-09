import type { BackgroundFishType } from "../../../state/aquarium";

export interface BackgroundFishOption {
  type: BackgroundFishType;
  label: string;
  buttonClass: string;
  url: string;
}

export const BACKGROUND_FISH_OPTIONS: BackgroundFishOption[] = [
  {
    type: "blue",
    label: "Blue Fish",
    buttonClass: "btn-primary",
    url: "/textures/fish_blue.svg",
  },
  {
    type: "green",
    label: "Green Fish",
    buttonClass: "btn-primary",
    url: "/textures/fish_green.svg",
  },
  {
    type: "brown",
    label: "Brown Fish",
    buttonClass: "btn-primary",
    url: "/textures/fish_brown.svg",
  },
  {
    type: "orange",
    label: "Orange Fish",
    buttonClass: "btn-primary",
    url: "/textures/fish_orange.svg",
  },
];

export function getBackgroundFishUrl(type: BackgroundFishType) {
  return (
    BACKGROUND_FISH_OPTIONS.find((option) => option.type === type)?.url ??
    BACKGROUND_FISH_OPTIONS[0].url
  );
}
