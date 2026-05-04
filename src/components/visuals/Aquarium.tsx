import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { useAquariumLogic } from "../../hooks/useAquariumLogic";

// Components
import AxolotlController from "./Axolotl/AxolotlController.tsx";
import Substrate from "./Environment/Substrate.tsx";
import { BubbleStream } from "./Environment/EnvironmentEffects.tsx";
import Foliage, { type FoliageType } from "./Environment/CreateFoliage.tsx";
import Lighting from "./Environment/Lighting.tsx";

// Types & Styles
import type { AxolotlMood, AxolotlTrick } from "../../types/aquarium.ts";
import "./RainbowButtons.css";

// Logic-based items (Casing fixed to match file system)
import Food from "../Food/food.tsx";
import Treat from "../Food/treat.tsx";

/**
 * Main Aquarium Component
 * Manages the 3D Canvas, UI Overlay, and state for interactions.
 */
export default function Aquarium() {
  // Custom hook containing all the complex logic (color cycles, feeding arrays, light modes)
  const logic = useAquariumLogic();

  // Local UI states
  const [trick, setTrick] = useState<AxolotlTrick>("none");
  const [isPetting, setIsPetting] = useState(false);
  const [foliageStyle, setFoliageStyle] = useState<FoliageType>("seagrass");
  const [petName, setPetName] = useState("");

  // Cycle through plant types: Seagrass -> Kelp -> Vines
  const cycleFoliage = () => {
    const types: FoliageType[] = ["seagrass", "kelp", "vines"];
    const nextIndex = (types.indexOf(foliageStyle) + 1) % types.length;
    setFoliageStyle(types[nextIndex]);
  };

  // Trigger petting animation for 2 seconds
  const handlePetButtonClick = () => {
    setIsPetting(true);
    setTimeout(() => setIsPetting(false), 2000);
  };

  return (
    <div
      className="aquarium-container"
      style={{ background: logic.lightMode === "day" ? "#a2d2ff" : "#023e8a" }}
    >
      <div className="header-container">
        {/* Name Input Section */}
        <div className="title-wrapper">
          <input
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder="Name your Axolotl..."
            className="name-input"
            spellCheck={false}
          />
        </div>

        {/* Interaction Bar */}
        <nav className="top-bar">
          {/* Group 1: Appearance */}
          <div className="nav-group">
            <span className="section-label">AXOLOTL</span>
            <button onClick={logic.cycleColor} className="rainbow-btn btn-red">
              {logic.currentColor.name.toUpperCase()}
            </button>
            <button
              onClick={() =>
                logic.setMood((m: AxolotlMood) =>
                  m === "chill" ? "excited" : "chill",
                )
              }
              className="rainbow-btn btn-orange"
            >
              {logic.mood === "excited" ? "FAST" : "SLOW"}
            </button>
          </div>

          <div className="divider" />

          {/* Group 2: World Settings */}
          <div className="nav-group">
            <span className="section-label">TANK</span>
            <button
              onClick={() =>
                logic.setLightMode((l) => (l === "day" ? "night" : "day"))
              }
              className="rainbow-btn btn-yellow"
            >
              {logic.lightMode === "day" ? "☀️ DAY" : "🌙 NIGHT"}
            </button>
            <button
              onClick={logic.cycleSubstrate}
              className="rainbow-btn btn-green"
            >
              {logic.substrate.toUpperCase()}
            </button>
            <button
              onClick={cycleFoliage}
              className="rainbow-btn btn-teal"
              disabled={!logic.showGrass}
            >
              {logic.showGrass ? foliageStyle.toUpperCase() : "PLANTS OFF"}
            </button>
          </div>

          <div className="divider" />

          {/* Group 3: Tricks (Now with unique colors) */}
          <div className="nav-group">
            <span className="section-label">TRICKS</span>
            <button
              onClick={() => setTrick("barrelRoll")}
              disabled={trick !== "none"}
              className="rainbow-btn btn-blue"
            >
              ROLL
            </button>
            <button
              onClick={() => setTrick("backflip")}
              disabled={trick !== "none"}
              className="rainbow-btn btn-indigo"
            >
              FLIP
            </button>
            <button
              onClick={() => setTrick("spin")}
              disabled={trick !== "none"}
              className="rainbow-btn btn-purple"
            >
              SPIN
            </button>
          </div>

          <div className="divider" />

          {/* Group 4: Interaction */}
          <div className="nav-group">
            <span className="section-label">CARE</span>
            <button
              onClick={handlePetButtonClick}
              className="rainbow-btn btn-pink"
            >
              PET
            </button>
            <button onClick={logic.handleFeed} className="rainbow-btn btn-rose">
              FEED
            </button>
            <button
              onClick={logic.handleDropTreat}
              className="rainbow-btn btn-red"
            >
              TREAT
            </button>
          </div>
        </nav>
      </div>

      {/* 3D Render Engine */}
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 35 }}>
        {/* Environment setup */}
        <Lighting mode={logic.lightMode} />
        <BubbleStream />
        <Substrate type={logic.substrate} />
        <Foliage visible={logic.showGrass} type={foliageStyle} count={14} />

        {/* Dynamic Items mapping */}
        {logic.foods.map((food) => (
          <Food key={food.id} spawnX={0} />
        ))}

        {logic.treats.map((treat) => (
          <Treat key={treat.id} spawnX={0} />
        ))}

        {/* The Main Character */}
        <AxolotlController
          isPetting={isPetting}
          setIsPetting={setIsPetting}
          isFeeding={logic.foods.length > 0 || logic.treats.length > 0}
          colorPalette={logic.currentColor}
          mood={logic.mood}
          trick={trick}
          onTrickComplete={() => setTrick("none")}
        />

        {/* Final touches: Lighting & Shadows */}
        <Environment preset="sunset" />
        <ContactShadows
          position={[0, -2.45, 0]}
          opacity={0.3}
          scale={15}
          blur={2.5}
        />
      </Canvas>
    </div>
  );
}
