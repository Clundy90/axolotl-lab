import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import AxolotlController from "./Axolotl/AxolotlController";
import Substrate from "./Environment/Substrate";
import { BubbleStream } from "./Environment/EnvironmentEffects";
import Foliage from "./Environment/CreateFoliage";
import Lighting from "./Environment/Lighting";
import Food from "../Food/food";
import Treat from "../Food/treat";
import DecorationLayer from "./Decorations/DecorationLayer";
import BackgroundFishLayer from "./BackgroundFish/BackgroundFishLayer";
import { useAquarium } from "../../context/AquariumContext";
import { useAquariumUi } from "../../context/AquariumUiContext";

export default function AquariumScene() {
  const aquarium = useAquarium();
  const ui = useAquariumUi();

  // Detailed Comment: Manage visibility state locally within the R3F runtime thread
  const [renderFloor, setRenderFloor] = useState<boolean>(true);

  useEffect(() => {
    const handleToggle = (e: Event) => {
      setRenderFloor((e as CustomEvent).detail);
    };
    window.addEventListener("toggle-substrate", handleToggle);
    return () => window.removeEventListener("toggle-substrate", handleToggle);
  }, []);

  return (
    <Canvas shadows camera={{ position: [0, 0.25, 8], fov: 35 }}>
      <Suspense fallback={null}>
        <Lighting mode={aquarium.lightMode} />
        <BubbleStream />
        <BackgroundFishLayer fish={aquarium.backgroundFish} />

        {/* Detailed Comment: Conditionally renders the ground layout geometry based on overlay toggle triggers */}
        {renderFloor && <Substrate type={aquarium.substrate} />}

        <Foliage
          visible={aquarium.showGrass}
          type={ui.foliageStyle}
          count={14}
        />

        <DecorationLayer
          items={aquarium.decorations}
          onMoveDecoration={aquarium.moveDecoration}
          deleteMode={ui.deleteMode}
          onRemoveDecoration={aquarium.removeDecoration}
        />

        <AxolotlController
          isPetting={ui.isPetting}
          setIsPetting={ui.setIsPetting}
          isFeeding={aquarium.foods.length > 0 || aquarium.treats.length > 0}
          snackCount={aquarium.snackCount}
          colorPalette={aquarium.currentColor}
          mood={aquarium.mood}
          trick={ui.trick}
          currentAccessory={aquarium.currentAccessory}
          onTrickComplete={() => ui.setTrick("none")}
        />

        {aquarium.foods.map((food) => (
          <Food
            key={food.id}
            id={food.id}
            spawnX={food.spawnX}
            spawnY={food.spawnY}
            spawnZ={food.spawnZ}
            onConsumed={aquarium.consumeFood}
            onMissed={aquarium.missFood}
          />
        ))}

        {aquarium.treats.map((treat) => (
          <Treat
            key={treat.id}
            id={treat.id}
            spawnX={treat.spawnX}
            spawnY={treat.spawnY}
            spawnZ={treat.spawnZ}
            onConsumed={aquarium.consumeTreat}
            onMissed={aquarium.missTreat}
          />
        ))}

        <Environment preset="sunset" />
        <ContactShadows
          position={[0, -2.45, 0]}
          opacity={0.26}
          scale={14}
          blur={2.8}
        />
      </Suspense>
    </Canvas>
  );
}
