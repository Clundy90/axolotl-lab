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
import { AXOLOTL_COLORS } from "../constants/colors";
import { SUBSTRATE_TYPES } from "../components/visuals/Environment/Substrate";

const MAX_DECORATIONS = 20;
const FURNITURE_TYPES: DecorationType[] = ["castle", "caveHideout"];
const THEME_PRESETS = ["Bubblegum", "Cosmo", "Deep Sea"] as const;

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

  // Decorations collection (furniture and foliage)
  const [decorations, setDecorations] = useState<DecorationItem[]>([]);

  // --- COLOR & PALETTE STATE ---
  const [colorIndex, setColorIndex] = useState(0);
  const [isCustomPalette, setIsCustomPalette] = useState(false);

  // Initialize custom palette based on the first preset
  const [customPalette, setCustomPalette] = useState<ColorPalette>({
    ...AXOLOTL_COLORS[0],
    name: "Custom",
  });

  // Derived current color based on user selection toggle
  const currentColor: ColorPalette = isCustomPalette
    ? customPalette
    : AXOLOTL_COLORS[colorIndex];

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
      const id = Date.now() + Math.floor(Math.random() * 10000);
      const x = (Math.random() - 0.5) * 7;
      const z = (Math.random() - 0.5) * 4;
      const category: DecorationCategory = FURNITURE_TYPES.includes(type)
        ? "furniture"
        : "decor";

      // Dynamic scaling based on category
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
   * Also handles numeric glowIntensity via the same setter logic.
   */
  const updateCustomPalette = useCallback(
    (field: keyof Omit<ColorPalette, "name">, value: string | number) => {
      setCustomPalette((prev) => ({
        ...prev,
        [field]: value,
        name: "Custom",
      }));
      setIsCustomPalette(true);
    },
    [],
  );

  /** Maps a named theme string to its corresponding index in AXOLOTL_COLORS */
  const applyThemePreset = useCallback(
    (name: (typeof THEME_PRESETS)[number]) => {
      const index = AXOLOTL_COLORS.findIndex((theme) => theme.name === name);
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

  return {
    // State
    foods,
    treats,
    decorations,
    snackCount,
    mood,
    lightMode,
    showGrass,
    currentColor,
    colorIndex,
    isCustomPalette,
    substrate,

    // Constants / Options
    colorOptions: AXOLOTL_COLORS,
    themePresets: THEME_PRESETS,
    maxDecorations: MAX_DECORATIONS,

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
    moveDecoration,
    removeDecoration,
    cycleSubstrate,
    selectColor,
    updateCustomPalette,
    applyThemePreset,

    /** Cycles through presets while disabling custom mode */
    cycleColor: () => {
      setIsCustomPalette(false);
      setColorIndex((c) => (c + 1) % AXOLOTL_COLORS.length);
    },
  };
}
