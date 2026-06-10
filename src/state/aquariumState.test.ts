import { describe, expect, test } from "vitest";
import { AXOLOTL_COLORS } from "./colors";
import {
  createBackgroundFish,
  createCustomPalette,
  createDecoration,
  getThemePresetIndex,
  MAX_BACKGROUND_FISH,
  MAX_DECORATIONS,
  wrapBackgroundFishX,
} from "./aquariumState";

describe("aquarium state helpers", () => {
  test("custom color edits inherit the active preset instead of Bubblegum", () => {
    const cosmo = AXOLOTL_COLORS[getThemePresetIndex("Cosmo")];

    const custom = createCustomPalette(cosmo, "body", "#123456");

    expect(custom).toMatchObject({
      name: "Custom",
      body: "#123456",
      gills: cosmo.gills,
      fins: cosmo.fins,
    });
    expect(custom.gills).not.toBe(AXOLOTL_COLORS[0].gills);
  });

  test("furniture decorations stay on the substrate layer", () => {
    const decoration = createDecoration(
      "castle",
      () => 0.5,
      () => 1000,
    );

    expect(decoration.type).toBe("castle");
    expect(decoration.category).toBe("furniture");
    expect(decoration.position[1]).toBe(-2.18);
    expect(MAX_DECORATIONS).toBe(20);
  });

  test("background fish are separate swimmers behind the tank floor", () => {
    const fish = createBackgroundFish(
      "orange",
      () => 0.75,
      () => 2000,
    );

    expect(fish.type).toBe("orange");
    expect(fish.direction).toBe(1);
    expect(fish.position[2]).toBeLessThan(-2.8);
    expect(fish.position[1]).toBeGreaterThan(-1);
    expect(MAX_BACKGROUND_FISH).toBe(12);
  });

  test("background fish wrap around instead of being destroyed offscreen", () => {
    expect(wrapBackgroundFishX(8.1, 1)).toBe(-7.8);
    expect(wrapBackgroundFishX(-8.1, -1)).toBe(7.8);
    expect(wrapBackgroundFishX(0.5, 1)).toBe(0.5);
  });
});
