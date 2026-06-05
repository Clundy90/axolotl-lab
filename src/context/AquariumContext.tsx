import React, { createContext, useContext } from "react";
import { useAquariumLogic } from "../hooks/useAquariumLogic";

type AquariumContextValue = ReturnType<typeof useAquariumLogic>;

const AquariumContext = createContext<AquariumContextValue | null>(null);

export function AquariumProvider({ children }: { children: React.ReactNode }) {
  const aquarium = useAquariumLogic();

  return (
    <AquariumContext.Provider value={aquarium}>
      {children}
    </AquariumContext.Provider>
  );
}

export function useAquarium() {
  const aquarium = useContext(AquariumContext);

  if (!aquarium) {
    throw new Error("useAquarium must be used within AquariumProvider");
  }

  return aquarium;
}
