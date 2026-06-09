import React, { createContext, useContext, useState } from "react";
import type { AxolotlTrick, FoliageType } from "../state/aquarium";

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

  const cycleFoliage = () => {
    const types: FoliageType[] = ["grass", "kelp", "vines"];
    const nextIndex = (types.indexOf(foliageStyle) + 1) % types.length;
    setFoliageStyle(types[nextIndex]);
  };

  const petAxolotl = () => {
    setIsPetting(true);
    window.setTimeout(() => setIsPetting(false), 1500);
  };

  return (
    <AquariumUiContext.Provider
      value={{
        petName,
        setPetName,
        trick,
        setTrick,
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
