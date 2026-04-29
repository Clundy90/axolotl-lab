import React, { useState } from "react";
import { breed, getColor, type Axolotl, type Gene } from "../logic/breeding";

import AxolotlSprite from "./visuals/AxolotlSprite";

export default function LabContainer() {
  const [parent1, setParent1] = useState<Axolotl>({
    name: "Mama",
    genes: ["A", "a"],
  });
  const [parent2, setParent2] = useState<Axolotl>({
    name: "Papa",
    genes: ["a", "a"],
  });
  const [baby, setBaby] = useState<Axolotl | null>(null);

  const handleBreed = () => {
    const babyGenes = breed(parent1, parent2);
    setBaby({
      name: "New Baby",
      genes: babyGenes,
    });
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center", color: "white" }}>
      <h2>Axolotl Breeding Lab</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "2rem 0",
        }}
      >
        <div>
          <p>
            {parent1.name} ({getColor(parent1.genes)})
          </p>
          <AxolotlSprite color={getColor(parent1.genes)} />
        </div>
        <button
          onClick={handleBreed}
          style={{ padding: "1rem", cursor: "pointer" }}
        >
          💓 Breed 💓
        </button>
        <div>
          <p>
            {parent2.name} ({getColor(parent2.genes)})
          </p>
          <AxolotlSprite color={getColor(parent2.genes)} />
        </div>
      </div>

      {baby && (
        <div
          style={{
            marginTop: "2rem",
            border: "2px dashed pink",
            padding: "1rem",
          }}
        >
          <h3>It's a {getColor(baby.genes)} baby!</h3>
          <p>Genes: {baby.genes.join("")}</p>
        </div>
      )}
    </div>
  );
}
