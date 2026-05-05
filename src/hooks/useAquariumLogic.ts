import { useState, useCallback } from "react";
import type {
  AxolotlMood,
  LightMode,
  ColorPalette,
  FeedItem,
  DecorationItem,
  DecorationCategory,
  DecorationType,
} from "../types/aquarium";
import { AXOLOTL_COLORS } from "../components/visuals/Axolotl/AxolotlStyles";
import { SUBSTRATE_TYPES } from "../components/visuals/Environment/Substrate";

const MAX_DECORATIONS = 20;
const FURNITURE_TYPES: DecorationType[] = ["castle", "caveHideout"];
const THEME_PRESETS = ["Bubblegum", "Cosmo", "Deep Sea"] as const;

/**
 * useAquariumLogic Hook
 * Refined [2026-05-04]
 * - Added dual-feeding logic for standard Food and special Treats.
 * - Ensures mood resets to "chill" to prevent Axolotl from getting stuck.
 */

export function useAquariumLogic() {
  const [foods, setFoods] = useState<FeedItem[]>([]);
  const [treats, setTreats] = useState<FeedItem[]>([]);
  const [snackCount, setSnackCount] = useState(0);
  const [mood, setMood] = useState<AxolotlMood>("chill");
  const [lightMode, setLightMode] = useState<LightMode>("day");
  const [colorIndex, setColorIndex] = useState(0);
  const [isCustomPalette, setIsCustomPalette] = useState(false);
  const [customPalette, setCustomPalette] = useState<ColorPalette>({
    ...AXOLOTL_COLORS[0],
    name: "Custom",
  });
  const [showGrass, setShowGrass] = useState(true);
  const [substrate, setSubstrate] =
    useState<keyof typeof SUBSTRATE_TYPES>("gravel");
  const [decorations, setDecorations] = useState<DecorationItem[]>([
    {
      id: 101,
      type: "shell",
      category: "decor",
      position: [-2.8, -2.22, 1.1],
      scale: 1.05,
    },
    {
      id: 102,
      type: "castle",
      category: "furniture",
      position: [2.4, -2.12, -0.6],
      scale: 1.55,
    },
    {
      id: 103,
      type: "bubbleRing",
      category: "decor",
      position: [0.5, -1.9, 1.6],
      scale: 1.0,
    },
  ]);

  const currentColor: ColorPalette = isCustomPalette
    ? customPalette
    : AXOLOTL_COLORS[colorIndex];
  const nextFeedItem = (spawnY: number): FeedItem => ({
    id: Date.now() + Math.floor(Math.random() * 10000),
    spawnX: (Math.random() - 0.5) * 0.15,
    spawnY,
    spawnZ: 2.0 + (Math.random() - 0.5) * 0.06,
  });

  // Standard feeding: Flakes
  const handleFeed = useCallback(() => {
    setFoods((prev) => [...prev, nextFeedItem(2.95)]);
  }, []);

  // Special feeding: Worm Treat
  const handleDropTreat = useCallback(() => {
    const newId = nextFeedItem(2.6);
    setTreats((prev) => [...prev, newId]);
    setMood("excited");

    // Reset mood to "chill" after 4 seconds to resume normal swimming
    setTimeout(() => setMood("chill"), 4000);
  }, []);

  const consumeFood = useCallback((id: number) => {
    setFoods((prev) => prev.filter((item) => item.id !== id));
    setSnackCount((prev) => prev + 1);
  }, []);

  const consumeTreat = useCallback((id: number) => {
    setTreats((prev) => prev.filter((item) => item.id !== id));
    setMood("excited");
    setSnackCount((prev) => prev + 1);
    setTimeout(() => setMood("chill"), 2500);
  }, []);

  const missFood = useCallback((id: number) => {
    setFoods((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const missTreat = useCallback((id: number) => {
    setTreats((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addDecoration = useCallback((type: DecorationType) => {
    setDecorations((prev) => {
      if (prev.length >= MAX_DECORATIONS) return prev;
      const id = Date.now() + Math.floor(Math.random() * 10000);
      const x = (Math.random() - 0.5) * 7;
      const z = (Math.random() - 0.5) * 4;
      const category: DecorationCategory = FURNITURE_TYPES.includes(type)
        ? "furniture"
        : "decor";
      const scale =
        category === "furniture"
          ? 1.45 + Math.random() * 0.35
          : 0.95 + Math.random() * 0.25;
      return [...prev, { id, type, category, position: [x, -2.2, z], scale }];
    });
  }, []);

  const moveDecoration = useCallback(
    (id: number, position: [number, number, number]) => {
      setDecorations((prev) =>
        prev.map((item) => (item.id === id ? { ...item, position } : item)),
      );
    },
    [],
  );

  const removeDecoration = useCallback((id: number) => {
    setDecorations((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const selectColor = useCallback((index: number) => {
    if (index < 0 || index >= AXOLOTL_COLORS.length) return;
    setIsCustomPalette(false);
    setColorIndex(index);
  }, []);

  const updateCustomPalette = useCallback(
    (field: "main" | "light" | "dark", value: string) => {
      setCustomPalette((prev) => ({ ...prev, [field]: value, name: "Custom" }));
      setIsCustomPalette(true);
    },
    [],
  );

  const applyThemePreset = useCallback((name: (typeof THEME_PRESETS)[number]) => {
    const index = AXOLOTL_COLORS.findIndex((theme) => theme.name === name);
    if (index < 0) return;
    setColorIndex(index);
    setIsCustomPalette(false);
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
    decorations,
    snackCount,
    mood,
    lightMode,
    showGrass,
    currentColor,
    colorOptions: AXOLOTL_COLORS,
    themePresets: THEME_PRESETS,
    colorIndex,
    maxDecorations: MAX_DECORATIONS,
    isCustomPalette,
    substrate,
    handleFeed,
    handleDropTreat,
    setMood,
    setLightMode,
    setShowGrass,
    consumeFood,
    consumeTreat,
    missFood,
    missTreat,
    addDecoration,
    moveDecoration,
    removeDecoration,
    cycleSubstrate,
    selectColor,
    updateCustomPalette,
    applyThemePreset,
    cycleColor: () => setColorIndex((c) => (c + 1) % AXOLOTL_COLORS.length),
  };
}
