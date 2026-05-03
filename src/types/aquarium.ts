/**
 * Aquarium Types & Interfaces
 * Centralized for TDD and cross-component consistency.
 */

export type AxolotlMood = "chill" | "excited";
export type LightMode = "day" | "night";
export type AxolotlTrick = "none" | "barrelRoll" | "backflip" | "spin";
export type FoliageType = "seagrass" | "kelp" | "vines";

export interface ColorPalette {
  name: string;
  main: string; // Changed from 'body'
  light: string; // Changed from 'gills'
  dark: string; // Changed from 'fins'
  sparkleColor?: string; // Optional: for extra visual flair
  glowIntensity?: number; // Optional: for dynamic lighting effects
}

export interface WormData {
  id: number;
  spawnX?: number;
}

export interface AquariumState {
  worms: WormData[];
  mood: AxolotlMood;
  lightMode: LightMode;
  showGrass: boolean;
  currentColor: ColorPalette;
}
