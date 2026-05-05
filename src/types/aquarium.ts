/**
 * Aquarium Types & Interfaces
 * Centralized for TDD and cross-component consistency.
 */

export type AxolotlMood = "chill" | "excited" | "lazy";
export type LightMode = "day" | "night";
export type AxolotlTrick = "none" | "barrelRoll" | "backflip" | "spin";
export type FoliageType = "seagrass" | "kelp" | "vines";
export type FeedType = "food" | "treat";
export type DecorationType =
  | "shell"
  | "star"
  | "coral"
  | "bubbleRing"
  | "castle"
  | "caveHideout";
export type DecorationCategory = "decor" | "furniture";

export interface ColorPalette {
  name: string;
  main: string; // Changed from 'body'
  light: string; // Changed from 'gills'
  dark: string; // Changed from 'fins'
  sparkleColor?: string; // Optional: for extra visual flair
  glowIntensity?: number; // Optional: for dynamic lighting effects
}

export interface FeedItem {
  id: number;
  spawnX: number;
  spawnY: number;
  spawnZ: number;
}

export interface DecorationItem {
  id: number;
  type: DecorationType;
  category: DecorationCategory;
  position: [number, number, number];
  scale: number;
}

export interface AquariumState {
  foods: FeedItem[];
  treats: FeedItem[];
  decorations: DecorationItem[];
  mood: AxolotlMood;
  lightMode: LightMode;
  showGrass: boolean;
  currentColor: ColorPalette;
}
