import React, { createContext, useContext } from "react";
import { useAquariumLogic } from "../state/useAquariumLogic";

type AquariumContextValue = ReturnType<typeof useAquariumLogic> & {
  updateCustomColor?: (partId: string, value: string) => void;
};

const AquariumContext = createContext<AquariumContextValue | null>(null);

export function AquariumProvider({ children }: { children: React.ReactNode }) {
  const aquarium = useAquariumLogic();

  return (
    // Detailed Comment: Feed the custom state hook object directly down to the consumer branch.
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
