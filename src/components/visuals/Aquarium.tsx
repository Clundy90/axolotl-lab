import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { useAquariumLogic } from "../../hooks/useAquariumLogic";
import type { AxolotlTrick, FoliageType } from "../../types/aquarium";
import AxolotlController from "./Axolotl/AxolotlController";
import Substrate from "./Environment/Substrate";
import { BubbleStream } from "./Environment/EnvironmentEffects";
import Foliage from "./Environment/CreateFoliage";
import Lighting from "./Environment/Lighting";
import Food from "../Food/food";
import Treat from "../Food/treat";
import DecorationLayer from "./Decorations/DecorationLayer";
import AquariumControls from "./UI/AquariumControls";
import "./RainbowButtons.css";

export default function Aquarium() {
  const logic = useAquariumLogic();
  const [trick, setTrick] = useState<AxolotlTrick>("none");
  const [isPetting, setIsPetting] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [foliageStyle, setFoliageStyle] = useState<FoliageType>("grass");
  const [petName, setPetName] = useState("Type a name...");

  const cycleFoliage = () => {
    const types: FoliageType[] = ["grass", "kelp", "vines"];
    const nextIndex = (types.indexOf(foliageStyle) + 1) % types.length;
    setFoliageStyle(types[nextIndex]);
  };

  const handlePetButtonClick = () => {
    setIsPetting(true);
    setTimeout(() => setIsPetting(false), 1500);
  };

  return (
    <div
      className="aquarium-container"
      style={{
        background:
          logic.lightMode === "day"
            ? "radial-gradient(circle at 20% 10%, #9de6ff 0%, #5fc4ff 45%, #2f78cc 100%)"
            : "radial-gradient(circle at 25% 8%, #3d5ca8 0%, #1d2e63 55%, #09152f 100%)",
      }}
    >
      <div className="header-container">
        <AquariumControls
          petName={petName}
          setPetName={setPetName}
          mood={logic.mood}
          lightMode={logic.lightMode}
          substrate={logic.substrate}
          foliageStyle={foliageStyle}
          showGrass={logic.showGrass}
          trick={trick}
          canAddDecoration={logic.decorations.length < logic.maxDecorations}
          decorationCount={logic.decorations.length}
          maxDecorations={logic.maxDecorations}
          deleteMode={deleteMode}
          currentColor={logic.currentColor}
          isCustomPalette={logic.isCustomPalette}
          themePresets={logic.themePresets}
          onSetDeleteMode={setDeleteMode}
          onUpdateCustomPalette={logic.updateCustomPalette}
          onSetMood={logic.setMood}
          onToggleLightMode={() =>
            logic.setLightMode((mode) => (mode === "day" ? "night" : "day"))
          }
          onCycleSubstrate={logic.cycleSubstrate}
          onCycleFoliage={cycleFoliage}
          onSetTrick={setTrick}
          onPet={handlePetButtonClick}
          onFeed={logic.handleFeed}
          onTreat={logic.handleDropTreat}
          onApplyThemePreset={(name: string) =>
            logic.applyThemePreset(
              name as Parameters<typeof logic.applyThemePreset>[0],
            )
          }
          onAddDecoration={logic.addDecoration}
        />
      </div>

      <Canvas shadows camera={{ position: [0, 0.25, 8], fov: 35 }}>
        <Lighting mode={logic.lightMode} />
        <BubbleStream />
        <Substrate type={logic.substrate} />
        <Foliage visible={logic.showGrass} type={foliageStyle} count={14} />

        <DecorationLayer
          items={logic.decorations}
          onMoveDecoration={logic.moveDecoration}
          deleteMode={deleteMode}
          onRemoveDecoration={logic.removeDecoration}
        />

        {logic.foods.map((food) => (
          <Food
            key={food.id}
            id={food.id}
            spawnX={food.spawnX}
            spawnY={food.spawnY}
            spawnZ={food.spawnZ}
            onConsumed={logic.consumeFood}
            onMissed={logic.missFood}
          />
        ))}

        {logic.treats.map((treat) => (
          <Treat
            key={treat.id}
            id={treat.id}
            spawnX={treat.spawnX}
            spawnY={treat.spawnY}
            spawnZ={treat.spawnZ}
            onConsumed={logic.consumeTreat}
            onMissed={logic.missTreat}
          />
        ))}

        <AxolotlController
          isPetting={isPetting}
          setIsPetting={setIsPetting}
          isFeeding={logic.foods.length > 0 || logic.treats.length > 0}
          snackCount={logic.snackCount}
          colorPalette={logic.currentColor}
          mood={logic.mood}
          trick={trick}
          onTrickComplete={() => setTrick("none")}
        />

        <Environment preset="sunset" />
        <ContactShadows
          position={[0, -2.45, 0]}
          opacity={0.26}
          scale={14}
          blur={2.8}
        />
      </Canvas>
    </div>
  );
}
