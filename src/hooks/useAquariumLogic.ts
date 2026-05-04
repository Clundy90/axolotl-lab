import { useState, useCallback } from "react";
import type {
  AxolotlMood,
  LightMode,
  ColorPalette,
  WormData,
} from "../types/aquarium";
import { AXOLOTL_COLORS } from "../components/visuals/Axolotl/AxolotlStyles";
import { SUBSTRATE_TYPES } from "../components/visuals/Environment/Substrate";

/**
 * useAquariumLogic Hook
 * Refined [2026-05-04]
 * - Added dual-feeding logic for standard Food and special Treats.
 * - Ensures mood resets to "chill" to prevent Axolotl from getting stuck.
 */

export function useAquariumLogic() {
  const [foods, setFoods] = useState<WormData[]>([]);
  const [treats, setTreats] = useState<WormData[]>([]);
  const [mood, setMood] = useState<AxolotlMood>("chill");
  const [lightMode, setLightMode] = useState<LightMode>("day");
  const [colorIndex, setColorIndex] = useState(0);
  const [showGrass, setShowGrass] = useState(true);
  const [substrate, setSubstrate] =
    useState<keyof typeof SUBSTRATE_TYPES>("gravel");

  const currentColor: ColorPalette = AXOLOTL_COLORS[colorIndex];

  // Standard feeding: Flakes
  const handleFeed = useCallback(() => {
    const newId = Date.now();
    setFoods((prev) => [...prev, { id: newId }]);

    // Flakes disappear after 3 seconds
    setTimeout(() => {
      setFoods((prev) => prev.filter((f) => f.id !== newId));
    }, 3000);
  }, []);

  // Special feeding: Worm Treat
  const handleDropTreat = useCallback(() => {
    const newId = Date.now();
    setTreats((prev) => [...prev, { id: newId }]);
    setMood("excited");

    // Treat disappears after 2.1 seconds
    setTimeout(() => {
      setTreats((prev) => prev.filter((t) => t.id !== newId));
    }, 2100);

    // Reset mood to "chill" after 4 seconds to resume normal swimming
    setTimeout(() => setMood("chill"), 4000);
  }, []);

  const cycleSubstrate = useCallback(() => {
    const keys = Object.keys(
      SUBSTRATE_TYPES,
    ) as (keyof typeof SUBSTRATE_TYPES)[];
    const currentIndex = keys.indexOf(substrate);
    setSubstrate(keys[(currentIndex + 1) % keys.length]);
  }, [substrate]);

  return {
    foods,
    treats,
    mood,
    lightMode,
    showGrass,
    currentColor,
    substrate,
    handleFeed,
    handleDropTreat,
    setMood,
    setLightMode,
    setShowGrass,
    cycleSubstrate,
    cycleColor: () => setColorIndex((c) => (c + 1) % AXOLOTL_COLORS.length),
  };
}
