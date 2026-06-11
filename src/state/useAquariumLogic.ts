import { useState, useCallback } from "react";
import type {
  AccessoryType,
  AxolotlMood,
  BackgroundFishType,
  LightMode,
  ColorPalette,
  FeedItem,
  DecorationItem,
  DecorationType,
} from "./aquarium";
import { AXOLOTL_COLORS } from "./colors";
import { SUBSTRATE_TYPES } from "../components/visuals/Environment/Substrate";
import {
  AQUARIUM_BACKGROUNDS,
  type BackgroundOption,
  getBackgroundById,
} from "../components/Background/backgroundTypes";

const BLANK_CUSTOM_PALETTE: ColorPalette = {
  name: "Custom",
  body: "#dfe9ff",
  gills: "#c8d9ff",
  fins: "#eef5ff",
  tail: "#dfe9ff",
  legs: "#dfe9ff",
  toes: "#c0d4ef",
  eyes: "#5a6a8f",
};
import {
  createBackgroundFish,
  createCustomPalette,
  createDecoration,
  getThemePresetIndex,
  MAX_BACKGROUND_FISH,
  MAX_DECORATIONS,
  THEME_PRESETS,
} from "./aquariumState";

/**
 * useAquariumLogic Hook
 * Refined [2026-05-07]
 *
 * Manages the state and business logic for the axolotl sandbox.
 * - Handles modular color updates for specific body parts (fins, toes, gills, etc.)
 * - Manages feeding physics/logic and environmental decorations.
 * - Controls lighting and substrate cycles.
 */
