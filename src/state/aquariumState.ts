import { AXOLOTL_COLORS } from "./colors";
import type {
  BackgroundFishItem,
  BackgroundFishType,
  ColorPalette,
  DecorationCategory,
  DecorationItem,
  DecorationType,
} from "./aquarium";

export const MAX_DECORATIONS = 12;
export const MAX_BACKGROUND_FISH = 12;
export const THEME_PRESETS = ["Bubblegum", "Cosmo", "Deep Sea"] as const;

export function getThemePresetIndex(name: (typeof THEME_PRESETS)[number]) {
  return AXOLOTL_COLORS.findIndex((theme) => theme.name === name);
}

export function createCustomPalette(
  basePalette: ColorPalette,
  field: keyof Omit<ColorPalette, "name">,
  value: string,
): ColorPalette {
  return {
    ...basePalette,
    [field]: value,
    name: "Custom",
  };
}

export function createDecoration(
  type: DecorationType,
  random = Math.random,
  now = Date.now,
): DecorationItem {
  const id = now() + Math.floor(random() * 10000);
  const x = (random() - 0.5) * 7;
  const z = (random() - 0.5) * 4;
  const category: DecorationCategory = "furniture";
  const scale = 0.85 + random() * 0.18;

  return { id, type, category, position: [x, -2.18, z], scale };
}

export function wrapBackgroundFishX(
  x: number,
  direction: 1 | -1,
  bounds = 7.8,
) {
  if (x > bounds) return -bounds;
  if (x < -bounds) return bounds;
  return x;
}

export function createBackgroundFish(
  type: BackgroundFishType,
  random = Math.random,
  now = Date.now,
): BackgroundFishItem {
  const direction: 1 | -1 = random() > 0.5 ? 1 : -1;
  const x = direction === 1 ? -7.2 : 7.2;
  const y = -0.8 + random() * 2.6;
  const z = -2.8 - random() * 1.4;

  return {
    id: now() + Math.floor(random() * 10000),
    type,
    position: [x, y, z],
    speed: 0.22 + random() * 0.28,
    scale: 0.75 + random() * 0.45,
    direction,
  };
}
