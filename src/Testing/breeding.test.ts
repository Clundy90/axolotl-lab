import { expect, test, describe } from "vitest";
import { breed, getColor, type Axolotl } from "./breeding";

describe("Axolotl Breeding Lab", () => {
  test("Two Pink parents (aa) should always have a Pink baby", () => {
    const parent1: Axolotl = { name: "Mom", genes: ["a", "a"] };
    const parent2: Axolotl = { name: "Dad", genes: ["a", "a"] };

    const babyGenes = breed(parent1, parent2);
    expect(getColor(babyGenes)).toBe("Pink");
  });

  test("Two Pure Wild parents (AA) should always have a Wild baby", () => {
    const parent1: Axolotl = { name: "Mom", genes: ["A", "A"] };
    const parent2: Axolotl = { name: "Dad", genes: ["A", "A"] };

    const babyGenes = breed(parent1, parent2);
    expect(getColor(babyGenes)).toBe("Wild");
  });
});