export function useAquariumLogic() {
  // --- FEEDING & MOOD STATE ---
  const [foods, setFoods] = useState<FeedItem[]>([]);
  const [treats, setTreats] = useState<FeedItem[]>([]);
  const [snackCount, setSnackCount] = useState(0);
  const [mood, setMood] = useState<AxolotlMood>("chill");

  // --- ENVIRONMENT STATE ---
  const [lightMode, setLightMode] = useState<LightMode>("day");
  const [showGrass, setShowGrass] = useState(true);
  const [substrate, setSubstrate] =
    useState<keyof typeof SUBSTRATE_TYPES>("gravel");
  const [backgroundTextureId, setBackgroundTextureId] = useState(
    AQUARIUM_BACKGROUNDS[0].id,
  );

  // Decorations collection (furniture and foliage)
  const [decorations, setDecorations] = useState<DecorationItem[]>([]);
  const [backgroundFish, setBackgroundFish] = useState(() => [
    createBackgroundFish("blue"),
    createBackgroundFish("green"),
  ]);
  const [currentAccessory, setCurrentAccessory] =
    useState<AccessoryType | null>(null);

  // --- COLOR & PALETTE STATE ---
  const [colorIndex, setColorIndex] = useState(0);
  const [isCustomPalette, setIsCustomPalette] = useState(false);

  // Initialize custom palette with a neutral base so users can paint from blank
  const [customPalette, setCustomPalette] =
    useState<ColorPalette>(BLANK_CUSTOM_PALETTE);

  // Derived current color based on user selection toggle
  const currentColor: ColorPalette = isCustomPalette
    ? customPalette
    : AXOLOTL_COLORS[colorIndex];
  const currentBackground = getBackgroundById(backgroundTextureId);

  // --- FEEDING LOGIC ---

  /** Generates a new feed item with randomized horizontal drift */
  const nextFeedItem = (spawnY: number): FeedItem => ({
    id: Date.now() + Math.floor(Math.random() * 10000),
    spawnX: (Math.random() - 0.5) * 0.15,
    spawnY,
    spawnZ: 2.0 + (Math.random() - 0.5) * 0.06,
  });

  const handleFeed = useCallback(() => {
    setFoods((prev) => [...prev, nextFeedItem(2.95)]);
  }, []);

  const handleDropTreat = useCallback(() => {
    const newId = nextFeedItem(2.6);
    setTreats((prev) => [...prev, newId]);
    setMood("excited");
    // Revert mood after a short delay
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

  // --- DECORATION LOGIC ---

  /** Adds a new piece of furniture or foliage to the tank */
  const addDecoration = useCallback((type: DecorationType) => {
    setDecorations((prev) => {
      if (prev.length >= MAX_DECORATIONS) return prev;
      return [...prev, createDecoration(type)];
    });
  }, []);

  const addBackgroundFish = useCallback((type: BackgroundFishType) => {
    setBackgroundFish((prev) => {
      if (prev.length >= MAX_BACKGROUND_FISH) return prev;
      return [...prev, createBackgroundFish(type)];
    });
  }, []);

  const removeBackgroundFish = useCallback((id: number) => {
    setBackgroundFish((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const removeLastBackgroundFish = useCallback(() => {
    setBackgroundFish((prev) => prev.slice(0, -1));
  }, []);

  const removeLastDecoration = useCallback(() => {
    setDecorations((prev) => prev.slice(0, -1));
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

  // --- COLOR LOGIC ---

  /** Selects a preset color theme and disables custom overrides */
  const selectColor = useCallback((index: number) => {
    if (index < 0 || index >= AXOLOTL_COLORS.length) return;
    setIsCustomPalette(false);
    setColorIndex(index);
  }, []);

  /**
   * updateCustomPalette
   * Supports specific body part overrides: body, gills, fins, tail, legs, toes, eyes.
   */
  const updateCustomPalette = useCallback(
    (field: keyof Omit<ColorPalette, "name">, value: string) => {
      const basePalette = isCustomPalette
        ? customPalette
        : AXOLOTL_COLORS[colorIndex];
      setCustomPalette(createCustomPalette(basePalette, field, value));
      setIsCustomPalette(true);
    },
    [colorIndex, customPalette, isCustomPalette],
  );

  const selectCustomPalette = useCallback(() => {
    setCustomPalette((prev) =>
      prev.name === "Custom" ? prev : BLANK_CUSTOM_PALETTE,
    );
    setIsCustomPalette(true);
  }, []);

  /** Maps a named theme string to its corresponding index in AXOLOTL_COLORS */
  const applyThemePreset = useCallback(
    (name: (typeof THEME_PRESETS)[number]) => {
      const index = getThemePresetIndex(name);
      if (index < 0) return;
      setColorIndex(index);
      setIsCustomPalette(false);
    },
    [],
  );

  /** Cycles through the available substrate textures */
  const cycleSubstrate = useCallback(() => {
    const keys = Object.keys(
      SUBSTRATE_TYPES,
    ) as (keyof typeof SUBSTRATE_TYPES)[];
    const currentIndex = keys.indexOf(substrate);
    setSubstrate(keys[(currentIndex + 1) % keys.length]);
  }, [substrate]);

  const setBackgroundTexture = useCallback((id: BackgroundOption["id"]) => {
    const nextBackground = getBackgroundById(id);
    setBackgroundTextureId(nextBackground.id);
  }, []);

  return {
    // State
    foods,
    treats,
    decorations,
    backgroundFish,
    currentAccessory,
    snackCount,
    mood,
    lightMode,
    showGrass,
    currentColor,
    currentBackground,
    colorIndex,
    isCustomPalette,
    substrate,

    // Constants / Options
    colorOptions: AXOLOTL_COLORS,
    backgroundOptions: AQUARIUM_BACKGROUNDS,
    themePresets: THEME_PRESETS,
    maxDecorations: MAX_DECORATIONS,
    maxBackgroundFish: MAX_BACKGROUND_FISH,

    // Handlers
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
    addBackgroundFish,
    removeBackgroundFish,
    removeLastBackgroundFish,
    removeLastDecoration,
    moveDecoration,
    removeDecoration,
    setCurrentAccessory,
    cycleSubstrate,
    setBackgroundTexture,
    selectColor,
    updateCustomPalette,
    applyThemePreset,
    selectCustomPalette,

    /** Cycles through presets while disabling custom mode */
    cycleColor: () => {
      setIsCustomPalette(false);
      setColorIndex((c) => (c + 1) % AXOLOTL_COLORS.length);
    },
  };
}
