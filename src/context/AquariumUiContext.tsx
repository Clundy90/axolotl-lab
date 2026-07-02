import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import type { AxolotlTrick, FoliageType } from "../state/aquarium";
import { playTootSound } from "../components/utils/tootSound";

interface AquariumUiContextValue {
  petName: string;
  setPetName: (name: string) => void;
  trick: AxolotlTrick;
  setTrick: (trick: AxolotlTrick) => void;
  isPetting: boolean;
  setIsPetting: (value: boolean) => void;
  deleteMode: boolean;
  setDeleteMode: (value: boolean) => void;
  foliageStyle: FoliageType;
  cycleFoliage: () => void;
  petAxolotl: () => void;
}

const AquariumUiContext = createContext<AquariumUiContextValue | null>(null);

export function AquariumUiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [petName, setPetName] = useState("");
  const [trick, setTrick] = useState<AxolotlTrick>("none");
  const [isPetting, setIsPetting] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [foliageStyle, setFoliageStyle] = useState<FoliageType>("grass");
  const actionReadyAt = useRef<Record<string, number>>({});

  const isActionReady = useCallback((key: string, cooldownMs: number) => {
    const now = performance.now();
    if ((actionReadyAt.current[key] ?? 0) > now) return false;

    actionReadyAt.current[key] = now + cooldownMs;
    return true;
  }, []);

  const triggerTrick = useCallback(
    (nextTrick: AxolotlTrick) => {
      if (nextTrick === "none") {
        setTrick(nextTrick);
        return;
      }

      if (trick !== "none" || !isActionReady("trick", 1500)) return;

      if (nextTrick === "toot") {
        playTootSound();
      }

      setTrick(nextTrick);
    },
    [isActionReady, trick],
  );

  const cycleFoliage = () => {
    if (!isActionReady("foliage", 250)) return;

    const types: FoliageType[] = ["grass", "kelp", "vines"];
    const nextIndex = (types.indexOf(foliageStyle) + 1) % types.length;
    setFoliageStyle(types[nextIndex]);
  };

  const petAxolotl = () => {
    if (!isActionReady("pet", 1500)) return;

    setIsPetting(true);
    window.setTimeout(() => setIsPetting(false), 1500);
  };

  return (
    <AquariumUiContext.Provider
      value={{
        petName,
        setPetName,
        trick,
        setTrick: triggerTrick,
        isPetting,
        setIsPetting,
        deleteMode,
        setDeleteMode,
        foliageStyle,
        cycleFoliage,
        petAxolotl,
      }}
    >
      {children}
    </AquariumUiContext.Provider>
  );
}

export function useAquariumUi() {
  const ui = useContext(AquariumUiContext);

  if (!ui) {
    throw new Error("useAquariumUi must be used within AquariumUiProvider");
  }

  return ui;
}
