import React from "react";
import AquariumControls from "./UI/AquariumControls";
import AquariumScene from "./AquariumScene";
import { AquariumProvider, useAquarium } from "../../context/AquariumContext";
import { AquariumUiProvider } from "../../context/AquariumUiContext";
import "./RainbowButtons.css";

/**
 * Aquarium Component
 * Refined [2026-05-07]
 * - Orchestrates the 3D scene and the UI overlay.
 * - Bridges the useAquariumLogic hook with the visual controllers.
 * - Handles the granular color palette for the Axolotl (body, gills, fins, etc.)
 */
function AquariumShell() {
  const aquarium = useAquarium();

  return (
    <div
      className="aquarium-container"
      style={{
        background:
          aquarium.lightMode === "day"
            ? "radial-gradient(circle at 20% 10%, #9de6ff 0%, #5fc4ff 45%, #2f78cc 100%)"
            : "radial-gradient(circle at 25% 8%, #3d5ca8 0%, #1d2e63 55%, #09152f 100%)",
      }}
    >
      <div className="header-container">
        <AquariumControls />
      </div>
      <AquariumScene />
    </div>
  );
}

export default function Aquarium() {
  return (
    <AquariumProvider>
      <AquariumUiProvider>
        <AquariumShell />
      </AquariumUiProvider>
    </AquariumProvider>
  );
}
