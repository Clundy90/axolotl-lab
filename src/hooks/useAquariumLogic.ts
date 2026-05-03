import { useState, useCallback } from "react";
// Use the exact names from aquarium.ts to avoid "Duplicate identifier" and "No exported member"
import type {
  AxolotlMood,
  LightMode,
  ColorPalette,
  WormData,
} from "../types/aquarium";
import { AXOLOTL_COLORS } from "../components/visuals/Axolotl/AxolotlStyles";
import { SUBSTRATE_TYPES } from "../components/visuals/Environment/Substrate";

export function useAquariumLogic() {
  const [worms, setWorms] = useState<WormData[]>([]);
  // Update state to use AxolotlMood
  const [mood, setMood] = useState<AxolotlMood>("chill");
  const [lightMode, setLightMode] = useState<LightMode>("day");
  const [colorIndex, setColorIndex] = useState(0);
  const [showGrass, setShowGrass] = useState(true);
  const [substrate, setSubstrate] =
    useState<keyof typeof SUBSTRATE_TYPES>("gravel");

  const currentColor: ColorPalette = AXOLOTL_COLORS[colorIndex];
  const handleFeed = useCallback(() => {
    const newId = Date.now();
    setWorms((prev) => [...prev, { id: newId }]);
    setMood("excited");

    setTimeout(() => {
      setWorms((prev) => prev.filter((w) => w.id !== newId));
    }, 2100);

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
    worms,
    mood,
    lightMode,
    showGrass,
    currentColor,
    substrate,
    handleFeed,
    setMood,
    setLightMode,
    setShowGrass,
    cycleSubstrate,
    cycleColor: () => setColorIndex((c) => (c + 1) % AXOLOTL_COLORS.length),
  };
}
