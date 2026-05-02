// AxolotlStyles.ts
export interface ColorPalette {
  name: string;
  main: string;
  light: string;
  dark: string;
}

export const AXOLOTL_COLORS: ColorPalette[] = [
  { name: "Pink", main: "#ffb3c6", light: "#ffd6e0", dark: "#ff6b8a" },
  { name: "Blue", main: "#8ae0f5", light: "#c4f0fc", dark: "#2cb8db" },
  { name: "Gold", main: "#f5d48a", light: "#fae7bc", dark: "#db9a2c" },
  { name: "Wild", main: "#6b8a4a", light: "#8ca86e", dark: "#4a6331" },
];
