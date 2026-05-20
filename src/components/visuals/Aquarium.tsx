import React, { useState, Suspense } from "react";
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

/**
 * Aquarium Component
 * Refined [2026-05-07]
 * - Orchestrates the 3D scene and the UI overlay.
 * - Bridges the useAquariumLogic hook with the visual controllers.
 * - Handles the granular color palette for the Axolotl (body, gills, fins, etc.)
 */
export default function Aquarium() {
  const logic = useAquariumLogic();

  // Local UI State for animations and view settings
  const [trick, setTrick] = useState<AxolotlTrick>("none");
  const [isPetting, setIsPetting] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [foliageStyle, setFoliageStyle] = useState<FoliageType>("grass");
  const [petName, setPetName] = useState("");

  /** Cycles through available foliage visual styles */
  const cycleFoliage = () => {
    const types: FoliageType[] = ["grass", "kelp", "vines"];
    const nextIndex = (types.indexOf(foliageStyle) + 1) % types.length;
    setFoliageStyle(types[nextIndex]);
  };

  /** Triggers the momentary petting state for the axolotl controller */
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
      {/* UI LAYER: Controls for the Axolotl and Environment */}
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
          // Color & Theme Logic
          currentColor={logic.currentColor}
          isCustomPalette={logic.isCustomPalette}
          themePresets={logic.themePresets}
          // Event Handlers
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
            logic.applyThemePreset(name as any)
          }
          onAddDecoration={logic.addDecoration}
        />
      </div>

      {/* 3D RENDER LAYER: React Three Fiber Canvas */}
      <Canvas shadows camera={{ position: [0, 0.25, 8], fov: 35 }}>
        <Lighting mode={logic.lightMode} />
        <BubbleStream />
        <Substrate type={logic.substrate} />
        <Foliage visible={logic.showGrass} type={foliageStyle} count={14} />

        {/* Suspense Wrap: Prevents Canvas runtime crash during async GLTF asset fetches.
          Kenney 3D models will safely mount here instantly upon resolution.
        */}
        <Suspense fallback={null}>
          {/* Handles placement, movement, and deletion of 3D objects */}
          <DecorationLayer
            items={logic.decorations}
            onMoveDecoration={logic.moveDecoration}
            deleteMode={deleteMode}
            onRemoveDecoration={logic.removeDecoration}
          />
        </Suspense>

        {/* Dynamic Food Items */}
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

        {/* Dynamic Treat Items */}
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

        {/* Main Axolotl Logic and Animation Controller */}
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
