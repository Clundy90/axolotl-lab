/**
 * Aquarium Types & Interfaces
 * Centralized for TDD and cross-component consistency.
 */

export type AxolotlMood = "chill" | "excited" | "lazy";
export type LightMode = "day" | "night";
export type AxolotlTrick = "none" | "barrelRoll" | "backflip" | "spin";
export type FoliageType = "grass" | "kelp" | "vines";
export type FeedType = "food" | "treat";
export type DecorationType =
  | "shell"
  | "star"
  | "coral"
  | "bubbleRing"
  | "castle"
  | "caveHideout"
  | "treasureBox";
export type DecorationCategory = "decor" | "furniture";

export interface ColorPalette {
  name: string;
  body: string; // Main torso and head
  gills: string; // The frilly external gills
  fins: string; // The translucent bits on tail/back (Sparkle!)
  tail: string; // The solid muscle of the tail
  legs: string; // The limbs
  toes: string; // The tips of the feet
  eyes: string; // The sclera/iris
  glowIntensity: number;
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
