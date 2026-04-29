/**
 * Axolotl Genetics Logic
 * A = Wild (Dominant)
 * a = Pink (Recessive)
 */

export type Gene = "A" | "a";

export interface Axolotl {
  name: string;
  genes: [Gene, Gene]; // e.g., ['A', 'a']
}

export function breed(parent1: Axolotl, parent2: Axolotl): [Gene, Gene] {
  // Randomly pick one gene from each parent
  const gene1 = parent1.genes[Math.floor(Math.random() * 2)];
  const gene2 = parent2.genes[Math.floor(Math.random() * 2)];

  return [gene1, gene2];
}

export function getColor(genes: [Gene, Gene]): "Wild" | "Pink" {
  // If they have at least one 'A', they look 'Wild'
  // Only 'aa' looks 'Pink'
  return genes.includes("A") ? "Wild" : "Pink";
}
